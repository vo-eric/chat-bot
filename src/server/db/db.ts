import { asc, eq } from "drizzle-orm";
import { chatsTable, messagesTable } from "./schema";
import { drizzle } from "drizzle-orm/postgres-js";
import type { Message } from "ai";

export type Chat = typeof chatsTable.$inferSelect;

export interface ChatbotAPIInterface {
  createChat: (id: string) => Promise<Chat>;
  loadChat: (id: string) => Promise<Chat>;
  saveMessages: (id: string, messages: Message[]) => Promise<void>;
}

export class ChatbotAPI implements ChatbotAPIInterface {
  private db = drizzle(process.env.DATABASE_URL!);

  async createChat(id: string): Promise<Chat> {
    await this.db.insert(chatsTable).values({
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const [chat] = await this.db
      .select()
      .from(chatsTable)
      .where(eq(chatsTable.id, id));

    if (!chat) {
      throw new Error(`Chat with ID ${id} not found`);
    }
    return chat;
  }

  async loadChat(id: string): Promise<Chat> {
    const [chat] = await this.db
      .select()
      .from(chatsTable)
      .where(eq(chatsTable.id, id));

    if (!chat) {
      throw new Error(`Chat with ID ${id} not found`);
    }

    return chat;
  }

  async loadMessages(chatId: string): Promise<Message[]> {
    return await this.db
      .select()
      .from(messagesTable)
      .where(eq(messagesTable.chatId, chatId))
      .orderBy(asc(messagesTable.createdAt));
  }

  async saveMessages(chatId: string, messages: Message[]) {
    for (const message of messages) {
      try {
        await this.db.insert(messagesTable).values({
          id: crypto.randomUUID(),
          createdAt: new Date(),
          role: message.role,
          content: message.content,
          parts: message.parts,
          chatId,
        });
      } catch (error) {
        throw error;
      }
    }
  }
}

export default ChatbotAPI;
