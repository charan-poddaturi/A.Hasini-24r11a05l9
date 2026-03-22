import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { User } from "../models/User";

export interface AuthRequest extends Request {
  user?: { _id: string; role: "user" | "admin" };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as {
      id: string;
      role: "user" | "admin";
    };
    const user = await User.findById(decoded.id).select("-_id role");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = { _id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export const authorize = (roles: Array<"admin" | "user">) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};
