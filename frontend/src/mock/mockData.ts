// Altuni Invest - Premium Multi-Agent Research Platform Mock Data Engine
// Based on actual schemas used in Altuni Invest Backend

export interface CompanyProfile {
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
  businessDescription: string | null;
  businessModel: string | null;
  products: string[];
  services: string[];
  operatingCountries: string[];
  employeeCount: number | null;
  marketCap: number | null;
  sources: string[];
  confidence: number;
}

export interface FinancialValue {
  year: number;
  value: number | null;
}

export interface FinancialStatement {
  companyName: string;
  ticker: string;
  currency: string | null;
  fiscalYearEnd: string | null;
  revenue: FinancialValue[];
  grossProfit: FinancialValue[];
  operatingIncome: FinancialValue[];
  netIncome: FinancialValue[];
  eps: FinancialValue[];
  dilutedEPS: FinancialValue[];
  operatingCashFlow: FinancialValue[];
  freeCashFlow: FinancialValue[];
  capitalExpenditure: FinancialValue[];
  totalAssets: FinancialValue[];
  totalLiabilities: FinancialValue[];
  totalEquity: FinancialValue[];
  cashAndEquivalents: FinancialValue[];
  totalDebt: FinancialValue[];
  marketCap: number | null;
  peRatio: number | null;
  pegRatio: number | null;
  priceToBook: number | null;
  priceToSales: number | null;
  evToRevenue: number | null;
  evToEbitda: number | null;
  analystTargetPrice: number | null;
  week52High: number | null;
  week52Low: number | null;
  beta: number | null;
  dividendYield: number | null;
  returnOnEquity: number | null;
  returnOnAssets: number | null;
  profitMargin: number | null;
  operatingMargin: number | null;
  sources: string[];
  confidence: number;
}

export interface Competitor {
  companyName: string;
  ticker: string | null;
  industry: string | null;
  sector: string | null;
  marketCap: number | null;
  country: string | null;
  competitionType: "Direct" | "Indirect" | "Emerging";
  reason: string;
  score: number; // custom extension for dashboard benchmark
}

export interface CompetitorAnalysis {
  companyName: string;
  ticker: string;
  industry: string | null;
  sector: string | null;
  marketCap: number | null;
  competitors: Competitor[];
  sources: string[];
  confidence: number;
  keyMoat: string;
}


export interface MarketIndustryAnalysis {
  companyName: string;
  ticker: string;
  industry?: string;
  sector?: string;
  marketSizeForecast: string;
  forecastYear: string;
  keyTrend: string;
  industryDrivers: string[];
  regulatoryRisks: string[];
  porterForces: {
    rivalry: number;
    substitutes: number;
    newEntrants: number;
    supplierPower: number;
    buyerPower: number;
  };
  growthHistory: { year: string; size: number }[];
  sources: string[];
  confidence: number;
  growthRate?: string | null;
  marketSize?: string | null;
  industryLifecycle?: string;
  futureOutlook?: string;
  risks?: string[];
  opportunities?: string[];
  summary?: string;
  industryCAGR?: string;
  marketSizeCurrent?: string;
}

export interface NewsArticle {
  headline: string;
  source: string;
  date: string;
  sentiment: "Positive" | "Neutral" | "Negative";
  importance: "High" | "Medium" | "Low";
  impact: string;
  category: string;
  url: string;
  summary?: string;
}

export interface NewsAnalysis {
  companyName: string;
  ticker: string;
  sentimentBreakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
  overallSentiment: "Bullish" | "Bearish" | "Neutral" | "Positive" | "Negative" | "Very Positive" | "Very Negative";
  sentimentScore?: number;
  volumeTrending?: "High" | "Normal" | "Low";
  articles?: NewsArticle[];
  sources: string[];
  confidence: number;
  latestHeadlines?: NewsArticle[];
  news?: any[];
  summary?: string;
  keyTakeaways?: string[];
}

export interface MacroeconomicAnalysis {
  companyName: string;
  ticker: string;
  interestRates: any;
  inflation: any;
  gdpGrowth: any;
  exchangeRates: any;
  macroScore: number;
  outlook: "Bullish" | "Neutral" | "Bearish" | "Cautious";
  gdpTrend: { year: string; value: number }[];
  interestRateHistory: { year: string; rate: number }[];
  inflationHistory: { year: string; rate: number }[];
  governmentPolicies: string[];
  macroRisks: string[];
  sources: string[];
  confidence: number;
  overallImpact?: "Very Positive" | "Positive" | "Neutral" | "Negative" | "Very Negative";
  governmentPolicy?: string[];
  macroeconomicRisks?: string[];
  opportunities?: string[];
  summary?: string;
}

export interface SentimentAnalysis {
  companyName: string;
  ticker: string;
  overallSentiment: "Very Positive" | "Positive" | "Neutral" | "Negative" | "Very Negative";
  analystSentiment: "Positive" | "Neutral" | "Negative";
  socialSentiment: "Very Positive" | "Positive" | "Neutral" | "Negative";
  redditBullishPct: number;
  twitterBullishPct: number;
  stocktwitsBullishPct: number;
  analystRatings: { buy: number; hold: number; sell: number };
  sentimentTimeline: { date: string; score: number }[];
  sources: string[];
  confidence: number;
  summary?: string;
  keyDrivers?: string[];
  investorSentiment?: string;
}

export interface Valuation {
  companyName: string;
  ticker: string;
  currentPrice: number | null;
  intrinsicValue: number | null;
  valuation: "Undervalued" | "Fairly Valued" | "Overvalued";
  upside: number;
  downside: number;
  metrics: {
    pe: number | null;
    industryPE: number | null;
    peg: number | null;
    priceToBook: number | null;
    priceToSales: number | null;
    evEbitda: number | null;
  };
  valuationSummary: string;
  dcfModel: {
    terminalGrowthRate: number;
    wacc: number;
    years: { year: number; cashFlow: number; discountedCF: number }[];
  };
  comparableMoat: { name: string; ticker: string; pe: number; ps: number; pb: number }[];
  confidence: number;
  sources: string[];
}

