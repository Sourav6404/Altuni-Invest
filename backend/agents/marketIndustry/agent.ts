import {
  MarketIndustrySchema,
} from "./schema";

import {
  MarketIndustryInput,
} from "./types";

import {
  extractMarketIndustry,
} from "./extractor";

import {

  getCompanyOverview,

  searchMarketIndustry,

  getSources,

} from "./tools";

export async function marketIndustryAgent(
  input: MarketIndustryInput
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
      await searchMarketIndustry(

        input.companyName,

        input.ticker

      );

    const searchResults =
      searchResponse.results ?? [];

    console.log(
      "Market Search Results:",
      searchResults.length
    );

    // =====================================================
    // Extract Analysis
    // =====================================================

    const extracted =
      await extractMarketIndustry(

        input.companyName,

        input.ticker,

        searchResults

      );

    console.log(
      "Market Analysis Extracted"
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
        extracted.industry ??
        overview.Industry ??
        null,

      sector:
        extracted.sector ??
        overview.Sector ??
        null,

      marketSize:
        extracted.marketSize ??
        null,

      growthRate:
        extracted.growthRate ??
        null,

      industryLifecycle:
        extracted.industryLifecycle ??
        null,

      majorTrends:
        extracted.majorTrends ?? [],

      governmentRegulations:
        extracted.governmentRegulations ?? [],

      opportunities:
        extracted.opportunities ?? [],

      risks:
        extracted.risks ?? [],

      futureOutlook:
        extracted.futureOutlook ??
        null,

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
      "Market Industry Agent Completed"
    );

    // =====================================================
    // Validate
    // =====================================================

    return MarketIndustrySchema.parse(
      result
    );

  }

  catch (error) {

    console.error(
      "Market Industry Agent Error:",
      error
    );

    throw new Error(
      "Failed to generate market industry analysis."
    );

  }

}