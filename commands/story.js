import {
  SlashCommandBuilder,
  PermissionFlagsBits,
} from 'discord.js';
import {
  getGuildSettings,
  getGuildState,
  resetGuildState,
  setGuildPaused,
} from '../database/db.js';
import { renderInfoMessage } from '../services/renderer.js';
import { startStoryForGuild } from '../services/storyService.js';

export default {
  data: new SlashCommandBuilder()
    .setName('story')
    .setDescription('Story-System verwalten')
    .addSubcommand(sub =>
      sub.setName('status').setDescription('Aktuellen Story-Stand anzeigen'),
    )
    .addSubcommand(sub =>
      sub
        .setName('start')
        .setDescription('Story starten oder fortsetzen')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    )
    .addSubcommand(sub =>
      sub
        .setName('pause')
        .setDescription('Story pausieren')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    )
    .addSubcommand(sub =>
      sub
        .setName('reset')
        .setDescription('Story vollständig zurücksetzen')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    ),

  async execute(interaction, client) {
    const sub = interaction.options.getSubcommand();

    if (sub === 'status') {
      const settings = getGuildSettings(interaction.guildId);
      const state = getGuildState(interaction.guildId);
      return interaction.reply(renderInfoMessage('Story-Status', [
        `📚 **Kapitel:** ${state.chapter}`,
        `🎬 **Aktuelle Szene:** \`${state.current_scene_id}\``,
        `⚙️ **Aktiv:** ${settings.active ? 'Ja' : 'Nein'}`,
        `⏸️ **Pausiert:** ${settings.paused ? 'Ja' : 'Nein'}`,
        `🕒 **Nächstes Event:** ${settings.next_event_ts ? `<t:${Math.floor(settings.next_event_ts / 1000)}:R>` : 'Nicht geplant'}`,
        `📌 **Story-Kanal:** ${settings.channel_id ? `<#${settings.channel_id}>` : 'Nicht konfiguriert'}`,
      ]));
    }

    if (sub === 'start') {
      await interaction.deferReply();
      try {
        await startStoryForGuild(client, interaction.guildId);
        return interaction.editReply(renderInfoMessage('Story gestartet', [
          '▶️ Die Geschichte wurde gestartet oder fortgesetzt.',
          'Schaut in den konfigurierten Story-Kanal!',
        ]));
      } catch (err) {
        return interaction.editReply(renderInfoMessage('Fehler', [
          `❌ ${err.message}`,
        ]));
      }
    }

    if (sub === 'pause') {
      setGuildPaused(interaction.guildId, true);
      return interaction.reply(renderInfoMessage('Story pausiert', [
        '⏸️ Automatische Story-Events wurden pausiert.',
        'Verwende `/story start` um fortzufahren.',
      ]));
    }

    if (sub === 'reset') {
      resetGuildState(interaction.guildId);
      return interaction.reply(renderInfoMessage('Story zurückgesetzt', [
        '🔄 Der gesamte Story-Fortschritt dieses Servers wurde gelöscht.',
        'Verwende `/story start` um eine neue Geschichte zu beginnen.',
      ]));
    }
  },
};
