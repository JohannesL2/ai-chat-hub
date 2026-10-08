"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import WavyRippleBackground from "@/components/lightswind/wavy-ripple-background";
import { SendHorizontal } from "lucide-react";

type Role = "frontend" | "backend" | "ux" | "finance";
type ChatMode = "demo" | "live";
type DemoMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

const exampleQuestions: Record<Role, string> = {
  frontend: "How should I organize a reusable React component?",
  backend: "How should I design a reliable API endpoint?",
  ux: "How can I make a form easier to use?",
  finance: "What should I consider when adding payments to an app?",
};

const sampleResponses: Record<Role, string> = {
  frontend: `**Sample response:** Keep components focused on one responsibility and make reusable behavior explicit through props.

- Extract repeated UI into a small component.
- Keep state close to where it is used.
- Add types for the component's public props.

This is a prewritten example. Switch to Live AI for a Gemini-generated answer.`,
  backend: `**Sample response:** Design an API endpoint around a clear resource and validate input at the boundary.

- Return consistent status codes and error shapes.
- Keep secrets and authorization checks on the server.
- Add request limits and tests for invalid input.

This is a prewritten example. Switch to Live AI for a Gemini-generated answer.`,
  ux: `**Sample response:** Make a form easier to use by asking only for information you need and explaining errors next to the relevant field.

- Use visible labels rather than placeholder text alone.
- Preserve valid input when validation fails.
- Make the next action clear and keyboard accessible.

This is a prewritten example. Switch to Live AI for a Gemini-generated answer.`,
  finance: `**Sample response:** Before adding payments, define the transaction lifecycle and how you will handle failures.

- Use a trusted payment provider; never store card details yourself.
- Make payment requests idempotent to avoid duplicate charges.
- Plan for refunds, webhook verification, and clear receipts.

This is a prewritten example. Switch to Live AI for a Gemini-generated answer.`,
};

