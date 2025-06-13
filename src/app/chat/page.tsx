import { redirect } from "next/navigation";

import { createChat } from "tools/chat-store";
import { getSession } from "~/lib/utils";

export default async function Page() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const id = await createChat(session?.user.id); // create a new chat
  redirect(`/chat/${id}`); // redirect to chat page, see below
}
