"use client";

type MessageReactionBarProps = {
  open?: boolean;
  onReact?: (emoji: string) => void;
};

export function MessageReactionBar({ open, onReact }: MessageReactionBarProps) {
  return (
    <div
      className={[
        "absolute -top-11 left-1/2 z-20 -translate-x-1/2",
        "flex w-fit items-center gap-1 rounded-full",
        "border border-white/70 bg-white/90 p-1",
        "shadow-xl shadow-slate-900/10 backdrop-blur-xl",
        "transition-all duration-150",
        "opacity-0 scale-95 pointer-events-none",
        "group-hover/message:opacity-100 group-hover/message:scale-100 group-hover/message:pointer-events-auto",
        open ? "opacity-100 scale-100 pointer-events-auto" : "",
      ].join(" ")}
    >
      {["🔥", "👍", "🎉", "👀", "💜"].map((emoji) => (
        <button
          key={emoji}
          type="button"
          className="grid h-8 w-8 place-items-center rounded-full text-sm transition hover:bg-slate-100 active:scale-90"
          onClick={() => onReact?.(emoji)}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}