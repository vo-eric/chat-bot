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
import z from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { message, id }: { message: Message; id: string } = await req.json();

  const previousMessages = await loadMessages(id);

  const messages = appendClientMessage({
    messages: previousMessages,
    message,
  });

  const result = streamText({
    model: openai("gpt-4o"),
    system: "You are a helpful assistant.",
    messages,
    tools: {
      // server-side tool with execute function:
      getWeatherInformation: {
        description: "show the weather in a given city to the user",
        parameters: z.object({ city: z.string() }),
        execute: async ({}: { city: string }) => {
          const weatherOptions = ["sunny", "cloudy", "rainy", "snowy", "windy"];
          return weatherOptions[
            Math.floor(Math.random() * weatherOptions.length)
          ];
        },
      },
      // client-side tool that starts user interaction:
      askForConfirmation: {
        description: "Ask the user for confirmation.",
        parameters: z.object({
          message: z.string().describe("The message to ask for confirmation."),
        }),
      },
      // client-side tool that is automatically executed on the client:
      getLocation: {
        description:
          "Get the user location. Always ask for confirmation before using this tool.",
        parameters: z.object({}),
      },
    },
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
