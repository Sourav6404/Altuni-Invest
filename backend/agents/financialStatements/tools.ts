import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// ======================================================
// Alpha Vantage API
// ======================================================

const API_KEY =
  process.env.ALPHA_VANTAGE_API_KEY;
console.log("API KEY:", API_KEY);

const BASE_URL =
  "https://www.alphavantage.co/query";

// ======================================================
// Financial Value
// ======================================================

export interface FinancialValue {
  year: number;
  value: number | null;
}

// ======================================================
// Raw API Result
// ======================================================

export interface FinancialApiResult {

  overview: any;

  income: any;

  balance: any;

  cashFlow: any;

}

// ======================================================
// Fetch Helper
// ======================================================

async function fetchEndpoint(
  params: Record<string, string>
) {

  const response =
    await axios.get(BASE_URL, {

      params: {

        ...params,

        apikey: API_KEY,

      },

      timeout: 30000,

    });

  return response.data;

}

// ======================================================
// Convert String -> Number
// ======================================================

function toNumber(
  value: any
): number | null {

  if (
    value === undefined ||
    value === null ||
    value === "" ||
    value === "None"
  ) {

    return null;

  }

  const parsed =
    Number(value);

  return Number.isNaN(parsed)
    ? null
    : parsed;

}

// ======================================================
// Convert Fiscal Date -> Year
// ======================================================

function getYear(
  date: string
): number {

  return Number(
    date.substring(0, 4)
  );

}// ======================================================
// Fetch Company Overview
// ======================================================

async function fetchOverview(
  ticker: string
) {

  return fetchEndpoint({

    function: "OVERVIEW",

    symbol: ticker,

  });

}

// ======================================================
// Fetch Income Statement
// ======================================================

async function fetchIncomeStatement(
  ticker: string
) {

  return fetchEndpoint({

    function: "INCOME_STATEMENT",

    symbol: ticker,

  });

}

// ======================================================
// Fetch Balance Sheet
// ======================================================

async function fetchBalanceSheet(
  ticker: string
) {

  return fetchEndpoint({

    function: "BALANCE_SHEET",

    symbol: ticker,

  });

}

// ======================================================
// Fetch Cash Flow
// ======================================================

async function fetchCashFlow(
  ticker: string
) {

  return fetchEndpoint({

    function: "CASH_FLOW",

    symbol: ticker,

  });

}

// ======================================================
// Fetch Everything
// ======================================================

export async function searchFinancialStatements(
  companyName: string,
  ticker: string
): Promise<FinancialApiResult> {

  console.log(
    `Fetching financial statements for ${companyName} (${ticker})`
  );

  function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const overview = await fetchOverview(ticker);

await sleep(1200);

const income = await fetchIncomeStatement(ticker);

await sleep(1200);

const balance = await fetchBalanceSheet(ticker);

await sleep(1200);

const cashFlow = await fetchCashFlow(ticker);
  console.log("Overview Response:");
  console.dir(overview, { depth: null });

  console.log("Income Response:");
  console.dir(income, { depth: null });

  console.log("Balance Response:");
  console.dir(balance, { depth: null });

  console.log("Cash Flow Response:");
  console.dir(cashFlow, { depth: null });

  console.log("Overview:", !!overview);

  console.log(
    "Income Reports:",
    income?.annualReports?.length ?? 0
  );

  console.log(
    "Balance Reports:",
    balance?.annualReports?.length ?? 0
  );

  console.log(
    "Cash Flow Reports:",
    cashFlow?.annualReports?.length ?? 0
  );

  return {

    overview,

    income,

    balance,

    cashFlow,

  };

}
// ======================================================
// Convert Annual Reports -> FinancialValue[]
// ======================================================

export function mapFinancialValues(
  reports: any[] = [],
  field: string
): FinancialValue[] {

  return reports
    .slice(0, 5)
    .map((report) => ({

      year: getYear(
        report.fiscalDateEnding
      ),

      value: toNumber(
        report[field]
      ),

    }))
    .filter(
      (item) =>
        item.value !== null
    );

}

// ======================================================
// Company Information
// ======================================================

export function getCurrency(
  overview: any
): string | null {

  return (
    overview?.Currency ??
    null
  );

}

export function getFiscalYearEnd(
  reports: any[] = []
): string | null {

  if (
    reports.length === 0
  ) {

    return null;

  }

  return (
    reports[0]
      ?.fiscalDateEnding ??
    null
  );

}
// ======================================================
// Valuation Metrics
// ======================================================

export function getMarketCap(
  overview: any
): number | null {

  return toNumber(
    overview?.MarketCapitalization
  );

}

export function getPERatio(
  overview: any
): number | null {

  return toNumber(
    overview?.PERatio
  );

}

export function getPEGRatio(
  overview: any
): number | null {

  return toNumber(
    overview?.PEGRatio
  );

}

export function getPriceToBook(
  overview: any
): number | null {

  return toNumber(
    overview?.PriceToBookRatio
  );

}

export function getPriceToSales(
  overview: any
): number | null {

  return toNumber(
    overview?.PriceToSalesRatioTTM
  );

}

export function getEVToRevenue(
  overview: any
): number | null {

  return toNumber(
    overview?.EVToRevenue
  );

}

export function getEVToEBITDA(
  overview: any
): number | null {

  return toNumber(
    overview?.EVToEBITDA
  );

}

