import type { User } from "./auth";

export type ChatMessage = {
  id: string;
  conversationId: string;
  content: string;
  sender: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
};

export type Conversation = {
  id: string;
  type: "DIRECT" | "GROUP";
  name: string | null;
  createdAt: string;
  updatedAt: string;
  otherUser: {
    id: string;
    name: string;
    email: string;
  };
  lastMessage: null | {
    content: string;
    createdAt: string;
  };
};

export type UsersResponse = {
  message: string;
  data: {
    users: User[];
  };
};

export type ConversationsResponse = {
  message: string;
  data: {
    conversations: Conversation[];
  };
};

export type CreateDirectConversationResponse = {
  message: string;
  data: {
    conversation: Conversation;
  };
};

export type ConversationMessagesResponse = {
  message: string;
  data: {
    messages: ChatMessage[];
  };
};