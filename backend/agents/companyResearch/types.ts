export interface CompanyResearchInput {
  companyName: string;
}

export interface CompanyProfile {
  // ==================================================
  // Basic Information
  // ==================================================

  companyName: string;

  ticker: string | null;

  exchange: string | null;

  industry: string | null;

  sector: string | null;

  founded: number | null;

  founders: string[];

  ceo: string | null;

  headquarters: string | null;

  website: string | null;

  investorRelations: string | null;

  // ==================================================
  // Business Information
  // ==================================================

  businessDescription: string | null;

  businessModel: string | null;

  products: string[];

  services: string[];

  operatingCountries: string[];

  // ==================================================
  // Investment Information
  // ==================================================

  employeeCount: number | null;

  marketCap: number | null;

  // ==================================================
  // Metadata
  // ==================================================

  sources: string[];

  confidence: number;

  missingFields: string[];
}