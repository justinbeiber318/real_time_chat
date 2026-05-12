import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import {
  createDirectConversationController,
  getMyConversationsController,
} from "./conversations.controller.js";

export const conversationsRouter = Router();

conversationsRouter.get("/", requireAuth, getMyConversationsController);
conversationsRouter.post(
  "/direct",
  requireAuth,
  createDirectConversationController
);