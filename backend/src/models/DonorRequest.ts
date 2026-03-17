import { Schema, model, Document, Types } from "mongoose";

export interface IDonorRequest extends Document {
  requesterId: Types.ObjectId;
  donorId: Types.ObjectId;
  bloodType: string;
  message?: string;
  status: "pending" | "accepted" | "completed" | "cancelled";
  createdAt: Date;
}

const DonorRequestSchema = new Schema<IDonorRequest>(
  {
    requesterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    donorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    bloodType: { type: String, required: true },
    message: String,
    status: {
      type: String,
      enum: ["pending", "accepted", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export const DonorRequest = model<IDonorRequest>("DonorRequest", DonorRequestSchema);
