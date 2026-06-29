import { PromptTemplate } from "@langchain/core/prompts";

import { gemini } from "../../lib/gemini";

import { extractJson } from "../../utils/extractJson";

import { removeDuplicateResults } from "../../utils/removeDuplicates";

import { filterTrustedSources } from "../../services/ranking";

import { RecoveryInput } from "./types";

export async function recoverMissingFields<T>(
  input: RecoveryInput<T>
) {
  const profile: any = {
    ...input.profile,
  };

  // ===========================================
  // Detect Missing Fields Automatically
  // ===========================================

  const missingFields = Object.keys(profile).filter((key) => {

    if (
      [
        "confidence",
        "missingFields",
      ].includes(key)
    ) {
      return false;
    }

    const value = profile[key];

    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return true;
    }

    if (
      Array.isArray(value) &&
      value.length === 0
    ) {
      return true;
    }

    return false;

  });

  if (missingFields.length === 0) {
    return profile;
  }

  console.log(
    "Recovering:",
    missingFields
  );

  // ===========================================
  // Search Missing Information
  // ===========================================

  const searchResponse =
    await input.searchFunction(
      input.companyName,
      missingFields
    );

  // ===========================================
  // Remove Duplicate Results
  // ===========================================

  const uniqueResults =
    removeDuplicateResults(
      searchResponse.results
    );

  // ===========================================
  // Keep Trusted Sources
  // ===========================================

  const trustedResults =
    filterTrustedSources(
      uniqueResults,
      input.companyName
    );

  // ===========================================
  // Reduce Prompt Size
  // ===========================================

  const simplifiedResults =
    trustedResults
      .slice(0, 10)
      .map((r: any) => ({
        title: r.title,
        url: r.url,
        content: r.content?.slice(0, 500),
      }));
        // ===========================================
  // Build Prompt
  // ===========================================

  const prompt =
    PromptTemplate.fromTemplate(`

${input.prompt}

Company

{company}

Current Data

{profile}

Missing Fields

{missingFields}

Search Results

{results}

`);

  const formattedPrompt =
    await prompt.format({

      company:
        input.companyName,

      profile:
        JSON.stringify(
          profile,
          null,
          2
        ),

      missingFields:
        JSON.stringify(
          missingFields,
          null,
          2
        ),

      results:
        JSON.stringify(
          simplifiedResults,
          null,
          2
        )

    });

  console.log(
    "Recovery Prompt Length:",
    formattedPrompt.length
  );

  // ===========================================
  // Ask Gemini
  // ===========================================

  const response =
    await gemini.invoke(
      formattedPrompt
    );

  // ===========================================
  // Extract JSON
  // ===========================================

  const json =
    extractJson(
      String(response.content)
    );
    // ==========================================
// Normalize Founded Year
// ==========================================

if (typeof json.founded === "string") {

  const match =
    json.founded.match(/\d{4}/);

  if (match) {

    json.founded =
      Number(match[0]);

  }

  else {

    json.founded = null;

  }

}
    console.log("========== RECOVERY RAW ==========");
console.dir(json, { depth: null });
console.log("=================================");

  // ===========================================
  // Parse Using Supplied Parser
  // ===========================================

  const recovered = input.parser.parse(json) as Record<string, any>;

  console.log(
    "Recovered Fields:"
  );

  console.log(
    recovered
  );
    // ===========================================
  // Merge Recovered Values
  // ===========================================

  const completedProfile: any = {
    ...profile,
  };

  for (const [key, value] of Object.entries(recovered)) {

    if (
      value === null ||
      value === undefined
    ) {
      continue;
    }

    // Merge arrays
    if (Array.isArray(value)) {

      const current =
        Array.isArray(completedProfile[key])
          ? completedProfile[key]
          : [];

      completedProfile[key] = [
        ...new Set([
          ...current,
          ...value,
        ]),
      ];

      continue;
    }

    // Merge primitive values
    if (value !== "") {
      completedProfile[key] = value;
    }

  }

  // ===========================================
  // Recalculate Missing Fields
  // ===========================================

  const remainingMissingFields =
    Object.keys(completedProfile).filter((key) => {

      if (
        [
          "confidence",
          "missingFields",
        ].includes(key)
      ) {
        return false;
      }

      const value = completedProfile[key];

      if (
        value === null ||
        value === undefined ||
        value === ""
      ) {
        return true;
      }

      if (
        Array.isArray(value) &&
        value.length === 0
      ) {
        return true;
      }

      return false;

    });

  completedProfile.missingFields =
    remainingMissingFields;

  // ===========================================
  // Confidence
  // ===========================================

  const totalFields =
    Object.keys(completedProfile)
      .filter(
        (key) =>
          ![
            "confidence",
            "missingFields",
          ].includes(key)
      ).length;

  const completedFields =
    totalFields -
    remainingMissingFields.length;

  completedProfile.confidence =
    Number(
      (
        completedFields /
        totalFields
      ).toFixed(2)
    );

  console.log(
    "Final Confidence:",
    completedProfile.confidence
  );

  console.log(
    "Remaining Missing:",
    remainingMissingFields
  );

  // ===========================================
  // Return
  // ===========================================

  return completedProfile;
}