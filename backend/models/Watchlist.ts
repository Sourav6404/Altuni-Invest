/**
 * PURPOSE:
 * Mongoose schema and interfaces for watchlist items.
 * 
 * RESPONSIBILITIES:
 * 1. Defines structural validation for ticker name, price, change, risk and alerts.
 * 
 * DEPENDENCIES:
 * - Mongoose Schema and Document parameters.
 */

import mongoose, { Schema, Document } from "mongoose";

export interface IWatchlist extends Document {
  ticker: string;
  companyName: string;
  price: number;
  changePct: number;
  recommendation: string;
  riskLevel: string;
  alertOn: boolean;
  createdAt: Date;
}

const WatchlistSchema: Schema = new Schema({
  ticker: { type: String, required: true, unique: true, uppercase: true, trim: true },
  companyName: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  changePct: { type: Number, required: true, default: 0 },
  recommendation: { type: String, required: true, default: "HOLD" },
  riskLevel: { type: String, required: true, default: "Medium" },
  alertOn: { type: Boolean, required: true, default: false },
  createdAt: { type: Date, required: true, default: Date.now }
});

export const WatchlistModel = mongoose.model<IWatchlist>("Watchlist", WatchlistSchema);
