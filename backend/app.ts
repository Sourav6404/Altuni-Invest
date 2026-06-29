/**
 * PURPOSE:
 * Initializes and configures the Express application wrapper.
 * 
 * RESPONSIBILITIES:
 * 1. Attaches standard security and parsing middlewares (CORS, body parser).
 * 2. Mounts app route routers under '/api' prefix path namespace.
 * 3. Mounts basic API status/health endpoints.
 * 
 * INTERACTION:
 * - Imported and listened to by server.ts.
 * - Routes requests to analysis.routes.ts module.
 * 
 * DEPENDENCIES:
 * - Express framework modules.
 * - Cors middleware.
 * - Router imports.
 * 
 * FUTURE SCALABILITY:
 * - Mount additional routes (e.g. users, watchlist, portfolio, history).
 * - Attach global centralized error-handler middleware block.
 */

import express from "express";
import cors from "cors";
import analysisRoutes from "./routes/analysis.routes";
import reportRoutes from "./routes/report.routes";
import watchlistRoutes from "./routes/watchlist.routes";
import portfolioRoutes from "./routes/portfolio.routes";
import authRoutes from "./routes/auth.routes";

const app = express();

// Apply standard global middlewares
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Status checks
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy", timestamp: new Date() });
});

import path from "path";

// Mount routes namespaces
app.use("/api", analysisRoutes);
app.use("/api", reportRoutes);
app.use("/api", watchlistRoutes);
app.use("/api", portfolioRoutes);
app.use("/api/auth", authRoutes);

// Host React frontend build bundles statically in production mode
if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "../frontend2/dist");
  console.log(`[Express] Production mode: Serving static files from ${distPath}`);
  app.use(express.static(distPath));
  
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

export default app;
