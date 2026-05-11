import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from 'discord.js';
import {
  addCharacter,
  createVote,
  deleteActiveVote,
  getActiveVote,
  getDecisions,
  getGuildSettings,
  getGuildState,
  saveDecision,
  setGuildActive,
  setGuildPaused,
  setNextEventTs,
  setOverviewMsgId,
  setSceneMsgId,
  setStoryFlag,
  updateGuildScene,
} from '../database/db.js';
import { characters as allCharacters } from '../story/characters.js';
import { getScene } from '../story/scenes.js';
import { renderOverviewPanel, renderSceneMessage } from './renderer.js';
import logger from '../utils/logger.js';

const VOTE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

// ────────────────────────────────────────────────────────────
// OVERVIEW PANEL
// ────────────────────────────────────────────────────────────

/**
 * upsertOverviewPanel
 * Always edits the stored overview message in-place.
 * Falls back to creating + pinning a new one if it was deleted.
 * Always reads FRESH settings from DB so timestamps are current.
 */
export async function upsertOverviewPanel(client, guildId) {
  // Re-read settings fresh every time so next_event_ts is up to date
  const settings = getGuildSettings(guildId);
  if (!settings.channel_id) return;

  const state    = getGuildState(guildId);
  const scene    = getScene(state.current_scene_id);
  if (!scene) return;

  const vote      = getActiveVote(guildId);
  const decisions = getDecisions(guildId, 1);
  const lastDec   = decisions[0] || null;
  const payload   = renderOverviewPanel(scene, state, settings, vote, lastDec);

  const channel = await client.channels.fetch(settings.channel_id);

  if (settings.overview_msg_id) {
    try {
      const existing = await channel.messages.fetch(settings.overview_msg_id);
      await existing.edit(payload);
      return;
    } catch {
      // Message was deleted — fall through to create a new one
    }
  }

  const msg = await channel.send(payload);
  await msg.pin().catch(() => null);
  setOverviewMsgId(guildId, msg.id);
}

// ────────────────────────────────────────────────────────────
// STORY FLOW
// ────────────────────────────────────────────────────────────

/**
 * startStoryForGuild
 * Activates the story, posts/updates overview + first scene.
 */
export async function startStoryForGuild(client, guildId) {
  const settings = getGuildSettings(guildId);
  if (!settings.channel_id) throw new Error('Kein Story-Kanal konfiguriert. Nutze /setup channel.');

  setGuildActive(guildId, true);
  setGuildPaused(guildId, false);

  const state = getGuildState(guildId);
  const scene = getScene(state.current_scene_id);
  if (!scene) throw new Error(`Szene nicht gefunden: ${state.current_scene_id}`);

  // Schedule BEFORE overview render so the timestamp is visible
  scheduleNext(getGuildSettings(guildId), guildId);

  // 1. Overview panel (pinned, always at top)
  await upsertOverviewPanel(client, guildId);

  // 2. Scene message with vote buttons below
  await postScene(client, guildId, settings.channel_id, scene);
}

/**
 * postScene
 * Deletes the previous scene message, sends a new one with vote buttons,
 * then refreshes the overview panel.
 */
export async function postScene(client, guildId, channelId, scene) {
  // Re-read fresh settings to get latest scene_msg_id
  const settings   = getGuildSettings(guildId);
  const guildState = getGuildState(guildId);

  // Discover characters
  for (const name of scene.discoverCharacters || []) {
    const char = allCharacters.find(c => c.name === name);
    if (char) addCharacter(guildId, char.name, char.role, char.faction, char.description, scene.id);
  }

  const channel = await client.channels.fetch(channelId);
  const endsAt  = scene.options?.length ? Date.now() + VOTE_DURATION_MS : null;
  const payload = renderSceneMessage(scene, guildState, endsAt);

  // Delete previous scene message (keeps channel clean)
  if (settings.scene_msg_id) {
    try {
      const old = await channel.messages.fetch(settings.scene_msg_id);
      await old.delete();
    } catch { /* already deleted */ }
  }

  const message = await channel.send(payload);
  setSceneMsgId(guildId, message.id);

  if (scene.options?.length && endsAt) {
    createVote(guildId, scene.id, message.id, channel.id, endsAt);
  }

  // Refresh overview AFTER scene is posted and vote is created
  await upsertOverviewPanel(client, guildId).catch(() => null);

  logger.info(`Posted scene ${scene.id} to guild ${guildId}`);
}

