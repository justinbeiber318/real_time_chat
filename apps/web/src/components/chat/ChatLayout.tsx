"use client";

import { useEffect, useState } from "react";
import { ChatNavRail } from "./ChatNavRail";
import { ConversationList } from "./ConversationList";
import { ChatWindow } from "./ChatWindow";
import { ChatDetailsPanel } from "./ChatDetailsPanel";
import { api, type ApiConversation, type ApiMessage } from "../../lib/api";
export type Conversation = {
  id: string;
  name: string;
  preview: string;
  time: string;
  initials: string;
  unread?: number;
  online?: boolean;
  accent: string;
  subtitle: string;
};

export type ChatMessage = {
  id: string;
  text: string;
  time: string;
  mine?: boolean;
  author?: string;
};

function formatTime(value?: string | null) {
  if (!value) return "";

  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function mapConversation(item: ApiConversation): Conversation {
  const name = item.name || item.otherUser?.name || item.other_user_name || "Unknown user";

  const lastMessage = item.lastMessage?.content || item.last_message || "No messages yet";

  const lastMessageTime =
    item.lastMessage?.createdAt ||
    item.lastMessage?.created_at ||
    item.last_message_at ||
    item.updatedAt ||
    item.updated_at ||
    item.createdAt ||
    item.created_at;

  return {
    id: item.id,
    name,
    preview: lastMessage,
    time: formatTime(lastMessageTime),
    initials: getInitials(name),
    online: true,
    accent: "from-violet-300 to-cyan-300",
    subtitle:
      item.type === "DIRECT"
        ? item.otherUser?.email || item.other_user_email || "Direct message"
        : "Group chat",
  };
}

function mapMessage(message: ApiMessage, currentUserId?: string): ChatMessage {
  const senderId = message.senderId || message.sender_id || message.sender?.id;

  return {
    id: message.id,
    text: message.content,
    time: formatTime(message.createdAt || message.created_at),
    mine: String(senderId) === String(currentUserId),
    author: message.sender?.name || message.sender_name,
  };
}

export function ChatLayout() {
  const [currentUserId, setCurrentUserId] = useState<string>();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const selectedConversation =
    conversations.find((item) => item.id === selectedConversationId) ??
    conversations[0];

  useEffect(() => {
    async function bootstrap() {
      try {
        setLoading(true);
        setError("");

        let token = localStorage.getItem("accessToken");

        if (!token) {
          const loginResult = await api.login({
            email: "user1@test.com",
            password: "123456",
          });

          token = loginResult.accessToken;
          localStorage.setItem("accessToken", token);
          setCurrentUserId(loginResult.user.id);
        } else {
          const meResult = await api.me();
          setCurrentUserId(meResult.user.id);
        }

        const conversationsResult = await api.getConversations();
        const mappedConversations =
          conversationsResult.conversations.map(mapConversation);

        setConversations(mappedConversations);

        if (mappedConversations[0]) {
          setSelectedConversationId(mappedConversations[0].id);
        }
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Failed to load chat");
      } finally {
        setLoading(false);
      }
    }

    bootstrap();
  }, []);

  useEffect(() => {
    async function loadMessages() {
      if (!selectedConversationId) return;

      try {
        const result = await api.getMessages(selectedConversationId);

        setMessages(
          result.messages.map((message) => mapMessage(message, currentUserId))
        );
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Failed to load messages");
      }
    }

    loadMessages();
  }, [selectedConversationId, currentUserId]);

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);

    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === conversationId
          ? { ...conversation, unread: undefined }
          : conversation
      )
    );
  };

  const handleSendMessage = async (text: string) => {
    const trimmedText = text.trim();

    if (!trimmedText || !selectedConversationId) return;

    try {
      const result = await api.sendMessage(selectedConversationId, trimmedText);
      const newMessage = mapMessage(result.message, currentUserId);

      setMessages((current) => [...current, newMessage]);

      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === selectedConversationId
            ? {
                ...conversation,
                preview: `You: ${trimmedText}`,
                time: newMessage.time,
                unread: undefined,
              }
            : conversation
        )
      );
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to send message");
    }
  };

  if (loading) {
    return (
      <main className="fixed inset-0 grid place-items-center bg-[#eef3ff] text-slate-950">
        <div className="rounded-3xl bg-white/80 px-6 py-4 text-sm font-black shadow-xl">
          Loading chat...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="fixed inset-0 grid place-items-center bg-[#eef3ff] p-6 text-slate-950">
        <div className="max-w-md rounded-3xl bg-white/80 px-6 py-4 text-center shadow-xl">
          <p className="text-sm font-black text-rose-600">API Error</p>
          <p className="mt-2 text-xs font-semibold text-slate-500">{error}</p>
          <p className="mt-3 text-xs font-semibold text-slate-400">
            Check backend is running at http://localhost:4000 and test user exists.
          </p>
        </div>
      </main>
    );
  }

  if (!selectedConversation) {
    return (
      <main className="fixed inset-0 grid place-items-center bg-[#eef3ff] text-slate-950">
        <div className="rounded-3xl bg-white/80 px-6 py-4 text-sm font-black shadow-xl">
          No conversations yet
        </div>
      </main>
    );
  }

  return (
    <main className="fixed inset-0 h-[100svh] max-h-[100svh] overflow-hidden bg-[#eef3ff] p-0 text-slate-950 md:p-3">
      <div className="relative h-full min-h-0 overflow-hidden">
        <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-violet-300/50 blur-3xl" />
        <div className="pointer-events-none absolute right-10 top-10 h-96 w-96 rounded-full bg-cyan-300/40 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-fuchsia-300/30 blur-3xl" />

        <section className="relative grid h-full min-h-0 grid-rows-[minmax(0,1fr)] overflow-hidden border-white/60 bg-white/45 shadow-2xl backdrop-blur-xl md:grid-cols-[72px_minmax(340px,400px)_minmax(0,1fr)_320px] md:rounded-[24px] md:border">
          <ChatNavRail />

          <ConversationList
            conversations={conversations}
            selectedConversationId={selectedConversationId}
            onSelectConversation={handleSelectConversation}
          />

          <ChatWindow
            conversation={selectedConversation}
            messages={messages}
            onSendMessage={handleSendMessage}
          />

          <ChatDetailsPanel conversation={selectedConversation} />
        </section>
      </div>
    </main>
  );
}