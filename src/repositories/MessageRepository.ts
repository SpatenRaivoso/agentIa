import { databaseConnection } from "../database/connection.js";

interface CreateMessageDTO {
  role: "USER" | "AGENT";
  content: string;
  sector?: string | null;
  summary?: string | null;
  conversationId: string;
}

export class MessageRepository {
  async create(data: CreateMessageDTO) {
    const db = await databaseConnection;

    await db.run(
      `
      INSERT INTO messages (conversation_id, role, content, sector, summary)
      VALUES (?, ?, ?, ?, ?)
      `,
      [data.conversationId, data.role, data.content, data.sector ?? null, data.summary ?? null]
    );
  }

  async findByConversationId(conversationId: string) {
    const db = await databaseConnection;

    const messages = await db.all(
      `
      SELECT * FROM messages
      WHERE conversation_id = ?
      ORDER BY created_at ASC
      `,
      [conversationId]
    );

    return messages;
  }

  async findAll() {
    const db = await databaseConnection;
    const messages = await db.all(`
      SELECT * FROM messages
      ORDER BY created_at ASC
    `);

    return messages;
  }
}
