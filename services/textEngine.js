import { textBlocks } from '../story/textBlocks.js';
import { updateLastVariants } from '../database/db.js';
import { t } from '../utils/i18n.js';

function chooseAvoidingRecent(pool, recent = []) {
  const filtered = pool.filter(item => !recent.includes(item));
  const source = filtered.length ? filtered : pool;
  return source[Math.floor(Math.random() * source.length)];
}

/**
 * generateSceneText
 * Assembles dynamic story text from predefined building blocks.
 * All bilingual fields resolved via t() before use.
 *
 * @param {object}  scene       – Scene node
 * @param {object}  guildState  – Current guild state row
 * @param {string}  lang        – 'de' or 'en'
 * @param {boolean} persist     – If false, skip DB write (overview panel)
 * @returns {string}
 */
export function generateSceneText(scene, guildState, lang = 'de', persist = true) {
  const de     = lang === 'de';
  const recent = Array.isArray(guildState.last_variants)
    ? guildState.last_variants
    : JSON.parse(guildState.last_variants || '[]');

  // introVariants is { de: [...], en: [...] } — pick correct language pool
  const introPool = (scene.introVariants?.[lang] ?? scene.introVariants?.de ?? []);
  const baseText  = t(scene.baseText, lang);

  const intro = introPool.length
    ? chooseAvoidingRecent(introPool, recent)
    : baseText;

  // Pick language-correct atmosphere blocks
  const blocks      = textBlocks[lang] || textBlocks.de;
  const mood        = chooseAvoidingRecent(blocks.moods,        recent);
  const event       = chooseAvoidingRecent(blocks.events,       recent);
  const reaction    = chooseAvoidingRecent(blocks.reactions,    recent);
  const consequence = chooseAvoidingRecent(blocks.consequences, recent);
  const location    = chooseAvoidingRecent(blocks.locations,    recent);

  const locationLine = de
    ? `Ihr befindet euch ${location}. ${reaction}`
    : `You find yourselves ${location}. ${reaction}`;

  const parts = [
    intro,
    `${mood} ${event}`,
    locationLine,
    baseText,
  ];

  // Append consequence only when a significant flag is active
  const flags = typeof guildState.story_flags === 'string'
    ? JSON.parse(guildState.story_flags || '{}')
    : (guildState.story_flags || {});

  if (
    flags.alert_triggered || flags.sabotaged_core  || flags.synced_core ||
    flags.breakout_attempted || flags.stopped_lyra || flags.infiltrated_lab ||
    flags.freed_entity
  ) {
    parts.push(`> ${consequence}`);
  }

  if (persist && guildState.guild_id) {
    const used = [intro, mood, event, reaction, consequence, location];
    updateLastVariants(guildState.guild_id, [...recent, ...used].slice(-40));
  }

  return parts.join('\n\n');
}
