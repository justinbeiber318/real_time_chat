import crypto from "node:crypto";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../lib/db.js";
import type {
  ConversationListItem,
  ConversationRow,
} from "./conversations.types.js";

type IdRow = RowDataPacket & {
  id: string;
};

function toConversationListItem(row: ConversationRow): ConversationListItem {
  return {
    id: row.id,
    type: row.type,
    name: row.name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    otherUser: {
      id: row.other_user_id,
      name: row.other_user_name,
      email: row.other_user_email,
    },
    lastMessage: row.last_message_content
      ? {
          content: row.last_message_content,
          createdAt: row.last_message_created_at as Date,
        }
      : null,
  };
}

export async function getConversationByIdForUser(
  conversationId: string,
  currentUserId: string
) {
  const [rows] = await db.execute<ConversationRow[]>(
    `
    SELECT
      conversations.id,
      conversations.type,
      conversations.name,
      conversations.created_at,
      conversations.updated_at,

      other_user.id AS other_user_id,
      other_user.name AS other_user_name,
      other_user.email AS other_user_email,

      last_message.content AS last_message_content,
      last_message.created_at AS last_message_created_at
    FROM conversations
    JOIN conversation_members current_member
      ON current_member.conversation_id = conversations.id
      AND current_member.user_id = ?
    JOIN conversation_members other_member
      ON other_member.conversation_id = conversations.id
      AND other_member.user_id <> ?
    JOIN users other_user
      ON other_user.id = other_member.user_id
    LEFT JOIN messages last_message
      ON last_message.id = (
        SELECT messages.id
        FROM messages
        WHERE messages.conversation_id = conversations.id
        ORDER BY messages.created_at DESC
        LIMIT 1
      )
    WHERE conversations.id = ?
      AND conversations.type = 'DIRECT'
    LIMIT 1
    `,
    [currentUserId, currentUserId, conversationId]
  );

  const conversation = rows[0];

  if (!conversation) {
    return null;
  }

  return toConversationListItem(conversation);
}

export async function getMyConversations(currentUserId: string) {
  const [rows] = await db.execute<ConversationRow[]>(
    `
    SELECT
      conversations.id,
      conversations.type,
      conversations.name,
      conversations.created_at,
      conversations.updated_at,

      other_user.id AS other_user_id,
      other_user.name AS other_user_name,
      other_user.email AS other_user_email,

      last_message.content AS last_message_content,
      last_message.created_at AS last_message_created_at
    FROM conversations
    JOIN conversation_members current_member
      ON current_member.conversation_id = conversations.id
      AND current_member.user_id = ?
    JOIN conversation_members other_member
      ON other_member.conversation_id = conversations.id
      AND other_member.user_id <> ?
    JOIN users other_user
      ON other_user.id = other_member.user_id
    LEFT JOIN messages last_message
      ON last_message.id = (
        SELECT messages.id
        FROM messages
        WHERE messages.conversation_id = conversations.id
        ORDER BY messages.created_at DESC
        LIMIT 1
      )
    WHERE conversations.type = 'DIRECT'
    ORDER BY COALESCE(last_message.created_at, conversations.updated_at) DESC
    `,
    [currentUserId, currentUserId]
  );

  return rows.map(toConversationListItem);
}

async function findDirectConversationIdBetweenUsers(
  currentUserId: string,
  targetUserId: string
) {
  const [rows] = await db.execute<IdRow[]>(
    `
    SELECT conversations.id
    FROM conversations
    JOIN conversation_members member_a
      ON member_a.conversation_id = conversations.id
      AND member_a.user_id = ?
    JOIN conversation_members member_b
      ON member_b.conversation_id = conversations.id
      AND member_b.user_id = ?
    WHERE conversations.type = 'DIRECT'
    LIMIT 1
    `,
    [currentUserId, targetUserId]
  );

  return rows[0]?.id ?? null;
}

async function checkUserExists(userId: string) {
  const [rows] = await db.execute<IdRow[]>(
    `
    SELECT id
    FROM users
    WHERE id = ?
    LIMIT 1
    `,
    [userId]
  );

  return Boolean(rows[0]);
}

export async function createOrGetDirectConversation(data: {
  currentUserId: string;
  targetUserId: string;
}) {
  if (data.currentUserId === data.targetUserId) {
    throw new Error("You cannot create conversation with yourself");
  }

  const targetUserExists = await checkUserExists(data.targetUserId);

  if (!targetUserExists) {
    throw new Error("Target user not found");
  }

  const existingConversationId = await findDirectConversationIdBetweenUsers(
    data.currentUserId,
    data.targetUserId
  );

  if (existingConversationId) {
    const existingConversation = await getConversationByIdForUser(
      existingConversationId,
      data.currentUserId
    );

    if (!existingConversation) {
      throw new Error("Conversation not found");
    }

    return existingConversation;
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const conversationId = crypto.randomUUID();
    const currentMemberId = crypto.randomUUID();
    const targetMemberId = crypto.randomUUID();

    await connection.execute<ResultSetHeader>(
      `
      INSERT INTO conversations (id, type, name, created_by)
      VALUES (?, 'DIRECT', NULL, ?)
      `,
      [conversationId, data.currentUserId]
    );

    await connection.execute<ResultSetHeader>(
      `
      INSERT INTO conversation_members (id, conversation_id, user_id)
      VALUES (?, ?, ?), (?, ?, ?)
      `,
      [
        currentMemberId,
        conversationId,
        data.currentUserId,
        targetMemberId,
        conversationId,
        data.targetUserId,
      ]
    );

    await connection.commit();

    const conversation = await getConversationByIdForUser(
      conversationId,
      data.currentUserId
    );

    if (!conversation) {
      throw new Error("Failed to create conversation");
    }

    return conversation;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function isUserInConversation(data: {
  conversationId: string;
  userId: string;
}) {
  const [rows] = await db.execute<IdRow[]>(
    `
    SELECT id
    FROM conversation_members
    WHERE conversation_id = ?
      AND user_id = ?
    LIMIT 1
    `,
    [data.conversationId, data.userId]
  );

  return Boolean(rows[0]);
}