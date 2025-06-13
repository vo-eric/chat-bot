/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { openai } from "@ai-sdk/openai";
import {
  appendClientMessage,
  appendResponseMessages,
  createIdGenerator,
  streamText,
  type Message,
} from "ai";
import { loadMessages, saveMessages } from "tools/chat-store";
// import z from "zod";
import { tools } from "~/ai/tools";
import { getSession } from "~/lib/utils";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const session = await getSession();

    if (!session?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }));
    }

    const { message, id }: { message: Message; id: string } = await req.json();

    const previousMessages = await loadMessages(id, session?.user.id);

    const messages = appendClientMessage({
      messages: previousMessages,
      message,
    });

    const result = streamText({
      model: openai("gpt-4o"),
      system:
        "You are a helpful assistant that sings the lyrics of 'You are a pirate' from the show 'Lazytown'.",
      messages,
      tools,
      async onFinish({ response }) {
        await saveMessages({
          id,
          messages: appendResponseMessages({
            messages,
            responseMessages: response.messages,
          }),
        });
      },
      experimental_generateMessageId: createIdGenerator({
        prefix: "msg-s",
        size: 16,
      }),
    });

    return result.toDataStreamResponse({
      getErrorMessage: errorHandler,
      sendSources: true,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Server error", message: error }),
    );
  }
}

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const userId = searchParams.get("userId");

//   if (!userId) {
//     return [];
//   }

//   const chats = await getChats(userId);
//   return NextResponse.json(chats);
// }

function errorHandler(error: unknown) {
  if (error == null) {
    return "unknown error";
  }

  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return JSON.stringify(error);
}
