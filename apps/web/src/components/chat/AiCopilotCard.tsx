export function AiCopilotCard() {
  return (
    <div className="rounded-3xl border border-violet-200/70 bg-gradient-to-br from-white/90 to-violet-50/90 p-4 shadow-xl shadow-violet-500/10">
      <div className="flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 text-xs text-white">
          ✦
        </span>

        <div>
          <p className="text-sm font-black text-slate-950">
            AI Copilot Summary
          </p>
          <p className="text-xs font-semibold text-slate-500">
            Generated from this chat
          </p>
        </div>
      </div>

      <ul className="mt-3 space-y-1 text-xs font-medium leading-relaxed text-slate-600">
        <li>• Roadmap v3 was shared by Lena.</li>
        <li>• Team will review onboarding improvements.</li>
        <li>• Voice room sync suggested for later today.</li>
      </ul>
    </div>
  );
}