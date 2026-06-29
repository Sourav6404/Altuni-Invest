/**
 * PURPOSE:
 * Mongoose schema and interfaces for portfolio holdings.
 * 
 * RESPONSIBILITIES:
 * 1. Defines structural properties of assets owned by the investor context.
 */

import mongoose, { Schema, Document } from "mongoose";

export interface IPortfolio extends Document {
  ticker: string;
  companyName: string;
  shares: number;
  buyPrice: number;
  currentPrice: number;
  purchaseDate: Date;
}

const PortfolioSchema: Schema = new Schema({
  ticker: { type: String, required: true, uppercase: true, trim: true },
  companyName: { type: String, required: true },
  shares: { type: Number, required: true, min: 0 },
  buyPrice: { type: Number, required: true, min: 0 },
  currentPrice: { type: Number, required: true, default: 0 },
  purchaseDate: { type: Date, required: true, default: Date.now }
});

export const PortfolioModel = mongoose.model<IPortfolio>("Portfolio", PortfolioSchema);
