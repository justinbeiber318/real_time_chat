"use client";

import { useState } from "react";
import { MessageToolbar } from "./MessageToolbar";
import type { Conversation } from "./ChatLayout";

type MessageInputProps = {
  conversation: Conversation;
  onSendMessage: (text: string) => void;
};

export function MessageInput({
  conversation,
  onSendMessage,
}: MessageInputProps) {
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) return;

    onSendMessage(trimmedMessage);
    setMessage("");
  };

  return (
    <div className="shrink-0 border-t border-white/60 bg-white/50 p-3 backdrop-blur-xl">
      <div className="rounded-[24px] border border-white/80 bg-white/85 p-3 shadow-2xl shadow-slate-900/5">
        <MessageToolbar />

        <div className="flex items-end gap-3">
          <button
            type="button"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-slate-100 text-lg transition hover:bg-slate-200"
          >
            +
          </button>

          <textarea
            rows={1}
            value={message}
            placeholder={`Message ${conversation.name}...`}
            className="max-h-32 min-h-11 flex-1 resize-none bg-transparent py-3 text-sm font-medium outline-none placeholder:text-slate-400"
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                sendMessage();
              }
            }}
          />

          <div className="hidden items-center gap-1 md:flex">
            {["🖼", "📎", "😊", "GIF", "🎙"].map((item) => (
              <button
                key={item}
                type="button"
                className="grid h-10 min-w-10 place-items-center rounded-2xl px-2 text-xs font-black text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                {item}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={sendMessage}
            disabled={!message.trim()}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 text-white shadow-lg shadow-violet-500/25 transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}