export default function Home() {
  const [role, setRole] = useState<Role>("frontend");
  const [mode, setMode] = useState<ChatMode>("demo");
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [demoMessages, setDemoMessages] = useState<DemoMessage[]>([]);
  const [demoLoading, setDemoLoading] = useState(false);
  const {
    messages,
    sendMessage,
    status,
    setMessages,
    regenerate,
  } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: {
        role,
      },
    }),
    onError() {
      setError(
        "Live AI is unavailable. Check that a Gemini API key is configured on the server, then try again.",
      );
    },
  });

  const isLiveLoading = status === "submitted" || status === "streaming";
  const isLoading = isLiveLoading || demoLoading;
  const visibleMessages: DemoMessage[] =
    mode === "demo"
      ? demoMessages
      : messages.map((message) => ({
          id: message.id,
          role: message.role === "user" ? "user" : "assistant",
          text: message.parts
            .filter((part) => part.type === "text")
            .map((part) => (part.type === "text" ? part.text : ""))
            .join(""),
        }));

  const send = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;
    setError(null);
    setInput("");

    if (mode === "demo") {
      setDemoMessages((current) => [
        ...current,
        { id: crypto.randomUUID(), role: "user", text },
      ]);
      setDemoLoading(true);
      window.setTimeout(() => {
        setDemoMessages((current) => [
          ...current,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            text: sampleResponses[role],
          },
        ]);
        setDemoLoading(false);
      }, 450);
      return;
    }

    await sendMessage({ text });
  };

  const changeRole = (newRole: Role) => {
    if (newRole === role || isLoading) return;
    if (
      visibleMessages.length > 0 &&
      !window.confirm(
        "Switching assistants will clear this conversation. Do you want to continue?",
      )
    ) {
      return;
    }
    setError(null);
    setMessages([]);
    setDemoMessages([]);
    setRole(newRole);
  };

  const changeMode = (newMode: ChatMode) => {
    if (newMode === mode || isLoading) return;
    if (
      visibleMessages.length > 0 &&
      !window.confirm(
        "Switching chat modes will clear this conversation. Do you want to continue?",
      )
    ) {
      return;
    }
    setError(null);
    setMessages([]);
    setDemoMessages([]);
    setMode(newMode);
  };

  return (
    <main className="relative flex min-h-dvh justify-center overflow-hidden p-3 sm:p-6">
      <div className="fixed inset-0 -z-10 opacity-60" aria-hidden="true">
        <WavyRippleBackground
          waveColor="#3b82f6"
          className="absolute inset-0 -z-10"
        />
      </div>

      <div className="z-1 flex h-[calc(100dvh-1.5rem)] w-full max-w-3xl flex-col rounded-xl border border-white/20 bg-white/70 shadow-2xl backdrop-blur-xl sm:h-[90dvh]">
        <header className="border-b p-4 sm:p-5">
          <h1 className="text-xl font-bold">AI Chat Hub</h1>
          <p className="mt-1 text-sm text-slate-600">
            Choose a specialist and ask a question.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <div className="flex gap-2" role="group" aria-label="Choose chat mode">
              {(["demo", "live"] as ChatMode[]).map((chatMode) => (
                <button
                  key={chatMode}
                  type="button"
                  disabled={isLoading}
                  aria-pressed={mode === chatMode}
                  onClick={() => changeMode(chatMode)}
                  className={`rounded-full px-4 py-2 text-sm disabled:cursor-not-allowed ${
                    mode === chatMode
                      ? "bg-slate-900 text-white"
                      : "bg-slate-200 hover:bg-slate-300"
                  }`}
                >
                  {chatMode === "demo" ? "Demo mode" : "Live AI"}
                </button>
              ))}
            </div>
            <span className="text-sm text-slate-600">
              {mode === "demo"
                ? "No API key needed. Replies are prewritten examples."
                : "Uses Gemini. Requires a server-side API key."}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Choose an assistant">
            {(["frontend", "backend", "ux", "finance"] as Role[]).map((assistantRole) => (
              <button
                key={assistantRole}
                type="button"
                disabled={isLoading}
                aria-pressed={role === assistantRole}
                onClick={() => changeRole(assistantRole)}
                className={`rounded-full px-4 py-2 text-sm capitalize disabled:cursor-not-allowed ${
                  role === assistantRole
                    ? "bg-blue-600 text-white"
                    : "bg-slate-200 hover:bg-slate-300"
                }`}
              >
                {assistantRole === "ux" ? "UX/UI" : assistantRole}
              </button>
            ))}
          </div>
        </header>

        <section
          className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5"
          aria-label="Conversation"
          aria-live="polite"
        >
          {visibleMessages.length === 0 && (
            <div className="space-y-3 text-center text-slate-600">
              <p>
                Ask your {role === "ux" ? "UX/UI" : role} expert a question.
              </p>
              {mode === "demo" && (
                <button
                  type="button"
                  onClick={() => setInput(exampleQuestions[role])}
                  className="text-sm font-semibold text-blue-700 underline underline-offset-2"
                >
                  Try an example question
                </button>
              )}
            </div>
          )}

          {visibleMessages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}
            >
              <div
                className={`inline-block max-w-[90%] overflow-x-auto rounded-lg p-4 sm:max-w-[85%] ${
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-200 text-black"
                }`}
              >
                <Markdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h2: ({ children }) => (
                      <h2 className="mb-2 mt-4 text-lg font-bold">{children}</h2>
                    ),
                    p: ({ children }) => (
                      <p className="mb-3 leading-7">{children}</p>
                    ),
                    li: ({ children }) => (
                      <li className="mb-1 ml-5 list-disc">{children}</li>
                    ),
                    table: ({ children }) => (
                      <table className="my-4 border border-slate-400">{children}</table>
                    ),
                    td: ({ children }) => (
                      <td className="border px-3 py-2">{children}</td>
                    ),
                    th: ({ children }) => (
                      <th className="border px-3 py-2 font-bold">{children}</th>
                    ),
                  }}
                >
                  {message.text}
                </Markdown>
              </div>
            </div>
          ))}

          {isLoading && (
            <p className="text-sm text-slate-600" role="status">
              Thinking...
            </p>
          )}

          {error && (
            <div
              className="flex flex-wrap items-center gap-3 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800"
              role="alert"
            >
              <p>{error}</p>
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  void regenerate();
                }}
                className="font-semibold underline underline-offset-2"
              >
                Try again
              </button>
            </div>
          )}
        </section>

        <form onSubmit={send} className="flex gap-2 border-t p-3 sm:p-4">
          <label className="sr-only" htmlFor="chat-input">
            Your message
          </label>
          <input
            id="chat-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Type your question…"
            maxLength={8_000}
            autoComplete="off"
            className="min-w-0 flex-1 rounded-lg border px-4"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            aria-label="Send message"
            className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white duration-200 hover:scale-105 hover:bg-blue-700 active:scale-95 disabled:cursor-not-allowed disabled:scale-100 disabled:bg-slate-300"
          >
            <SendHorizontal size={20} aria-hidden="true" />
          </button>
        </form>
      </div>
    </main>
  );
}