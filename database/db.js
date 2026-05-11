import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '..', 'data', 'nexurealms.db');
mkdirSync(join(__dirname, '..', 'data'), { recursive: true });

let db;

export function initDatabase() {
  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  db.exec(`
    CREATE TABLE IF NOT EXISTS guild_settings (
      guild_id          TEXT PRIMARY KEY,
      channel_id        TEXT,
      interval_mins     INTEGER DEFAULT 60,
      active            INTEGER DEFAULT 0,
      paused            INTEGER DEFAULT 0,
      next_event_ts     INTEGER DEFAULT 0,
      overview_msg_id   TEXT,
      scene_msg_id      TEXT,
      language          TEXT DEFAULT 'de',
      universe          TEXT DEFAULT NULL
    );
    CREATE TABLE IF NOT EXISTS guild_state (
      guild_id          TEXT PRIMARY KEY,
      chapter           INTEGER DEFAULT 1,
      current_scene_id  TEXT DEFAULT 'scene_001',
      story_flags       TEXT DEFAULT '{}',
      last_variants     TEXT DEFAULT '[]',
      started_at        INTEGER,
      FOREIGN KEY(guild_id) REFERENCES guild_settings(guild_id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS story_decisions (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      guild_id      TEXT NOT NULL,
      scene_id      TEXT NOT NULL,
      option_id     TEXT NOT NULL,
      option_label  TEXT NOT NULL,
      votes         INTEGER DEFAULT 0,
      decided_at    INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS active_votes (
      guild_id      TEXT PRIMARY KEY,
      scene_id      TEXT NOT NULL,
      message_id    TEXT NOT NULL,
      channel_id    TEXT NOT NULL,
      ends_at       INTEGER NOT NULL,
      votes         TEXT DEFAULT '{}'
    );
    CREATE TABLE IF NOT EXISTS known_characters (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      guild_id    TEXT NOT NULL,
      name        TEXT NOT NULL,
      role        TEXT NOT NULL,
      faction     TEXT,
      description TEXT,
      met_at      TEXT
    );
  `);

  // Safe migrations for existing databases
  const settingsCols = db.prepare('PRAGMA table_info(guild_settings)').all().map(r => r.name);
  if (!settingsCols.includes('language'))  db.exec(`ALTER TABLE guild_settings ADD COLUMN language TEXT DEFAULT 'de'`);
  if (!settingsCols.includes('universe'))  db.exec(`ALTER TABLE guild_settings ADD COLUMN universe TEXT DEFAULT NULL`);

  return db;
}

export function getDb() {
  if (!db) throw new Error('Database not initialised.');
  return db;
}

// ── Settings ─────────────────────────────────────────────────

export function getGuildSettings(guildId) {
  const d = getDb();
  let row = d.prepare('SELECT * FROM guild_settings WHERE guild_id = ?').get(guildId);
  if (!row) {
    d.prepare('INSERT OR IGNORE INTO guild_settings (guild_id) VALUES (?)').run(guildId);
    row = d.prepare('SELECT * FROM guild_settings WHERE guild_id = ?').get(guildId);
  }
  return row;
}

export function setGuildChannel(guildId, channelId) {
  getGuildSettings(guildId);
  getDb().prepare('UPDATE guild_settings SET channel_id = ? WHERE guild_id = ?').run(channelId, guildId);
}

export function setGuildInterval(guildId, minutes) {
  getGuildSettings(guildId);
  getDb().prepare('UPDATE guild_settings SET interval_mins = ? WHERE guild_id = ?').run(minutes, guildId);
}

export function setGuildActive(guildId, active) {
  getGuildSettings(guildId);
  getDb().prepare('UPDATE guild_settings SET active = ? WHERE guild_id = ?').run(active ? 1 : 0, guildId);
}

export function setGuildPaused(guildId, paused) {
  getGuildSettings(guildId);
  getDb().prepare('UPDATE guild_settings SET paused = ? WHERE guild_id = ?').run(paused ? 1 : 0, guildId);
}

export function setNextEventTs(guildId, ts) {
  getGuildSettings(guildId);
  getDb().prepare('UPDATE guild_settings SET next_event_ts = ? WHERE guild_id = ?').run(ts, guildId);
}

export function setOverviewMsgId(guildId, msgId) {
  getGuildSettings(guildId);
  getDb().prepare('UPDATE guild_settings SET overview_msg_id = ? WHERE guild_id = ?').run(msgId, guildId);
}

export function setSceneMsgId(guildId, msgId) {
  getGuildSettings(guildId);
  getDb().prepare('UPDATE guild_settings SET scene_msg_id = ? WHERE guild_id = ?').run(msgId, guildId);
}

export function setGuildLanguage(guildId, lang) {
  getGuildSettings(guildId);
  getDb().prepare('UPDATE guild_settings SET language = ? WHERE guild_id = ?').run(lang, guildId);
}

