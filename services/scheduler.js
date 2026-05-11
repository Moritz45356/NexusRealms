import { getExpiredVotes } from '../database/db.js';
import { resolveVoteForGuild } from './storyService.js';
import logger from '../utils/logger.js';

let started = false;

/**
 * initScheduler
 * Starts a polling loop that resolves expired votes every 15 seconds.
 */
export function initScheduler(client) {
  if (started) return;
  started = true;

  setInterval(async () => {
    try {
      const expired = getExpiredVotes();
      for (const vote of expired) {
        await resolveVoteForGuild(client, vote);
      }
    } catch (err) {
      logger.error('Scheduler loop failed', err);
    }
  }, 15_000);

  logger.info('Scheduler initialised — polling every 15 seconds.');
}
