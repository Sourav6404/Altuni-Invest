import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { PlatformReport } from "../../mock/mockData";
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip,
  Legend,
  CartesianGrid
} from "recharts";
import { Plus, X, Search, Trophy, TrendingUp } from "lucide-react";

import { API_BASE_URL } from "../../config";

export default function CompareTab() {
  const { compareTickers, toggleCompareTicker, clearCompare, showToast } = useApp();
  const [searchInput, setSearchInput] = useState("");

  const handleAddTicker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    const clean = searchInput.trim().toUpperCase();
    
    if (compareTickers.includes(clean)) {
      showToast(`${clean} is already in the comparison list.`, "info");
      return;
    }

    toggleCompareTicker(clean);
    setSearchInput("");
  };

  const [resolvedReports, setResolvedReports] = useState<PlatformReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (compareTickers.length === 0) {
      setResolvedReports([]);
      return;
    }

    setIsLoading(true);
    console.log("[CompareTab] Fetching benchmark matrix from backend...");
    fetch(`${API_BASE_URL}/api/compare`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ tickers: compareTickers })
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP status ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (data.success && data.data.length > 0) {
          setResolvedReports(data.data);
        } else {
          throw new Error("Empty dataset");
        }
      })
      .catch(err => {
        console.warn("[CompareTab] Backend compare failed:", err);
        setResolvedReports([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [compareTickers]);

  const comparedReports = resolvedReports;

  const getWinner = () => {
    if (comparedReports.length === 0) return null;
    let winner = comparedReports[0];
    for (const r of comparedReports) {
      if (r.recommendation.investmentScore > winner.recommendation.investmentScore) {
        winner = r;
      }
    }
    return winner;
  };

  const winner = getWinner();

  // Map data for Recharts comparison
  const chartsData = [
    {
      subject: "Score / 10",
      ...comparedReports.reduce((acc, curr) => {
        acc[curr.companyResearch.ticker || ""] = Math.round(curr.recommendation.investmentScore / 10);
        return acc;
      }, {} as Record<string, number>)
    },
    {
      subject: "Valuation / 10",
      ...comparedReports.reduce((acc, curr) => {
        acc[curr.companyResearch.ticker || ""] = Math.round(curr.valuation.confidence * 9);
        return acc;
      }, {} as Record<string, number>)
    },
    {
      subject: "Risk (Lower is better) / 10",
      ...comparedReports.reduce((acc, curr) => {
        acc[curr.companyResearch.ticker || ""] = Math.round((100 - curr.risk.overallRiskScore) / 10);
        return acc;
      }, {} as Record<string, number>)
    },
    {
      subject: "Sentiment / 10",
      ...comparedReports.reduce((acc, curr) => {
        acc[curr.companyResearch.ticker || ""] = Math.round(curr.sentiment.redditBullishPct / 10);
        return acc;
      }, {} as Record<string, number>)
    }
  ];

  const barChartData = comparedReports.map(r => ({
    name: r.companyResearch.ticker,
    "P/E Ratio": r.valuation.metrics.pe || 25,
    "Return on Equity %": r.financialStatements.returnOnEquity || 20,
    "Profit Margin %": r.financialStatements.profitMargin || 15
  }));

  const COLORS = ["#6C63FF", "#2ED573", "#FFA502", "#3B82F6"];

  return (
    <div className="bg-card border border-border rounded-2xl p-6 transition-all duration-300 space-y-6 animate-fade-in">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-base font-extrabold text-white">Compare Stocks</h3>
          <p className="text-[11px] text-text-secondary mt-0.5 font-medium">Compare financial health, risk levels, and valuations for up to 4 assets.</p>
        </div>

        {/* Add Ticker Form */}
        <form onSubmit={handleAddTicker} className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter ticker (e.g. TSLA)..."
              className="pl-8 pr-3 py-1.5 text-xs bg-background border border-border rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent placeholder:text-text-secondary/50 uppercase"
            />
          </div>
          <button 
            type="submit"
            className="p-1.5 bg-primary hover:bg-primary/90 text-white rounded-lg transition-all cursor-pointer"
            title="Add to comparison"
          >
            <Plus className="w-4.5 h-4.5" />
          </button>
        </form>
      </div>

      {/* Compare list tags */}
      {compareTickers.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold text-text-secondary uppercase mr-1">Benchmarking:</span>
          {compareTickers.map(t => (
            <span key={t} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-muted border border-border rounded-lg text-xs font-bold text-white">
              <span>{t}</span>
              <button 
                onClick={() => toggleCompareTicker(t)}
                className="text-text-secondary hover:text-red cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <button 
            onClick={clearCompare}
            className="text-[10px] text-text-secondary hover:text-white font-bold ml-2 cursor-pointer"
          >
            Clear All
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-xs text-text-secondary font-mono uppercase tracking-wider">Running AI Multi-Agent Comparison...</p>
        </div>
      ) : comparedReports.length < 2 ? (
        <div className="py-16 text-center space-y-3 bg-muted/10 border border-dashed border-border/60 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center text-text-secondary mx-auto">
            <Search className="w-4.5 h-4.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Select two analyzed companies to compare.</h4>
            <p className="text-[10px] text-text-secondary mt-1">Enter stock tickers above to compare financial metrics side by side.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Winner Highlight Banner */}
          {winner && comparedReports.length > 1 && (
            <div className="bg-green/5 border border-green/20 rounded-xl p-4 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-green/10 border border-green/20 flex items-center justify-center text-green shrink-0">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Consensus Leader: <span className="text-green font-extrabold">{winner.companyResearch.companyName} ({winner.companyResearch.ticker})</span></h4>
                <p className="text-[10px] text-text-secondary mt-0.5 leading-relaxed font-medium">
                  Highest overall investment rating score of <span className="text-white font-bold">{winner.recommendation.investmentScore}/100</span> with a <span className="text-green font-bold">{winner.recommendation.recommendation}</span> consensus recommendation.
                </p>
              </div>
            </div>
          )}

          {/* Side by Side Metric Comparison Grid */}
          <div className="border border-border/40 rounded-xl overflow-hidden bg-muted/10">
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border/40 bg-muted text-text-secondary font-bold">
                    <th className="p-3">Metric Benchmark</th>
                    {comparedReports.map(r => (
                      <th key={r.companyResearch.ticker} className="p-3 font-bold text-white">
                        {r.companyResearch.ticker}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20 text-text-secondary font-medium">
                  <tr className="hover:bg-muted/10">
                    <td className="p-3 font-bold text-white">Overall Rating Score</td>
                    {comparedReports.map(r => (
                      <td key={r.companyResearch.ticker} className="p-3 font-mono font-bold text-white">
                        {r.recommendation.investmentScore} / 100
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/10">
                    <td className="p-3 font-bold text-white">Recommendation</td>
                    {comparedReports.map(r => (
                      <td key={r.companyResearch.ticker} className="p-3">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                          r.recommendation.recommendation.includes("Buy") 
                            ? "bg-green/10 text-green border-green/20" 
                            : "bg-orange/10 text-orange border-orange/20"
                        }`}>
                          {r.recommendation.recommendation}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/10">
                    <td className="p-3 font-bold text-white">Valuation Category</td>
                    {comparedReports.map(r => (
                      <td key={r.companyResearch.ticker} className="p-3">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                          r.valuation.valuation === "Undervalued" ? "bg-green/10 text-green border-green/20" : "bg-muted border border-border text-text-secondary"
                        }`}>
                          {r.valuation.valuation}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/10">
                    <td className="p-3 font-bold text-white">P/E Ratio (TTM)</td>
                    {comparedReports.map(r => (
                      <td key={r.companyResearch.ticker} className="p-3 font-mono">
                        {r.valuation.metrics.pe || "--"}x
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/10">
                    <td className="p-3 font-bold text-white">Beta volatility</td>
                    {comparedReports.map(r => (
                      <td key={r.companyResearch.ticker} className="p-3 font-mono">
                        {r.financialStatements.beta || "--"}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/10">
                    <td className="p-3 font-bold text-white">ROE (Profitability)</td>
                    {comparedReports.map(r => (
                      <td key={r.companyResearch.ticker} className="p-3 font-mono">
                        {r.financialStatements.returnOnEquity || "--"}%
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/10">
                    <td className="p-3 font-bold text-white">Risk Rating</td>
                    {comparedReports.map(r => (
                      <td key={r.companyResearch.ticker} className="p-3">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                          r.risk.riskLevel === "Low" ? "bg-green/10 text-green border-green/20" : "bg-orange/10 text-orange border-orange/20"
                        }`}>
                          {r.risk.riskLevel}
                        </span>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3">
            {/* Multi-radar comparison */}
            <div className="h-64 border border-border/40 bg-muted/20 rounded-xl p-4 flex flex-col justify-between">
              <h5 className="text-[10px] font-bold text-text-secondary uppercase">Vector Score Benchmarking</h5>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartsData}>
                    <PolarGrid stroke="#1E2E48/40" />
                    <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={9} />
                    <PolarRadiusAxis stroke="#94a3b8" fontSize={8} />
                    {compareTickers.map((t, idx) => (
                      <Radar 
                        key={t}
                        name={t} 
                        dataKey={t} 
                        stroke={COLORS[idx % COLORS.length]} 
                        fill={COLORS[idx % COLORS.length]} 
                        fillOpacity={0.07} 
                      />
                    ))}
                    <Legend wrapperStyle={{ fontSize: "10px" }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* PE multiple bar chart */}
            <div className="h-64 border border-border/40 bg-muted/20 rounded-xl p-4 flex flex-col justify-between">
              <h5 className="text-[10px] font-bold text-text-secondary uppercase">Metrics Multiples Benchmark</h5>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} margin={{ left: -15 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E2E48/20" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                    <YAxis stroke="#94a3b8" fontSize={9} />
                    <Tooltip contentStyle={{ background: "#101B2E" }} />
                    <Legend wrapperStyle={{ fontSize: "10px" }} />
                    <Bar dataKey="P/E Ratio" fill="#6C63FF" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="Return on Equity %" fill="#2ED573" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
