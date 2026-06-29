import {
  FinancialStatementSchema,
} from "./schema";

import { FinancialStatementInput } from "./types";

import { search } from "../../services/search";
import { gemini } from "../../lib/gemini";
import { extractJson } from "../../utils/extractJson";
import { recoverMissingFields } from "../recovery/agent";
import { RECOVERY_PROMPT } from "../recovery/prompt";

async function searchMissingFinancialFields(
  companyName: string,
  missingFields: readonly string[]
) {
  const query = `${companyName} financial statements ratios ${missingFields.join(" ")} latest values 2023 2024 2025`;
  return await search({
    query,
    maxResults: 5,
    searchDepth: "advanced",
  });
}

import {
  searchFinancialStatements,

  getCurrency,
  getFiscalYearEnd,

  getRevenue,
  getGrossProfit,
  getOperatingIncome,
  getNetIncome,
  getEPS,
  getDilutedEPS,

  getOperatingCashFlow,
  getFreeCashFlow,
  getCapitalExpenditure,

  getTotalAssets,
  getTotalLiabilities,
  getTotalEquity,
  getCashAndEquivalents,
  getTotalDebt,

  // ===============================
  // Valuation Metrics
  // ===============================

  getMarketCap,
  getPERatio,
  getPEGRatio,
  getPriceToBook,
  getPriceToSales,
  getEVToRevenue,
  getEVToEBITDA,
  getAnalystTargetPrice,
  get52WeekHigh,
  get52WeekLow,
  getBeta,
  getDividendYield,
  getReturnOnEquity,
  getReturnOnAssets,
  getProfitMargin,
  getOperatingMargin,

  calculateConfidence,
  getMissingFields,

} from "./tools";

