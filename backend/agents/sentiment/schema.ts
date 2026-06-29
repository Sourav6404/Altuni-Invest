import { z } from "zod";

// ======================================================
// Sentiment Analysis
// ======================================================

export const SentimentSchema = z.object({

  companyName: z.string(),

  ticker: z.string(),

  analystSentiment: z.enum([

    "Very Bullish",

    "Bullish",

    "Neutral",

    "Bearish",

    "Very Bearish",

  ]),

  investorSentiment: z.enum([

    "Very Positive",

    "Positive",

    "Neutral",

    "Negative",

    "Very Negative",

  ]),

  socialSentiment: z.enum([

    "Very Positive",

    "Positive",

    "Neutral",

    "Negative",

    "Very Negative",

  ]),

  overallSentiment: z.enum([

    "Very Positive",

    "Positive",

    "Neutral",

    "Negative",

    "Very Negative",

  ]),

  keyDrivers: z.array(
    z.string()
  ),

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

export type SentimentAnalysis =
  z.infer<
    typeof SentimentSchema
  >;