import { PromptTemplate } from "@langchain/core/prompts";

import { gemini } from "../../lib/gemini";

import { extractJson } from "../../utils/extractJson";

import { SENTIMENT_PROMPT } from "./prompt";

import { SentimentSchema } from "./schema";

export async function extractSentiment(
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
          result.content?.slice(0, 800),

      }));

  // =====================================================
  // Build Prompt
  // =====================================================

  const prompt =
    PromptTemplate.fromTemplate(`

${SENTIMENT_PROMPT}

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
    "Sentiment Prompt Length:",
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
  // Debug
  // =====================================================

  console.log(
    "========== SENTIMENT RAW =========="
  );

  console.dir(
    json,
    { depth: null }
  );

  console.log(
    "==================================="
  );

  // =====================================================
  // Normalize
  // =====================================================

  json.keyDrivers ??= [];

  json.sources ??= [];

  if (
    typeof json.confidence ===
    "string"
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

  json.analystSentiment ??=
    "Neutral";

  json.investorSentiment ??=
    "Neutral";

  json.socialSentiment ??=
    "Neutral";

  json.overallSentiment ??=
    "Neutral";

  json.summary ??= "";

  console.log(
    "Sentiment Analysis Extracted"
  );

  // =====================================================
  // Validate
  // =====================================================

  return SentimentSchema
    .partial()
    .parse(json);

}