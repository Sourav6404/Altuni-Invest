import {
  NewsAnalysisSchema,
} from "./schema";

import {
  NewsInput,
} from "./types";

import {
  extractNews,
} from "./extractor";

import {

  searchNews,

  getSources,

} from "./tools";

export async function newsAgent(
  input: NewsInput
) {

  try {

    // =====================================================
    // Search News
    // =====================================================

    const searchResponse =
      await searchNews(

        input.companyName,

        input.ticker

      );

    const searchResults =
      searchResponse.results ?? [];

    console.log(
      "News Search Results:",
      searchResults.length
    );

    // =====================================================
    // Extract News Analysis
    // =====================================================

    const extracted =
      await extractNews(

        input.companyName,

        input.ticker,

        searchResults

      );

    console.log(
      "News Analysis Extracted"
    );

    // =====================================================
    // Final Object
    // =====================================================

    const result = {

      companyName:
        input.companyName,

      ticker:
        input.ticker,

      news:
        extracted.news ?? [],

      overallSentiment:
        extracted.overallSentiment ??
        "Neutral",

      keyTakeaways:
        extracted.keyTakeaways ?? [],

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
      "News Agent Completed"
    );

    // =====================================================
    // Validate
    // =====================================================

    return NewsAnalysisSchema.parse(
      result
    );

  }

  catch (error) {

    console.error(
      "News Agent Error:",
      error
    );

    throw new Error(
      "Failed to generate news analysis."
    );

  }

}