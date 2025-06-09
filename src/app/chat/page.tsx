import { redirect } from "next/navigation";
import { createChat } from "tools/chat-store";

export default async function Page({ id }: { id?: string }) {
  /*

  Eventually turn this into a conditional
    if id is provided, redirect to `/chat/[id]`
    if not, do the below

  */
  if (!id) {
    const id = await createChat(); // create a new chat
    redirect(`/chat/${id}`); // redirect to chat page, see below
  }
}
