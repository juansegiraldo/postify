import Database from 'better-sqlite3';
import path from 'path';

// Define the path for the database file in the project root
const dbPath = path.resolve(process.cwd(), 'local.db');

// Create a new database connection
// The verbose option logs queries to the console, useful for debugging
const db = new Database(dbPath, { verbose: console.log });

// Ensure process exits cleanly on termination signals
process.on('SIGINT', () => db.close());
process.on('SIGTERM', () => db.close());

// Function to initialize the database schema
function initializeDb() {
  console.log('Initializing database schema...');

  // Profiles Table (Assuming structure based on Post interface)
  db.exec(`
    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,       -- Changed from UUID to TEXT for SQLite simplicity if needed
      username TEXT UNIQUE NOT NULL,
      full_name TEXT,
      avatar_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Posts Table (Assuming structure based on Post interface)
  db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,        -- Changed from UUID to TEXT for SQLite simplicity if needed
      user_id TEXT NOT NULL,
      title TEXT,
      content TEXT,
      status TEXT,
      post_order INTEGER,      -- Added for persistent ordering
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES profiles (id) ON DELETE CASCADE
    );
  `);

  // Media Table (Assuming structure based on Post interface)
  db.exec(`
    CREATE TABLE IF NOT EXISTS media (
      id TEXT PRIMARY KEY,        -- Changed from UUID to TEXT for SQLite simplicity if needed
      post_id TEXT NOT NULL,
      url TEXT NOT NULL,
      type TEXT,                -- e.g., 'image/jpeg'
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE
    );
  `);

  // Optionally, add indexes for performance
  db.exec('CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts (user_id);');
  db.exec('CREATE INDEX IF NOT EXISTS idx_posts_order ON posts (post_order);');
  db.exec('CREATE INDEX IF NOT EXISTS idx_media_post_id ON media (post_id);');
  db.exec('CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles (username);');


  console.log('Database schema initialization complete.');
}

// Run initialization logic when this module is loaded
initializeDb();

// Export the database connection instance
export default db; 