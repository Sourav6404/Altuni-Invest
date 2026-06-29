/**
 * PURPOSE:
 * Express controller for managing portfolio holdings.
 * 
 * RESPONSIBILITIES:
 * 1. Lists current holdings.
 * 2. Appends new shares bought by the context.
 * 3. Removes holdings.
 */

import { Request, Response } from "express";
import { PortfolioModel } from "../models/Portfolio";
import { ReportModel } from "../models/Report";

export class PortfolioController {
  // 1. GET /api/portfolio
  public async getPortfolio(req: Request, res: Response): Promise<void> {
    try {
      const holdings = await PortfolioModel.find().sort({ purchaseDate: -1 });
      res.status(200).json({
        success: true,
        data: holdings
      });
    } catch (error: any) {
      console.error("[PortfolioController] Fetch error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to retrieve holdings."
      });
    }
  }

  // 2. POST /api/portfolio
  public async addHolding(req: Request, res: Response): Promise<void> {
    try {
      const { ticker, companyName, shares, buyPrice } = req.body;

      if (!ticker || !shares || !buyPrice) {
        res.status(400).json({
          success: false,
          error: "Request body parameters 'ticker', 'shares', and 'buyPrice' are required."
        });
        return;
      }

      const upperTicker = ticker.toUpperCase().trim();
      
      // Resolve currentPrice from report if available
      const latestReport = await ReportModel.findOne({ ticker: upperTicker }).sort({ createdAt: -1 });
      const currentPrice = latestReport?.valuation?.currentPrice || Number(buyPrice);
      const resolvedName = companyName || latestReport?.companyResearch?.companyName || latestReport?.companyName || upperTicker;

      const newHolding = new PortfolioModel({
        ticker: upperTicker,
        companyName: resolvedName,
        shares: Number(shares),
        buyPrice: Number(buyPrice),
        currentPrice
      });

      const saved = await newHolding.save();
      console.log(`[PortfolioController] Added holding to database: ${upperTicker}`);
      
      res.status(201).json({
        success: true,
        data: saved
      });
    } catch (error: any) {
      console.error("[PortfolioController] Create error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to add holding."
      });
    }
  }

  // 3. DELETE /api/portfolio/:id
  public async deleteHolding(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || typeof id !== "string") {
        res.status(400).json({
          success: false,
          error: "URL param 'id' must be a valid string."
        });
        return;
      }

      const result = await PortfolioModel.findByIdAndDelete(id);

      if (!result) {
        res.status(404).json({
          success: false,
          error: `Portfolio holding not found with ID: ${id}`
        });
        return;
      }

      console.log(`[PortfolioController] Deleted holding: ${id}`);
      res.status(200).json({
        success: true,
        message: "Holding removed successfully."
      });
    } catch (error: any) {
      console.error("[PortfolioController] Delete error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to delete holding."
      });
    }
  }
}
