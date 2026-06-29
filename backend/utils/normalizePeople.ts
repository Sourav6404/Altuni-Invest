/**
 * Normalize common person names that appear
 * differently across official filings,
 * annual reports, news articles and finance websites.
 */

const PERSON_ALIASES: Record<string, string> = {

  // ==================================================
  // NVIDIA
  // ==================================================

  "Jen-Hsun Huang": "Jensen Huang",
  "Jen Hsun Huang": "Jensen Huang",
  "Jen Hsuen Huang": "Jensen Huang",
  "Mr. Jen-Hsun Huang": "Jensen Huang",

  // ==================================================
  // Microsoft
  // ==================================================

  "Satya Narayana Nadella": "Satya Nadella",
  "Mr. Satya Nadella": "Satya Nadella",

  // ==================================================
  // Apple
  // ==================================================

  "Timothy D. Cook": "Tim Cook",
  "Timothy Cook": "Tim Cook",
  "Mr. Tim Cook": "Tim Cook",

  "Steven P. Jobs": "Steve Jobs",
  "Steven Jobs": "Steve Jobs",

  // ==================================================
  // Google
  // ==================================================

  "Lawrence E. Page": "Larry Page",
  "Lawrence Page": "Larry Page",

  "Sergey M. Brin": "Sergey Brin",

  // ==================================================
  // Meta
  // ==================================================

  "Mark Elliot Zuckerberg": "Mark Zuckerberg",
  "Mark E. Zuckerberg": "Mark Zuckerberg",

  // ==================================================
  // Amazon
  // ==================================================

  "Jeffrey P. Bezos": "Jeff Bezos",
  "Jeffrey Bezos": "Jeff Bezos",

  // ==================================================
  // Tesla
  // ==================================================

  "Elon Reeve Musk": "Elon Musk",

  // ==================================================
  // Berkshire Hathaway
  // ==================================================

  "Warren Edward Buffett": "Warren Buffett",

  // ==================================================
  // Oracle
  // ==================================================

  "Lawrence J. Ellison": "Larry Ellison",

  // ==================================================
  // Adobe
  // ==================================================

  "Shantanu Narayen": "Shantanu Narayen",

};

const PREFIXES = [
  "Mr.",
  "Mrs.",
  "Ms.",
  "Miss",
  "Dr.",
  "Prof.",
  "Professor",
  "Sir",
];

const SUFFIXES = [
  "Jr.",
  "Sr.",
  "II",
  "III",
  "IV",
];

/**
 * Normalize a single person's name.
 */
export function normalizePerson(
  name: string | null | undefined
): string | null {

  if (!name)
    return null;

  let cleaned = name.trim();

  // ==========================================
  // Remove prefixes
  // ==========================================

  for (const prefix of PREFIXES) {

    const regex =
      new RegExp(
        "^" + prefix.replace(".", "\\.") + "\\s+",
        "i"
      );

    cleaned =
      cleaned.replace(regex, "");

  }

  // ==========================================
  // Remove suffixes
  // ==========================================

  for (const suffix of SUFFIXES) {

    const regex =
      new RegExp(
        "\\s+" +
        suffix.replace(".", "\\.") +
        "$",
        "i"
      );

    cleaned =
      cleaned.replace(regex, "");

  }

  // ==========================================
  // Remove duplicate spaces
  // ==========================================

  cleaned =
    cleaned.replace(/\s+/g, " ").trim();

  // ==========================================
  // Normalize aliases
  // ==========================================

  return PERSON_ALIASES[cleaned] ?? cleaned;

}

/**
 * Normalize an array of people.
 */
export function normalizePeople(
  names: string[]
): string[] {

  return [

    ...new Set(

      names
        .map(normalizePerson)
        .filter(
          (name): name is string =>
            name !== null &&
            name.length > 0
        )

    )

  ];

}