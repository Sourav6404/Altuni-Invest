import { PromptTemplate } from "@langchain/core/prompts";

import { gemini } from "../../lib/gemini";

import { extractJson } from "../../utils/extractJson";

import { NEWS_PROMPT } from "./prompt";

import { NewsAnalysisSchema } from "./schema";

export async function extractNews(
  companyName: string,
  ticker: string,
  searchResults: any[]
) {

  // =====================================================
  // Reduce Prompt Size
  // =====================================================

  const simplifiedResults =
    searchResults
      .slice(0, 8)
      .map((result: any) => ({

        title: result.title,

        url: result.url,

        content:
          result.content?.slice(0, 500),

      }));

  // =====================================================
  // Build Prompt
  // =====================================================

  const prompt =
    PromptTemplate.fromTemplate(`

${NEWS_PROMPT}

Company

{company}

Ticker

{ticker}

News Search Results

{results}

`);

  const formattedPrompt =
    await prompt.format({

      company:
        companyName,

      ticker:
        ticker,

      results:
        JSON.stringify(
          simplifiedResults,
          null,
          2
        ),

    });

  console.log(
    "News Prompt Length:",
    formattedPrompt.length
  );

  // =====================================================
  // Gemini
  // =====================================================

  const response =
    await gemini.invoke(
      formattedPrompt
    );

  // =====================================================
  // Extract JSON
  // =====================================================

  let json =
    extractJson(
      String(response.content)
    );

  console.log(
    "========== NEWS RAW =========="
  );

  console.dir(
    json,
    { depth: null }
  );

  console.log(
    "=============================="
  );

  // =====================================================
  // Gemini sometimes returns ONLY an array
  // =====================================================

  if (Array.isArray(json)) {

    json = {

      news: json,

      overallSentiment: "Neutral",

      keyTakeaways: [],

      summary: "",

      sources: [],

      confidence: 0.90,

    };

  }

  // =====================================================
  // Normalize Root
  // =====================================================

  json.news ??= [];

  json.overallSentiment ??= "Neutral";

  json.keyTakeaways ??= [];

  json.summary ??= "";

  json.sources ??= [];

  // =====================================================
  // Normalize Articles
  // =====================================================

  json.news = json.news.map(
    (article: any) => ({

      headline:
        article.headline ??
        article.title ??
        "Unknown Headline",

      summary:
        article.summary ??
        article.description ??
        "",

      category: [

        "Earnings",

        "Product Launch",

        "Partnership",

        "Acquisition",

        "Management",

        "Regulation",

        "Litigation",

        "Investment",

        "Market",

        "Technology",

        "Other",

      ].includes(article.category)

        ? article.category

        : "Other",

      impact: [

        "Positive",

        "Neutral",

        "Negative",

      ].includes(article.impact)

        ? article.impact

        : "Neutral",

      importance: [

        "High",

        "Medium",

        "Low",

      ].includes(article.importance)

        ? article.importance

        : "Medium",

      date:
        article.date ??
        null,

      source:
        article.source ??
        "Unknown",

      url:
        article.url ??
        "",

    })
  );

  // =====================================================
  // Normalize Confidence
  // =====================================================

  if (typeof json.confidence === "string") {

    const value =
      json.confidence.toLowerCase();

    switch (value) {

      case "very high":
        json.confidence = 0.98;
        break;

      case "high":
        json.confidence = 0.90;
        break;

      case "medium":
        json.confidence = 0.70;
        break;

      case "low":
        json.confidence = 0.50;
        break;

      default: {

        const number =
          Number(json.confidence);

        json.confidence =
          Number.isNaN(number)
            ? 0.90
            : number;

      }

    }

  }

  if (

    typeof json.confidence !== "number" ||

    Number.isNaN(json.confidence)

  ) {

    json.confidence = 0.90;

  }

  console.log(
    "News Analysis Extracted"
  );

  // =====================================================
  // Validate
  // =====================================================

  return NewsAnalysisSchema
    .partial()
    .parse(json);

}