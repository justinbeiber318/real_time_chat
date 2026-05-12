import type { User } from "@/types/auth";
import type { Conversation } from "@/types/chat";

type ChatSidebarProps = {
  currentUser: User | null;
  users: User[];
  conversations: Conversation[];
  selectedConversationId: string | null;
  search: string;
  isSocketConnected: boolean;
  onSearchChange: (value: string) => void;
  onSelectConversation: (conversation: Conversation) => void;
  onStartDirectChat: (targetUserId: string) => void;
  onLogout: () => void;
};

export function ChatSidebar({
  currentUser,
  users,
  conversations,
  selectedConversationId,
  search,
  isSocketConnected,
  onSearchChange,
  onSelectConversation,
  onStartDirectChat,
  onLogout,
}: ChatSidebarProps) {
  const keyword = search.trim().toLowerCase();

  const filteredUsers = keyword
    ? users.filter((user) => {
        return (
          user.name.toLowerCase().includes(keyword) ||
          user.email.toLowerCase().includes(keyword)
        );
      })
    : users;

  return (
    <aside className="flex w-80 shrink-0 flex-col border-r border-zinc-800 bg-zinc-900">
      <div className="border-b border-zinc-800 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold">Chats</h1>

            <p className="mt-1 text-xs text-zinc-400">
              {currentUser?.name} -{" "}
              <span
                className={
                  isSocketConnected ? "text-green-400" : "text-red-400"
                }
              >
                {isSocketConnected ? "online" : "offline"}
              </span>
            </p>
          </div>

          <button
            className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-black"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>

        <input
          className="mt-4 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm outline-none focus:border-zinc-400"
          placeholder="Search users..."
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        <section className="p-3">
          <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Conversations
          </p>

          {conversations.length === 0 ? (
            <p className="px-2 text-sm text-zinc-500">
              Chưa có đoạn chat nào.
            </p>
          ) : (
            <div className="space-y-1">
              {conversations.map((conversation) => {
                const isActive = selectedConversationId === conversation.id;

                return (
                  <button
                    key={conversation.id}
                    className={`w-full rounded-xl px-3 py-3 text-left transition ${
                      isActive ? "bg-white text-black" : "hover:bg-zinc-800"
                    }`}
                    onClick={() => onSelectConversation(conversation)}
                  >
                    <p className="font-medium">
                      {conversation.otherUser.name}
                    </p>

                    <p
                      className={`mt-1 truncate text-sm ${
                        isActive ? "text-zinc-700" : "text-zinc-500"
                      }`}
                    >
                      {conversation.lastMessage?.content ||
                        conversation.otherUser.email}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        <section className="border-t border-zinc-800 p-3">
          <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Users
          </p>

          {filteredUsers.length === 0 ? (
            <p className="px-2 text-sm text-zinc-500">Không tìm thấy user.</p>
          ) : (
            <div className="space-y-1">
              {filteredUsers.map((user) => (
                <button
                  key={user.id}
                  className="w-full rounded-xl px-3 py-3 text-left hover:bg-zinc-800"
                  onClick={() => onStartDirectChat(user.id)}
                >
                  <p className="font-medium">{user.name}</p>
                  <p className="mt-1 truncate text-sm text-zinc-500">
                    {user.email}
                  </p>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </aside>
  );
}