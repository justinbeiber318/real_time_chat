const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export type ApiUser = {
  id: string;
  name: string;
  email: string;
};

export type ApiConversation = {
  id: string;
  type: "DIRECT" | "GROUP";
  name?: string | null;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
  otherUser?: ApiUser;
  other_user_id?: string;
  other_user_name?: string;
  other_user_email?: string;
  lastMessage?: {
    content: string;
    createdAt?: string;
    created_at?: string;
  } | null;
  last_message?: string | null;
  last_message_at?: string | null;
};

export type ApiMessage = {
  id: string;
  conversationId?: string;
  conversation_id?: string;
  senderId?: string;
  sender_id?: string;
  content: string;
  createdAt?: string;
  created_at?: string;
  sender?: ApiUser;
  sender_name?: string;
};

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const text = await response.text();

  let data: any = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    console.error("API returned non-JSON:", text);
    throw new Error("API did not return JSON");
  }

  if (!response.ok) {
    throw new Error(data?.message || `Request failed with ${response.status}`);
  }

  return data as T;
}

function unwrapData<T>(response: T | { data: T }) {
  if (
    response &&
    typeof response === "object" &&
    "data" in response &&
    (response as { data: T }).data
  ) {
    return (response as { data: T }).data;
  }

  return response as T;
}

export const api = {
  async login(input: { email: string; password: string }) {
    const response = await apiFetch<
      | { user: ApiUser; accessToken: string }
      | { data: { user: ApiUser; accessToken: string } }
    >("/auth/login", {
      method: "POST",
      body: JSON.stringify(input),
    });

    return unwrapData(response);
  },

  async me() {
    const response = await apiFetch<
      | { user: ApiUser }
      | { data: { user: ApiUser } }
    >("/auth/me");

    return unwrapData(response);
  },

  async getConversations() {
    const response = await apiFetch<
      | { conversations: ApiConversation[] }
      | { data: { conversations: ApiConversation[] } }
    >("/conversations");

    return unwrapData(response);
  },

  async getMessages(conversationId: string) {
    const response = await apiFetch<
      | { messages: ApiMessage[] }
      | { data: { messages: ApiMessage[] } }
    >(`/messages/conversation/${conversationId}`);

    return unwrapData(response);
  },

  async sendMessage(conversationId: string, content: string) {
    const response = await apiFetch<
      | { message: ApiMessage }
      | { data: { message: ApiMessage } }
    >(`/messages/conversation/${conversationId}`, {
      method: "POST",
      body: JSON.stringify({ content }),
    });

    return unwrapData(response);
  },
};