/**
 * Extract the first valid JSON object or array
 * from an LLM response.
 */

export function extractJson(text: string): any {

  if (!text || text.trim().length === 0) {
    throw new Error("LLM returned an empty response.");
  }

  // ==================================================
  // Remove Markdown
  // ==================================================

  let cleaned = text
    .replace(/```json/gi, "")
    .replace(/```javascript/gi, "")
    .replace(/```ts/gi, "")
    .replace(/```/g, "")
    .trim();

  // ==================================================
  // Normalize quotes
  // ==================================================

  cleaned = cleaned
    .replace(/[“”]/g, "\"")
    .replace(/[‘’]/g, "'");

  // ==================================================
  // Remove control characters
  // ==================================================

  cleaned = cleaned.replace(
    /[\u0000-\u001F]+/g,
    ""
  );

  // ==================================================
  // Try parsing directly
  // ==================================================

  try {
    return JSON.parse(cleaned);
  }

  catch {}

  // ==================================================
  // Extract JSON Object
  // ==================================================

  const objectStart =
    cleaned.indexOf("{");

  const objectEnd =
    cleaned.lastIndexOf("}");

  if (
    objectStart !== -1 &&
    objectEnd !== -1 &&
    objectEnd > objectStart
  ) {

    const json =
      cleaned.substring(
        objectStart,
        objectEnd + 1
      );

    try {
      return JSON.parse(json);
    }

    catch {}

  }

  // ==================================================
  // Extract JSON Array
  // ==================================================

  const arrayStart =
    cleaned.indexOf("[");

  const arrayEnd =
    cleaned.lastIndexOf("]");

  if (
    arrayStart !== -1 &&
    arrayEnd !== -1 &&
    arrayEnd > arrayStart
  ) {

    const json =
      cleaned.substring(
        arrayStart,
        arrayEnd + 1
      );

    try {
      return JSON.parse(json);
    }

    catch {}

  }

  // ==================================================
  // Remove Trailing Commas
  // ==================================================

  cleaned = cleaned
    .replace(/,\s*}/g, "}")
    .replace(/,\s*]/g, "]");

  try {
    return JSON.parse(cleaned);
  }

  catch {}

  // ==================================================
  // Debug Output
  // ==================================================

  console.error("========== INVALID JSON ==========");
  console.error(cleaned);
  console.error("==================================");

  throw new Error(
    "Failed to parse JSON returned by the LLM."
  );

}