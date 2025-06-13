"use client";

import type { Message } from "ai";
import Link from "next/link";
import type { Chat } from "~/server/db/db";

interface ChatToRender extends Chat {
  lastMessage: Message | undefined;
}

export default function ChatList({ chats }: { chats: ChatToRender[] }) {
  return (
    <div className="absolute left-0 max-h-[100vh] w-[40px] overflow-scroll">
      <div className="flex flex-col gap-3">
        {chats.map((chat) => {
          return (
            <Link key={chat.id} href={`/chat/${chat.id}`}>
              {chat.createdAt.toLocaleDateString()}{" "}
              {chat.createdAt.toLocaleTimeString()}: {chat.lastMessage?.content}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
