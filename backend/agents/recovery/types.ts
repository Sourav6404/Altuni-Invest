import { ZodTypeAny } from "zod";

export interface RecoveryInput<T = any> {
  /**
   * Company name.
   */
  companyName: string;

  /**
   * Current data (Company, Financials, Market, etc.)
   */
  profile: T;

  /**
   * Partial schema used to validate the recovered fields.
   *
   * Example:
   * CompanyProfileSchema.partial()
   * FinancialStatementSchema.partial()
   */
  parser: ZodTypeAny;

  /**
   * Prompt used for recovery.
   */
  prompt: string;

  /**
   * Search function specific to the agent.
   */
  searchFunction: (
    company: string,
    missingFields: readonly string[]
  ) => Promise<{
    results: any[];
  }>;
}