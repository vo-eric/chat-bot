/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";
import { useChat, type Message } from "@ai-sdk/react";
import { createIdGenerator } from "ai";

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
    async onToolCall({ toolCall }) {
      if (toolCall.toolName === "getLocation") {
        const cities = ["New York", "Los Angeles", "Chicago", "San Francisco"];
        return cities[Math.floor(Math.random() * cities.length)];
      }
    },
    experimental_prepareRequestBody({ messages, id }) {
      return { message: messages[messages.length - 1], id };
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return (
    <>
      {messages?.map((message) => (
        <div key={message.id}>
          <strong>{`${message.role}: `}</strong>
          {message.parts.map((part) => {
            switch (part.type) {
              // render text parts as simple text:
              case "text":
                return part.text;

              // for tool invocations, distinguish between the tools and the state:
              case "tool-invocation": {
                const callId = part.toolInvocation.toolCallId;

                switch (part.toolInvocation.toolName) {
                  case "askForConfirmation": {
                    switch (part.toolInvocation.state) {
                      case "call":
                        return (
                          <div key={callId}>
                            {part.toolInvocation.args.message}
                            <div>
                              <button
                                onClick={() =>
                                  addToolResult({
                                    toolCallId: callId,
                                    result: "Yes, confirmed.",
                                  })
                                }
                              >
                                Yes
                              </button>
                              <button
                                onClick={() =>
                                  addToolResult({
                                    toolCallId: callId,
                                    result: "No, denied",
                                  })
                                }
                              >
                                No
                              </button>
                            </div>
                          </div>
                        );
                      case "result":
                        return (
                          <div key={callId}>
                            Location access allowed:{" "}
                            {part.toolInvocation.result}
                          </div>
                        );
                    }
                    break;
                  }

                  case "getLocation": {
                    switch (part.toolInvocation.state) {
                      case "call":
                        return <div key={callId}>Getting location...</div>;
                      case "result":
                        return (
                          <div key={callId}>
                            Location: {part.toolInvocation.result}
                          </div>
                        );
                    }
                    break;
                  }

                  case "getWeatherInformation": {
                    switch (part.toolInvocation.state) {
                      // example of pre-rendering streaming tool calls:
                      case "partial-call":
                        return (
                          <pre key={callId}>
                            {JSON.stringify(part.toolInvocation, null, 2)}
                          </pre>
                        );
                      case "call":
                        return (
                          <div key={callId}>
                            Getting weather information for{" "}
                            {part.toolInvocation.args.city}...
                          </div>
                        );
                      case "result":
                        return (
                          <div key={callId}>
                            Weather in {part.toolInvocation.args.city}:{" "}
                            {part.toolInvocation.result}
                          </div>
                        );
                    }
                    break;
                  }
                }
              }
            }
          })}
          <br />
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
      </form>
    </>
  );
}

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
