/**
 * PURPOSE:
 * Express controller for managing user watchlist entries.
 * 
 * RESPONSIBILITIES:
 * 1. Fetches all watchlist items from MongoDB.
 * 2. Adds new items (retrieving stats from latest report if available, else seeding).
 * 3. Removes items by ticker or ID.
 */

import { Request, Response } from "express";
import { WatchlistModel } from "../models/Watchlist";
import { ReportModel } from "../models/Report";

export class WatchlistController {
  // 1. GET /api/watchlist
  public async getWatchlist(req: Request, res: Response): Promise<void> {
    try {
      const items = await WatchlistModel.find().sort({ createdAt: -1 });
      res.status(200).json({
        success: true,
        data: items
      });
    } catch (error: any) {
      console.error("[WatchlistController] Fetch error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to retrieve watchlist."
      });
    }
  }

  // 2. POST /api/watchlist
  public async addWatchlistItem(req: Request, res: Response): Promise<void> {
    try {
      const { ticker, companyName, alertOn } = req.body;

      if (!ticker || typeof ticker !== "string") {
        res.status(400).json({
          success: false,
          error: "Request body parameter 'ticker' must be a valid string."
        });
        return;
      }

      const upperTicker = ticker.toUpperCase().trim();

      // Check if already exists
      const existing = await WatchlistModel.findOne({ ticker: upperTicker });
      if (existing) {
        if (alertOn !== undefined) {
          existing.alertOn = Boolean(alertOn);
          await existing.save();
        }
        res.status(200).json({
          success: true,
          data: existing
        });
        return;
      }

      // Try to find stats from latest report in MongoDB
      const latestReport = await ReportModel.findOne({ ticker: upperTicker }).sort({ createdAt: -1 });
      
      let price = 100;
      let changePct = 1.5;
      let recommendation = "HOLD";
      let riskLevel = "Medium";
      let resolvedName = companyName || latestReport?.companyResearch?.companyName || latestReport?.companyName || upperTicker;

      if (latestReport) {
        price = latestReport.valuation?.currentPrice || latestReport.financialStatements?.marketCap ? (latestReport.valuation.intrinsicValue || 120) : 100;
        // mock change
        changePct = Number((Math.random() * 8 - 4).toFixed(2));
        recommendation = latestReport.recommendation?.recommendation || "HOLD";
        riskLevel = latestReport.risk?.riskLevel || "Medium";
      }

      const newItem = new WatchlistModel({
        ticker: upperTicker,
        companyName: resolvedName,
        price,
        changePct,
        recommendation,
        riskLevel,
        alertOn: Boolean(alertOn)
      });

      const saved = await newItem.save();
      console.log(`[WatchlistController] Added item to database: ${upperTicker}`);
      
      res.status(201).json({
        success: true,
        data: saved
      });
    } catch (error: any) {
      console.error("[WatchlistController] Create error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to add watchlist item."
      });
    }
  }

  // 3. DELETE /api/watchlist/:ticker
  public async deleteWatchlistItem(req: Request, res: Response): Promise<void> {
    try {
      const { ticker } = req.params;

      if (!ticker || typeof ticker !== "string") {
        res.status(400).json({
          success: false,
          error: "URL param 'ticker' must be a valid string."
        });
        return;
      }

      const upperTicker = ticker.toUpperCase().trim();

      // Attempt to delete either by Mongo ObjectId OR by uppercase Ticker symbol
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(upperTicker);
      const result = isObjectId 
        ? await WatchlistModel.findByIdAndDelete(upperTicker)
        : await WatchlistModel.findOneAndDelete({ ticker: upperTicker });

      if (!result) {
        res.status(404).json({
          success: false,
          error: `Watchlist item not found for candidate: ${ticker}`
        });
        return;
      }

      console.log(`[WatchlistController] Deleted item: ${upperTicker}`);
      res.status(200).json({
        success: true,
        message: "Watchlist item removed successfully."
      });
    } catch (error: any) {
      console.error("[WatchlistController] Delete error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to delete watchlist item."
      });
    }
  }
}
