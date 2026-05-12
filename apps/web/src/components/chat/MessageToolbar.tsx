export function MessageToolbar() {
  return (
    <div className="mb-3 flex items-center gap-1 border-b border-slate-200/70 pb-3 text-xs font-black text-slate-400">
      {["B", "I", "</>", "•", "❝"].map((item) => (
        <button
          key={item}
          className="grid h-8 min-w-8 place-items-center rounded-xl px-2 transition hover:bg-slate-100 hover:text-slate-700"
        >
          {item}
        </button>
      ))}
    </div>
  );
}