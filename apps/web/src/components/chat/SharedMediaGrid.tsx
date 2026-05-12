export function SharedMediaGrid() {
  return (
    <div className="grid grid-cols-3 gap-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className={[
            "aspect-square rounded-2xl bg-gradient-to-br shadow-sm",
            index % 3 === 0
              ? "from-violet-200 to-cyan-200"
              : index % 3 === 1
              ? "from-amber-200 to-rose-200"
              : "from-slate-200 to-indigo-200",
          ].join(" ")}
        />
      ))}
    </div>
  );
}