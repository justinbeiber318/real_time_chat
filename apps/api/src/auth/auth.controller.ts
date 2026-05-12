import type { Request, Response } from "express";
import { z } from "zod";
import type { AuthenticatedRequest } from "./auth.types.js";
import { getUserById, loginUser, registerUser } from "./auth.service.js";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export async function registerController(req: Request, res: Response) {
  try {
    const body = registerSchema.parse(req.body);

    const result = await registerUser(body);

    res.status(201).json({
      message: "Register successfully",
      data: result,
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
      message: error instanceof Error ? error.message : "Register failed",
    });
  }
}

export async function loginController(req: Request, res: Response) {
  try {
    const body = loginSchema.parse(req.body);

    const result = await loginUser(body);

    res.json({
      message: "Login successfully",
      data: result,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Validation error",
        errors: error.flatten().fieldErrors,
      });
      return;
    }

    res.status(401).json({
      message: error instanceof Error ? error.message : "Login failed",
    });
  }
}

export async function meController(req: AuthenticatedRequest, res: Response) {
  const currentUser = req.user;

  if (!currentUser) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }

  const user = await getUserById(currentUser.userId);

  if (!user) {
    res.status(404).json({
      message: "User not found",
    });
    return;
  }

  res.json({
    message: "Get current user successfully",
    data: {
      user,
    },
  });
}