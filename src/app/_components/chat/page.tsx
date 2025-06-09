"use client";
import { useChat } from "@ai-sdk/react";

export default function Chat() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    stop,
    error,
    reload,
  } = useChat({
    onError: (error) => {
      console.error(error);
    },
  });

  return (
    <div className="mx-auto flex w-full max-w-md flex-col">
      <div className="flex-1 overflow-y-auto">
        {messages.map((m) => (
          <div key={m.id} className="mb-4">
            <strong>{m.role}: </strong>
            {m.content}
          </div>
        ))}
      </div>
      {(status === "submitted" || status === "streaming") && (
        <div>
          {status === "submitted" && <div>Give me a sec</div>}
          <button type="button" onClick={() => stop()}>
            Stop
          </button>
        </div>
      )}

      {error && (
        <>
          <div>An error occurred.</div>
          <button type="button" onClick={() => reload()}>
            Retry
          </button>
        </>
      )}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Say something..."
          className="flex-1 rounded border p-2"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
