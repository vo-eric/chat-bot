import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { headers } from "next/headers";
import { auth } from "~/lib/auth";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session;
};
