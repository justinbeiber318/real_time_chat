import type { Request } from "express";
import type { RowDataPacket } from "mysql2";

export type UserRow = RowDataPacket & {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
};

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export type RegisterBody = {
  name: string;
  email: string;
  password: string;
};

export type LoginBody = {
  email: string;
  password: string;
};

export type JwtPayload = {
  userId: string;
  email: string;
  name: string;
};

export type AuthenticatedRequest = Request & {
  user?: JwtPayload;
};