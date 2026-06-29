import { PromptTemplate } from "@langchain/core/prompts";

import { gemini } from "../../lib/gemini";

import { extractJson } from "../../utils/extractJson";

import { RECOMMENDATION_PROMPT } from "./prompt";

import { RecommendationSchema } from "./schema";

export async function extractRecommendation(

  companyResearch: any,

  financialStatements: any,

  competitors: any,

  marketIndustry: any,

  news: any,

  macroeconomic: any,

  sentiment: any,

  valuation: any,

  risk: any

) {

  // =====================================================
  // Prompt
  // =====================================================

  const prompt =
    PromptTemplate.fromTemplate(`

${RECOMMENDATION_PROMPT}

=====================================================

Company Research

{companyResearch}

=====================================================

Financial Statements

{financialStatements}

=====================================================

Competitor Analysis

{competitors}

=====================================================

Market & Industry

{marketIndustry}

=====================================================

News Analysis

{news}

=====================================================

Macroeconomic Analysis

{macroeconomic}

=====================================================

Sentiment Analysis

{sentiment}

=====================================================

Valuation Analysis

{valuation}

=====================================================

Risk Assessment

{risk}

`);

  const formattedPrompt =
    await prompt.format({

      companyResearch:
        JSON.stringify(
          companyResearch,
          null,
          2
        ),

      financialStatements:
        JSON.stringify(
          financialStatements,
          null,
          2
        ),

      competitors:
        JSON.stringify(
          competitors,
          null,
          2
        ),

      marketIndustry:
        JSON.stringify(
          marketIndustry,
          null,
          2
        ),

      news:
        JSON.stringify(
          news,
          null,
          2
        ),

      macroeconomic:
        JSON.stringify(
          macroeconomic,
          null,
          2
        ),

      sentiment:
        JSON.stringify(
          sentiment,
          null,
          2
        ),

      valuation:
        JSON.stringify(
          valuation,
          null,
          2
        ),

      risk:
        JSON.stringify(
          risk,
          null,
          2
        ),

    });

  console.log(
    "Recommendation Prompt Length:",
    formattedPrompt.length
  );

  // =====================================================
  // Gemini
  // =====================================================

  const response =
    await gemini.invoke(
      formattedPrompt
    );

  // =====================================================
  // Extract JSON
  // =====================================================

  const json =
    extractJson(
      String(response.content)
    );

  console.log(
    "========== RECOMMENDATION RAW =========="
  );

  console.dir(
    json,
    { depth: null }
  );

  console.log(
    "========================================"
  );

  // =====================================================
  // Defaults
  // =====================================================

  json.recommendation ??=
    "Hold";

  json.investmentScore ??=
    70;

  json.conviction ??=
    "Medium";

  json.expectedReturn ??=
    "10-15%";

  json.targetPrice ??=
    null;

  json.stopLoss ??=
    null;

  json.riskRewardRatio ??=
    "1:2";

  json.timeHorizon ??=
    "Medium Term";

  json.bullCase ??=
    [];

  json.bearCase ??=
    [];

  json.keyCatalysts ??=
    [];

  json.watchItems ??=
    [];

  json.investmentThesis ??=
    "";

  json.executiveSummary ??=
    "";

  // =====================================================
  // Normalize Confidence
  // =====================================================

  if (typeof json.confidence === "string") {

    const value =
      json.confidence
        .toLowerCase();

    if (value === "very high") {

      json.confidence = 0.98;

    }

    else if (value === "high") {

      json.confidence = 0.90;

    }

    else if (value === "medium") {

      json.confidence = 0.70;

    }

    else if (value === "low") {

      json.confidence = 0.50;

    }

    else {

      const number =
        Number(
          json.confidence
        );

      json.confidence =
        Number.isNaN(number)
          ? 0.90
          : number;

    }

  }

  if (

    typeof json.confidence !==
      "number"

  ) {

    json.confidence = 0.90;

  }

  console.log(
    "Recommendation Extracted"
  );

  // =====================================================
  // Validate
  // =====================================================

  return RecommendationSchema
    .partial()
    .parse(json);

}