export interface RiskAnalysis {
  companyName: string;
  ticker: string;
  businessRisk: "Low" | "Moderate" | "High" | "Very High";
  financialRisk: "Low" | "Moderate" | "High" | "Very High";
  competitiveRisk: "Low" | "Moderate" | "High" | "Very High";
  marketRisk: "Low" | "Moderate" | "High" | "Very High";
  macroeconomicRisk: "Low" | "Moderate" | "High" | "Very High";
  regulatoryRisk: "Low" | "Moderate" | "High" | "Very High";
  valuationRisk: "Low" | "Moderate" | "High" | "Very High";
  sentimentRisk: "Low" | "Moderate" | "High" | "Very High";
  overallRiskScore: number;
  riskLevel: "Low" | "Moderate" | "High" | "Very High";
  topRisks: string[];
  mitigatingFactors: string[];
  summary: string;
  confidence: number;
  sources?: string[];
}

export interface Recommendation {
  companyName: string;
  ticker: string;
  recommendation: "Strong Buy" | "Buy" | "Hold" | "Sell" | "Strong Sell";
  investmentScore: number;
  conviction: "Very High" | "High" | "Medium" | "Low";
  expectedReturn: string;
  targetPrice: number | null;
  stopLoss: number | null;
  riskRewardRatio: string;
  timeHorizon: "Short Term" | "Medium Term" | "Long Term";
  bullCase: string[];
  bearCase: string[];
  keyCatalysts: string[];
  watchItems: string[];
  investmentThesis: string;
  executiveSummary: string;
  confidence: number;
}

export interface PlatformReport {
  _id?: string;
  companyResearch: CompanyProfile;
  financialStatements: FinancialStatement;
  competitors: CompetitorAnalysis;
  marketIndustry: MarketIndustryAnalysis;
  news: NewsAnalysis;
  macroeconomic: MacroeconomicAnalysis;
  sentiment: SentimentAnalysis;
  valuation: Valuation;
  risk: RiskAnalysis;
  recommendation: Recommendation;
  createdAt?: string;
}

// Helper to calculate simple deterministic hash from string to seed mock values
export function stringHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

// Generate deterministically random value within a range using a seed
export function seedRandom(seedNum: number, min: number, max: number): number {
  const x = Math.sin(seedNum) * 10000;
  const rand = x - Math.floor(x);
  return min + rand * (max - min);
}

// Generate deterministic array elements
function seedSelect<T>(seedNum: number, arr: T[], count = 1): T[] {
  const result: T[] = [];
  const copied = [...arr];
  let localSeed = seedNum;
  for (let i = 0; i < Math.min(count, arr.length); i++) {
    localSeed += 13;
    const index = Math.floor(seedRandom(localSeed, 0, copied.length));
    result.push(copied.splice(index, 1)[0]);
  }
  return result;
}

export const PRESET_COMPANIES = ["NVDA", "AAPL", "MSFT", "TSLA", "AMZN"];

