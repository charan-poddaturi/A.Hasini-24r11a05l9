import { Request, Response, NextFunction } from "express";
import { PublicEmergencyNumber } from "../models/PublicEmergencyNumber";

export const getPublicNumbers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const country = (req.params.country || "").toString().toLowerCase();
    const record = await PublicEmergencyNumber.findOne({ country });
    if (!record) {
      return res.status(404).json({ message: "Public emergency numbers not found for country" });
    }
    res.json(record);
  } catch (err) {
    next(err);
  }
};

export const listPublicNumbers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const records = await PublicEmergencyNumber.find().limit(50);
    res.json(records);
  } catch (err) {
    next(err);
  }
};
