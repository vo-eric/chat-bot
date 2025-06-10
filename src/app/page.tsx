import { redirect } from "next/navigation";

export default async function Home() {
  /* 
  
  Make this a splash page that has a button that will redirec to
  the chat page.

  */
  redirect("/chat"); // redirect to the chat page
}
