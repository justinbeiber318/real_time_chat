import type { Conversation } from "./ChatLayout";
import { SharedMediaGrid } from "./SharedMediaGrid";
import { SharedFilesList } from "./SharedFilesList";

type ChatDetailsPanelProps = {
  conversation: Conversation;
};

export function ChatDetailsPanel({ conversation }: ChatDetailsPanelProps) {
  return (
    <aside className="hidden h-full min-h-0 overflow-y-auto border-l border-white/60 bg-white/40 p-4 backdrop-blur-xl xl:block">
      <div className="rounded-[28px] border border-white/70 bg-white/70 p-4 shadow-xl shadow-slate-900/5">
        <div
          className={`mx-auto grid h-20 w-20 place-items-center rounded-[28px] bg-gradient-to-br ${conversation.accent} text-xl font-black text-slate-900`}
        >
          {conversation.initials}
        </div>

        <div className="mt-3 text-center">
          <h3 className="text-lg font-black text-slate-950">
            {conversation.name}
          </h3>
          <p className="text-xs font-semibold text-slate-500">
            {conversation.subtitle}
          </p>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2">
          {["📞", "🎥", "➕", "⋯"].map((icon) => (
            <button
              key={icon}
              className="grid h-11 place-items-center rounded-2xl bg-slate-100 text-sm transition hover:bg-slate-200"
            >
              {icon}
            </button>
          ))}
        </div>
      </div>

      <section className="mt-4 rounded-[28px] border border-white/70 bg-white/55 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-black text-slate-950">Members</h4>
          <button className="text-xs font-black text-violet-600">+ Add</button>
        </div>

        <div className="flex -space-x-2">
          {["LM", "AD", "PR", "ET", "+4"].map((item) => (
            <div
              key={item}
              className="grid h-10 w-10 place-items-center rounded-2xl border-2 border-white bg-gradient-to-br from-violet-200 to-cyan-200 text-[11px] font-black text-slate-800"
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-4 rounded-[28px] border border-white/70 bg-white/55 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-black text-slate-950">Shared media</h4>
          <button className="text-xs font-black text-violet-600">
            See all
          </button>
        </div>

        <SharedMediaGrid />
      </section>

      <section className="mt-4 rounded-[28px] border border-white/70 bg-white/55 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-black text-slate-950">Files</h4>
          <button className="text-xs font-black text-violet-600">
            See all
          </button>
        </div>

        <SharedFilesList />
      </section>

      <section className="mt-4 rounded-[28px] border border-white/70 bg-white/55 p-4">
        <h4 className="text-sm font-black text-slate-950">Chat settings</h4>

        <div className="mt-3 space-y-2">
          {[
            ["Theme", "Pulse"],
            ["Notifications", "All messages"],
            ["Nickname", "Set nickname"],
            ["Focus mode", "Enabled"],
          ].map(([label, value]) => (
            <button
              key={label}
              className="flex w-full items-center justify-between rounded-2xl bg-white/60 px-3 py-3 text-left transition hover:bg-white"
            >
              <span className="text-xs font-black text-slate-700">
                {label}
              </span>
              <span className="text-[11px] font-semibold text-slate-400">
                {value}
              </span>
            </button>
          ))}
        </div>
      </section>
    </aside>
  );
}