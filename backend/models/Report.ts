/**
 * PURPOSE:
 * Mongoose model schema definition for generated research reports.
 * 
 * RESPONSIBILITIES:
 * 1. Declares standard fields (companyName, ticker, createdAt).
 * 2. Stores the fully detailed, raw nested JSON outputs of all 10 agents under mixed Schema types.
 * 3. Builds database indices on 'ticker' and 'createdAt' for high performance lookups.
 * 
 * INTERACTION:
 * - Instantiated and stored by ReportService / AnalysisController when pipeline finishes.
 * - Queried by ReportController / HistoryController to list and fetch research profiles.
 * 
 * DEPENDENCIES:
 * - Mongoose Schema and Model definitions.
 * 
 * FUTURE SCALABILITY:
 * - Enable schema validations or versioning keys (__v).
 */

import { Schema, model, Document } from "mongoose";

export interface IReport extends Document {
  companyName: string;
  ticker: string;
  companyResearch: Record<string, any>;
  financialStatements: Record<string, any>;
  competitors: Record<string, any>;
  marketIndustry: Record<string, any>;
  news: Record<string, any>;
  macroeconomic: Record<string, any>;
  sentiment: Record<string, any>;
  valuation: Record<string, any>;
  risk: Record<string, any>;
  recommendation: Record<string, any>;
  createdAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    ticker: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true, // index for quick search
    },
    companyResearch: {
      type: Schema.Types.Mixed,
      required: true,
    },
    financialStatements: {
      type: Schema.Types.Mixed,
      required: true,
    },
    competitors: {
      type: Schema.Types.Mixed,
      required: true,
    },
    marketIndustry: {
      type: Schema.Types.Mixed,
      required: true,
    },
    news: {
      type: Schema.Types.Mixed,
      required: true,
    },
    macroeconomic: {
      type: Schema.Types.Mixed,
      required: true,
    },
    sentiment: {
      type: Schema.Types.Mixed,
      required: true,
    },
    valuation: {
      type: Schema.Types.Mixed,
      required: true,
    },
    risk: {
      type: Schema.Types.Mixed,
      required: true,
    },
    recommendation: {
      type: Schema.Types.Mixed,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    minimize: false, // Ensure empty objects are kept in the database
  }
);

// Expose compile model
export const ReportModel = model<IReport>("Report", ReportSchema);
