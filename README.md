# AI Chat Hub

![AI Chat Hub preview](./public/preview.gif)

AI Chat Hub is a multi-assistant AI chat application built with Next.js, the Vercel AI SDK, and Google Gemini. Choose a specialist for frontend development, backend engineering, UX/UI, or finance and get a focused, streamed response.

## Project overview

This project demonstrates a single chat interface that routes conversations to role-specific AI assistants. Responses stream as they are generated, and Markdown content—including tables and lists—is rendered in the conversation.

The interface is designed to work on desktop and mobile, with accessible assistant controls, a labeled message field, loading feedback, and a retry action when a response fails.

## Features

- Four specialized assistants with separate system prompts
- Streaming responses powered by Google Gemini
- Markdown and GitHub Flavored Markdown rendering
- Responsive chat layout
- Request validation and conversation-size limits on the API route
- English interface and assistant instructions

## Tech stack

- Next.js 16 App Router
- React 19 and TypeScript
- Tailwind CSS 4
- Vercel AI SDK and Google Gemini
- Lightswind and Lucide React

## Run locally

1. Clone the repository and install dependencies:

   ```bash
   git clone https://github.com/JohannesL2/ai-chat-hub.git
   cd ai-chat-hub
   npm install
   ```

2. Create `.env.local` in the project root and add a Google AI Studio API key:

   ```env
   GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
   ```

   Create a key at [Google AI Studio](https://aistudio.google.com/app/apikey). Keep this key private and do not commit it.

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

## Validation

Run the linter and production build with:

```bash
npm run lint
npm run build
```

Chat requests are validated and capped by message count and character length. These limits are not a substitute for deployment-level rate limiting; configure rate limits with your hosting provider before exposing a deployment publicly. The application does not persist conversations.

## Deployment

No public demo URL is configured in this repository yet. To publish the app, deploy it to a Next.js-compatible host and add `GOOGLE_GENERATIVE_AI_API_KEY` as a server-side environment variable.

## License

MIT
