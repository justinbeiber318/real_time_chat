export function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
      <div className="flex gap-1 rounded-full bg-white/80 px-4 py-3 shadow-sm">
        <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:120ms]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:240ms]" />
      </div>

      Priya is typing...
    </div>
  );
}