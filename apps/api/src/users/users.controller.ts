import type { Response } from "express";
import type { AuthenticatedRequest } from "../auth/auth.types.js";
import { getAllUsersExceptCurrentUser } from "./users.service.js";

export async function getUsersController(
  req: AuthenticatedRequest,
  res: Response
) {
  const currentUser = req.user;

  if (!currentUser) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }

  const users = await getAllUsersExceptCurrentUser(currentUser.userId);

  res.json({
    message: "Get users successfully",
    data: {
      users,
    },
  });
}