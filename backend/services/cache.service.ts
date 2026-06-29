/**
 * PURPOSE:
 * Server-side database-backed caching service.
 * 
 * RESPONSIBILITIES:
 * 1. Queries MongoDB to find any report matching a given ticker or company name.
 * 2. Validates if the record was generated within the acceptable cache window (e.g. 2 hours).
 * 3. Returns the saved report to bypass agent runs or null on a cache miss.
 * 
 * INTERACTION:
 * - Imported and checked by AnalysisController before starting new agent pipeline runs.
 * - Utilizes ReportModel to perform lookups.
 * 
 * DEPENDENCIES:
 * - Mongoose ReportModel schema.
 * 
 * FUTURE SCALABILITY:
 * - Support custom user settings for report expiry thresholds.
 * - Support Redis backend checks for high-performance memory storage.
 */

import { ReportModel, IReport } from "../models/Report";

export class CacheService {
  // Default cache duration: 24 hours (in milliseconds)
  private readonly DEFAULT_CACHE_DURATION = 24 * 60 * 60 * 1000;

  /**
   * Checks if a report exists for the given company or ticker and is fresh.
   * @param query The company name or ticker search string.
   * @param durationMs Optional cache lifetime in milliseconds.
   */
  public async checkCache(query: string, durationMs: number = this.DEFAULT_CACHE_DURATION): Promise<IReport | null> {
    const cleanQuery = query.trim();
    console.log(`[CacheService] Checking database cache validity for query: "${cleanQuery}"`);

    const thresholdDate = new Date(Date.now() - durationMs);

    // Search by matching companyName (regex case-insensitive) OR matching ticker (uppercase)
    const cachedReport = await ReportModel.findOne({
      $or: [
        { companyName: new RegExp(`^${cleanQuery}$`, "i") },
        { ticker: cleanQuery.toUpperCase() }
      ],
      createdAt: { $gte: thresholdDate }
    }).sort({ createdAt: -1 }); // Grab the newest matching entry

    if (cachedReport) {
      console.log(`[CacheService] Cache HIT for: "${cleanQuery}" (Compiled on: ${cachedReport.createdAt.toISOString()})`);
      return cachedReport;
    }

    console.log(`[CacheService] Cache MISS for: "${cleanQuery}"`);
    return null;
  }
}
