import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  MessageFlags,
  SeparatorBuilder,
  TextDisplayBuilder,
} from 'discord.js';
import { generateSceneText } from './textEngine.js';

/**
 * renderStoryMessage
 * Builds a full Discord Components V2 message payload for a scene.
 *
 * @param {object}      scene       – Scene node
 * @param {object}      guildState  – Current guild state
 * @param {number|null} voteEndsAt  – Epoch ms when vote expires (null if no vote)
 * @returns {object} discord.js message options with Components V2 flag
 */
export function renderStoryMessage(scene, guildState, voteEndsAt = null) {
  const body = generateSceneText(scene, guildState);

  let footerText;
  if (scene.ending) {
    footerText = '📖 **Ende dieses Story-Zweigs**\nDieser Abschnitt schließt einen möglichen Verlauf der Geschichte ab.';
  } else if (voteEndsAt) {
    footerText = `⏳ **Abstimmung läuft**\nStimmt bis <t:${Math.floor(voteEndsAt / 1000)}:R> ab.`;
  } else {
    footerText = '⌛ **Kein aktives Event**\nDie nächste Szene wird automatisch ausgespielt.';
  }

  const container = new ContainerBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(`# ${scene.title}`),
    )
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(body),
    )
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(footerText),
    );

  const rows = [];
  if (scene.options?.length) {
    for (let i = 0; i < scene.options.length; i += 5) {
      const row = new ActionRowBuilder();
      for (const opt of scene.options.slice(i, i + 5)) {
        row.addComponents(
          new ButtonBuilder()
            .setCustomId(`storyvote:${scene.id}:${opt.id}`)
            .setLabel(opt.label)
            .setStyle(ButtonStyle.Primary),
        );
      }
      rows.push(row);
    }
  }

  return {
    flags: MessageFlags.IsComponentsV2,
    components: [container, ...rows],
  };
}

/**
 * renderInfoMessage
 * Builds a simple Components V2 info/status message.
 */
export function renderInfoMessage(title, lines = []) {
  const container = new ContainerBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(`# ${title}`),
    )
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(lines.join('\n')),
    );

  return {
    flags: MessageFlags.IsComponentsV2,
    components: [container],
  };
}
