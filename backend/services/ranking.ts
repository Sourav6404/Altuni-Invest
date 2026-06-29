export interface SearchResult {
  title: string;
  url: string;
  content?: string;
  score?: number;
}

const DOMAIN_SCORES: Record<string, number> = {

  // ==========================================
  // Government
  // ==========================================

  "sec.gov": 100,

  // ==========================================
  // Investor Relations
  // ==========================================

  "investor.": 99,

  // ==========================================
  // Annual Reports
  // ==========================================

  "annualreports.com": 98,

  // ==========================================
  // Financial Data
  // ==========================================

  "finance.yahoo.com": 97,
  "companiesmarketcap.com": 97,
  "nasdaq.com": 96,
  "marketscreener.com": 95,
  "morningstar.com": 94,
  "macrotrends.net": 93,
  "stockanalysis.com": 92,
  "investing.com": 91,

  // ==========================================
  // News
  // ==========================================

  "reuters.com": 90,
  "bloomberg.com": 89,
  "wsj.com": 88,
  "cnbc.com": 87,

  // ==========================================
  // Research
  // ==========================================

  "britannica.com": 86,
  "globaldata.com": 85,
  "investopedia.com": 84,
  "forbes.com": 83,
  "wikipedia.org": 80,

  // ==========================================
  // Misc
  // ==========================================

  "craft.co": 70,
  "linkedin.com": 20,
  "youtube.com": 10,
};

function calculateScore(
  result: SearchResult,
  company: string
) {

  let score = 0;

  const url =
    result.url.toLowerCase();

  const title =
    result.title.toLowerCase();

  const companyName =
    company.toLowerCase();

  // ==========================================
  // Domain Score
  // ==========================================

  for (const [domain, value] of Object.entries(DOMAIN_SCORES)) {

    if (url.includes(domain)) {

      score += value;

      break;

    }

  }

  // ==========================================
  // Company Match
  // ==========================================

  if (
    url.includes(companyName)
  ) {
    score += 25;
  }

  if (
    title.includes(companyName)
  ) {
    score += 20;
  }

  // ==========================================
  // Homepage Bonus
  // ==========================================

  if (
    /^https?:\/\/(www\.)?[^/]+\.[^/]+\/?$/.test(url)
  ) {
    score += 30;
  }

  // ==========================================
  // Title Bonuses
  // ==========================================

  if (title.includes("official"))
    score += 15;

  if (title.includes("company profile"))
    score += 12;

  if (title.includes("annual report"))
    score += 20;

  if (title.includes("financial report"))
    score += 18;

  if (title.includes("financial"))
    score += 8;

  if (title.includes("investor"))
    score += 15;

  if (title.includes("leadership"))
    score += 10;

  if (title.includes("earnings"))
    score += 12;

  if (title.includes("quarterly"))
    score += 10;

  if (title.includes("10-k"))
    score += 18;

  if (title.includes("10-q"))
    score += 15;

  if (title.includes("proxy"))
    score += 10;

  if (title.includes("facts"))
    score += 8;

  // ==========================================
  // URL Bonuses
  // ==========================================

  if (url.includes("investor"))
    score += 15;

  if (url.includes("sec"))
    score += 15;

  if (url.includes("10-k"))
    score += 18;

  if (url.includes("10-q"))
    score += 15;

  if (url.endsWith(".pdf"))
    score += 5;

  // ==========================================
  // Penalties
  // ==========================================

  if (url.includes("reddit"))
    score -= 40;

  if (url.includes("quora"))
    score -= 50;

  if (url.includes("facebook"))
    score -= 80;

  if (url.includes("twitter"))
    score -= 60;

  if (url.includes("x.com"))
    score -= 60;

  return score;

}

export function filterTrustedSources(
  results: SearchResult[],
  company: string
) {

  const ranked =
    results
      .map(result => ({
        ...result,
        score: calculateScore(
          result,
          company
        )
      }))
      .sort(
        (a, b) =>
          (b.score ?? 0) -
          (a.score ?? 0)
      );

  // ==========================================
  // Diversify Results
  // ==========================================

  const selected: SearchResult[] = [];

  const usedCategories =
    new Set<string>();

  function category(url: string) {

    url = url.toLowerCase();

    if (url.includes("investor"))
      return "investor";

    if (url.includes("sec.gov"))
      return "sec";

    if (url.includes("finance.yahoo"))
      return "yahoo";

    if (url.includes("companiesmarketcap"))
      return "marketcap";

    if (url.includes("nasdaq"))
      return "nasdaq";

    if (url.includes("marketscreener"))
      return "marketscreener";

    if (url.includes("annualreports"))
      return "annualreport";

    if (url.includes("macrotrends"))
      return "macrotrends";

    if (url.includes("morningstar"))
      return "morningstar";

    if (url.includes("stockanalysis"))
      return "stockanalysis";

    if (url.includes("investing.com"))
      return "investing";

    if (url.includes("reuters"))
      return "reuters";

    if (url.includes("bloomberg"))
      return "bloomberg";

    if (url.includes("wsj"))
      return "wsj";

    if (url.includes("cnbc"))
      return "cnbc";

    if (url.includes("britannica"))
      return "britannica";

    if (url.includes("globaldata"))
      return "globaldata";

    if (url.includes("investopedia"))
      return "investopedia";

    if (url.includes("forbes"))
      return "forbes";

    if (url.includes("wikipedia"))
      return "wikipedia";

    return "official";

  }

  // ==========================================
  // One Result Per Category
  // ==========================================

  for (const result of ranked) {

    const cat =
      category(result.url);

    if (!usedCategories.has(cat)) {

      usedCategories.add(cat);

      selected.push(result);

    }

  }

  // ==========================================
  // Fill Remaining Slots
  // ==========================================

  for (const result of ranked) {

    if (selected.length >= 12)
      break;

    if (
      !selected.find(
        r => r.url === result.url
      )
    ) {
      selected.push(result);
    }

  }

  return selected;

}