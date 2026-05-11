export const voidbornScenes = {
  voidborn_001: {
    id: 'voidborn_001', chapter: 1,
    title: { de: 'Kapitel 1 · Die Argo IV', en: 'Chapter 1 · The Argo IV' },
    introVariants: {
      de: ['Das Kolonisationsschiff Argo IV driftet. Irgendwo zwischen Zuhause und Nirgendwo.', 'Alarm. Nicht der erste heute. Aber dieser klingt anders.'],
      en: ['The colony ship Argo IV drifts. Somewhere between home and nowhere.', 'Alarm. Not the first today. But this one sounds different.'],
    },
    baseText: {
      de: 'Ein Teil der Besatzung hat sich verschanzt. Kommandantin Vael: "Es ist eine Meuterei." Zwei Sektoren sind abgeschnitten.',
      en: 'Part of the crew has barricaded themselves. Commander Vael: "It\'s a mutiny." Two sectors are cut off.',
    },
    discoverCharacters: [
      { name: { de: 'Kommandantin Vael', en: 'Commander Vael' }, role: { de: 'Kapitänin', en: 'Captain' }, faction: { de: 'Loyalisten', en: 'Loyalists' }, description: { de: 'Unerschütterlich. Vielleicht zu unerschütterlich.', en: 'Unshakeable. Perhaps too unshakeable.' } },
      { name: { de: 'Ingenieur Taka', en: 'Engineer Taka' }, role: { de: 'Meuterer', en: 'Mutineer' }, faction: { de: 'Freie Besatzung', en: 'Free Crew' }, description: { de: 'Hat Gründe. Gute Gründe.', en: 'Has reasons. Good reasons.' } },
    ],
    options: [
      { id: 'side_loyalists', label: { de: 'Loyalisten unterstützen', en: 'Support loyalists' }, nextSceneId: 'voidborn_002', setFlags: { sided_loyalists: true } },
      { id: 'side_mutineers', label: { de: 'Meuterern anhören', en: 'Hear out mutineers' },      nextSceneId: 'voidborn_003', setFlags: { sided_mutineers: true } },
    ],
  },
  voidborn_002: {
    id: 'voidborn_002', chapter: 2,
    title: { de: 'Kapitel 2 · Ordnung', en: 'Chapter 2 · Order' },
    introVariants: {
      de: ['Die Korridore sind gesichert. Aber zu welchem Preis?', 'Vael nickt. Ihr habt ihre Seite gewählt — nun tragt ihr ihre Last.'],
      en: ['The corridors are secured. But at what price?', 'Vael nods. You chose her side — now you carry her burden.'],
    },
    baseText: {
      de: 'Vael enthüllt den wahren Kurs: nicht die ursprüngliche Kolonie — ein militärisches Objekt. Die Meuterer wussten es.',
      en: 'Vael reveals the true destination: not the original colony — a military installation. The mutineers knew.',
    },
    options: [
      { id: 'follow_orders', label: { de: 'Befehle befolgen', en: 'Follow orders' },   nextSceneId: 'voidborn_004', setFlags: { followed_orders: true } },
      { id: 'question_vael', label: { de: 'Vael konfrontieren', en: 'Confront Vael' }, nextSceneId: 'voidborn_005', setFlags: { questioned_vael: true } },
    ],
  },
  voidborn_003: {
    id: 'voidborn_003', chapter: 2,
    title: { de: 'Kapitel 2 · Die Wahrheit', en: 'Chapter 2 · The Truth' },
    introVariants: {
      de: ['Takas Worte sind schwer. Aber sie ergeben Sinn.', 'Die Meuterer zeigen euch Beweise. Unbestreitbare Beweise.'],
      en: ['Taka\'s words are heavy. But they make sense.', 'The mutineers show you evidence. Undeniable evidence.'],
    },
    baseText: {
      de: 'Vael hat die Kolonie-Koordinaten manipuliert. Das Schiff ist auf Kurs zu einer Waffenstation. Taka will es stoppen.',
      en: 'Vael manipulated the colony coordinates. The ship is heading to a weapons station. Taka wants to stop it.',
    },
    options: [
      { id: 'join_mutiny',   label: { de: 'Meuterei unterstützen', en: 'Support mutiny' }, nextSceneId: 'voidborn_005', setFlags: { joined_mutiny: true } },
      { id: 'play_neutral',  label: { de: 'Neutral bleiben', en: 'Stay neutral' },          nextSceneId: 'voidborn_006', setFlags: { stayed_neutral: true } },
    ],
  },
  voidborn_004: {
    id: 'voidborn_004', chapter: 3,
    title: { de: 'Kapitel 3 · Waffenstation', en: 'Chapter 3 · Weapons Station' },
    introVariants: {
      de: ['Die Station erscheint am Bildschirm. Größer als erwartet.', 'Vael gibt keine Erklärung. Nur Befehle.'],
      en: ['The station appears on screen. Larger than expected.', 'Vael gives no explanation. Only orders.'],
    },
    baseText: {
      de: 'Die Wahrheit: die Station soll als Basis für die Unterwerfung der Koloniewelten dienen. Vael war informiert.',
      en: 'The truth: the station is meant to serve as a base for subjugating the colony worlds. Vael was informed.',
    },
    options: [
      { id: 'expose_vael',  label: { de: 'Vael entlarven', en: 'Expose Vael' },       nextSceneId: 'voidborn_ending_revolt', setFlags: { exposed_vael: true } },
      { id: 'comply',       label: { de: 'Mitspielen', en: 'Comply' },                nextSceneId: 'voidborn_ending_empire', setFlags: { complied: true } },
    ],
  },
  voidborn_005: {
    id: 'voidborn_005', chapter: 3,
    title: { de: 'Kapitel 3 · Brücke der Entscheidung', en: 'Chapter 3 · Bridge of Decision' },
    introVariants: {
      de: ['Die Brücke. Kontrolle über das Schiff. Wer sie hält, bestimmt alles.', 'Vael und Taka stehen sich gegenüber — ihr dazwischen.'],
      en: ['The bridge. Control over the ship. Whoever holds it decides everything.', 'Vael and Taka face each other — you between them.'],
    },
    baseText: {
      de: 'Beide Seiten warten auf eure Entscheidung. Das Schiff kann noch umgekehrt werden.',
      en: 'Both sides await your decision. The ship can still be turned around.',
    },
    options: [
      { id: 'turn_ship',   label: { de: 'Schiff umkehren', en: 'Turn the ship around' },      nextSceneId: 'voidborn_ending_freedom', setFlags: { turned_ship: true } },
      { id: 'destroy_nav', label: { de: 'Navigation zerstören', en: 'Destroy navigation' },   nextSceneId: 'voidborn_ending_drift', setFlags: { destroyed_nav: true } },
    ],
  },
  voidborn_006: {
    id: 'voidborn_006', chapter: 3,
    title: { de: 'Kapitel 3 · Das Vakuum', en: 'Chapter 3 · The Vacuum' },
    introVariants: {
      de: ['Niemand führt. Das Schiff driftet.', 'Neutralität hat ihren Preis.'],
      en: ['No one leads. The ship drifts.', 'Neutrality has its price.'],
    },
    baseText: {
      de: 'Ohne Führung eskaliert der Konflikt. Ihr müsst jetzt handeln oder alles verlieren.',
      en: 'Without leadership, the conflict escalates. You must act now or lose everything.',
    },
    options: [
      { id: 'take_command', label: { de: 'Kommando übernehmen', en: 'Take command' },  nextSceneId: 'voidborn_005', setFlags: { took_command: true } },
      { id: 'abandon_ship', label: { de: 'Rettungskapsel', en: 'Escape pod' },          nextSceneId: 'voidborn_ending_drift', setFlags: { abandoned: true } },
    ],
  },
  voidborn_ending_freedom: {
    id: 'voidborn_ending_freedom', chapter: 4,
    title: { de: 'Kapitel 4 · Kurs auf Freiheit', en: 'Chapter 4 · Course for Freedom' },
    introVariants: { de: ['Das Schiff kehrt um. Endlich.'], en: ['The ship turns around. Finally.'] },
    baseText: { de: 'Die Kolonie wartet. Es war nicht einfach — aber ihr seid frei.', en: 'The colony awaits. It wasn\'t easy — but you are free.' },
    options: [], ending: true, endingType: 'freedom',
    endingText: { de: '🚀 **Ende: Freiheit** — Die Kolonie lebt. Vaels Plan ist gescheitert.', en: '🚀 **Ending: Freedom** — The colony lives. Vael\'s plan has failed.' },
  },
  voidborn_ending_revolt: {
    id: 'voidborn_ending_revolt', chapter: 4,
    title: { de: 'Kapitel 4 · Revolte', en: 'Chapter 4 · Revolt' },
    introVariants: { de: ['Die Besatzung kennt die Wahrheit.'], en: ['The crew knows the truth.'] },
    baseText: { de: 'Vael ist entmachtet. Die Argo IV gehört ihrer Besatzung.', en: 'Vael is stripped of power. The Argo IV belongs to its crew.' },
    options: [], ending: true, endingType: 'revolt',
    endingText: { de: '✊ **Ende: Revolte** — Macht dem Volk. Oder zumindest der Besatzung.', en: '✊ **Ending: Revolt** — Power to the people. Or at least the crew.' },
  },
  voidborn_ending_empire: {
    id: 'voidborn_ending_empire', chapter: 4,
    title: { de: 'Kapitel 4 · Imperium', en: 'Chapter 4 · Empire' },
    introVariants: { de: ['Die Station ist erreicht. Es gibt kein Zurück mehr.'], en: ['The station is reached. There is no going back.'] },
    baseText: { de: 'Ihr habt mitgemacht. Geschichte wird euch anders bewerten.', en: 'You went along with it. History will judge you differently.' },
    options: [], ending: true, endingType: 'empire',
    endingText: { de: '🌌 **Ende: Imperium** — Macht um jeden Preis. War es das wert?', en: '🌌 **Ending: Empire** — Power at any cost. Was it worth it?' },
  },
  voidborn_ending_drift: {
    id: 'voidborn_ending_drift', chapter: 4,
    title: { de: 'Kapitel 4 · Im Nichts', en: 'Chapter 4 · In the Void' },
    introVariants: { de: ['Das Schiff treibt. Niemand weiß wohin.'], en: ['The ship drifts. No one knows where.'] },
    baseText: { de: 'Kein Kurs. Kein Ziel. Nur das Universum — und ihr.', en: 'No course. No destination. Just the universe — and you.' },
    options: [], ending: true, endingType: 'drift',
    endingText: { de: '🌠 **Ende: Drift** — Verloren im All. Aber frei.', en: '🌠 **Ending: Drift** — Lost in space. But free.' },
  },
};