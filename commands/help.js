import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getGuildSettings } from '../database/db.js';

export default {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Zeigt alle Befehle und den Kerngedanken von NexusRealms.'),

  async execute(interaction) {
    const settings = getGuildSettings(interaction.guildId);
    const lang     = settings?.language || 'de';
    const de       = lang === 'de';

    const embed = new EmbedBuilder()
      .setColor(0x4f98a3)
      .setTitle(de ? '🌐 NexusRealms — Hilfe' : '🌐 NexusRealms — Help')
      .setDescription(
        de
          ? [
              '**NexusRealms** ist ein server-weiter Storytelling-Bot.',
              'Eure gesamte Community entscheidet gemeinsam über den Verlauf einer epischen Geschichte — durch Abstimmungen, die in regelmäßigen Abständen stattfinden.',
              '',
              'Jede Entscheidung prägt die Welt. Jede Wahl zählt.',
              'Vom gefallenen Königreich Aethoria über die Leere der Voidborn-Dimension bis zum geheimnisvollen Nexus — **ihr schreibt die Geschichte.**',
            ].join('\n')
          : [
              '**NexusRealms** is a server-wide storytelling bot.',
              'Your entire community votes together on the outcome of an epic story — through polls that happen at regular intervals.',
              '',
              'Every decision shapes the world. Every choice counts.',
              'From the fallen kingdom of Aethoria to the void of the Voidborn dimension and the mysterious Nexus — **you write the story.**',
            ].join('\n'),
      )
      .addFields(
        {
          name: de ? '🔧 Einrichtung' : '🔧 Setup',
          value: [
            '`/setup channel` — ' + (de ? 'Story-Kanal festlegen' : 'Set the story channel'),
            '`/setup language` — ' + (de ? 'Sprache wählen (de/en)' : 'Choose language (de/en)'),
            '`/setup interval` — ' + (de ? 'Abstimmungsintervall in Minuten' : 'Vote interval in minutes'),
          ].join('\n'),
          inline: false,
        },
        {
          name: de ? '📚 Geschichte' : '📚 Story',
          value: [
            '`/story start`  — ' + (de ? 'Geschichte starten' : 'Start the story'),
            '`/story pause`  — ' + (de ? 'Geschichte pausieren' : 'Pause the story'),
            '`/story resume` — ' + (de ? 'Geschichte fortsetzen' : 'Resume the story'),
            '`/story reset`  — ' + (de ? 'Geschichte zurücksetzen' : 'Reset the story'),
            '`/story status` — ' + (de ? 'Aktuellen Status anzeigen' : 'Show current status'),
          ].join('\n'),
          inline: false,
        },
        {
          name: de ? '👥 Figuren & Verlauf' : '👥 Characters & History',
          value: [
            '`/characters` — ' + (de ? 'Entdeckte Charaktere anzeigen' : 'Show discovered characters'),
            '`/history`    — ' + (de ? 'Bisherige Entscheidungen anzeigen' : 'Show past decisions'),
            '`/nextevent`  — ' + (de ? 'Zeit bis zur nächsten Abstimmung' : 'Time until next vote'),
          ].join('\n'),
          inline: false,
        },
        {
          name: de ? '🌌 Universen' : '🌌 Universes',
          value: [
            '🌐 **Nexus** — ' + (de ? 'Der Ursprung aller Realitäten' : 'The origin of all realities'),
            '✨ **Aethoria** — ' + (de ? 'Das gefallene Magie-Königreich' : 'The fallen magic kingdom'),
            '🔥 **Ashfall** — ' + (de ? 'Post-apokalyptische Überlebenswelt' : 'Post-apocalyptic survival world'),
            '🌑 **Voidborn** — ' + (de ? 'Die Leere zwischen den Welten' : 'The void between worlds'),
            '👻 **Specter** — ' + (de ? 'Schatten und unsterbliche Erinnerungen' : 'Shadows and undying memories'),
          ].join('\n'),
          inline: false,
        },
      )
      .setFooter({
        text: de
          ? 'NexusRealms • Eure Geschichte. Eure Entscheidungen.'
          : 'NexusRealms • Your story. Your decisions.',
      });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
