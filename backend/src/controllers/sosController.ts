import { Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/auth";
import { SOSAlert } from "../models/SOSAlert";
import { User } from "../models/User";
import { sendSms } from "../services/notificationService";

type SocketServerLike = {
  to: (room: string) => { emit: (event: string, payload: unknown) => void };
};

export const triggerSOS = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    const { lat, lng } = req.body;
    if (!lat || !lng) {
      return res.status(400).json({ message: "Location is required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const contactIds = user.emergencyContacts
      .map((c) => c._id?.toString())
      .filter((id): id is string => Boolean(id));

    const alert = await SOSAlert.create({
      userId,
      location: { lat, lng },
      notifiedContacts: contactIds,
    });

    // Send in-app socket notification to contacts that are connected
    const io = (req.app.locals as { io?: SocketServerLike }).io;
    if (io) {
      user.emergencyContacts
        .filter((c) => c.isVerified)
        .forEach((contact) => {
          io.to(contact.phone).emit("sos:triggered", {
            alertId: alert._id,
            user: { id: user._id, name: user.name, phone: user.phone },
            location: { lat, lng },
            timestamp: alert.timestamp,
          });
        });
    }

    // Try to send SMS to all contacts
    const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    const message = `SOS! ${user.name} is in an emergency. Location: ${googleMapsLink}`;
    for (const contact of user.emergencyContacts) {
      await sendSms(contact.phone, message);
    }

    console.log("SOS triggered", { userId, location: { lat, lng } });
    res.status(201).json({ alert });
  } catch (err) {
    next(err);
  }
};

export const getHistory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    const history = await SOSAlert.find({ userId }).sort({ createdAt: -1 }).limit(50);
    res.json(history);
  } catch (err) {
    next(err);
  }
};

export const getAllAlerts = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const alerts = await SOSAlert.find().sort({ createdAt: -1 }).limit(200);
    res.json(alerts);
  } catch (err) {
    next(err);
  }
};
