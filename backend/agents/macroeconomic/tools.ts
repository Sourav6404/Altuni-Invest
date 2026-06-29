import { search } from "../../services/search";

// ======================================================
// Search Macroeconomic Environment
// ======================================================

export async function searchMacroeconomic(
  companyName: string,
  ticker: string
) {

  const response =
    await search({

      query: `
        ${companyName}
        ${ticker}

        macroeconomic environment

        interest rates

        inflation

        GDP growth

        exchange rate

        central bank

        government policy

        economic outlook

        risks

        opportunities
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