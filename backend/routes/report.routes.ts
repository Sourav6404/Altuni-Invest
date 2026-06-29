/**
 * PURPOSE:
 * Registers REST routes for listing, reading, deleting, and comparing reports.
 * 
 * RESPONSIBILITIES:
 * 1. Establishes Express routing mounts.
 * 2. Connects route endpoints to the appropriate ReportController methods.
 * 
 * INTERACTION:
 * - Mounted in app.ts under the main '/api' prefix path.
 * - Routes traffic to ReportController logic functions.
 * 
 * DEPENDENCIES:
 * - Express Router.
 * - ReportController.
 * 
 * FUTURE SCALABILITY:
 * - Attach auth validations (JWT) to secure user report ownership checks.
 */

import { Router } from "express";
import { ReportController } from "../controllers/report.controller";

const router = Router();
const controller = new ReportController();

// Define CRUD routes for report history
router.get("/history", controller.getHistory.bind(controller));
router.get("/report/:id", controller.getReportById.bind(controller));
router.delete("/report/:id", controller.deleteReport.bind(controller));
router.post("/compare", controller.compareTickers.bind(controller));

// Additional dashboard, search, and PDF exports routes
router.get("/search", controller.autocompleteSearch.bind(controller));
router.get("/dashboard", controller.getDashboardStats.bind(controller));
router.get("/report/:id/pdf", controller.exportReportPDF.bind(controller));

export default router;
