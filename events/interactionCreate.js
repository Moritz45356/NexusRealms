import { castVote, getActiveVote } from '../database/db.js';
import { renderInfoMessage } from '../services/renderer.js';
import { upsertOverviewPanel } from '../services/storyService.js';
import logger from '../utils/logger.js';

export default {
  name: 'interactionCreate',
  async execute(interaction, client) {
    try {
      // ── Slash Commands ────────────────────────────────────────
      if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;
        await command.execute(interaction, client);
        return;
      }

      // ── Button Interactions (story votes) ────────────────────
      if (interaction.isButton()) {
        if (!interaction.customId.startsWith('storyvote:')) return;

        const [, sceneId, optionId] = interaction.customId.split(':');
        const active = getActiveVote(interaction.guildId);

        // Vote no longer active
        if (!active || active.scene_id !== sceneId) {
          return interaction.reply({
            ...renderInfoMessage('Abstimmung beendet', [
              '⏹️ Diese Entscheidung ist nicht mehr aktiv.',
              'Die Abstimmung wurde bereits ausgewertet.',
            ]),
            ephemeral: true,
          });
        }

        // Check if user already voted
        const votes = typeof active.votes === 'string'
          ? JSON.parse(active.votes)
          : (active.votes || {});

        if (votes[interaction.user.id]) {
          const alreadyLabel = votes[interaction.user.id];
          return interaction.reply({
            ...renderInfoMessage('Bereits abgestimmt', [
              `🗳️ Du hast bereits für **${alreadyLabel}** gestimmt.`,
              'Jedes Mitglied hat genau eine Stimme und kann sie nicht ändern.',
            ]),
            ephemeral: true,
          });
        }

        // Find option label for the confirmation message
        const { getScene } = await import('../story/scenes.js');
        const scene = getScene(sceneId);
        const option = scene?.options?.find(o => o.id === optionId);
        const optLabel = option?.label ?? optionId;

        castVote(interaction.guildId, interaction.user.id, optionId);

        // Refresh overview panel so live tally updates immediately
        upsertOverviewPanel(client, interaction.guildId).catch(() => null);

        return interaction.reply({
          ...renderInfoMessage('Stimme gezählt', [
            `✅ Deine Stimme für **${optLabel}** wurde gezählt.`,
            'Du kannst deine Stimme nicht mehr ändern.',
          ]),
          ephemeral: true,
        });
      }
    } catch (err) {
      logger.error('Interaction handling failed', err);
      const errPayload = {
        ...renderInfoMessage('Interner Fehler', [
          '❌ Beim Verarbeiten dieser Aktion ist ein Fehler aufgetreten.',
          'Bitte versuche es erneut oder wende dich an einen Admin.',
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
