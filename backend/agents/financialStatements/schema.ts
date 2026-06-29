import { z } from "zod";

/**
 * A financial value for a fiscal year.
 *
 * Example:
 * {
 *   year: 2025,
 *   value: 130497000000
 * }
 */
export const FinancialValueSchema = z.object({
  year: z.number(),
  value: z.number().nullable(),
});

export const FinancialStatementSchema = z.object({
  // ==========================================
  // Company Information
  // ==========================================

  companyName: z.string(),

  ticker: z.string(),

  currency: z.string().nullable(),

  fiscalYearEnd: z.string().nullable(),

  // ==========================================
  // Income Statement
  // ==========================================

  revenue: z.array(FinancialValueSchema),

  grossProfit: z.array(FinancialValueSchema),

  operatingIncome: z.array(FinancialValueSchema),

  netIncome: z.array(FinancialValueSchema),

  eps: z.array(FinancialValueSchema),

  dilutedEPS: z.array(FinancialValueSchema),

  // ==========================================
  // Cash Flow Statement
  // ==========================================

  operatingCashFlow: z.array(FinancialValueSchema),

  freeCashFlow: z.array(FinancialValueSchema),

  capitalExpenditure: z.array(FinancialValueSchema),

  // ==========================================
  // Balance Sheet
  // ==========================================

  totalAssets: z.array(FinancialValueSchema),

  totalLiabilities: z.array(FinancialValueSchema),

  totalEquity: z.array(FinancialValueSchema),

  cashAndEquivalents: z.array(FinancialValueSchema),

  totalDebt: z.array(FinancialValueSchema),
  marketCap: z.number().nullable(),

peRatio: z.number().nullable(),

pegRatio: z.number().nullable(),

priceToBook: z.number().nullable(),

priceToSales: z.number().nullable(),

evToRevenue: z.number().nullable(),

evToEbitda: z.number().nullable(),

analystTargetPrice: z.number().nullable(),

week52High: z.number().nullable(),

week52Low: z.number().nullable(),

beta: z.number().nullable(),

dividendYield: z.number().nullable(),

returnOnEquity: z.number().nullable(),

returnOnAssets: z.number().nullable(),

profitMargin: z.number().nullable(),

operatingMargin: z.number().nullable(),
  // ==========================================
  // Metadata
  // ==========================================

  sources: z.array(z.string()),

  confidence: z.number().min(0).max(1).default(1),

  missingFields: z.array(z.string()).default([]),
});

export type FinancialStatement = z.infer<
  typeof FinancialStatementSchema
>;

export type FinancialValue = z.infer<
  typeof FinancialValueSchema
>;