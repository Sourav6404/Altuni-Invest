export interface SearchResult {
  title: string;
  url: string;
  content?: string;
  score?: number;
}

/**
 * Normalize URLs for duplicate detection.
 */
function normalizeUrl(url: string): string {

  return url
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/[?#].*$/, "")
    .replace(/\/$/, "");

}

/**
 * Normalize text.
 */
function normalizeText(text: string): string {

  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

}

/**
 * Removes duplicate search results.
 *
 * Duplicate detection uses:
 *
 * 1. Normalized URL
 * 2. Normalized Title
 * 3. First 400 chars of content
 */
export function removeDuplicateResults(
  results: SearchResult[]
): SearchResult[] {

  const seenUrls = new Set<string>();

  const seenTitles = new Set<string>();

  const seenContents = new Set<string>();

  const unique: SearchResult[] = [];

  for (const result of results) {

    const url =
      normalizeUrl(result.url ?? "");

    const title =
      normalizeText(result.title ?? "");

    const content =
      normalizeText(result.content ?? "")
        .slice(0, 400);

    // ----------------------------------
    // Duplicate URL
    // ----------------------------------

    if (url && seenUrls.has(url))
      continue;

    // ----------------------------------
    // Duplicate Title
    // ----------------------------------

    if (title && seenTitles.has(title))
      continue;

    // ----------------------------------
    // Duplicate Content
    // ----------------------------------

    if (
      content.length > 80 &&
      seenContents.has(content)
    ) {
      continue;
    }

    if (url)
      seenUrls.add(url);

    if (title)
      seenTitles.add(title);

    if (content.length > 80)
      seenContents.add(content);

    unique.push(result);

  }

  return unique;

}