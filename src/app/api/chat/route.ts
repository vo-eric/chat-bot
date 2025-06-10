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
        execute: async ({ message }: { message: string }) => {
          return message;
        },
      },
      // client-side tool that is automatically executed on the client:
      getLocation: {
        description: "Get the city the user is in",
        parameters: z.object({
          lat: z.number(),
          lng: z.number(),
        }),
        execute: async ({ lat, lng }) => {
          const url = `https://geocode.maps.co/reverse?lat=${lat}&lon=${lng}&api_key=${process.env.GEOCODE_API_KEY}`;
          const response = await fetch(url);

          if (!response.ok) {
            throw new Error(`Failed to fetch location: ${response.statusText}`);
          }

          const locationInfo = await response.json();
          console.log("location info", locationInfo);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
          return locationInfo.address.quarter ?? locationInfo.address.city;
        },
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
