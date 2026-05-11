export const nexusScenes = {
  nexus_001: {
    id: 'nexus_001', chapter: 1,
    title: { de: 'Kapitel 1 · Das Erwachen', en: 'Chapter 1 · The Awakening' },
    introVariants: {
      de: [
        'Stille. Dann ein Puls — als würde die Welt selbst atmen.',
        'Das Nexus erwacht selten. Heute ist es anders.',
      ],
      en: [
        'Silence. Then a pulse — as if the world itself is breathing.',
        'The Nexus rarely awakens. Today is different.',
      ],
    },
    baseText: {
      de: 'Ihr steht am Rand des Nexus-Kerns — dem Ursprung aller Realitäten. Ein Riss im Gefüge zieht eure Aufmerksamkeit auf sich. Links führt ein Pfad in die Tiefe des Kerns. Rechts liegt die Verbindungsbrücke zu den anderen Universen.',
      en: "You stand at the edge of the Nexus Core — the origin of all realities. A tear in the fabric draws your attention. Left leads a path into the core's depth. To the right lies the connection bridge to other universes.",
    },
    discoverCharacters: [
      {
        name: { de: 'Lyra', en: 'Lyra' },
        role: { de: 'Nexus-Wächterin', en: 'Nexus Guardian' },
        faction: { de: 'Die Hüter', en: 'The Keepers' },
        description: { de: 'Eine der letzten Wächterinnen des Gleichgewichts. Ihre Augen spiegeln alle Realitäten wider.', en: 'One of the last guardians of balance. Her eyes reflect all realities.' },
      },
    ],
    options: [
      { id: 'enter_core',  label: { de: 'In den Kern vordringen', en: 'Advance into the core' }, nextSceneId: 'nexus_002', setFlags: { chose_core: true } },
      { id: 'take_bridge', label: { de: 'Brücke überqueren', en: 'Cross the bridge' },            nextSceneId: 'nexus_003', setFlags: { chose_bridge: true } },
    ],
  },

  nexus_002: {
    id: 'nexus_002', chapter: 2,
    title: { de: 'Kapitel 2 · Herz der Realität', en: 'Chapter 2 · Heart of Reality' },
    introVariants: {
      de: [
        'Im Kern pulsiert Energie in Farben, für die es keine Namen gibt.',
        'Realität ist hier formbar — jeder Gedanke hinterlässt Spuren.',
      ],
      en: [
        'In the core, energy pulses in colors for which there are no names.',
        'Reality is malleable here — every thought leaves traces.',
      ],
    },
    baseText: {
      de: 'Lyra erklärt: Der Kern ist instabil. Jemand hat versucht, ihn zu manipulieren. Ein Datenfragment schwebt vor euch — es zeigt Koordinaten. Ihr könnt es analysieren oder direkt in das Datenstrom-Archiv einspeisen.',
      en: 'Lyra explains: the core is unstable. Someone tried to manipulate it. A data fragment floats before you — it shows coordinates. You can analyze it or feed it directly into the data stream archive.',
    },
    options: [
      { id: 'analyze',      label: { de: 'Fragment analysieren', en: 'Analyze the fragment' }, nextSceneId: 'nexus_004', setFlags: { analyzed_fragment: true } },
      { id: 'feed_archive', label: { de: 'Ins Archiv einspeisen', en: 'Feed into archive' },   nextSceneId: 'nexus_005', setFlags: { fed_archive: true } },
    ],
  },

  nexus_003: {
    id: 'nexus_003', chapter: 2,
    title: { de: 'Kapitel 2 · Die Brücke', en: 'Chapter 2 · The Bridge' },
    introVariants: {
      de: [
        'Die Brücke besteht aus reiner Energie — unter euch liegt Leere.',
        'Jeder Schritt auf der Brücke hinterlässt ein Echo in anderen Realitäten.',
      ],
      en: [
        'The bridge is made of pure energy — beneath you lies the void.',
        'Every step on the bridge leaves an echo in other realities.',
      ],
    },
    baseText: {
      de: 'In der Mitte der Brücke begegnet ihr einem Unbekannten — er trägt das Zeichen der Nexus-Brecher. Er behauptet, Informationen über den Verrat an den Hütern zu haben.',
      en: 'At the middle of the bridge you encounter a stranger — he bears the mark of the Nexus Breakers. He claims to have information about the betrayal of the Keepers.',
    },
    discoverCharacters: [
      {
        name: { de: 'Kairo', en: 'Kairo' },
        role: { de: 'Nexus-Brecher', en: 'Nexus Breaker' },
        faction: { de: 'Die Brecher', en: 'The Breakers' },
        description: { de: 'Ein Rebell, der glaubt, das Nexus müsse zerstört werden, um die Realitäten zu befreien.', en: 'A rebel who believes the Nexus must be destroyed to free the realities.' },
      },
    ],
    options: [
      { id: 'trust_kairo',   label: { de: 'Kairo vertrauen', en: 'Trust Kairo' },   nextSceneId: 'nexus_004', setFlags: { trusted_kairo: true } },
      { id: 'capture_kairo', label: { de: 'Kairo festhalten', en: 'Capture Kairo' }, nextSceneId: 'nexus_006', setFlags: { captured_kairo: true } },
    ],
  },

  nexus_004: {
    id: 'nexus_004', chapter: 3,
    title: { de: 'Kapitel 3 · Der Verrat', en: 'Chapter 3 · The Betrayal' },
    introVariants: {
      de: [
        'Die Daten lügen nicht. Jemand innerhalb der Hüter ist der Verräter.',
        'Lyras Gesicht wird steinern, als die Wahrheit ans Licht kommt.',
      ],
      en: [
        'The data does not lie. Someone within the Keepers is the traitor.',
        "Lyra's face becomes stony as the truth comes to light.",
      ],
    },
    baseText: {
      de: 'Die Koordinaten führen zu einem verborgenen Labor — tief im Nexus-Kern. Dort wird eine Waffe gebaut, die das gesamte Nexus neu beschreiben könnte. Ihr habt zwei Möglichkeiten: das Labor infiltrieren oder die anderen Hüter warnen.',
      en: 'The coordinates lead to a hidden laboratory — deep in the Nexus Core. There, a weapon is being built that could rewrite the entire Nexus. You have two options: infiltrate the lab or warn the other Keepers.',
    },
    options: [
      { id: 'infiltrate',   label: { de: 'Labor infiltrieren', en: 'Infiltrate the lab' }, nextSceneId: 'nexus_007', setFlags: { infiltrated_lab: true } },
      { id: 'warn_keepers', label: { de: 'Hüter warnen', en: 'Warn the Keepers' },         nextSceneId: 'nexus_008', setFlags: { warned_keepers: true } },
    ],
  },

  nexus_005: {
    id: 'nexus_005', chapter: 3,
    title: { de: 'Kapitel 3 · Das Archiv erwacht', en: 'Chapter 3 · The Archive Awakens' },
    introVariants: {
      de: [
        'Das Archiv nimmt das Fragment auf — und reagiert unerwartet.',
        'Millionen Datenpunkte reorganisieren sich in Sekunden.',
      ],
      en: [
        'The archive absorbs the fragment — and reacts unexpectedly.',
        'Millions of data points reorganize themselves in seconds.',
      ],
    },
    baseText: {
      de: 'Das Archiv rekonstruiert eine gelöschte Erinnerung: ein Hüter hat das Nexus absichtlich geschwächt — um etwas einzusperren, das vorher frei war. Jetzt wisst ihr mehr, als ihr wolltet.',
      en: 'The archive reconstructs a deleted memory: a Keeper deliberately weakened the Nexus — to imprison something that was once free. Now you know more than you wanted to.',
    },
    options: [
      { id: 'free_entity', label: { de: 'Das Eingesperrte befreien', en: 'Free the imprisoned' }, nextSceneId: 'nexus_009', setFlags: { freed_entity: true } },
      { id: 'reseal',      label: { de: 'Versiegelung verstärken', en: 'Reinforce the seal' },    nextSceneId: 'nexus_008', setFlags: { resealed: true } },
    ],
  },

  nexus_006: {
    id: 'nexus_006', chapter: 3,
    title: { de: 'Kapitel 3 · Verhör', en: 'Chapter 3 · Interrogation' },
    introVariants: {
      de: [
        'Kairo ist gefangen. Er lächelt — als hätte er damit gerechnet.',
        'Hinter seinen Augen liegt mehr Wissen als Angst.',
      ],
      en: [
        'Kairo is captured. He smiles — as if he expected this.',
        'Behind his eyes lies more knowledge than fear.',
      ],
    },
    baseText: {
      de: 'Kairo spricht freiwillig: Die Hüter selbst sind das Problem. Sie kontrollieren das Nexus nicht — sie missbrauchen es. Er bietet einen Deal an: seine Hilfe gegen seine Freiheit.',
      en: 'Kairo speaks freely: the Keepers themselves are the problem. They do not control the Nexus — they abuse it. He offers a deal: his help in exchange for his freedom.',
    },
    options: [
      { id: 'accept_deal', label: { de: 'Deal annehmen', en: 'Accept deal' }, nextSceneId: 'nexus_007', setFlags: { kairo_ally: true } },
      { id: 'reject_deal', label: { de: 'Deal ablehnen', en: 'Reject deal' }, nextSceneId: 'nexus_008', setFlags: { kairo_prisoner: true } },
    ],
  },

  nexus_007: {
    id: 'nexus_007', chapter: 4,
    title: { de: 'Kapitel 4 · Im Herzstück', en: 'Chapter 4 · At the Core' },
    introVariants: {
      de: [
        'Das Labor ist riesig. Die Waffe — fast fertig.',
        'Es riecht nach verbrannter Realität. Der Luftzug stammt aus einem anderen Universum.',
      ],
      en: [
        'The laboratory is vast. The weapon — nearly complete.',
        'It smells of burned reality. The breeze comes from another universe.',
      ],
    },
    baseText: {
      de: 'Der Verräter ist kein Unbekannter — es ist Lyra selbst. Sie glaubt, das Nexus neu schreiben zu müssen, um alle Realitäten zu retten. Die Waffe ist das Werkzeug. Ihr müsst entscheiden: Sie aufhalten oder ihr zuhören.',
      en: 'The traitor is no stranger — it is Lyra herself. She believes the Nexus must be rewritten to save all realities. The weapon is the tool. You must decide: stop her or hear her out.',
    },
    options: [
      { id: 'stop_lyra', label: { de: 'Lyra aufhalten', en: 'Stop Lyra' },    nextSceneId: 'nexus_ending_order',   setFlags: { stopped_lyra: true } },
      { id: 'hear_lyra', label: { de: 'Lyra anhören', en: 'Hear Lyra out' },  nextSceneId: 'nexus_ending_rewrite', setFlags: { heard_lyra: true } },
    ],
  },

  nexus_008: {
    id: 'nexus_008', chapter: 4,
    title: { de: 'Kapitel 4 · Rat der Hüter', en: 'Chapter 4 · Council of Keepers' },
    introVariants: {
      de: [
        'Der Rat hört zu — aber Misstrauen liegt in der Luft.',
        'Jahrtausende alter Stolz trifft auf neue Wahrheiten.',
      ],
      en: [
        'The Council listens — but distrust hangs in the air.',
        'Millennia-old pride meets new truths.',
      ],
    },
    baseText: {
      de: 'Der Rat ist gespalten. Eine Fraktion will handeln, die andere zweifelt. Die Zeit läuft ab — die Waffe wird bald aktiviert. Ihr habt das letzte Wort.',
      en: 'The Council is divided. One faction wants to act, the other doubts. Time is running out — the weapon will be activated soon. You have the final word.',
    },
    options: [
      { id: 'rally_council', label: { de: 'Rat einigen', en: 'Unite the council' }, nextSceneId: 'nexus_ending_order',    setFlags: { rallied_council: true } },
      { id: 'act_alone',     label: { de: 'Allein handeln', en: 'Act alone' },      nextSceneId: 'nexus_ending_solitary', setFlags: { acted_alone: true } },
    ],
  },

  nexus_009: {
    id: 'nexus_009', chapter: 4,
    title: { de: 'Kapitel 4 · Das Befreite', en: 'Chapter 4 · The Freed' },
    introVariants: {
      de: [
        'Es hat keinen Namen. Aber es erinnert sich an alles.',
        'Uralte Energie — älter als das Nexus selbst.',
      ],
      en: [
        'It has no name. But it remembers everything.',
        'Ancient energy — older than the Nexus itself.',
      ],
    },
    baseText: {
      de: 'Das eingesperrte Wesen ist keine Bedrohung — es war ein Opfer. Es kennt den wahren Ursprung des Nexus und bietet sein Wissen an. Aber Wissen dieser Art hat immer einen Preis.',
      en: 'The imprisoned entity is no threat — it was a victim. It knows the true origin of the Nexus and offers its knowledge. But knowledge of this kind always has a price.',
    },
    options: [
      { id: 'accept_knowledge', label: { de: 'Wissen annehmen', en: 'Accept the knowledge' }, nextSceneId: 'nexus_ending_rewrite',  setFlags: { accepted_knowledge: true } },
      { id: 'refuse_knowledge', label: { de: 'Ablehnen', en: 'Refuse' },                      nextSceneId: 'nexus_ending_solitary', setFlags: { refused_knowledge: true } },
    ],
  },

  nexus_ending_order: {
    id: 'nexus_ending_order', chapter: 5,
    title: { de: 'Kapitel 5 · Die Ordnung hält', en: 'Chapter 5 · Order Holds' },
    introVariants: {
      de: ['Das Nexus stabilisiert sich. Die Hüter trauern.'],
      en: ['The Nexus stabilizes. The Keepers mourn.'],
    },
    baseText: {
      de: 'Lyras Plan ist gescheitert. Das Nexus bleibt bestehen — mit all seinen Fehlern. Manche nennen das Sieg.',
      en: "Lyra's plan has failed. The Nexus persists — with all its flaws. Some call that victory.",
    },
    options: [], ending: true, endingType: 'order',
    endingText: {
      de: '⚖️ **Ende: Ordnung** — Das Nexus überdauert. Aber die Frage bleibt: War es das Richtige?',
      en: '⚖️ **Ending: Order** — The Nexus endures. But the question remains: was it right?',
    },
  },

  nexus_ending_rewrite: {
    id: 'nexus_ending_rewrite', chapter: 5,
    title: { de: 'Kapitel 5 · Neues Nexus', en: 'Chapter 5 · New Nexus' },
    introVariants: {
      de: ['Die Realitäten zittern — und ordnen sich neu.'],
      en: ['The realities tremble — and rearrange themselves.'],
    },
    baseText: {
      de: 'Das Nexus wird neu geschrieben. Was verloren geht, weiß niemand. Was gewonnen wird, auch nicht.',
      en: 'The Nexus is rewritten. What is lost, no one knows. What is gained, neither.',
    },
    options: [], ending: true, endingType: 'rewrite',
    endingText: {
      de: '🔄 **Ende: Neuschreibung** — Eine neue Realität. Ein unbekanntes Morgen.',
      en: '🔄 **Ending: Rewrite** — A new reality. An unknown tomorrow.',
    },
  },

  nexus_ending_solitary: {
    id: 'nexus_ending_solitary', chapter: 5,
    title: { de: 'Kapitel 5 · Allein im Nexus', en: 'Chapter 5 · Alone in the Nexus' },
    introVariants: {
      de: ['Alle sind gegangen. Nur ihr seid noch da.'],
      en: ['Everyone has gone. Only you remain.'],
    },
    baseText: {
      de: 'Ihr habt das Nexus gerettet — aber diejenigen, die ihr retten wolltet, sind nicht mehr da. Macht ohne Zweck ist nur Stille.',
      en: 'You saved the Nexus — but those you wanted to save are no longer there. Power without purpose is only silence.',
    },
    options: [], ending: true, endingType: 'solitary',
    endingText: {
      de: '🌌 **Ende: Einsamkeit** — Das Nexus lebt. Aber zu welchem Preis?',
      en: '🌌 **Ending: Solitary** — The Nexus lives. But at what cost?',
    },
  },
};
