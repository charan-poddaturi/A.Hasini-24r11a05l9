import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import { DonorRequest } from "../models/DonorRequest";
import { AuthRequest } from "../middlewares/auth";

type SocketServerLike = {
  to: (room: string) => { emit: (event: string, payload: unknown) => void };
};

export const searchDonors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bloodType, city, state, country } = req.query;
    const filter: Record<string, unknown> = {
      isDonor: true,
      "donorDetails.isAvailable": true,
    };

    if (bloodType) filter.bloodType = bloodType;
    if (city) filter["address.city"] = city;
    if (state) filter["address.state"] = state;
    if (country) filter["address.country"] = country;

    const donors = await User.find(filter).select("name bloodType address phone donorDetails");
    res.json(donors);
  } catch (err) {
    next(err);
  }
};

export const registerDonor = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    const { bloodType, isAvailable, address } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isDonor = true;
    user.bloodType = bloodType || user.bloodType;
    user.donorDetails.isAvailable = isAvailable ?? true;
    if (address) user.address = { ...user.address, ...address };

    await user.save();
    res.json({ message: "Registered as donor", donorDetails: user.donorDetails });
  } catch (err) {
    next(err);
  }
};

export const updateDonorAvailability = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    const { isAvailable } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.donorDetails.isAvailable = Boolean(isAvailable);
    await user.save();
    res.json({ donorDetails: user.donorDetails });
  } catch (err) {
    next(err);
  }
};

export const requestDonor = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const requesterId = req.user?._id;
    const { donorId, bloodType, message } = req.body;
    if (!donorId || !bloodType) {
      return res.status(400).json({ message: "donorId and bloodType are required" });
    }

    const donor = await User.findById(donorId);
    if (!donor) return res.status(404).json({ message: "Donor not found" });

    const request = await DonorRequest.create({
      requesterId,
      donorId,
      bloodType,
      message,
    });

    const io = (req.app.locals as { io?: SocketServerLike }).io;
    if (io) {
      io.to(donorId.toString()).emit("donor:request", {
        requesterId,
        donorId,
        bloodType,
        message,
      });
    }

    res.status(201).json(request);
  } catch (err) {
    next(err);
  }
};

export const verifyDonor = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const donorId = req.params.id;
    const donor = await User.findById(donorId);
    if (!donor) return res.status(404).json({ message: "Donor not found" });

    donor.donorDetails.verifiedByAdmin = true;
    await donor.save();

    res.json({ message: "Donor verified" });
  } catch (err) {
    next(err);
  }
};
