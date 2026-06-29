import { z } from "zod";

// ======================================================
// Valuation Metrics
// ======================================================

export const MetricsSchema = z.object({

  pe: z.number().nullable(),

  industryPE: z.number().nullable(),

  peg: z.number().nullable(),

  priceToBook: z.number().nullable(),

  priceToSales: z.number().nullable(),

  evEbitda: z.number().nullable(),

});

// ======================================================
// Valuation
// ======================================================

export const ValuationSchema = z.object({

  companyName: z.string(),

  ticker: z.string(),

  currentPrice: z.number().nullable(),

  intrinsicValue: z.number().nullable(),

  valuation: z.enum([

    "Undervalued",

    "Fairly Valued",

    "Overvalued",

  ]),

  upside: z.number(),

  downside: z.number(),

  metrics: MetricsSchema,

  valuationSummary: z.string(),

  confidence: z.preprocess(
    (val) => {
      const num = Number(val);
      return num > 1 ? num / 100 : num;
    },
    z.number().min(0).max(1)
  ),

  sources: z.array(
    z.string()
  ),

});

export type Valuation =
  z.infer<
    typeof ValuationSchema
  >;