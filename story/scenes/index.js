import { nexusScenes }    from './nexus.js';
import { aetherScenes }   from './aether.js';
import { ashfallScenes }  from './ashfall.js';
import { voidbornScenes } from './voidborn.js';
import { specterScenes }  from './specter.js';

export const allScenes = {
  ...nexusScenes,
  ...aetherScenes,
  ...ashfallScenes,
  ...ashfallScenes,
  ...voidbornScenes,
  ...specterScenes,
};

export function getScene(sceneId) {
  return allScenes[sceneId] || null;
}

export const UNIVERSE_START_SCENES = {
  nexus:    'nexus_001',
  aether:   'aether_001',
  ashfall:  'ashfall_001',
  voidborn: 'voidborn_001',
  specter:  'specter_001',
};