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

// ─────────────────────────────────────────────────────────────
// OVERVIEW PANEL  (pinned message, always edited in-place)
// Shows: story title, chapter, scene, flags, last decision,
//        next event countdown, vote status.
// ─────────────────────────────────────────────────────────────

/**
 * renderOverviewPanel
 * Builds the persistent top-of-channel overview message.
 *
 * @param {object} scene        – Current scene node
 * @param {object} guildState   – Guild state row from DB
 * @param {object} settings     – Guild settings row from DB
 * @param {object|null} vote    – Active vote row (or null)
 * @param {object|null} lastDec – Last story_decisions row (or null)
 * @returns {object} Components V2 message options
 */
export function renderOverviewPanel(scene, guildState, settings, vote = null, lastDec = null) {
  // ── Status badge ──
  let statusLine;
  if (!settings.active)       statusLine = '🔴 **Geschichte nicht gestartet**';
  else if (settings.paused)   statusLine = '⏸️ **Geschichte pausiert**';
  else if (vote)              statusLine = `🗳️ **Abstimmung läuft** — endet <t:${Math.floor(vote.ends_at / 1000)}:R>`;
  else                        statusLine = '▶️ **Geschichte aktiv**';

  // ── Progress bar (chapter / total chapters = 2) ──
  const totalChapters = 2;
  const filled = Math.min(scene.chapter, totalChapters);
  const bar = '█'.repeat(filled) + '░'.repeat(totalChapters - filled);
  const progressLine = `Fortschritt: \`${bar}\` Kapitel ${scene.chapter} / ${totalChapters}`;

  // ── Active flags (only show meaningful ones) ──
  const flags = guildState.story_flags || {};
  const flagLabels = {
    chose_control:     '🖥️ Kontrollraum gesichert',
    chose_archive:     '📂 Archiv untersucht',
    power_restored:    '⚡ Notstrom aktiviert',
    stayed_dark:       '🌑 Im Dunkeln geblieben',
    has_records:       '📋 Akten gesichert',
    traced_symbol:     '🔍 Symbol zurückverfolgt',
    alert_triggered:   '🚨 Sicherheitsalarm aktiv',
    defensive_posture: '🛡️ Defensive Position',
    followed_whispers: '👂 Stimmen gefolgt',
    fortified:         '🔒 Position befestigt',
    synced_core:       '✅ Kern synchronisiert',
    sabotaged_core:    '💥 Kern sabotiert',
    negotiated:        '🤝 Verhandlung angenommen',
    rejected_parley:   '❌ Kontakt abgebrochen',
    breakout_attempted:'⚔️ Ausbruch gewagt',
    opened_channel:    '📡 Kanal geöffnet',
  };
  const activeFlags = Object.keys(flags)
    .filter(k => flags[k] && flagLabels[k])
    .map(k => flagLabels[k]);
  const flagsLine = activeFlags.length
    ? `**Entscheidungs-Flags:**\n${activeFlags.map(f => `> ${f}`).join('\n')}`
    : '**Entscheidungs-Flags:** —';

  // ── Last decision ──
  const lastDecLine = lastDec
    ? `**Letzte Entscheidung:** ${lastDec.option_label} *(${lastDec.votes} Stimmen, <t:${Math.floor(lastDec.decided_at / 1000)}:R>)*`
    : '**Letzte Entscheidung:** —';

  // ── Next event ──
  const nextLine = settings.next_event_ts
    ? `**Nächstes Event:** <t:${Math.floor(settings.next_event_ts / 1000)}:R>`
    : '**Nächstes Event:** —';

  // ── Vote tally ──
  let voteTally = '';
  if (vote) {
    const voteMap = typeof vote.votes === 'string' ? JSON.parse(vote.votes) : (vote.votes || {});
    const tally = {};
    for (const oid of Object.values(voteMap)) tally[oid] = (tally[oid] || 0) + 1;
    const total = Object.values(tally).reduce((a, b) => a + b, 0);
    voteTally = `\n**Stimmen (${total} gesamt):**\n` +
      Object.entries(tally).map(([k, v]) => `> \`${k}\`: ${v}`).join('\n');
  }

  const container = new ContainerBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent('# 📖 NexuRealms — Story-Übersicht'),
    )
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        [
          statusLine,
          progressLine,
          '',
          `**Aktuelles Kapitel:** ${scene.chapter}`,
          `**Aktuelle Szene:** \`${scene.id}\` — ${scene.title}`,
          '',
          lastDecLine,
          nextLine,
        ].join('\n')
      ),
    )
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(flagsLine + voteTally),
    );

  return {
    flags: MessageFlags.IsComponentsV2,
    components: [container],
  };
}

// ─────────────────────────────────────────────────────────────
// SCENE MESSAGE  (new message per scene, contains vote buttons)
// ─────────────────────────────────────────────────────────────

/**
 * renderSceneMessage
 * Builds the story scene message with procedural text + vote buttons.
 * This message is REPLACED (not edited) for each new scene.
 *
 * @param {object}      scene       – Scene node
 * @param {object}      guildState  – Guild state row
 * @param {number|null} voteEndsAt  – Epoch ms vote deadline (null = no vote)
 * @returns {object} Components V2 message options
 */
export function renderSceneMessage(scene, guildState, voteEndsAt = null) {
  const body = generateSceneText(scene, guildState);

  let footerText;
  if (scene.ending) {
    footerText = '📖 **Ende dieses Story-Zweigs**\nDieser Abschnitt schließt einen möglichen Verlauf ab. Admins können die Story mit `/story reset` neu starten.';
  } else if (voteEndsAt) {
    footerText = `🗳️ **Entscheidung** — Stimmt bis <t:${Math.floor(voteEndsAt / 1000)}:R> ab.\n*Jedes Mitglied hat genau eine Stimme.*`;
  } else {
    footerText = '⌛ Die nächste Szene wird automatisch ausgelöst.';
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

// ─────────────────────────────────────────────────────────────
// INFO MESSAGE  (used for slash command replies)
// ─────────────────────────────────────────────────────────────

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

// Keep old export alias so nothing else breaks
export { renderSceneMessage as renderStoryMessage };
