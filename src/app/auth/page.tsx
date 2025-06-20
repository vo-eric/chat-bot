"use client";

import { authClient } from "~/lib/auth-client";
import { Github } from "lucide-react";

export default function Auth() {
  const { useSession, signIn, signOut } = authClient;
  const { data: session } = useSession();

  if (!session?.user) {
    return (
      <div>
        <button
          className="flex cursor-pointer gap-2 rounded-lg border border-black p-2"
          onClick={() => signIn.social({ provider: "github" })}
        >
          <Github className="h-6 w-6" />
          Sign in with Github
        </button>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-4">
      <p className="text-xl">
        Hello, {session.user.name || session.user.email}
      </p>
      <button
        className="flex cursor-pointer gap-2 rounded-lg border border-black p-2"
        onClick={() => signOut()}
      >
        Sign out
      </button>
    </div>
  );
}
