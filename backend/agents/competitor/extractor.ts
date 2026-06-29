import { PromptTemplate } from "@langchain/core/prompts";

import { gemini } from "../../lib/gemini";

import { extractJson } from "../../utils/extractJson";

import { COMPETITOR_ANALYSIS_PROMPT } from "./prompt";

import {
  ExtractedCompetitorAnalysisSchema,
} from "./schema";

export async function extractCompetitors(
  companyName: string,
  ticker: string,
  searchResults: any[]
) {

  // =====================================================
  // Reduce Prompt Size
  // =====================================================

  const simplifiedResults =
    searchResults
      .slice(0, 8)
      .map((result: any) => ({

        title: result.title,

        url: result.url,

        content:
          result.content?.slice(0, 600),

      }));

  // =====================================================
  // Build Prompt
  // =====================================================

  const prompt =
    PromptTemplate.fromTemplate(`

${COMPETITOR_ANALYSIS_PROMPT}

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
    "Competitor Prompt Length:",
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

  json.competitors ??= [];

  json.sources ??= [];

  json.confidence ??= 0.8;

  console.log(
    "Competitors Found:",
    json.competitors.length
  );

  // =====================================================
  // Validate
  // =====================================================

  return ExtractedCompetitorAnalysisSchema.parse(
    json
);

}