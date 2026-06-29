import { ValuationSchema } from "./schema";

import { ValuationInput } from "./types";

import { extractValuation } from "./extractor";

import {
  searchValuation,
  getFinancialMetrics,
  getSources,
} from "./tools";

export async function valuationAgent(
  input: ValuationInput
) {

  try {

    // =====================================================
    // Search
    // =====================================================

    const searchResponse =
      await searchValuation(

        input.companyName,

        input.ticker

      );

    const searchResults =
      searchResponse.results ?? [];

    console.log(
      "Valuation Search Results:",
      searchResults.length
    );

    // =====================================================
    // Financial Metrics
    // =====================================================

    const metrics =
      await getFinancialMetrics(

        input.companyName,

        input.ticker

      );

    console.log(
      "Financial Metrics Loaded"
    );

    // =====================================================
    // Extract
    // =====================================================

    const extracted =
      await extractValuation(

        input.companyName,

        input.ticker,

        searchResults,

        metrics

      );

    console.log(
      "Valuation Analysis Extracted"
    );

    // =====================================================
    // Final Object
    // =====================================================

    const result = {

      companyName:
        input.companyName,

      ticker:
        input.ticker,

      currentPrice:
        extracted.currentPrice ??
        metrics.currentPrice ??
        null,

      intrinsicValue:
        extracted.intrinsicValue ??
        null,

      valuation:
        extracted.valuation ??
        "Fairly Valued",

      upside:
        extracted.upside ??
        0,

      downside:
        extracted.downside ??
        0,

      metrics: {

        pe:
          extracted.metrics?.pe ??
          metrics.pe ??
          null,

        industryPE:
          extracted.metrics?.industryPE ??
          metrics.industryPE ??
          null,

        peg:
          extracted.metrics?.peg ??
          metrics.peg ??
          null,

        priceToBook:
          extracted.metrics?.priceToBook ??
          metrics.priceToBook ??
          null,

        priceToSales:
          extracted.metrics?.priceToSales ??
          metrics.priceToSales ??
          null,

        evEbitda:
          extracted.metrics?.evEbitda ??
          metrics.evEbitda ??
          null,

      },

      valuationSummary:
        extracted.valuationSummary ??
        "",

      confidence:
        extracted.confidence ??
        0.90,

      sources:
        getSources(
          searchResults
        ),

    };

    console.log(
      "Valuation Agent Completed"
    );

    return ValuationSchema.parse(
      result
    );

  }

  catch (error) {

    console.error(
      "Valuation Agent Error:",
      error
    );

    throw new Error(
      "Failed to generate valuation."
    );

  }

}