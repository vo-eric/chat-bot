"use client";

import type { Message } from "ai";
import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";
import type { Chat } from "~/server/db/db";

interface ChatToRender extends Chat {
  lastMessage: Message | undefined;
}

export default function ChatList({
  chats,
  isExpanded,
}: {
  chats: ChatToRender[];
  isExpanded: boolean;
}) {
  const [expanded, setExpanded] = useState<boolean>(isExpanded);

  const handleClick = () => {
    document.cookie = `expanded=${!expanded};`;
    setExpanded((prev) => !prev);
  };

  return (
    <div
      className={clsx(
        "absolute left-0 max-h-[100vh] overflow-scroll",
        expanded ? "w-[100px]" : "w-[40px]",
      )}
      onClick={handleClick}
    >
      <div className="flex flex-col gap-3">
        {chats.map((chat) => {
          return (
            <Link key={chat.id} href={`/chat/${chat.id}`}>
              <button
                className="cursor-pointer border border-indigo-400 p-1 text-sm"
                onClick={(e) => e.stopPropagation()}
              >
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
