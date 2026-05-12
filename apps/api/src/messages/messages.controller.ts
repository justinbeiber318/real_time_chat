import type { Request, Response } from "express";
import { z } from "zod";
import type { JwtPayload } from "../auth/auth.types.js";
import { createMessage, getMessagesByConversation } from "./messages.service.js";

type ConversationMessagesRequest = Request<{
  conversationId: string;
}> & {
  user?: JwtPayload;
};

const createMessageSchema = z.object({
  content: z.string().min(1, "Message content is required"),
});

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

export async function createMessageController(
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
    const body = createMessageSchema.parse(req.body);

    const message = await createMessage({
      conversationId,
      senderId: currentUser.userId,
      content: body.content,
    });

    res.status(201).json({
      message: "Create message successfully",
      data: {
        message,
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
        error instanceof Error ? error.message : "Create message failed",
    });
  }
}