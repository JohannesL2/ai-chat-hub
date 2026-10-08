# AI Chat Hub

![AI Chat Hub preview](./public/preview.gif)

AI Chat Hub is a multi-assistant AI chat application built with Next.js, the Vercel AI SDK, and Google Gemini. Choose a specialist for frontend development, backend engineering, UX/UI, or finance.

## Project overview

The app includes a no-key demo mode with prewritten sample responses, so visitors can explore the chat interface without an account, API key, or usage costs. Switch to Live AI to send prompts to Gemini and receive streamed, model-generated responses.

Conversations can be routed to role-specific assistants. Markdown content—including tables and lists—is rendered in the conversation. The responsive interface includes accessible assistant controls, a labeled message field, loading feedback, and a retry action when a live response fails.

## Features

- Four specialized assistants with separate system prompts
- Default demo mode with prewritten sample responses and no API calls
- Optional live, streamed responses powered by Google Gemini
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

2. Start the app in demo mode without configuring an API key:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000). Demo mode is selected by default and does not make requests to Gemini.

### Enable live AI responses

To use Live AI locally, create `.env.local` in the project root and add a Google AI Studio API key:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
```

Create a key at [Google AI Studio](https://aistudio.google.com/app/apikey). Keep it private, configure it as a server-side environment variable, and never expose or commit it. Restart the development server after adding the key. Select **Live AI** in the app to use Gemini.

## Validation

Run the linter and production build with:

```bash
npm run lint
npm run build
```

Live chat requests are validated and capped by message count and character length. Demo mode uses prewritten responses and does not contact the AI API. These limits are not a substitute for deployment-level rate limiting; configure rate limits with your hosting provider before enabling Live AI publicly. The application does not persist conversations.

## Deployment

No public deployment is configured in this repository yet. Deploy to a Next.js-compatible host to share an interactive portfolio demo. Demo mode works without a Gemini key; to enable Live AI on the deployment, add `GOOGLE_GENERATIVE_AI_API_KEY` as a server-side environment variable and configure rate limits with your host.

Suggested portfolio description:

> AI Chat Hub is a responsive multi-assistant chat app built with Next.js, TypeScript, and the Vercel AI SDK. It offers a no-key demo mode with sample responses and an optional Gemini-powered live mode, with request validation and accessible chat controls.

## License

MIT
