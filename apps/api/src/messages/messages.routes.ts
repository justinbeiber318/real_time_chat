import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { getConversationMessagesController } from "./messages.controller.js";

export const messagesRouter = Router();

messagesRouter.get(
  "/conversation/:conversationId",
  requireAuth,
  getConversationMessagesController
);