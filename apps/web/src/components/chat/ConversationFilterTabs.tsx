const filters = ["All", "Unread", "Pinned"];

export function ConversationFilterTabs() {
  return (
    <div className="flex gap-2">
      {filters.map((filter, index) => (
        <button
          key={filter}
          className={[
            "rounded-full px-4 py-2 text-xs font-bold transition",
            index === 0
              ? "bg-slate-950 text-white shadow-lg shadow-slate-950/10"
              : "bg-white/65 text-slate-500 hover:bg-white hover:text-slate-900",
          ].join(" ")}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}