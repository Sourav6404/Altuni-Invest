import { PromptTemplate } from "@langchain/core/prompts";

import { gemini } from "../../lib/gemini";

import { extractJson } from "../../utils/extractJson";

import { VALUATION_PROMPT } from "./prompt";

import { ValuationSchema } from "./schema";

export async function extractValuation(
  companyName: string,
  ticker: string,
  searchResults: any[],
  metrics: any
) {

  // =====================================================
  // Reduce Search Results
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
  // Prompt
  // =====================================================

  const prompt =
    PromptTemplate.fromTemplate(`

${VALUATION_PROMPT}

Company

{company}

Ticker

{ticker}

Financial Metrics

{metrics}

Search Results

{results}

`);

  const formattedPrompt =
    await prompt.format({

      company:
        companyName,

      ticker:
        ticker,

      metrics:
        JSON.stringify(
          metrics,
          null,
          2
        ),

      results:
        JSON.stringify(
          simplifiedResults,
          null,
          2
        ),

    });

  console.log(
    "Valuation Prompt Length:",
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
    "========== VALUATION RAW =========="
  );

  console.dir(
    json,
    { depth: null }
  );

  console.log(
    "==================================="
  );

  // =====================================================
  // Normalize Metrics
  // =====================================================

  json.metrics ??= {};

  json.metrics.pe ??= null;

  json.metrics.industryPE ??= null;

  json.metrics.peg ??= null;

  json.metrics.priceToBook ??= null;

  json.metrics.priceToSales ??= null;

  json.metrics.evEbitda ??= null;

  json.currentPrice ??= null;

  json.intrinsicValue ??= null;

  json.upside ??= 0;

  json.downside ??= 0;

  json.valuation ??=
    "Fairly Valued";

  json.valuationSummary ??=
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
    "Valuation Extracted"
  );

  // =====================================================
  // Validate
  // =====================================================

  return ValuationSchema
    .partial()
    .parse(json);

}