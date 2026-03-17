import { Request, Response } from "express";
import { fetchNearbyPlaces, PlaceType } from "../services/locationService";

const mapType = (category: string): PlaceType => {
  switch (category) {
    case "police":
      return "police";
    case "fire":
      return "fire_station";
    default:
      return "hospital";
  }
};

export const getNearby = async (req: Request, res: Response) => {
  const { lat, lng, radius } = req.query;
  const category = (req.params.category || "hospital").toString();

  if (!lat || !lng) {
    return res.status(400).json({ message: "lat and lng are required" });
  }

  const type = mapType(category);
  const results = await fetchNearbyPlaces(Number(lat), Number(lng), type, Number(radius) || 5000);
  res.json(results);
};
