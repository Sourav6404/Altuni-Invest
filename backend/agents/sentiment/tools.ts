import { search } from "../../services/search";

// ======================================================
// Search Sentiment
// ======================================================

export async function searchSentiment(
  companyName: string,
  ticker: string
) {

  const response =
    await search({

      query: `
        ${companyName}
        ${ticker}

        analyst ratings

        analyst upgrades

        analyst downgrades

        investor sentiment

        institutional investors

        retail investors

        Reddit sentiment

        Stocktwits sentiment

        X sentiment

        latest opinion
      `,

      maxResults: 10,

      searchDepth: "advanced",

      includeAnswer: true,

    });

  return response;

}

// ======================================================
// Sources
// ======================================================

export function getSources(
  searchResults: any[]
) {

  return searchResults
    .map(
      (result: any) => result.url
    )
    .filter(Boolean);

}