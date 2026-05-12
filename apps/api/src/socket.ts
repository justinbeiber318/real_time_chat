import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import type { Server as HttpServer } from "node:http";
import type { JwtPayload } from "./auth/auth.types.js";
import { getUserById } from "./auth/auth.service.js";
import { isUserInConversation } from "./conversations/conversations.service.js";
import { createMessage } from "./messages/messages.service.js";

type JoinConversationPayload = {
  conversationId: string;
};

type SendMessagePayload = {
  conversationId: string;
  content: string;
};

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
];

function getConversationRoom(conversationId: string) {
  return `conversation:${conversationId}`;
}

function getJwtSecret() {
  const secret = process.env.JWT_ACCESS_SECRET;

  if (!secret) {
    throw new Error("JWT_ACCESS_SECRET is missing");
  }

  return secret;
}

export function createSocketServer(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error(`Socket CORS blocked origin: ${origin}`));
      },
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token || typeof token !== "string") {
      next(new Error("Missing access token"));
      return;
    }

    try {
      const payload = jwt.verify(token, getJwtSecret()) as JwtPayload;

      const user = await getUserById(payload.userId);

      if (!user) {
        next(new Error("User not found. Please login again."));
        return;
      }

      socket.data.user = {
        userId: user.id,
        email: user.email,
        name: user.name,
      };

      next();
    } catch {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    const currentUser = socket.data.user as JwtPayload;

    console.log("Socket connected:", {
      socketId: socket.id,
      userId: currentUser.userId,
      email: currentUser.email,
    });

    socket.emit("server:welcome", {
      message: "Connected to realtime chat server",
      socketId: socket.id,
      user: currentUser,
    });

    socket.on(
      "conversation:join",
      async (payload: JoinConversationPayload) => {
        const conversationId = payload.conversationId;

        const isMember = await isUserInConversation({
          conversationId,
          userId: currentUser.userId,
        });

        if (!isMember) {
          socket.emit("server:error", {
            message: "You are not a member of this conversation",
          });
          return;
        }

        socket.join(getConversationRoom(conversationId));

        socket.emit("conversation:joined", {
          conversationId,
        });
      }
    );

    socket.on(
      "conversation:leave",
      async (payload: JoinConversationPayload) => {
        const conversationId = payload.conversationId;

        socket.leave(getConversationRoom(conversationId));

        socket.emit("conversation:left", {
          conversationId,
        });
      }
    );

    socket.on("message:send", async (payload: SendMessagePayload) => {
      const conversationId = payload.conversationId;
      const content = payload.content.trim();

      if (!conversationId) {
        socket.emit("server:error", {
          message: "conversationId is required",
        });
        return;
      }

      if (!content) {
        socket.emit("server:error", {
          message: "Message content is required",
        });
        return;
      }

      try {
        const message = await createMessage({
          conversationId,
          senderId: currentUser.userId,
          content,
        });

        io.to(getConversationRoom(conversationId)).emit(
          "message:new",
          message
        );
      } catch (error) {
        socket.emit("server:error", {
          message:
            error instanceof Error ? error.message : "Failed to send message",
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", {
        socketId: socket.id,
        userId: currentUser.userId,
      });
    });
  });

  return io;
}