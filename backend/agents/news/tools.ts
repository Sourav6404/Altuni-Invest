import { search } from "../../services/search";

// ======================================================
// Search Latest News
// ======================================================

export async function searchNews(
  companyName: string,
  ticker: string
) {

  const response =
    await search({

      query: `
  ${companyName}
  ${ticker}
  latest company news
`,

      maxResults: 10,

      searchDepth: "advanced",

      includeAnswer: true,

    });

  return response;

}

// ======================================================
// Collect Sources
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