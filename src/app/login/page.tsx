"use client";

import { authClient } from "~/lib/auth-client";
import { Github } from "lucide-react";

export default function Login() {
  const { useSession, signIn } = authClient;
  const { data: session, isPending } = useSession();

  if (!session || isPending) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <p>Log in to talk to the CHAAAATBAWWWWWWWT</p>
        <button
          className="flex max-w-[200px] cursor-pointer gap-2 rounded-lg border border-black p-2"
          onClick={() => signIn.social({ provider: "github" })}
        >
          <Github className="h-6 w-6" />
          Sign in with Github
        </button>
      </div>
    );
  }
}
