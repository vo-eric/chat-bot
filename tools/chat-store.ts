import { type Message } from "ai";
import ChatbotAPI, { type Chat } from "~/server/db/db";

const chatbotAPI = new ChatbotAPI();
export async function createChat(userId?: string): Promise<string> {
  const chat = await chatbotAPI.createChat(userId);
  return chat.id;
}

export async function loadChat(id: string): Promise<Chat> {
  return await chatbotAPI.loadChat(id);
}

export async function loadMessages(
  chatId: string,
  userId: string,
): Promise<Message[]> {
  return await chatbotAPI.loadMessages(chatId, userId);
}

export async function saveMessages({
  id,
  messages,
}: {
  id: string;
  messages: Message[];
}): Promise<void> {
  return await chatbotAPI.saveMessages(id, messages);
}
