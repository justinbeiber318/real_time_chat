import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import {
  createMessageController,
  getConversationMessagesController,
} from "./messages.controller.js";

export const messagesRouter = Router();

messagesRouter.get(
  "/conversation/:conversationId",
  requireAuth,
  getConversationMessagesController
);

messagesRouter.post(
  "/conversation/:conversationId",
  requireAuth,
  createMessageController
);