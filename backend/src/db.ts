import mongoose from "mongoose";
import { config } from "./config";
import { log } from "./utils/logger";

export async function connectDb() {
  try {
    await mongoose.connect(config.mongoUri, {
      autoIndex: true,
    });
    log.info("✅ Connected to MongoDB");
  } catch (error) {
    log.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}