export const NVIDIA_DATA: PlatformReport = {
  companyResearch: {
    companyName: "NVIDIA Corporation",
    ticker: "NVDA",
    exchange: "NASDAQ",
    industry: "Semiconductors & Semiconductor Equipment",
    sector: "Technology",
    founded: 1993,
    founders: ["Jensen Huang", "Chris Malachowsky", "Curtis Priem"],
    ceo: "Jensen Huang",
    headquarters: "Santa Clara, California, USA",
    website: "https://www.nvidia.com",
    investorRelations: "https://investor.nvidia.com",
    businessDescription: "NVIDIA Corporation designs and develops graphics processing units (GPUs), central processing units (CPUs), and system-on-a-chip units (SoCs) for the gaming, professional visualization, data center, and automotive markets. The company's hardware is paired with its proprietary CUDA software architecture, creating a powerful, full-stack computing platform that has become the foundational engine for deep learning and modern generative artificial intelligence globally.",
    businessModel: "NVIDIA generates revenue through two primary segments: Compute & Networking (including Data Center AI platforms like Hopper H100 and Blackwell B200, networking cards, automotive AI systems, and enterprise software NIM) and Graphics (GeForce GPUs for gaming, workstation GPUs, and Omniverse systems). Their competitive edge relies on hardware-software co-design, which locks developers into the CUDA programming model.",
    products: ["GeForce RTX GPUs", "NVIDIA Hopper H100/H200", "NVIDIA Blackwell B200", "NVIDIA Grace Hopper Superchip", "Mellanox InfiniBand"],
    services: ["NVIDIA DGX Cloud", "NVIDIA AI Enterprise Software", "Omniverse Cloud Developer Platform", "NIM (NVIDIA Inference Microservices)"],
    operatingCountries: ["United States", "Taiwan", "China", "Germany", "Israel", "Japan", "United Kingdom", "South Korea"],
    employeeCount: 29600,
    marketCap: 3700000000000,
    sources: [
      "https://investor.nvidia.com/financial-info/sec-filings/",
      "https://www.sec.gov/cgi-bin/browse-edgar?CIK=1045810",
      "https://finance.yahoo.com/quote/NVDA/"
    ],
    confidence: 0.95
  },
  financialStatements: {
    companyName: "NVIDIA Corporation",
    ticker: "NVDA",
    currency: "USD",
    fiscalYearEnd: "January",
    revenue: [
      { year: 2021, value: 16675000000 },
      { year: 2022, value: 26914000000 },
      { year: 2023, value: 26974000000 },
      { year: 2024, value: 60922000000 },
      { year: 2025, value: 96300000000 }
    ],
    grossProfit: [
      { year: 2021, value: 10396000000 },
      { year: 2022, value: 17475000000 },
      { year: 2023, value: 15356000000 },
      { year: 2024, value: 44301000000 },
      { year: 2025, value: 72200000000 }
    ],
    operatingIncome: [
      { year: 2021, value: 4532000000 },
      { year: 2022, value: 9024000000 },
      { year: 2023, value: 4224000000 },
      { year: 2024, value: 32972000000 },
      { year: 2025, value: 54900000000 }
    ],
    netIncome: [
      { year: 2021, value: 4332000000 },
      { year: 2022, value: 9752000000 },
      { year: 2023, value: 4368000000 },
      { year: 2024, value: 29760000000 },
      { year: 2025, value: 49100000000 }
    ],
    eps: [
      { year: 2021, value: 1.76 },
      { year: 2022, value: 3.91 },
      { year: 2023, value: 1.76 },
      { year: 2024, value: 12.07 },
      { year: 2025, value: 19.80 }
    ],
    dilutedEPS: [
      { year: 2021, value: 1.73 },
      { year: 2022, value: 3.85 },
      { year: 2023, value: 1.74 },
      { year: 2024, value: 11.93 },
      { year: 2025, value: 19.55 }
    ],
    operatingCashFlow: [
      { year: 2021, value: 5822000000 },
      { year: 2022, value: 9108000000 },
      { year: 2023, value: 5641000000 },
      { year: 2024, value: 28090000000 },
      { year: 2025, value: 51200000000 }
    ],
    freeCashFlow: [
      { year: 2021, value: 4694000000 },
      { year: 2022, value: 8128000000 },
      { year: 2023, value: 3808000000 },
      { year: 2024, value: 27022000000 },
      { year: 2025, value: 48500000000 }
    ],
    capitalExpenditure: [
      { year: 2021, value: 1128000000 },
      { year: 2022, value: 980000000 },
      { year: 2023, value: 1833000000 },
      { year: 2024, value: 1068000000 },
      { year: 2025, value: 2700000000 }
    ],
    totalAssets: [
      { year: 2021, value: 28791000000 },
      { year: 2022, value: 44187000000 },
      { year: 2023, value: 41182000000 },
      { year: 2024, value: 65728000000 },
      { year: 2025, value: 98400000000 }
    ],
    totalLiabilities: [
      { year: 2021, value: 11883000000 },
      { year: 2022, value: 17575000000 },
      { year: 2023, value: 19081000000 },
      { year: 2024, value: 22750000000 },
      { year: 2025, value: 29800000000 }
    ],
    totalEquity: [
      { year: 2021, value: 16908000000 },
      { year: 2022, value: 26612000000 },
      { year: 2023, value: 22101000000 },
      { year: 2024, value: 42978000000 },
      { year: 2025, value: 68600000000 }
    ],
    cashAndEquivalents: [
      { year: 2021, value: 11561000000 },
      { year: 2022, value: 21208000000 },
      { year: 2023, value: 13296000000 },
      { year: 2024, value: 25984000000 },
      { year: 2025, value: 38200000000 }
    ],
    totalDebt: [
      { year: 2021, value: 7000000000 },
      { year: 2022, value: 10940000000 },
      { year: 2023, value: 9700000000 },
      { year: 2024, value: 8460000000 },
      { year: 2025, value: 8460000000 }
    ],
    marketCap: 3700000000000,
    peRatio: 42.6,
    pegRatio: 0.85,
    priceToBook: 53.4,
    priceToSales: 38.2,
    evToRevenue: 37.9,
    evToEbitda: 71.4,
    analystTargetPrice: 190.00,
    week52High: 195.95,
    week52Low: 39.23,
    beta: 1.84,
    dividendYield: 0.02,
    returnOnEquity: 126.3,
    returnOnAssets: 58.4,
    profitMargin: 48.8,
    operatingMargin: 54.1,
    sources: [
      "https://www.sec.gov/ix?doc=/Archives/edgar/data/1045810/000104581024000012/nvda-20240128.htm",
      "https://finance.yahoo.com/quote/NVDA/financials"
    ],
    confidence: 0.98
  },
  competitors: {
    companyName: "NVIDIA Corporation",
    ticker: "NVDA",
    industry: "Semiconductors",
    sector: "Technology",
    marketCap: 3700000000000,
    competitors: [
      { companyName: "Advanced Micro Devices", ticker: "AMD", industry: "Semiconductors", sector: "Technology", marketCap: 250000000000, country: "United States", competitionType: "Direct", reason: "Major rival in discrete desktop GPUs, datacenter AI accelerators (MI300 series), and general compute modules.", score: 81 },
      { companyName: "Intel Corporation", ticker: "INTC", industry: "Semiconductors", sector: "Technology", marketCap: 130000000000, country: "United States", competitionType: "Direct", reason: "Legacy competitor in CPUs and server compute, developing Gaudi AI chips and active foundry services.", score: 70 },
      { companyName: "Qualcomm Inc.", ticker: "QCOM", industry: "Semiconductors", sector: "Technology", marketCap: 190000000000, country: "United States", competitionType: "Indirect", reason: "Dominant player in mobile processors, now expanding into PC AI processors (Snapdragon X Elite) and edge computing.", score: 65 },
      { companyName: "Broadcom Inc.", ticker: "AVGO", industry: "Semiconductors", sector: "Technology", marketCap: 650000000000, country: "United States", competitionType: "Indirect", reason: "Builds high-speed Ethernet networking components and custom AI ASICs (TPUs) for hyperscalers like Google and Meta.", score: 78 },
      { companyName: "Amazon Web Services", ticker: "AMZN", industry: "Cloud Infrastructure", sector: "Technology", marketCap: 1950000000000, country: "United States", competitionType: "Emerging", reason: "Major customer that is vertically integrating with in-house custom chips like Trainium and Inferentia.", score: 68 }
    ],
    sources: [
      "https://www.gartner.com/reviews/market/semiconductors-industry",
      "https://www.idc.com/getdoc.jsp?containerId=prUS51817424"
    ],
    confidence: 0.94,
    keyMoat: "CUDA software ecosystem (over 4 million active developers globally) paired with high-bandwidth Mellanox networking fabric creates an insuperable switching cost for data centers."
  },
  marketIndustry: {
    companyName: "NVIDIA Corporation",
    ticker: "NVDA",
    industryCAGR: "18.0%",
    marketSizeCurrent: "$180B",
    marketSizeForecast: "$243.8B",
    forecastYear: "2025E",
    keyTrend: "Surging demand for AI accelerator cards and high-performance computing clusters in public and private clouds.",
    industryDrivers: [
      "Hyperscalers building next-generation Large Language Models (LLMs) and Multimodal AI infrastructure.",
      "Enterprise digital transformation migrating workflows into generative AI pipelines.",
      "Sovereign AI initiatives driven by governments developing national cloud capabilities."
    ],
    regulatoryRisks: [
      "US Department of Commerce export controls restricting advanced semiconductor shipments to China and select Middle Eastern nations.",
      "Antitrust scrutiny in France, EU, and the United States regarding GPU allocation procedures and CUDA platform lock-in."
    ],
    porterForces: {
      rivalry: 60,
      substitutes: 35,
      newEntrants: 25,
      supplierPower: 85,
      buyerPower: 45
    },
    growthHistory: [
      { year: "2021", size: 100 },
      { year: "2022", size: 120 },
      { year: "2023", size: 145 },
      { year: "2024", size: 195 },
      { year: "2025E", size: 243.8 }
    ],
    sources: [
      "https://www.mckinsey.com/industries/semiconductors/our-insights/",
      "https://www.idc.com/tracker/active-trackers"
    ],
    confidence: 0.92
  },
  news: {
    companyName: "NVIDIA Corporation",
    ticker: "NVDA",
    overallSentiment: "Positive",
    sentimentBreakdown: { positive: 82, neutral: 15, negative: 3 },
    latestHeadlines: [
      { headline: "NVIDIA Announces Next-Gen Blackwell Ultra Chips for Advanced AI Clusters", source: "Bloomberg", date: "June 25, 2026", sentiment: "Positive", importance: "High", impact: "Validates product lifecycle speed; secures leadership for the 2026-2027 server investment cycle.", category: "Product Launch", url: "#" },
      { headline: "TSMC Hikes Advanced 3nm Packaging Prices; NVIDIA Approves to Secure Output", source: "Reuters", date: "June 22, 2026", sentiment: "Neutral", importance: "Medium", impact: "Slight margin pressure, but guarantees supply allocation in a supply-constrained market.", category: "Supply Chain", url: "#" },
      { headline: "Antitrust Watchdogs Target French NVIDIA Offices Over Alleged Moat Exploitation", source: "Wall Street Journal", date: "June 18, 2026", sentiment: "Negative", importance: "Medium", impact: "Regulatory overhang; unlikely to affect immediate quarterly revenues but adds legal risk.", category: "Regulatory", url: "#" },
      { headline: "Microsoft and Oracle Expand Multi-Billion Dollar GPU Agreements with NVIDIA", source: "TechCrunch", date: "June 15, 2026", sentiment: "Positive", importance: "High", impact: "Indicates persistent demand from major hyperscalers, clearing inventory accumulation worries.", category: "Partnership", url: "#" },
      { headline: "NVIDIA CEO Jensen Huang Sells Shares Worth $25M Under Programmed 10b5-1 Plan", source: "CNBC", date: "June 12, 2026", sentiment: "Neutral", importance: "Low", impact: "Scheduled trade; does not signal fundamental problems.", category: "Insider Trading", url: "#" }
    ],
    sources: [
      "https://www.bloomberg.com/quote/NVDA:US",
      "https://www.reuters.com/markets/companies/NVDA.O/"
    ],
    confidence: 0.90
  },
  macroeconomic: {
    companyName: "NVIDIA Corporation",
    ticker: "NVDA",
    interestRates: "Neutral",
    inflation: "Stable",
    gdpGrowth: "Positive",
    exchangeRates: "Neutral",
    macroScore: 72,
    outlook: "Bullish",
    gdpTrend: [
      { year: "2021", value: 5.7 },
      { year: "2022", value: 1.9 },
      { year: "2023", value: 2.5 },
      { year: "2024", value: 2.1 },
      { year: "2025E", value: 1.8 }
    ],
    interestRateHistory: [
      { year: "2021", rate: 0.25 },
      { year: "2022", rate: 4.25 },
      { year: "2023", rate: 5.25 },
      { year: "2024", rate: 5.25 },
      { year: "2025E", rate: 4.5 }
    ],
    inflationHistory: [
      { year: "2021", rate: 4.7 },
      { year: "2022", rate: 8.0 },
      { year: "2023", rate: 4.1 },
      { year: "2024", rate: 3.1 },
      { year: "2025E", rate: 2.4 }
    ],
    governmentPolicies: [
      "US CHIPS and Science Act subsidizing onshore foundries, reinforcing supply-chain resilience.",
      "Federal Reserve rate cuts lowering capital costs, encouraging corporate technology budgets."
    ],
    macroRisks: [
      "Geopolitical tension in the Taiwan Strait; TSMC is NVIDIA's primary fabricator.",
      "Global energy grids struggling to supply the gigawatts required by large GPU datacenters."
    ],
    sources: [
      "https://www.federalreserve.gov/monetarypolicy.htm",
      "https://www.imf.org/en/Publications/WEO"
    ],
    confidence: 0.91
  },
  sentiment: {
    companyName: "NVIDIA Corporation",
    ticker: "NVDA",
    overallSentiment: "Very Positive",
    analystSentiment: "Positive",
    socialSentiment: "Very Positive",
    redditBullishPct: 84,
    twitterBullishPct: 78,
    stocktwitsBullishPct: 88,
    analystRatings: { buy: 48, hold: 4, sell: 1 },
    sentimentTimeline: [
      { date: "June 1", score: 82 },
      { date: "June 7", score: 85 },
      { date: "June 14", score: 81 },
      { date: "June 21", score: 87 },
      { date: "June 28", score: 89 }
    ],
    sources: [
      "https://stocktwits.com/symbol/NVDA",
      "https://www.reddit.com/r/wallstreetbets/"
    ],
    confidence: 0.88
  },
  valuation: {
    companyName: "NVIDIA Corporation",
    ticker: "NVDA",
    currentPrice: 168.24,
    intrinsicValue: 172.45,
    valuation: "Fairly Valued",
    upside: 2.5,
    downside: 0,
    metrics: {
      pe: 42.6,
      industryPE: 28.5,
      peg: 0.85,
      priceToBook: 53.4,
      priceToSales: 38.2,
      evEbitda: 71.4
    },
    valuationSummary: "NVIDIA's intrinsic valuation is derived using a Multi-Stage Discounted Cash Flow (DCF) model and peer multiples. With a projected FCF CAGR of 28% over the next 5 years, a terminal growth rate of 3%, and a WACC of 9.2%, the calculated intrinsic value is $172.45 per share, representing a 2.50% upside compared to the current stock price. Though multiples (P/E and P/S) are historically high, the low PEG ratio (<1.0) indicates that NVIDIA's pricing is fully justified by its explosive earnings growth profile.",
    dcfModel: {
      terminalGrowthRate: 3.0,
      wacc: 9.2,
      years: [
        { year: 2026, cashFlow: 54000000000, discountedCF: 49450000000 },
        { year: 2027, cashFlow: 68000000000, discountedCF: 56980000000 },
        { year: 2028, cashFlow: 82000000000, discountedCF: 62920000000 },
        { year: 2029, cashFlow: 96000000000, discountedCF: 67340000000 },
        { year: 2030, cashFlow: 110000000000, discountedCF: 70800000000 }
      ]
    },
    comparableMoat: [
      { name: "Advanced Micro Devices", ticker: "AMD", pe: 62.4, ps: 11.2, pb: 4.8 },
      { name: "Intel Corporation", ticker: "INTC", pe: 28.1, ps: 2.1, pb: 1.5 },
      { name: "Broadcom Inc.", ticker: "AVGO", pe: 38.5, ps: 16.1, pb: 12.4 }
    ],
    sources: [
      "https://finance.yahoo.com/quote/NVDA/analysis",
      "https://www.gurufocus.com/stock/NVDA/valuation"
    ],
    confidence: 0.94
  },
  risk: {
    companyName: "NVIDIA Corporation",
    ticker: "NVDA",
    businessRisk: "Moderate",
    financialRisk: "Low",
    competitiveRisk: "Moderate",
    marketRisk: "High",
    macroeconomicRisk: "Moderate",
    regulatoryRisk: "High",
    valuationRisk: "High",
    sentimentRisk: "Low",
    overallRiskScore: 37,
    riskLevel: "Moderate",
    topRisks: [
      "Supply chain concentration: Fabricating 100% of advanced architectures at TSMC in Taiwan exposes NVIDIA to regional geopolitical events.",
      "Regulatory & Export Blocks: US trade policies limiting chip exports to Chinese markets reduce addressable demand by 15-20%.",
      "High expectations risk: High trailing multiples create significant correction risk if growth decelerates even slightly."
    ],
    mitigatingFactors: [
      "Massive cash pile ($38B) and zero net debt provide absolute financial immunity during market downturns.",
      "Expanding domestic fab partnerships (TSMC Arizona, Intel foundry options) will diversify packaging geography by 2027.",
      "Software CUDA locks in enterprise developer ecosystems, blocking basic hardware price wars from competitors."
    ],
    summary: "NVIDIA exhibits moderate operational and structural risks. The primary risk vectors are supply chain geographical concentration (Taiwan) and high valuation thresholds. However, its outstanding balance sheet, massive free cash flow margin (>45%), and software ecosystem lock-in mitigate financial and competitive risks successfully, supporting a Medium overall risk profile.",
    confidence: 0.93
  },
  recommendation: {
    companyName: "NVIDIA Corporation",
    ticker: "NVDA",
    recommendation: "Strong Buy",
    investmentScore: 91,
    conviction: "High",
    expectedReturn: "15-20%",
    targetPrice: 190.00,
    stopLoss: 142.00,
    riskRewardRatio: "1:3",
    timeHorizon: "Long Term",
    bullCase: [
      "Unchallenged monopoly in high-performance AI chips with the new Blackwell architecture.",
      "High-margin software NIM and DGX cloud platforms growing as a share of total revenue.",
      "Consistent share buyback programs driven by record-breaking free cash flows."
    ],
    bearCase: [
      "Escalating geopolitical blockade in the Taiwan Strait halts advanced supply chains.",
      "Hyperscalers decrease CapEx budgets if enterprise AI monetization slows down.",
      "Antitrust regulatory actions force NVIDIA to decouple CUDA from its GPU architectures."
    ],
    keyCatalysts: [
      "Q3 Blackwell shipment delivery metrics showing volume and margin levels.",
      "Expansion of sovereign AI computing contracts in European and Asian markets.",
      "Potential stock split or dividend increase announcements at the upcoming AGM."
    ],
    watchItems: [
      "TSMC CoWoS packaging capacity expansion speed.",
      "Capital expenditures (CapEx) metrics of Microsoft, Meta, and Alphabet in quarterly reports.",
      "Legal motions filed by EU and US FTC trade boards."
    ],
    investmentThesis: "NVIDIA is the undisputed core infrastructure provider for the global transition to accelerated computing and Artificial Intelligence. By co-designing hardware (GPUs, networking) and software (CUDA, NIM), NVIDIA has built an unassailable ecosystem. The financial health is stellar, with gross margins near 75% and return on equity above 100%. While the valuation is elevated, the low PEG ratio and strong demand pipeline support our Strong Buy recommendation.",
    executiveSummary: "NVIDIA demonstrates strong financial performance with exceptional revenue and profit growth driven by surging demand for AI chips and data center solutions. The company maintains a leadership position in a high-growth industry with significant competitive advantages. With solid fundamentals and positive market outlook, NVIDIA is well-positioned for continued long-term growth.",
    confidence: 0.89
  }
};

