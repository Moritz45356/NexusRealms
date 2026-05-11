export const aetherScenes = {
  aether_001: {
    id: 'aether_001', chapter: 1,
    title: { de: 'Kapitel 1 · Die gefallene Stadt', en: 'Chapter 1 · The Fallen City' },
    introVariants: {
      de: ['Die Mauern von Aethoria liegen in Schutt. Magie hängt wie Rauch in der Luft.', 'Ein Reich, das einst in Gold erstrahlte — heute grau wie Asche.'],
      en: ['The walls of Aethoria lie in rubble. Magic hangs like smoke in the air.', 'A kingdom that once shone in gold — today grey as ash.'],
    },
    baseText: {
      de: 'Ihr betretet die Überreste der Hauptstadt. Zwei Pfade: der alte Königspalast oder die verbotenen Katakomben.',
      en: 'You enter the remains of the capital. Two paths: the old royal palace or the forbidden catacombs.',
    },
    discoverCharacters: [
      { name: { de: 'Seraphina', en: 'Seraphina' }, role: { de: 'Magierin', en: 'Mage' }, faction: { de: 'Widerstand', en: 'Resistance' }, description: { de: 'Letzte bekannte Hüterin des alten Wissens.', en: 'Last known guardian of ancient knowledge.' } },
    ],
    options: [
      { id: 'palace',    label: { de: 'Zum Palast vordringen', en: 'Advance to the palace' },   nextSceneId: 'aether_002', setFlags: { chose_palace: true } },
      { id: 'catacombs', label: { de: 'Katakomben betreten', en: 'Enter the catacombs' },        nextSceneId: 'aether_003', setFlags: { chose_catacombs: true } },
    ],
  },
  aether_002: {
    id: 'aether_002', chapter: 2,
    title: { de: 'Kapitel 2 · Thron der Asche', en: 'Chapter 2 · Throne of Ash' },
    introVariants: {
      de: ['Der Thronraum ist leer. Aber nicht verlassen — etwas wartet hier.', 'Goldene Ornamente unter einer Schicht Asche. Schönheit und Verfall.'],
      en: ['The throne room is empty. But not abandoned — something waits here.', 'Golden ornaments beneath a layer of ash. Beauty and decay.'],
    },
    baseText: {
      de: 'Ein versiegeltes Grimoire liegt auf dem Thron. Seraphina warnt: es öffnen bedeutet, alte Mächte zu wecken.',
      en: 'A sealed grimoire rests on the throne. Seraphina warns: opening it means awakening old powers.',
    },
    options: [
      { id: 'open_grimoire', label: { de: 'Grimoire öffnen', en: 'Open the grimoire' },     nextSceneId: 'aether_004', setFlags: { grimoire_opened: true } },
      { id: 'take_sealed',   label: { de: 'Versiegelt mitnehmen', en: 'Take it sealed' },    nextSceneId: 'aether_005', setFlags: { grimoire_sealed: true } },
    ],
  },
  aether_003: {
    id: 'aether_003', chapter: 2,
    title: { de: 'Kapitel 2 · Stimmen der Toten', en: 'Chapter 2 · Voices of the Dead' },
    introVariants: {
      de: ['Die Katakomben flüstern. Nicht der Wind — die Toten selbst sprechen.', 'Tausende Grabkammern, jede mit einer Geschichte.'],
      en: ['The catacombs whisper. Not the wind — the dead themselves speak.', 'Thousands of burial chambers, each with a story.'],
    },
    baseText: {
      de: 'Ihr findet das Grab des letzten Königs — und eine Inschrift, die eine Prophezeiung beschreibt.',
      en: 'You find the tomb of the last king — and an inscription describing a prophecy.',
    },
    options: [
      { id: 'read_prophecy',  label: { de: 'Prophezeiung lesen', en: 'Read the prophecy' },   nextSceneId: 'aether_004', setFlags: { knows_prophecy: true } },
      { id: 'disturb_tomb',   label: { de: 'Grab öffnen', en: 'Open the tomb' },               nextSceneId: 'aether_006', setFlags: { disturbed_tomb: true } },
    ],
  },
  aether_004: {
    id: 'aether_004', chapter: 3,
    title: { de: 'Kapitel 3 · Erwachtes Dunkel', en: 'Chapter 3 · Awakened Darkness' },
    introVariants: {
      de: ['Schatten verdichten sich zu Gestalten. Die alte Magie erwacht.', 'Ein Riss im Boden — dahinter pulsiert violettes Licht.'],
      en: ['Shadows solidify into figures. The old magic awakens.', 'A crack in the floor — behind it, violet light pulses.'],
    },
    baseText: {
      de: 'Der Schattenfürst — einst verbannt — kehrt zurück. Seraphina: "Wir haben ihn geweckt. Jetzt müssen wir ihn besiegen oder mit ihm verhandeln."',
      en: 'The Shadow Lord — once banished — returns. Seraphina: "We awakened him. Now we must defeat him or negotiate."',
    },
    discoverCharacters: [
      { name: { de: 'Der Schattenfürst', en: 'The Shadow Lord' }, role: { de: 'Antagonist', en: 'Antagonist' }, faction: { de: 'Dunkel', en: 'Darkness' }, description: { de: 'Uralte Macht, seit Jahrhunderten verbannt.', en: 'Ancient power, banished for centuries.' } },
    ],
    options: [
      { id: 'fight',     label: { de: 'Kämpfen', en: 'Fight' },        nextSceneId: 'aether_007', setFlags: { fought_shadow: true } },
      { id: 'negotiate', label: { de: 'Verhandeln', en: 'Negotiate' }, nextSceneId: 'aether_008', setFlags: { negotiated_shadow: true } },
    ],
  },
  aether_005: {
    id: 'aether_005', chapter: 3,
    title: { de: 'Kapitel 3 · Der Orden', en: 'Chapter 3 · The Order' },
    introVariants: {
      de: ['Ihr werdet von bewaffneten Männern umringt. Roben mit dem alten Wappenzeichen.', 'Der Orden der Asche — sie suchen dasselbe.'],
      en: ['You are surrounded by armed figures. Robes bearing the ancient crest.', 'The Order of Ash — they seek the same thing.'],
    },
    baseText: {
      de: 'Der Orden will das Grimoire. Sie behaupten, es für immer zu versiegeln. Doch ihre Geschichte ist blutig.',
      en: 'The Order wants the grimoire. They claim to seal it forever. But their history is bloody.',
    },
    options: [
      { id: 'give_grimoire', label: { de: 'Grimoire übergeben', en: 'Hand over grimoire' }, nextSceneId: 'aether_008', setFlags: { gave_grimoire: true } },
      { id: 'keep_grimoire', label: { de: 'Verweigern und fliehen', en: 'Refuse and flee' }, nextSceneId: 'aether_007', setFlags: { kept_grimoire: true } },
    ],
  },
  aether_006: {
    id: 'aether_006', chapter: 3,
    title: { de: 'Kapitel 3 · Der Fluch', en: 'Chapter 3 · The Curse' },
    introVariants: {
      de: ['Das Öffnen des Grabes hat einen Fluch aktiviert.', 'Ein kalter Schauer — nicht von der Temperatur, sondern von dem, was ihr gespürt habt.'],
      en: ['Opening the tomb has activated a curse.', 'A cold shiver — not from temperature, but from what you felt.'],
    },
    baseText: {
      de: 'Einer aus der Gruppe ist verflucht. Heilung ist möglich — aber teuer. Die Entscheidung fällt auf euch.',
      en: 'One of the group is cursed. Healing is possible — but costly. The decision falls to you.',
    },
    options: [
      { id: 'seek_cure',   label: { de: 'Heilung suchen', en: 'Seek a cure' },      nextSceneId: 'aether_007', setFlags: { sought_cure: true } },
      { id: 'embrace_curse',label: { de: 'Fluch akzeptieren', en: 'Accept curse' }, nextSceneId: 'aether_009', setFlags: { embraced_curse: true } },
    ],
  },
  aether_007: {
    id: 'aether_007', chapter: 4,
    title: { de: 'Kapitel 4 · Das letzte Ritual', en: 'Chapter 4 · The Final Ritual' },
    introVariants: {
      de: ['Der Kreis ist vorbereitet. Seraphina: „Es gibt kein Zurück."', 'Magie pulsiert durch den Raum — ihr seid am Punkt ohne Umkehr.'],
      en: ['The circle is prepared. Seraphina: "There is no going back."', 'Magic pulses through the room — you are at the point of no return.'],
    },
    baseText: {
      de: 'Das Ritual zur Bannierung des Schattenfürsten erfordert ein Opfer. Wer oder was geopfert wird, bestimmt das Ende.',
      en: 'The ritual to banish the Shadow Lord requires a sacrifice. What is sacrificed determines the ending.',
    },
    options: [
      { id: 'sacrifice_power',    label: { de: 'Magie opfern', en: 'Sacrifice magic' },    nextSceneId: 'aether_ending_light', setFlags: { sacrificed_power: true } },
      { id: 'sacrifice_memory',   label: { de: 'Erinnerungen opfern', en: 'Sacrifice memories' }, nextSceneId: 'aether_ending_twilight', setFlags: { sacrificed_memory: true } },
    ],
  },
  aether_008: {
    id: 'aether_008', chapter: 4,
    title: { de: 'Kapitel 4 · Pakt im Dunkeln', en: 'Chapter 4 · Pact in the Dark' },
    introVariants: {
      de: ['Der Schattenfürst hört zu. Das allein ist unheimlich genug.', 'Ein Wesen mit Jahrtausenden Erfahrung — und ihr bietet ihm einen Handel an.'],
      en: ['The Shadow Lord listens. That alone is uncanny enough.', 'A being with millennia of experience — and you offer it a deal.'],
    },
    baseText: {
      de: 'Der Pakt ist möglich. Aber seine Bedingungen sind dunkel: Ein Teil des Reiches bleibt immer unter seinem Einfluss.',
      en: 'The pact is possible. But its terms are dark: a part of the kingdom will always remain under its influence.',
    },
    options: [
      { id: 'accept_pact', label: { de: 'Pakt akzeptieren', en: 'Accept pact' }, nextSceneId: 'aether_ending_shadow', setFlags: { accepted_pact: true } },
      { id: 'break_pact',  label: { de: 'Pakt brechen', en: 'Break pact' },      nextSceneId: 'aether_007', setFlags: { broke_pact: true } },
    ],
  },
  aether_009: {
    id: 'aether_009', chapter: 4,
    title: { de: 'Kapitel 4 · Gezeichnet', en: 'Chapter 4 · Marked' },
    introVariants: {
      de: ['Der Fluch hat euch verändert. Aber vielleicht ist er auch eine Waffe.', 'Dunkelheit als Werkzeug — riskant, aber möglich.'],
      en: ['The curse has changed you. But perhaps it is also a weapon.', 'Darkness as a tool — risky, but possible.'],
    },
    baseText: {
      de: 'Mit dem Fluch als Waffe habt ihr Macht — aber jede Nutzung kostet euch mehr von euch selbst.',
      en: 'With the curse as a weapon, you have power — but every use costs more of yourself.',
    },
    options: [
      { id: 'use_curse',    label: { de: 'Fluch als Waffe einsetzen', en: 'Use curse as weapon' }, nextSceneId: 'aether_ending_shadow', setFlags: { used_curse: true } },
      { id: 'purge_curse',  label: { de: 'Fluch purgen', en: 'Purge the curse' },                 nextSceneId: 'aether_007', setFlags: { purged_curse: true } },
    ],
  },
  aether_ending_light: {
    id: 'aether_ending_light', chapter: 5,
    title: { de: 'Kapitel 5 · Dämmerung des Lichts', en: 'Chapter 5 · Dawn of Light' },
    introVariants: {
      de: ['Das Licht kehrt nach Aethoria zurück.'], en: ['Light returns to Aethoria.'],
    },
    baseText: {
      de: 'Der Schattenfürst ist gebannt. Das Opfer war groß — aber das Reich lebt.', en: 'The Shadow Lord is banished. The sacrifice was great — but the kingdom lives.',
    },
    options: [], ending: true, endingType: 'light',
    endingText: { de: '☀️ **Ende: Licht** — Das Reich wird wiedergeboren. Aber Magie ist für immer verändert.', en: '☀️ **Ending: Light** — The kingdom is reborn. But magic is forever changed.' },
  },
  aether_ending_twilight: {
    id: 'aether_ending_twilight', chapter: 5,
    title: { de: 'Kapitel 5 · Zwielicht', en: 'Chapter 5 · Twilight' },
    introVariants: { de: ['Weder Licht noch Dunkel — Zwielicht.'], en: ['Neither light nor dark — twilight.'] },
    baseText: { de: 'Die Erinnerungen sind weg, aber der Frieden hält. Wer seid ihr noch?', en: 'The memories are gone, but peace holds. Who are you now?' },
    options: [], ending: true, endingType: 'twilight',
    endingText: { de: '🌗 **Ende: Zwielicht** — Frieden durch Vergessen. Ein zweifelhafter Sieg.', en: '🌗 **Ending: Twilight** — Peace through forgetting. A dubious victory.' },
  },
  aether_ending_shadow: {
    id: 'aether_ending_shadow', chapter: 5,
    title: { de: 'Kapitel 5 · Pakt der Schatten', en: 'Chapter 5 · Pact of Shadows' },
    introVariants: { de: ['Das Dunkel regiert — aber ihr regiert mit.'], en: ['Darkness rules — but you rule with it.'] },
    baseText: { de: 'Das Reich lebt — unter dem langen Schatten des Pakts. Mancher nennt das Frieden.', en: 'The kingdom lives — under the long shadow of the pact. Some call it peace.' },
    options: [], ending: true, endingType: 'shadow',
    endingText: { de: '🌑 **Ende: Schatten** — Macht durch Kompromiss. Zu welchem Preis?', en: '🌑 **Ending: Shadow** — Power through compromise. At what cost?' },
  },
};