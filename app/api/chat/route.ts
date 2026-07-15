import { google } from "@ai-sdk/google";
import {
  streamText,
  convertToModelMessages,
} from "ai";

export const runtime = "edge";

const SYSTEM_PROMPTS = {
  frontend: `
Du är en senior frontend-utvecklare.
Hjälp användaren med React, Next.js, TypeScript och CSS.
Svara på svenska.
`,

  backend: `
Du är en backend-expert.
Hjälp med API, databaser och arkitektur.
Svara på svenska.
`,

  ux: `
Du är en UX/UI-expert.
Hjälp med design och användarupplevelse.
Svara på svenska.
`,

  finance: `
Du är en finance-expert.
Hjälp med fintech och betalningar.

- Börja med en kort sammanfattning
- Använd tydliga rubriker med ##
- Använd punktlistor när det passar
- Använd numrerade steg för guider
- Använd tabeller när du jämför saker
- Förklara svåra ord enkelt

Svara på svenska.
`,
};


export async function POST(req: Request) {
  try {
    const { messages, role } = await req.json();

    const result = streamText({
      model: google("gemini-flash-latest"),

      system:
        SYSTEM_PROMPTS[
          role as keyof typeof SYSTEM_PROMPTS
        ] ?? SYSTEM_PROMPTS.frontend,

      messages: await convertToModelMessages(messages),

      onFinish(event) {
        console.log("FINISHED:", event);
      },

      onError(error) {
        console.error("STREAM ERROR:", error);
      },
    });


    return result.toUIMessageStreamResponse();

  } catch (error) {

    console.error("API ERROR:", error);

    return new Response(
      JSON.stringify({
        error: String(error),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}