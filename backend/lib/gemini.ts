import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import dotenv from "dotenv";

dotenv.config();

const createModel = (modelName: string) => {
  return new ChatGoogleGenerativeAI({
    model: modelName,
    apiKey: process.env.GEMINI_API_KEY!,
    temperature: 0,
    maxOutputTokens: 8192,
    maxRetries: 3
  });
};

const models = [
  "gemini-2.5-flash",
  "gemini-1.5-flash",
  "gemini-2.0-flash-exp"
];

// Helper function to sleep
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const gemini = {
  invoke: async (input: any, options?: any) => {
    let retries = 3;
    let delay = 3000;
    
    for (const modelName of models) {
      const modelInstance = createModel(modelName);
      let modelRetries = retries;
      let modelDelay = delay;
      
      while (modelRetries > 0) {
        try {
          return await modelInstance.invoke(input, options);
        } catch (err: any) {
          const errMsg = String(err.message || err);
          const isRateLimit = errMsg.includes("429") || 
                              errMsg.includes("RateLimit") || 
                              errMsg.includes("Quota") ||
                              errMsg.includes("exhausted") ||
                              errMsg.includes("ResourceExhausted") ||
                              err.status === 429;
          
          if (isRateLimit) {
            const isDailyQuota = errMsg.includes("quota_message") || 
                                 errMsg.includes("exceeded your current quota") || 
                                 errMsg.includes("requests per day");
                                 
            if (isDailyQuota) {
              console.warn(`[Gemini Quota Exceeded] Daily quota exhausted for ${modelName}. Falling back to next model...`);
              break; // Break inner loop to try next model
            }
            
            if (modelRetries > 1) {
              console.warn(`[Gemini Rate Limit 429] Rate limit hit on ${modelName}. Retrying in ${modelDelay / 1000}s... (${modelRetries - 1} retries left)`);
              await sleep(modelDelay);
              modelRetries--;
              modelDelay = modelDelay * 1.5;
            } else {
              console.warn(`[Gemini Model Failure] Max retries reached for ${modelName}. Trying next model...`);
              break; // Try next model
            }
          } else {
            throw err;
          }
        }
      }
    }
    throw new Error("All fallback Gemini models failed to process the request due to quota/rate-limits.");
  }
} as any;