import { type Message } from "ai";
import ChatbotAPI, { type Chat } from "~/server/db/db";

const chatbotAPI = new ChatbotAPI();
export async function createChat(): Promise<string> {
  const id = crypto.randomUUID();
  console.log("id", id);
  const chat = await chatbotAPI.createChat(id);
  return chat.id;
}

export async function loadChat(id: string): Promise<Chat> {
  return await chatbotAPI.loadChat(id);
}

export async function loadMessages(chatId: string): Promise<Message[]> {
  return await chatbotAPI.loadMessages(chatId);
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
