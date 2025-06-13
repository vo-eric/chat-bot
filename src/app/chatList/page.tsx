"use client";

import type { Message } from "ai";
import clsx from "clsx";
import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
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

  const handleNewChatClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    redirect(`/chat`); // redirect to chat page, see below
  };

  return (
    <div
      className={clsx(
        "transition-width absolute left-0 h-[100vh] max-h-[100vh] cursor-pointer overflow-scroll bg-blue-100 duration-300",
        expanded ? "w-[150px]" : "w-[40px]",
      )}
      onClick={handleClick}
    >
      <div className="flex flex-col gap-3 p-2">
        <button
          className="border-grey-400 cursor-pointer rounded-md border p-1 text-gray-400 transition duration-300 hover:bg-gray-400 hover:text-white"
          onClick={handleNewChatClick}
        >
          {expanded ? "New chat" : "+"}
        </button>
        {chats.map((chat) => {
          if (!expanded) {
            return (
              <div
                key={chat.id}
                className="text-white transition-all duration-300 hover:text-blue-400"
              >
                <Link key={chat.id} href={`/chat/${chat.id}`}>
                  <MessageSquare key={chat.id} />
                </Link>
              </div>
            );
          }
          return (
            <Link key={chat.id} href={`/chat/${chat.id}`}>
              <button
                className="w-full cursor-pointer rounded-md border border-blue-100 bg-white p-1 text-sm text-blue-300 transition duration-300 hover:border-white hover:bg-blue-300 hover:text-white"
                onClick={(e) => e.stopPropagation()}
              >
                <p>
                  {chat.createdAt.toLocaleDateString("en-US", {
                    hour12: false,
                  })}
                </p>

                <p>
                  {chat.createdAt.toLocaleTimeString("en-US", {
                    hour12: false,
                  })}
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
