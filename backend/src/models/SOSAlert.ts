import { Schema, model, Document, Types } from "mongoose";

export interface ISOSAlert extends Document {
  userId: Types.ObjectId;
  timestamp: Date;
  location: { lat: number; lng: number };
  status: "triggered" | "acknowledged" | "resolved";
  notifiedContacts: Types.ObjectId[];
}

const SOSAlertSchema = new Schema<ISOSAlert>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    timestamp: { type: Date, default: Date.now },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    status: {
      type: String,
      enum: ["triggered", "acknowledged", "resolved"],
      default: "triggered",
    },
    notifiedContacts: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export const SOSAlert = model<ISOSAlert>("SOSAlert", SOSAlertSchema);
