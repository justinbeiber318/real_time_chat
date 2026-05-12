import type { Conversation } from "./ChatLayout";

type ChatHeaderProps = {
  conversation: Conversation;
};

export function ChatHeader({ conversation }: ChatHeaderProps) {
  return (
    <header className="flex shrink-0 items-center justify-between border-b border-white/60 bg-white/45 px-6 py-4 backdrop-blur-xl">
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative shrink-0">
          <div
            className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${conversation.accent} text-sm font-black text-slate-900`}
          >
            {conversation.initials}
          </div>

          {conversation.online ? (
            <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-white bg-emerald-400" />
          ) : null}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-lg font-black text-slate-950">
              {conversation.name}
            </h2>

            <span className="rounded-full bg-violet-100 px-2 py-1 text-[10px] font-black text-violet-600">
              Focus
            </span>
          </div>

          <p className="truncate text-xs font-semibold text-slate-500">
            {conversation.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {["🔎", "📞", "🎥", "⋯"].map((item) => (
          <button
            key={item}
            className="grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 bg-white/45 text-sm transition hover:bg-white"
          >
            {item}
          </button>
        ))}
      </div>
    </header>
  );
}