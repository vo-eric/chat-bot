/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";
import { useChat, type Message } from "@ai-sdk/react";
import { createIdGenerator, type ToolInvocation } from "ai";
import { Weather } from "~/components/ui/weather";

export default function Chat({
  id,
  initialMessages,
}: { id?: string | undefined; initialMessages?: Message[] } = {}) {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    addToolResult,
    // status,
    // stop,
    // error,
    // reload,
  } = useChat({
    maxSteps: 5,
    id,
    initialMessages,
    sendExtraMessageFields: true,
    generateId: createIdGenerator({
      prefix: "msg-c",
      size: 16,
    }),

    experimental_prepareRequestBody({ messages, id }) {
      return { message: messages[messages.length - 1], id };
    },
    onError: (error) => {
      console.error(error);
    },
  });

  // return (
  //   <div className="mx-auto w-[80%] py-8">
  //     {messages?.map((message) => (
  //       <div key={message.id}>
  //         <strong>{`${message.role}: `}</strong>
  //         {message.parts.map((part, index) => {
  //           switch (part.type) {
  //             // render text parts as simple text:
  //             case "text":
  //               return part.text;

  //             // for tool invocations, distinguish between the tools and the state:
  //             case "tool-invocation": {
  //               const callId = part.toolInvocation.toolCallId;

  //               switch (part.toolInvocation.toolName) {
  //                 case "askForConfirmation": {
  //                   switch (part.toolInvocation.state) {
  //                     case "call":
  //                       return (
  //                         <div key={callId}>
  //                           {part.toolInvocation.args.message}
  //                           <div>
  //                             <button
  //                               className="bg-green-500 p-4"
  //                               onClick={() =>
  //                                 addToolResult({
  //                                   toolCallId: callId,
  //                                   result: "Yes, confirmed.",
  //                                 })
  //                               }
  //                             >
  //                               Yes
  //                             </button>
  //                             <button
  //                               className="bg-red-500 p-4"
  //                               onClick={() =>
  //                                 addToolResult({
  //                                   toolCallId: callId,
  //                                   result: "No, denied",
  //                                 })
  //                               }
  //                             >
  //                               No
  //                             </button>
  //                           </div>
  //                         </div>
  //                       );
  //                     case "result":
  //                       return (
  //                         <div key={callId}>
  //                           Location access allowed:{" "}
  //                           {part.toolInvocation.result}
  //                         </div>
  //                       );
  //                   }
  //                   break;
  //                 }

  //                 case "getLocation": {
  //                   switch (part.toolInvocation.state) {
  //                     case "call":
  //                       return <div key={callId}>Getting location...</div>;
  //                     case "result":
  //                       return (
  //                         <div key={callId}>
  //                           Location: {part.toolInvocation.result}
  //                         </div>
  //                       );
  //                   }
  //                   break;
  //                 }

  //                 case "getWeatherInformation": {
  //                   switch (part.toolInvocation.state) {
  //                     // example of pre-rendering streaming tool calls:
  //                     case "partial-call":
  //                       return (
  //                         <pre key={callId}>
  //                           {JSON.stringify(part.toolInvocation, null, 2)}
  //                         </pre>
  //                       );
  //                     case "call":
  //                       return (
  //                         <div key={callId}>
  //                           Getting weather information for{" "}
  //                           {part.toolInvocation.args.city}...
  //                         </div>
  //                       );
  //                     case "result":
  //                       return (
  //                         <div key={callId}>
  //                           Weather in {part.toolInvocation.args.city}:{" "}
  //                           {part.toolInvocation.result}
  //                         </div>
  //                       );
  //                   }
  //                   break;
  //                 }
  //               }
  //             }
  //           }
  //         })}
  //         <br />
  //       </div>
  //     ))}

  //     <form onSubmit={handleSubmit} className="flex gap-2">
  //       <input
  //         value={input}
  //         onChange={handleInputChange}
  //         placeholder="Say something..."
  //         className="flex-1 rounded border p-2"
  //       />
  //       <button type="submit">Send</button>
  //     </form>
  //   </div>
  // );

  // return (
  //   <div className="mx-auto flex w-full max-w-md flex-col">
  //     <div className="flex-1 overflow-y-auto">
  //       {messages.map((m) => (
  //         <div key={m.id} className="mb-4">
  //           <strong>{m.role}: </strong>
  //           {m.content}
  //         </div>
  //       ))}
  //     </div>
  //     {(status === "submitted" || status === "streaming") && (
  //       <div>
  //         {status === "submitted" && <div>Give me a sec</div>}
  //         <button type="button" onClick={() => stop()}>
  //           Stop
  //         </button>
  //       </div>
  //     )}

  //     {error && (
  //       <>
  //         <div>An error occurred.</div>
  //         <button type="button" onClick={() => reload()}>
  //           Retry
  //         </button>
  //       </>
  //     )}
  //     <form onSubmit={handleSubmit} className="flex gap-2">
  //       <input
  //         value={input}
  //         onChange={handleInputChange}
  //         placeholder="Say something..."
  //         className="flex-1 rounded border p-2"
  //       />
  //       <button type="submit">Send</button>
  //     </form>
  //   </div>
  // );

  return (
    <div>
      {messages.map((message) => (
        <div key={message.id}>
          <div>{message.role === "user" ? "User: " : "AI: "}</div>
          <div>{message.content}</div>

          <div>
            {message.parts.map((part) => {
              const { type } = part;
              switch (type) {
                case "tool-invocation":
                  const { toolInvocation }: { toolInvocation: ToolInvocation } =
                    part;
                  const { toolName, toolCallId, state } = toolInvocation;

                  switch (toolName) {
                    case "displayWeather":
                      switch (state) {
                        case "result":
                          return (
                            <div key={toolCallId}>
                              <Weather {...toolInvocation.result} />
                            </div>
                          );
                        default:
                          return (
                            <div key={toolCallId}>Loading the weather...</div>
                          );
                      }
                  }
              }
            })}
          </div>
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
