import { SlashCommandBuilder } from 'discord.js';
import { getCharacters } from '../database/db.js';
import { renderInfoMessage } from '../services/renderer.js';

export default {
  data: new SlashCommandBuilder()
    .setName('characters')
    .setDescription('Zeigt bekannte Charaktere und Fraktionen'),

  async execute(interaction) {
    const chars = getCharacters(interaction.guildId);

    if (!chars.length) {
      return interaction.reply({
        ...renderInfoMessage('Bekannte Charaktere', [
          'Noch keine Charaktere oder Fraktionen entdeckt.',
          'Sie werden aufgedeckt, sobald ihr in der Story auf sie trefft.',
        ]),
        ephemeral: true,
      });
    }

    const lines = chars.flatMap(c => [
      `## ${c.name}`,
      `**Rolle:** ${c.role}  |  **Fraktion:** ${c.faction || 'Unbekannt'}`,
      c.description ?? '',
      '',
    ]);

    return interaction.reply({
      ...renderInfoMessage('Bekannte Charaktere & Fraktionen', lines),
      ephemeral: true,
    });
  },
};
