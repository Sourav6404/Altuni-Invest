import { search } from "../../services/search";
import { financialStatementAgent } from "../financialStatements/agent";

// ======================================================
// Search Valuation Information
// ======================================================

export async function searchValuation(
  companyName: string,
  ticker: string
) {

  const response =
    await search({

      query: `
        ${companyName}
        ${ticker}
        current stock price
        latest share price
        stock quote

        valuation

        PE ratio

        PEG ratio

        EV EBITDA

        price target

        intrinsic value

        analyst valuation

        fair value

        industry PE
      `,

      maxResults: 10,

      searchDepth: "advanced",

      includeAnswer: true,

    });

  return response;

}

// ======================================================
// Financial Metrics
// ======================================================

export async function getFinancialMetrics(
  companyName: string,
  ticker: string
) {

  const financial =
    await financialStatementAgent({

      companyName,

      ticker,

    });

  return {

    // ==========================================
    // Financial Statement Metrics
    // ==========================================

    revenue:
      financial.revenue?.[0]?.value ?? null,

    netIncome:
      financial.netIncome?.[0]?.value ?? null,

    eps:
      financial.eps?.[0]?.value ?? null,

    totalEquity:
      financial.totalEquity?.[0]?.value ?? null,

    totalDebt:
      financial.totalDebt?.[0]?.value ?? null,

    operatingCashFlow:
      financial.operatingCashFlow?.[0]?.value ?? null,

    freeCashFlow:
      financial.freeCashFlow?.[0]?.value ?? null,

    // ==========================================
    // Valuation Metrics
    // ==========================================

    marketCap:
      financial.marketCap,

    pe:
      financial.peRatio,

    peg:
      financial.pegRatio,

    priceToBook:
      financial.priceToBook,

    priceToSales:
      financial.priceToSales,

    evEbitda:
      financial.evToEbitda,

    analystTargetPrice:
      financial.analystTargetPrice,

    week52High:
      financial.week52High,

    week52Low:
      financial.week52Low,

    beta:
      financial.beta,

    dividendYield:
      financial.dividendYield,

    returnOnEquity:
      financial.returnOnEquity,

    returnOnAssets:
      financial.returnOnAssets,

    profitMargin:
      financial.profitMargin,

    operatingMargin:
      financial.operatingMargin,

    // ==========================================
    // Current Price
    // ==========================================

    currentPrice:
      financial.analystTargetPrice ??
      (financial.week52High && financial.week52Low ? (financial.week52High + financial.week52Low) / 2 : null),

    // ==========================================
    // Industry Comparison
    // (LLM will estimate using search results)
    // ==========================================

    industryPE: null,

  };

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