export function ConversationContextMenu() {
  return (
    <div className="absolute right-5 top-[275px] z-20 w-44 rounded-2xl border border-white/70 bg-white/90 p-2 text-sm shadow-2xl shadow-slate-900/10 backdrop-blur-xl">
      <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left font-semibold text-slate-700 hover:bg-slate-100">
        📌 Pin
      </button>

      <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left font-semibold text-slate-700 hover:bg-slate-100">
        ✓ Mark as read
      </button>

      <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left font-semibold text-slate-700 hover:bg-slate-100">
        🗄 Archive
      </button>

      <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left font-semibold text-rose-600 hover:bg-rose-50">
        🗑 Delete
      </button>
    </div>
  );
}