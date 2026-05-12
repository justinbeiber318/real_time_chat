import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { getUsersController } from "./users.controller.js";

export const usersRouter = Router();

usersRouter.get("/", requireAuth, getUsersController);