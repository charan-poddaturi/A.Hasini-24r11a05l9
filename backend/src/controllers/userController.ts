import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import { User } from "../models/User";

export const getProfile = async (req: AuthRequest, res: Response) => {
  const userId = req.user?._id;
  const user = await User.findById(userId).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  const userId = req.user?._id;
  const updates = req.body;
  delete updates.role; // prevent role change
  delete updates.password;
  const user = await User.findByIdAndUpdate(userId, updates, { new: true }).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

export const addEmergencyContact = async (req: AuthRequest, res: Response) => {
  const userId = req.user?._id;
  const { name, relation, phone } = req.body;
  if (!name || !relation || !phone) {
    return res.status(400).json({ message: "Name, relation, and phone are required" });
  }

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.emergencyContacts.push({ name, relation, phone, isVerified: false });
  await user.save();
  res.status(201).json(user.emergencyContacts);
};

export const updateEmergencyContact = async (req: AuthRequest, res: Response) => {
  const userId = req.user?._id;
  const contactId = req.params.id;
  const updates = req.body;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  // Mongoose DocumentArray type doesn't have rich typings here, so cast
  const contact = (user.emergencyContacts as any).id(contactId);
  if (!contact) return res.status(404).json({ message: "Contact not found" });

  contact.set({
    name: updates.name ?? contact.name,
    relation: updates.relation ?? contact.relation,
    phone: updates.phone ?? contact.phone,
  });
  await user.save();
  res.json(contact);
};

export const deleteEmergencyContact = async (req: AuthRequest, res: Response) => {
  const userId = req.user?._id;
  const contactId = req.params.id;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  (user.emergencyContacts as any).id(contactId)?.remove();
  await user.save();
  res.status(204).send();
};
