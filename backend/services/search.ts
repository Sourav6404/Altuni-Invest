import { tavily } from "@tavily/core";
import dotenv from "dotenv";

dotenv.config();

const tvly = tavily({
  apiKey: process.env.TAVILY_API_KEY!,
});

export interface SearchOptions {
  query: string;

  maxResults?: number;

  topic?: "general" | "news";

  searchDepth?: "basic" | "advanced";

  includeAnswer?: boolean;

  /**
   * false
   * "text"
   * "markdown"
   */
  includeRawContent?: false | "text" | "markdown";

  includeImages?: boolean;

  /**
   * Used only for news searches.
   * Example:
   * 7 -> last 7 days
   */
  days?: number;
}

export async function search(
  options: SearchOptions
) {
  try {

    const response =
      await tvly.search(
        options.query,
        {

          topic:
            options.topic ?? "general",

          searchDepth:
            options.searchDepth ?? "advanced",

          maxResults:
            options.maxResults ?? 5,

          includeAnswer:
            options.includeAnswer ?? true,

          includeRawContent:
            options.includeRawContent ?? "text",

          includeImages:
            options.includeImages ?? false,

          days:
            options.days,

        }
      );

    return response;

  }

  catch (error) {

    console.error(
      "Tavily Search Error:",
      error
    );

    throw new Error(
      "Failed to search Tavily."
    );

  }

}