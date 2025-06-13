import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createChat } from "tools/chat-store";
import { auth } from "~/lib/auth";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const id = await createChat(session?.user.id); // create a new chat
  redirect(`/chat/${id}`); // redirect to chat page, see below
}
