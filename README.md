# NexuRealms — Interactive Story Bot

A professional Discord bot that provides a fully interactive, procedurally generated story experience using **Discord Components V2** — no AI, no external APIs, everything is local and rule-based.

---

## Features

- 📖 Branching story with 10 scenes across 2 chapters
- 🗳️ Community voting on decisions via buttons (5 min window)
- 🎲 Procedural text variation from local building blocks (no AI)
- 💾 Per-server progress saved in SQLite
- 🎨 Full Discord Components V2 UI (TextDisplay, Container, Separator, Buttons)
- 🌐 Multi-server ready (public bot)

---

## Setup

### 1. Clone & Install

```bash
git clone https://github.com/Moritz45356/NexuRealms.git
cd NexuRealms
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Fill in DISCORD_TOKEN and CLIENT_ID in .env
```

### 3. Deploy Slash Commands

```bash
npm run deploy
```

### 4. Start the Bot

```bash
npm start
```

---

## Slash Commands

| Command | Description |
|---|---|
| `/setup channel` | Set the story channel for this server |
| `/setup interval` | Set story event interval (minutes) |
| `/story start` | Start or resume the story |
| `/story pause` | Pause automatic story events |
| `/story reset` | Reset all story progress |
| `/story status` | Show current story progress |
| `/history` | Show past decisions |
| `/characters` | Show known characters & factions |
| `/nextevent` | Show when the next story event fires |

---

## How the Rule-Based Text System Works

NexuRealms generates story text **without any AI** using a layered building block system:

### Building Blocks (`story/textBlocks.js`)
Each block category contains an array of strings:
- **locations** — "the dimly lit control room", "a narrow maintenance tunnel"
- **moods** — "An oppressive silence fills the air.", "The tension is almost tangible."
- **events** — "A distant alarm begins to wail.", "Lights flicker violently."
- **reactions** — "The group freezes in place.", "Someone whispers a warning."
- **consequences** — "Every second matters now.", "There is no going back."

### Scene Nodes (`story/scenes.js`)
Each scene has:
- A fixed `baseText` (the core narrative)
- An `introVariants[]` array for variable openings
- Conditions and flags that gate choices
- Pointers to next scenes based on decisions

### Generation Function (`services/textEngine.js`)
`generateSceneText(scene, guildState)` assembles the final text:
1. Picks a random intro variant (avoiding recent repeats tracked in DB)
2. Injects a contextual mood and event line
3. Appends the fixed base narrative
4. Optionally appends a consequence line based on active story flags

### Rendering (`services/renderer.js`)
`renderStoryMessage(scene, guildState)` builds the full Components V2 message:
- `ContainerBuilder` wrapping the entire story card
- `TextDisplayBuilder` for title, body, and metadata
- `SeparatorBuilder` between sections
- `ActionRowBuilder` with `ButtonBuilder` for each decision option
- `MessageFlags.IsComponentsV2` flag set on every story message

This separation means story writers only need to edit `story/scenes.js` and `story/textBlocks.js` to add new content.
