import {
  SlashCommandBuilder,
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  MessageFlags,
} from 'discord.js';
import { getGuildSettings } from '../database/db.js';

export default {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Zeigt alle Befehle und den Kerngedanken von NexusRealms.'),

  async execute(interaction) {
    const settings = getGuildSettings(interaction.guildId);
    const lang     = settings?.language || 'de';
    const de       = lang === 'de';

    const intro = de
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
        ].join('\n');

    const setupBlock = de
      ? '`/setup channel`  — Story-Kanal festlegen\n`/setup language` — Sprache wählen (de/en)\n`/setup interval` — Abstimmungsintervall in Minuten'
      : '`/setup channel`  — Set the story channel\n`/setup language` — Choose language (de/en)\n`/setup interval` — Vote interval in minutes';

    const storyBlock = de
      ? '`/story start`  — Geschichte starten\n`/story pause`  — Geschichte pausieren\n`/story resume` — Geschichte fortsetzen\n`/story reset`  — Geschichte zurücksetzen\n`/story status` — Aktuellen Status anzeigen'
      : '`/story start`  — Start the story\n`/story pause`  — Pause the story\n`/story resume` — Resume the story\n`/story reset`  — Reset the story\n`/story status` — Show current status';

    const extrasBlock = de
      ? '`/characters` — Entdeckte Charaktere anzeigen\n`/history`    — Bisherige Entscheidungen anzeigen\n`/nextevent`  — Zeit bis zur nächsten Abstimmung'
      : '`/characters` — Show discovered characters\n`/history`    — Show past decisions\n`/nextevent`  — Time until next vote';

    const universesBlock = [
      '🌐 **Nexus**    — ' + (de ? 'Der Ursprung aller Realitäten'          : 'The origin of all realities'),
      '✨ **Aethoria** — ' + (de ? 'Das gefallene Magie-Königreich'         : 'The fallen magic kingdom'),
      '🔥 **Ashfall**  — ' + (de ? 'Post-apokalyptische Überlebenswelt'     : 'Post-apocalyptic survival world'),
      '🌑 **Voidborn** — ' + (de ? 'Die Leere zwischen den Welten'           : 'The void between worlds'),
      '👻 **Specter**  — ' + (de ? 'Schatten und unsterbliche Erinnerungen'  : 'Shadows and undying memories'),
    ].join('\n');

    const container = new ContainerBuilder()
      // Header
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(`# 🌐 NexusRealms — ${de ? 'Hilfe' : 'Help'}`),
      )
      .addSeparatorComponents(new SeparatorBuilder())
      // Concept
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(intro),
      )
      .addSeparatorComponents(new SeparatorBuilder())
      // Setup commands
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(`### 🔧 ${de ? 'Einrichtung' : 'Setup'}\n${setupBlock}`),
      )
      .addSeparatorComponents(new SeparatorBuilder())
      // Story commands
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(`### 📚 ${de ? 'Geschichte' : 'Story'}\n${storyBlock}`),
      )
      .addSeparatorComponents(new SeparatorBuilder())
      // Extra commands
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(`### 👥 ${de ? 'Figuren & Verlauf' : 'Characters & History'}\n${extrasBlock}`),
      )
      .addSeparatorComponents(new SeparatorBuilder())
      // Universes
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(`### 🌌 ${de ? 'Universen' : 'Universes'}\n${universesBlock}`),
      )
      .addSeparatorComponents(new SeparatorBuilder())
      // Footer
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `-# NexusRealms • ${de ? 'Eure Geschichte. Eure Entscheidungen.' : 'Your story. Your decisions.'}`,
        ),
      );

    await interaction.reply({
      flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
      components: [container],
    });
  },
};
