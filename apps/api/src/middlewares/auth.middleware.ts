import jwt from "jsonwebtoken";
import type { NextFunction, Response } from "express";
import type {
  AuthenticatedRequest,
  JwtPayload,
} from "../auth/auth.types.js";

function getJwtSecret() {
  const secret = process.env.JWT_ACCESS_SECRET;

  if (!secret) {
    throw new Error("JWT_ACCESS_SECRET is missing");
  }

  return secret;
}

export function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      message: "Missing access token",
    });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, getJwtSecret()) as JwtPayload;

    req.user = payload;

    next();
  } catch {
    res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}