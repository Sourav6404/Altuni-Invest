/**
 * PURPOSE:
 * Defines REST endpoints mapping for AI Agent Analysis.
 * 
 * RESPONSIBILITIES:
 * 1. Instantiates Express router.
 * 2. Mounts the POST /analyze endpoint and binds it to AnalysisController.
 * 
 * INTERACTION:
 * - Mounted inside main app.ts routes registry list.
 * - Delegates requests matching routes to AnalysisController.
 * 
 * DEPENDENCIES:
 * - Express Router.
 * - AnalysisController.
 * 
 * FUTURE SCALABILITY:
 * - Mount authentication / rate limiter middlewares on POST /analyze.
 */

import { Router } from "express";
import { AnalysisController } from "../controllers/analysis.controller";

const router = Router();
const controller = new AnalysisController();

// Binds POST /api/analyze to the controller method
router.post("/analyze", controller.analyzeCompany.bind(controller));

export default router;
