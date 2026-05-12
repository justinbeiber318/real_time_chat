import type { RowDataPacket } from "mysql2";

export type ConversationRow = RowDataPacket & {
  id: string;
  type: "DIRECT" | "GROUP";
  name: string | null;
  created_at: Date;
  updated_at: Date;

  other_user_id: string;
  other_user_name: string;
  other_user_email: string;

  last_message_content: string | null;
  last_message_created_at: Date | null;
};

export type ConversationListItem = {
  id: string;
  type: "DIRECT" | "GROUP";
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
  otherUser: {
    id: string;
    name: string;
    email: string;
  };
  lastMessage: null | {
    content: string;
    createdAt: Date;
  };
};

export type CreateDirectConversationBody = {
  targetUserId: string;
};