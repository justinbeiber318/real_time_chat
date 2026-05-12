import { ConversationSearch } from "./ConversationSearch";
import { ConversationFilterTabs } from "./ConversationFilterTabs";
import { ConversationItem } from "./ConversationItem";
import type { Conversation } from "./ChatLayout";
type ConversationListProps = {
  conversations: Conversation[];
  selectedConversationId: string;
  onSelectConversation: (id: string) => void;
};

export function ConversationList({
  conversations,
  selectedConversationId,
  onSelectConversation,
}: ConversationListProps) {
  return (
    <aside className="relative hidden h-full min-h-0 flex-col overflow-hidden border-r border-white/60 bg-white/40 p-4 backdrop-blur-xl md:flex">
      <div className="shrink-0">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-violet-500">
              PulseChat Neo
            </p>
            <h1 className="text-2xl font-black tracking-tight text-slate-950">
              Chats
            </h1>
          </div>

          <button className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-lg font-bold text-white shadow-lg shadow-slate-950/15 transition hover:scale-105">
            +
          </button>
        </div>

        <ConversationSearch />

        <div className="mt-4">
          <ConversationFilterTabs />
        </div>
      </div>

      <div className="mt-5 min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
        {conversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            {...conversation}
            active={conversation.id === selectedConversationId}
            onClick={() => onSelectConversation(conversation.id)}
          />
        ))}
      </div>

      <div className="mt-4 shrink-0 rounded-3xl border border-white/70 bg-gradient-to-br from-slate-950 to-indigo-950 p-4 text-white shadow-xl shadow-indigo-900/20">
        <p className="text-sm font-black">Quick Actions</p>
        <p className="mt-1 text-xs text-white/60">
          Create new chat, space, or voice room instantly.
        </p>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {["Chat", "Space", "Voice"].map((item) => (
            <button
              key={item}
              className="rounded-2xl bg-white/10 px-3 py-2 text-xs font-bold text-white/85 transition hover:bg-white/15 hover:text-white"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}