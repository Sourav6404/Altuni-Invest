/**
 * PURPOSE:
 * Express controller for orchestrating AI Agent analysis requests.
 * 
 * RESPONSIBILITIES:
 * 1. Validates HTTP POST request body inputs (checking for 'companyName').
 * 2. Delegates business logic execution to AnalysisService.
 * 3. Formats and sends standard JSON API responses (success / error).
 * 
 * INTERACTION:
 * - Triggered by router paths in analysis.routes.ts.
 * - Leverages AnalysisService to execute tasks.
 * 
 * DEPENDENCIES:
 * - Express request and response interfaces.
 * - AnalysisService.
 * 
 * FUTURE SCALABILITY:
 * - Integrate request validation middleware (e.g. Zod validation).
 * - Add API rate limiting or authentication header checks before invocation.
 */

import { Request, Response } from "express";
import { AnalysisService } from "../services/analysis.service";
import { ReportModel } from "../models/Report";
import { CacheService } from "../services/cache.service";

const analysisService = new AnalysisService();
const cacheService = new CacheService();

export class AnalysisController {
  public async analyzeCompany(req: Request, res: Response): Promise<void> {
    try {
      const { companyName } = req.body;

      if (!companyName || typeof companyName !== "string" || companyName.trim() === "") {
        res.status(400).json({
          success: false,
          error: "Request body parameter 'companyName' must be a non-empty string.",
        });
        return;
      }

      console.log(`[AnalysisController] Request received for: ${companyName}`);

      // Check cache validity prior to orchestrating AI runs
      const cachedReport = await cacheService.checkCache(companyName.trim());
      if (cachedReport) {
        console.log(`[AnalysisController] Cache Hit! Returning database record: ${companyName}`);
        
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();

        res.write(`data: ${JSON.stringify({ type: "complete", data: cachedReport })}\n\n`);
        res.end();
        return;
      }

      console.log(`[AnalysisController] Cache Miss. Initializing sequential AI pipeline...`);

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders();

      res.write(`data: ${JSON.stringify({ type: "progress", step: 0, message: "Initializing AI multi-agent research pipeline..." })}\n\n`);

      const report = await analysisService.runAnalysis(companyName.trim(), (step, message) => {
        res.write(`data: ${JSON.stringify({ type: "progress", step, message })}\n\n`);
      });

      // Save generated report to database history
      console.log(`[AnalysisController] Persisting research report for ${report.ticker} to MongoDB...`);
      const newDoc = new ReportModel(report);
      const savedReport = await newDoc.save();

      res.write(`data: ${JSON.stringify({ type: "complete", data: savedReport })}\n\n`);
      res.end();
    } catch (error: any) {
      console.error("[AnalysisController] Pipeline execution error:", error);
      if (res.headersSent) {
        res.write(`data: ${JSON.stringify({ type: "error", error: error.message || "An unexpected error occurred during multi-agent analysis." })}\n\n`);
        res.end();
      } else {
        res.status(500).json({
          success: false,
          error: error.message || "An unexpected error occurred during multi-agent analysis.",
        });
      }
    }
  }
}