export function setGuildUniverse(guildId, universe) {
  getGuildSettings(guildId);
  getDb().prepare('UPDATE guild_settings SET universe = ? WHERE guild_id = ?').run(universe, guildId);
}

export function getAllActiveGuilds() {
  return getDb().prepare('SELECT * FROM guild_settings WHERE active = 1 AND paused = 0').all();
}

// ── State ─────────────────────────────────────────────────────

export function getGuildState(guildId) {
  const d = getDb();
  getGuildSettings(guildId);
  let row = d.prepare('SELECT * FROM guild_state WHERE guild_id = ?').get(guildId);
  if (!row) {
    d.prepare('INSERT OR IGNORE INTO guild_state (guild_id, started_at) VALUES (?, ?)').run(guildId, Date.now());
    row = d.prepare('SELECT * FROM guild_state WHERE guild_id = ?').get(guildId);
  }
  row.story_flags    = JSON.parse(row.story_flags   || '{}');
  row.last_variants  = JSON.parse(row.last_variants  || '[]');
  return row;
}

export function updateGuildScene(guildId, sceneId, chapter) {
  getDb().prepare('UPDATE guild_state SET current_scene_id = ?, chapter = ? WHERE guild_id = ?').run(sceneId, chapter, guildId);
}

export function setStoryFlag(guildId, flag, value) {
  const state = getGuildState(guildId);
  state.story_flags[flag] = value;
  getDb().prepare('UPDATE guild_state SET story_flags = ? WHERE guild_id = ?').run(JSON.stringify(state.story_flags), guildId);
}

export function updateLastVariants(guildId, variants) {
  getDb().prepare('UPDATE guild_state SET last_variants = ? WHERE guild_id = ?').run(JSON.stringify(variants.slice(-6)), guildId);
}

export function resetGuildState(guildId) {
  const d = getDb();
  d.prepare('DELETE FROM guild_state WHERE guild_id = ?').run(guildId);
  d.prepare('DELETE FROM story_decisions WHERE guild_id = ?').run(guildId);
  d.prepare('DELETE FROM active_votes WHERE guild_id = ?').run(guildId);
  d.prepare('DELETE FROM known_characters WHERE guild_id = ?').run(guildId);
  d.prepare(`UPDATE guild_settings SET active=0, paused=0, next_event_ts=0,
    overview_msg_id=NULL, scene_msg_id=NULL, universe=NULL WHERE guild_id=?`).run(guildId);
}

// ── Decisions ─────────────────────────────────────────────────

export function saveDecision(guildId, sceneId, optionId, optionLabel, votes) {
  getDb().prepare(`INSERT INTO story_decisions (guild_id,scene_id,option_id,option_label,votes,decided_at) VALUES (?,?,?,?,?,?)`)
    .run(guildId, sceneId, optionId, optionLabel, votes, Date.now());
}

export function getDecisions(guildId, limit = 10) {
  return getDb().prepare('SELECT * FROM story_decisions WHERE guild_id = ? ORDER BY decided_at DESC LIMIT ?').all(guildId, limit);
}

// ── Votes ─────────────────────────────────────────────────────

export function createVote(guildId, sceneId, messageId, channelId, endsAt) {
  getDb().prepare(`INSERT OR REPLACE INTO active_votes (guild_id,scene_id,message_id,channel_id,ends_at,votes) VALUES (?,?,?,?,?,'{}')`)
    .run(guildId, sceneId, messageId, channelId, endsAt);
}

export function getActiveVote(guildId) {
  const row = getDb().prepare('SELECT * FROM active_votes WHERE guild_id = ?').get(guildId);
  if (!row) return null;
  row.votes = JSON.parse(row.votes || '{}');
  return row;
}

export function castVote(guildId, userId, optionId) {
  const row = getActiveVote(guildId);
  if (!row) return false;
  row.votes[userId] = optionId;
  getDb().prepare('UPDATE active_votes SET votes = ? WHERE guild_id = ?').run(JSON.stringify(row.votes), guildId);
  return true;
}

export function deleteActiveVote(guildId) {
  getDb().prepare('DELETE FROM active_votes WHERE guild_id = ?').run(guildId);
}

export function getExpiredVotes() {
  return getDb().prepare('SELECT * FROM active_votes WHERE ends_at <= ?').all(Date.now());
}

// ── Characters ────────────────────────────────────────────────

export function addCharacter(guildId, name, role, faction, description, metAt) {
  const exists = getDb().prepare('SELECT id FROM known_characters WHERE guild_id=? AND name=?').get(guildId, name);
  if (!exists) {
    getDb().prepare(`INSERT INTO known_characters (guild_id,name,role,faction,description,met_at) VALUES (?,?,?,?,?,?)`)
      .run(guildId, name, role, faction, description, metAt);
  }
}

export function getCharacters(guildId) {
  return getDb().prepare('SELECT * FROM known_characters WHERE guild_id = ?').all(guildId);
}