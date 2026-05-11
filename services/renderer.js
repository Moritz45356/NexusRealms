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
import { t } from '../utils/i18n.js';

// ────────────────────────────────────────────────────────────
// OVERVIEW PANEL  — pinned message, always edited in-place
// ────────────────────────────────────────────────────────────

export function renderOverviewPanel(scene, guildState, settings, vote = null, lastDec = null) {
  const lang = settings?.language || 'de';
  const de   = lang === 'de';

  // Status badge
  let statusLine;
  if (!settings.active)     statusLine = de ? '🔴 **Geschichte nicht gestartet**'  : '🔴 **Story not started**';
  else if (settings.paused) statusLine = de ? '⏸️ **Geschichte pausiert**'          : '⏸️ **Story paused**';
  else if (vote)            statusLine = `🗳️ **${de ? 'Abstimmung läuft' : 'Vote running'}** — endet <t:${Math.floor(vote.ends_at / 1000)}:R>`;
  else                      statusLine = de ? '▶️ **Geschichte aktiv**'              : '▶️ **Story active**';

  // Progress bar
  const totalChapters = 5;
  const filled  = Math.min(scene.chapter, totalChapters);
  const bar     = '█'.repeat(filled) + '░'.repeat(Math.max(0, totalChapters - filled));
  const progressLine = `${de ? 'Fortschritt' : 'Progress'}: \`${bar}\` ${de ? 'Kapitel' : 'Chapter'} ${scene.chapter} / ${totalChapters}`;

  // Resolve bilingual scene title
  const sceneTitle = t(scene.title, lang);

  // Story flags
  const flags = typeof guildState.story_flags === 'string'
    ? JSON.parse(guildState.story_flags || '{}')
    : (guildState.story_flags || {});

  const flagLabels = de ? {
    chose_core:         '🌀 In den Kern vorgedrungen',
    chose_bridge:       '🌉 Brücke überquert',
    analyzed_fragment:  '🔬 Fragment analysiert',
    fed_archive:        '📂 Ins Archiv eingespeist',
    trusted_kairo:      '🤝 Kairo vertraut',
    captured_kairo:     '⛓️ Kairo gefangen',
    infiltrated_lab:    '🥷 Labor infiltriert',
    warned_keepers:     '📣 Hüter gewarnt',
    freed_entity:       '🔓 Eingesperrtes befreit',
    resealed:           '🔒 Versiegelung verstärkt',
    kairo_ally:         '🤝 Kairo als Verbündeter',
    kairo_prisoner:     '⛓️ Kairo als Gefangener',
    stopped_lyra:       '⚔️ Lyra aufgehalten',
    heard_lyra:         '👂 Lyra angehört',
    rallied_council:    '🏛️ Rat geeint',
    acted_alone:        '🦅 Allein gehandelt',
    accepted_knowledge: '📖 Uraltes Wissen angenommen',
    refused_knowledge:  '🚫 Wissen abgelehnt',
  } : {
    chose_core:         '🌀 Advanced into the core',
    chose_bridge:       '🌉 Crossed the bridge',
    analyzed_fragment:  '🔬 Fragment analyzed',
    fed_archive:        '📂 Fed into archive',
    trusted_kairo:      '🤝 Trusted Kairo',
    captured_kairo:     '⛓️ Captured Kairo',
    infiltrated_lab:    '🥷 Infiltrated the lab',
    warned_keepers:     '📣 Warned the Keepers',
    freed_entity:       '🔓 Freed the imprisoned',
    resealed:           '🔒 Reinforced the seal',
    kairo_ally:         '🤝 Kairo as ally',
    kairo_prisoner:     '⛓️ Kairo as prisoner',
    stopped_lyra:       '⚔️ Stopped Lyra',
    heard_lyra:         '👂 Heard Lyra out',
    rallied_council:    '🏛️ United the council',
    acted_alone:        '🦅 Acted alone',
    accepted_knowledge: '📖 Accepted ancient knowledge',
    refused_knowledge:  '🚫 Refused knowledge',
  };

  const activeFlags = Object.keys(flags)
    .filter(k => flags[k] && flagLabels[k])
    .map(k => flagLabels[k]);
  const flagsLine = activeFlags.length
    ? `**${de ? 'Entscheidungs-Flags' : 'Decision Flags'}:**\n${activeFlags.map(f => `> ${f}`).join('\n')}`
    : `**${de ? 'Entscheidungs-Flags' : 'Decision Flags'}:** — ${de ? 'keine gesetzt' : 'none set'}`;

  // Last decision
  const lastDecLine = lastDec
    ? `**${de ? 'Letzte Entscheidung' : 'Last Decision'}:** ${lastDec.option_label} *(${lastDec.votes} ${de ? 'Stimmen' : 'votes'}, <t:${Math.floor(lastDec.decided_at / 1000)}:R>)*`
    : `**${de ? 'Letzte Entscheidung' : 'Last Decision'}:** —`;

  // Next event
  const nextLine = settings.next_event_ts
    ? `**${de ? 'Nächstes Event' : 'Next Event'}:** <t:${Math.floor(settings.next_event_ts / 1000)}:R>`
    : `**${de ? 'Nächstes Event' : 'Next Event'}:** —`;

  // Live vote tally
  let voteTallyBlock = '';
  if (vote) {
    const voteMap = typeof vote.votes === 'string' ? JSON.parse(vote.votes) : (vote.votes || {});
    const tally   = {};
    for (const oid of Object.values(voteMap)) tally[oid] = (tally[oid] || 0) + 1;
    const total = Object.values(tally).reduce((a, b) => a + b, 0);
    voteTallyBlock = `\n\n**${de ? 'Stimmen' : 'Votes'} (${total} ${de ? 'gesamt' : 'total'}):**\n` +
      Object.entries(tally).map(([k, v]) => `> \`${k}\`: ${v}`).join('\n');
  }

  const container = new ContainerBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(`# 📖 NexusRealms — ${de ? 'Story-Übersicht' : 'Story Overview'}`),
    )
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        [
          statusLine,
          progressLine,
          '',
          `**${de ? 'Aktuelles Kapitel' : 'Current Chapter'}:** ${scene.chapter}`,
          `**${de ? 'Aktuelle Szene'    : 'Current Scene'}:** \`${scene.id}\` — ${sceneTitle}`,
          '',
          lastDecLine,
          nextLine,
        ].join('\n'),
      ),
    )
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(flagsLine + voteTallyBlock),
    );

  return { flags: MessageFlags.IsComponentsV2, components: [container] };
}

