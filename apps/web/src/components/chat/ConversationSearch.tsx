export function ConversationSearch() {
  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
        🔎
      </span>

      <input
        placeholder="Search chats, people, messages..."
        className="h-12 w-full rounded-2xl border border-white/70 bg-white/70 pl-11 pr-4 text-sm outline-none ring-violet-500/20 transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-4"
      />
    </div>
  );
}