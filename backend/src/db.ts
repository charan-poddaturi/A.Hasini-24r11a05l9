import mongoose from "mongoose";
import { config } from "./config";

export async function connectDb() {
  try {
    await mongoose.connect(config.mongoUri, {
      autoIndex: true,
    });
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}

export async function disconnectDb() {
  await mongoose.disconnect();
}
