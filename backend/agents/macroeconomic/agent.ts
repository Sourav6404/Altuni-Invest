import {
  MacroeconomicSchema,
} from "./schema";

import {
  MacroeconomicInput,
} from "./types";

import {
  extractMacroeconomic,
} from "./extractor";

import {

  searchMacroeconomic,

  getSources,

} from "./tools";

export async function macroeconomicAgent(
  input: MacroeconomicInput
) {

  try {

    // =====================================================
    // Search
    // =====================================================

    const searchResponse =
      await searchMacroeconomic(

        input.companyName,

        input.ticker

      );

    const searchResults =
      searchResponse.results ?? [];

    console.log(
      "Macroeconomic Search Results:",
      searchResults.length
    );

    // =====================================================
    // Extract Analysis
    // =====================================================

    const extracted =
      await extractMacroeconomic(

        input.companyName,

        input.ticker,

        searchResults

      );

    console.log(
      "Macroeconomic Analysis Extracted"
    );

    // =====================================================
    // Final Object
    // =====================================================

    const result = {

      companyName:
        input.companyName,

      ticker:
        input.ticker,

      interestRates:
        extracted.interestRates ?? {

          status: "Unknown",

          impact: "Neutral",

        },

      inflation:
        extracted.inflation ?? {

          status: "Unknown",

          impact: "Neutral",

        },

      gdpGrowth:
        extracted.gdpGrowth ?? {

          status: "Unknown",

          impact: "Neutral",

        },

      exchangeRates:
        extracted.exchangeRates ?? {

          status: "Unknown",

          impact: "Neutral",

        },

      governmentPolicy:
        extracted.governmentPolicy ?? [],

      macroeconomicRisks:
        extracted.macroeconomicRisks ?? [],

      opportunities:
        extracted.opportunities ?? [],

      overallImpact:
        extracted.overallImpact ??
        "Neutral",

      summary:
        extracted.summary ??
        "",

      sources:
        getSources(
          searchResults
        ),

      confidence:
        extracted.confidence ??
        0.9,

    };

    console.log(
      "Macroeconomic Agent Completed"
    );

    // =====================================================
    // Validate
    // =====================================================

    return MacroeconomicSchema.parse(
      result
    );

  }

  catch (error) {

    console.error(
      "Macroeconomic Agent Error:",
      error
    );

    throw new Error(
      "Failed to generate macroeconomic analysis."
    );

  }

}