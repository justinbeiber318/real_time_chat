import crypto from "node:crypto";
import type { ResultSetHeader } from "mysql2";
import { db } from "../lib/db.js";
import { isUserInConversation } from "../conversations/conversations.service.js";
import type { ChatMessage, MessageRow } from "./messages.types.js";

function toChatMessage(row: MessageRow): ChatMessage {
  return {
    id: row.id,
    conversationId: row.conversation_id,
    content: row.content,
    createdAt: row.created_at,
    sender: {
      id: row.sender_id,
      name: row.sender_name,
      email: row.sender_email,
    },
  };
}

export async function createMessage(data: {
  conversationId: string;
  senderId: string;
  content: string;
}) {
  const isMember = await isUserInConversation({
    conversationId: data.conversationId,
    userId: data.senderId,
  });

  if (!isMember) {
    throw new Error("You are not a member of this conversation");
  }

  const messageId = crypto.randomUUID();

  await db.execute<ResultSetHeader>(
    `
    INSERT INTO messages (id, conversation_id, sender_id, content)
    VALUES (?, ?, ?, ?)
    `,
    [messageId, data.conversationId, data.senderId, data.content]
  );

  const message = await getMessageById(messageId);

  if (!message) {
    throw new Error("Failed to create message");
  }

  return message;
}

export async function getMessageById(messageId: string) {
  const [rows] = await db.execute<MessageRow[]>(
    `
    SELECT 
      messages.id,
      messages.conversation_id,
      messages.content,
      messages.created_at,
      users.id AS sender_id,
      users.name AS sender_name,
      users.email AS sender_email
    FROM messages
    JOIN users ON users.id = messages.sender_id
    WHERE messages.id = ?
    LIMIT 1
    `,
    [messageId]
  );

  const message = rows[0];

  if (!message) {
    return null;
  }

  return toChatMessage(message);
}

export async function getMessagesByConversation(data: {
  conversationId: string;
  currentUserId: string;
  limit?: number;
}) {
  const isMember = await isUserInConversation({
    conversationId: data.conversationId,
    userId: data.currentUserId,
  });

  if (!isMember) {
    throw new Error("You are not a member of this conversation");
  }

  const safeLimit = Math.min(Math.max(data.limit ?? 50, 1), 100);

  const [rows] = await db.execute<MessageRow[]>(
    `
    SELECT 
      messages.id,
      messages.conversation_id,
      messages.content,
      messages.created_at,
      users.id AS sender_id,
      users.name AS sender_name,
      users.email AS sender_email
    FROM messages
    JOIN users ON users.id = messages.sender_id
    WHERE messages.conversation_id = ?
    ORDER BY messages.created_at DESC
    LIMIT ${safeLimit}
    `,
    [data.conversationId]
  );

  return rows.reverse().map(toChatMessage);
}