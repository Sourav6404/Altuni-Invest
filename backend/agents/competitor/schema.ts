import { z } from "zod";

export const ExtractedCompetitorSchema = z.object({

  companyName: z.string(),

  ticker: z.string().nullable(),

  competitionType: z.enum([
    "Direct",
    "Indirect",
    "Emerging",
  ]),

  reason: z.string(),

});

export const ExtractedCompetitorAnalysisSchema =
  z.object({

    competitors: z.array(
      ExtractedCompetitorSchema
    ),

    confidence: z.number(),

});
// ======================================================
// Competitor
// ======================================================

export const CompetitorSchema = z.object({

  companyName: z.string(),

  ticker: z.string().nullable(),

  industry: z.string().nullable(),

  sector: z.string().nullable(),

  marketCap: z.number().nullable(),

  country: z.string().nullable(),

  competitionType: z.enum([
    "Direct",
    "Indirect",
    "Emerging",
  ]),

  reason: z.string(),

  score: z.preprocess(
    (val) => val === undefined || val === null ? 80 : Number(val),
    z.number().default(80)
  ), // custom extension for dashboard benchmark

});

// ======================================================
// Final Schema
// ======================================================

export const CompetitorAnalysisSchema = z.object({

  companyName: z.string(),

  ticker: z.string(),

  industry: z.string().nullable(),

  sector: z.string().nullable(),

  marketCap: z.number().nullable(),

  competitors: z.array(
    CompetitorSchema
  ),

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

  keyMoat: z.string().default("Strong competitive advantage driven by market positioning and industry leadership."),

});

// ======================================================
// Types
// ======================================================

export type Competitor =
  z.infer<
    typeof CompetitorSchema
  >;

export type CompetitorAnalysis =
  z.infer<
    typeof CompetitorAnalysisSchema
  >;