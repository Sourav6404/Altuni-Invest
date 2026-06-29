import { PromptTemplate } from "@langchain/core/prompts";

import { gemini } from "../../lib/gemini";

import { COMPANY_RESEARCH_PROMPT } from "./prompt";

import { CompanyProfileSchema } from "./schema";

import {
  searchCompanyInformation,
  searchMissingFields,
} from "./tools";

import { CompanyResearchInput } from "./types";

import { extractJson } from "../../utils/extractJson";

import { filterTrustedSources } from "../../services/ranking";

import { removeDuplicateResults } from "../../utils/removeDuplicates";

import { recoverMissingFields } from "../recovery/agent";

import { RECOVERY_PROMPT } from "../recovery/prompt";

import {
  normalizePerson,
  normalizePeople,
} from "../../utils/normalizePeople";

export async function companyResearchAgent(
  input: CompanyResearchInput
) {
  try {

    // =====================================================
    // STEP 1
    // Search Company Information
    // =====================================================

    const searchResults =
      await searchCompanyInformation(
        input.companyName
      );

    // =====================================================
    // STEP 2
    // Remove Duplicate Results
    // =====================================================

    const uniqueResults =
      removeDuplicateResults(
        searchResults.results
      );

    // =====================================================
    // STEP 3
    // Rank Trusted Sources
    // =====================================================

    const trustedResults =
      filterTrustedSources(
        uniqueResults,
        input.companyName
      );

    console.log(
      JSON.stringify(
        trustedResults.map((r: any) => ({
          title: r.title,
          url: r.url,
        })),
        null,
        2
      )
    );

    // =====================================================
    // STEP 4
    // Reduce Prompt Size
    // =====================================================

    const simplifiedResults =
      trustedResults
        .slice(0, 12)
        .map((r: any) => ({
          title: r.title,
          url: r.url,
          content: r.content?.slice(0, 300),
        }));

    // =====================================================
    // STEP 5
    // Build Prompt
    // =====================================================

    const prompt =
      PromptTemplate.fromTemplate(`

${COMPANY_RESEARCH_PROMPT}

Company

{company}

Search Results

{results}

`);

    const formattedPrompt =
      await prompt.format({

        company:
          input.companyName,

        results:
          JSON.stringify(
            simplifiedResults,
            null,
            2
          ),

      });

    console.log(
      "Prompt Length:",
      formattedPrompt.length
    );

    console.log(
      "Trusted Results:",
      trustedResults.length
    );

    // =====================================================
    // STEP 6
    // Ask Gemini
    // =====================================================

    const response =
      await gemini.invoke(
        formattedPrompt
      );

    // =====================================================
    // STEP 7
    // Extract JSON
    // =====================================================

    const json =
      extractJson(
        String(response.content)
      );
          // =====================================================
    // STEP 8
    // Normalize Arrays
    // =====================================================

    json.founders ??= [];
    json.products ??= [];
    json.services ??= [];
    json.operatingCountries ??= [];
    json.sources ??= [];
    json.investorRelations ??= null;
    json.missingFields ??= [];

    // =====================================================
    // STEP 9
    // Normalize Numbers
    // =====================================================

    if (
      typeof json.marketCap === "string"
    ) {

      const value = Number(
        json.marketCap.replace(
          /[^0-9.]/g,
          ""
        )
      );

      if (!Number.isNaN(value)) {
        json.marketCap = value;
      }

    }

    if (
      typeof json.employeeCount === "string"
    ) {

      const value = Number(
        json.employeeCount.replace(
          /,/g,
          ""
        )
      );

      if (!Number.isNaN(value)) {
        json.employeeCount = value;
      }

    }

    if (
      typeof json.founded === "string"
    ) {

      const value =
        Number(json.founded);

      if (!Number.isNaN(value)) {
        json.founded = value;
      }

    }

    // =====================================================
    // STEP 10
    // First Validation
    // =====================================================

    let profile =
      CompanyProfileSchema.parse(
        json
      );

    // =====================================================
    // STEP 11
    // Recover Missing Fields
    // =====================================================

    profile =
      await recoverMissingFields({

        companyName:
          input.companyName,

        profile,

        parser:
          CompanyProfileSchema.partial(),

        prompt:
          RECOVERY_PROMPT,

        searchFunction:
          searchMissingFields

      });

    // =====================================================
    // STEP 12
    // Normalize People
    // =====================================================

    profile.ceo =
      normalizePerson(
        profile.ceo
      );

    profile.founders =
      normalizePeople(
        profile.founders
      );    // =====================================================
    // STEP 13
    // Final Validation
    // =====================================================

    profile =
      CompanyProfileSchema.parse(
        profile
      );

    return profile;

  } catch (error) {

    console.error(
      "Company Research Agent Error:",
      error
    );

    throw new Error(
      "Failed to generate company profile."
    );

  }

}