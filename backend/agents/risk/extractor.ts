import { PromptTemplate } from "@langchain/core/prompts";

import { gemini } from "../../lib/gemini";

import { extractJson } from "../../utils/extractJson";

import { RISK_PROMPT } from "./prompt";

import { RiskSchema } from "./schema";

export async function extractRisk(

  companyResearch: any,

  financialStatements: any,

  competitors: any,

  marketIndustry: any,

  news: any,

  macroeconomic: any,

  sentiment: any,

  valuation: any

) {

  // =====================================================
  // Prompt
  // =====================================================

  const prompt =
    PromptTemplate.fromTemplate(`

${RISK_PROMPT}

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

    });

  console.log(
    "Risk Prompt Length:",
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
    "========== RISK RAW =========="
  );

  console.dir(
    json,
    { depth: null }
  );

  console.log(
    "=============================="
  );

  // =====================================================
  // Defaults
  // =====================================================

  json.businessRisk ??=
    "Moderate";

  json.financialRisk ??=
    "Moderate";

  json.competitiveRisk ??=
    "Moderate";

  json.marketRisk ??=
    "Moderate";

  json.macroeconomicRisk ??=
    "Moderate";

  json.regulatoryRisk ??=
    "Moderate";

  json.valuationRisk ??=
    "Moderate";

  json.sentimentRisk ??=
    "Moderate";

  json.overallRiskScore ??=
    50;

  json.riskLevel ??=
    "Moderate";

  json.topRisks ??=
    [];

  json.mitigatingFactors ??=
    [];

  json.summary ??=
    "";

  // =====================================================
  // Confidence
  // =====================================================

  if (
    typeof json.confidence ===
    "string"
  ) {

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
    "Risk Analysis Extracted"
  );

  // =====================================================
  // Validate
  // =====================================================

  return RiskSchema
    .partial()
    .parse(json);

}