import { textBlocks } from '../story/textBlocks.js';
import { updateLastVariants } from '../database/db.js';

function chooseAvoidingRecent(pool, recent = []) {
  const filtered = pool.filter(item => !recent.includes(item));
  const source = filtered.length ? filtered : pool;
  return source[Math.floor(Math.random() * source.length)];
}

/**
 * generateSceneText
 * Assembles a dynamic story text from local building blocks.
 * No AI — all output is constructed from predefined text pools in story/textBlocks.js.
 *
 * @param {object} scene      – Scene node from story/scenes.js
 * @param {object} guildState – Current guild state row from the DB
 * @returns {string}           Assembled story text
 */
export function generateSceneText(scene, guildState) {
  const recent = guildState.last_variants || [];

  const intro      = chooseAvoidingRecent(scene.introVariants?.length ? scene.introVariants : [scene.baseText], recent);
  const mood       = chooseAvoidingRecent(textBlocks.moods, recent);
  const event      = chooseAvoidingRecent(textBlocks.events, recent);
  const reaction   = chooseAvoidingRecent(textBlocks.reactions, recent);
  const consequence = chooseAvoidingRecent(textBlocks.consequences, recent);
  const location   = chooseAvoidingRecent(textBlocks.locations, recent);

  const parts = [
    intro,
    `${mood} ${event}`,
    `Ihr befindet euch ${location}. ${reaction}`,
    scene.baseText,
  ];

  // Append a consequence line only when a significant flag is set
  const flags = guildState.story_flags || {};
  if (flags.alert_triggered || flags.sabotaged_core || flags.synced_core || flags.breakout_attempted) {
    parts.push(`> ${consequence}`);
  }

  const used = [intro, mood, event, reaction, consequence, location];
  if (guildState.guild_id) {
    updateLastVariants(guildState.guild_id, [...recent, ...used]);
  }

  return parts.join('\n\n');
}