// Map of predefined companies
export const PRESETS: Record<string, PlatformReport> = {
  NVDA: NVIDIA_DATA
};

// Dynamically generate a deterministic report for any other ticker searched (keeps the system full)
export function getReportForCompany(searchQuery: string): PlatformReport {
  const queryClean = searchQuery.trim().toUpperCase();
  
  // Extract potential ticker
  let ticker = queryClean;
  if (queryClean.includes(" ")) {
    // If it's a full name like "Apple Inc" or "Microsoft", try to match common presets
    if (queryClean.includes("NVIDIA") || queryClean.includes("NVDA")) return NVIDIA_DATA;
    ticker = queryClean.split(" ")[0].substring(0, 4);
  }

  if (ticker === "NVDA") return NVIDIA_DATA;
  
  // If we have a preset or match, otherwise generate deterministically
  const seed = stringHash(ticker);
  
  // Deterministic ratings
  const score = Math.floor(seedRandom(seed, 55, 95));
  let rec: "Strong Buy" | "Buy" | "Hold" | "Sell" | "Strong Sell" = "Hold";
  if (score >= 88) rec = "Strong Buy";
  else if (score >= 75) rec = "Buy";
  else if (score >= 60) rec = "Hold";
  else if (score >= 45) rec = "Sell";
  else rec = "Strong Sell";

  const isPositive = rec === "Strong Buy" || rec === "Buy";
  const confidence = seedRandom(seed + 1, 0.70, 0.95);
  const currentPrice = Number(seedRandom(seed + 2, 10, 800).toFixed(2));
  const changePct = seedRandom(seed + 3, -4.5, 6.5);
  const upside = isPositive ? seedRandom(seed + 4, 3, 25) : 0;
  const downside = !isPositive ? seedRandom(seed + 5, 2, 18) : 0;
  const intrinsicVal = Number((currentPrice * (1 + (upside - downside) / 100)).toFixed(2));
  
  const riskVal = score > 80 ? "Low" : (score > 65 ? "Moderate" : "High");
  const overallRisk = score > 80 ? seedRandom(seed, 20, 40) : (score > 65 ? seedRandom(seed, 40, 60) : seedRandom(seed, 60, 85));

  const sectors = ["Technology", "Financial Services", "Consumer Cyclical", "Healthcare", "Industrials", "Communication Services"];
  const industries = ["Software - Infrastructure", "Banks - Diversified", "Internet Retail", "Consumer Electronics", "Diagnostics & Research", "Auto Manufacturers"];
  
  const sector = sectors[Math.floor(seedRandom(seed + 6, 0, sectors.length))];
  const industry = industries[Math.floor(seedRandom(seed + 7, 0, industries.length))];
  const exchange = seed % 2 === 0 ? "NASDAQ" : "NYSE";
  const marketCap = Math.floor(seedRandom(seed + 8, 10000000000, 3000000000000));
  
  // Founders & CEO
  const ceos = ["Satya Nadella", "Tim Cook", "Elon Musk", "Andy Jassy", "Sundar Pichai", "Mark Zuckerberg", "Jamie Dimon", "Warren Buffett"];
  const ceo = ceos[Math.floor(seedRandom(seed + 9, 0, ceos.length))];

  // Financial values
  const revBase = marketCap * 0.08;
  const revenueHistory: FinancialValue[] = [];
  const netIncHistory: FinancialValue[] = [];
  const epsHistory: FinancialValue[] = [];
  const operatingCashFlowHistory: FinancialValue[] = [];
  
  for (let idx = 0; idx < 5; idx++) {
    const year = 2021 + idx;
    const growthFactor = 1 + seedRandom(seed + idx, -0.05, 0.25) * (idx / 4);
    revenueHistory.push({ year, value: Math.floor(revBase * growthFactor) });
    netIncHistory.push({ year, value: Math.floor(revBase * 0.15 * growthFactor) });
    epsHistory.push({ year, value: Number((seedRandom(seed + idx, 1, 15) * growthFactor).toFixed(2)) });
    operatingCashFlowHistory.push({ year, value: Math.floor(revBase * 0.18 * growthFactor) });
  }

  const nameUpper = searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1);
  const companyName = nameUpper.includes("CORP") || nameUpper.includes("INC") || nameUpper.includes("CO") 
    ? nameUpper 
    : `${nameUpper} ${exchange === "NASDAQ" ? "Technologies" : "Holdings"} Inc.`;

  return {
    companyResearch: {
      companyName,
      ticker,
      exchange,
      industry,
      sector,
      founded: Math.floor(seedRandom(seed + 10, 1960, 2015)),
      founders: [`Founder A_${ticker}`, `Founder B_${ticker}`],
      ceo,
      headquarters: `${exchange === "NASDAQ" ? "Seattle, Washington" : "New York, New York"}, USA`,
      website: `https://www.web-${ticker.toLowerCase()}.com`,
      investorRelations: `https://ir.web-${ticker.toLowerCase()}.com`,
      businessDescription: `${companyName} is a leading player in the ${industry} segment under the ${sector} sector. The enterprise specializes in custom solutions, building digital systems, and providing large-scale infrastructure platforms for enterprise clients worldwide. With its highly scalable operating structure, the business has successfully locked in premium market contracts and expanded its global reach over the past decade.`,
      businessModel: `${companyName} generates revenues through direct commercial product licensing, cloud sub-agreements, and long-term enterprise maintenance contracts. Key margins remain protected by high barriers to entry, switching costs, and custom hardware integrations.`,
      products: ["Product Core v1", "Suite Enterprise", "Developer SDK Plus"],
      services: ["Platform Integration", "Enterprise Dedicated Support", "Altuni cloud services"],
      operatingCountries: ["United States", "United Kingdom", "Germany", "Japan", "Singapore"],
      employeeCount: Math.floor(seedRandom(seed + 11, 5000, 120000)),
      marketCap,
      sources: [`https://finance.yahoo.com/quote/${ticker}`, `https://sec.gov/cgi-bin/browse-edgar?CIK=${ticker}`],
      confidence
    },
    financialStatements: {
      companyName,
      ticker,
      currency: "USD",
      fiscalYearEnd: "December",
      revenue: revenueHistory,
      grossProfit: revenueHistory.map(r => ({ year: r.year, value: r.value ? Math.floor(r.value * 0.6) : null })),
      operatingIncome: revenueHistory.map(r => ({ year: r.year, value: r.value ? Math.floor(r.value * 0.22) : null })),
      netIncome: netIncHistory,
      eps: epsHistory,
      dilutedEPS: epsHistory.map(e => ({ year: e.year, value: e.value ? Number((e.value * 0.98).toFixed(2)) : null })),
      operatingCashFlow: operatingCashFlowHistory,
      freeCashFlow: operatingCashFlowHistory.map(o => ({ year: o.year, value: o.value ? Math.floor(o.value * 0.8) : null })),
      capitalExpenditure: operatingCashFlowHistory.map(o => ({ year: o.year, value: o.value ? Math.floor(o.value * 0.2) : null })),
      totalAssets: revenueHistory.map(r => ({ year: r.year, value: r.value ? Math.floor(r.value * 1.5) : null })),
      totalLiabilities: revenueHistory.map(r => ({ year: r.year, value: r.value ? Math.floor(r.value * 0.6) : null })),
      totalEquity: revenueHistory.map(r => ({ year: r.year, value: r.value ? Math.floor(r.value * 0.9) : null })),
      cashAndEquivalents: revenueHistory.map(r => ({ year: r.year, value: r.value ? Math.floor(r.value * 0.25) : null })),
      totalDebt: revenueHistory.map(r => ({ year: r.year, value: r.value ? Math.floor(r.value * 0.15) : null })),
      marketCap,
      peRatio: Number(seedRandom(seed + 12, 15, 60).toFixed(1)),
      pegRatio: Number(seedRandom(seed + 13, 0.8, 2.5).toFixed(2)),
      priceToBook: Number(seedRandom(seed + 14, 2, 20).toFixed(1)),
      priceToSales: Number(seedRandom(seed + 15, 1.5, 15).toFixed(1)),
      evToRevenue: Number(seedRandom(seed + 16, 2, 14).toFixed(1)),
      evToEbitda: Number(seedRandom(seed + 17, 10, 35).toFixed(1)),
      analystTargetPrice: intrinsicVal,
      week52High: Number((currentPrice * 1.2).toFixed(2)),
      week52Low: Number((currentPrice * 0.75).toFixed(2)),
      beta: Number(seedRandom(seed + 18, 0.5, 2.1).toFixed(2)),
      dividendYield: Number(seedRandom(seed + 19, 0, 3.5).toFixed(2)),
      returnOnEquity: Number(seedRandom(seed + 20, 10, 45).toFixed(1)),
      returnOnAssets: Number(seedRandom(seed + 21, 4, 18).toFixed(1)),
      profitMargin: Number(seedRandom(seed + 22, 5, 28).toFixed(1)),
      operatingMargin: Number(seedRandom(seed + 23, 10, 35).toFixed(1)),
      sources: [`https://finance.yahoo.com/quote/${ticker}/financials`],
      confidence
    },
    competitors: {
      companyName,
      ticker,
      industry,
      sector,
      marketCap,
      competitors: [
        { companyName: `Competitor A_${ticker}`, ticker: `${ticker}A`, industry, sector, marketCap: Math.floor(marketCap * 0.8), country: "United States", competitionType: "Direct", reason: "Directly competes in core technology licensing and localized service deployment.", score: Math.floor(seedRandom(seed, 60, 90)) },
        { companyName: `Competitor B_${ticker}`, ticker: `${ticker}B`, industry, sector, marketCap: Math.floor(marketCap * 0.5), country: "United States", competitionType: "Direct", reason: "Fierce rival in cloud contracts, competing on specialized pricing and custom modules.", score: Math.floor(seedRandom(seed + 1, 60, 90)) },
        { companyName: `Competitor C_${ticker}`, ticker: `${ticker}C`, industry, sector, marketCap: Math.floor(marketCap * 0.3), country: "United Kingdom", competitionType: "Indirect", reason: "Provides complementary consultancy services that slowly eat into software margins.", score: Math.floor(seedRandom(seed + 2, 50, 80)) },
        { companyName: `Competitor D_${ticker}`, ticker: `${ticker}D`, industry, sector, marketCap: Math.floor(marketCap * 0.15), country: "Germany", competitionType: "Emerging", reason: "AI startup launching automated replacements for traditional core pipelines.", score: Math.floor(seedRandom(seed + 3, 40, 80)) }
      ],
      sources: [`https://www.gartner.com/reviews/market/${ticker}`],
      confidence,
      keyMoat: "Established customer loyalty combined with proprietary IP licenses blocks direct peer replacements."
    },
    marketIndustry: {
      companyName,
      ticker,
      industryCAGR: `${seedRandom(seed + 24, 4.5, 14.5).toFixed(1)}%`,
      marketSizeCurrent: `$${(marketCap * 0.003).toFixed(1)}B`,
      marketSizeForecast: `$${(marketCap * 0.0045).toFixed(1)}B`,
      forecastYear: "2029E",
      keyTrend: `Widespread adoption of automated cloud layers and intelligent digital integrations inside ${industry}.`,
      industryDrivers: [
        "Rapid corporate automation initiatives pushing tech adoption.",
        "Increased focus on cost reductions through cloud software efficiency."
      ],
      regulatoryRisks: [
        "Data security and cross-border sovereignty directives (GDPR compliance).",
        "Export and hardware licensing compliance limitations."
      ],
      porterForces: {
        rivalry: Math.floor(seedRandom(seed, 40, 80)),
        substitutes: Math.floor(seedRandom(seed + 1, 30, 70)),
        newEntrants: Math.floor(seedRandom(seed + 2, 20, 60)),
        supplierPower: Math.floor(seedRandom(seed + 3, 30, 80)),
        buyerPower: Math.floor(seedRandom(seed + 4, 30, 80))
      },
      growthHistory: [
        { year: "2021", size: 80 },
        { year: "2022", size: 90 },
        { year: "2023", size: 105 },
        { year: "2024", size: 118 },
        { year: "2025E", size: 135 }
      ],
      sources: [`https://www.mckinsey.com/industries/${ticker}`],
      confidence
    },
    news: {
      companyName,
      ticker,
      overallSentiment: isPositive ? "Positive" : "Neutral",
      sentimentBreakdown: {
        positive: Math.floor(seedRandom(seed, 40, 85)),
        neutral: Math.floor(seedRandom(seed + 1, 10, 40)),
        negative: Math.floor(seedRandom(seed + 2, 2, 25))
      },
      latestHeadlines: [
        { headline: `${companyName} Partners with Global Hyperscaler to Deploy AI Cloud Integration`, source: "Reuters", date: "June 24, 2026", sentiment: "Positive", importance: "High", impact: "Secures recurring revenue stream; expands long-term contract backlog.", category: "Partnership", url: "#" },
        { headline: `${companyName} Reports Solid Q2 Earnings; Beats Revenue Expectations by 4%`, source: "Bloomberg", date: "June 20, 2026", sentiment: "Positive", importance: "High", impact: "Drives institutional buying; supports high multiple validation.", category: "Earnings", url: "#" },
        { headline: `Analysts Adjust Target Price on ${ticker} After Product Roadmap Realignment`, source: "CNBC", date: "June 14, 2026", sentiment: "Neutral", importance: "Medium", impact: "Highlights active shifting in competitive priorities; overall target stable.", category: "Analyst Rating", url: "#" },
        { headline: `Antitrust Concerns Rise Over ${companyName}'s Rising Market Share`, source: "Wall Street Journal", date: "June 10, 2026", sentiment: "Negative", importance: "Medium", impact: "Regulatory legal costs could rise, although market share dominance is verified.", category: "Regulatory", url: "#" }
      ],
      sources: [`https://bloomberg.com/quote/${ticker}`],
      confidence
    },
    macroeconomic: {
      companyName,
      ticker,
      interestRates: "Stable",
      inflation: "Moderate",
      gdpGrowth: "Positive",
      exchangeRates: "Neutral",
      macroScore: Math.floor(seedRandom(seed, 60, 85)),
      outlook: isPositive ? "Bullish" : "Neutral",
      gdpTrend: [
        { year: "2021", value: 5.7 },
        { year: "2022", value: 1.9 },
        { year: "2023", value: 2.5 },
        { year: "2024", value: 2.1 }
      ],
      interestRateHistory: [
        { year: "2021", rate: 0.25 },
        { year: "2022", rate: 4.25 },
        { year: "2023", rate: 5.25 },
        { year: "2024", rate: 5.25 }
      ],
      inflationHistory: [
        { year: "2021", rate: 4.7 },
        { year: "2022", rate: 8.0 },
        { year: "2023", rate: 4.1 },
        { year: "2024", rate: 3.1 }
      ],
      governmentPolicies: [
        "Subsidized onshore manufacturing directives expanding operating sites.",
        "Stable tax credits for software research and automation development."
      ],
      macroRisks: [
        "Sovereign inflation shifts raising local employee salaries.",
        "High cost of capital squeezing enterprise software budget expansion."
      ],
      sources: [`https://imf.org/en/Publications/${ticker}`],
      confidence
    },
    sentiment: {
      companyName,
      ticker,
      overallSentiment: isPositive ? "Positive" : "Neutral",
      analystSentiment: isPositive ? "Positive" : "Neutral",
      socialSentiment: isPositive ? "Positive" : "Neutral",
      redditBullishPct: Math.floor(seedRandom(seed, 55, 85)),
      twitterBullishPct: Math.floor(seedRandom(seed + 1, 55, 85)),
      stocktwitsBullishPct: Math.floor(seedRandom(seed + 2, 55, 85)),
      analystRatings: {
        buy: Math.floor(seedRandom(seed, 15, 38)),
        hold: Math.floor(seedRandom(seed + 1, 5, 20)),
        sell: Math.floor(seedRandom(seed + 2, 0, 5))
      },
      sentimentTimeline: [
        { date: "June 1", score: 68 },
        { date: "June 7", score: 72 },
        { date: "June 14", score: 70 },
        { date: "June 21", score: 74 },
        { date: "June 28", score: 76 }
      ],
      sources: [`https://twitter.com/search?q=%24${ticker}`],
      confidence
    },
    valuation: {
      companyName,
      ticker,
      currentPrice,
      intrinsicValue: intrinsicVal,
      valuation: rec === "Strong Buy" || rec === "Buy" ? "Undervalued" : (rec === "Hold" ? "Fairly Valued" : "Overvalued"),
      upside,
      downside,
      metrics: {
        pe: Number(seedRandom(seed, 15, 45).toFixed(1)),
        industryPE: Number(seedRandom(seed + 1, 15, 35).toFixed(1)),
        peg: Number(seedRandom(seed + 2, 0.7, 1.8).toFixed(2)),
        priceToBook: Number(seedRandom(seed + 3, 2, 10).toFixed(1)),
        priceToSales: Number(seedRandom(seed + 4, 1.5, 8).toFixed(1)),
        evEbitda: Number(seedRandom(seed + 5, 10, 22).toFixed(1))
      },
      valuationSummary: `Our Multi-Stage DCF model indicates an intrinsic value of $${intrinsicVal} per share. Assuming a WACC of 8.5% and a terminal growth rate of 2.5%, the current stock price of $${currentPrice} offers a compelling entry point with an expected ${upside.toFixed(1)}% valuation upside. Multiples remain aligned with historical industry patterns.`,
      dcfModel: {
        terminalGrowthRate: 2.5,
        wacc: 8.5,
        years: [
          { year: 2026, cashFlow: Math.floor(revBase * 0.12), discountedCF: Math.floor(revBase * 0.11) },
          { year: 2027, cashFlow: Math.floor(revBase * 0.14), discountedCF: Math.floor(revBase * 0.12) },
          { year: 2028, cashFlow: Math.floor(revBase * 0.16), discountedCF: Math.floor(revBase * 0.13) }
        ]
      },
      comparableMoat: [
        { name: `Peer Company A`, ticker: `${ticker}P1`, pe: 28.5, ps: 6.2, pb: 4.1 },
        { name: `Peer Company B`, ticker: `${ticker}P2`, pe: 32.1, ps: 7.4, pb: 4.8 }
      ],
      sources: [`https://finance.yahoo.com/quote/${ticker}/analysis`],
      confidence
    },
    risk: {
      companyName,
      ticker,
      businessRisk: riskVal,
      financialRisk: "Low",
      competitiveRisk: riskVal,
      marketRisk: riskVal,
      macroeconomicRisk: "Moderate",
      regulatoryRisk: "Moderate",
      valuationRisk: riskVal,
      sentimentRisk: "Low",
      overallRiskScore: Math.floor(overallRisk),
      riskLevel: riskVal,
      topRisks: [
        "Intense competitive friction from emerging low-cost SaaS operators.",
        "Operational scaling risks when entering APAC jurisdictions.",
        "Regulatory compliance burdens under localized security frameworks."
      ],
      mitigatingFactors: [
        "Sticky client contracts with long-term retention buffers.",
        "High reserve cash positions protecting R&D investments."
      ],
      summary: `Overall risk profile is classified as ${riskVal}. Financial leverage remains low and margins are highly stable, neutralizing potential competitive pricing attacks. The primary risk vectors reside in market consolidation and regulatory adjustments.`,
      confidence
    },
    recommendation: {
      companyName,
      ticker,
      recommendation: rec,
      investmentScore: score,
      conviction: score > 85 ? "High" : (score > 65 ? "Medium" : "Low"),
      expectedReturn: isPositive ? "10-15%" : "0-5%",
      targetPrice: intrinsicVal,
      stopLoss: Number((currentPrice * 0.85).toFixed(2)),
      riskRewardRatio: isPositive ? "1:2.5" : "1:1",
      timeHorizon: "Medium Term",
      bullCase: [
        "Pioneering technology with a highly defensible service layer.",
        "Stellar historical FCF margins exceeding industry medians."
      ],
      bearCase: [
        "Unfavorable shift in macro budgets causing contract delays.",
        "Higher raw input costs squeezing software development margins."
      ],
      keyCatalysts: [
        "Upcoming annual user conference outlining product expansion.",
        "Expected announcement of a multi-region cloud deal."
      ],
      watchItems: [
        "Quarterly customer acquisition cost trends.",
        "Regulatory filings detailing data privacy rules."
      ],
      investmentThesis: `Based on automated agent research, ${companyName} represents a highly resilient asset with steady secular growth drivers. The company's stable balance sheet combined with high recurring revenue visibility supports our ${rec} stance. The target price of $${intrinsicVal} is well within DCF parameters.`,
      executiveSummary: `${companyName} exhibits solid financial performance with stable revenue growth. The company maintains a strong competitive position in its target markets. With steady fundamentals and a positive market outlook, the stock presents a ${rec} opportunity.`,
      confidence
    }
  };
}