export function getAnalystTargetPrice(
  overview: any
): number | null {

  return toNumber(
    overview?.AnalystTargetPrice
  );

}

export function get52WeekHigh(
  overview: any
): number | null {

  return toNumber(
    overview?.["52WeekHigh"]
  );

}

export function get52WeekLow(
  overview: any
): number | null {

  return toNumber(
    overview?.["52WeekLow"]
  );

}

export function getBeta(
  overview: any
): number | null {

  return toNumber(
    overview?.Beta
  );

}

export function getDividendYield(
  overview: any
): number | null {

  return toNumber(
    overview?.DividendYield
  );

}

export function getReturnOnEquity(
  overview: any
): number | null {

  return toNumber(
    overview?.ReturnOnEquityTTM
  );

}

export function getReturnOnAssets(
  overview: any
): number | null {

  return toNumber(
    overview?.ReturnOnAssetsTTM
  );

}

export function getProfitMargin(
  overview: any
): number | null {

  return toNumber(
    overview?.ProfitMargin
  );

}

export function getOperatingMargin(
  overview: any
): number | null {

  return toNumber(
    overview?.OperatingMarginTTM
  );

}

// ======================================================
// Income Statement
// ======================================================

export function getRevenue(
  income: any
) {

  return mapFinancialValues(
    income?.annualReports,
    "totalRevenue"
  );

}

export function getGrossProfit(
  income: any
) {

  return mapFinancialValues(
    income?.annualReports,
    "grossProfit"
  );

}

export function getOperatingIncome(
  income: any
) {

  return mapFinancialValues(
    income?.annualReports,
    "operatingIncome"
  );

}

export function getNetIncome(
  income: any
) {

  return mapFinancialValues(
    income?.annualReports,
    "netIncome"
  );

}

export function getEPS(
  income: any
) {

  return mapFinancialValues(
    income?.annualReports,
    "reportedEPS"
  );

}

export function getDilutedEPS(
  income: any
) {

  return mapFinancialValues(
    income?.annualReports,
    "reportedEPS"
  );

}
// ======================================================
// Cash Flow Statement
// ======================================================

export function getOperatingCashFlow(
  cashFlow: any
) {

  return mapFinancialValues(
    cashFlow?.annualReports,
    "operatingCashflow"
  );

}

export function getCapitalExpenditure(
  cashFlow: any
) {

  return mapFinancialValues(
    cashFlow?.annualReports,
    "capitalExpenditures"
  );

}

export function getFreeCashFlow(
  cashFlow: any
) {

  const reports =
    cashFlow?.annualReports ?? [];

  return reports
    .slice(0, 5)
    .map((report: any) => {

      const operating =
        toNumber(
          report.operatingCashflow
        );

      const capex =
        toNumber(
          report.capitalExpenditures
        );

      return {

        year: getYear(
          report.fiscalDateEnding
        ),

        value:
          operating !== null &&
          capex !== null
            ? operating - Math.abs(capex)
            : null,

      };

    })
    .filter((item: FinancialValue) => item.value !== null);

}

// ======================================================
// Balance Sheet
// ======================================================

export function getTotalAssets(
  balance: any
) {

  return mapFinancialValues(
    balance?.annualReports,
    "totalAssets"
  );

}

export function getTotalLiabilities(
  balance: any
) {

  return mapFinancialValues(
    balance?.annualReports,
    "totalLiabilities"
  );

}

export function getTotalEquity(
  balance: any
) {

  return mapFinancialValues(
    balance?.annualReports,
    "totalShareholderEquity"
  );

}

export function getCashAndEquivalents(
  balance: any
) {

  return mapFinancialValues(
    balance?.annualReports,
    "cashAndCashEquivalentsAtCarryingValue"
  );

}

export function getTotalDebt(
  balance: any
) {

  const reports =
    balance?.annualReports ?? [];

  return reports
    .slice(0, 5)
    .map((report: any) => {

      const shortDebt =
        toNumber(
          report.shortLongTermDebtTotal
        ) ?? 0;

      const longDebt =
        toNumber(
          report.longTermDebt
        ) ?? 0;

      return {

        year: getYear(
          report.fiscalDateEnding
        ),

        value:
          shortDebt + longDebt,

      };

    });

}

// ======================================================
// Confidence
// ======================================================

export function calculateConfidence(
  profile: any
): number {

  const excluded = new Set([
    "companyName",
    "ticker",
    "sources",
    "confidence",
    "missingFields",
  ]);

  const keys =
    Object.keys(profile).filter(
      (key) =>
        !excluded.has(key)
    );

  const completed =
    keys.filter((key) => {

      const value =
        profile[key];

      if (
        value === null ||
        value === undefined
      ) {

        return false;

      }

      if (
        Array.isArray(value)
      ) {

        return value.length > 0;

      }

      return true;

    }).length;

  return Number(
    (
      completed /
      keys.length
    ).toFixed(2)
  );

}

// ======================================================
// Missing Fields
// ======================================================

export function getMissingFields(
  profile: any
): string[] {

  const excluded = new Set([
    "companyName",
    "ticker",
    "sources",
    "confidence",
    "missingFields",
  ]);

  return Object.keys(profile).filter(
    (key) => {

      if (
        excluded.has(key)
      ) {

        return false;

      }

      const value =
        profile[key];

      if (
        value === null ||
        value === undefined
      ) {

        return true;

      }

      if (
        Array.isArray(value)
      ) {

        return value.length === 0;

      }

      return false;

    }
  );

}