import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { config } from 'dotenv';
import { readdirSync } from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join } from 'path';
import { initDatabase } from '../database/db.js';
import { initScheduler } from '../services/scheduler.js';
import logger from '../utils/logger.js';

config();

const __dirname = dirname(fileURLToPath(import.meta.url));

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ],
});

client.commands = new Collection();

// Load all commands
const commandsPath = join(__dirname, '..', 'commands');
for (const file of readdirSync(commandsPath).filter(f => f.endsWith('.js'))) {
  const mod = await import(pathToFileURL(join(commandsPath, file)).href);
  const cmd = mod.default;
  if (cmd?.data?.name) {
    client.commands.set(cmd.data.name, cmd);
    logger.info(`Loaded command: ${cmd.data.name}`);
  }
}

// Load all events
const eventsPath = join(__dirname, '..', 'events');
for (const file of readdirSync(eventsPath).filter(f => f.endsWith('.js'))) {
  const mod = await import(pathToFileURL(join(eventsPath, file)).href);
  const event = mod.default;
  if (event?.name) {
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
    logger.info(`Loaded event: ${event.name}`);
  }
}

// Initialise database, then login
initDatabase();
logger.info('Database initialised.');

client.login(process.env.DISCORD_TOKEN).then(() => {
  initScheduler(client);
});
