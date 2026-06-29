/**
 * PURPOSE:
 * Holds frontend configurations for server targets and APIs.
 * 
 * RESPONSIBILITIES:
 * 1. Resolves dynamic base target paths depending on build variables.
 */

const isDevPort = typeof window !== "undefined" && window.location.port === "3001";
export const API_BASE_URL = isDevPort 
  ? "" 
  : (import.meta.env.PROD ? window.location.origin : "");
