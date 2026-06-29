import { search } from "../../services/search";

// ======================================================
// Initial Company Search
// ======================================================

export async function searchCompanyInformation(
  company: string
) {
  return await search({
    query: `
${company}
official website
about us
company overview
company profile
investor relations
annual report
SEC filing
Yahoo Finance
Nasdaq
CompaniesMarketCap
products
services
business model
revenue segments
CEO
founders
headquarters
employee count
stock exchange
`,
    maxResults: 12,
    searchDepth: "advanced",
    includeAnswer: true,
  });
}

// ======================================================
// Recovery Search
// ======================================================

export async function searchMissingFields(
  company: string,
  missingFields: readonly string[]
) {
  const searches = [];

  for (const field of missingFields) {

    switch (field) {

      // ======================================================
      // Company Information
      // ======================================================

      case "companyName":

        searches.push(
          search({
            query: `${company} official company name`,
            maxResults: 3,
            searchDepth: "advanced",
          })
        );

        break;

      case "industry":

        searches.push(
          search({
            query: `${company} industry Yahoo Finance`,
            maxResults: 3,
            searchDepth: "advanced",
          })
        );

        break;

      case "sector":

        searches.push(
          search({
            query: `${company} sector Yahoo Finance Nasdaq`,
            maxResults: 3,
            searchDepth: "advanced",
          })
        );

        break;

      case "website":

        searches.push(
          search({
            query: `${company} official website homepage`,
            maxResults: 3,
            searchDepth: "advanced",
          })
        );

        break;

      case "investorRelations":

        searches.push(
          search({
            query: `${company} investor relations official`,
            maxResults: 3,
            searchDepth: "advanced",
          })
        );

        break;
              // ======================================================
      // Leadership
      // ======================================================

      case "ceo":

        searches.push(
          search({
            query: `${company} current CEO official leadership`,
            maxResults: 3,
            searchDepth: "advanced",
          })
        );

        break;

      case "founders":

        searches.push(
          search({
            query: `${company} founders company history official`,
            maxResults: 3,
            searchDepth: "advanced",
          })
        );

        break;

      case "founded":

        searches.push(
          search({
            query: `${company} founded year company history`,
            maxResults: 3,
            searchDepth: "advanced",
          })
        );

        break;

      // ======================================================
      // Financial Information
      // ======================================================

      case "ticker":

        searches.push(
          search({
            query: `${company} stock ticker Nasdaq Yahoo Finance`,
            maxResults: 3,
            searchDepth: "advanced",
          })
        );

        break;

      case "exchange":

        searches.push(
          search({
            query: `${company} ticker exchange Yahoo Finance Nasdaq official listing`,
            maxResults: 5,
            searchDepth: "advanced",
          })
        );

        break;

      case "marketCap":

        searches.push(
          search({
            query: `${company} market cap CompaniesMarketCap Yahoo Finance Nasdaq`,
            maxResults: 3,
            searchDepth: "advanced",
          })
        );

        break;

      case "employeeCount":

        searches.push(
          search({
            query: `${company} employee count workforce latest annual report`,
            maxResults: 3,
            searchDepth: "advanced",
          })
        );

        break;
              // ======================================================
      // Business Information
      // ======================================================

      case "businessDescription":

        searches.push(
    search({
      query: `${company} official company overview about us company profile official website`,
      maxResults: 5,
      searchDepth: "advanced",
    })
  );

        break;

      case "businessModel":

          searches.push(
    search({
      query: `${company} revenue segments business model annual report how does ${company} make money`,
      maxResults: 5,
      searchDepth: "advanced",
    })
  );

        break;

      case "products":

        searches.push(
          search({
            query: `${company} products product portfolio official`,
            maxResults: 3,
            searchDepth: "advanced",
          })
        );

        break;

      case "services":

         searches.push(
    search({
      query: `
        ${company}
        AI Enterprise
        DGX Cloud
        Omniverse Cloud
        NIM
        cloud services
        developer services
        enterprise software
        official
      `,
      maxResults: 5,
      searchDepth: "advanced",
    })
  );

        break;

      // ======================================================
      // Geography
      // ======================================================

      case "headquarters":

        searches.push(
          search({
            query: `${company} headquarters official`,
            maxResults: 3,
            searchDepth: "advanced",
          })
        );

        break;

      case "operatingCountries":

        searches.push(
          search({
            query: `${company} global offices worldwide locations countries official`,
            maxResults: 3,
            searchDepth: "advanced",
          })
        );

        break;
              // ======================================================
      // Default
      // ======================================================

      default:
        break;
    }
  }

  // ======================================================
  // Execute Searches
  // ======================================================

  const responses = await Promise.all(searches);

  // ======================================================
  // Merge Results
  // ======================================================

  const mergedResults = responses.flatMap(
    (response: any) => response.results ?? []
  );

  // ======================================================
  // Remove Empty Results
  // ======================================================

  const filteredResults = mergedResults.filter(
    (result: any) =>
      result &&
      result.url &&
      result.title
  );

  // ======================================================
  // Return Results
  // ======================================================

  return {
    results: filteredResults,
  };
}