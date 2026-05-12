"use client";

import { useState } from "react";
import { ChatNavRail } from "./ChatNavRail";
import { ConversationList } from "./ConversationList";
import { ChatWindow } from "./ChatWindow";
import { ChatDetailsPanel } from "./ChatDetailsPanel";

const initialConversations = [
  {
    id: "project-aurora",
    name: "Project Aurora",
    preview: "Lena: Finalizing the roadmap...",
    time: "9:41",
    initials: "PA",
    unread: 6,
    online: true,
    accent: "from-violet-300 to-cyan-300",
    subtitle: "8 members • Priya is typing...",
  },
  {
    id: "design-system",
    name: "Design System Team",
    preview: "Ethan: New tokens added",
    time: "9:32",
    initials: "DS",
    unread: 3,
    online: true,
    accent: "from-fuchsia-300 to-violet-300",
    subtitle: "5 members • Ethan is online",
  },
  {
    id: "marketing-sync",
    name: "Marketing Sync",
    preview: "Priya: Campaign update",
    time: "9:15",
    initials: "MS",
    unread: 2,
    accent: "from-amber-200 to-rose-300",
    subtitle: "12 members • Campaign planning",
  },
  {
    id: "dev-lounge",
    name: "Dev Lounge",
    preview: "Arjun: Pushed the fix",
    time: "8:47",
    initials: "</>",
    online: true,
    accent: "from-emerald-200 to-cyan-300",
    subtitle: "24 members • Developers online",
  },
  {
    id: "nova-labs",
    name: "Client • Nova Labs",
    preview: "You: Shared the proposal",
    time: "Yesterday",
    initials: "NL",
    accent: "from-slate-200 to-blue-200",
    subtitle: "Client chat",
  },
  {
    id: "ux-research",
    name: "UX Research",
    preview: "Sofia: Notes attached",
    time: "Mon",
    initials: "UX",
    accent: "from-indigo-200 to-violet-200",
    subtitle: "Research team",
  },
];

export type Conversation = (typeof initialConversations)[number];

export type ChatMessage = {
  id: string;
  text: string;
  time: string;
  mine?: boolean;
  author?: string;
};

const initialMessagesByConversationId: Record<string, ChatMessage[]> = {
  "project-aurora": [
    {
      id: "pa-1",
      author: "Lena Martinez",
      time: "9:31 AM",
      text: "Here’s the latest roadmap. Let’s align on priorities for the next sprint.",
    },
    {
      id: "pa-2",
      mine: true,
      time: "9:34 AM",
      text: "Looks great! I’ll review and share feedback soon.",
    },
    {
      id: "pa-3",
      author: "Arjun Dev",
      time: "9:36 AM",
      text: "I’ll take point on the onboarding improvements.",
    },
  ],
  "design-system": [
    {
      id: "ds-1",
      author: "Ethan",
      time: "9:32 AM",
      text: "New design tokens were added to the theme package.",
    },
  ],
  "marketing-sync": [
    {
      id: "ms-1",
      author: "Priya",
      time: "9:15 AM",
      text: "Campaign update is ready for review.",
    },
  ],
  "dev-lounge": [
    {
      id: "dev-1",
      author: "Arjun",
      time: "8:47 AM",
      text: "Pushed the fix. Can someone review?",
    },
  ],
  "nova-labs": [
    {
      id: "nl-1",
      mine: true,
      time: "Yesterday",
      text: "Shared the proposal.",
    },
  ],
  "ux-research": [
    {
      id: "ux-1",
      author: "Sofia",
      time: "Mon",
      text: "Research notes attached.",
    },
  ],
};

function getCurrentTime() {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date());
}

export function ChatLayout() {
  const [conversations, setConversations] = useState(initialConversations);

  const [selectedConversationId, setSelectedConversationId] = useState(
    initialConversations[0].id
  );

  const [messagesByConversationId, setMessagesByConversationId] = useState(
    initialMessagesByConversationId
  );

  const selectedConversation =
    conversations.find((item) => item.id === selectedConversationId) ??
    conversations[0];

  const selectedMessages =
    messagesByConversationId[selectedConversationId] ?? [];

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

  const handleSendMessage = (text: string) => {
    const trimmedText = text.trim();

    if (!trimmedText) return;

    const sentTime = getCurrentTime();

    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      mine: true,
      text: trimmedText,
      time: sentTime,
    };

    setMessagesByConversationId((current) => ({
      ...current,
      [selectedConversationId]: [
        ...(current[selectedConversationId] ?? []),
        newMessage,
      ],
    }));

    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === selectedConversationId
          ? {
              ...conversation,
              preview: `You: ${trimmedText}`,
              time: sentTime,
              unread: undefined,
            }
          : conversation
      )
    );
  };

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
            messages={selectedMessages}
            onSendMessage={handleSendMessage}
          />

          <ChatDetailsPanel conversation={selectedConversation} />
        </section>
      </div>
    </main>
  );
}