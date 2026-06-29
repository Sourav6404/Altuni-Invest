import { z } from "zod";

// ======================================================
// Risk Schema
// ======================================================

export const RiskSchema = z.object({

  companyName: z.string(),

  ticker: z.string(),

  businessRisk: z.enum([
    "Low",
    "Moderate",
    "High",
    "Very High",
  ]),

  financialRisk: z.enum([
    "Low",
    "Moderate",
    "High",
    "Very High",
  ]),

  competitiveRisk: z.enum([
    "Low",
    "Moderate",
    "High",
    "Very High",
  ]),

  marketRisk: z.enum([
    "Low",
    "Moderate",
    "High",
    "Very High",
  ]),

  macroeconomicRisk: z.enum([
    "Low",
    "Moderate",
    "High",
    "Very High",
  ]),

  regulatoryRisk: z.enum([
    "Low",
    "Moderate",
    "High",
    "Very High",
  ]),

  valuationRisk: z.enum([
    "Low",
    "Moderate",
    "High",
    "Very High",
  ]),

  sentimentRisk: z.enum([
    "Low",
    "Moderate",
    "High",
    "Very High",
  ]),

  overallRiskScore: z.number()
    .min(0)
    .max(100),

  riskLevel: z.enum([
    "Low",
    "Moderate",
    "High",
    "Very High",
  ]),

  topRisks: z.array(
    z.string()
  ),

  mitigatingFactors: z.array(
    z.string()
  ),

  summary: z.string(),

  confidence: z.preprocess(
    (val) => {
      const num = Number(val);
      return num > 1 ? num / 100 : num;
    },
    z.number().min(0).max(1)
  ),

});

export type RiskAnalysis =
  z.infer<
    typeof RiskSchema
  >;