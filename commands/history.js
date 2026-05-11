import { SlashCommandBuilder } from 'discord.js';
import { getDecisions } from '../database/db.js';
import { renderInfoMessage } from '../services/renderer.js';

export default {
  data: new SlashCommandBuilder()
    .setName('history')
    .setDescription('Zeigt die wichtigsten vergangenen Story-Entscheidungen'),

  async execute(interaction) {
    const decisions = getDecisions(interaction.guildId, 10);

    if (!decisions.length) {
      return interaction.reply({
        ...renderInfoMessage('Entscheidungsverlauf', [
          'Bisher wurden noch keine Entscheidungen für diesen Server gespeichert.',
        ]),
        ephemeral: true,
      });
    }

    const lines = decisions.map((d, i) => {
      const ts = `<t:${Math.floor(d.decided_at / 1000)}:R>`;
      return `${i + 1}. **${d.option_label}** *(${d.scene_id})* — ${d.votes} Stimmen · ${ts}`;
    });

    return interaction.reply({
      ...renderInfoMessage('Entscheidungsverlauf', lines),
      ephemeral: true,
    });
  },
};
