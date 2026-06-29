import { RecommendationSchema } from "./schema";

import { RecommendationInput } from "./types";

import { extractRecommendation } from "./extractor";

export async function recommendationAgent(
  input: RecommendationInput
) {

  try {

    // =====================================================
    // Extract Recommendation
    // =====================================================

    const extracted =
      await extractRecommendation(

        input.companyResearch,

        input.financialStatements,

        input.competitors,

        input.marketIndustry,

        input.news,

        input.macroeconomic,

        input.sentiment,

        input.valuation,

        input.risk

      );

    console.log(
      "Recommendation Extracted"
    );

    // =====================================================
    // Final Object
    // =====================================================

    const result = {

      companyName:
        input.companyResearch.companyName,

      ticker:
        input.companyResearch.ticker,

      recommendation:
        extracted.recommendation ??
        "Hold",

      investmentScore:
        extracted.investmentScore ??
        70,

      conviction:
        extracted.conviction ??
        "Medium",

      expectedReturn:
        extracted.expectedReturn ??
        "10-15%",

      targetPrice:
        extracted.targetPrice ??
        null,

      stopLoss:
        extracted.stopLoss ??
        null,

      riskRewardRatio:
        extracted.riskRewardRatio ??
        "1:2",

      timeHorizon:
        extracted.timeHorizon ??
        "Medium Term",

      bullCase:
        extracted.bullCase ??
        [],

      bearCase:
        extracted.bearCase ??
        [],

      keyCatalysts:
        extracted.keyCatalysts ??
        [],

      watchItems:
        extracted.watchItems ??
        [],

      investmentThesis:
        extracted.investmentThesis ??
        "",

      executiveSummary:
        extracted.executiveSummary ??
        "",

      confidence:
        extracted.confidence ??
        0.90,

    };

    console.log(
      "Recommendation Agent Completed"
    );

    return RecommendationSchema.parse(
      result
    );

  }

  catch (error) {

    console.error(
      "Recommendation Agent Error:",
      error
    );

    throw new Error(
      "Failed to generate investment recommendation."
    );

  }

}