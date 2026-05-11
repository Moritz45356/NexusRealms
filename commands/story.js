import {
  SlashCommandBuilder,
  PermissionFlagsBits,
} from 'discord.js';
import {
  getActiveVote,
  getGuildSettings,
  getGuildState,
  resetGuildState,
  setGuildPaused,
} from '../database/db.js';
import { renderInfoMessage } from '../services/renderer.js';
import {
  startStoryForGuild,
  upsertOverviewPanel,
} from '../services/storyService.js';

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
        .setName('resume')
        .setDescription('Pausierte Story fortsetzen')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    )
    .addSubcommand(sub =>
      sub
        .setName('reset')
        .setDescription('Story vollständig zurücksetzen')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    )
    .addSubcommand(sub =>
      sub
        .setName('panel')
        .setDescription('Übersichts-Panel neu erstellen (falls gelöscht)')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    ),

  async execute(interaction, client) {
    const sub = interaction.options.getSubcommand();

    // ── /story status ──────────────────────────────────────────
    if (sub === 'status') {
      const settings = getGuildSettings(interaction.guildId);
      const state    = getGuildState(interaction.guildId);
      const vote     = getActiveVote(interaction.guildId);
      return interaction.reply({
        ...renderInfoMessage('📖 Story-Status', [
          `📚 **Kapitel:** ${state.chapter}`,
          `🎬 **Aktuelle Szene:** \`${state.current_scene_id}\``,
          `⚙️ **Aktiv:** ${settings.active ? 'Ja ✅' : 'Nein ❌'}`,
          `⏸️ **Pausiert:** ${settings.paused ? 'Ja' : 'Nein'}`,
          `🗳️ **Aktive Abstimmung:** ${vote ? `Ja (endet <t:${Math.floor(vote.ends_at / 1000)}:R>)` : 'Nein'}`,
          `🕒 **Nächstes Event:** ${settings.next_event_ts ? `<t:${Math.floor(settings.next_event_ts / 1000)}:R>` : 'Nicht geplant'}`,
          `📌 **Story-Kanal:** ${settings.channel_id ? `<#${settings.channel_id}>` : 'Nicht konfiguriert'}`,
        ]),
        ephemeral: true,
      });
    }

    // ── /story start ───────────────────────────────────────────
    if (sub === 'start') {
      await interaction.deferReply({ ephemeral: true });
      try {
        await startStoryForGuild(client, interaction.guildId);
        return interaction.editReply(renderInfoMessage('✅ Story gestartet', [
          '▶️ Die Geschichte wurde gestartet oder fortgesetzt.',
          'Das Übersichts-Panel und die erste Szene sind im Story-Kanal.',
        ]));
      } catch (err) {
        return interaction.editReply(renderInfoMessage('❌ Fehler', [
          err.message,
        ]));
      }
    }

    // ── /story pause ───────────────────────────────────────────
    if (sub === 'pause') {
      setGuildPaused(interaction.guildId, true);
      await upsertOverviewPanel(client, interaction.guildId).catch(() => null);
      return interaction.reply({
        ...renderInfoMessage('⏸️ Story pausiert', [
          'Automatische Story-Events wurden pausiert.',
          'Verwende `/story resume` um fortzufahren.',
        ]),
        ephemeral: true,
      });
    }

    // ── /story resume ──────────────────────────────────────────
    if (sub === 'resume') {
      setGuildPaused(interaction.guildId, false);
      await upsertOverviewPanel(client, interaction.guildId).catch(() => null);
      return interaction.reply({
        ...renderInfoMessage('▶️ Story fortgesetzt', [
          'Die Story läuft wieder.',
        ]),
        ephemeral: true,
      });
    }

    // ── /story reset ───────────────────────────────────────────
    if (sub === 'reset') {
      resetGuildState(interaction.guildId);
      return interaction.reply({
        ...renderInfoMessage('🔄 Story zurückgesetzt', [
          'Der gesamte Story-Fortschritt dieses Servers wurde gelöscht.',
          'Verwende `/story start` um eine neue Geschichte zu beginnen.',
        ]),
        ephemeral: true,
      });
    }

    // ── /story panel ───────────────────────────────────────────
    if (sub === 'panel') {
      await interaction.deferReply({ ephemeral: true });
      try {
        // Force re-creation by clearing stored message ID
        const { setOverviewMsgId } = await import('../database/db.js');
        setOverviewMsgId(interaction.guildId, null);
        await upsertOverviewPanel(client, interaction.guildId);
        return interaction.editReply(renderInfoMessage('✅ Panel erstellt', [
          'Das Übersichts-Panel wurde neu erstellt und angeheftet.',
        ]));
      } catch (err) {
        return interaction.editReply(renderInfoMessage('❌ Fehler', [
          err.message,
        ]));
      }
    }
  },
};
