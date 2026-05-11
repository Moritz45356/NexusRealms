export const scenes = {
  scene_001: {
    id: 'scene_001',
    chapter: 1,
    title: 'Kapitel 1 · Das Erwachen',
    introVariants: [
      'Der Zugang zur verlassenen Nexus-Anlage steht zum ersten Mal seit Jahren offen.',
      'Mit einem dumpfen Krachen gleitet das äußere Tor der Nexus-Anlage auf.',
      'Vor euch öffnet sich die erste Schleuse eines Ortes, der längst vergessen sein sollte.',
    ],
    baseText:
      'Mara hebt die Hand zum Zeichen, langsamer zu werden. Vor euch liegt der Kernsektor der Anlage — dunkel, still und doch nicht leer. Iven checkt seine Ausrüstung. Die nächste Entscheidung bestimmt, welchen Teil der Anlage ihr zuerst sichert.',
    discoverCharacters: ['Mara Voss', 'Iven Krail'],
    options: [
      {
        id: 'approach_control',
        label: 'Kontrollraum sichern',
        nextSceneId: 'scene_002',
        setFlags: { chose_control: true },
      },
      {
        id: 'enter_archive',
        label: 'Archiv untersuchen',
        nextSceneId: 'scene_003',
        setFlags: { chose_archive: true },
      },
    ],
  },

  scene_002: {
    id: 'scene_002',
    chapter: 1,
    title: 'Kapitel 1 · Kontrollraum',
    introVariants: [
      'Der Kontrollraum ist von alten Monitoren und zerborstenen Glasflächen umgeben.',
      'Zwischen knisternden Leitungen und toten Bildschirmen wirkt der Raum wie eingefroren.',
      'Staub auf jedem Pult, zersplittertes Glas am Boden — der Raum erzahlt von einem abrupten Ende.',
    ],
    baseText:
      'Iven entdeckt ein Notfallsystem, das Teile der Anlage wieder mit Energie versorgen könnte. Doch der Zugriff ist instabil — ein falscher Impuls könnte eine automatische Sicherheitssequenz auslösen.',
    options: [
      {
        id: 'restore_power',
        label: 'Notstrom aktivieren',
        nextSceneId: 'scene_004',
        setFlags: { power_restored: true },
      },
      {
        id: 'stay_dark',
        label: 'Im Dunkeln bleiben',
        nextSceneId: 'scene_005',
        setFlags: { stayed_dark: true },
      },
    ],
  },

  scene_003: {
    id: 'scene_003',
    chapter: 1,
    title: 'Kapitel 1 · Das Archiv',
    introVariants: [
      'Staub liegt auf endlosen Regalreihen voller versiegelter Datenträger.',
      'Das Archiv riecht nach Metall, Papier und jahrelang eingeschlossener Luft.',
      'Tausende Dateien, physisch und digital — und die meisten offenbar absichtlich zurückgelassen.',
    ],
    baseText:
      'Zwischen beschädigten Protokollen findet Mara Hinweise auf ein Projekt mit dem Namen \u201eHelix-Kern\u201c. Gleichzeitig taucht das Symbol einer unbekannten Fraktion mehrfach in den Akten auf.',
    discoverCharacters: ['Der Schattenzirkel'],
    options: [
      {
        id: 'take_records',
        label: 'Akten sichern',
        nextSceneId: 'scene_005',
        setFlags: { has_records: true },
      },
      {
        id: 'trace_symbol',
        label: 'Symbol zurückverfolgen',
        nextSceneId: 'scene_006',
        setFlags: { traced_symbol: true },
      },
    ],
  },

  scene_004: {
    id: 'scene_004',
    chapter: 1,
    title: 'Kapitel 1 · Energie im Netz',
    introVariants: [
      'Mit einem Ruck fährt Strom durch das alte System.',
      'Sekundenlang fluten neue Lichtstreifen die verlassenen Korridore.',
      'Das Brummen der reaktivierten Leitungen erfüllt den gesamten Sektor.',
    ],
    baseText:
      'Die Aktivierung belebt große Teile der Anlage — und weckt offensichtlich mehr als nur Technik. Mehrere verschlossene Sektoren werden zugänglich, doch ein Sicherheitsprotokoll startet im Hintergrund.',
    options: [
      {
        id: 'follow_signal',
        label: 'Signalquelle lokalisieren',
        nextSceneId: 'scene_006',
        setFlags: { alert_triggered: true },
      },
      {
        id: 'seal_sections',
        label: 'Bereiche sofort verriegeln',
        nextSceneId: 'scene_007',
        setFlags: { defensive_posture: true },
      },
    ],
  },

  scene_005: {
    id: 'scene_005',
    chapter: 1,
    title: 'Kapitel 1 · Stimmen im Dunkeln',
    introVariants: [
      'Ohne zusätzliche Energie bleibt euch nur das Echo eurer Schritte.',
      'Das Dunkel verschluckt jede Kontur jenseits des nächsten Gangs.',
      'Taschenlampen werfen lange Schatten — und lassen noch längere entstehen.',
    ],
    baseText:
      'Aus einem angrenzenden Tunnel dringt ein kaum verständliches Flüstern. Mara ist sicher: dort wartet etwas — oder jemand — auf euch. Die Entscheidung, wie ihr reagiert, kann den weiteren Verlauf grundlegend verändern.',
    options: [
      {
        id: 'investigate_whispers',
        label: 'Den Stimmen folgen',
        nextSceneId: 'scene_006',
        setFlags: { followed_whispers: true },
      },
      {
        id: 'fortify_position',
        label: 'Position absichern',
        nextSceneId: 'scene_007',
        setFlags: { fortified: true },
      },
    ],
  },

  scene_006: {
    id: 'scene_006',
    chapter: 2,
    title: 'Kapitel 2 · Der verborgene Kern',
    introVariants: [
      'Tief unter der Anlage endet der Weg an einer kreisförmigen Kernkammer.',
      'Hinter einer schweren Schleuse eröffnet sich ein Raum voller alter Reaktorringe.',
      'Die Kammer ist großer als erwartet — und offensichtlich noch in Betrieb.',
    ],
    baseText:
      'Im Zentrum ruht der Helix-Kern — eine Maschine, die offenbar mehr speichert als nur Energie. Gleichzeitig entdeckt die Gruppe Spuren des Schattenzirkels an mehreren Konsolen. Irgendjemand war kürzlich hier.',
    discoverCharacters: ['Direktorat Helix'],
    options: [
      {
        id: 'sync_core',
        label: 'Kern synchronisieren',
        nextSceneId: 'scene_008',
        setFlags: { synced_core: true },
      },
      {
        id: 'sabotage_core',
        label: 'Kern sabotieren',
        nextSceneId: 'scene_009',
        setFlags: { sabotaged_core: true },
      },
    ],
  },

  scene_007: {
    id: 'scene_007',
    chapter: 2,
    title: 'Kapitel 2 · Belagerung',
    introVariants: [
      'Die Anlage antwortet auf eure Maßnahmen mit hektischen Systemmeldungen.',
      'Mehrere Türen verriegeln gleichzeitig, als würde der Komplex selbst reagieren.',
      'Rote Warnsymbole fluten jeden noch aktiven Bildschirm.',
    ],
    baseText:
      'Durch eure defensive Entscheidung verschafft sich die Gruppe Zeit — doch nun ist klar, dass ein anderer Akteur ebenfalls um die Kontrolle kämpft. Ihr seid nicht allein in der Anlage.',
    options: [
      {
        id: 'break_out',
        label: 'Ausbruch wagen',
        nextSceneId: 'scene_006',
        setFlags: { breakout_attempted: true },
      },
      {
        id: 'open_channel',
        label: 'Kontaktversuch starten',
        nextSceneId: 'scene_010',
        setFlags: { opened_channel: true },
      },
    ],
  },

  scene_008: {
    id: 'scene_008',
    chapter: 2,
    title: 'Kapitel 2 · Resonanz',
    introVariants: [
      'Ein tiefes, vibrierendes Summen erfüllt die Kammer.',
      'Die Anzeigen des Helix-Kerns erwachen in synchronem Licht.',
      'Die Synchronisierung beginnt — und mit ihr öffnet sich etwas, das lange verschlossen war.',
    ],
    baseText:
      'Die Synchronisierung klappt. Fragmente alter Protokolle, Sicherheitsmuster und verschlüsselte Stimmen werden freigelegt. Die Anlage erkennt euch nun als berechtigte Instanz — vorerst. Was ihr damit anfangt, bleibt eure Entscheidung.',
    options: [],
    ending: true,
  },

  scene_009: {
    id: 'scene_009',
    chapter: 2,
    title: 'Kapitel 2 · Bruchlinie',
    introVariants: [
      'Der erste Sabotageimpuls fährt wie ein Riss durch das System.',
      'Warnanzeigen schießen in roter Folge über die zentrale Konsole.',
      'Der Kern reagiert mit einem langen, tiefen Ton — und dann Stille.',
    ],
    baseText:
      'Der Helix-Kern destabilisiert sich. Damit verhindert ihr seinen Missbrauch, verliert jedoch auch die Chance, seine Geheimnisse vollständig zu entschlüsseln. Manche Dinge bleiben besser vergraben.',
    options: [],
    ending: true,
  },

  scene_010: {
    id: 'scene_010',
    chapter: 2,
    title: 'Kapitel 2 · Die Antwort',
    introVariants: [
      'Auf dem offenen Kanal meldet sich nach langem Rauschen endlich eine Stimme.',
      'Zwischen Störimpulsen formt sich eine klare, kalte Übertragung.',
      'Die Stimme ist ruhig. Fast zu ruhig für die Situation.',
    ],
    baseText:
      'Die unbekannte Gegenpartei bietet einen Handel an: Zugang gegen Loyalität. Ihr erkennt, dass dies nur der Beginn eines größeren Konflikts ist. Wie ihr antwortet, legt euren Kurs für das fest, was als Nächstes kommt.',
    options: [
      {
        id: 'accept_parley',
        label: 'Verhandlung annehmen',
        nextSceneId: 'scene_008',
        setFlags: { negotiated: true },
      },
      {
        id: 'reject_parley',
        label: 'Kontakt abbrechen',
        nextSceneId: 'scene_009',
        setFlags: { rejected_parley: true },
      },
    ],
  },
};

export function getScene(sceneId) {
  return scenes[sceneId] || null;
}
