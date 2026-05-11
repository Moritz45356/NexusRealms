import { SlashCommandBuilder } from 'discord.js';
import { getGuildSettings } from '../database/db.js';
import { renderInfoMessage } from '../services/renderer.js';

export default {
  data: new SlashCommandBuilder()
    .setName('nextevent')
    .setDescription('Zeigt den Zeitpunkt des nächsten Story-Events'),

  async execute(interaction) {
    const settings = getGuildSettings(interaction.guildId);
    return interaction.reply(renderInfoMessage('Nächstes Event', [
      settings.next_event_ts
        ? `🕒 Das nächste Story-Event ist geplant für <t:${Math.floor(settings.next_event_ts / 1000)}:F>.`
        : 'ℹ️ Aktuell ist kein nächstes Story-Event geplant.',
    ]));
  },
};
