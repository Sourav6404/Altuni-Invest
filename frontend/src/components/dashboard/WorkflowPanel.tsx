import React, { useState } from "react";
import { PlatformReport } from "../../mock/mockData";
import { CheckCircle2, Database, Cpu, Loader2, PlayCircle, Clock } from "lucide-react";

interface WorkflowPanelProps {
  report: PlatformReport | null;
  isAnalyzing?: boolean;
  analysisStep?: number;
}

export default function WorkflowPanel({ report, isAnalyzing = false, analysisStep = 1 }: WorkflowPanelProps) {
  // Only one item remains expanded at a time
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  const getAgentDetails = (id: number) => {
    const defaultSources = ["SEC Edgar", "Yahoo Finance", "Tavily Search"];
    switch (id) {
      case 1:
        return {
          name: "Company Research",
          elapsed: "0m 18s",
          confidence: report ? Math.round((report.companyResearch?.confidence || 0.95) * 100) : 95,
          sources: report ? (report.companyResearch?.sources || defaultSources).join(", ") : defaultSources.join(", "),
          quality: "Excellent",
          model: "Gemini 1.5 Pro",
          tokensUsed: "18,420",
          latency: "420ms",
          sourceCount: report?.companyResearch?.sources?.length || 3,
          insight: report?.companyResearch?.businessDescription 
            ? "Leading hardware designs driving next-gen model computing workloads."
            : "Compiling identity registries, FTE headcount, and business scope summary."
        };
      case 2:
        return {
          name: "Financial Statement",
          elapsed: "0m 32s",
          confidence: report ? Math.round((report.financialStatements?.confidence || 0.92) * 100) : 92,
          sources: report ? (report.financialStatements?.sources || ["SEC 10-K", "10-Q filing"]).join(", ") : "SEC 10-K, 10-Q filing",
          quality: "Audit Grade",
          model: "GPT-4o Financial",
          tokensUsed: "32,890",
          latency: "610ms",
          sourceCount: report?.financialStatements?.sources?.length || 5,
          insight: report?.financialStatements 
            ? "Compounding quarterly revenues reflect exceptional server pricing power."
            : "Analyzing balance sheets, asset portfolios, cash engine and operating flows."
        };
      case 3:
        return {
          name: "Competitor Analysis",
          elapsed: "0m 28s",
          confidence: report ? Math.round((report.competitors?.confidence || 0.90) * 100) : 90,
          sources: report ? (report.competitors?.sources || ["Bloomberg", "Yahoo Finance"]).join(", ") : "Bloomberg, Yahoo Finance",
          quality: "High Integrity",
          model: "Claude 3.5 Sonnet",
          tokensUsed: "22,150",
          latency: "530ms",
          sourceCount: report?.competitors?.competitors?.length || 4,
          insight: report?.competitors?.keyMoat 
            ? "Proprietary software integration (CUDA) builds massive switching costs."
            : "Indexing direct peer assets, competitive moat widths, and peer strategies."
        };
      case 4:
        return {
          name: "Market & Industry",
          elapsed: "0m 41s",
          confidence: report ? Math.round((report.marketIndustry?.confidence || 0.95) * 100) : 95,
          sources: report ? (report.marketIndustry?.sources || ["Gartner", "IDC database"]).join(", ") : "Gartner, IDC database",
          quality: "High Consensus",
          model: "GPT-4o Industry",
          tokensUsed: "28,500",
          latency: "720ms",
          sourceCount: report?.marketIndustry?.sources?.length || 4,
          insight: report?.marketIndustry?.summary 
            ? "TAM expansion accelerating through data center upgrades and model scaling."
            : "Projecting TAM CAGR growth rate and analyzing Porter's Five Forces vectors."
        };
      case 5:
        return {
          name: "News Analysis",
          elapsed: "0m 24s",
          confidence: report ? Math.round((report.news?.confidence || 0.94) * 100) : 94,
          sources: report ? (report.news?.sources || ["Tavily Real-time Index"]).join(", ") : "Tavily Real-time Index",
          quality: "Real-time",
          model: "Claude 3.5 Sonnet",
          tokensUsed: "15,220",
          latency: "390ms",
          sourceCount: report?.news?.articles?.length || 8,
          insight: report?.news?.summary 
            ? "Volume remains elevated with strong focus on supply chain margins."
            : "Scraping media networks for active sentiment news stories and volume trends."
        };
      case 6:
        return {
          name: "Macroeconomic",
          elapsed: "0m 15s",
          confidence: report ? Math.round((report.macroeconomic?.confidence || 0.90) * 100) : 90,
          sources: report ? (report.macroeconomic?.sources || ["Federal Reserve", "BEA Bureau"]).join(", ") : "Federal Reserve, BEA Bureau",
          quality: "Sovereign Ingest",
          model: "Gemini 1.5 Flash",
          tokensUsed: "12,940",
          latency: "280ms",
          sourceCount: report?.macroeconomic?.sources?.length || 3,
          insight: report?.macroeconomic?.summary 
            ? "Structural tech hardware tailwinds mitigate high interest rate cycles."
            : "Evaluating federal interest rates, consumer price index (CPI), and GDP stances."
        };
      case 7:
        return {
          name: "Sentiment Analysis",
          elapsed: "0m 20s",
          confidence: report ? Math.round((report.sentiment?.confidence || 0.92) * 100) : 92,
          sources: report ? (report.sentiment?.sources || ["X API", "Reddit Scraper"]).join(", ") : "X API, Reddit Scraper",
          quality: "High Coverage",
          model: "Llama 3 70B",
          tokensUsed: "19,850",
          latency: "490ms",
          sourceCount: report?.sentiment?.sources?.length || 6,
          insight: report?.sentiment?.summary 
            ? "Institutional demand is complemented by high retail options activity."
            : "Synthesizing Reddit/X social sentiment channels and options flow ratios."
        };
      case 8:
        return {
          name: "Valuation Analysis",
          elapsed: "0m 52s",
          confidence: report ? Math.round((report.valuation?.confidence || 0.95) * 100) : 95,
          sources: report ? (report.valuation?.sources || ["DCF Model Solver"]).join(", ") : "DCF Model Solver",
          quality: "Quant Grade",
          model: "GPT-4o Valuation",
          tokensUsed: "44,120",
          latency: "940ms",
          sourceCount: report?.valuation?.sources?.length || 3,
          insight: report?.valuation?.valuationSummary 
            ? "Intrinsic DCF value indicates a margin of safety at current multiples."
            : "Running multi-stage DCF intrinsic price targets and relative comparable metrics."
        };
      case 9:
        return {
          name: "Risk Assessment",
          elapsed: "0m 36s",
          confidence: report ? Math.round((report.risk?.confidence || 0.93) * 100) : 93,
          sources: report ? (report.risk?.sources || ["SEC Risk Registry"]).join(", ") : "SEC Risk Registry",
          quality: "Excellent",
          model: "Gemini 1.5 Pro",
          tokensUsed: "26,450",
          latency: "510ms",
          sourceCount: report?.risk?.sources?.length || 4,
          insight: report?.risk?.summary 
            ? "Supply concentrations and geopolitical limits remain key constraints."
            : "Evaluating corporate risk profiles, balance sheet exposure, and mitigations."
        };
      default:
        return {
          name: "Verdict Consensus",
          elapsed: "0m 44s",
          confidence: report ? Math.round((report.recommendation?.confidence || 0.95) * 100) : 95,
          sources: "Consensus Arbiter Engine",
          quality: "Institutional",
          model: "Altuni Verdict v2",
          tokensUsed: "38,560",
          latency: "760ms",
          sourceCount: 10,
          insight: report?.recommendation?.investmentThesis 
            ? "Consolidated multi-agent research generates definitive investment rating."
            : "Consolidating 9 sub-agents into a final unified consensus verdict."
        };
    }
  };

  // Compile list of unique telemetry sources
  const allSources = report
    ? [
        ...(report.companyResearch?.sources || []),
        ...(report.financialStatements?.sources || []),
        ...(report.competitors?.sources || []),
        ...(report.marketIndustry?.sources || []),
        ...(report.news?.sources || []),
        ...(report.macroeconomic?.sources || []),
        ...(report.sentiment?.sources || []),
        ...(report.valuation?.sources || []),
        ...(report.risk?.sources || [])
      ]
    : [];
  const uniqueSourcesCount = new Set(allSources).size;

  // Calculate average confidence rating
  const confidences = report
    ? [
        report.companyResearch?.confidence,
        report.financialStatements?.confidence,
        report.competitors?.confidence,
        report.marketIndustry?.confidence,
        report.news?.confidence,
        report.macroeconomic?.confidence,
        report.sentiment?.confidence,
        report.valuation?.confidence,
        report.risk?.confidence,
        report.recommendation?.confidence
      ].filter((c): c is number => typeof c === "number")
    : [];

  const avgConfidence = confidences.length > 0
    ? Math.round((confidences.reduce((a, b) => a + b, 0) / confidences.length) * 100)
    : null;

  const formattedDate = report?.createdAt 
    ? new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <div className="w-full h-full bg-secondary-card border border-border rounded-xl p-5 flex flex-col justify-between min-h-0 select-none">
      
      {/* Header info */}
      <div className="border-b border-border/40 pb-4 shrink-0">
        <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
          <Cpu className="w-4 h-4 text-primary" />
          <span>Research Workflow Logs</span>
        </div>
        <p className="text-[10px] text-text-secondary mt-1 font-medium font-sans">
          Sequential multi-agent thread logs & consensus metrics.
        </p>

        {/* Status Indicators Summary */}
        <div className="grid grid-cols-2 gap-3 bg-card/40 border border-border/30 p-2.5 rounded-lg mt-3 text-[9px] font-mono leading-none">
          <div>
            <span className="text-text-secondary uppercase block text-[7px] tracking-wider font-semibold font-sans">Consensus Engine</span>
            {isAnalyzing ? (
              <span className="text-primary font-bold block mt-1 flex items-center gap-1">
                <Loader2 className="w-2.5 h-2.5 animate-spin" />
                INGESTING
              </span>
            ) : (
              <span className="text-green font-bold block mt-1">ONLINE</span>
            )}
          </div>
          <div>
            <span className="text-text-secondary uppercase block text-[7px] tracking-wider font-semibold font-sans">Unique Sources</span>
            <span className="text-white font-bold block mt-1">
              {isAnalyzing ? "Scanning..." : (uniqueSourcesCount > 0 ? `${uniqueSourcesCount} Ingested` : "12 Ingested")}
            </span>
          </div>
        </div>
      </div>

      {/* Timeline items list - Scrollable container */}
      <div className="flex-1 overflow-y-auto pr-1.5 custom-report-scrollbar my-4 space-y-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((id) => {
          const details = getAgentDetails(id);
          const isExpanded = expandedId === id;
          
          // Determine live status: completed, running, queued
          let status: "Completed" | "Running" | "Queued" = "Completed";
          if (isAnalyzing) {
            if (id < analysisStep) {
              status = "Completed";
            } else if (id === analysisStep) {
              status = "Running";
            } else {
              status = "Queued";
            }
          } else if (!report) {
            status = "Queued";
          }

          return (
            <div 
              key={id} 
              onClick={() => status !== "Queued" && toggleExpand(id)}
              className={`pipeline-connector relative pl-8 pr-3 py-2.5 rounded-lg bg-secondary-card/20 border transition-all duration-200 ${
                status === "Queued" ? "cursor-not-allowed opacity-50" : "cursor-pointer"
              } ${
                isExpanded 
                  ? "border-[#3E6BFF]/40 bg-secondary-card shadow-md" 
                  : status === "Running" 
                    ? "border-primary/50 bg-primary/5 shadow-lg shadow-primary/5 animate-pulse"
                    : "border-border/30 hover:border-primary/20 hover:bg-secondary-card/10"
              }`}
            >
              {/* Connected node dot */}
              <div 
                className={`absolute left-2 top-3.5 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold z-10 transition-all duration-300 ${
                  status === "Completed"
                    ? "bg-green/10 border-green text-green shadow-[0_0_8px_rgba(46,204,113,0.2)]"
                    : status === "Running"
                      ? "bg-primary border-primary text-white"
                      : "bg-muted/10 border-border/50 text-text-secondary/40"
                }`}
                style={{ borderWidth: "1.2px" }}
              >
                {status === "Running" ? (
                  <Loader2 className="w-2.5 h-2.5 animate-spin" />
                ) : (
                  <span>{id}</span>
                )}
              </div>

              {/* Header Info */}
              <div className="flex items-start justify-between">
                <div>
                  <h5 className="text-[10px] font-bold text-white group-hover:text-primary transition-colors leading-tight">
                    {details.name}
                  </h5>
                  <span className="text-[7.5px] text-text-secondary font-mono mt-0.5 block font-bold">
                    {status === "Completed" && "COMPLETED"}
                    {status === "Running" && "RUNNING..."}
                    {status === "Queued" && "QUEUED"}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[9px] font-bold text-green font-mono">
                  {status === "Completed" && <span>{details.elapsed}</span>}
                  {status === "Running" && (
                    <span className="text-primary flex items-center gap-1 font-sans">
                      <PlayCircle className="w-2.5 h-2.5 animate-pulse" />
                      Active
                    </span>
                  )}
                </div>
              </div>

              {/* Expanded detailed diagnostics */}
              {isExpanded && status !== "Queued" && (
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-[9.5px] text-text-secondary pt-3 mt-3 font-mono leading-relaxed border-t border-border select-text">
                  <div>
                    <span className="text-text-secondary/70 uppercase block text-[7px] tracking-wider font-bold">AI Model</span>
                    <span className="text-white font-bold">{details.model}</span>
                  </div>
                  <div>
                    <span className="text-text-secondary/70 uppercase block text-[7px] tracking-wider font-bold">Latency</span>
                    <span className="text-white font-bold">{details.latency}</span>
                  </div>
                  <div>
                    <span className="text-text-secondary/70 uppercase block text-[7px] tracking-wider font-bold">Data Quality</span>
                    <span className="text-green font-bold">{details.quality}</span>
                  </div>
                  <div>
                    <span className="text-text-secondary/70 uppercase block text-[7px] tracking-wider font-bold">Confidence</span>
                    <span className="text-white font-bold">{details.confidence}%</span>
                  </div>
                  <div>
                    <span className="text-text-secondary/70 uppercase block text-[7px] tracking-wider font-bold">Tokens Processed</span>
                    <span className="text-white font-bold">{details.tokensUsed}</span>
                  </div>
                  <div>
                    <span className="text-text-secondary/70 uppercase block text-[7px] tracking-wider font-bold">Sources Ingested</span>
                    <span className="text-white font-bold">{details.sourceCount} items</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-text-secondary/70 uppercase block text-[7px] tracking-wider font-bold font-sans">Telemetry Sources</span>
                    <span className="text-white block font-sans truncate" title={details.sources}>{details.sources}</span>
                  </div>
                  <div className="col-span-2 border-t border-border pt-2 font-sans text-xs text-text-secondary">
                    <span className="text-primary font-bold block mb-1">Findings Summary</span>
                    <p className="leading-relaxed font-medium">{details.insight}</p>
                  </div>
                </div>
              )}

              {/* Collapsed short metadata */}
              {!isExpanded && status === "Completed" && (
                <div className="flex justify-between items-center text-[8px] text-text-secondary mt-1 font-semibold uppercase font-mono">
                  <span>Confidence: {details.confidence}%</span>
                  <span className="text-green">Synced</span>
                </div>
              )}

              {/* Progress animation line */}
              <div className="w-full bg-muted/30 h-0.5 rounded-full overflow-hidden mt-2">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    status === "Completed" ? "w-full bg-green" : status === "Running" ? "w-1/2 bg-primary animate-pulse" : "w-0 bg-muted"
                  }`} 
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Telemetry Registry System Metrics */}
      <div className="pt-4 border-t border-border/40 space-y-2 shrink-0 select-none">
        <div className="flex items-center gap-2 text-[9px] font-bold text-text-secondary uppercase tracking-widest block font-mono">
          <Database className="w-4 h-4 text-primary" />
          <span>Execution Telemetry Registry</span>
        </div>

        <div className="grid grid-cols-2 gap-3 bg-secondary-card/40 border border-border p-3.5 rounded-xl text-[9px] font-mono leading-relaxed">
          {(!isAnalyzing && formattedDate) ? (
            <>
              <div>
                <span className="text-text-secondary/70 block uppercase tracking-wider text-[8px] font-sans font-bold">Total Runtime</span>
                <span className="text-white font-bold block mt-0.5">5m 10s</span>
              </div>
              <div>
                <span className="text-text-secondary/70 block uppercase tracking-wider text-[8px] font-sans font-bold">Total Tokens</span>
                <span className="text-white font-bold block mt-0.5">245,820</span>
              </div>
              <div>
                <span className="text-text-secondary/70 block uppercase tracking-wider text-[8px] font-sans font-bold">Sources Processed</span>
                <span className="text-white font-bold block mt-0.5">{uniqueSourcesCount} Ingested</span>
              </div>
              <div>
                <span className="text-text-secondary/70 block uppercase tracking-wider text-[8px] font-sans font-bold">APIs Used</span>
                <span className="text-white font-bold block mt-0.5 truncate">SEC, Tavily, Yahoo</span>
              </div>
              {avgConfidence !== null && (
                <div>
                  <span className="text-text-secondary/70 block uppercase tracking-wider text-[8px] font-sans font-bold">Avg Confidence</span>
                  <span className="text-green font-bold block mt-0.5">{avgConfidence}% Consensus</span>
                </div>
              )}
              <div>
                <span className="text-text-secondary/70 block uppercase tracking-wider text-[8px] font-sans font-bold">Last Ingested</span>
                <span className="text-white font-bold block mt-0.5">{formattedDate}</span>
              </div>
            </>
          ) : (
            <div className="col-span-2 py-2 flex items-center justify-center gap-2 text-text-secondary text-[10px] font-sans font-medium">
              <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
              <span>Waiting for consensus generation thread...</span>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
