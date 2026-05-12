"use client";

import { useRef, useState } from "react";
import { MessageReactionBar } from "./MessageReactionBar";

type MessageBubbleProps = {
  author?: string;
  time: string;
  children: React.ReactNode;
  mine?: boolean;
  reply?: string;
  reaction?: string;
};

export function MessageBubble({
  author,
  time,
  children,
  mine = false,
  reply,
  reaction,
}: MessageBubbleProps) {
  const [reactionOpen, setReactionOpen] = useState(false);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTouchStart = () => {
    pressTimer.current = setTimeout(() => {
      setReactionOpen(true);
    }, 450);
  };

  const handleTouchEnd = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  return (
    <div className={mine ? "flex w-full justify-end" : "flex w-full justify-start"}>
      <div
        className={[
          "group/message max-w-[72%]",
          mine ? "items-end" : "items-start",
        ].join(" ")}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        {!mine && author ? (
          <p className="mb-1 ml-2 text-xs font-black text-slate-500">
            {author}{" "}
            <span className="font-semibold text-slate-400">{time}</span>
          </p>
        ) : null}

        {reply ? (
          <div className="mb-2 rounded-2xl border-l-4 border-violet-400 bg-white/65 px-4 py-2 text-xs font-semibold text-slate-500">
            Replying to: {reply}
          </div>
        ) : null}

        <div
          className={[
            "relative rounded-[24px] px-5 py-3 text-sm leading-relaxed shadow-lg",
            mine
              ? "bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 text-white shadow-violet-500/20"
              : "border border-white/70 bg-white/85 text-slate-700 shadow-slate-900/5",
          ].join(" ")}
        >
          <MessageReactionBar
            open={reactionOpen}
            onReact={(emoji) => {
              console.log("react:", emoji);
              setReactionOpen(false);
            }}
          />

          {children}

          {reaction ? (
            <div
              className={[
                "absolute -bottom-4 rounded-full border border-white bg-white px-2 py-1 text-xs shadow-lg",
                mine ? "right-4" : "left-4",
              ].join(" ")}
            >
              {reaction}
            </div>
          ) : null}
        </div>

        {mine ? (
          <p className="mt-1 text-right text-[11px] font-semibold text-slate-400">
            {time} • seen
          </p>
        ) : null}
      </div>
    </div>
  );
}