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
  setGuildUniverse,
  setNextEventTs,
  setOverviewMsgId,
  setSceneMsgId,
  setStoryFlag,
  updateGuildScene,
} from '../database/db.js';
import { t } from '../utils/i18n.js';
import { pickRandomUniverse } from '../story/universes.js';
import { getScene, UNIVERSE_START_SCENES } from '../story/scenes/index.js';
import { renderOverviewPanel, renderSceneMessage } from './renderer.js';
import logger from '../utils/logger.js';

const VOTE_DURATION_MS = 5 * 60 * 1000;

// ────────────────────────────────────────────────────────────
// OVERVIEW PANEL
// ────────────────────────────────────────────────────────────

export async function upsertOverviewPanel(client, guildId) {
  const settings = getGuildSettings(guildId);
  if (!settings.channel_id) return;

  const state = getGuildState(guildId);
  const scene = getScene(state.current_scene_id);
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

export async function startStoryForGuild(client, guildId) {
  const settings = getGuildSettings(guildId);
  if (!settings.channel_id) throw new Error('Kein Story-Kanal konfiguriert. Nutze /setup channel.');

  let universe = settings.universe;
  if (!universe) {
    universe = pickRandomUniverse();
    setGuildUniverse(guildId, universe);
  }

  const startSceneId = UNIVERSE_START_SCENES[universe];
  if (!startSceneId) throw new Error(`Kein Start für Universum: ${universe}`);

  updateGuildScene(guildId, startSceneId, 1);
  setGuildActive(guildId, true);
  setGuildPaused(guildId, false);

  const scene = getScene(startSceneId);
  if (!scene) throw new Error(`Start-Szene nicht gefunden: ${startSceneId}`);

  scheduleNext(getGuildSettings(guildId), guildId);

  await upsertOverviewPanel(client, guildId);
  await postScene(client, guildId, settings.channel_id, scene);
}

export async function postScene(client, guildId, channelId, scene) {
  const settings   = getGuildSettings(guildId);
  const guildState = getGuildState(guildId);
  const lang       = settings.language || 'de';

  // Discover characters — resolve bilingual fields
  for (const char of (scene.discoverCharacters || [])) {
    addCharacter(
      guildId,
      t(char.name, lang),
      t(char.role, lang),
      t(char.faction, lang),
      t(char.description, lang),
      scene.id,
    );
  }

  const channel = await client.channels.fetch(channelId);
  const endsAt  = scene.options?.length ? Date.now() + VOTE_DURATION_MS : null;
  // Pass lang so renderer resolves all bilingual labels correctly
  const payload = renderSceneMessage(scene, guildState, endsAt, lang);

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

  await upsertOverviewPanel(client, guildId).catch(() => null);
  logger.info(`Posted scene ${scene.id} to guild ${guildId} (universe: ${settings.universe})`);
}

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

  let winningOption = scene.options[0];
  let highest = -1;
  for (const option of scene.options) {
    const count = tally[option.id] || 0;
    if (count > highest) { winningOption = option; highest = count; }
  }

  const settings = getGuildSettings(voteRow.guild_id);
  const lang     = settings.language || 'de';
  const label    = t(winningOption.label, lang);

  saveDecision(voteRow.guild_id, scene.id, winningOption.id, label, Math.max(0, highest));

  for (const [flag, value] of Object.entries(winningOption.setFlags || {})) {
    setStoryFlag(voteRow.guild_id, flag, value);
  }

  // Disable vote buttons on scene message, mark winner green
  if (settings.scene_msg_id && settings.channel_id) {
    try {
      const channel  = await client.channels.fetch(settings.channel_id);
      const sceneMsg = await channel.messages.fetch(settings.scene_msg_id);

      const disabledRows = scene.options.reduce((rows, opt, i) => {
        const rowIdx   = Math.floor(i / 5);
        if (!rows[rowIdx]) rows[rowIdx] = new ActionRowBuilder();
        const isWinner = opt.id === winningOption.id;
        const optLabel = t(opt.label, lang);
        rows[rowIdx].addComponents(
          new ButtonBuilder()
            .setCustomId(`storyvote:${scene.id}:${opt.id}`)
            .setLabel(isWinner ? `✅ ${optLabel} (${Math.max(0, highest)})` : optLabel)
            .setStyle(isWinner ? ButtonStyle.Success : ButtonStyle.Secondary)
            .setDisabled(true),
        );
        return rows;
      }, []);

      const stateForRender = getGuildState(voteRow.guild_id);
      const closedPayload  = renderSceneMessage(scene, stateForRender, null, lang);
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

  const freshSettings = getGuildSettings(voteRow.guild_id);

  if (nextScene.ending) {
    await postEndingScene(client, voteRow.guild_id, freshSettings.channel_id, nextScene, lang);
  } else if (freshSettings.active && !freshSettings.paused && freshSettings.channel_id) {
    scheduleNext(freshSettings, voteRow.guild_id);
    await postScene(client, voteRow.guild_id, freshSettings.channel_id, nextScene);
  } else {
    await upsertOverviewPanel(client, voteRow.guild_id).catch(() => null);
  }

  logger.info(`Resolved vote for guild ${voteRow.guild_id}: ${winningOption.id} wins.`);
}

// ────────────────────────────────────────────────────────────
// ENDING
// ────────────────────────────────────────────────────────────

async function postEndingScene(client, guildId, channelId, scene, lang) {
  const channel = await client.channels.fetch(channelId);
  const de      = lang === 'de';
  const endText = t(scene.endingText, lang) || t(scene.baseText, lang);
  const title   = t(scene.title, lang);

  await channel.send({
    embeds: [{
      title,
      description: endText,
      color: 0xf4c542,
      footer: {
        text: de
          ? 'Die Geschichte ist abgeschlossen. Starte neu mit /story start.'
          : 'The story is complete. Restart with /story start.',
      },
    }],
  });

  setGuildActive(guildId, false);
  await upsertOverviewPanel(client, guildId).catch(() => null);
  logger.info(`Story ended for guild ${guildId} — ending: ${scene.endingType}`);
}

// ────────────────────────────────────────────────────────────
// SCHEDULER
// ────────────────────────────────────────────────────────────

export function scheduleNext(settings, guildId) {
  const nextTs = Date.now() + (settings.interval_mins * 60 * 1000);
  setNextEventTs(guildId, nextTs);
}
