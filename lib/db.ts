import Database from 'better-sqlite3'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

let db: Database.Database

function getDb(): Database.Database {
  if (!db) {
    db = new Database(path.join(process.cwd(), 'cloudos.db'))
    db.pragma('journal_mode = WAL')
    db.pragma('foreign_keys = ON')
    initSchema()
  }
  return db
}

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      display_name TEXT NOT NULL,
      avatar_url TEXT DEFAULT NULL,
      selected_voice TEXT DEFAULT 'aria',
      ai_model TEXT DEFAULT '@cf/meta/llama-3-8b-instruct',
      auto_speak INTEGER DEFAULT 1,
      show_transcript INTEGER DEFAULT 1,
      theme TEXT DEFAULT 'dark',
      accent_color TEXT DEFAULT '#0078D4',
      wallpaper TEXT DEFAULT 'aurora',
      is_pro INTEGER DEFAULT 0,
      is_guest INTEGER DEFAULT 0,
      total_files INTEGER DEFAULT 0,
      storage_used INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS files (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'text',
      content TEXT DEFAULT '',
      parent_folder TEXT DEFAULT 'root',
      size INTEGER DEFAULT 0,
      is_pinned INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS folders (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      parent_folder TEXT DEFAULT 'root',
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ai_conversations (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT DEFAULT 'New Conversation',
      app_context TEXT DEFAULT 'cloudia',
      messages TEXT NOT NULL DEFAULT '[]',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      is_guest INTEGER DEFAULT 0,
      expires_at TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS notepad_files (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL DEFAULT 'Untitled.txt',
      content TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS sticky_notes (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      content TEXT DEFAULT '',
      color TEXT DEFAULT 'yellow',
      position_x INTEGER DEFAULT 100,
      position_y INTEGER DEFAULT 100,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS calendar_events (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT DEFAULT NULL,
      end_time TEXT DEFAULT NULL,
      all_day INTEGER DEFAULT 0,
      color TEXT DEFAULT '#0078D4',
      notes TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS bookmarks (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      favicon TEXT DEFAULT NULL,
      folder TEXT DEFAULT 'default',
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS verification_tokens (
      token TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'email',
      expires_at TEXT NOT NULL,
      used INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `)

  // Migrations: add columns that may not exist in older DBs
  const migrations = [
    'ALTER TABLE users ADD COLUMN google_id TEXT DEFAULT NULL',
    'ALTER TABLE users ADD COLUMN email_verified INTEGER DEFAULT 0',
    'ALTER TABLE users ADD COLUMN avatar_url TEXT DEFAULT NULL',
  ]
  for (const sql of migrations) {
    try { db.exec(sql) } catch { /* column already exists – ignore */ }
  }
}

export function createDefaultData(userId: string) {
  const database = getDb()
  const defaultFolders = ['Documents', 'Downloads', 'Pictures', 'Music', 'Videos', 'Desktop', 'Projects']

  const insertFolder = database.prepare(
    `INSERT OR IGNORE INTO folders (id, user_id, name, parent_folder) VALUES (?, ?, ?, 'root')`
  )
  defaultFolders.forEach(name => insertFolder.run(uuidv4(), userId, name))

  const insertFile = database.prepare(
    `INSERT OR IGNORE INTO files (id, user_id, name, type, content, parent_folder) VALUES (?, ?, ?, ?, ?, ?)`
  )

  insertFile.run(
    uuidv4(), userId,
    'Welcome to CloudOS.txt', 'text',
    `Welcome to CloudOS!\n\nYour cloud computer is ready to use.\n\nYou can:\n• Create and edit documents\n• Write and run code\n• Browse the internet\n• Chat with CLOUDIA AI\n• And much more!\n\nAll from any browser, anywhere in the world.\n\nEnjoy CloudOS!\n— The CloudOS Team`,
    'root'
  )

  insertFile.run(
    uuidv4(), userId,
    'Getting Started.txt', 'text',
    `Getting Started with CloudOS\n\n1. Click the Start button (bottom left)\n2. Browse your apps\n3. Click any app to open it\n4. Drag windows to move them\n5. Click the mic button to talk to CLOUDIA\n\nTip: You can have multiple windows open at once!`,
    'Documents'
  )

  database.prepare(
    `INSERT OR IGNORE INTO notepad_files (id, user_id, name, content) VALUES (?, ?, 'Quick Notes.txt', '')`
  ).run(uuidv4(), userId)

  database.prepare(
    `INSERT OR IGNORE INTO calendar_events (id, user_id, title, date, all_day, color) VALUES (?, ?, 'CloudOS Launch', ?, 1, '#0078D4')`
  ).run(uuidv4(), userId, new Date().toISOString().split('T')[0])

  database.prepare(`
    INSERT OR IGNORE INTO bookmarks (id, user_id, title, url) VALUES
    (?, ?, 'Google', 'https://google.com'),
    (?, ?, 'GitHub', 'https://github.com'),
    (?, ?, 'YouTube', 'https://youtube.com'),
    (?, ?, 'Cloudflare', 'https://cloudflare.com'),
    (?, ?, 'ElevenLabs', 'https://elevenlabs.io')
  `).run(uuidv4(), userId, uuidv4(), userId, uuidv4(), userId, uuidv4(), userId, uuidv4(), userId)
}

export function formatUser(user: Record<string, unknown>) {
  return {
    id: user.id,
    email: user.email,
    displayName: user.display_name,
    avatarUrl: user.avatar_url,
    selectedVoice: user.selected_voice || 'aria',
    aiModel: user.ai_model || '@cf/meta/llama-3-8b-instruct',
    autoSpeak: user.auto_speak === 1,
    showTranscript: user.show_transcript === 1,
    theme: user.theme || 'dark',
    accentColor: user.accent_color || '#0078D4',
    wallpaper: user.wallpaper || 'aurora',
    isPro: user.is_pro === 1,
    isGuest: user.is_guest === 1,
    emailVerified: user.email_verified === 1,
    storageUsed: user.storage_used || 0
  }
}

export default getDb
