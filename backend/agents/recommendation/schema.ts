import { z } from "zod";

export const RecommendationSchema = z.object({

  companyName: z.string(),

  ticker: z.string(),

  recommendation: z.enum([

    "Strong Buy",

    "Buy",

    "Hold",

    "Sell",

    "Strong Sell",

  ]),

  investmentScore: z.number()

    .min(0)

    .max(100),

  conviction: z.enum([

    "Very High",

    "High",

    "Medium",

    "Low",

  ]),

  expectedReturn: z.string(),

  targetPrice: z.number().nullable(),

  stopLoss: z.number().nullable(),

  riskRewardRatio: z.string(),

  timeHorizon: z.enum([

    "Short Term",

    "Medium Term",

    "Long Term",

  ]),

  bullCase:

    z.array(z.string()),

  bearCase:

    z.array(z.string()),

  keyCatalysts:

    z.array(z.string()),

  watchItems:

    z.array(z.string()),

  investmentThesis:

    z.string(),

  executiveSummary:

    z.string(),

  confidence: z.preprocess(
    (val) => {
      const num = Number(val);
      return num > 1 ? num / 100 : num;
    },
    z.number().min(0).max(1)
  ),

});

export type Recommendation =
  z.infer<
    typeof RecommendationSchema
  >;