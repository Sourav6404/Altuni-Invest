import { RiskSchema } from "./schema";

import { RiskInput } from "./types";

import { extractRisk } from "./extractor";

export async function riskAgent(
  input: RiskInput
) {

  try {

    // =====================================================
    // Extract
    // =====================================================

    const extracted =
      await extractRisk(

        input.companyResearch,

        input.financialStatements,

        input.competitors,

        input.marketIndustry,

        input.news,

        input.macroeconomic,

        input.sentiment,

        input.valuation

      );

    console.log(
      "Risk Analysis Extracted"
    );

    // =====================================================
    // Final Object
    // =====================================================

    const result = {

      companyName:
        input.companyResearch.companyName,

      ticker:
        input.companyResearch.ticker,

      businessRisk:
        extracted.businessRisk ??
        "Moderate",

      financialRisk:
        extracted.financialRisk ??
        "Moderate",

      competitiveRisk:
        extracted.competitiveRisk ??
        "Moderate",

      marketRisk:
        extracted.marketRisk ??
        "Moderate",

      macroeconomicRisk:
        extracted.macroeconomicRisk ??
        "Moderate",

      regulatoryRisk:
        extracted.regulatoryRisk ??
        "Moderate",

      valuationRisk:
        extracted.valuationRisk ??
        "Moderate",

      sentimentRisk:
        extracted.sentimentRisk ??
        "Moderate",

      overallRiskScore:
        extracted.overallRiskScore ??
        50,

      riskLevel:
        extracted.riskLevel ??
        "Moderate",

      topRisks:
        extracted.topRisks ?? [],

      mitigatingFactors:
        extracted.mitigatingFactors ?? [],

      summary:
        extracted.summary ?? "",

      confidence:
        extracted.confidence ??
        0.90,

    };

    console.log(
      "Risk Agent Completed"
    );

    return RiskSchema.parse(
      result
    );

  }

  catch (error) {

    console.error(
      "Risk Agent Error:",
      error
    );

    throw new Error(
      "Failed to generate risk assessment."
    );

  }

}