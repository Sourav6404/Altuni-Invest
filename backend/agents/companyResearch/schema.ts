import { z } from "zod";

export const CompanyProfileSchema = z.object({

  // ==================================================
  // Basic Information
  // ==================================================

  /**
   * Official registered company name.
   */
  companyName: z.string(),

  /**
   * Primary stock ticker.
   * Example: NVDA
   */
  ticker: z.string().nullable(),

  /**
   * Primary stock exchange.
   * Example: NASDAQ
   */
  exchange: z.string().nullable(),

  /**
   * Official industry.
   */
  industry: z.string().nullable(),

  /**
   * Official business sector.
   */
  sector: z.string().nullable(),

  /**
   * Company founding year.
   * Example: 1993
   */
  founded: z.number().nullable(),

  /**
   * Company founders.
   */
  founders: z.array(z.string()),

  /**
   * Current Chief Executive Officer.
   */
  ceo: z.string().nullable(),

  /**
   * Headquarters.
   * Format:
   * City, State/Province, Country
   */
  headquarters: z.string().nullable(),

  /**
   * Official company website.
   */
  website: z.string().nullable(),

  /**
   * Official Investor Relations website.
   */
  investorRelations: z.string().nullable(),

  // ==================================================
  // Business Information
  // ==================================================

  /**
   * Short company overview.
   */
  businessDescription: z.string().nullable(),

  /**
   * How the company generates revenue.
   */
  businessModel: z.string().nullable(),

  /**
   * Major products.
   */
  products: z.array(z.string()),

  /**
   * Major services.
   */
  services: z.array(z.string()),

  /**
   * Countries where the company has
   * significant business operations.
   */
  operatingCountries: z.array(z.string()),

  // ==================================================
  // Investment Information
  // ==================================================

  /**
   * Latest reported full-time employees.
   */
  employeeCount: z.number().nullable(),

  /**
   * Latest market capitalization in USD.
   *
   * Example:
   * 4200000000000
   */
  marketCap: z.number().nullable(),

  // ==================================================
  // Metadata
  // ==================================================

  /**
   * URLs actually used to build the profile.
   */
  sources: z.array(z.string()),

  /**
   * Confidence score.
   * Range:
   * 0.0 - 1.0
   */
  confidence: z.preprocess(
    (val) => {
      const num = Number(val);
      return num > 1 ? num / 100 : num;
    },
    z.number().min(0).max(1).default(0)
  ),

  /**
   * Fields that remain unavailable after
   * recovery.
   */
  missingFields: z.array(z.string()).default([]),

});

export type CompanyProfile =
  z.infer<typeof CompanyProfileSchema>;