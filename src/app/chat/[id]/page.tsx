import { loadMessages } from "tools/chat-store";
import Chat from "ui/chat";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params; // get the chat ID from the URL
  const messages = await loadMessages(id); // load the chat messages
  return <Chat id={id} initialMessages={messages} />; // display the chat
}
