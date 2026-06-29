/**
 * PURPOSE:
 * Application server launcher entrypoint.
 * 
 * RESPONSIBILITIES:
 * 1. Configures dotenv to load environment variables from the .env file.
 * 2. Starts the Express server listener on the designated port.
 * 3. Handles clean process termination events.
 * 
 * INTERACTION:
 * - Direct execution entrypoint.
 * - Imports and mounts the configured Express application (app.ts).
 * 
 * DEPENDENCIES:
 * - dotenv configuration modules.
 * - Express server app wrapper (app.ts).
 * 
 * FUTURE SCALABILITY:
 * - Connect MongoDB database cluster before binding server listener.
 */

import dotenv from "dotenv";
import app from "./app";
import { connectDatabase } from "./database/mongodb";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5001;

async function startServer() {
  try {
    // 1. Establish MongoDB connection before listening
    await connectDatabase();

    // 2. Bind port
    const server = app.listen(PORT, () => {
      console.log(`=================================================`);
      console.log(`  Altuni Invest SaaS Backend Running on Port: ${PORT}`);
      console.log(`  Health Check URL: http://localhost:${PORT}/health`);
      console.log(`  Analysis Endpoint: http://localhost:${PORT}/api/analyze`);
      console.log(`=================================================`);
    });

    // Graceful shutdown handling
    process.on("SIGTERM", () => {
      console.log("[Server] Received SIGTERM, closing listener...");
      server.close(() => {
        console.log("[Server] Closed. Process exiting safely.");
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("[Server] Boot failed due to startup error:", error);
    process.exit(1);
  }
}

startServer();
