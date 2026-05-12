const navItems = [
  { label: "Chats", icon: "💬", badge: 8, active: true },
  { label: "Contacts", icon: "👥" },
  { label: "Calls", icon: "📞" },
  { label: "Spaces", icon: "✨" },
  { label: "AI", icon: "✦" },
  { label: "Settings", icon: "⚙️" },
];

export function ChatNavRail() {
  return (
    <aside className="hidden h-full min-h-0 flex-col items-center justify-between overflow-hidden bg-[#111827] px-3 py-5 text-white lg:flex">
      <div className="min-h-0 flex flex-col items-center gap-6">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 via-indigo-500 to-cyan-400 text-xl font-black shadow-lg shadow-violet-500/30">
          P
        </div>

        <nav className="min-h-0 flex flex-col gap-3 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.label}
              title={item.label}
              className={[
                "group relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-lg transition",
                item.active
                  ? "bg-white text-slate-950 shadow-lg"
                  : "text-white/65 hover:bg-white/10 hover:text-white",
              ].join(" ")}
            >
              <span>{item.icon}</span>

              {item.badge ? (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                  {item.badge}
                </span>
              ) : null}

              <span className="pointer-events-none absolute left-14 z-50 rounded-xl bg-slate-950 px-3 py-2 text-xs font-medium text-white opacity-0 shadow-xl transition group-hover:opacity-100">
                {item.label}
              </span>
            </button>
          ))}
        </nav>
      </div>

      <div className="shrink-0 flex flex-col items-center gap-3">
        <button
          title="Shortcuts"
          className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-lg text-white/80 transition hover:bg-white/15 hover:text-white"
        >
          ⌘
        </button>

        <div className="relative">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-amber-200 to-rose-300 text-sm font-bold text-slate-900">
            AV
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#111827] bg-emerald-400" />
        </div>
      </div>
    </aside>
  );
}