// ────────────────────────────────────────────────────────────
// SCENE MESSAGE  — new message per scene, with vote buttons
// ────────────────────────────────────────────────────────────

export function renderSceneMessage(scene, guildState, voteEndsAt = null, lang = 'de') {
  const de         = lang === 'de';
  const body       = generateSceneText(scene, guildState, lang, true);
  const sceneTitle = t(scene.title, lang);

  let footerText;
  if (scene.ending) {
    footerText = de
      ? '📖 **Ende dieses Story-Zweigs**\nAdmins können die Story mit `/story reset` neu starten.'
      : '📖 **End of this story branch**\nAdmins can restart with `/story reset`.';
  } else if (voteEndsAt) {
    footerText = de
      ? `🗳️ **Entscheidung** — Stimmt bis <t:${Math.floor(voteEndsAt / 1000)}:R> ab.\n*Jedes Mitglied hat genau eine Stimme.*`
      : `🗳️ **Decision** — Vote until <t:${Math.floor(voteEndsAt / 1000)}:R>.\n*Each member has exactly one vote.*`;
  } else {
    footerText = de
      ? '⌛ Die nächste Szene wird automatisch ausgelöst.'
      : '⌛ The next scene will be triggered automatically.';
  }

  const container = new ContainerBuilder()
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`# ${sceneTitle}`))
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(body))
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(footerText));

  const rows = [];
  if (scene.options?.length) {
    for (let i = 0; i < scene.options.length; i += 5) {
      const row = new ActionRowBuilder();
      for (const opt of scene.options.slice(i, i + 5)) {
        // t() resolves { de, en } → plain string — required by ButtonBuilder
        const label = t(opt.label, lang);
        row.addComponents(
          new ButtonBuilder()
            .setCustomId(`storyvote:${scene.id}:${opt.id}`)
            .setLabel(label)
            .setStyle(ButtonStyle.Primary),
        );
      }
      rows.push(row);
    }
  }

  return { flags: MessageFlags.IsComponentsV2, components: [container, ...rows] };
}

// ────────────────────────────────────────────────────────────
// INFO MESSAGE  — used for slash command replies (ephemeral)
// ────────────────────────────────────────────────────────────

export function renderInfoMessage(title, lines = []) {
  const container = new ContainerBuilder()
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`# ${title}`))
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(lines.join('\n')));

  return { flags: MessageFlags.IsComponentsV2, components: [container] };
}

export { renderSceneMessage as renderStoryMessage };
