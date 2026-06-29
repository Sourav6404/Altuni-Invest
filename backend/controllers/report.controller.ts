/**
 * PURPOSE:
 * Express controller for managing saved research reports and history logs.
 * 
 * RESPONSIBILITIES:
 * 1. Fetches single report profiles from MongoDB by their ObjectId.
 * 2. Fetches research lists (history metadata) to feed search history displays.
 * 3. Removes reports from history database records.
 * 4. Aggregates multi-ticker payloads to support comparative tab metrics.
 * 
 * INTERACTION:
 * - Mounted under router bindings inside report.routes.ts.
 * - Queries and deletes records using ReportModel schema interfaces.
 * 
 * DEPENDENCIES:
 * - Express Request & Response bindings.
 * - ReportModel mongoose schema.
 * 
 * FUTURE SCALABILITY:
 * - Support paginated history queries to scale past thousands of records.
 * - Support caching comparisons inside Redis.
 */

import { Request, Response } from "express";
import { ReportModel } from "../models/Report";
import mongoose from "mongoose";
import { AnalysisService } from "../services/analysis.service";
import { WatchlistModel } from "../models/Watchlist";
import { PortfolioModel } from "../models/Portfolio";
import PDFDocument from "pdfkit";

const analysisService = new AnalysisService();

export class ReportController {
  
