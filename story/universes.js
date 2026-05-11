// All available universes — must match keys in UNIVERSE_START_SCENES
export const UNIVERSES = ['nexus', 'aether', 'ashfall', 'voidborn', 'specter'];

export const UNIVERSE_META = {
  nexus: {
    name:        { de: 'Das Nexus',        en: 'The Nexus' },
    description: { de: 'Der Ursprung aller Realitäten. Ein Kern aus reiner Energie, bewacht von den Hütern.', en: 'The origin of all realities. A core of pure energy, guarded by the Keepers.' },
    color: 0x4f98a3,
    emoji: '🌐',
  },
  aether: {
    name:        { de: 'Aethoria',         en: 'Aethoria' },
    description: { de: 'Ein gefallenes Königreich, in dem Magie und Asche regieren.', en: 'A fallen kingdom where magic and ash reign.' },
    color: 0x7a39bb,
    emoji: '✨',
  },
  ashfall: {
    name:        { de: 'Ashfall',          en: 'Ashfall' },
    description: { de: 'Eine post-apokalyptische Welt aus Ruinen und Überleben.', en: 'A post-apocalyptic world of ruins and survival.' },
    color: 0xbb653b,
    emoji: '🔥',
  },
  voidborn: {
    name:        { de: 'Voidborn',         en: 'Voidborn' },
    description: { de: 'Die Leere zwischen den Welten — und die, die dort geboren wurden.', en: 'The void between worlds — and those born within it.' },
    color: 0x28251d,
    emoji: '🌑',
  },
  specter: {
    name:        { de: 'Specter',          en: 'Specter' },
    description: { de: 'Eine Welt aus Schatten und Erinnerungen, die nicht sterben wollen.', en: 'A world of shadows and memories that refuse to die.' },
    color: 0x6daa45,
    emoji: '👻',
  },
};

/**
 * Returns a random universe key from the UNIVERSES list.
 * @returns {string}
 */
export function pickRandomUniverse() {
  return UNIVERSES[Math.floor(Math.random() * UNIVERSES.length)];
}

/**
 * Returns universe metadata for a given universe key.
 * @param {string} universeKey
 * @returns {object|null}
 */
export function getUniverseMeta(universeKey) {
  return UNIVERSE_META[universeKey] || null;
}
