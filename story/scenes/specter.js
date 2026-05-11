export const specterScenes = {
  specter_001: {
    id: 'specter_001', chapter: 1,
    title: { de: 'Kapitel 1 · Rauch und Spiegel', en: 'Chapter 1 · Smoke and Mirrors' },
    introVariants: {
      de: ['Regen auf Kopfsteinpflaster. Irgendwo ein Schuss.', 'Die Stadt schläft nie — sie lauert.'],
      en: ['Rain on cobblestones. Somewhere a shot.', 'The city never sleeps — it lurks.'],
    },
    baseText: {
      de: 'Detektivin Mira Casteel erhält einen anonymen Hinweis: Der Bürgermeister ist tot — offiziell Herzversagen. Inoffiziell: etwas stimmt nicht.',
      en: 'Detective Mira Casteel receives an anonymous tip: the mayor is dead — officially heart failure. Unofficially: something is wrong.',
    },
    discoverCharacters: [
      { name: { de: 'Mira Casteel', en: 'Mira Casteel' }, role: { de: 'Detektivin', en: 'Detective' }, faction: { de: 'Unabhängig', en: 'Independent' }, description: { de: 'Hartnäckig. Hat bereits zu viel gesehen.', en: 'Persistent. Has already seen too much.' } },
    ],
    options: [
      { id: 'crime_scene', label: { de: 'Tatort untersuchen', en: 'Investigate crime scene' }, nextSceneId: 'specter_002', setFlags: { investigated_scene: true } },
      { id: 'informant',   label: { de: 'Informanten treffen', en: 'Meet informant' },          nextSceneId: 'specter_003', setFlags: { met_informant: true } },
    ],
  },
  specter_002: {
    id: 'specter_002', chapter: 2,
    title: { de: 'Kapitel 2 · Spuren', en: 'Chapter 2 · Traces' },
    introVariants: {
      de: ['Die Leiche liegt wie arrangiert. Das ist kein Herzversagen.', 'Jemand hat gründlich sauber gemacht — aber nicht gründlich genug.'],
      en: ['The body lies as if arranged. This is not heart failure.', 'Someone cleaned up thoroughly — but not thoroughly enough.'],
    },
    baseText: {
      de: 'Zwei Spuren: eine führt zur Stadtregierung, eine zu einer Geheimorganisation namens "Specter".',
      en: 'Two leads: one leads to city government, one to a secret organisation called "Specter".',
    },
    options: [
      { id: 'follow_gov',     label: { de: 'Stadtregierung verfolgen', en: 'Follow city gov lead' }, nextSceneId: 'specter_004', setFlags: { follows_gov: true } },
      { id: 'follow_specter', label: { de: 'Specter verfolgen', en: 'Follow Specter lead' },        nextSceneId: 'specter_005', setFlags: { follows_specter: true } },
    ],
  },
  specter_003: {
    id: 'specter_003', chapter: 2,
    title: { de: 'Kapitel 2 · Der Schatten', en: 'Chapter 2 · The Shadow' },
    introVariants: {
      de: ['Der Informant zittert. Angst echtet sich nicht.', 'Er hat Beweise — und er will überleben.'],
      en: ['The informant trembles. Fear cannot be faked.', 'He has evidence — and he wants to survive.'],
    },
    baseText: {
      de: 'Der Bürgermeister wollte eine Geheimorganisation enthüllen. Er kam nicht dazu.',
      en: 'The mayor wanted to expose a secret organisation. He did not get the chance.',
    },
    options: [
      { id: 'protect_informant', label: { de: 'Informanten schützen', en: 'Protect informant' }, nextSceneId: 'specter_005', setFlags: { protected_informant: true } },
      { id: 'use_info',          label: { de: 'Info sofort nutzen', en: 'Use info immediately' }, nextSceneId: 'specter_004', setFlags: { used_info_fast: true } },
    ],
  },
  specter_004: {
    id: 'specter_004', chapter: 3,
    title: { de: 'Kapitel 3 · Korruption', en: 'Chapter 3 · Corruption' },
    introVariants: {
      de: ['Das Rathaus bei Nacht wirkt wie eine andere Welt.', 'Die Akten beweisen alles — und das ist das Problem.'],
      en: ['City hall at night feels like another world.', 'The files prove everything — and that is the problem.'],
    },
    baseText: {
      de: 'Halbder Stadtrat ist kompromittiert. Die Akten verschwinden systematisch. Mira hat nur noch wenig Zeit.',
      en: 'Half the city council is compromised. Files disappear systematically. Mira has little time left.',
    },
    discoverCharacters: [
      { name: { de: 'Stadtrat Venn', en: 'Councillor Venn' }, role: { de: 'Antagonist', en: 'Antagonist' }, faction: { de: 'Korrupter Rat', en: 'Corrupt Council' }, description: { de: 'Lächelt immer. Bedeutet nichts Gutes.', en: 'Always smiling. Means nothing good.' } },
    ],
    options: [
      { id: 'expose_public',  label: { de: 'Öffentlich enthüllen', en: 'Expose publicly' },       nextSceneId: 'specter_006', setFlags: { went_public: true } },
      { id: 'blackmail',      label: { de: 'Erpressung als Taktik', en: 'Use blackmail tactic' }, nextSceneId: 'specter_007', setFlags: { used_blackmail: true } },
    ],
  },
  specter_005: {
    id: 'specter_005', chapter: 3,
    title: { de: 'Kapitel 3 · Specter', en: 'Chapter 3 · Specter' },
    introVariants: {
      de: ['Sie finden euch, bevor ihr sie findet.', 'Ein Treffen ohne Einladung — in einem leeren Lagerhaus.'],
      en: ['They find you before you find them.', 'A meeting without invitation — in an empty warehouse.'],
    },
    baseText: {
      de: 'Specter ist kein Feind — oder behauptet es. Sie wollten den Bürgermeister auch schützen. Zu spät.',
      en: 'Specter is not an enemy — or claims not to be. They also wanted to protect the mayor. Too late.',
    },
    options: [
      { id: 'work_with_specter', label: { de: 'Mit Specter arbeiten', en: 'Work with Specter' }, nextSceneId: 'specter_007', setFlags: { allied_specter: true } },
      { id: 'expose_specter',    label: { de: 'Specter selbst enthüllen', en: 'Expose Specter' }, nextSceneId: 'specter_006', setFlags: { exposed_specter: true } },
    ],
  },
  specter_006: {
    id: 'specter_006', chapter: 4,
    title: { de: 'Kapitel 4 · Im Rampenlicht', en: 'Chapter 4 · In the Spotlight' },
    introVariants: {
      de: ['Die Presse ist benachrichtigt. Es gibt kein Zurück mehr.', 'Das Licht blendet alle — auch Mira.'],
      en: ['The press is notified. There is no going back.', 'The light blinds everyone — including Mira.'],
    },
    baseText: {
      de: 'Die Enthüllung erschüttert die Stadt. Aber Venn hat Verbündete — und sie kommen.',
      en: 'The revelation shakes the city. But Venn has allies — and they are coming.',
    },
    options: [
      { id: 'stand_ground', label: { de: 'Standhalten', en: 'Stand ground' },     nextSceneId: 'specter_ending_justice', setFlags: { stood_ground: true } },
      { id: 'flee_city',    label: { de: 'Stadt verlassen', en: 'Leave the city' }, nextSceneId: 'specter_ending_exile', setFlags: { fled: true } },
    ],
  },
  specter_007: {
    id: 'specter_007', chapter: 4,
    title: { de: 'Kapitel 4 · Doppelspiel', en: 'Chapter 4 · Double Game' },
    introVariants: {
      de: ['Vertrauen als Waffe. Riskant. Effektiv.', 'Allianzen mit Geheimnissen sind gefährlich — und nützlich.'],
      en: ['Trust as a weapon. Risky. Effective.', 'Alliances with secrets are dangerous — and useful.'],
    },
    baseText: {
      de: 'Mit Specters Ressourcen und Miras Instinkt: ein letzter Zug gegen Venn und seine Hintermänner.',
      en: 'With Specter\'s resources and Mira\'s instinct: one final move against Venn and his backers.',
    },
    options: [
      { id: 'trap_venn',   label: { de: 'Venn in die Falle locken', en: 'Trap Venn' },    nextSceneId: 'specter_ending_justice', setFlags: { trapped_venn: true } },
      { id: 'disappear',   label: { de: 'Im Schatten verschwinden', en: 'Vanish in shadows' }, nextSceneId: 'specter_ending_shadow', setFlags: { vanished: true } },
    ],
  },
  specter_ending_justice: {
    id: 'specter_ending_justice', chapter: 5,
    title: { de: 'Kapitel 5 · Gerechtigkeit', en: 'Chapter 5 · Justice' },
    introVariants: { de: ['Die Handschellen klicken.'], en: ['The handcuffs click.'] },
    baseText: { de: 'Venn ist verhaftet. Die Stadt atmet durch. Mira trinkt Kaffee.', en: 'Venn is arrested. The city exhales. Mira drinks coffee.' },
    options: [], ending: true, endingType: 'justice',
    endingText: { de: '⚖️ **Ende: Gerechtigkeit** — Das System funktioniert. Diesmal.', en: '⚖️ **Ending: Justice** — The system works. This time.' },
  },
  specter_ending_exile: {
    id: 'specter_ending_exile', chapter: 5,
    title: { de: 'Kapitel 5 · Exil', en: 'Chapter 5 · Exile' },
    introVariants: { de: ['Ein neues Leben. Irgendwo anders.'], en: ['A new life. Somewhere else.'] },
    baseText: { de: 'Mira lebt — aber nicht mehr als Detektivin. Manche Wahrheiten kosten alles.', en: 'Mira lives — but no longer as a detective. Some truths cost everything.' },
    options: [], ending: true, endingType: 'exile',
    endingText: { de: '🌃 **Ende: Exil** — Überleben als Sieg. Manchmal reicht das.', en: '🌃 **Ending: Exile** — Survival as victory. Sometimes that is enough.' },
  },
  specter_ending_shadow: {
    id: 'specter_ending_shadow', chapter: 5,
    title: { de: 'Kapitel 5 · Im Schatten', en: 'Chapter 5 · In the Shadow' },
    introVariants: { de: ['Niemand weiß, wer Specter wirklich ist.'], en: ['No one knows who Specter really is.'] },
    baseText: { de: 'Mira ist jetzt Teil von Specter. Gerechtigkeit — auf ihre eigene Art.', en: 'Mira is now part of Specter. Justice — in her own way.' },
    options: [], ending: true, endingType: 'shadow',
    endingText: { de: '🌒 **Ende: Schatten** — Mira ist Specter. Was das bedeutet, bleibt offen.', en: '🌒 **Ending: Shadow** — Mira is Specter. What that means remains open.' },
  },
};