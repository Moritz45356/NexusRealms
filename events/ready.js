import { initScheduler } from '../services/scheduler.js';
import logger from '../utils/logger.js';

export default {
  name: 'ready',
  once: true,
  async execute(client) {
    logger.info(`✅ Logged in as ${client.user.tag} | Serving ${client.guilds.cache.size} guild(s).`);
    // Start scheduler here — channel cache is guaranteed to be populated
    initScheduler(client);
    logger.info('Scheduler started after ready event.');
  },
};
