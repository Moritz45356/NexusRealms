export const ashfallScenes = {
  ashfall_001: {
    id: 'ashfall_001', chapter: 1,
    title: { de: 'Kapitel 1 · Die Ödnis', en: 'Chapter 1 · The Wasteland' },
    introVariants: {
      de: ['Asche so weit das Auge reicht. Irgendwo dahinter: Überleben.', 'Die Strahlung hat alles verändert — Mensch, Tier, Land.'],
      en: ['Ash as far as the eye can see. Somewhere beyond: survival.', 'Radiation has changed everything — human, animal, land.'],
    },
    baseText: {
      de: 'Euer Klan steht vor einer Weggabelung: das alte Forschungslabor oder die Klansiedlung im Norden.',
      en: 'Your clan stands at a crossroads: the old research lab or the clan settlement to the north.',
    },
    discoverCharacters: [
      { name: { de: 'Reva', en: 'Reva' }, role: { de: 'Kundschafterin', en: 'Scout' }, faction: { de: 'Euer Klan', en: 'Your Clan' }, description: { de: 'Schnell, misstrauisch, überlebt hat sie alleine.', en: 'Fast, suspicious, she survived alone.' } },
    ],
    options: [
      { id: 'lab',        label: { de: 'Labor erkunden', en: 'Explore the lab' },         nextSceneId: 'ashfall_002', setFlags: { went_lab: true } },
      { id: 'settlement', label: { de: 'Siedlung aufsuchen', en: 'Head to settlement' },  nextSceneId: 'ashfall_003', setFlags: { went_settlement: true } },
    ],
  },
  ashfall_002: {
    id: 'ashfall_002', chapter: 2,
    title: { de: 'Kapitel 2 · Kontaminiertes Wissen', en: 'Chapter 2 · Contaminated Knowledge' },
    introVariants: {
      de: ['Das Labor steht noch — erstaunlich für diese Zeit.', 'Geräte laufen noch. Wer hat sie am Leben gehalten?'],
      en: ['The lab still stands — remarkable for this era.', 'Equipment is still running. Who kept it alive?'],
    },
    baseText: {
      de: 'Ihr findet Pläne für eine Wasserreinigungsanlage — und Beweise, dass jemand die Katastrophe vorhersah.',
      en: 'You find plans for a water purification plant — and evidence that someone foresaw the disaster.',
    },
    options: [
      { id: 'take_plans',  label: { de: 'Pläne sichern', en: 'Secure the plans' },          nextSceneId: 'ashfall_004', setFlags: { has_plans: true } },
      { id: 'find_person', label: { de: 'Wissenschaftler suchen', en: 'Find the scientist' },nextSceneId: 'ashfall_005', setFlags: { seeks_scientist: true } },
    ],
  },
  ashfall_003: {
    id: 'ashfall_003', chapter: 2,
    title: { de: 'Kapitel 2 · Rivalen', en: 'Chapter 2 · Rivals' },
    introVariants: {
      de: ['Die Siedlung lebt — aber unter der Kontrolle des Stahlklans.', 'Bewaffnete Wachen. Misstrauische Blicke.'],
      en: ['The settlement lives — but under the control of the Steel Clan.', 'Armed guards. Suspicious looks.'],
    },
    baseText: {
      de: 'Der Stahlklan verlangt Abgaben für Wasser und Schutz. Verhandeln oder kämpfen?',
      en: 'The Steel Clan demands tribute for water and protection. Negotiate or fight?',
    },
    discoverCharacters: [
      { name: { de: 'Warlord Kross', en: 'Warlord Kross' }, role: { de: 'Antagonist', en: 'Antagonist' }, faction: { de: 'Stahlklan', en: 'Steel Clan' }, description: { de: 'Brutal und effektiv. Macht durch Angst.', en: 'Brutal and effective. Power through fear.' } },
    ],
    options: [
      { id: 'negotiate', label: { de: 'Verhandeln', en: 'Negotiate' }, nextSceneId: 'ashfall_004', setFlags: { negotiated_kross: true } },
      { id: 'sabotage',  label: { de: 'Sabotieren', en: 'Sabotage' }, nextSceneId: 'ashfall_006', setFlags: { sabotaged_kross: true } },
    ],
  },
  ashfall_004: {
    id: 'ashfall_004', chapter: 3,
    title: { de: 'Kapitel 3 · Wasserkrieg', en: 'Chapter 3 · Water War' },
    introVariants: {
      de: ['Wasser ist Macht. Wer es kontrolliert, kontrolliert alles.', 'Die Anlage läuft — aber nicht lange, wenn der Stahlklan eingreift.'],
      en: ['Water is power. Who controls it controls everything.', 'The plant runs — but not for long if the Steel Clan intervenes.'],
    },
    baseText: {
      de: 'Die Reinigungsanlage kann gebaut werden. Aber der Stahlklan wird alles tun, um das zu verhindern.',
      en: 'The purification plant can be built. But the Steel Clan will do everything to prevent it.',
    },
    options: [
      { id: 'build_openly',  label: { de: 'Offen bauen und verteidigen', en: 'Build openly and defend' }, nextSceneId: 'ashfall_007', setFlags: { open_conflict: true } },
      { id: 'build_hidden',  label: { de: 'Heimlich bauen', en: 'Build in secret' },                      nextSceneId: 'ashfall_008', setFlags: { built_hidden: true } },
    ],
  },
  ashfall_005: {
    id: 'ashfall_005', chapter: 3,
    title: { de: 'Kapitel 3 · Die Wissenschaftlerin', en: 'Chapter 3 · The Scientist' },
    introVariants: {
      de: ['Sie lebt. Das allein ist ein Wunder.', 'Dr. Yara hat die Ödnis überlebt — und sie weiß warum es passiert ist.'],
      en: ['She is alive. That alone is a miracle.', 'Dr. Yara survived the wasteland — and she knows why it happened.'],
    },
    baseText: {
      de: 'Dr. Yara kennt die Wahrheit über die Katastrophe — und sie ist bereit, sie zu teilen. Für einen Preis.',
      en: 'Dr. Yara knows the truth about the disaster — and is willing to share it. For a price.',
    },
    discoverCharacters: [
      { name: { de: 'Dr. Yara', en: 'Dr. Yara' }, role: { de: 'Wissenschaftlerin', en: 'Scientist' }, faction: { de: 'Keine', en: 'None' }, description: { de: 'Überlebende des alten Regimes. Trägt Schuld mit sich.', en: 'Survivor of the old regime. Carries guilt.' } },
    ],
    options: [
      { id: 'help_yara',   label: { de: 'Yarás Bedingung akzeptieren', en: 'Accept Yara\'s condition' }, nextSceneId: 'ashfall_007', setFlags: { allied_yara: true } },
      { id: 'reject_yara', label: { de: 'Ablehnen', en: 'Reject' },                                     nextSceneId: 'ashfall_006', setFlags: { rejected_yara: true } },
    ],
  },
  ashfall_006: {
    id: 'ashfall_006', chapter: 3,
    title: { de: 'Kapitel 3 · Schatten und Rauch', en: 'Chapter 3 · Shadow and Smoke' },
    introVariants: {
      de: ['Der Angriff war erfolgreich — aber der Preis war hoch.', 'Feuer im Norden. Das war nicht der Plan.'],
      en: ['The attack was successful — but the price was high.', 'Fire in the north. That was not the plan.'],
    },
    baseText: {
      de: 'Der Stahlklan ist geschwächt — aber nicht besiegt. Und nun suchen sie nach Schuldigen.',
      en: 'The Steel Clan is weakened — but not defeated. And now they are looking for those to blame.',
    },
    options: [
      { id: 'hide',        label: { de: 'Untertauchen', en: 'Go into hiding' },     nextSceneId: 'ashfall_008', setFlags: { went_underground: true } },
      { id: 'rally_clans', label: { de: 'Klans vereinen', en: 'Unite the clans' }, nextSceneId: 'ashfall_007', setFlags: { rallied_clans: true } },
    ],
  },
  ashfall_007: {
    id: 'ashfall_007', chapter: 4,
    title: { de: 'Kapitel 4 · Die letzte Schlacht', en: 'Chapter 4 · The Last Battle' },
    introVariants: {
      de: ['Alle Klans haben sich versammelt. Das war nie zuvor möglich.', 'Der Horizont ist orange — Feuer oder Morgenrot?'],
      en: ['All clans have assembled. This was never possible before.', 'The horizon is orange — fire or dawn?'],
    },
    baseText: {
      de: 'Der Stahlklan steht euch gegenüber. Eine letzte Konfrontation. Die Ödnis schaut zu.',
      en: 'The Steel Clan faces you. One final confrontation. The wasteland watches.',
    },
    options: [
      { id: 'charge',    label: { de: 'Direktangriff', en: 'Direct assault' },   nextSceneId: 'ashfall_end_war', setFlags: { war_ending: true } },
      { id: 'negotiate', label: { de: 'Letzte Verhandlung', en: 'Last negotiation' }, nextSceneId: 'ashfall_end_peace', setFlags: { peace_ending: true } },
    ],
  },
  ashfall_008: {
    id: 'ashfall_008', chapter: 4,
    title: { de: 'Kapitel 4 · Im Verborgenen', en: 'Chapter 4 · In Hiding' },
    introVariants: {
      de: ['Untergrund. Stille. Pläne schmieden.', 'Im Dunkeln wirken kleine Kräfte manchmal am stärksten.'],
      en: ['Underground. Silence. Forming plans.', 'In the dark, small forces sometimes work best.'],
    },
    baseText: {
      de: 'Die Anlage wird heimlich fertiggestellt. Wenn der Stahlklan es herausfindet, ist alles verloren. Oder alles gewonnen.',
      en: 'The plant is secretly completed. When the Steel Clan finds out, everything is lost. Or everything is won.',
    },
    options: [
      { id: 'reveal',  label: { de: 'Enthüllen und konfrontieren', en: 'Reveal and confront' }, nextSceneId: 'ashfall_end_war', setFlags: { revealed: true } },
      { id: 'spread',  label: { de: 'Wissen verbreiten', en: 'Spread the knowledge' },         nextSceneId: 'ashfall_end_peace', setFlags: { spread_knowledge: true } },
    ],
  },
  ashfall_end_war: {
    id: 'ashfall_end_war', chapter: 5,
    title: { de: 'Kapitel 5 · Aus der Asche', en: 'Chapter 5 · From the Ashes' },
    introVariants: { de: ['Der Rauch lichtet sich.'], en: ['The smoke clears.'] },
    baseText: { de: 'Der Stahlklan ist besiegt. Die Ödnis gehört niemandem — und allen.', en: 'The Steel Clan is defeated. The wasteland belongs to no one — and everyone.' },
    options: [], ending: true, endingType: 'war',
    endingText: { de: '⚔️ **Ende: Krieg** — Sieg durch Blut. Ob das Recht ist, entscheidet die Zukunft.', en: '⚔️ **Ending: War** — Victory through blood. Whether it is right, the future will decide.' },
  },
  ashfall_end_peace: {
    id: 'ashfall_end_peace', chapter: 5,
    title: { de: 'Kapitel 5 · Neues Wasser', en: 'Chapter 5 · New Water' },
    introVariants: { de: ['Sauberes Wasser fließt. Zum ersten Mal seit Jahren.'], en: ['Clean water flows. For the first time in years.'] },
    baseText: { de: 'Frieden — nicht perfekt, nicht sicher. Aber möglich.', en: 'Peace — not perfect, not secure. But possible.' },
    options: [], ending: true, endingType: 'peace',
    endingText: { de: '💧 **Ende: Frieden** — Wasser für alle. Ein fragiler Anfang.', en: '💧 **Ending: Peace** — Water for all. A fragile beginning.' },
  },
};