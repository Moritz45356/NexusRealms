import {
  getAllActiveGuilds,
  getExpiredVotes,
  getGuildState,
  updateGuildScene,
} from '../database/db.js';
import { postScene, resolveVoteForGuild, scheduleNext } from './storyService.js';
import { getScene } from '../story/scenes.js';
import logger from '../utils/logger.js';

let started = false;

/**
 * initScheduler
 * Must be called AFTER the discord.js ready event so the channel cache is warm.
 *
 * Loop 1 — every 15 s : resolve expired votes
 * Loop 2 — every 30 s : auto-advance scenes that have no vote options
 */
export function initScheduler(client) {
  if (started) return;
  started = true;

  // ── Loop 1: resolve expired votes ──────────────────────────────
  setInterval(async () => {
    try {
      const expired = getExpiredVotes();
      for (const vote of expired) {
        await resolveVoteForGuild(client, vote);
      }
    } catch (err) {
      logger.error('Vote resolution loop failed', err);
    }
  }, 15_000);

  // ── Loop 2: auto-advance scenes without vote options ──────────────
  setInterval(async () => {
    try {
      const guilds = getAllActiveGuilds();
      const now    = Date.now();

      for (const g of guilds) {
        if (!g.next_event_ts || g.next_event_ts > now) continue;

        const state = getGuildState(g.guild_id);
        const scene = getScene(state.current_scene_id);

        // Only auto-advance narration scenes (no vote options)
        if (!scene || scene.options?.length || scene.ending) continue;

        const nextId = scene.autoNextSceneId;
        if (!nextId) continue;

        const nextScene = getScene(nextId);
        if (!nextScene) continue;

        // All imports are top-level — no dynamic imports needed
        updateGuildScene(g.guild_id, nextScene.id, nextScene.chapter);
        scheduleNext(g, g.guild_id);
        await postScene(client, g.guild_id, g.channel_id, nextScene);

        logger.info(`Auto-advanced guild ${g.guild_id} → ${nextScene.id}`);
      }
    } catch (err) {
      logger.error('Auto-advance loop failed', err);
    }
  }, 30_000);

  logger.info('Scheduler initialised (vote: 15 s, auto-advance: 30 s).');
}
