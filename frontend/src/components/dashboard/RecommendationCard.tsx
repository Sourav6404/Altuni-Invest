import React from "react";
import { PlatformReport } from "../../mock/mockData";
import { AlertCircle } from "lucide-react";

interface RecommendationCardProps {
  report: PlatformReport | null;
  isLoading?: boolean;
}

export default function RecommendationCard({ report, isLoading = false }: RecommendationCardProps) {
  const data = report?.recommendation;
  const risk = report?.risk;
  
  // Translate standard term to institutional consensus verdicts: INVEST / WATCH / DO NOT INVEST
  const getDisplayVerdict = (rec: string) => {
    const r = rec.toUpperCase();
    if (r.includes("STRONG BUY") || r.includes("BUY")) return "INVEST";
    if (r.includes("STRONG SELL") || r.includes("SELL")) return "DO NOT INVEST";
    return "WATCH";
  };

  const getVerdictColor = (verdict: string) => {
    if (verdict === "INVEST") return "#2ECC71"; // Success Green
    if (verdict === "WATCH") return "#F5B942"; // Warning Amber
    return "#FF5D73"; // Danger Crimson
  };

  const consensusVerdict = getDisplayVerdict(data?.recommendation || "Hold");
  const verdictColor = getVerdictColor(consensusVerdict);
  const scorePct = data?.investmentScore || 50;
  const confidencePct = Math.round((data?.confidence || 0.9) * 100);
  const riskLevel = (risk?.riskLevel || "MODERATE").toUpperCase();

  // Render skeleton state
  if (isLoading) {
    return (
      <div className="bg-card border-0 rounded-xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between w-full h-full min-h-[350px] animate-pulse">
        <div className="space-y-4">
          <div className="flex justify-between border-b border-border/40 pb-2">
            <div className="h-3 bg-muted/40 rounded w-28" />
            <div className="h-3 bg-muted/30 rounded w-10" />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-muted/40" />
            <div className="space-y-2">
              <div className="h-2 bg-muted/30 rounded w-24" />
              <div className="h-5 bg-muted/50 rounded w-16" />
              <div className="h-2.5 bg-muted/30 rounded w-20" />
            </div>
          </div>
          <div className="h-16 bg-secondary-card/10 border border-border/20 rounded-lg p-3" />
        </div>
      </div>
    );
  }

  // Check if consensus metadata exists
  const hasExpectedReturn = data?.expectedReturn && data.expectedReturn !== "N/A";
  const hasTargetPrice = data?.targetPrice !== null && data?.targetPrice !== undefined;
  const hasHorizon = !!data?.timeHorizon;
  const hasRisk = !!risk?.riskLevel;

  const hasAnyMetadata = hasExpectedReturn || hasTargetPrice || hasHorizon || hasRisk;

  // Check if we have consensus recommendations data at all
  if (!data) {
    return (
      <div className="bg-card border border-border/30 rounded-xl p-5 shadow-sm flex flex-col items-center justify-center text-center h-full min-h-[350px]">
        <AlertCircle className="w-8 h-8 text-primary/40 mb-3" />
        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Verdict Unavailable</h4>
        <p className="text-[10px] text-text-secondary leading-relaxed mt-2 max-w-[160px]">
          Recommendation model consensus telemetry is currently unavailable.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border-0 rounded-xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between w-full h-full min-h-[350px] transition-all duration-300">
      
      {/* Background Radial Glow */}
      <div 
        className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl pointer-events-none opacity-5" 
        style={{ backgroundColor: verdictColor }}
      />

      <div className="space-y-4">
        
        {/* Card Title */}
        <div className="flex items-center justify-between border-b border-border pb-2 select-none">
          <span className="text-[9px] text-muted font-bold uppercase tracking-widest block font-mono">
            Multi-Agent Investment Consensus
          </span>
          <span className="px-1.5 py-0.5 bg-secondary-card border border-border text-[8px] font-mono rounded font-bold text-text-secondary uppercase select-none">
            Verdict
          </span>
        </div>

        {/* Primary Row: Left circular gauge (centerpiece) and right details */}
        <div className="flex items-center gap-4">
          {/* Large centerpiece Circular gauge */}
          <div className="relative w-16 h-16 flex items-center justify-center font-mono shrink-0 select-none">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="28" stroke="rgba(255,255,255,0.02)" strokeWidth="3.5" fill="transparent" />
              <circle 
                cx="32" 
                cy="32" 
                r="28" 
                stroke={verdictColor} 
                strokeWidth="3.5" 
                fill="transparent" 
                strokeDasharray={175.9} // 2 * PI * 28 = 175.9
                strokeDashoffset={175.9 - (175.9 * scorePct) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center leading-none">
              <span className="text-[15px] font-extrabold text-white">{scorePct}</span>
              <span className="text-[6px] text-muted uppercase tracking-wider font-bold">Rating</span>
            </div>
          </div>

          {/* Large consensus verdict typography */}
          <div>
            <span className="text-[7px] text-muted uppercase block font-mono font-bold leading-none">AI Investment Consensus</span>
            <h2 className="text-xl font-extrabold tracking-tight mt-1" style={{ color: verdictColor }}>
              {consensusVerdict}
            </h2>
            <span className="text-[9px] text-muted font-semibold block mt-0.5 font-mono">
              Confidence Index: {confidencePct}%
            </span>
          </div>
        </div>

        {/* Consolidated Information Panel */}
        {hasAnyMetadata && (
          <div className="bg-secondary-card/30 border border-border/40 rounded-lg p-3 grid grid-cols-2 gap-3 text-xs leading-none font-mono">
            {hasExpectedReturn && (
              <div>
                <span className="text-[8px] text-muted uppercase tracking-wider block font-semibold font-mono">Expected Return</span>
                <span className="text-green font-bold text-xs mt-1 block">
                  {data.expectedReturn}
                </span>
              </div>
            )}
            {hasTargetPrice && (
              <div>
                <span className="text-[8px] text-muted uppercase tracking-wider block font-semibold font-mono">Target Price</span>
                <span className="text-white font-bold text-xs mt-1 block">
                  ${data.targetPrice!.toFixed(2)}
                </span>
              </div>
            )}
            {hasHorizon && (
              <div>
                <span className="text-[8px] text-muted uppercase tracking-wider block font-semibold font-mono">Time Horizon</span>
                <span className="text-primary font-bold text-[9px] mt-1 block uppercase">
                  {data.timeHorizon}
                </span>
              </div>
            )}
            {hasRisk && (
              <div>
                <span className="text-[8px] text-muted uppercase tracking-wider block font-semibold font-mono">Risk Class</span>
                <span className="text-white font-bold text-xs mt-1 block">
                  {riskLevel}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Thesis Summary Panel */}
        {data?.investmentThesis && data.investmentThesis !== "N/A" && (
          <div className="space-y-1.5 pt-1">
            <span className="text-[8px] text-muted font-mono uppercase tracking-wider block font-bold">
              Consensus Thesis
            </span>
            <p className="text-xs text-text-secondary leading-normal font-medium line-clamp-2 select-text">
              {data.investmentThesis}
            </p>
          </div>
        )}

        {/* Premium horizontal risk scale */}
        {hasRisk && (
          <div className="space-y-1.5 font-mono">
            <span className="text-[8px] text-muted uppercase tracking-wider block font-bold">
              Risk Profile Gauge
            </span>
            <div className="flex items-center justify-between text-[8px] font-bold tracking-widest border border-border bg-secondary-card/40 p-2 rounded-lg">
              <span className={riskLevel === "LOW" ? "text-green animate-pulse" : "text-text-secondary/30"}>LOW</span>
              <span className="text-text-secondary/15">|</span>
              <span className={riskLevel === "MODERATE" || riskLevel === "MEDIUM" ? "text-orange animate-pulse" : "text-text-secondary/30"}>MEDIUM</span>
              <span className="text-text-secondary/15">|</span>
              <span className={riskLevel === "HIGH" || riskLevel === "VERY HIGH" ? "text-red animate-pulse" : "text-text-secondary/30"}>HIGH</span>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