/**
 * resolveVoteForGuild
 * Tallies votes, disables buttons on scene message, advances story.
 * All discord.js classes are imported at the top — no dynamic imports.
 */
export async function resolveVoteForGuild(client, voteRow) {
  const scene = getScene(voteRow.scene_id);
  if (!scene || !scene.options?.length) {
    deleteActiveVote(voteRow.guild_id);
    return;
  }

  const votes = typeof voteRow.votes === 'string'
    ? JSON.parse(voteRow.votes)
    : (voteRow.votes || {});

  const tally = {};
  for (const optionId of Object.values(votes)) {
    tally[optionId] = (tally[optionId] || 0) + 1;
  }

  // Determine winner; fallback to first option if nobody voted
  let winningOption = scene.options[0];
  let highest = -1;
  for (const option of scene.options) {
    const count = tally[option.id] || 0;
    if (count > highest) { winningOption = option; highest = count; }
  }

  saveDecision(voteRow.guild_id, scene.id, winningOption.id, winningOption.label, Math.max(0, highest));

  for (const [flag, value] of Object.entries(winningOption.setFlags || {})) {
    setStoryFlag(voteRow.guild_id, flag, value);
  }

  // Re-read settings FRESH before any channel operations
  const settings = getGuildSettings(voteRow.guild_id);

  // Disable all vote buttons on the scene message (mark winner green)
  if (settings.scene_msg_id && settings.channel_id) {
    try {
      const channel  = await client.channels.fetch(settings.channel_id);
      const sceneMsg = await channel.messages.fetch(settings.scene_msg_id);

      const disabledRows = scene.options.reduce((rows, opt, i) => {
        const rowIdx = Math.floor(i / 5);
        if (!rows[rowIdx]) rows[rowIdx] = new ActionRowBuilder();
        const isWinner = opt.id === winningOption.id;
        rows[rowIdx].addComponents(
          new ButtonBuilder()
            .setCustomId(`storyvote:${scene.id}:${opt.id}`)
            .setLabel(isWinner ? `✅ ${opt.label}` : opt.label)
            .setStyle(isWinner ? ButtonStyle.Success : ButtonStyle.Secondary)
            .setDisabled(true),
        );
        return rows;
      }, []);

      const stateForRender = getGuildState(voteRow.guild_id);
      const closedPayload  = renderSceneMessage(scene, stateForRender, null);

      // Replace action rows with disabled ones
      closedPayload.components = [
        ...closedPayload.components.filter(c => !(c instanceof ActionRowBuilder)),
        ...disabledRows,
      ];
      await sceneMsg.edit(closedPayload);
    } catch (err) {
      logger.warn(`Could not disable vote buttons for guild ${voteRow.guild_id}: ${err.message}`);
    }
  }

  const nextScene = getScene(winningOption.nextSceneId);
  if (!nextScene) {
    deleteActiveVote(voteRow.guild_id);
    await upsertOverviewPanel(client, voteRow.guild_id).catch(() => null);
    return;
  }

  updateGuildScene(voteRow.guild_id, nextScene.id, nextScene.chapter);
  deleteActiveVote(voteRow.guild_id);

  // Re-read settings one more time after all DB writes
  const freshSettings = getGuildSettings(voteRow.guild_id);

  if (freshSettings.active && !freshSettings.paused && freshSettings.channel_id) {
    // Schedule next event BEFORE posting so overview shows correct time
    scheduleNext(freshSettings, voteRow.guild_id);
    await postScene(client, voteRow.guild_id, freshSettings.channel_id, nextScene);
  } else {
    await upsertOverviewPanel(client, voteRow.guild_id).catch(() => null);
  }

  logger.info(`Resolved vote for guild ${voteRow.guild_id}: ${winningOption.id} wins.`);
}

/**
 * scheduleNext — stores next event timestamp in DB.
 */
export function scheduleNext(settings, guildId) {
  const nextTs = Date.now() + (settings.interval_mins * 60 * 1000);
  setNextEventTs(guildId, nextTs);
}
