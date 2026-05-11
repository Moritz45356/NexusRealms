import {
  addCharacter,
  createVote,
  deleteActiveVote,
  getGuildSettings,
  getGuildState,
  saveDecision,
  setGuildActive,
  setGuildPaused,
  setNextEventTs,
  setStoryFlag,
  updateGuildScene,
} from '../database/db.js';
import { characters as allCharacters } from '../story/characters.js';
import { getScene } from '../story/scenes.js';
import { renderStoryMessage } from './renderer.js';
import logger from '../utils/logger.js';

const VOTE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

/**
 * startStoryForGuild
 * Marks a guild active and posts the current scene.
 */
export async function startStoryForGuild(client, guildId) {
  const settings = getGuildSettings(guildId);
  if (!settings.channel_id) throw new Error('No story channel configured. Use /setup channel first.');

  setGuildActive(guildId, true);
  setGuildPaused(guildId, false);

  const state = getGuildState(guildId);
  const scene = getScene(state.current_scene_id);
  if (!scene) throw new Error(`Scene not found: ${state.current_scene_id}`);

  await postScene(client, guildId, settings.channel_id, scene);
  scheduleNext(settings, guildId);
}

/**
 * postScene
 * Sends a scene to the guild's story channel and creates a vote if needed.
 */
export async function postScene(client, guildId, channelId, scene) {
  const guildState = getGuildState(guildId);

  // Register newly encountered characters
  for (const name of scene.discoverCharacters || []) {
    const char = allCharacters.find(c => c.name === name);
    if (char) addCharacter(guildId, char.name, char.role, char.faction, char.description, scene.id);
  }

  const channel = await client.channels.fetch(channelId);
  const endsAt = scene.options?.length ? Date.now() + VOTE_DURATION_MS : null;
  const payload = renderStoryMessage(scene, guildState, endsAt);
  const message = await channel.send(payload);

  if (scene.options?.length && endsAt) {
    createVote(guildId, scene.id, message.id, channel.id, endsAt);
  }

  logger.info(`Posted scene ${scene.id} to guild ${guildId}`);
}

/**
 * resolveVoteForGuild
 * Tallies votes, advances the story to the winning option's next scene.
 */
export async function resolveVoteForGuild(client, voteRow) {
  const scene = getScene(voteRow.scene_id);
  if (!scene || !scene.options?.length) {
    deleteActiveVote(voteRow.guild_id);
    return;
  }

  const votes = typeof voteRow.votes === 'string' ? JSON.parse(voteRow.votes) : (voteRow.votes || {});
  const tally = {};
  for (const optionId of Object.values(votes)) {
    tally[optionId] = (tally[optionId] || 0) + 1;
  }

  // Determine winner; fall back to first option if no votes cast
  let winningOption = scene.options[0];
  let highest = -1;
  for (const option of scene.options) {
    const count = tally[option.id] || 0;
    if (count > highest) {
      winningOption = option;
      highest = count;
    }
  }

  saveDecision(voteRow.guild_id, scene.id, winningOption.id, winningOption.label, Math.max(0, highest));

  for (const [flag, value] of Object.entries(winningOption.setFlags || {})) {
    setStoryFlag(voteRow.guild_id, flag, value);
  }

  const nextScene = getScene(winningOption.nextSceneId);
  if (!nextScene) {
    deleteActiveVote(voteRow.guild_id);
    return;
  }

  updateGuildScene(voteRow.guild_id, nextScene.id, nextScene.chapter);
  deleteActiveVote(voteRow.guild_id);

  const settings = getGuildSettings(voteRow.guild_id);
  if (settings.active && !settings.paused && settings.channel_id) {
    await postScene(client, voteRow.guild_id, settings.channel_id, nextScene);
    scheduleNext(settings, voteRow.guild_id);
  }

  logger.info(`Resolved vote for guild ${voteRow.guild_id}: ${winningOption.id} wins.`);
}

/**
 * scheduleNext
 * Sets the timestamp for the next automatic story event.
 */
export function scheduleNext(settings, guildId) {
  const nextTs = Date.now() + (settings.interval_mins * 60 * 1000);
  setNextEventTs(guildId, nextTs);
}
