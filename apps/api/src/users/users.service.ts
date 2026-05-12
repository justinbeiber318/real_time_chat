import { db } from "../lib/db.js";
import type { PublicUser, UserRow } from "./users.types.js";

function toPublicUser(row: UserRow): PublicUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getAllUsersExceptCurrentUser(currentUserId: string) {
  const [rows] = await db.execute<UserRow[]>(
    `
    SELECT id, name, email, created_at, updated_at
    FROM users
    WHERE id <> ?
    ORDER BY created_at DESC
    `,
    [currentUserId]
  );

  return rows.map(toPublicUser);
}