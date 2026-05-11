import { REST, Routes } from 'discord.js';
import { config } from 'dotenv';
import { readdirSync } from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join } from 'path';

config();

const __dirname = dirname(fileURLToPath(import.meta.url));

const commands = [];
const commandsPath = join(__dirname, '..', 'commands');

for (const file of readdirSync(commandsPath).filter(f => f.endsWith('.js'))) {
  const mod = await import(pathToFileURL(join(commandsPath, file)).href);
  if (mod.default?.data) commands.push(mod.default.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

const target = process.env.GUILD_ID
  ? Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID)
  : Routes.applicationCommands(process.env.CLIENT_ID);

try {
  await rest.put(target, { body: commands });
  console.log(`Successfully registered ${commands.length} slash commands.`);
} catch (err) {
  console.error('Failed to register commands:', err);
  process.exit(1);
}
