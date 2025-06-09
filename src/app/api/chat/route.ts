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
import { loadChat, saveChat } from "tools/chat-store";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { message, id }: { message: Message; id: string } = await req.json();

  const previousMessages = await loadChat(id);

  const messages = appendClientMessage({
    messages: previousMessages,
    message,
  });

  const result = streamText({
    model: openai("gpt-4o"),
    system: "You are a helpful assistant.",
    messages,
    async onFinish({ response }) {
      await saveChat({
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
}

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
