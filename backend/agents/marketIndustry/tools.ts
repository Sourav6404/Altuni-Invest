import "dotenv/config";

import axios from "axios";

import { search } from "../../services/search";

// ======================================================
// Alpha Vantage
// ======================================================

const API_KEY =
  process.env.ALPHA_VANTAGE_API_KEY;

const BASE_URL =
  "https://www.alphavantage.co/query";

// ======================================================
// Company Overview
// ======================================================

export async function getCompanyOverview(
  ticker: string
) {

  const response =
    await axios.get(BASE_URL, {

      params: {

        function: "OVERVIEW",

        symbol: ticker,

        apikey: API_KEY,

      },

      timeout: 30000,

    });

  return response.data;

}

// ======================================================
// Search Market & Industry
// ======================================================

export async function searchMarketIndustry(
  companyName: string,
  ticker: string
) {

  const response =
    await search({

      query: `
        ${companyName}
        ${ticker}

        industry analysis

        market analysis

        market size

        CAGR

        industry trends

        government regulations

        opportunities

        risks

        future outlook
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
      (result: any) =>
        result.url
    )
    .filter(Boolean);

}