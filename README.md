# AI Chat Hub

![preview](./public/preview.gif)

> A modern AI chat application built with **Next.js**, **AI SDK**, and **Google Gemini**. Switch between specialized AI assistants, stream responses in real time, and get focused answers through a clean, responsive interface.

---

## Overview

AI Chat Hub is a multi-role AI application that lets users switch between specialized assistants designed for different tasks and domains.

Instead of relying on a single assistant, users can instantly switch between specialized AI roles for frontend development, backend engineering, UX/UI design, and finance. Each role is powered by its own system prompt, allowing conversations to stay focused and context-aware.

Built with the Vercel AI SDK and Google Gemini, the application delivers fast streaming responses with a modern user experience.

---

## Features

- Multiple specialized AI assistants
- Google Gemini integration
- Real-time streaming responses
- Markdown rendering
- Responsive interface
- Animated Lightswind background
- Built with the Next.js App Router

---

## Language Support

The application supports conversations in multiple languages through Gemini.

However, the predefined AI roles and system prompts are currently optimized for **Swedish**, providing the best experience for Swedish-speaking users. Support for additional localized prompts is planned for future releases.

---

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Vercel AI SDK
- Google Generative AI
- Lightswind
- Lucide React

---

## Getting Started

Clone the repository:

```bash
git clone https://github.com/JohannesL2/ai-chat-hub
cd ai-chat-hub
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file in the project root:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
```

> **Important**
>
> The environment variable **must** be named exactly:
>
> `GOOGLE_GENERATIVE_AI_API_KEY`
>
> The application will not work if a different variable name is used.

Get a free Gemini API key:

https://aistudio.google.com/app/apikey

Start the development server:

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

## Project Structure

```
app/
components/
lib/
public/
```

---

## License

MIT