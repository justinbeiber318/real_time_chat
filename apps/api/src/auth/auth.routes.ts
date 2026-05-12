import { Router } from "express";
import {
  loginController,
  meController,
  registerController,
} from "./auth.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

export const authRouter = Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
authRouter.get("/me", requireAuth, meController);