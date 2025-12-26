import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../lib/utils.js";
import User from "../models/User.js";

// Middleware
export const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing",
      });
    }

    const decoded = verifyToken(authHeader);

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: err instanceof Error ? err.message : "Unauthorized Accessr",
    });
  }
};
