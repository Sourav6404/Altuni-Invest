import {
  SentimentSchema,
} from "./schema";

import {
  SentimentInput,
} from "./types";

import {
  extractSentiment,
} from "./extractor";

import {

  searchSentiment,

  getSources,

} from "./tools";

export async function sentimentAgent(
  input: SentimentInput
) {

  try {

    // =====================================================
    // Search
    // =====================================================

    const searchResponse =
      await searchSentiment(

        input.companyName,

        input.ticker

      );

    const searchResults =
      searchResponse.results ?? [];

    console.log(
      "Sentiment Search Results:",
      searchResults.length
    );

    // =====================================================
    // Extract
    // =====================================================

    const extracted =
      await extractSentiment(

        input.companyName,

        input.ticker,

        searchResults

      );

    console.log(
      "Sentiment Analysis Extracted"
    );

    // =====================================================
    // Final Object
    // =====================================================

    const result = {

      companyName:
        input.companyName,

      ticker:
        input.ticker,

      analystSentiment:
        extracted.analystSentiment ??
        "Neutral",

      investorSentiment:
        extracted.investorSentiment ??
        "Neutral",

      socialSentiment:
        extracted.socialSentiment ??
        "Neutral",

      overallSentiment:
        extracted.overallSentiment ??
        "Neutral",

      keyDrivers:
        extracted.keyDrivers ?? [],

      summary:
        extracted.summary ?? "",

      sources:
        getSources(
          searchResults
        ),

      confidence:
        extracted.confidence ??
        0.9,

    };

    console.log(
      "Sentiment Agent Completed"
    );

    // =====================================================
    // Validate
    // =====================================================

    return SentimentSchema.parse(
      result
    );

  }

  catch (error) {

    console.error(
      "Sentiment Agent Error:",
      error
    );

    throw new Error(
      "Failed to generate sentiment analysis."
    );

  }

}