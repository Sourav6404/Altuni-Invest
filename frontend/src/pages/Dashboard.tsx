import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import Sidebar from "../components/layout/Sidebar";
import TopNav from "../components/layout/TopNav";
import OverviewCard from "../components/dashboard/OverviewCard";
import RecommendationCard from "../components/dashboard/RecommendationCard";
import AgentCard from "../components/dashboard/AgentCard";
import AgentModal from "../components/dashboard/AgentModal";
import WorkflowPanel from "../components/dashboard/WorkflowPanel";
import QuickActions from "../components/dashboard/QuickActions";
import AIChatAssistant from "../components/dashboard/AIChatAssistant";
import AnimatedNumber from "../components/dashboard/AnimatedNumber";

// Tabs
import HistoryTab from "../components/dashboard/HistoryTab";
import WatchlistTab from "../components/dashboard/WatchlistTab";
import CompareTab from "../components/dashboard/CompareTab";
import PortfolioTab from "../components/dashboard/PortfolioTab";
import ReportsTab from "../components/dashboard/ReportsTab";
import AlertsTab from "../components/dashboard/AlertsTab";
import SettingsTab from "../components/dashboard/SettingsTab";

import { 
  CheckCircle2, 
  HelpCircle, 
  Bookmark,
  Share2,
  AlertTriangle,
  Zap,
  TrendingUp,
  TrendingDown,
  FileText,
  BookOpen,
  Eye,
  Target,
  Award,
  Search,
  Sparkles
} from "lucide-react";

import { API_BASE_URL } from "../config";

