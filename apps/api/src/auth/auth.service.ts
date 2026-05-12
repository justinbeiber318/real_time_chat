import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import type { ResultSetHeader } from "mysql2";
import { db } from "../lib/db.js";
import type {
  JwtPayload,
  LoginBody,
  PublicUser,
  RegisterBody,
  UserRow,
} from "./auth.types.js";

function getJwtSecret() {
  const secret = process.env.JWT_ACCESS_SECRET;

  if (!secret) {
    throw new Error("JWT_ACCESS_SECRET is missing");
  }

  return secret;
}

function toPublicUser(user: UserRow): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
}

function createAccessToken(user: { id: string; email: string; name: string }) {
  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
    name: user.name,
  };

  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: "1d",
  });
}

async function findUserByEmail(email: string) {
  const [rows] = await db.execute<UserRow[]>(
    `
    SELECT id, name, email, password_hash, created_at, updated_at
    FROM users
    WHERE email = ?
    LIMIT 1
    `,
    [email]
  );

  return rows[0] ?? null;
}

async function findUserRowById(userId: string) {
  const [rows] = await db.execute<UserRow[]>(
    `
    SELECT id, name, email, password_hash, created_at, updated_at
    FROM users
    WHERE id = ?
    LIMIT 1
    `,
    [userId]
  );

  return rows[0] ?? null;
}

export async function registerUser(data: RegisterBody) {
  const email = data.email.toLowerCase();

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const passwordHash = await bcrypt.hash(data.password, 10);
  const userId = crypto.randomUUID();

  await db.execute<ResultSetHeader>(
    `
    INSERT INTO users (id, name, email, password_hash)
    VALUES (?, ?, ?, ?)
    `,
    [userId, data.name, email, passwordHash]
  );

  const newUser = await findUserRowById(userId);

  if (!newUser) {
    throw new Error("Failed to create user");
  }

  const accessToken = createAccessToken(newUser);

  return {
    user: toPublicUser(newUser),
    accessToken,
  };
}

export async function loginUser(data: LoginBody) {
  const email = data.email.toLowerCase();

  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(
    data.password,
    user.password_hash
  );

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const accessToken = createAccessToken(user);

  return {
    user: toPublicUser(user),
    accessToken,
  };
}

export async function getUserById(userId: string) {
  const user = await findUserRowById(userId);

  if (!user) {
    return null;
  }

  return toPublicUser(user);
}