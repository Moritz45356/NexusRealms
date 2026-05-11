import { SlashCommandBuilder } from 'discord.js';
import { getActiveVote, getGuildSettings } from '../database/db.js';
import { renderInfoMessage } from '../services/renderer.js';

export default {
  data: new SlashCommandBuilder()
    .setName('nextevent')
    .setDescription('Zeigt wann das nächste Story-Event stattfindet'),

  async execute(interaction) {
    const settings = getGuildSettings(interaction.guildId);
    const vote     = getActiveVote(interaction.guildId);

    const lines = [];

    if (vote) {
      lines.push(`🗳️ **Abstimmung läuft** — endet <t:${Math.floor(vote.ends_at / 1000)}:R>`);
      lines.push('Stimme jetzt ab, um die Story zu beeinflussen!');
    } else if (!settings.active) {
      lines.push('🔴 Die Story ist nicht aktiv.');
      lines.push('Ein Admin kann sie mit `/story start` starten.');
    } else if (settings.paused) {
      lines.push('⏸️ Die Story ist pausiert.');
      lines.push('Ein Admin kann sie mit `/story resume` fortsetzen.');
    } else if (settings.next_event_ts) {
      lines.push(`⏳ Nächstes automatisches Event: <t:${Math.floor(settings.next_event_ts / 1000)}:R>`);
    } else {
      lines.push('❓ Kein Event geplant. Wende dich an einen Admin.');
    }

    return interaction.reply({
      ...renderInfoMessage('📅 Nächstes Event', lines),
      ephemeral: true,
    });
  },
};
