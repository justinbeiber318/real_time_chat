import type { Response } from "express";
import { z } from "zod";
import type { AuthenticatedRequest } from "../auth/auth.types.js";
import {
  createOrGetDirectConversation,
  getMyConversations,
} from "./conversations.service.js";

const createDirectConversationSchema = z.object({
  targetUserId: z.string().min(1, "targetUserId is required"),
});

export async function getMyConversationsController(
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

  const conversations = await getMyConversations(currentUser.userId);

  res.json({
    message: "Get conversations successfully",
    data: {
      conversations,
    },
  });
}

export async function createDirectConversationController(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const currentUser = req.user;

    if (!currentUser) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    const body = createDirectConversationSchema.parse(req.body);

    const conversation = await createOrGetDirectConversation({
      currentUserId: currentUser.userId,
      targetUserId: body.targetUserId,
    });

    res.status(201).json({
      message: "Create direct conversation successfully",
      data: {
        conversation,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Validation error",
        errors: error.flatten().fieldErrors,
      });
      return;
    }

    res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Create direct conversation failed",
    });
  }
}