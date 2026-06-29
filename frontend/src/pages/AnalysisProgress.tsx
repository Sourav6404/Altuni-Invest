import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { 
  Building, 
  Wallet, 
  Users, 
  Globe, 
  Newspaper, 
  TrendingUp, 
  Shield, 
  Calculator, 
  Heart, 
  Award,
  Loader2,
  XCircle,
  CheckCircle2
} from "lucide-react";

interface AgentProgress {
  name: string;
  key: string;
  icon: React.ComponentType<any>;
  logs: string[];
}

const AGENTS_LIST: AgentProgress[] = [
  {
    name: "Company Research Agent",
    key: "research",
    icon: Building,
    logs: [
      "Targeting official company websites and SEC EDGAR registers...",
      "Extracting leadership details, business models, and operational profiles...",
      "Generating business profile structures and operating regions maps..."
    ]
  },
  {
    name: "Financial Statement Agent",
    key: "financials",
    icon: Wallet,
    logs: [
      "Accessing historical income statements, balance sheets, and cash flow reports...",
      "Calculating debt-to-equity ratios, return metrics (ROE, ROA), and operating margins...",
      "Analyzing 5-year compounding growth rates and asset configurations..."
    ]
  },
  {
    name: "Competitor Analysis Agent",
    key: "competitor",
    icon: Users,
    logs: [
      "Mapping direct and indirect industry peers...",
      "Calculating benchmark metrics, market share portions, and price relative bounds...",
      "Synthesizing corporate strengths, weaknesses, and product moats..."
    ]
  },
  {
    name: "Market & Industry Agent",
    key: "market",
    icon: Globe,
    logs: [
      "Accessing sector databases, TAM projections, and macro industry forecasts...",
      "Parsing competitive forces (Porter's Five Forces model)...",
      "Identifying growth drivers and structural regulatory adjustments..."
    ]
  },
  {
    name: "News Agent",
    key: "news",
    icon: Newspaper,
    logs: [
      "Scraping current financial reports, media announcements, and headlines...",
      "Calculating news volume parameters and relevance index numbers...",
      "Synthesizing news impact indicators on commercial pipelines..."
    ]
  },
  {
    name: "Macroeconomic Agent",
    key: "macro",
    icon: TrendingUp,
    logs: [
      "Analyzing Federal Reserve interest rate directives and policy forecasts...",
      "Reading inflation indexes, national GDP curves, and exchange rate grids...",
      "Synthesizing macroeconomic risks on enterprise business scopes..."
    ]
  },
  {
    name: "Sentiment Analysis Agent",
    key: "sentiment",
    icon: Heart,
    logs: [
      "Aggregating Twitter, Reddit, and Stocktwits sentiment markers...",
      "Parsing analyst rating shifts, upgrades/downgrades ratios...",
      "Plotting public sentiment timelines and fear/greed levels..."
    ]
  },
  {
    name: "Valuation Agent",
    key: "valuation",
    icon: Calculator,
    logs: [
      "Running multi-stage Discounted Cash Flow (DCF) modeling algorithms...",
      "Calculating peer multiple valuations (P/E, P/S, EV/EBITDA projections)...",
      "Plotting intrinsic value bounds and upside potential spreads..."
    ]
  },
  {
    name: "Risk Assessment Agent",
    key: "risk",
    icon: Shield,
    logs: [
      "Synthesizing financial, competitive, regulatory, and market risks...",
      "Structuring overall risk metrics and probability curves...",
      "Detailing mitigation plans and asset defensive postures..."
    ]
  },
  {
    name: "Investment Recommendation Agent",
    key: "recommendation",
    icon: Award,
    logs: [
      "Consolidating outputs from all 9 research agents...",
      "Running investment committee consensus logic for final recommendation...",
      "Structuring executive report briefs, catalyst trackers, and stop-loss targets..."
    ]
  }
];

