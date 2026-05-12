const files = [
  { name: "aurora_roadmap_v3.pdf", meta: "2.4 MB • PDF", icon: "📄" },
  { name: "brand_guidelines.pdf", meta: "4.8 MB • PDF", icon: "🎨" },
  { name: "sprint_planning.xlsx", meta: "120 KB • XLSX", icon: "📊" },
];

export function SharedFilesList() {
  return (
    <div className="space-y-2">
      {files.map((file) => (
        <button
          key={file.name}
          className="flex w-full items-center gap-3 rounded-2xl bg-white/65 p-3 text-left transition hover:bg-white"
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-lg">
            {file.icon}
          </span>

          <span className="min-w-0 flex-1">
            <span className="block truncate text-xs font-black text-slate-700">
              {file.name}
            </span>
            <span className="block text-[11px] font-semibold text-slate-400">
              {file.meta}
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}