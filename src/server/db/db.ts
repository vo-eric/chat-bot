import { and, asc, eq } from "drizzle-orm";
import { chatsTable, messagesTable } from "./schema";
import { drizzle } from "drizzle-orm/postgres-js";
import type { Message } from "ai";

export type Chat = typeof chatsTable.$inferSelect;

export interface ChatbotAPIInterface {
  createChat: (id: string) => Promise<Chat>;
  getChats: (id: string) => Promise<Chat[]>;
  saveMessages: (id: string, messages: Message[]) => Promise<void>;
  fetchLastChatMessage: (id: string) => Promise<Message | undefined>;
}

export class ChatbotAPI implements ChatbotAPIInterface {
  private db = drizzle(process.env.DATABASE_URL!);

  async createChat(userId?: string): Promise<Chat> {
    const chat = await this.db
      .insert(chatsTable)
      .values({
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: userId ?? null,
      })
      .returning();

    // const [chat] = await this.db
    //   .select()
    //   .from(chatsTable)
    if (!chat[0]) {
      throw new Error("Error when creating a new chat");
    }
    return chat[0];
  }

  // async loadChat(id: string, userId: string): Promise<Chat> {
  //   const [chat] = await this.db
  //     .select()
  //     .from(chatsTable)
  //     .where(
  //       sql`${chatsTable.id} = ${id} and ${chatsTable.userId} = ${userId}`,
  //     );

  //   if (!chat) {
  //     throw new Error(`Chat with ID ${id} not found`);
  //   }

  //   return chat;
  // }

  async getChats(id: string): Promise<Chat[]> {
    const chats = await this.db
      .select()
      .from(chatsTable)
      .where(eq(chatsTable.userId, id));
    return chats;
  }

  async fetchLastChatMessage(chatId: string): Promise<Message | undefined> {
    const [message] = await this.db
      .select({
        id: messagesTable.id,
        content: messagesTable.content,
        role: messagesTable.role,
        createdAt: messagesTable.createdAt,
      })
      .from(messagesTable)
      .where(eq(messagesTable.chatId, chatId))
      .orderBy(asc(messagesTable.createdAt))
      .limit(1);

    return message;
  }

  async loadMessages(chatId: string, userId: string): Promise<Message[]> {
    return await this.db
      .select({
        id: messagesTable.id,
        content: messagesTable.content,
        role: messagesTable.role,
        createdAt: messagesTable.createdAt,
      })
      .from(messagesTable)
      .innerJoin(chatsTable, eq(messagesTable.chatId, chatsTable.id))
      .where(and(eq(chatsTable.id, chatId), eq(chatsTable.userId, userId)))
      .orderBy(asc(messagesTable.createdAt));
  }

  async saveMessages(chatId: string, messages: Message[]) {
    for (const message of messages) {
      try {
        await this.db
          .insert(messagesTable)
          .values({
            id: message.id,
            createdAt: new Date(),
            role: message.role,
            content: message.content,
            parts: message.parts ?? [],
            chatId,
          })
          .onConflictDoUpdate({
            target: messagesTable.id,
            set: {
              content: message.content,
              parts: message.parts,
            },
          });
      } catch (error) {
        throw error;
      }
    }
  }
}

export default ChatbotAPI;
