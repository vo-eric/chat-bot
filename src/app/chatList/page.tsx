"use client";

import type { Message } from "ai";
import Link from "next/link";
import type { Chat } from "~/server/db/db";

interface ChatToRender extends Chat {
  lastMessage: Message | undefined;
}

export default function ChatList({ chats }: { chats: ChatToRender[] }) {
  return (
    <div className="absolute left-0 max-h-[100vh] overflow-scroll">
      <div className="flex flex-col gap-3">
        {chats.map((chat) => {
          return (
            <Link key={chat.id} href={`/chat/${chat.id}`}>
              <button className="cursor-pointer border border-indigo-400 p-1 text-sm">
                <p>
                  {chat.createdAt.toLocaleDateString()}{" "}
                  {chat.createdAt.toLocaleTimeString()}:{" "}
                </p>
                <p>{chat.lastMessage?.content}</p>
              </button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
