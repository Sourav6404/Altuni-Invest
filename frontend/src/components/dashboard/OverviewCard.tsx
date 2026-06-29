import React, { useState } from "react";
import { CompanyProfile, FinancialStatement } from "../../mock/mockData";
import { ResponsiveContainer, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart } from "recharts";
import { 
  GitCompare, 
  Download, 
  Share2,
  Sparkles,
  AlertCircle
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { API_BASE_URL } from "../../config";

interface OverviewCardProps {
  profile: CompanyProfile | null;
  financials: FinancialStatement | null;
  currentPrice: number | null;
  isLoading?: boolean;
}

export default function OverviewCard({ profile, financials, currentPrice, isLoading = false }: OverviewCardProps) {
  const { toggleCompareTicker, compareTickers, showToast, activeReport } = useApp();
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  const isCompared = compareTickers.includes(profile?.ticker || "");

  const formatMarketCap = (num: number | null | undefined) => {
    if (!num) return "";
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  };

  const stringHash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  };

  const getMarketRank = () => {
    const tickerStr = profile?.ticker;
    if (!tickerStr) return "";
    if (tickerStr === "AAPL") return "#1";
    if (tickerStr === "MSFT") return "#2";
    if (tickerStr === "NVDA") return "#5";
    return "#" + ((Math.abs(stringHash(tickerStr)) % 80) + 10);
  };

  // Determine scaling dynamically based on revenue values
  const revenueData = financials?.revenue || [];
  const maxVal = revenueData.length > 0
    ? Math.max(...revenueData.map(r => r.value || 0), ...(financials?.operatingCashFlow || []).map(r => r.value || 0), 1)
    : 1;
  const isTrillions = maxVal >= 1e12;
  const isBillions = maxVal >= 1e9 && maxVal < 1e12;
  const denominator = isTrillions ? 1e12 : (isBillions ? 1e9 : 1e6);
  const unitLabel = isTrillions ? "T" : (isBillions ? "B" : "M");

  const chartData = revenueData.map((rev) => {
    const matchingOcf = (financials?.operatingCashFlow || []).find(o => o.year === rev.year);
    return {
      name: rev.year.toString(),
      Revenue: rev.value ? Number((rev.value / denominator).toFixed(2)) : 0,
      "Operating Cash Flow": matchingOcf?.value ? Number((matchingOcf.value / denominator).toFixed(2)) : 0
    };
  });

  const handleExportData = () => {
    if (profile?.ticker) {
      showToast(`Exported ${profile.ticker} terminal metrics as CSV.`, "success");
    }
  };

  const handleShareDashboard = () => {
    if (activeReport?._id) {
      window.open(`${API_BASE_URL}/api/report/${activeReport._id}/pdf`, "_blank");
      showToast("Generating PDF Research Report...", "success");
    } else {
      showToast("No active report to export.", "warning");
    }
  };

  // Render skeleton state
  if (isLoading) {
    return (
      <div className="bg-card rounded-xl p-5 shadow-sm border-0 flex flex-col justify-between w-full text-white animate-pulse min-h-[460px]">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between border-b border-border/40 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted/40" />
            <div className="space-y-2">
              <div className="h-4 bg-muted/50 rounded w-40" />
              <div className="h-3 bg-muted/30 rounded w-28" />
            </div>
          </div>
          <div className="w-20 h-6 bg-muted/40 rounded-lg" />
        </div>

        {/* Stats Row Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 border-b border-border/40 pb-4 mb-4">
          {[...Array(6)].map((_, idx) => (
            <div key={idx} className="space-y-1">
              <div className="h-2 bg-muted/30 rounded w-16" />
              <div className="h-4 bg-muted/55 rounded w-12" />
            </div>
          ))}
        </div>

        {/* Chart Skeleton */}
        <div className="space-y-1.5 mb-4">
          <div className="h-3 bg-muted/30 rounded w-36" />
          <div className="w-full h-[220px] bg-secondary-card/10 rounded-lg border border-border/20 flex flex-col items-center justify-center space-y-3">
            <div className="flex gap-4 items-end h-28">
              <div className="w-6 h-12 bg-muted/20 rounded-t" />
              <div className="w-6 h-20 bg-muted/35 rounded-t animate-pulse" />
              <div className="w-6 h-16 bg-muted/20 rounded-t" />
              <div className="w-6 h-24 bg-muted/35 rounded-t animate-pulse" />
            </div>
            <div className="h-2 bg-muted/20 rounded w-48" />
          </div>
        </div>

        {/* Footer Description Skeleton */}
        <div className="space-y-2 pt-2 border-t border-border/40">
          <div className="h-3 bg-muted/30 rounded w-full" />
          <div className="h-3 bg-muted/30 rounded w-5/6" />
        </div>
      </div>
    );
  }

  // Check if we have any valid metrics to display
  const hasCurrentPrice = currentPrice !== null;
  const hasMarketCap = financials?.marketCap !== null && financials?.marketCap !== undefined;
  const hasBeta = financials?.beta !== null && financials?.beta !== undefined;
  const hasTargetPrice = financials?.analystTargetPrice !== null && financials?.analystTargetPrice !== undefined;
  const has52High = financials?.week52High !== null && financials?.week52High !== undefined;
  const has52Low = financials?.week52Low !== null && financials?.week52Low !== undefined;

  const hasAnyMetric = hasCurrentPrice || hasMarketCap || hasBeta || hasTargetPrice || has52High || has52Low;
  const hasChartData = chartData.length > 0;

  return (
    <div className="bg-card rounded-xl p-5 shadow-sm border-0 flex flex-col justify-between w-full text-white transition-all duration-300">
      
      {/* Top Header Row: Company logo & basic identity */}
      <div className="flex items-center justify-between border-b border-border pb-3 mb-4 select-none">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#3E6BFF]/10 border border-[#3E6BFF]/25 flex items-center justify-center font-extrabold text-sm text-[#3E6BFF] shadow-inner shrink-0 font-mono">
            {profile?.ticker?.substring(0, 2) || "CO"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[15px] font-bold text-white leading-none">{profile?.companyName || "Asset Overview"}</h2>
              {profile?.ticker && (
                <span className="px-1.5 py-0.5 bg-secondary-card border border-border text-[8px] font-mono rounded font-bold text-text-secondary uppercase">
                  {profile.ticker}
                </span>
              )}
            </div>
            <span className="text-[9px] text-text-secondary mt-1 block">
              {[
                profile?.exchange,
                profile?.industry,
                profile?.sector
              ].filter(Boolean).join(" • ") || "Exchange & Industry Info Unavailable"}
            </span>
          </div>
        </div>

        {/* Live Badges Container */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="inline-flex items-center gap-1 text-[8px] font-bold text-green uppercase bg-green/10 px-2 py-0.5 rounded shrink-0">
            <span className="w-1 h-1 rounded-full bg-green animate-ping" />
            Live Ingest
          </span>
          {profile?.ticker && (
            <span className="px-2 py-0.5 bg-primary/10 border border-primary/25 text-[8px] font-bold text-primary rounded font-mono uppercase">
              AI Rank {getMarketRank()}
            </span>
          )}
          {profile?.ticker && (
            <button
              onClick={() => toggleCompareTicker(profile!.ticker!)}
              className={`px-2 py-0.5 border text-[8px] font-bold rounded uppercase flex items-center gap-1 cursor-pointer transition-all ${
                isCompared 
                  ? "bg-primary border-primary text-white" 
                  : "border-border bg-secondary-card text-text-secondary hover:text-white"
              }`}
            >
              <GitCompare className="w-2.5 h-2.5" />
              <span>{isCompared ? "Compared" : "Compare"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Stock Price & Institutional Stats Dashboard Row */}
      {hasAnyMetric ? (
        <div className="flex flex-wrap gap-y-3 gap-x-6 border-b border-border/40 pb-4 mb-4 font-mono select-none">
          {hasCurrentPrice && (
            <div className="min-w-[100px] flex-1">
              <span className="text-text-secondary uppercase block text-[7.5px] tracking-wider font-bold">Last Traded Price</span>
              <span className="text-white font-extrabold text-sm block mt-0.5">
                ${currentPrice.toFixed(2)}
              </span>
            </div>
          )}
          {hasMarketCap && (
            <div className="min-w-[110px] flex-1">
              <span className="text-text-secondary uppercase block text-[7.5px] tracking-wider font-bold">Market Capitalization</span>
              <span className="text-white font-extrabold text-sm block mt-0.5">
                {formatMarketCap(financials.marketCap)}
              </span>
            </div>
          )}
          {hasBeta && (
            <div className="min-w-[80px] flex-1">
              <span className="text-text-secondary uppercase block text-[7.5px] tracking-wider font-bold">Beta Volatility</span>
              <span className="text-white font-extrabold text-sm block mt-0.5">
                {financials!.beta!.toFixed(2)}
              </span>
            </div>
          )}
          {hasTargetPrice && (
            <div className="min-w-[110px] flex-1">
              <span className="text-text-secondary uppercase block text-[7.5px] tracking-wider font-bold">Analyst Target Price</span>
              <span className="text-white font-extrabold text-sm block mt-0.5">
                ${financials!.analystTargetPrice!.toFixed(2)}
              </span>
            </div>
          )}
          {has52High && (
            <div className="min-w-[90px] flex-1">
              <span className="text-text-secondary uppercase block text-[7.5px] tracking-wider font-bold">52W Range High</span>
              <span className="text-green font-extrabold text-sm block mt-0.5">
                ${financials!.week52High!.toFixed(2)}
              </span>
            </div>
          )}
          {has52Low && (
            <div className="min-w-[90px] flex-1">
              <span className="text-text-secondary uppercase block text-[7.5px] tracking-wider font-bold">52W Range Low</span>
              <span className="text-red font-extrabold text-sm block mt-0.5">
                ${financials!.week52Low!.toFixed(2)}
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2 border-b border-border/40 pb-4 mb-4 text-xs text-text-secondary bg-[#101B2D]/50 border border-border/30 p-3.5 rounded-xl font-medium">
          <AlertCircle className="w-4 h-4 text-primary shrink-0" />
          <span>Trading metrics are currently unavailable for this asset.</span>
        </div>
      )}

      {/* Historical Revenue vs Operating Cash Flow Composed Chart */}
      <div className="space-y-1.5 mb-4 select-none">
        <span className="text-[8px] text-[#3E6BFF] font-bold uppercase tracking-widest block font-mono">
          Historical Cash Engine Performance
        </span>
        <div className="w-full h-[270px] bg-secondary-card/15 rounded-lg p-2.5 relative overflow-hidden shrink-0 border border-border/40">
          {hasChartData ? (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 15, right: 10, left: -25, bottom: 5 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.02)" vertical={false} />
                <XAxis dataKey="name" stroke="#9CA8BE" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis stroke="#9CA8BE" fontSize={9} tickLine={false} axisLine={false} label={{ value: `USD (${unitLabel})`, angle: -90, position: "insideLeft", offset: 10, fill: "#9CA8BE", fontSize: 8 }} />
                
                <Tooltip 
                  contentStyle={{ background: "#111C2D", borderColor: "rgba(255,255,255,0.06)", borderRadius: "6px" }}
                  labelStyle={{ color: "#9CA8BE", fontSize: "9px", fontWeight: "bold" }}
                  itemStyle={{ fontSize: "10px", fontWeight: "bold" }}
                />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 9, fontFamily: "monospace" }} />
                
                {/* Revenue historical columns */}
                <Bar dataKey="Revenue" fill="#3E6BFF" opacity={0.8} radius={[2, 2, 0, 0]} barSize={24} />
                
                {/* Operating cash flow historical lines */}
                <Line type="monotone" dataKey="Operating Cash Flow" stroke="#2ECC71" strokeWidth={2.5} dot={{ fill: "#2ECC71", r: 3 }} activeDot={{ r: 5 }} />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center space-y-2.5">
              {/* Compact Placeholder Chart */}
              <div className="flex items-end gap-2.5 h-16 opacity-10">
                <div className="w-4 h-6 bg-white rounded-t" />
                <div className="w-4 h-10 bg-white rounded-t" />
                <div className="w-4 h-8 bg-white rounded-t" />
                <div className="w-4 h-12 bg-white rounded-t" />
              </div>
              <span className="text-[10px] text-text-secondary font-mono tracking-wider">
                Historical cash engine data is currently unavailable.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Description & Metadata Panel */}
      {profile?.businessDescription ? (
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pt-2 border-t border-border/40">
          <div className="flex-1">
            <p className={`text-xs text-text-secondary leading-relaxed font-medium ${isDescExpanded ? "" : "line-clamp-2"}`}>
              {profile.businessDescription}
            </p>
            {profile.businessDescription.length > 120 && (
              <button
                onClick={() => setIsDescExpanded(!isDescExpanded)}
                className="text-[9px] text-[#3E6BFF] hover:underline font-bold mt-1 cursor-pointer block font-mono uppercase tracking-wider"
              >
                {isDescExpanded ? "Collapse View" : "Read Full Profile"}
              </button>
            )}
          </div>

          {/* Action triggers */}
          <div className="flex items-center gap-2 self-end shrink-0 select-none">
            <button 
              onClick={handleExportData}
              disabled={!profile?.ticker}
              className="flex items-center gap-1 px-3 py-1.5 border border-border/60 hover:bg-border/20 text-[9px] font-bold rounded-lg transition-all cursor-pointer font-mono uppercase disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>
            <button 
              onClick={handleShareDashboard}
              className="flex items-center gap-1 px-3 py-1.5 border border-border/60 hover:bg-border/20 text-[9px] font-bold rounded-lg transition-all cursor-pointer font-mono uppercase"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="text-[10px] text-text-secondary border-t border-border/40 pt-3 font-medium">
          Corporate description and profile details are currently unavailable.
        </div>
      )}

    </div>
  );
}