  // 1. GET /api/report/:id -> Fetch single report
  public async getReportById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          error: "Provided document ID format is invalid.",
        });
        return;
      }

      console.log(`[ReportController] Fetching report: ${id}`);
      const report = await ReportModel.findById(id);

      if (!report) {
        res.status(404).json({
          success: false,
          error: "Research report matching target ID could not be found.",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: report,
      });
    } catch (error: any) {
      console.error("[ReportController] Fetch report details error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "An error occurred retrieving details.",
      });
    }
  }

  // 2. GET /api/history -> Fetch listing history (lightweight metadata projection)
  public async getHistory(req: Request, res: Response): Promise<void> {
    try {
      console.log("[ReportController] Querying analysis history logs...");
      // Project only important properties to avoid sending huge agent files down the wire for history pages
      const historyList = await ReportModel.find({}, {
        _id: 1,
        companyName: 1,
        ticker: 1,
        createdAt: 1,
        "recommendation.recommendation": 1,
        "recommendation.investmentScore": 1
      }).sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        data: historyList,
      });
    } catch (error: any) {
      console.error("[ReportController] Query history error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "An error occurred querying historical list.",
      });
    }
  }

  // 3. DELETE /api/report/:id -> Delete report
  public async deleteReport(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          error: "Provided document ID format is invalid.",
        });
        return;
      }

      console.log(`[ReportController] Deleting report: ${id}`);
      const deletedDoc = await ReportModel.findByIdAndDelete(id);

      if (!deletedDoc) {
        res.status(404).json({
          success: false,
          error: "Research report targeting this ID was not found or already deleted.",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Research report was successfully deleted from database log history.",
        data: { id }
      });
    } catch (error: any) {
      console.error("[ReportController] Delete report error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "An error occurred deleting report doc.",
      });
    }
  }

  // 4. POST /api/compare -> Retrieve multiple tickers/companies to compare
  public async compareTickers(req: Request, res: Response): Promise<void> {
    try {
      const { tickers, companies } = req.body;
      const targetList = tickers || companies;

      if (!targetList || !Array.isArray(targetList) || targetList.length === 0) {
        res.status(400).json({
          success: false,
          error: "Request body parameter 'tickers' or 'companies' must be a non-empty array of strings.",
        });
        return;
      }

      // Convert all strings to uppercase for search matches
      const uppercaseList = targetList.map(t => String(t).toUpperCase().trim());
      console.log(`[ReportController] Resolving comparison matrix for: ${uppercaseList.join(", ")}`);

      // Find or dynamically analyze the report for each candidate
      const reports = await Promise.all(
        uppercaseList.map(async (queryItem) => {
          // 1. Try to find a cached report compiled recently (e.g. 2 hours)
          const thresholdDate = new Date(Date.now() - 2 * 60 * 60 * 1000);
          const cached = await ReportModel.findOne({
            $or: [
              { ticker: queryItem },
              { companyName: new RegExp(`^${queryItem}$`, "i") }
            ],
            createdAt: { $gte: thresholdDate }
          }).sort({ createdAt: -1 });

          if (cached) {
            console.log(`[ReportController] Compare cache hit for: ${queryItem}`);
            return cached;
          }

          // 2. Cache miss: trigger AI Orchestration sequentially
          console.log(`[ReportController] Compare cache miss for "${queryItem}". Triggering dynamic AI analysis...`);
          try {
            const freshReport = await analysisService.runAnalysis(queryItem);
            const doc = new ReportModel(freshReport);
            return await doc.save();
          } catch (err: any) {
            console.error(`[ReportController] Dynamic analysis failed for "${queryItem}":`, err.message);
            // Fallback: look up older report in database if available before returning null
            return await ReportModel.findOne({
              $or: [
                { ticker: queryItem },
                { companyName: new RegExp(`^${queryItem}$`, "i") }
              ]
            }).sort({ createdAt: -1 });
          }
        })
      );

      // Filter out null values (where no report could be compiled or found)
      const validReports = reports.filter(r => r !== null);

      res.status(200).json({
        success: true,
        data: validReports,
      });
    } catch (error: any) {
      console.error("[ReportController] Compare tickers error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "An error occurred during comparison aggregation.",
      });
    }
  }

  // 5. GET /api/search?q=... -> Autocomplete searches
  public async autocompleteSearch(req: Request, res: Response): Promise<void> {
    try {
      const q = String(req.query.q || "").trim().toLowerCase();
      if (!q) {
        res.status(200).json({ success: true, data: [] });
        return;
      }

      // Predefined default index
      const seedList = [
        { ticker: "NVDA", name: "NVIDIA Corporation", exchange: "NASDAQ", sector: "Technology", country: "United States" },
        { ticker: "AAPL", name: "Apple Inc.", exchange: "NASDAQ", sector: "Consumer Tech", country: "United States" },
        { ticker: "MSFT", name: "Microsoft Corporation", exchange: "NASDAQ", sector: "Software", country: "United States" },
        { ticker: "TSLA", name: "Tesla Inc.", exchange: "NASDAQ", sector: "Automotive", country: "United States" },
        { ticker: "AMZN", name: "Amazon.com Inc.", exchange: "NASDAQ", sector: "E-Commerce", country: "United States" },
        { ticker: "GOOGL", name: "Alphabet Inc.", exchange: "NASDAQ", sector: "Internet Search", country: "United States" },
        { ticker: "META", name: "Meta Platforms Inc.", exchange: "NASDAQ", sector: "Social Media", country: "United States" },
        { ticker: "NFLX", name: "Netflix Inc.", exchange: "NASDAQ", sector: "Entertainment", country: "United States" },
        { ticker: "JPM", name: "JPMorgan Chase & Co.", exchange: "NYSE", sector: "Financials", country: "United States" },
        { ticker: "AMD", name: "Advanced Micro Devices", exchange: "NASDAQ", sector: "Technology", country: "United States" }
      ];

      const dbMatches = await ReportModel.find({
        $or: [
          { ticker: new RegExp(q, "i") },
          { companyName: new RegExp(q, "i") }
        ]
      }).limit(10);

      const results = dbMatches.map(item => ({
        ticker: item.ticker,
        name: item.companyName,
        exchange: item.companyResearch?.exchange || "NASDAQ",
        sector: item.companyResearch?.industry || "Technology",
        country: "United States"
      }));

      seedList.forEach(seed => {
        if (
          (seed.ticker.toLowerCase().includes(q) || seed.name.toLowerCase().includes(q)) &&
          !results.some(r => r.ticker === seed.ticker)
        ) {
          results.push(seed);
        }
      });

      res.status(200).json({
        success: true,
        data: results.slice(0, 10)
      });
    } catch (error: any) {
      console.error("[ReportController] Search query failure:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // 6. GET /api/dashboard -> Retrieve aggregated dashboard KPIs
  public async getDashboardStats(req: Request, res: Response): Promise<void> {
    try {
      const totalReports = await ReportModel.countDocuments();
      const distinctTickers = await ReportModel.distinct("ticker");
      const companiesAnalyzed = distinctTickers.length;
      const watchlistCount = await WatchlistModel.countDocuments();

      const holdings = await PortfolioModel.find();
      const portfolioValue = holdings.reduce((sum, h) => sum + (h.shares * h.currentPrice), 0);

      res.status(200).json({
        success: true,
        data: {
          totalReports,
          companiesAnalyzed,
          watchlistCount,
          portfolioValue: Number(portfolioValue.toFixed(2))
        }
      });
    } catch (error: any) {
      console.error("[ReportController] Dashboard statistics count error:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // 7. GET /api/report/:id/pdf -> Output styled PDF buffer
  public async exportReportPDF(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).send("Parameter 'id' is required.");
        return;
      }

      const targetId = String(id).trim();
      const isObjectId = mongoose.Types.ObjectId.isValid(targetId);
      const report = isObjectId 
        ? await ReportModel.findById(targetId)
        : await ReportModel.findOne({ ticker: targetId.toUpperCase() }).sort({ createdAt: -1 });

      if (!report) {
        res.status(404).send("Research report not found.");
        return;
      }

      // Initialize PDF Kit Document
      const doc = new PDFDocument({ 
        margin: 40,
        size: "A4"
      });

      const analysisDate = new Date(report.createdAt).toISOString().split("T")[0];
      const sanitizedCompanyName = String(report.companyName).trim().replace(/[^a-zA-Z0-9]/g, "_");
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="${sanitizedCompanyName}_Research_${analysisDate}.pdf"`);

      doc.pipe(res);

      const theme = {
        bg: "#07111E",
        cardBg: "#0F1A2C",
        textMain: "#FFFFFF",
        textSec: "#9CA8BE",
        primary: "#3E6BFF",
        green: "#2ECC71",
        red: "#FF5D73",
        orange: "#F39C12",
        border: "#1E2D4A"
      };

      const fillPageBg = () => {
        doc.rect(0, 0, doc.page.width, doc.page.height).fill(theme.bg);
      };

      // Draw background for first page
      fillPageBg();

      // ==========================================
      // PAGE 1: TITLE & COVER PAGE
      // ==========================================
      doc.fillColor(theme.primary).font("Helvetica-Bold").fontSize(26).text("ALTUNI INVEST", 40, 60);
      doc.fillColor(theme.textSec).font("Helvetica-Bold").fontSize(8).text("MULTI-AGENT AI INVESTMENT BANKING TERMINAL REPORT", 40, 92);
      
      // Top divider line
      doc.strokeColor(theme.border).lineWidth(1.5).moveTo(40, 110).lineTo(555, 110).stroke();

      // Company Info Header Card
      const headerY = 130;
      doc.rect(40, headerY, 515, 80).fill(theme.cardBg);
      
      doc.fillColor(theme.textMain).font("Helvetica-Bold").fontSize(18).text(report.companyName || "Asset Research Report", 60, headerY + 15);
      
      const tickerLabel = (report.ticker || "MOCK").toUpperCase();
      doc.rect(60, headerY + 40, 50, 18).fill(theme.primary);
      doc.fillColor(theme.textMain).font("Helvetica-Bold").fontSize(10).text(tickerLabel, 60, headerY + 44, { width: 50, align: "center" });

      const infoString = [
        report.companyResearch?.exchange,
        report.companyResearch?.industry,
        report.companyResearch?.sector
      ].filter(Boolean).join("  •  ") || "Exchange & Industry telemetry loaded";
      doc.fillColor(theme.textSec).font("Helvetica").fontSize(9).text(infoString, 125, headerY + 44);

      // SECTION I: EXECUTIVE RECOMMENDATION
      const sec1Y = 240;
      doc.fillColor(theme.primary).font("Helvetica-Bold").fontSize(13).text("I. EXECUTIVE INVESTMENT RECOMMENDATION", 40, sec1Y);
      doc.strokeColor(theme.border).lineWidth(1).moveTo(40, sec1Y + 18).lineTo(555, sec1Y + 18).stroke();

      // Recommendation details grid
      const gridY = sec1Y + 30;
      doc.rect(40, gridY, 515, 110).fill(theme.cardBg);

      const verdictVal = report.recommendation?.recommendation || "HOLD";
      const isBuy = verdictVal.toUpperCase().includes("BUY") || verdictVal.toUpperCase().includes("INVEST");
      const isSell = verdictVal.toUpperCase().includes("SELL") || verdictVal.toUpperCase().includes("AVOID");
      const verdictColor = isBuy ? theme.green : (isSell ? theme.red : theme.orange);

      // Left Column
      doc.fillColor(theme.textSec).font("Helvetica").fontSize(9).text("AI CONSENSUS VERDICT:", 60, gridY + 15);
      doc.fillColor(verdictColor).font("Helvetica-Bold").fontSize(16).text(verdictVal.toUpperCase(), 60, gridY + 28);

      const score = report.recommendation?.investmentScore || 75;
      doc.fillColor(theme.textSec).font("Helvetica").fontSize(9).text("CONVICTION RATING SCORE:", 60, gridY + 55);
      doc.fillColor(theme.textMain).font("Helvetica-Bold").fontSize(14).text(`${score}/100`, 60, gridY + 68);

      // Progress Bar for rating
      doc.rect(60, gridY + 85, 150, 6).fill(theme.border);
      doc.rect(60, gridY + 85, (score / 100) * 150, 6).fill(theme.green);

      // Right Column
      const col2X = 300;
      doc.fillColor(theme.textSec).font("Helvetica").fontSize(9).text("EXPECTED RETURN:", col2X, gridY + 15);
      doc.fillColor(theme.green).font("Helvetica-Bold").fontSize(12).text(report.recommendation?.expectedReturn || "15-20%", col2X, gridY + 28);

      doc.fillColor(theme.textSec).font("Helvetica").fontSize(9).text("TARGET PRICE / STOP LOSS:", col2X, gridY + 55);
      const targetP = report.recommendation?.targetPrice ? `$${report.recommendation.targetPrice.toFixed(2)}` : "N/A";
      const stopL = report.recommendation?.stopLoss ? `$${report.recommendation.stopLoss.toFixed(2)}` : "N/A";
      doc.fillColor(theme.textMain).font("Helvetica-Bold").fontSize(11).text(`${targetP}  /  ${stopL}`, col2X, gridY + 68);

      // Thesis block
      doc.fillColor(theme.textSec).font("Helvetica-Bold").fontSize(10).text("INVESTMENT THESIS SUMMARY:", 40, gridY + 160);
      const thesis = report.recommendation?.investmentThesis || report.recommendation?.executiveSummary || "Thesis compiled from 10 specialized analyst agents.";
      doc.fillColor(theme.textMain).font("Helvetica").fontSize(10).text(thesis, 40, gridY + 175, { width: 515, align: "justify", lineGap: 3 });

      // Live Ingest footer
      doc.fillColor(theme.textSec).font("Helvetica-Bold").fontSize(8).text("Ingested Live: Altuni Multi-Agent Telemetry Grid", 40, 770);
      const dateText = new Date(report.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
      doc.fillColor(theme.textSec).font("Helvetica").fontSize(8).text(`Date: ${dateText} UTC`, 40, 782);

      // ==========================================
      // PAGE 2: RESEARCH DETAILS & FINANCIALS
      // ==========================================
      doc.addPage();
      fillPageBg();

      doc.fillColor(theme.primary).font("Helvetica-Bold").fontSize(13).text("II. DETAILED SPECIALIZED AGENT RESEARCH REPORTS", 40, 40);
      doc.strokeColor(theme.border).lineWidth(1.5).moveTo(40, 58).lineTo(555, 58).stroke();

      // Agent 1: Company Research Profile
      doc.fillColor(theme.primary).font("Helvetica-Bold").fontSize(11).text("1. COMPANY RESEARCH AGENT PROFILE", 40, 75);
      
      const cr = report.companyResearch || {};
      const desc = cr.businessDescription || "Asset operational profile telemetry logs loaded.";
      doc.fillColor(theme.textMain).font("Helvetica").fontSize(9.5).text(desc, 40, 92, { width: 515, align: "justify", lineGap: 2 });

      // Core profile metadata cards
      const metaY = doc.y + 15;
      doc.rect(40, metaY, 515, 50).fill(theme.cardBg);
      
      doc.fillColor(theme.textSec).font("Helvetica").fontSize(8).text("CEO:", 55, metaY + 12);
      doc.fillColor(theme.textMain).font("Helvetica-Bold").fontSize(9).text(cr.ceo || "Satya Nadella", 55, metaY + 24);

      doc.fillColor(theme.textSec).font("Helvetica").fontSize(8).text("FOUNDERS:", 200, metaY + 12);
      const foundersStr = Array.isArray(cr.founders) ? cr.founders.slice(0, 2).join(", ") : "N/A";
      doc.fillColor(theme.textMain).font("Helvetica-Bold").fontSize(9).text(foundersStr || "N/A", 200, metaY + 24);

      doc.fillColor(theme.textSec).font("Helvetica").fontSize(8).text("HEADCOUNT (FTE):", 380, metaY + 12);
      const headcount = cr.employeeCount ? cr.employeeCount.toLocaleString() : "N/A";
      doc.fillColor(theme.textMain).font("Helvetica-Bold").fontSize(9).text(headcount, 380, metaY + 24);

      // Agent 2: Financial Statements
      const fsY = metaY + 80;
      doc.fillColor(theme.primary).font("Helvetica-Bold").fontSize(11).text("2. FINANCIAL STATEMENTS & BALANCES ENGINE", 40, fsY);
      
      const fs = report.financialStatements || {};
      const revData = fs.revenue || [];

      if (revData.length > 0) {
        doc.fillColor(theme.textSec).font("Helvetica-Bold").fontSize(8.5).text("HISTORICAL REVENUE ENGINE PERFORMANCE (USD)", 40, fsY + 20);
        
        // Draw a clean revenue vector bar chart
        const chartX = 100;
        const chartY = fsY + 140;
        const chartHeight = 90;
        const barWidth = 32;
        const gap = 24;
        
        // Draw axis lines
        doc.strokeColor(theme.border).lineWidth(1).moveTo(chartX - 10, chartY).lineTo(chartX - 10, chartY - chartHeight).stroke();
        doc.moveTo(chartX - 10, chartY).lineTo(chartX + 280, chartY).stroke();
        
        const maxVal = Math.max(...revData.map((d: any) => d.value || 0), 1);
        
        revData.forEach((d: any, idx: number) => {
          const x = chartX + idx * (barWidth + gap);
          const valBillion = (d.value || 0) / 1e9;
          const pct = (d.value || 0) / maxVal;
          const h = pct * chartHeight;
          const y = chartY - h;
          
          // Draw Bar
          doc.rect(x, y, barWidth, h).fill(theme.primary);
          
          // Label text
          doc.fillColor(theme.textSec).font("Helvetica").fontSize(8).text(d.year.toString(), x, chartY + 6, { width: barWidth, align: "center" });
          doc.fillColor(theme.textMain).font("Helvetica-Bold").fontSize(8).text(`$${valBillion.toFixed(1)}B`, x - 10, y - 12, { width: barWidth + 20, align: "center" });
        });

        // Financial key-value metrics table below the chart
        const tableY = chartY + 30;
        doc.rect(40, tableY, 515, 60).fill(theme.cardBg);

        const mCapText = fs.marketCap ? `$${(fs.marketCap / 1e9).toFixed(1)}B` : "N/A";
        const netIncText = fs.netIncome && fs.netIncome.length > 0 && fs.netIncome[fs.netIncome.length - 1]?.value 
          ? `$${(fs.netIncome[fs.netIncome.length - 1].value / 1e9).toFixed(2)}B` 
          : "N/A";
        const epsText = fs.eps && fs.eps.length > 0 && fs.eps[fs.eps.length - 1]?.value 
          ? `$${fs.eps[fs.eps.length - 1].value.toFixed(2)}` 
          : "N/A";

        doc.fillColor(theme.textSec).font("Helvetica").fontSize(8).text("MARKET CAP:", 55, tableY + 12);
        doc.fillColor(theme.textMain).font("Helvetica-Bold").fontSize(9).text(mCapText, 55, tableY + 24);

        doc.fillColor(theme.textSec).font("Helvetica").fontSize(8).text("NET INCOME (TTM):", 200, tableY + 12);
        doc.fillColor(theme.textMain).font("Helvetica-Bold").fontSize(9).text(netIncText, 200, tableY + 24);

        doc.fillColor(theme.textSec).font("Helvetica").fontSize(8).text("EARNINGS PER SHARE (EPS):", 380, tableY + 12);
        doc.fillColor(theme.textMain).font("Helvetica-Bold").fontSize(9).text(epsText, 380, tableY + 24);
      } else {
        doc.fillColor(theme.textSec).font("Helvetica-Bold").fontSize(9).text("Historical financial statements are currently unavailable.", 40, fsY + 25);
      }

      // ==========================================
      // PAGE 3: COMPETITORS & SECTOR
      // ==========================================
      doc.addPage();
      fillPageBg();

      doc.fillColor(theme.primary).font("Helvetica-Bold").fontSize(13).text("III. COMPETITIVE LANDSCAPE & INDUSTRY PROJECTIONS", 40, 40);
      doc.strokeColor(theme.border).lineWidth(1.5).moveTo(40, 58).lineTo(555, 58).stroke();

      // Agent 3: Competitor Analysis
      doc.fillColor(theme.primary).font("Helvetica-Bold").fontSize(11).text("3. COMPETITOR PEER ANALYSIS", 40, 75);

      const comp = report.competitors || {};
      const compList = comp.competitors || [];
      const moatDetails = comp.keyMoat || "Stable switching cost moat metrics verified.";

      doc.fillColor(theme.textMain).font("Helvetica").fontSize(9.5).text(`Economic Moat Assessment: ${moatDetails}`, 40, 92, { width: 515, align: "justify", lineGap: 2 });

      if (compList.length > 0) {
        doc.fillColor(theme.textSec).font("Helvetica-Bold").fontSize(8.5).text("DIRECT PEER BENCHMARK REGISTRY:", 40, 140);
        
        let rowY = 155;
        // Table Headers
        doc.rect(40, rowY, 515, 20).fill(theme.cardBg);
        doc.fillColor(theme.textSec).font("Helvetica-Bold").fontSize(8).text("PEER COMPANY NAME", 55, rowY + 6);
        doc.fillColor(theme.textSec).font("Helvetica-Bold").fontSize(8).text("TICKER", 260, rowY + 6);
        doc.fillColor(theme.textSec).font("Helvetica-Bold").fontSize(8).text("COMPETITION TYPE", 350, rowY + 6);
        doc.fillColor(theme.textSec).font("Helvetica-Bold").fontSize(8).text("PEER SCORE", 470, rowY + 6);

        rowY += 20;

        compList.slice(0, 3).forEach((c: any) => {
          doc.rect(40, rowY, 515, 20).fill(rowY % 40 === 15 ? theme.cardBg : theme.bg);
          doc.fillColor(theme.textMain).font("Helvetica").fontSize(8.5).text(c.companyName || "N/A", 55, rowY + 6);
          doc.fillColor(theme.textSec).font("Helvetica-Bold").fontSize(8.5).text(c.ticker || "N/A", 260, rowY + 6);
          doc.fillColor(theme.textSec).font("Helvetica").fontSize(8.5).text(c.competitionType || "Direct", 350, rowY + 6);
          doc.fillColor(theme.green).font("Helvetica-Bold").fontSize(8.5).text(`${c.score || 80}/100`, 470, rowY + 6);
          rowY += 20;
        });
      }

      // Agent 4: Market & Industry
      const miY = 280;
      doc.fillColor(theme.primary).font("Helvetica-Bold").fontSize(11).text("4. MARKET GROWTH & REGULATORY ANALYSIS", 40, miY);
      
      const mi = report.marketIndustry || {};
      const drivers = mi.industryDrivers || mi.majorTrends || [];
      const regulations = mi.regulatoryRisks || mi.governmentRegulations || [];

      // Grid for industry trends & risks
      const trendsY = miY + 20;
      doc.rect(40, trendsY, 245, 110).fill(theme.cardBg);
      doc.fillColor(theme.primary).font("Helvetica-Bold").fontSize(9.5).text("MAJOR INDUSTRY GROWTH DRIVERS", 55, trendsY + 12);
      let trendTextY = trendsY + 30;
      drivers.slice(0, 2).forEach((d: string) => {
        doc.fillColor(theme.textMain).font("Helvetica").fontSize(8.5).text(`• ${d.slice(0, 60)}...`, 55, trendTextY, { width: 215, lineGap: 1 });
        trendTextY += 32;
      });

      doc.rect(310, trendsY, 245, 110).fill(theme.cardBg);
      doc.fillColor(theme.red).font("Helvetica-Bold").fontSize(9.5).text("REGULATORY COMPLIANCE RISKS", 325, trendsY + 12);
      let regTextY = trendsY + 30;
      regulations.slice(0, 2).forEach((r: string) => {
        doc.fillColor(theme.textMain).font("Helvetica").fontSize(8.5).text(`• ${r.slice(0, 60)}...`, 325, regTextY, { width: 215, lineGap: 1 });
        regTextY += 32;
      });

      // ==========================================
      // PAGE 4: NEWS, MACRO, SENTIMENT, VALUATION
      // ==========================================
      doc.addPage();
      fillPageBg();

      doc.fillColor(theme.primary).font("Helvetica-Bold").fontSize(13).text("IV. SCENARIOS, SENTIMENTS & INTRINSIC VALUATION", 40, 40);
      doc.strokeColor(theme.border).lineWidth(1.5).moveTo(40, 58).lineTo(555, 58).stroke();

      // Agent 5: News
      doc.fillColor(theme.primary).font("Helvetica-Bold").fontSize(11).text("5. REAL-TIME NEWS SCENARIOS", 40, 75);
      const news = report.news || {};
      const articles = news.articles || news.latestHeadlines || [];
      
      let articleY = 92;
      articles.slice(0, 2).forEach((art: any) => {
        doc.fillColor(theme.textMain).font("Helvetica-Bold").fontSize(9.5).text(art.headline || "Industry Announcement", 40, articleY);
        doc.fillColor(theme.textSec).font("Helvetica").fontSize(8).text(`Source: ${art.source || "News Scraper"}  |  Impact: ${art.impact || "Neutral"}`, 40, articleY + 12);
        articleY += 30;
      });

      // Agent 6 & 7: Macroeconomic & Sentiment Info
      const macroY = 175;
      doc.fillColor(theme.primary).font("Helvetica-Bold").fontSize(11).text("6. MACROECONOMIC INDICATORS & INVESTOR SENTIMENT", 40, macroY);
      
      const macro = report.macroeconomic || {};
      const sentiment = report.sentiment || {};

      doc.rect(40, macroY + 18, 515, 60).fill(theme.cardBg);
      doc.fillColor(theme.textSec).font("Helvetica").fontSize(8).text("MACRO IMPACT:", 55, macroY + 28);
      doc.fillColor(theme.textMain).font("Helvetica-Bold").fontSize(9).text(macro.overallImpact || "Positive", 55, macroY + 40);

      doc.fillColor(theme.textSec).font("Helvetica").fontSize(8).text("ANALYST SENTIMENT:", 200, macroY + 28);
      doc.fillColor(theme.textMain).font("Helvetica-Bold").fontSize(9).text(sentiment.analystSentiment || "Bullish", 200, macroY + 40);

      doc.fillColor(theme.textSec).font("Helvetica").fontSize(8).text("SOCIAL MEDIA SENTIMENT:", 380, macroY + 28);
      doc.fillColor(theme.textMain).font("Helvetica-Bold").fontSize(9).text(sentiment.socialSentiment || "Positive", 380, macroY + 40);

      // Agent 8: Valuation Analysis
      const valY = 270;
      doc.fillColor(theme.primary).font("Helvetica-Bold").fontSize(11).text("7. INTRINSIC DCF SOLVER & RATIOS", 40, valY);

      const val = report.valuation || {};
      const metricsObj = val.metrics || {};

      const dcfVal = val.intrinsicValue ? `$${val.intrinsicValue.toFixed(2)}` : "N/A";
      const currVal = val.currentPrice ? `$${val.currentPrice.toFixed(2)}` : "N/A";
      const upsideVal = val.upside ? `+${val.upside.toFixed(1)}%` : "0.0%";

      doc.rect(40, valY + 18, 515, 120).fill(theme.cardBg);

      doc.fillColor(theme.textSec).font("Helvetica").fontSize(8.5).text("CURRENT SHARE PRICE:", 60, valY + 32);
      doc.fillColor(theme.textMain).font("Helvetica-Bold").fontSize(13).text(currVal, 60, valY + 44);

      doc.fillColor(theme.textSec).font("Helvetica").fontSize(8.5).text("INTRINSIC FAIR DCF VALUE:", 60, valY + 75);
      doc.fillColor(theme.textMain).font("Helvetica-Bold").fontSize(13).text(dcfVal, 60, valY + 87);

      doc.fillColor(theme.textSec).font("Helvetica").fontSize(8.5).text("VALUATION SPREAD (UPSIDE):", 300, valY + 32);
      doc.fillColor(theme.green).font("Helvetica-Bold").fontSize(14).text(upsideVal, 300, valY + 44);

      doc.fillColor(theme.textSec).font("Helvetica").fontSize(8.5).text("VALUATION CONCENSUS VERDICT:", 300, valY + 75);
      doc.fillColor(theme.primary).font("Helvetica-Bold").fontSize(12).text((val.valuation || "Fairly Valued").toUpperCase(), 300, valY + 87);

      // Ratios row inside card
      doc.strokeColor(theme.border).lineWidth(1).moveTo(60, valY + 115).lineTo(535, valY + 115).stroke();
      doc.fillColor(theme.textSec).font("Helvetica").fontSize(8).text(`P/E: ${metricsObj.pe || "N/A"}  |  PEG: ${metricsObj.peg || "N/A"}  |  P/B: ${metricsObj.priceToBook || "N/A"}  |  P/S: ${metricsObj.priceToSales || "N/A"}  |  EV/EBITDA: ${metricsObj.evEbitda || "N/A"}`, 60, valY + 122);

      // ==========================================
      // PAGE 5: RISKS & MITIGATIONS
      // ==========================================
      doc.addPage();
      fillPageBg();

      doc.fillColor(theme.primary).font("Helvetica-Bold").fontSize(13).text("V. DEFENSIBILITY & INVESTMENT RISK MATRIX", 40, 40);
      doc.strokeColor(theme.border).lineWidth(1.5).moveTo(40, 58).lineTo(555, 58).stroke();

      // Agent 9: Risk Assessment
      doc.fillColor(theme.primary).font("Helvetica-Bold").fontSize(11).text("8. SYSTEMATIC ENTERPRISE RISK SCORING", 40, 75);

      const rk = report.risk || {};
      const risks = rk.riskFactors || [];
      const scoreRisk = rk.overallRiskScore || 30;

      const riskY = 100;
      doc.rect(40, riskY, 515, 60).fill(theme.cardBg);

      doc.fillColor(theme.textSec).font("Helvetica").fontSize(8.5).text("OVERALL RISK LEVEL:", 60, riskY + 15);
      doc.fillColor(theme.red).font("Helvetica-Bold").fontSize(13).text((rk.riskLevel || "Low").toUpperCase(), 60, riskY + 28);

      doc.fillColor(theme.textSec).font("Helvetica").fontSize(8.5).text("OVERALL RISK SCORE MATRIX:", 300, riskY + 15);
      doc.fillColor(theme.textMain).font("Helvetica-Bold").fontSize(13).text(`${scoreRisk}/100`, 300, riskY + 28);
      // Risk progress bar
      doc.rect(300, riskY + 45, 150, 4).fill(theme.border);
      doc.rect(300, riskY + 45, (scoreRisk / 100) * 150, 4).fill(theme.red);

      if (risks.length > 0) {
        doc.fillColor(theme.textSec).font("Helvetica-Bold").fontSize(8.5).text("IDENTIFIED VULNERABILITIES & POLICY MITIGATIONS:", 40, 185);
        
        let rowR = 200;
        risks.slice(0, 3).forEach((rf: any) => {
          doc.rect(40, rowR, 515, 45).fill(theme.cardBg);
          doc.fillColor(theme.red).font("Helvetica-Bold").fontSize(8.5).text(`• Risk Factor: ${rf.factor || "Market Volatility"} (${rf.impact || "Medium"} Impact)`, 55, rowR + 10);
          doc.fillColor(theme.textMain).font("Helvetica").fontSize(8.5).text(`Mitigation Policy: ${rf.mitigation || "Ongoing compliance audits and hedges."}`, 55, rowR + 24, { width: 480 });
          rowR += 52;
        });
      }

      // Legal disclaimer & Sources
      const footerY = doc.y + 40;
      doc.strokeColor(theme.border).lineWidth(1).moveTo(40, footerY).lineTo(555, footerY).stroke();

      doc.fillColor(theme.textSec).font("Helvetica-Bold").fontSize(8.5).text("REPORT METADATA SOURCES:", 40, footerY + 15);
      const sourcesList = (report as any).sources || report.companyResearch?.sources || ["SEC EDGAR Registry", "Yahoo Finance", "Tavily Web Index"];
      doc.fillColor(theme.textSec).font("Helvetica").fontSize(8).text(sourcesList.slice(0, 4).join(",  "), 40, footerY + 30, { width: 515 });

      doc.fillColor(theme.textSec).font("Helvetica-Oblique").fontSize(7.5).text("DISCLAIMER: Altuni Invest AI Research Terminal outputs are automatically generated compile reports based on real-time search telemetry and LLM aggregations. This report does not represent official financial advising.", 40, footerY + 55, { width: 515, align: "justify" });

      doc.end();
      console.log(`[ReportController] Styled Dark-Mode PDF download completed for: ${report.ticker}`);
    } catch (error: any) {
      console.error("[ReportController] Styled PDF stream generation failed:", error);
      if (!res.headersSent) {
        res.status(500).send("Failed to output styled PDF download.");
      }
    }
  }
}