export default function AnalysisProgress() {
  const { analysisStep, cancelAnalysis, searchQuery } = useApp();
  const [activeLog, setActiveLog] = useState("");
  const [logIndex, setLogIndex] = useState(0);

  // Rotate logs for the currently running agent
  useEffect(() => {
    if (analysisStep >= 10) return;
    
    const currentAgent = AGENTS_LIST[analysisStep];
    setActiveLog(currentAgent.logs[0]);
    setLogIndex(0);

    const logTimer = setInterval(() => {
      setLogIndex(prev => {
        const next = (prev + 1) % currentAgent.logs.length;
        setActiveLog(currentAgent.logs[next]);
        return next;
      });
    }, 2500);

    return () => clearInterval(logTimer);
  }, [analysisStep]);

  const totalProgress = Math.min(Math.round((analysisStep / 10) * 100), 100);

  return (
    <div className="fixed inset-0 z-50 bg-[#07111E]/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-white overflow-y-auto">
      {/* Background glowing effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-blue/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-4xl glass-panel rounded-2xl border border-border/80 shadow-2xl p-8 relative z-10 flex flex-col min-h-[600px] justify-between">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-border/40 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-blue flex items-center justify-center shadow-lg shadow-primary/25 animate-pulse">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight">AI Multi-Agent Research Pipeline</h2>
              <p className="text-xs text-text-secondary mt-0.5">
                Analyzing: <span className="text-primary font-bold">{searchQuery || "Target Asset"}</span>
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-extrabold text-primary">{totalProgress}%</span>
            <span className="text-[10px] text-text-secondary block font-semibold uppercase tracking-wider">Completed</span>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full bg-muted rounded-full h-2 mt-6 overflow-hidden border border-border/20">
          <div 
            className="bg-gradient-to-r from-primary via-blue to-green h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${totalProgress}%` }}
          />
        </div>

        {/* Active Log Terminal Screen */}
        <div className="bg-muted/80 border border-border/30 rounded-xl p-5 my-6 min-h-[90px] flex items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
          {analysisStep < 10 ? (
            <Loader2 className="w-6 h-6 text-primary animate-spin shrink-0" />
          ) : (
            <CheckCircle2 className="w-6 h-6 text-green shrink-0 animate-bounce" />
          )}
          <div className="flex-1">
            <h4 className="text-xs font-bold text-text-secondary uppercase tracking-widest leading-none">
              {analysisStep < 10 ? AGENTS_LIST[analysisStep].name : "Consensus Achieved"}
            </h4>
            <p className="text-sm font-medium mt-2 text-white/90 leading-relaxed font-mono animate-pulse">
              {analysisStep < 10 ? activeLog : "Structuring institutional final investment report. Redirecting..."}
            </p>
          </div>
          <span className="text-[10px] font-mono text-text-secondary self-end">
            EST: {Math.max((10 - analysisStep) * 2, 1)}s
          </span>
        </div>

        {/* 10 Agents Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 my-3">
          {AGENTS_LIST.map((agent, index) => {
            const Icon = agent.icon;
            let statusClass = "border-border/40 bg-card/25 text-text-secondary";
            let statusText = "Waiting";
            let statusIcon = <div className="w-1.5 h-1.5 rounded-full bg-text-secondary/40" />;

            if (index === analysisStep) {
              statusClass = "border-primary/50 bg-primary/5 text-primary shadow-sm shadow-primary/5";
              statusText = "Analyzing";
              statusIcon = <Loader2 className="w-3.5 h-3.5 animate-spin" />;
            } else if (index < analysisStep) {
              statusClass = "border-green/30 bg-green/5 text-green";
              statusText = "Completed";
              statusIcon = <CheckCircle2 className="w-3.5 h-3.5 text-green" />;
            }

            return (
              <div 
                key={agent.key} 
                className={`border rounded-xl p-3 flex items-center justify-between transition-all duration-300 ${statusClass}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                    index === analysisStep ? "border-primary/30 bg-primary/10" : "border-border/30 bg-muted/40"
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{agent.name}</h4>
                    <span className="text-[10px] block text-text-secondary leading-none mt-0.5">Agent {index + 1} of 10</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  <span className="text-[10px] uppercase tracking-wider">{statusText}</span>
                  {statusIcon}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="border-t border-border/40 pt-5 mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
            <span className="text-[10px] font-mono text-text-secondary uppercase tracking-widest">
              Connecting Tavily Search + Gemini 2.5 Flash
            </span>
          </div>
          <button
            onClick={cancelAnalysis}
            className="flex items-center gap-2 px-4 py-2 border border-red/30 hover:bg-red/10 text-red text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            <XCircle className="w-4 h-4" />
            <span>Abort Analysis</span>
          </button>
        </div>

      </div>
    </div>
  );
}
