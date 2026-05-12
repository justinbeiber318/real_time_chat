export function LiveTranslateCard() {
  return (
    <div className="rounded-3xl border border-cyan-200/70 bg-white/80 p-4 shadow-lg shadow-cyan-500/10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-black text-slate-950">Live Translate</p>
          <p className="text-xs font-semibold text-slate-500">
            English → Vietnamese
          </p>
        </div>

        <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-black text-cyan-700">
          ON
        </span>
      </div>

      <p className="mt-3 rounded-2xl bg-cyan-50 p-3 text-xs font-semibold leading-relaxed text-slate-600">
        Tin nhắn đang được dịch theo thời gian thực.
      </p>
    </div>
  );
}