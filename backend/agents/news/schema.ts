import { z } from "zod";

// ======================================================
// Individual News Item
// ======================================================

export const NewsItemSchema = z.object({

  headline:
    z.string().default("Unknown Headline"),

  summary:
    z.string().default(""),

  category:
    z.enum([

      "Earnings",

      "Product Launch",

      "Partnership",

      "Acquisition",

      "Management",

      "Regulation",

      "Litigation",

      "Investment",

      "Market",

      "Technology",

      "Other",

    ]).default("Other"),

  impact:
    z.enum([

      "Positive",

      "Neutral",

      "Negative",

    ]).default("Neutral"),

  importance:
    z.enum([

      "High",

      "Medium",

      "Low",

    ]).default("Medium"),

  date:
    z.string()
      .nullable()
      .default(null),

  source:
    z.string()
      .default("Unknown"),

  url:
    z.string()
      .default(""),

});

// ======================================================
// News Agent Output
// ======================================================

export const NewsAnalysisSchema = z.object({

  companyName:
    z.string().optional(),

  ticker:
    z.string().optional(),

  news:
    z.array(
      NewsItemSchema
    ).default([]),

  overallSentiment:
    z.enum([

      "Very Positive",

      "Positive",

      "Neutral",

      "Negative",

      "Very Negative",

    ]).default("Neutral"),

  keyTakeaways:
    z.array(
      z.string()
    ).default([]),

  summary:
    z.string().default(""),

  sources:
    z.array(
      z.string()
    ).default([]),

  confidence: z.preprocess(
    (val) => {
      const num = Number(val);
      return num > 1 ? num / 100 : num;
    },
    z.number().min(0).max(1).default(0.90)
  ),

});

// ======================================================

export type NewsItem =
  z.infer<
    typeof NewsItemSchema
  >;

export type NewsAnalysis =
  z.infer<
    typeof NewsAnalysisSchema
  >;