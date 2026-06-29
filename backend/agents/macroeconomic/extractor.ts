import { PromptTemplate } from "@langchain/core/prompts";

import { gemini } from "../../lib/gemini";

import { extractJson } from "../../utils/extractJson";

import { MACROECONOMIC_PROMPT } from "./prompt";

import { MacroeconomicSchema } from "./schema";

export async function extractMacroeconomic(
  companyName: string,
  ticker: string,
  searchResults: any[]
) {

  // =====================================================
  // Reduce Prompt Size
  // =====================================================

  const simplifiedResults =
    searchResults
      .slice(0, 10)
      .map((result: any) => ({

        title: result.title,

        url: result.url,

        content:
          result.content?.slice(0, 700),

      }));

  // =====================================================
  // Build Prompt
  // =====================================================

  const prompt =
    PromptTemplate.fromTemplate(`

${MACROECONOMIC_PROMPT}

Company

{company}

Ticker

{ticker}

Search Results

{results}

`);

  const formattedPrompt =
    await prompt.format({

      company:
        companyName,

      ticker:
        ticker,

      results:
        JSON.stringify(
          simplifiedResults,
          null,
          2
        ),

    });

  console.log(
    "Macroeconomic Prompt Length:",
    formattedPrompt.length
  );

  // =====================================================
  // Ask Gemini
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

// =====================================================
// Normalize Indicator Fields
// =====================================================

const normalizeIndicator = (indicator: any) => {

  if (!indicator) {

    return undefined;

  }

  return {

    status:
      indicator.status ??
      indicator.currentStatus ??
      "Unknown",

    impact:
      indicator.impact ??
      "Neutral",

  };

};

json.interestRates =
  normalizeIndicator(
    json.interestRates
  );

json.inflation =
  normalizeIndicator(
    json.inflation
  );

json.gdpGrowth =
  normalizeIndicator(
    json.gdpGrowth
  );

json.exchangeRates =
  normalizeIndicator(
    json.exchangeRates
  );

json.governmentPolicy ??= [];

json.macroeconomicRisks ??= [];

json.opportunities ??= [];

if (typeof json.confidence === "string") {

  json.confidence =
    Number(json.confidence);

}

if (
  typeof json.confidence !== "number" ||
  Number.isNaN(json.confidence)
) {

  json.confidence = 0.9;

}

console.log("========== NORMALIZED ==========");

console.dir(json, { depth: null });

console.log("===============================");

  console.log(
    "========== MACRO RAW =========="
  );

  console.dir(
    json,
    { depth: null }
  );

  console.log(
    "==============================="
  );

  // =====================================================
  // Normalize
  // =====================================================

  json.governmentPolicy ??= [];

  json.macroeconomicRisks ??= [];

  json.opportunities ??= [];

  if (
    typeof json.confidence === "string"
  ) {

    json.confidence =
      Number(json.confidence);

  }

  if (

    typeof json.confidence !==
      "number" ||

    Number.isNaN(
      json.confidence
    )

  ) {

    json.confidence = 0.9;

  }

  console.log(
    "Macroeconomic Analysis Extracted"
  );

  // =====================================================
  // Validate
  // =====================================================

  return MacroeconomicSchema
    .partial()
    .parse(json);

}