export default function Dashboard() {
  const { 
    activeTab, 
    activeReport, 
    saveActiveReport, 
    isCurrentReportSaved, 
    showToast,
    triggerAnalysis,
    isAnalyzing,
    analysisStep
  } = useApp();
  
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeDrawerId, setActiveDrawerId] = useState<number | null>(null);
  const [heroInput, setHeroInput] = useState("");

  const handleShareLink = () => {
    if (activeReport?._id) {
      window.open(`${API_BASE_URL}/api/report/${activeReport._id}/pdf`, "_blank");
      showToast("Generating PDF Research Report...", "success");
    } else {
      showToast("No active report to export.", "warning");
    }
  };

  const getAgentName = (id: number) => {
    const names = [
      "Company Research",
      "Financial Statement",
      "Competitor Analysis",
      "Market & Industry",
      "News Analysis",
      "Macroeconomic",
      "Sentiment Analysis",
      "Valuation Analysis",
      "Risk Assessment",
      "Investment Recommendation"
    ];
    return names[id - 1] || "Agent Report";
  };

  const renderDashboardContent = () => {
    // If not analyzing AND we don't have a report yet, show the centered search landing page
    if (!activeReport && !isAnalyzing) {
      const handleHeroSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (heroInput.trim()) {
          triggerAnalysis(heroInput.trim());
        }
      };

      return (
        <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-8 animate-fade-in">
          {/* Logo / Icon Hero badge */}
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary/20 to-blue-500/20 border border-primary/30 flex items-center justify-center text-primary shadow-lg shadow-primary/5">
            <Sparkles className="w-8 h-8 text-primary animate-pulse" />
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Altuni AI Research Terminal</h2>
            <p className="text-xs text-text-secondary max-w-md mx-auto leading-relaxed font-medium">
              Start by analyzing a public company to generate your first investment report.
            </p>
          </div>

          {/* Large Focused Search Input Bar */}
          <form onSubmit={handleHeroSubmit} className="relative max-w-xl mx-auto flex gap-3.5">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-text-secondary absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={heroInput}
                onChange={(e) => setHeroInput(e.target.value)}
                placeholder="Enter stock ticker or company name (e.g. AAPL, NVIDIA)..."
                className="w-full pl-12 pr-4 py-3.5 bg-[#101B2D] border border-border/85 rounded-2xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all placeholder:text-text-secondary/40 shadow-xl font-medium"
                disabled={isAnalyzing}
              />
            </div>
            <button
              type="submit"
              disabled={isAnalyzing || !heroInput.trim()}
              className="px-6 py-3.5 bg-primary hover:bg-primary/95 text-white text-xs font-bold rounded-2xl transition-all shadow-lg shadow-primary/10 disabled:bg-muted disabled:text-text-secondary/50 disabled:cursor-not-allowed cursor-pointer shrink-0 font-mono tracking-wider uppercase"
            >
              Analyze
            </button>
          </form>

          {/* Guidelines / Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-8 max-w-xl mx-auto">
            <div className="bg-card border border-border/60 rounded-xl p-4 text-left space-y-2">
              <div className="w-7 h-7 rounded bg-primary/10 flex items-center justify-center text-primary">
                <FileText className="w-3.5 h-3.5 animate-pulse" />
              </div>
              <h4 className="text-[10px] font-bold text-white uppercase tracking-wider font-mono">Multi-Agent SEC Analysis</h4>
              <p className="text-[9px] text-text-secondary leading-relaxed font-medium">Scans 10-K, 10-Q reports, competitor metrics, and industry risks in seconds.</p>
            </div>
            <div className="bg-card border border-border/60 rounded-xl p-4 text-left space-y-2">
              <div className="w-7 h-7 rounded bg-green/10 flex items-center justify-center text-green">
                <Target className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-[10px] font-bold text-white uppercase tracking-wider font-mono">Intrinsic DCF Valuation</h4>
              <p className="text-[9px] text-text-secondary leading-relaxed font-medium">Calculates enterprise valuation, price targets, and stop-loss spreads.</p>
            </div>
            <div className="bg-card border border-border/60 rounded-xl p-4 text-left space-y-2">
              <div className="w-7 h-7 rounded bg-[#7A5AF8]/10 flex items-center justify-center text-[#7A5AF8]">
                <Award className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-[10px] font-bold text-white uppercase tracking-wider font-mono">Investment Verdicts</h4>
              <p className="text-[9px] text-text-secondary leading-relaxed font-medium">Delivers clear decisions: HOLD, INVEST, AVOID, or research recommendations.</p>
            </div>
          </div>
        </div>
      );
    }

    const showLoadingSkeletons = isAnalyzing || !activeReport;
    const reportData = showLoadingSkeletons ? null : activeReport;
    const rec = reportData?.recommendation;

    return (
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-5 items-start animate-fade-in relative">
        
        {/* Left Columns - Main Cockpit (Overview, Rec, Agent Cards, Executive Summary) */}
        <div className="xl:col-span-3 space-y-5">
          
          {/* Overview & Rec row (3:1 ratio for wide hero) */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            <div className="lg:col-span-3">
              <OverviewCard 
                profile={reportData?.companyResearch || null} 
                financials={reportData?.financialStatements || null} 
                currentPrice={reportData?.valuation?.currentPrice || null}
                isLoading={showLoadingSkeletons}
              />
            </div>
            <div className="lg:col-span-1">
              <RecommendationCard report={reportData} isLoading={showLoadingSkeletons} />
            </div>
          </div>

          {/* 10 Agent Cards Grid (Auto scaling columns based on screen size) */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] text-text-secondary font-bold uppercase tracking-widest block">
                SPECIALIZED RESEARCH AGENTS
              </span>
              <span className="text-[10px] text-text-secondary font-mono select-none">Click card to open centered immersive diagnostics</span>
            </div>
            
            {/* Grid styling: desktop 3 cols, laptop 3 cols, large monitor 4 cols, tablet 2, mobile 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(id => (
                <AgentCard
                  key={id}
                  id={id}
                  name={getAgentName(id)}
                  report={reportData}
                  onClick={() => !showLoadingSkeletons && setActiveDrawerId(id)}
                  isLoading={showLoadingSkeletons}
                />
              ))}
            </div>
          </div>

          {/* Executive Research Summary - Redesigned Splits */}
          <div className="bg-card rounded-xl p-5 shadow-sm relative overflow-hidden space-y-4 hover:border-[#3E6BFF]/20 transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            
            {showLoadingSkeletons ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-4 bg-muted/60 rounded w-1/3" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="col-span-2 h-24 bg-muted/40 rounded-xl" />
                  <div className="h-24 bg-muted/40 rounded-xl" />
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-6 gap-3.5 pt-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-12 bg-muted/30 rounded-xl" />
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* Top AI Verdict Banner Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-3 gap-2 select-none">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-primary/10 border border-primary/20 text-primary text-[8px] font-bold uppercase rounded font-mono tracking-wider">AI Investment Verdict</span>
                    <h4 className="type-section-title">Executive Research Summary</h4>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-[9px] font-bold font-mono">
                    <div className="flex items-center gap-1">
                      <span className="text-text-secondary">Verdict Rating:</span>
                      <span className="text-white bg-primary/20 border border-primary/25 px-2 py-0.5 rounded uppercase">
                        {rec?.recommendation ? (rec.recommendation.toUpperCase().includes("BUY") ? "INVEST" : (rec.recommendation.toUpperCase().includes("SELL") ? "AVOID" : "HOLD")) : "HOLD"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-text-secondary">Verdict Score:</span>
                      <span className="text-white bg-[#2ECC71]/10 border border-[#2ECC71]/20 px-2 py-0.5 rounded">{rec?.investmentScore || 0}/100</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-text-secondary">Confidence:</span>
                      <span className="text-[#3E6BFF] bg-[#3E6BFF]/10 border border-[#3E6BFF]/20 px-2 py-0.5 rounded">{Math.round((rec?.confidence || 0) * 100)}%</span>
                    </div>
                  </div>
                </div>

                {/* Grid display: asymmetrical layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
                  
                  {/* Thesis */}
                  {rec?.investmentThesis && (
                    <div className="lg:col-span-2 bg-secondary-card/35 p-5 rounded-xl border border-border/30">
                      <span className="text-[10px] text-primary uppercase font-bold tracking-wider flex items-center gap-1.5 mb-2.5 border-b border-border/40 pb-1">
                        <BookOpen className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>Investment Thesis</span>
                      </span>
                      <ul className="space-y-2 text-xs text-text-secondary font-medium">
                        {rec.investmentThesis.split(".").map((b: string) => b.trim()).filter((b: string) => b.length > 5).slice(0, 3).map((bullet: string, idx: number) => (
                          <li key={idx} className="flex gap-1.5 items-start">
                            <span className="text-[#2ECC71] font-bold shrink-0">✔</span>
                            <span>{bullet}.</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Key Strengths */}
                  {rec?.bullCase && rec.bullCase.length > 0 && (
                    <div className="bg-secondary-card/35 p-5 rounded-xl border border-border/30">
                      <span className="text-[10px] text-green uppercase font-bold tracking-wider flex items-center gap-1.5 mb-2.5 border-b border-border/40 pb-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green shrink-0" />
                        <span>Key Strengths</span>
                      </span>
                      <ul className="space-y-2 text-xs text-text-secondary font-medium">
                        {rec.bullCase.slice(0, 3).map((b: string, idx: number) => (
                          <li key={idx} className="flex gap-1.5 items-start">
                            <span className="text-[#2ECC71] font-bold shrink-0">✔</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Catalysts */}
                  {rec?.keyCatalysts && rec.keyCatalysts.length > 0 && (
                    <div className="bg-secondary-card/35 p-5 rounded-xl border border-border/30">
                      <span className="text-[10px] text-primary uppercase font-bold tracking-wider flex items-center gap-1.5 mb-2.5 border-b border-border/40 pb-1">
                        <Zap className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>Key Catalysts</span>
                      </span>
                      <ul className="space-y-2 text-xs text-text-secondary font-medium">
                        {rec.keyCatalysts.slice(0, 3).map((c: string, idx: number) => (
                          <li key={idx} className="flex gap-1.5 items-start">
                            <span className="text-primary font-bold shrink-0">✔</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Risks */}
                  {rec?.bearCase && rec.bearCase.length > 0 && (
                    <div className="bg-secondary-card/35 p-5 rounded-xl border border-border/30">
                      <span className="text-[10px] text-red uppercase font-bold tracking-wider flex items-center gap-1.5 mb-2.5 border-b border-border/40 pb-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-red shrink-0" />
                        <span>Key Risks</span>
                      </span>
                      <ul className="space-y-2 text-xs text-text-secondary font-medium">
                        {rec.bearCase.slice(0, 3).map((r: string, idx: number) => (
                          <li key={idx} className="flex gap-1.5 items-start">
                            <span className="text-red font-bold shrink-0">&bull;</span>
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Watchlist */}
                  {rec?.watchItems && rec.watchItems.length > 0 && (
                    <div className="bg-secondary-card/35 p-5 rounded-xl border border-border/30">
                      <span className="text-[10px] text-orange uppercase font-bold tracking-wider flex items-center gap-1.5 mb-2.5 border-b border-border/40 pb-1">
                        <Eye className="w-3.5 h-3.5 text-orange shrink-0" />
                        <span>Telemetry Watchlist</span>
                      </span>
                      <ul className="space-y-2 text-xs text-text-secondary font-medium">
                        {rec.watchItems.slice(0, 3).map((w: string, idx: number) => (
                          <li key={idx} className="flex gap-1.5 items-start">
                            <span className="text-orange font-bold shrink-0">&bull;</span>
                            <span>{w}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                </div>

                {/* Bottom KPI targets strip */}
                <div className="grid grid-cols-2 lg:grid-cols-6 gap-3.5 pt-4 border-t border-border">
                  <div className="flex flex-col justify-between bg-muted/20 border border-border p-3 rounded-xl">
                    <span className="text-[9px] text-text-secondary uppercase tracking-wider font-semibold">Expected Return</span>
                    <span className="text-green font-bold text-base font-mono mt-0.5">
                      <AnimatedNumber value={parseFloat(rec?.expectedReturn?.replace(/[^0-9.-]/g, "") || "0") || 15} formatter={(v) => "+" + Math.round(v) + "%"} />
                    </span>
                  </div>
                  <div className="flex flex-col justify-between bg-muted/20 border border-border p-3 rounded-xl">
                    <span className="text-[9px] text-text-secondary uppercase tracking-wider font-semibold">Target Price</span>
                    <span className="text-white font-bold text-base font-mono mt-0.5">
                      <AnimatedNumber value={rec?.targetPrice || 0} formatter={(v) => "$" + v.toFixed(2)} />
                    </span>
                  </div>
                  <div className="flex flex-col justify-between bg-muted/20 border border-border p-3 rounded-xl">
                    <span className="text-[9px] text-text-secondary uppercase tracking-wider font-semibold">Stop Loss</span>
                    <span className="text-red font-bold text-base font-mono mt-0.5">
                      <AnimatedNumber value={rec?.stopLoss || 0} formatter={(v) => "$" + v.toFixed(2)} />
                    </span>
                  </div>
                  <div className="flex flex-col justify-between bg-muted/20 border border-border p-3 rounded-xl">
                    <span className="text-[9px] text-text-secondary uppercase tracking-wider font-semibold">Confidence Index</span>
                    <span className="text-green font-bold text-base font-mono mt-0.5">
                      <AnimatedNumber value={Math.round((rec?.confidence || 0.95) * 100)} formatter={(v) => Math.round(v) + "%"} />
                    </span>
                  </div>
                  <div className="flex flex-col justify-between bg-muted/20 border border-border p-3 rounded-xl">
                    <span className="text-[9px] text-text-secondary uppercase tracking-wider font-semibold">Horizon</span>
                    <span className="text-primary font-bold text-xs mt-1 uppercase tracking-wider">{rec?.timeHorizon}</span>
                  </div>
                  <div className="flex flex-col justify-between bg-muted/20 border border-border p-3 rounded-xl">
                    <span className="text-[9px] text-text-secondary uppercase tracking-wider font-semibold">Verdict Rating</span>
                    <span className="text-green font-bold text-xs mt-1 uppercase tracking-wider">{rec?.recommendation}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Bottom Quick Actions Shortcut Grid */}
          <QuickActions />

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
            <button
              onClick={handleShareLink}
              className="flex items-center gap-1.5 px-4 py-2 border border-border bg-card hover:bg-muted text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-text-secondary" />
              <span>Share Dashboard</span>
            </button>
            <button
              onClick={saveActiveReport}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                isCurrentReportSaved
                  ? "bg-green/10 border border-green/20 text-green"
                  : "bg-primary hover:bg-primary/95 text-white shadow-lg shadow-primary/10"
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>{isCurrentReportSaved ? "Saved to library" : "Pin Draft Report"}</span>
            </button>
          </div>

        </div>

        {/* Right Column - Sticky Workflow diagnostics status */}
        <div className="xl:col-span-1 space-y-5 xl:sticky xl:top-[80px] xl:h-[calc(100vh-100px)] flex flex-col min-w-0">
          <WorkflowPanel report={reportData} isAnalyzing={isAnalyzing} analysisStep={analysisStep} />
        </div>

        {/* Centered Modal Overlay (backdrop blur + center) */}
        {activeDrawerId !== null && activeReport !== null && (
          <AgentModal
            id={activeDrawerId}
            name={getAgentName(activeDrawerId)}
            isOpen={activeDrawerId !== null}
            onClose={() => setActiveDrawerId(null)}
            report={activeReport}
          />
        )}

      </div>
    );
  };

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboardContent();
      case "history":
        return <HistoryTab />;
      case "watchlist":
        return <WatchlistTab />;
      case "compare":
        return <CompareTab />;
      case "portfolio":
        return <PortfolioTab />;
      case "reports":
        return <ReportsTab />;
      case "alerts":
        return <AlertsTab />;
      case "settings":
        return <SettingsTab />;
      default:
        return renderDashboardContent();
    }
  };

  return (
    <div className="h-screen bg-background text-white flex overflow-hidden font-sans">
      
      {/* Collapsible Sidebar */}
      <Sidebar 
        isOpen={mobileSidebarOpen} 
        onClose={() => setMobileSidebarOpen(false)} 
      />

      {/* Main Panel Content Wrap */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <TopNav onToggleMobileSidebar={() => setMobileSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-5 space-y-5 bg-background">
          {renderActiveTabContent()}
        </main>
      </div>

      {/* Floating context-aware AI Investment Analyst Chat Assistant */}
      <AIChatAssistant />

    </div>
  );
}
