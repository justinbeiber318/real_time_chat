import express from "express";
import cors from "cors";
import { authRouter } from "./auth/auth.routes.js";
import { messagesRouter } from "./messages/messages.routes.js";
import { usersRouter } from "./users/users.routes.js";
import { conversationsRouter } from "./conversations/conversations.routes.js";

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
];

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error(`CORS blocked origin: ${origin}`));
      },
      credentials: true,
    })
  );

  app.use(express.json());

  app.get("/", (_req, res) => {
    res.json({
      message: "Realtime Chat API is running",
      health: "/health",
    });
  });

  app.get("/health", (_req, res) => {
    res.json({
      status: "ok",
      service: "realtime-chat-api",
    });
  });

  app.use("/auth", authRouter);
  app.use("/messages", messagesRouter);
  app.use("/users", usersRouter);
  app.use("/conversations", conversationsRouter);
  return app;
}