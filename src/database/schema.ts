import { databaseConnection } from "./connection.js";

export async function createTables() {
  const db = await databaseConnection;

  await db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      conversation_id TEXT,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      sector TEXT,
      summary TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Add conversation_id column if it doesn't exist
  try {
    await db.exec(`ALTER TABLE messages ADD COLUMN conversation_id TEXT;`);
  } catch (error) {
    // Column might already exist, ignore
  }
}
