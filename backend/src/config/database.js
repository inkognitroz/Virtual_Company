const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Ensure data directory exists
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = process.env.DB_PATH || path.join(dataDir, 'virtual-company.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database schema
function initializeDatabase() {
    // Users table
    db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            name TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Roles table
    db.exec(`
        CREATE TABLE IF NOT EXISTS roles (
            id TEXT PRIMARY KEY,
            user_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            avatar TEXT NOT NULL,
            description TEXT,
            ai_instructions TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `);

    // Messages table
    db.exec(`
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            sender TEXT NOT NULL,
            sender_name TEXT NOT NULL,
            avatar TEXT NOT NULL,
            content TEXT NOT NULL,
            time TEXT NOT NULL,
            role_instructions TEXT,
            is_ai BOOLEAN DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `);

    // AI Config table
    db.exec(`
        CREATE TABLE IF NOT EXISTS ai_config (
            user_id INTEGER PRIMARY KEY,
            provider TEXT,
            api_key TEXT,
            endpoint TEXT,
            voice_enabled BOOLEAN DEFAULT 0,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `);

    // Create indices for better query performance
    db.exec(`
        CREATE INDEX IF NOT EXISTS idx_roles_user_id ON roles(user_id);
        CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
        CREATE INDEX IF NOT EXISTS idx_messages_user_created ON messages(user_id, created_at);
        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
        CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
    `);

    console.log('Database initialized successfully');
}

// Initialize on first load
initializeDatabase();

module.exports = db;
