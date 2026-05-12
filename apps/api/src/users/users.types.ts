import type { RowDataPacket } from "mysql2";

export type UserRow = RowDataPacket & {
  id: string;
  name: string;
  email: string;
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