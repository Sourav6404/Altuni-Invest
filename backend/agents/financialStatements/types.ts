export interface FinancialStatementInput {
  /**
   * Official company name.
   *
   * Example:
   * NVIDIA Corporation
   */
  companyName: string;

  /**
   * Primary stock ticker.
   *
   * Example:
   * NVDA
   */
  ticker: string;
}