type ConversationItemProps = {
  name: string;
  preview: string;
  time: string;
  initials: string;
  unread?: number;
  active?: boolean;
  online?: boolean;
  accent?: string;
  onClick?: () => void;
};

export function ConversationItem({
  name,
  preview,
  time,
  initials,
  unread,
  active,
  online,
  accent = "from-violet-300 to-cyan-300",
  onClick,
}: ConversationItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "group/conversation relative flex w-full gap-3 rounded-3xl border p-3 text-left transition",
        active
          ? "border-violet-200 bg-white shadow-xl shadow-violet-500/10"
          : "border-transparent bg-white/45 hover:border-white hover:bg-white/80 hover:shadow-lg",
      ].join(" ")}
    >
      <div className="relative shrink-0">
        <div
          className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${accent} text-sm font-black text-slate-900`}
        >
          {initials}
        </div>

        {online ? (
          <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-400" />
        ) : null}
      </div>

      <div className="min-w-0 flex-1 pr-12">
        <div className="flex items-center gap-2">
          <p className="min-w-0 flex-1 truncate text-sm font-black text-slate-950">
            {name}
          </p>

          <span className="shrink-0 text-[11px] font-semibold text-slate-400 transition group-hover/conversation:opacity-0">
            {time}
          </span>
        </div>

        <div className="mt-1 flex items-center justify-between gap-2">
          <p className="truncate text-xs font-medium text-slate-500">
            {preview}
          </p>

          {unread ? (
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 px-1 text-[10px] font-black text-white transition group-hover/conversation:opacity-0">
              {unread}
            </span>
          ) : null}
        </div>
      </div>

      <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1 opacity-0 pointer-events-none transition-all duration-150 group-hover/conversation:opacity-100 group-hover/conversation:pointer-events-auto">
        <span
          role="button"
          tabIndex={0}
          title="Pin"
          className="grid h-8 w-8 place-items-center rounded-xl bg-white/80 text-xs shadow-sm transition hover:bg-slate-100"
          onClick={(event) => {
            event.stopPropagation();
            console.log("pin:", name);
          }}
        >
          📌
        </span>

        <span
          role="button"
          tabIndex={0}
          title="Mark as read"
          className="grid h-8 w-8 place-items-center rounded-xl bg-white/80 text-xs shadow-sm transition hover:bg-slate-100"
          onClick={(event) => {
            event.stopPropagation();
            console.log("mark as read:", name);
          }}
        >
          ✓
        </span>

        <span
          role="button"
          tabIndex={0}
          title="More"
          className="grid h-8 w-8 place-items-center rounded-xl bg-white/80 text-xs font-black shadow-sm transition hover:bg-slate-100"
          onClick={(event) => {
            event.stopPropagation();
            console.log("more:", name);
          }}
        >
          ⋯
        </span>
      </div>
    </button>
  );
}
