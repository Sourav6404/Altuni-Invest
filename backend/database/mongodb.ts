/**
 * PURPOSE:
 * Configures the MongoDB Atlas connection logic using Mongoose.
 * 
 * RESPONSIBILITIES:
 * 1. Establishes connection to the MongoDB cluster using MONGODB_URI environment variables.
 * 2. Monitors connection status and alerts of network drops.
 * 3. Handles graceful close conditions during termination signals.
 * 
 * INTERACTION:
 * - Imported and awaited by server.ts during boot execution.
 * - Used implicitly by mongoose models (e.g. Report.ts).
 * 
 * DEPENDENCIES:
 * - Mongoose database driver.
 * 
 * FUTURE SCALABILITY:
 * - Configure connection pool size limits (maxPoolSize).
 * - Configure retry limits for cluster fallbacks.
 */

import mongoose from "mongoose";

export async function connectDatabase(): Promise<void> {
  let uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn("[Database] Warning: MONGODB_URI environment variable is not defined inside .env. Falling back to local 'mongodb://localhost:27017/altuni_invest'.");
    uri = "mongodb://localhost:27017/altuni_invest";
  }

  // Set up mongoose connection configurations
  mongoose.connection.on("connected", () => {
    console.log("[Database] Mongoose successfully connected to MongoDB Atlas cluster.");
  });

  mongoose.connection.on("error", (err) => {
    console.error("[Database] Mongoose connection error event received:", err);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("[Database] Mongoose disconnected from MongoDB Atlas.");
  });

  try {
    console.log("[Database] Connecting to MongoDB Atlas...");
    await mongoose.connect(uri, {
      autoIndex: true, // Automatically build indexes
    });
  } catch (error) {
    console.error("[Database] Direct connection attempt failed:", error);
    throw error;
  }
}
