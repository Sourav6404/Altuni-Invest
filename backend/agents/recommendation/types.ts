import { CompanyProfile } from "../companyResearch/schema";

import { FinancialStatement } from "../financialStatements/schema";

import { CompetitorAnalysis } from "../competitor/schema";

import { MarketIndustry } from "../marketIndustry/schema";

import { NewsAnalysis } from "../news/schema";

import { Macroeconomic } from "../macroeconomic/schema";

import { SentimentAnalysis } from "../sentiment/schema";

import { Valuation } from "../valuation/schema";

import { RiskAnalysis } from "../risk/schema";

export interface RecommendationInput {

  companyResearch: CompanyProfile;

  financialStatements: FinancialStatement;

  competitors: CompetitorAnalysis;

  marketIndustry: MarketIndustry;

  news: NewsAnalysis;

  macroeconomic: Macroeconomic;

  sentiment: SentimentAnalysis;

  valuation: Valuation;

  risk: RiskAnalysis;

}