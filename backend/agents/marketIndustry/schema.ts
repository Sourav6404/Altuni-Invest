import { z } from "zod";

// ======================================================
// Market & Industry Analysis
// ======================================================

export const MarketIndustrySchema = z.object({

  companyName: z.string(),

  ticker: z.string(),

  industry: z.string().nullable(),

  sector: z.string().nullable(),

  marketSize: z.string().nullable(),

  growthRate: z.string().nullable(),

  industryLifecycle: z.enum([
    "Introduction",
    "Growth",
    "Maturity",
    "Decline",
  ]).nullable(),

  majorTrends: z.array(
    z.string()
  ),

  governmentRegulations: z.array(
    z.string()
  ),

  opportunities: z.array(
    z.string()
  ),

  risks: z.array(
    z.string()
  ),

  futureOutlook: z.enum([
    "Very Positive",
    "Positive",
    "Neutral",
    "Negative",
    "Very Negative",
  ]).nullable(),

  summary: z.string(),

  sources: z.array(
    z.string()
  ),

  confidence: z.preprocess(
    (val) => {
      const num = Number(val);
      return num > 1 ? num / 100 : num;
    },
    z.number().min(0).max(1)
  ),

});

// ======================================================
// Types
// ======================================================

export type MarketIndustry =
  z.infer<
    typeof MarketIndustrySchema
  >;