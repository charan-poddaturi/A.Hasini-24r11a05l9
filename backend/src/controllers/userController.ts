import { Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/auth";
import { User } from "../models/User";

export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    const updates = req.body;
    delete updates.role; // prevent role change
    delete updates.password;
    const user = await User.findByIdAndUpdate(userId, updates, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const addEmergencyContact = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    const { name, relation, phone } = req.body;
    if (!name || !relation || !phone) {
      return res.status(400).json({ message: "Name, relation, and phone are required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.emergencyContacts.push({ name, relation, phone, isVerified: true });
    await user.save();
    res.status(201).json(user.emergencyContacts);
  } catch (err) {
    next(err);
  }
};

export const updateEmergencyContact = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    const contactId = req.params.id;
    const updates = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // findIndex is TypeScript-safe (avoids untyped Mongoose .id() helper)
    const contact = user.emergencyContacts.find(
      (c) => c._id?.toString() === contactId
    );
    if (!contact) return res.status(404).json({ message: "Contact not found" });

    if (updates.name !== undefined) contact.name = updates.name;
    if (updates.relation !== undefined) contact.relation = updates.relation;
    if (updates.phone !== undefined) contact.phone = updates.phone;

    await user.save();
    res.json(contact);
  } catch (err) {
    next(err);
  }
};

export const deleteEmergencyContact = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    const contactId = req.params.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // findIndex + splice is TypeScript-safe and works with Mongoose DocumentArrays
    const idx = user.emergencyContacts.findIndex(
      (c) => c._id?.toString() === contactId
    );
    if (idx !== -1) {
      user.emergencyContacts.splice(idx, 1);
    }
    await user.save();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
