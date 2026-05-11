import { castVote, getActiveVote } from '../database/db.js';
import { renderInfoMessage } from '../services/renderer.js';
import logger from '../utils/logger.js';

export default {
  name: 'interactionCreate',
  async execute(interaction, client) {
    try {
      // ── Slash Commands
      if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;
        await command.execute(interaction, client);
        return;
      }

      // ── Button Interactions (story votes)
      if (interaction.isButton()) {
        if (!interaction.customId.startsWith('storyvote:')) return;

        const [, sceneId, optionId] = interaction.customId.split(':');
        const active = getActiveVote(interaction.guildId);

        if (!active || active.scene_id !== sceneId) {
          return interaction.reply({
            ...renderInfoMessage('Abstimmung beendet', [
              'Diese Entscheidung ist nicht mehr aktiv.',
            ]),
            ephemeral: true,
          });
        }

        castVote(interaction.guildId, interaction.user.id, optionId);

        return interaction.reply({
          ...renderInfoMessage('Stimme gezählt', [
            `✅ Deine Stimme für diese Entscheidung wurde gezählt.`,
            'Du kannst deine Stimme nicht mehr ändern.',
          ]),
          ephemeral: true,
        });
      }
    } catch (err) {
      logger.error('Interaction handling failed', err);
      const errPayload = {
        ...renderInfoMessage('Interner Fehler', [
          'Beim Verarbeiten dieser Aktion ist ein Fehler aufgetreten.',
        ]),
        ephemeral: true,
      };
      if (interaction.deferred || interaction.replied) {
        await interaction.followUp(errPayload).catch(() => null);
      } else {
        await interaction.reply(errPayload).catch(() => null);
      }
    }
  },
};
