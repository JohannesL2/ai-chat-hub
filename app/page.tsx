"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import WavyRippleBackground from "@/components/lightswind/wavy-ripple-background";
import { SendHorizontal } from "lucide-react";

type Role = "frontend" | "backend" | "ux" | "finance";

const roles: Role[] = [
  "frontend",
  "backend",
  "ux",
  "finance",
];


export default function Home() {

  const [role, setRole] =
    useState<Role>("frontend");

  const [input, setInput] =
    useState("");


  const {
    messages,
    sendMessage,
    status,
    setMessages,
  } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: {
        role,
      },
    }),
  });


  const send = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    if (!input.trim()) return;


    await sendMessage({
      text: input,
    });


    setInput("");
  };


  const changeRole = (
    newRole: Role
  ) => {

    setRole(newRole);

    setMessages([]);
  };


  const isLoading =
    status === "submitted" ||
    status === "streaming";


  return (
    <main className="relative min-h-screen flex justify-center p-6 overflow-hidden">
 
  <div className="fixed inset-0 -z-10 opacity-60">
    <WavyRippleBackground
      waveColor="#3b82f6"
      className="absolute inset-0 -z-10"
    />
  </div>

      <div className="
        z-1
        w-full
        max-w-3xl
        bg-white/70
        backdrop-blur-xl
        border border-white/20
        shadow-2xl
        rounded-xl
        flex
        flex-col
        h-[90vh]
      ">


        <header className="
          p-5
          border-b
        ">

          <h1 className="
            text-xl
            font-bold
          ">
            Ai Chat Hub
          </h1>


          <div className="
            flex
            gap-2
            mt-4
          ">

            {roles.map((r)=>(

              <button
                key={r}
                disabled={role === r}
                onClick={() =>
                  changeRole(r)
                }
                className={`
                  px-4
                  py-2
                  rounded-full
                  text-sm
                  ${
                    role === r
                    ? "bg-blue-600 text-white cursor-default"
                    : "bg-slate-200 cursor-pointer hover:bg-slate-300 transition-colors"
                  }
                `}
              >
                {r === "ux"
                  ? "UX/UI"
                  : r}
              </button>

            ))}

          </div>

        </header>


        <section className="
          flex-1
          overflow-y-auto
          p-5
          space-y-4
        ">


          {messages.length === 0 && (

            <p className="
              text-center
              text-slate-400
            ">
              Ask your {role}-expert!
            </p>

          )}


         {messages.map((message) => (
  <div
    key={message.id}
    className={`mb-4 ${
      message.role === "user"
        ? "text-right"
        : "text-left"
    }`}
  >

    <div
      className={`
        inline-block
        max-w-[85%]
        rounded-lg
        p-4
        ${
          message.role === "user"
            ? "bg-blue-600 text-white"
            : "bg-slate-200 text-black"
        }
      `}
    >

      {message.parts.map((part, index) => {

        if (part.type === "text") {

          return (
            <Markdown
              key={index}
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({children}) => (
                  <h2 className="
                    text-lg
                    font-bold
                    mt-4
                    mb-2
                  ">
                    {children}
                  </h2>
                ),

                p: ({children}) => (
                  <p className="
                    mb-3
                    leading-7
                  ">
                    {children}
                  </p>
                ),

                li: ({children}) => (
                  <li className="
                    ml-5
                    list-disc
                    mb-1
                  ">
                    {children}
                  </li>
                ),

                table: ({children}) => (
                  <table className="
                    border
                    border-slate-400
                    my-4
                  ">
                    {children}
                  </table>
                ),

                td: ({children}) => (
                  <td className="
                    border
                    px-3
                    py-2
                  ">
                    {children}
                  </td>
                ),

                th: ({children}) => (
                  <th className="
                    border
                    px-3
                    py-2
                    font-bold
                  ">
                    {children}
                  </th>
                ),
              }}
            >
              {part.text}
            </Markdown>
          );

        }

        return null;

      })}

    </div>

  </div>
))}


          {isLoading && (
            <p className="
              text-sm
              text-slate-400
            ">
              Skriver...
            </p>
          )}


        </section>


        <form
          onSubmit={send}
          className="
            p-4
            border-t
            flex
            gap-2
          "
        >

          <input

            value={input}

            onChange={(e)=>
              setInput(e.target.value)
            }

            placeholder="
              Skriv din fråga...
            "

            className="
              flex-1
              border
              rounded-lg
              px-4
            "
          />


          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="
              h-12
              w-12
              bg-blue-600
              hover:bg-blue-700
              text-white
              flex
              items-center
              justify-center
              duration-200
              hover:scale-105
              active:scale-95
              disabled:cursor-default
              disabled:scale-100
              disabled:bg-slate-300
              rounded-full
              cursor-pointer
            "
          >
            <SendHorizontal size={20} />
          </button>


        </form>


      </div>

    </main>
  );
}