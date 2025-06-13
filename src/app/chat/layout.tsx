import { getSession } from "~/lib/utils";
import ChatList from "../chatList/page";
import { getChats } from "tools/chat-store";
import ChatbotAPI from "~/server/db/db";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  return (
    <>
      <aside>
        <ChatList chats={chatsToRender} />
      </aside>
      <div>{children}</div>
    </>
  );
}
