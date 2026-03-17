import { Schema, model, Document } from "mongoose";

export interface IPublicEmergencyNumber extends Document {
  country: string;
  police: string;
  ambulance: string;
  fire: string;
}

const PublicEmergencyNumberSchema = new Schema<IPublicEmergencyNumber>({
  country: { type: String, required: true, unique: true },
  police: { type: String, required: true },
  ambulance: { type: String, required: true },
  fire: { type: String, required: true },
});

export const PublicEmergencyNumber = model<IPublicEmergencyNumber>(
  "PublicEmergencyNumber",
  PublicEmergencyNumberSchema
);
