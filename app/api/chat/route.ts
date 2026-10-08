import { google } from "@ai-sdk/google";
import {
  streamText,
  convertToModelMessages,
} from "ai";

export const runtime = "edge";

const SYSTEM_PROMPTS = {
  frontend: `
You are a senior frontend developer.
Help the user with React, Next.js, TypeScript, and CSS.
Respond in English.
`,

  backend: `
You are a backend engineering expert.
Help with APIs, databases, and software architecture.
Respond in English.
`,

  ux: `
You are a UX/UI expert.
Help with design and user experience.
Respond in English.
`,

  finance: `
You are a finance expert.
Help with fintech and payments.

- Start with a short summary.
- Use clear headings when useful.
- Use bullet points where appropriate.
- Use numbered steps for guides.
- Use tables for comparisons.
- Explain complex terms simply.

Respond in English.
`,
};

const MAX_MESSAGES = 40;
const MAX_MESSAGE_LENGTH = 8_000;
const MAX_TOTAL_MESSAGE_LENGTH = 24_000;
const MAX_REQUEST_BYTES = 128_000;

function isRole(value: unknown): value is keyof typeof SYSTEM_PROMPTS {
  return typeof value === "string" && Object.hasOwn(SYSTEM_PROMPTS, value);
}

function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

export async function POST(req: Request) {
  const contentLength = Number(req.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
    return jsonError("The request is too large.", 413);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError("The request body must be valid JSON.", 400);
  }

  if (!body || typeof body !== "object") {
    return jsonError("The request body must be an object.", 400);
  }

  const { messages, role } = body as {
    messages?: unknown;
    role?: unknown;
  };

  if (!isRole(role)) {
    return jsonError("Choose a valid assistant role.", 400);
  }

  if (
    !Array.isArray(messages) ||
    messages.length === 0 ||
    messages.length > MAX_MESSAGES
  ) {
    return jsonError(`Send between 1 and ${MAX_MESSAGES} messages.`, 400);
  }

  let totalMessageLength = 0;
  for (const message of messages) {
    if (
      !message ||
      typeof message !== "object" ||
      !("role" in message) ||
      !["user", "assistant"].includes(String(message.role)) ||
      !("parts" in message) ||
      !Array.isArray(message.parts)
    ) {
      return jsonError("The message format is invalid.", 400);
    }

    for (const part of message.parts) {
      if (!part || typeof part !== "object" || !("type" in part)) {
        return jsonError("The message format is invalid.", 400);
      }

      if (part.type === "text") {
        if (!("text" in part) || typeof part.text !== "string") {
          return jsonError("The message format is invalid.", 400);
        }

        if (part.text.length > MAX_MESSAGE_LENGTH) {
          return jsonError(
            `Each message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`,
            400,
          );
        }
        totalMessageLength += part.text.length;
      }
    }
  }

  if (totalMessageLength > MAX_TOTAL_MESSAGE_LENGTH) {
    return jsonError(
      `The conversation must be ${MAX_TOTAL_MESSAGE_LENGTH} characters or fewer.`,
      400,
    );
  }

  try {
    const result = streamText({
      model: google("gemini-3.5-flash"),

      system: SYSTEM_PROMPTS[role],

      messages: await convertToModelMessages(messages),

      onError(error) {
        console.error("STREAM ERROR:", error);
      },
    });


    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("API ERROR:", error);
    return jsonError("The assistant could not process this request.", 500);
  }
}