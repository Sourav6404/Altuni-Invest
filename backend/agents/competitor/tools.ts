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
// Sleep (Free API Limit)
// ======================================================

function sleep(ms: number) {

  return new Promise(
    resolve => setTimeout(resolve, ms)
  );

}

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
// Search Competitors
// ======================================================

export async function searchCompetitors(
  companyName: string,
  ticker: string
) {

  return search({

    query: `
      ${companyName}
      ${ticker}

      top competitors

      major competitors

      competitive landscape

      rivals

      market competitors
    `,

    maxResults: 10,

    searchDepth: "advanced",

    includeAnswer: true,

  });

}

// ======================================================
// Fetch All Competitor Details
// ======================================================

export async function enrichCompetitors(
  competitors: any[]
) {

  const enriched = [];

  for (const competitor of competitors) {

    if (!competitor.ticker) {

      enriched.push({

        ...competitor,

        industry: null,

        sector: null,

        marketCap: null,

        country: null,

      });

      continue;

    }

    try {

      const overview =
        await getCompanyOverview(
          competitor.ticker
        );

      enriched.push({

        ...competitor,

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

        country:
          overview.Country ?? null,

      });

    }

    catch {

      enriched.push({

        ...competitor,

        industry: null,

        sector: null,

        marketCap: null,

        country: null,

      });

    }

    await sleep(1200);

  }

  return enriched;

}