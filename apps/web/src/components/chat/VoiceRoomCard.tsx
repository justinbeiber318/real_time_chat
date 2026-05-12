export function VoiceRoomCard() {
  return (
    <div className="rounded-3xl border border-emerald-200/70 bg-white/80 p-4 shadow-lg shadow-emerald-500/10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-black text-slate-950">Voice Room</p>
          <p className="text-xs font-semibold text-slate-500">
            Design Sync • 3 in room
          </p>
        </div>

        <button className="rounded-full bg-emerald-500 px-4 py-2 text-xs font-black text-white shadow-lg shadow-emerald-500/20">
          Join
        </button>
      </div>

      <div className="mt-4 flex items-end gap-1">
        {Array.from({ length: 24 }).map((_, index) => (
          <span
            key={index}
            className="w-1 rounded-full bg-emerald-400/70"
            style={{ height: `${8 + ((index * 7) % 26)}px` }}
          />
        ))}
      </div>
    </div>
  );
}