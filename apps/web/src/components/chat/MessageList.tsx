"use client";

import { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { AiCopilotCard } from "./AiCopilotCard";
import { VoiceRoomCard } from "./VoiceRoomCard";
import { LiveTranslateCard } from "./LiveTranslateCard";
import type { ChatMessage, Conversation } from "./ChatLayout";

type MessageListProps = {
  conversation: Conversation;
  messages: ChatMessage[];
};

export function MessageList({ conversation, messages }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation.id, messages.length]);

  return (
    <div className="h-full min-h-0 space-y-6 overflow-y-auto overscroll-contain px-6 py-6">
      <div className="mx-auto w-fit rounded-full bg-white/65 px-4 py-2 text-xs font-black text-slate-400">
        Today
      </div>

      {messages.length === 0 ? (
        <div className="mx-auto max-w-md rounded-3xl border border-white/70 bg-white/75 p-6 text-center shadow-lg shadow-slate-900/5">
          <p className="text-sm font-black text-slate-800">
            No messages yet
          </p>
          <p className="mt-1 text-xs font-semibold text-slate-400">
            Start the conversation with {conversation.name}.
          </p>
        </div>
      ) : (
        messages.map((message) => (
          <MessageBubble
            key={message.id}
            mine={message.mine}
            author={message.author}
            time={message.time}
          >
            {message.text}
          </MessageBubble>
        ))
      )}

      {conversation.id === "project-aurora" ? (
        <>
          <TypingIndicator />

          <div className="grid gap-3 xl:grid-cols-3">
            <AiCopilotCard />
            <VoiceRoomCard />
            <LiveTranslateCard />
          </div>
        </>
      ) : null}

      <div ref={bottomRef} />
    </div>
  );
}