import { z } from "zod";

// ======================================================
// Economic Indicator
// ======================================================

export const IndicatorSchema = z.object({

  status: z.string(),

  impact: z.enum([

    "Positive",

    "Neutral",

    "Negative",

  ]),

});

// ======================================================
// Macroeconomic Analysis
// ======================================================

export const MacroeconomicSchema = z.object({

  companyName: z.string(),

  ticker: z.string(),

  interestRates: IndicatorSchema,

  inflation: IndicatorSchema,

  gdpGrowth: IndicatorSchema,

  exchangeRates: IndicatorSchema,

  governmentPolicy: z.array(
    z.string()
  ),

  macroeconomicRisks: z.array(
    z.string()
  ),

  opportunities: z.array(
    z.string()
  ),

  overallImpact: z.enum([

    "Very Positive",

    "Positive",

    "Neutral",

    "Negative",

    "Very Negative",

  ]),

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

export type Indicator =
  z.infer<
    typeof IndicatorSchema
  >;

export type Macroeconomic =
  z.infer<
    typeof MacroeconomicSchema
  >;