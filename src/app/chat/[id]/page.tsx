import { redirect } from "next/navigation";
import { loadMessages } from "tools/chat-store";
import Chat from "ui/chat";
import { getSession } from "~/lib/utils";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params; // get the chat ID from the URL
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const messages = await loadMessages(id, session?.user.id); // load the chat messages
  console.log("messages", messages);
  return <Chat id={id} initialMessages={messages} />; // display the chat
}
