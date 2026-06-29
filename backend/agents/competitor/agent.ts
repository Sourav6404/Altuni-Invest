import {
  CompetitorAnalysisSchema,
} from "./schema";

import {
  CompetitorInput,
} from "./types";

import {
  extractCompetitors,
} from "./extractor";

import {

  getCompanyOverview,

  searchCompetitors,

  enrichCompetitors,

} from "./tools";

export async function competitorAnalysisAgent(
  input: CompetitorInput
) {

  try {

    // =====================================================
    // Company Overview
    // =====================================================

    const overview =
      await getCompanyOverview(
        input.ticker
      );

    // =====================================================
    // Search
    // =====================================================

    const searchResponse =
      await searchCompetitors(

        input.companyName,

        input.ticker

      );

    const searchResults =
      searchResponse.results ?? [];

    console.log(
      "Competitor Search Results:",
      searchResults.length
    );

    // =====================================================
    // Extract Competitors
    // =====================================================

    const extracted =
  await extractCompetitors(
      input.companyName,
      input.ticker,
      searchResults
  );

const competitorList =
    extracted.competitors ?? [];


    // =====================================================
    // Enrich with Alpha Vantage
    // =====================================================

    const competitors =
  await enrichCompetitors(
    extracted.competitors ?? []
  );

    // =====================================================
    // Final Object
    // =====================================================

    const result = {

      companyName:
        input.companyName,

      ticker:
        input.ticker,

      industry:
        overview.Industry ?? null,

      sector:
        overview.Sector ?? null,

      marketCap:
        overview.MarketCapitalization
          ? Number(
              overview.MarketCapitalization
            )
          : null,

      competitors,

      sources:
        searchResults.map(
          (result: any) => result.url
        ),

      confidence:
        extracted.confidence ?? 0.9,

    };

    console.log(
      "Competitors:",
      competitors.length
    );

    // =====================================================
    // Validate
    // =====================================================

    return CompetitorAnalysisSchema.parse(
      result
    );

  }

  catch (error) {

    console.error(
      "Competitor Analysis Agent Error:",
      error
    );

    throw new Error(
      "Failed to generate competitor analysis."
    );

  }

}