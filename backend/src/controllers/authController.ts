import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { config } from "../config";

const signToken = (userId: string, role: string) =>
  jwt.sign(
    { id: userId, role },
    config.jwtSecret as jwt.Secret,
    {
      expiresIn: config.jwtExpiresIn as jwt.SignOptions["expiresIn"],
    }
  );

export const register = async (req: Request, res: Response) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email and password are required" });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: "Email already registered" });
  }

  const user = await User.create({ name, email, password, phone });
  const token = signToken(user._id.toString(), user.role);
  res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isValid = await user.comparePassword(password);
  if (!isValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = signToken(user._id.toString(), user.role);
  res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
};

export const me = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id || (req as any).user?._id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const user = await User.findById(userId).select("-password");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
};
