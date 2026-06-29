import { PromptTemplate } from "@langchain/core/prompts";

import { gemini } from "../../lib/gemini";

import { extractJson } from "../../utils/extractJson";

import { MARKET_INDUSTRY_PROMPT } from "./prompt";

import { MarketIndustrySchema } from "./schema";

export async function extractMarketIndustry(
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

${MARKET_INDUSTRY_PROMPT}

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
    "Market Prompt Length:",
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
  // Normalize
  // =====================================================

  json.majorTrends ??= [];

  json.governmentRegulations ??= [];

  json.opportunities ??= [];

  json.risks ??= [];

  json.sources ??= [];

  json.confidence ??= 0.8;

  console.log(
    "Market Analysis Extracted"
  );
  // =====================================
// Normalize Confidence
// =====================================

if (typeof json.confidence === "string") {

  const value = json.confidence.toLowerCase();

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

    const number = Number(json.confidence);

    json.confidence =
      Number.isNaN(number)
        ? 0.90
        : number;
  }

}

if (typeof json.confidence !== "number") {
  json.confidence = 0.90;
}

  // =====================================================
  // Validate
  // =====================================================

  return MarketIndustrySchema.partial().parse(
    json
  );

}