export async function financialStatementAgent(
  input: FinancialStatementInput
) {

  try {

    // ============================================
    // Fetch Financial Data
    // ============================================

    let data: any = null;
    let useFallbackSearch = false;

    try {
      data = await searchFinancialStatements(
        input.companyName,
        input.ticker
      );
      
      const isRateLimited = (obj: any) => {
        if (!obj) return true;
        if (obj.Note || obj.Information || obj["Note"] || obj["Information"]) return true;
        if (obj["Error Message"]) return true;
        return false;
      };

      if (
        !data ||
        isRateLimited(data.overview) ||
        isRateLimited(data.income) ||
        isRateLimited(data.balance) ||
        isRateLimited(data.cashFlow) ||
        !data.overview.MarketCapitalization ||
        !data.income.annualReports || data.income.annualReports.length === 0 ||
        !data.balance.annualReports || data.balance.annualReports.length === 0 ||
        !data.cashFlow.annualReports || data.cashFlow.annualReports.length === 0
      ) {
        console.warn("[financialStatementAgent] Alpha Vantage data is incomplete or rate-limited. Falling back to Tavily + Gemini...");
        useFallbackSearch = true;
      }
    } catch (err) {
      console.warn("[financialStatementAgent] Alpha Vantage fetch failed. Falling back to Tavily + Gemini...", err);
      useFallbackSearch = true;
    }

    if (useFallbackSearch) {
      console.log(`[financialStatementAgent] Extracting financial metrics for ${input.companyName} (${input.ticker}) via Tavily search...`);
      
      const searchQuery = `${input.companyName} (${input.ticker}) stock price market cap PE ratio revenue operating cash flow gross profit balance sheet 52 week range dividend yield ROE ROA profit margin beta 2023 2024 2025 financial statements`;
      const searchResponse = await search({
        query: searchQuery,
        maxResults: 10,
        searchDepth: "advanced",
        includeAnswer: true,
      });

      const simplifiedResults = (searchResponse.results || []).slice(0, 8).map((r: any) => ({
        title: r.title,
        url: r.url,
        content: r.content?.slice(0, 600),
      }));

      const prompt = `You are a Senior Investment Research Analyst.
Your task is to extract real financial statements and valuation metrics for ${input.companyName} (${input.ticker}) from the search results below.

Return a JSON object exactly matching this structure (do not include markdown wrapping or explanation, just the raw JSON):
{
  "currency": "USD",
  "fiscalYearEnd": "December",
  "revenue": [{"year": 2023, "value": 211000000000}, ...],
  "grossProfit": [{"year": 2023, "value": 146000000000}, ...],
  "operatingIncome": [{"year": 2023, "value": 82000000000}, ...],
  "netIncome": [{"year": 2023, "value": 66000000000}, ...],
  "eps": [{"year": 2023, "value": 8.85}, ...],
  "dilutedEPS": [{"year": 2023, "value": 8.82}, ...],
  "operatingCashFlow": [{"year": 2023, "value": 87000000000}, ...],
  "freeCashFlow": [{"year": 2023, "value": 59000000000}, ...],
  "capitalExpenditure": [{"year": 2023, "value": 28000000000}, ...],
  "totalAssets": [{"year": 2024, "value": 470000000000}, ...],
  "totalLiabilities": [{"year": 2024, "value": 210000000000}, ...],
  "totalEquity": [{"year": 2024, "value": 260000000000}, ...],
  "cashAndEquivalents": [{"year": 2024, "value": 80000000000}, ...],
  "totalDebt": [{"year": 2024, "value": 100000000000}, ...],
  "marketCap": 3100000000000,
  "peRatio": 35.4,
  "pegRatio": 1.25,
  "priceToBook": 12.4,
  "priceToSales": 10.2,
  "evToRevenue": 10.5,
  "evToEbitda": 24.8,
  "analystTargetPrice": 460,
  "week52High": 450,
  "week52Low": 320,
  "beta": 1.12,
  "dividendYield": 0.0075,
  "returnOnEquity": 30.0,
  "returnOnAssets": 16.0,
  "profitMargin": 32.0,
  "operatingMargin": 40.0
}

Search Results:
${JSON.stringify(simplifiedResults, null, 2)}

Answer summary:
${searchResponse.answer || ""}

Rules:
1. Return ONLY the JSON object. No other text, no markdown block code formatting (no \`\`\`json etc.).
2. The values must be numbers, or null if unknown. Arrays must never be null (use [] if unknown).
3. Do not guess; use the figures present in the search results or answer summary.
4. Scale all large numbers properly (e.g., $15.5 Billion = 15500000000).
5. If there is no specific data for a field, use null (or [] for arrays).`;

      const response = await gemini.invoke(prompt);
      const extracted = extractJson(String(response.content));

      const profile: any = {
        companyName: input.companyName,
        ticker: input.ticker,
        currency: extracted.currency || "USD",
        fiscalYearEnd: extracted.fiscalYearEnd || "December",
        revenue: extracted.revenue || [],
        grossProfit: extracted.grossProfit || [],
        operatingIncome: extracted.operatingIncome || [],
        netIncome: extracted.netIncome || [],
        eps: extracted.eps || [],
        dilutedEPS: extracted.dilutedEPS || [],
        operatingCashFlow: extracted.operatingCashFlow || [],
        freeCashFlow: extracted.freeCashFlow || [],
        capitalExpenditure: extracted.capitalExpenditure || [],
        totalAssets: extracted.totalAssets || [],
        totalLiabilities: extracted.totalLiabilities || [],
        totalEquity: extracted.totalEquity || [],
        cashAndEquivalents: extracted.cashAndEquivalents || [],
        totalDebt: extracted.totalDebt || [],
        marketCap: typeof extracted.marketCap === "number" ? extracted.marketCap : null,
        peRatio: typeof extracted.peRatio === "number" ? extracted.peRatio : null,
        pegRatio: typeof extracted.pegRatio === "number" ? extracted.pegRatio : null,
        priceToBook: typeof extracted.priceToBook === "number" ? extracted.priceToBook : null,
        priceToSales: typeof extracted.priceToSales === "number" ? extracted.priceToSales : null,
        evToRevenue: typeof extracted.evToRevenue === "number" ? extracted.evToRevenue : null,
        evToEbitda: typeof extracted.evToEbitda === "number" ? extracted.evToEbitda : null,
        analystTargetPrice: typeof extracted.analystTargetPrice === "number" ? extracted.analystTargetPrice : null,
        week52High: typeof extracted.week52High === "number" ? extracted.week52High : null,
        week52Low: typeof extracted.week52Low === "number" ? extracted.week52Low : null,
        beta: typeof extracted.beta === "number" ? extracted.beta : null,
        dividendYield: typeof extracted.dividendYield === "number" ? extracted.dividendYield : null,
        returnOnEquity: typeof extracted.returnOnEquity === "number" ? extracted.returnOnEquity : null,
        returnOnAssets: typeof extracted.returnOnAssets === "number" ? extracted.returnOnAssets : null,
        profitMargin: typeof extracted.profitMargin === "number" ? extracted.profitMargin : null,
        operatingMargin: typeof extracted.operatingMargin === "number" ? extracted.operatingMargin : null,
        sources: (simplifiedResults || []).map((r: any) => r.url),
        confidence: 0.85,
        missingFields: [],
      };

      profile.confidence = calculateConfidence(profile);
      profile.missingFields = getMissingFields(profile);

      return FinancialStatementSchema.parse(profile);
    }

    // ============================================
    // Build Profile
    // ============================================

    const profile: any ={

      companyName:
        input.companyName,

      ticker:
        input.ticker,

      currency:
        getCurrency(
          data.overview
        ),

      fiscalYearEnd:
        getFiscalYearEnd(
          data.income?.annualReports
        ),

      // ==========================================
      // Income Statement
      // ==========================================

      revenue:
        getRevenue(
          data.income
        ),

      grossProfit:
        getGrossProfit(
          data.income
        ),

      operatingIncome:
        getOperatingIncome(
          data.income
        ),

      netIncome:
        getNetIncome(
          data.income
        ),

      eps:
        getEPS(
          data.income
        ),

      dilutedEPS:
        getDilutedEPS(
          data.income
        ),

      // ==========================================
      // Cash Flow
      // ==========================================

      operatingCashFlow:
        getOperatingCashFlow(
          data.cashFlow
        ),

      freeCashFlow:
        getFreeCashFlow(
          data.cashFlow
        ),

      capitalExpenditure:
        getCapitalExpenditure(
          data.cashFlow
        ),

      // ==========================================
      // Balance Sheet
      // ==========================================

      totalAssets:
        getTotalAssets(
          data.balance
        ),

      totalLiabilities:
        getTotalLiabilities(
          data.balance
        ),

      totalEquity:
        getTotalEquity(
          data.balance
        ),

      cashAndEquivalents:
        getCashAndEquivalents(
          data.balance
        ),

      totalDebt:
        getTotalDebt(
          data.balance
        ),
            // ==========================================
      // Valuation Metrics
      // ==========================================

      marketCap:
        getMarketCap(
          data.overview
        ),

      peRatio:
        getPERatio(
          data.overview
        ),

      pegRatio:
        getPEGRatio(
          data.overview
        ),

      priceToBook:
        getPriceToBook(
          data.overview
        ),

      priceToSales:
        getPriceToSales(
          data.overview
        ),

      evToRevenue:
        getEVToRevenue(
          data.overview
        ),

      evToEbitda:
        getEVToEBITDA(
          data.overview
        ),

      analystTargetPrice:
        getAnalystTargetPrice(
          data.overview
        ),

      week52High:
        get52WeekHigh(
          data.overview
        ),

      week52Low:
        get52WeekLow(
          data.overview
        ),

      beta:
        getBeta(
          data.overview
        ),

      dividendYield:
        getDividendYield(
          data.overview
        ),

      returnOnEquity:
        getReturnOnEquity(
          data.overview
        ),

      returnOnAssets:
        getReturnOnAssets(
          data.overview
        ),

      profitMargin:
        getProfitMargin(
          data.overview
        ),

      operatingMargin:
        getOperatingMargin(
          data.overview
        ),

      // ==========================================
      // Metadata
      // ==========================================

      sources: [

        "https://www.alphavantage.co/"

      ],

      confidence: 0,

      missingFields: [],

    };

    // ============================================
    // Confidence & Missing Fields Initial Run
    // ============================================

    profile.confidence =
      calculateConfidence(
        profile
      );

    profile.missingFields =
      getMissingFields(
        profile
      );

    // ============================================
    // Recover Missing Fields
    // ============================================

    const recoveredProfile = await recoverMissingFields({
      companyName: input.companyName,
      profile,
      parser: FinancialStatementSchema.partial(),
      prompt: RECOVERY_PROMPT,
      searchFunction: searchMissingFinancialFields,
    });

    console.log(
      "Financial Confidence (After Recovery):",
      recoveredProfile.confidence
    );

    console.log(
      "Remaining Missing (After Recovery):",
      recoveredProfile.missingFields
    );

    // ============================================
    // Validate
    // ============================================

    return FinancialStatementSchema.parse(
      recoveredProfile
    );

  } catch (error) {

    console.error(
      "Financial Statement Agent Error:",
      error
    );

    throw new Error(
      "Failed to generate financial statements."
    );

  }

}