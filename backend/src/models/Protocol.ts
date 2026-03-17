import { Schema, model, Document } from "mongoose";

export interface IProtocol extends Document {
  key: string;
  title: string;
  steps: Array<{ title: string; description: string; icon?: string }>;
  tags: string[];
  languages: Record<string, { title: string; steps: Array<{ title: string; description: string }> }>;
}

const ProtocolSchema = new Schema<IProtocol>(
  {
    key: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    steps: [
      {
        title: String,
        description: String,
        icon: String,
      },
    ],
    tags: [String],
    languages: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const Protocol = model<IProtocol>("Protocol", ProtocolSchema);
