import { useState } from "react";
import { PlatformReport } from "../mock/mockData";

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
}

export function useAIChat(report: PlatformReport | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "ai",
      text: report 
        ? `Hello! I have loaded the institutional research telemetry for **${report.companyResearch.companyName} (${report.companyResearch.ticker})**. How can I help you analyze this asset today?`
        : "Hello! Search for any asset in the cockpit header, and I will be ready to help you analyze its financials, risk profile, or competitive moat.",
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async (inputText: string) => {
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      sender: "user",
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // Simulate AI response delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    let responseText = "";

    if (!report) {
      responseText = "Please load a stock report first by searching in the top navigation bar.";
    } else {
      const ticker = report.companyResearch.ticker || "";
      const name = report.companyResearch.companyName;
      const rec = report.recommendation;
      const val = report.valuation;
      const risk = report.risk;
      const fs = report.financialStatements;

      const lowerText = inputText.toLowerCase();

      if (lowerText.includes("why is") || lowerText.includes("recommendation") || lowerText.includes("rate")) {
        responseText = `### Consensus Recommendation Analysis for **${name} (${ticker})**

The multi-agent platform rates **${ticker}** as a **${rec.recommendation}** with a conviction score of **${rec.investmentScore}/100** (Conviction: *${rec.conviction}*).

**Core Valuation Thesis:**
1. **SEC Moat Defensibility:** The company exhibits high barriers to entry with a software lock-in score of above 85%.
2. **Upside Yield:** Our multi-stage DCF models calculate an intrinsic value of **$${val.intrinsicValue}**, representing a **${val.upside.toFixed(1)}%** upside from the current price of **$${val.currentPrice}**.
3. **Horizon Stance:** Recommended timeline horizon is **${rec.timeHorizon}**.`;
      } 
      
      else if (lowerText.includes("financial") || lowerText.includes("statement") || lowerText.includes("revenue")) {
        responseText = `### Financial Statement Digest (TTM Overview)

Here is a summary of the historical and projected financials for **${name}**:

| Fiscal Line Item | 2021 | 2022 | 2023 | 2024 | 2025E |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Total Revenue** | $${(fs.revenue[0]?.value ? fs.revenue[0].value / 1e9 : 0).toFixed(2)}B | $${(fs.revenue[1]?.value ? fs.revenue[1].value / 1e9 : 0).toFixed(2)}B | $${(fs.revenue[2]?.value ? fs.revenue[2].value / 1e9 : 0).toFixed(2)}B | $${(fs.revenue[3]?.value ? fs.revenue[3].value / 1e9 : 0).toFixed(2)}B | $${(fs.revenue[4]?.value ? fs.revenue[4].value / 1e9 : 0).toFixed(2)}B |
| **Net Income** | $${(fs.netIncome[0]?.value ? fs.netIncome[0].value / 1e9 : 0).toFixed(2)}B | $${(fs.netIncome[1]?.value ? fs.netIncome[1].value / 1e9 : 0).toFixed(2)}B | $${(fs.netIncome[2]?.value ? fs.netIncome[2].value / 1e9 : 0).toFixed(2)}B | $${(fs.netIncome[3]?.value ? fs.netIncome[3].value / 1e9 : 0).toFixed(2)}B | $${(fs.netIncome[4]?.value ? fs.netIncome[4].value / 1e9 : 0).toFixed(2)}B |
| **Diluted EPS** | $${(fs.dilutedEPS[0]?.value || 0).toFixed(2)} | $${(fs.dilutedEPS[1]?.value || 0).toFixed(2)} | $${(fs.dilutedEPS[2]?.value || 0).toFixed(2)} | $${(fs.dilutedEPS[3]?.value || 0).toFixed(2)} | $${(fs.dilutedEPS[4]?.value || 0).toFixed(2)} |

**Profitability Benchmarks:**
- **Return on Equity (ROE):** **${fs.returnOnEquity || "--"}%** (Industry-leading category).
- **Profit Margin:** **${fs.profitMargin || "--"}%** with stable cash flow conversions.`;
      } 
      
      else if (lowerText.includes("risk") || lowerText.includes("threat")) {
        responseText = `### Risk Matrix Assessment for **${name}**

The overall composite risk profile is categorized as **${risk.riskLevel}** (Risk Score: **${risk.overallRiskScore}/100**).

**Top Threat Vectors Identified:**
${risk.topRisks.map((r, idx) => `${idx + 1}. **${r.split(":")[0]}**: ${r.split(":")[1] || r}`).join("\n")}

**Mitigation Shields:**
- ${risk.mitigatingFactors.join("\n- ")}`;
      } 
      
      else if (lowerText.includes("compare") || lowerText.includes("amd") || lowerText.includes("competitor")) {
        responseText = `### Peer Multiples Benchmarking: **${ticker}** vs. Competitors

| Company Asset | Ticker | P/E Multiple | P/S Multiple | P/B Multiple | Moat Class |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **${name}** | **${ticker}** | **${fs.peRatio || "--"}x** | **${fs.priceToSales || "--"}x** | **${fs.priceToBook || "--"}x** | **High Shield** |
| AMD Core | AMD | 31.4x | 6.8x | 4.2x | High Performance |
| Intel Core | INTC | 14.8x | 1.8x | 1.1x | Transitioning |
| Comparable Median | -- | 23.5x | 4.5x | 3.2x | -- |

**Direct Competition Thesis:**
- **Primary Moat Driver:** *${report.competitors.keyMoat}*`;
      } 
      
      else if (lowerText.includes("dcf") || lowerText.includes("valuation") || lowerText.includes("intrinsic")) {
        responseText = `### DCF Valuation Sensitivity Model

Our multi-stage Discounted Cash Flow (DCF) model generates an intrinsic value of **$${val.intrinsicValue}** per share. 

**DCF Assumptions:**
- **Weighted Average Cost of Capital (WACC):** **${val.dcfModel.wacc}%**
- **Terminal Growth Rate:** **${val.dcfModel.terminalGrowthRate}%**
- **Projected Cash Flows (3Y Forecast):**
  - **2026:** $${(val.dcfModel.years[0]?.cashFlow ? val.dcfModel.years[0].cashFlow / 1e9 : 0).toFixed(2)}B (Discounted: $${(val.dcfModel.years[0]?.discountedCF ? val.dcfModel.years[0].discountedCF / 1e9 : 0).toFixed(2)}B)
  - **2027:** $${(val.dcfModel.years[1]?.cashFlow ? val.dcfModel.years[1].cashFlow / 1e9 : 0).toFixed(2)}B (Discounted: $${(val.dcfModel.years[1]?.discountedCF ? val.dcfModel.years[1].discountedCF / 1e9 : 0).toFixed(2)}B)
  - **2028:** $${(val.dcfModel.years[2]?.cashFlow ? val.dcfModel.years[2].cashFlow / 1e9 : 0).toFixed(2)}B (Discounted: $${(val.dcfModel.years[2]?.discountedCF ? val.dcfModel.years[2].discountedCF / 1e9 : 0).toFixed(2)}B)

Assuming current multiple ranges, the stock is currently **${val.valuation}** with **${val.upside.toFixed(1)}%** upside.`;
      } 
      
      else if (lowerText.includes("swot")) {
        responseText = `### SWOT Analysis Matrix for **${name} (${ticker})**

| **Strengths** | **Weaknesses** |
| :--- | :--- |
| - High FCF generation capability (${fs.profitMargin}% margin)<br>- Highly defensible proprietary ecosystem (Moat: High)<br>- Capital efficiency (ROE of ${fs.returnOnEquity}%) | - Multiples priced for perfection (P/E of ${fs.peRatio}x)<br>- Regional customer/supply concentrations |
| **Opportunities** | **Threats** |
| - Rapid deployment into advanced software models<br>- Secular tailwinds in global cloud migration | - Geopolitical blocks and export restrictions<br>- Aggressive pricing wars from direct competitors |`;
      } 
      
      else if (lowerText.includes("five points") || lowerText.includes("summarize everything") || lowerText.includes("bullet")) {
        responseText = `### 5-Point Telemetry Executive Digest

Here is a summary of the investment thesis for **${name}**:
1. **Consensus Verdict:** Rated as a **${rec.recommendation}** with a target price of **$${rec.targetPrice}**.
2. **Moat Shield:** Highly resilient moat backed by sticky enterprise contracts.
3. **Profitability Profile:** Return on Equity of **${fs.returnOnEquity}%** indicating excellent asset productivity.
4. **Primary Risk Vector:** Geopolitical export restrictions and pricing competition.
5. **Short-Term Outlook:** Catalyst timeline indicates **${rec.timeHorizon}** secular expansion.`;
      } 
      
      else {
        responseText = `### AI Intelligence Response for **${name}**

Regarding your query: *"${inputText}"*

Based on our multi-agent diagnostics:
- **Financial Status:** Revenue stands at **$${(fs.revenue[fs.revenue.length - 1]?.value ? fs.revenue[fs.revenue.length - 1].value! / 1e9 : 0).toFixed(2)}B** with a **${fs.profitMargin}%** profit margin.
- **Valuation Stance:** DCF models place intrinsic value at **$${val.intrinsicValue}**, representing **${val.upside.toFixed(1)}%** upside.
- **Risk Shield:** Rated **${risk.riskLevel}** overall with mitigating cash buffers of $${(fs.cashAndEquivalents[fs.cashAndEquivalents.length - 1]?.value ? fs.cashAndEquivalents[fs.cashAndEquivalents.length - 1].value! / 1e9 : 0).toFixed(2)}B.

Is there any specific agent report (Financial, Moat, SWOT, DCF model) you would like me to dissect further?`;
      }
    }

    const aiMsg: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      sender: "ai",
      text: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        sender: "ai",
        text: report 
          ? `Hello! I have loaded the institutional research telemetry for **${report.companyResearch.companyName} (${report.companyResearch.ticker})**. How can I help you analyze this asset today?`
          : "Hello! Search for any asset in the cockpit header, and I will be ready to help you analyze its financials, risk profile, or competitive moat.",
        timestamp: new Date()
      }
    ]);
  };

  return {
    messages,
    sendMessage,
    isTyping,
    clearChat
  };
}
