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

// ────────────────────────────────────────────────────────────
// OVERVIEW PANEL  — pinned message, always edited in-place
// ────────────────────────────────────────────────────────────

export function renderOverviewPanel(scene, guildState, settings, vote = null, lastDec = null) {
  // Status badge
  let statusLine;
  if (!settings.active)     statusLine = '🔴 **Geschichte nicht gestartet**';
  else if (settings.paused) statusLine = '⏸️ **Geschichte pausiert**';
  else if (vote)            statusLine = `🗳️ **Abstimmung läuft** — endet <t:${Math.floor(vote.ends_at / 1000)}:R>`;
  else                      statusLine = '▶️ **Geschichte aktiv**';

  // Progress bar
  const totalChapters = 2;
  const filled = Math.min(scene.chapter, totalChapters);
  const bar = '█'.repeat(filled) + '░'.repeat(Math.max(0, totalChapters - filled));
  const progressLine = `Fortschritt: \`${bar}\` Kapitel ${scene.chapter} / ${totalChapters}`;

  // Active story flags mapped to readable labels
  const flags = guildState.story_flags || {};
  const flagLabels = {
    chose_control:      '🖥️ Kontrollraum gesichert',
    chose_archive:      '📂 Archiv untersucht',
    power_restored:     '⚡ Notstrom aktiviert',
    stayed_dark:        '🌑 Im Dunkeln geblieben',
    has_records:        '📋 Akten gesichert',
    traced_symbol:      '🔍 Symbol zurückverfolgt',
    alert_triggered:    '🚨 Sicherheitsalarm aktiv',
    defensive_posture:  '🛡️ Defensive Position',
    followed_whispers:  '👂 Stimmen gefolgt',
    fortified:          '🔒 Position befestigt',
    synced_core:        '✅ Kern synchronisiert',
    sabotaged_core:     '💥 Kern sabotiert',
    negotiated:         '🤝 Verhandlung angenommen',
    rejected_parley:    '❌ Kontakt abgebrochen',
    breakout_attempted: '⚔️ Ausbruch gewagt',
    opened_channel:     '📡 Kanal geöffnet',
  };
  const activeFlags = Object.keys(flags)
    .filter(k => flags[k] && flagLabels[k])
    .map(k => flagLabels[k]);
  const flagsLine = activeFlags.length
    ? `**Entscheidungs-Flags:**\n${activeFlags.map(f => `> ${f}`).join('\n')}`
    : '**Entscheidungs-Flags:** — keine gesetzt';

  // Last decision
  const lastDecLine = lastDec
    ? `**Letzte Entscheidung:** ${lastDec.option_label} *(${lastDec.votes} Stimmen, <t:${Math.floor(lastDec.decided_at / 1000)}:R>)*`
    : '**Letzte Entscheidung:** —';

  // Next event
  const nextLine = settings.next_event_ts
    ? `**Nächstes Event:** <t:${Math.floor(settings.next_event_ts / 1000)}:R>`
    : '**Nächstes Event:** —';

  // Live vote tally
  let voteTallyBlock = '';
  if (vote) {
    const voteMap = typeof vote.votes === 'string' ? JSON.parse(vote.votes) : (vote.votes || {});
    const tally   = {};
    for (const oid of Object.values(voteMap)) tally[oid] = (tally[oid] || 0) + 1;
    const total = Object.values(tally).reduce((a, b) => a + b, 0);
    voteTallyBlock = `\n\n**Stimmen (${total} gesamt):**\n` +
      Object.entries(tally).map(([k, v]) => `> \`${k}\`: ${v}`).join('\n');
  }

  const container = new ContainerBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent('# 📖 NexuRealms — Story-Übersicht'),
    )
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        [statusLine, progressLine, '', `**Aktuelles Kapitel:** ${scene.chapter}`, `**Aktuelle Szene:** \`${scene.id}\` — ${scene.title}`, '', lastDecLine, nextLine].join('\n')
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
// persist=true so the DB variant-history is updated on real scene posts
// ────────────────────────────────────────────────────────────

export function renderSceneMessage(scene, guildState, voteEndsAt = null) {
  // persist=true — this is the real scene post, variant history should be saved
  const body = generateSceneText(scene, guildState, true);

  let footerText;
  if (scene.ending) {
    footerText = '📖 **Ende dieses Story-Zweigs**\nAdmins können die Story mit `/story reset` neu starten.';
  } else if (voteEndsAt) {
    footerText = `🗳️ **Entscheidung** — Stimmt bis <t:${Math.floor(voteEndsAt / 1000)}:R> ab.\n*Jedes Mitglied hat genau eine Stimme.*`;
  } else {
    footerText = '⌛ Die nächste Szene wird automatisch ausgelöst.';
  }

  const container = new ContainerBuilder()
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`# ${scene.title}`))
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(body))
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(footerText));

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

  return { flags: MessageFlags.IsComponentsV2, components: [container, ...rows] };
}

// ────────────────────────────────────────────────────────────
// INFO MESSAGE  — used for slash command replies
// ────────────────────────────────────────────────────────────

export function renderInfoMessage(title, lines = []) {
  const container = new ContainerBuilder()
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`# ${title}`))
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(lines.join('\n')));

  return { flags: MessageFlags.IsComponentsV2, components: [container] };
}

// Backwards-compatible alias
export { renderSceneMessage as renderStoryMessage };
