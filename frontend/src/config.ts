/**
 * PURPOSE:
 * Holds frontend configurations for server targets and APIs.
 * 
 * RESPONSIBILITIES:
 * 1. Resolves dynamic base target paths depending on build variables.
 */

const isDevPort = typeof window !== "undefined" && window.location.port === "3001";
export const API_BASE_URL = isDevPort 
  ? "http://localhost:5000" 
  : (import.meta.env.PROD ? window.location.origin : "http://localhost:5000");
