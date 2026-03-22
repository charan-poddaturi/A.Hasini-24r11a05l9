import mongoose from "mongoose";
import { config } from "./config";
import { log } from "./utils/logger";

let inMemoryMongo: import("mongodb-memory-server").MongoMemoryServer | null = null;

export async function connectDb() {
  try {
    await mongoose.connect(config.mongoUri, {
      autoIndex: true,
    });
    log.info("✅ Connected to MongoDB");
  } catch (error) {
    // Dev-friendly fallback: run an ephemeral MongoDB without local install.
    // This downloads a MongoDB binary on first run (no system-wide install).
    const shouldFallback =
      process.env.USE_IN_MEMORY_DB === "true" ||
      process.env.NODE_ENV !== "production";

    if (!shouldFallback) {
      log.error("❌ MongoDB connection error:", error);
      process.exit(1);
    }

    log.warn("⚠️ MongoDB unavailable. Starting in-memory MongoDB for development...");

    const { MongoMemoryServer } = await import("mongodb-memory-server");
    // Prefer a fixed port so other processes (like `npm run seed`) can connect
    // via the standard `MONGO_URI` without spinning up a separate in-memory DB.
    const preferredPort = Number(process.env.IN_MEMORY_DB_PORT || 27017);
    try {
      inMemoryMongo = await MongoMemoryServer.create({
        instance: { port: preferredPort, ip: "127.0.0.1", dbName: "safehub" },
      });
    } catch (e) {
      log.warn(
        `⚠️ Couldn't start in-memory MongoDB on port ${preferredPort}. Falling back to a random port.`
      );
      inMemoryMongo = await MongoMemoryServer.create({
        instance: { ip: "127.0.0.1", dbName: "safehub" },
      });
    }
    const uri = inMemoryMongo.getUri();

    await mongoose.connect(uri, { autoIndex: true });
    log.info("✅ Connected to in-memory MongoDB");
  }
}

export async function disconnectDb() {
  try {
    await mongoose.disconnect();
  } finally {
    if (inMemoryMongo) {
      await inMemoryMongo.stop();
      inMemoryMongo = null;
    }
  }
}
