import type { Request, Response } from "express";
import type { JwtPayload } from "../auth/auth.types.js";
import { getMessagesByConversation } from "./messages.service.js";

type ConversationMessagesRequest = Request<{
  conversationId: string;
}> & {
  user?: JwtPayload;
};

export async function getConversationMessagesController(
  req: ConversationMessagesRequest,
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

    const { conversationId } = req.params;

    const messages = await getMessagesByConversation({
      conversationId,
      currentUserId: currentUser.userId,
      limit: 50,
    });

    res.json({
      message: "Get conversation messages successfully",
      data: {
        messages,
      },
    });
  } catch (error) {
    res.status(403).json({
      message:
        error instanceof Error
          ? error.message
          : "Get conversation messages failed",
    });
  }
}