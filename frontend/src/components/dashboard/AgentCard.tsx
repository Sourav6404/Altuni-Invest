import React from "react";
import { PlatformReport } from "../../mock/mockData";
import { 
  Building2, 
  TrendingUp, 
  GitCompare, 
  BarChart3, 
  Newspaper, 
  Globe, 
  HeartHandshake, 
  CircleDollarSign, 
  ShieldAlert, 
  Lightbulb,
  ArrowUpRight,
  AlertCircle
} from "lucide-react";

interface AgentCardProps {
  id: number;
  name: string;
  report: PlatformReport | null;
  onClick: () => void;
  isLoading?: boolean;
}

export default function AgentCard({ id, name, report, onClick, isLoading = false }: AgentCardProps) {
  const getTheme = () => {
    switch (id) {
      case 1: return { color: "#3E6BFF", bg: "bg-[#3E6BFF]/10", shadow: "shadow-[#3E6BFF]/5" };
      case 2: return { color: "#2ECC71", bg: "bg-[#2ECC71]/10", shadow: "shadow-[#2ECC71]/5" };
      case 3: return { color: "#F5B942", bg: "bg-[#F5B942]/10", shadow: "shadow-[#F5B942]/5" };
      case 4: return { color: "#9B5DE5", bg: "bg-[#9B5DE5]/10", shadow: "shadow-[#9B5DE5]/5" };
      case 5: return { color: "#00F5D4", bg: "bg-[#00F5D4]/10", shadow: "shadow-[#00F5D4]/5" };
      case 6: return { color: "#FF5D73", bg: "bg-[#FF5D73]/10", shadow: "shadow-[#FF5D73]/5" };
      case 7: return { color: "#00BBF9", bg: "bg-[#00BBF9]/10", shadow: "shadow-[#00BBF9]/5" };
      case 8: return { color: "#F15BB5", bg: "bg-[#F15BB5]/10", shadow: "shadow-[#F15BB5]/5" };
      case 9: return { color: "#E056FD", bg: "bg-[#E056FD]/10", shadow: "shadow-[#E056FD]/5" };
      default: return { color: "#F0932B", bg: "bg-[#F0932B]/10", shadow: "shadow-[#F0932B]/5" };
    }
  };

  const theme = getTheme();

  const getIcon = () => {
    const sizeClass = "w-4 h-4";
    const strokeStyle = { stroke: theme.color, strokeWidth: "2.2" };
    switch (id) {
      case 1: return <Building2 className={sizeClass} style={strokeStyle} />;
      case 2: return <TrendingUp className={sizeClass} style={strokeStyle} />;
      case 3: return <GitCompare className={sizeClass} style={strokeStyle} />;
      case 4: return <BarChart3 className={sizeClass} style={strokeStyle} />;
      case 5: return <Newspaper className={sizeClass} style={strokeStyle} />;
      case 6: return <Globe className={sizeClass} style={strokeStyle} />;
      case 7: return <HeartHandshake className={sizeClass} style={strokeStyle} />;
      case 8: return <CircleDollarSign className={sizeClass} style={strokeStyle} />;
      case 9: return <ShieldAlert className={sizeClass} style={strokeStyle} />;
      default: return <Lightbulb className={sizeClass} style={strokeStyle} />;
    }
  };

  const formatMarketCap = (num: number | null | undefined) => {
    if (!num) return "";
    if (num >= 1e12) return `$${(num / 1e12).toFixed(1)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
    return `$${num.toLocaleString()}`;
  };

  const formatMarketValue = (num: number | null | undefined) => {
    if (!num) return "";
    if (num >= 1e12) return `$${(num / 1e12).toFixed(1)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
    return `$${num.toLocaleString()}`;
  };

  // Render skeleton state
  if (isLoading || !report) {
    return (
      <div className="bg-card rounded-xl p-5 shadow-sm border border-border/50 flex flex-col justify-between h-[230px] animate-pulse relative overflow-hidden">
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center gap-2.5 border-b border-border/40 pb-2 mb-2">
            <div className="w-7 h-7 rounded bg-muted/40" />
            <div className="h-3 bg-muted/50 rounded w-24" />
          </div>
          <div className="space-y-3 mt-4 flex-1 flex flex-col justify-center">
            <div className="h-2 bg-muted/30 rounded w-full" />
            <div className="h-2 bg-muted/30 rounded w-5/6" />
            <div className="h-2 bg-muted/30 rounded w-4/5" />
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-border/30 flex items-center justify-between">
          <div className="h-5 bg-muted/40 rounded w-16" />
          <div className="h-6 bg-muted/40 rounded-xl w-14" />
        </div>
      </div>
    );
  }

  const confidencePct = Math.round((id === 1 ? report.companyResearch?.confidence || 0.95 : 
                                    id === 2 ? report.financialStatements?.confidence || 0.92 :
                                    id === 3 ? report.competitors?.confidence || 0.90 :
                                    id === 4 ? report.marketIndustry?.confidence || 0.95 :
                                    id === 5 ? report.news?.confidence || 0.94 :
                                    id === 6 ? report.macroeconomic?.confidence || 0.90 :
                                    id === 7 ? report.sentiment?.confidence || 0.92 :
                                    id === 8 ? report.valuation?.confidence || 0.95 :
                                    id === 9 ? report.risk?.confidence || 0.93 :
                                    report.recommendation?.confidence || 0.95) * 100);

  const getReliabilityLabel = (pct: number) => {
    if (pct >= 95) return "Very High";
    if (pct >= 90) return "High";
    if (pct >= 80) return "Good";
    return "Moderate";
  };

  const reliabilityLabel = getReliabilityLabel(confidencePct);

  const renderCardFields = () => {
    const listClass = "space-y-1.5 text-[10px] font-mono leading-none mt-2.5 flex-1 flex flex-col justify-center";
    const rowClass = "flex justify-between items-center py-1 border-b border-border/10 last:border-b-0";
    const labelClass = "text-text-secondary font-medium font-sans";
    const valClass = "text-white font-bold text-right truncate max-w-[130px]";

    switch (id) {
      case 1: {
        const cr = report.companyResearch;
        const hasDesc = cr?.businessDescription;
        const hasMC = cr?.marketCap;
        const hasEC = cr?.employeeCount;
        return (
          <div className={listClass}>
            {hasDesc && (
              <div className="text-[10px] text-text-secondary leading-relaxed line-clamp-1 mb-2 font-sans font-medium">
                {cr.businessDescription}
              </div>
            )}
            {hasMC && (
              <div className={rowClass}>
                <span className={labelClass}>Market Capitalization</span>
                <span className={valClass}>{formatMarketCap(cr.marketCap)}</span>
              </div>
            )}
            {hasEC && (
              <div className={rowClass}>
                <span className={labelClass}>Headcount (FTE)</span>
                <span className={valClass}>{cr.employeeCount?.toLocaleString()}</span>
              </div>
            )}
          </div>
        );
      }
      case 2: {
        const fs = report.financialStatements;
        const lastRev = fs?.revenue && fs.revenue.length > 0 ? fs.revenue[fs.revenue.length - 1]?.value : null;
        const lastNet = fs?.netIncome && fs.netIncome.length > 0 ? fs.netIncome[fs.netIncome.length - 1]?.value : null;
        const lastEps = fs?.eps && fs.eps.length > 0 ? fs.eps[fs.eps.length - 1]?.value : null;

        const hasFs = fs && (lastRev !== null || lastNet !== null || lastEps !== null);
        
        if (!hasFs) {
          // Alternative fallback fields from other sections
          const crMC = report.companyResearch?.marketCap;
          const valPrice = report.valuation?.currentPrice;
          const valWacc = report.valuation?.dcfModel?.wacc;
          return (
            <div className={listClass}>
              <div className="text-[9.5px] text-orange mb-1.5 leading-relaxed font-sans font-medium">
                Financial statements missing. Showing alternative metrics:
              </div>
              {crMC && (
                <div className={rowClass}>
                  <span className={labelClass}>Market Capitalization</span>
                  <span className={valClass}>{formatMarketCap(crMC)}</span>
                </div>
              )}
              {valPrice && (
                <div className={rowClass}>
                  <span className={labelClass}>Last Price</span>
                  <span className={valClass}>${valPrice.toFixed(2)}</span>
                </div>
              )}
              {valWacc && (
                <div className={rowClass}>
                  <span className={labelClass}>DCF WACC</span>
                  <span className={valClass}>{(valWacc * 100).toFixed(1)}%</span>
                </div>
              )}
            </div>
          );
        }

        return (
          <div className={listClass}>
            {lastRev && (
              <div className={rowClass}>
                <span className={labelClass}>Revenue (TTM)</span>
                <span className={valClass}>{formatMarketValue(lastRev)}</span>
              </div>
            )}
            {lastNet && (
              <div className={rowClass}>
                <span className={labelClass}>Net Income (TTM)</span>
                <span className={valClass}>{formatMarketValue(lastNet)}</span>
              </div>
            )}
            {lastEps && (
              <div className={rowClass}>
                <span className={labelClass}>Earnings Per Share (EPS)</span>
                <span className={valClass}>${lastEps.toFixed(2)}</span>
              </div>
            )}
          </div>
        );
      }
      case 3: {
        const comp = report.competitors;
        const topComp = comp?.competitors?.[0];
        const moatRating = comp?.keyMoat ? "Wide Moat" : "";
        const hasData = topComp || moatRating;

        if (!hasData) {
          return (
            <div className="text-[10px] text-text-secondary leading-relaxed font-sans font-medium flex-1 flex items-center">
              Competitor benchmarks and moat rating telemetry are currently unavailable.
            </div>
          );
        }

        return (
          <div className={listClass}>
            {topComp && (
              <div className={rowClass}>
                <span className={labelClass}>Top Peer Competitor</span>
                <span className={valClass}>{topComp.companyName} ({topComp.ticker})</span>
              </div>
            )}
            {topComp?.score && (
              <div className={rowClass}>
                <span className={labelClass}>Peer Score</span>
                <span className={valClass}>{topComp.score}/100</span>
              </div>
            )}
            {moatRating && (
              <div className={rowClass}>
                <span className={labelClass}>Moat Rating</span>
                <span className={valClass}>{moatRating}</span>
              </div>
            )}
          </div>
        );
      }
      case 4: {
        const mi = report.marketIndustry;
        const hasCAGR = mi?.industryCAGR || mi?.growthRate;
        const hasHorizon = mi?.forecastYear;
        const hasOutlook = mi?.futureOutlook;
        const hasData = hasCAGR || hasHorizon || hasOutlook;

        if (!hasData) {
          return (
            <div className="text-[10px] text-text-secondary leading-relaxed font-sans font-medium flex-1 flex items-center">
              Market industry projections and CAGR data are currently unavailable.
            </div>
          );
        }

        return (
          <div className={listClass}>
            {hasCAGR && (
              <div className={rowClass}>
                <span className={labelClass}>Market CAGR</span>
                <span className={valClass}>{mi.industryCAGR || mi.growthRate}</span>
              </div>
            )}
            {hasHorizon && (
              <div className={rowClass}>
                <span className={labelClass}>Forecast Horizon</span>
                <span className={valClass}>{mi.forecastYear}</span>
              </div>
            )}
            {hasOutlook && (
              <div className={rowClass}>
                <span className={labelClass}>Sector Outlook</span>
                <span className={`${valClass} text-green`}>{mi.futureOutlook}</span>
              </div>
            )}
          </div>
        );
      }
      case 5: {
        const news = report.news;
        const latestArticle = news?.latestHeadlines?.[0] || news?.articles?.[0];
        const hasSentiment = news?.overallSentiment;
        const hasRatio = news?.sentimentBreakdown?.positive;

        if (!latestArticle && !hasSentiment && !hasRatio) {
          return (
            <div className="text-[10px] text-text-secondary leading-relaxed font-sans font-medium flex-1 flex items-center">
              News telemetry scraper reports no active stories indexed.
            </div>
          );
        }

        return (
          <div className={listClass}>
            {latestArticle?.headline && (
              <div className="text-[10px] text-text-secondary leading-relaxed line-clamp-1 mb-2 font-sans font-medium" title={latestArticle.headline}>
                <span className="text-primary font-bold mr-1">Latest:</span>
                {latestArticle.headline}
              </div>
            )}
            {hasSentiment && (
              <div className={rowClass}>
                <span className={labelClass}>Overall Sentiment</span>
                <span className={valClass}>{news.overallSentiment}</span>
              </div>
            )}
            {hasRatio && (
              <div className={rowClass}>
                <span className={labelClass}>Bullish Ingest Ratio</span>
                <span className={`${valClass} text-green`}>{news.sentimentBreakdown?.positive}%</span>
              </div>
            )}
          </div>
        );
      }
      case 6: {
        const macro = report.macroeconomic;
        const hasImpact = macro?.overallImpact;
        const hasGDP = macro?.gdpGrowth?.impact;
        const hasInf = macro?.inflation?.impact;
        const hasData = hasImpact || hasGDP || hasInf;

        if (!hasData) {
          return (
            <div className="text-[10px] text-text-secondary leading-relaxed font-sans font-medium flex-1 flex items-center">
              Macroeconomic outlook and GDP metrics are currently unavailable.
            </div>
          );
        }

        return (
          <div className={listClass}>
            {hasImpact && (
              <div className={rowClass}>
                <span className={labelClass}>Overall Impact</span>
                <span className={valClass}>{macro.overallImpact}</span>
              </div>
            )}
            {hasGDP && (
              <div className={rowClass}>
                <span className={labelClass}>GDP Growth Impact</span>
                <span className={valClass}>{macro.gdpGrowth.impact}</span>
              </div>
            )}
            {hasInf && (
              <div className={rowClass}>
                <span className={labelClass}>Inflation Impact</span>
                <span className={valClass}>{macro.inflation.impact}</span>
              </div>
            )}
          </div>
        );
      }
      case 7: {
        const sent = report.sentiment;
        const hasOverall = sent?.overallSentiment;
        const hasAnalyst = sent?.analystSentiment;
        const hasData = hasOverall || hasAnalyst;

        if (!hasData) {
          return (
            <div className="text-[10px] text-text-secondary leading-relaxed font-sans font-medium flex-1 flex items-center">
              Investor options and social sentiment indexes are currently unavailable.
            </div>
          );
        }

        return (
          <div className={listClass}>
            {hasOverall && (
              <div className={rowClass}>
                <span className={labelClass}>Overall Sentiment</span>
                <span className={valClass}>{sent.overallSentiment}</span>
              </div>
            )}
            {hasAnalyst && (
              <div className={rowClass}>
                <span className={labelClass}>Analyst Sentiment</span>
                <span className={valClass}>{sent.analystSentiment}</span>
              </div>
            )}
          </div>
        );
      }
      case 8: {
        const val = report.valuation;
        const hasIntrinsic = val?.intrinsicValue;
        const hasUpside = val?.upside;
        const hasVal = val?.valuation;
        const hasData = hasIntrinsic || hasUpside || hasVal;

        if (!hasData) {
          return (
            <div className="text-[10px] text-text-secondary leading-relaxed font-sans font-medium flex-1 flex items-center">
              DCF multiple intrinsic valuation solvers are currently offline.
            </div>
          );
        }

        return (
          <div className={listClass}>
            {hasIntrinsic && (
              <div className={rowClass}>
                <span className={labelClass}>Intrinsic DCF Value</span>
                <span className={valClass}>${val.intrinsicValue?.toFixed(2)}</span>
              </div>
            )}
            {hasUpside && (
              <div className={rowClass}>
                <span className={labelClass}>Calculated Upside</span>
                <span className={`${valClass} text-green`}>+{val.upside.toFixed(1)}%</span>
              </div>
            )}
            {hasVal && (
              <div className={rowClass}>
                <span className={labelClass}>Valuation Verdict</span>
                <span className={valClass}>{val.valuation}</span>
              </div>
            )}
          </div>
        );
      }
      case 9: {
        const rk = report.risk;
        const hasRisk = rk?.riskLevel;
        const hasScore = rk?.overallRiskScore;
        const hasData = hasRisk || hasScore;

        if (!hasData) {
          return (
            <div className="text-[10px] text-text-secondary leading-relaxed font-sans font-medium flex-1 flex items-center">
              Enterprise vulnerability matrices and risk scores are currently unavailable.
            </div>
          );
        }

        return (
          <div className={listClass}>
            {hasRisk && (
              <div className={rowClass}>
                <span className={labelClass}>Consensus Risk Level</span>
                <span className={valClass}>{rk.riskLevel}</span>
              </div>
            )}
            {hasScore && (
              <div className={rowClass}>
                <span className={labelClass}>Overall Risk Score</span>
                <span className={valClass}>{rk.overallRiskScore}/100</span>
              </div>
            )}
          </div>
        );
      }
      default: {
        const rc = report.recommendation;
        const hasVerdict = rc?.recommendation;
        const hasScore = rc?.investmentScore;
        const hasReturn = rc?.expectedReturn;
        const hasData = hasVerdict || hasScore || hasReturn;

        if (!hasData) {
          return (
            <div className="text-[10px] text-text-secondary leading-relaxed font-sans font-medium flex-1 flex items-center">
              Verdict consensus engine returns no actionable trade data.
            </div>
          );
        }

        const verdictLabel = rc.recommendation ? (rc.recommendation.toUpperCase().includes("BUY") ? "INVEST" : (rc.recommendation.toUpperCase().includes("HOLD") ? "WATCH" : "DO NOT INVEST")) : "HOLD";

        return (
          <div className={listClass}>
            {hasVerdict && (
              <div className={rowClass}>
                <span className={labelClass}>Consensus Verdict</span>
                <span className={`${valClass} text-primary`}>{verdictLabel}</span>
              </div>
            )}
            {hasScore && (
              <div className={rowClass}>
                <span className={labelClass}>Investment Score</span>
                <span className={valClass}>{rc.investmentScore}/100</span>
              </div>
            )}
            {hasReturn && (
              <div className={rowClass}>
                <span className={labelClass}>Expected Return</span>
                <span className={valClass}>{rc.expectedReturn}</span>
              </div>
            )}
          </div>
        );
      }
    }
  };

  return (
    <div 
      onClick={onClick}
      className="bg-card rounded-xl p-5 shadow-sm border border-border flex flex-col justify-between h-[230px] hover:-translate-y-0.5 transition-all duration-200 group relative overflow-hidden cursor-pointer"
    >
      {/* Background glow overlay */}
      <div 
        className="absolute right-0 top-0 w-24 h-24 rounded-full blur-3xl opacity-5 pointer-events-none" 
        style={{ backgroundColor: theme.color }}
      />

      <div className="flex-1 flex flex-col min-h-0">
        {/* Card Header (Icon, Title) */}
        <div className="flex items-center justify-between border-b border-border/40 pb-2 mb-2 select-none">
          <div className="flex items-center gap-2.5">
            <div 
              className="w-7 h-7 rounded bg-muted/40 border border-border flex items-center justify-center shrink-0"
              style={{ borderColor: `${theme.color}20` }}
            >
              {getIcon()}
            </div>
            <h4 className="text-[11px] font-bold text-white transition-colors uppercase tracking-wider">
              {name}
            </h4>
          </div>
        </div>

        {/* Structured List Fields */}
        {renderCardFields()}
      </div>

      {/* Footer (Open Report button trigger, Confidence Ring) */}
      <div className="mt-3 pt-3 border-t border-border/30 flex items-center justify-between gap-2 select-none shrink-0">
        
        {/* Open Report Button */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="flex items-center gap-1.5 text-[9px] font-bold text-[#3E6BFF] hover:text-white transition-all py-1 px-2.5 rounded bg-primary/10 border border-primary/20 hover:border-primary/40 active:scale-[0.98] cursor-pointer font-mono uppercase"
        >
          <span>Open Report</span>
          <ArrowUpRight className="w-3 h-3" />
        </button>

        {/* Confidence Ring Dial */}
        <div 
          className="relative flex items-center gap-2 bg-secondary-card/40 border border-border/30 rounded-xl px-2 py-0.5 backdrop-blur-sm cursor-help group/confidence"
          title="Consensus confidence value"
        >
          <div className="relative w-8 h-8 shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="16" cy="16" r="12" stroke="rgba(255,255,255,0.02)" strokeWidth="1.8" fill="transparent" />
              <circle
                cx="16"
                cy="16"
                r="12"
                stroke={theme.color}
                strokeWidth="1.8"
                fill="transparent"
                strokeDasharray="75.4" // 2 * PI * 12 = 75.4
                strokeDashoffset={75.4 - (75.4 * confidencePct) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[8px] font-bold font-mono text-white leading-none">
              {confidencePct}%
            </div>
          </div>

          <div className="text-left font-mono">
            <span className="text-[6px] text-text-secondary uppercase block leading-none font-semibold">Conf</span>
            <span className="text-[8px] font-bold block leading-none mt-0.5" style={{ color: theme.color }}>
              {reliabilityLabel}
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
