import { getSession } from "~/lib/utils";

import { getChats } from "tools/chat-store";
import ChatbotAPI from "~/server/db/db";
import { cookies } from "next/headers";
import ChatList from "./ChatList";

export default async function Page() {
  const chatbotAPI = new ChatbotAPI();
  const session = await getSession();
  const chats = await getChats(session?.user.id ?? "");
  const chatsToRender = await Promise.all(
    chats.map(async (chat) => {
      return {
        ...chat,
        lastMessage: await chatbotAPI.fetchLastChatMessage(chat.id),
      };
    }),
  );
  const isExpanded = (await cookies()).get("expanded")?.value === "true";

  return (
    <aside>
      <ChatList chats={chatsToRender} isExpanded={isExpanded} />
    </aside>
  );
}
