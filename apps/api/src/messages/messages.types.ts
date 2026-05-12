import type { RowDataPacket } from "mysql2";

export type MessageRow = RowDataPacket & {
  id: string;
  conversation_id: string;
  content: string;
  created_at: Date;
  sender_id: string;
  sender_name: string;
  sender_email: string;
};

export type ChatMessage = {
  id: string;
  conversationId: string;
  content: string;
  sender: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: Date;
};