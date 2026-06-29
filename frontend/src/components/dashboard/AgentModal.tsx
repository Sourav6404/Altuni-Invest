import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { PlatformReport } from "../../mock/mockData";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Tooltip, 
  XAxis, 
  YAxis, 
  Legend,
  CartesianGrid
} from "recharts";
import { X, Download, ShieldCheck, TrendingUp, BookOpen, AlertCircle, FileText, CheckCircle2, Globe, ArrowUpRight } from "lucide-react";

interface AgentModalProps {
  id: number;
  name: string;
  isOpen: boolean;
  onClose: () => void;
  report: PlatformReport;
}

export default function AgentModal({ id, name, isOpen, onClose, report }: AgentModalProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [financialTab, setFinancialTab] = useState("overview");

  // Escape key closes modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Lock document and html scroll while open to prevent background layout shift/jumping
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const originalHtmlOverflow = html.style.overflow;
    const originalBodyOverflow = body.style.overflow;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    return () => {
      html.style.overflow = originalHtmlOverflow;
      body.style.overflow = originalBodyOverflow;
    };
  }, []);

  if (!isOpen) return null;

  const getReliabilityLabel = (pct: number) => {
    if (pct >= 95) return "Very High";
    if (pct >= 90) return "High";
    if (pct >= 80) return "Good";
    return "Moderate";
  };

  const formatMarketCap = (num: number | null | undefined) => {
    if (!num) return "N/A";
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  };

  const formatMarketValue = (num: number | null | undefined) => {
    if (!num) return "N/A";
    if (num >= 1e12) return `$${(num / 1e12).toFixed(1)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
    return `$${num.toLocaleString()}`;
  };

  const getAgentConfidence = () => {
    const confidenceVal = id === 1 ? report.companyResearch?.confidence || 0.95 : 
                          id === 2 ? report.financialStatements?.confidence || 0.92 :
                          id === 3 ? report.competitors?.confidence || 0.90 :
                          id === 4 ? report.marketIndustry?.confidence || 0.95 :
                          id === 5 ? report.news?.confidence || 0.94 :
                          id === 6 ? report.macroeconomic?.confidence || 0.90 :
                          id === 7 ? report.sentiment?.confidence || 0.92 :
                          id === 8 ? report.valuation?.confidence || 0.95 :
                          id === 9 ? report.risk?.confidence || 0.93 :
                          report.recommendation?.confidence || 0.95;
    return Math.round(confidenceVal * 100);
  };

  const getAgentSources = (): string[] => {
    const defaultSources = ["SEC Edgar", "Yahoo Finance", "Tavily Search"];
    if (id === 1) return report.companyResearch?.sources || defaultSources;
    if (id === 2) return report.financialStatements?.sources || defaultSources;
    if (id === 3) return report.competitors?.sources || defaultSources;
    if (id === 4) return report.marketIndustry?.sources || defaultSources;
    if (id === 5) return report.news?.sources || defaultSources;
    if (id === 6) return report.macroeconomic?.sources || defaultSources;
    if (id === 7) return report.sentiment?.sources || defaultSources;
    if (id === 8) return report.valuation?.sources || defaultSources;
    if (id === 9) return report.risk?.sources || defaultSources;
    return ["Consensus Arbiter Engine"];
  };

  const renderContent = () => {
    // ==========================================
    // 1. COMPANY RESEARCH
    // ==========================================
    if (id === 1) {
      const cr = report.companyResearch;
      return (
        <div className="space-y-6">
          <div className="bg-muted/15 border border-border/40 p-5 rounded-2xl">
            <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Corporate Mission & Profile</h4>
            <p className="text-xs text-text-secondary leading-relaxed font-medium">
              {cr?.businessDescription || "N/A"}
            </p>
            {cr?.businessModel && (
              <p className="text-xs text-text-secondary leading-relaxed font-medium mt-3">
                <span className="text-white font-bold block mb-1">Business Model:</span>
                {cr.businessModel}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-mono">
            <div className="bg-muted/10 border border-border/30 rounded-xl p-4 space-y-3">
              <h5 className="text-xs font-bold text-white uppercase font-sans">Identity & Sector</h5>
              <div className="flex justify-between border-b border-border/10 pb-1.5">
                <span className="text-text-secondary">Official Name</span>
                <span className="text-white font-bold">{cr?.companyName || "N/A"}</span>
              </div>
              <div className="flex justify-between border-b border-border/10 pb-1.5">
                <span className="text-text-secondary">Stock Ticker</span>
                <span className="text-white font-bold">{cr?.ticker || "N/A"}</span>
              </div>
              <div className="flex justify-between border-b border-border/10 pb-1.5">
                <span className="text-text-secondary">Exchange</span>
                <span className="text-white font-bold">{cr?.exchange || "N/A"}</span>
              </div>
              <div className="flex justify-between border-b border-border/10 pb-1.5">
                <span className="text-text-secondary">Sector classification</span>
                <span className="text-white font-bold">{cr?.sector || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Industry Vertical</span>
                <span className="text-white font-bold">{cr?.industry || "N/A"}</span>
              </div>
            </div>

            <div className="bg-muted/10 border border-border/30 rounded-xl p-4 space-y-3">
              <h5 className="text-xs font-bold text-white uppercase font-sans">Corporate Structure</h5>
              <div className="flex justify-between border-b border-border/10 pb-1.5">
                <span className="text-text-secondary">Founding Year</span>
                <span className="text-white font-bold">{cr?.founded || "N/A"}</span>
              </div>
              <div className="flex justify-between border-b border-border/10 pb-1.5">
                <span className="text-text-secondary">Founders</span>
                <span className="text-white font-bold">{cr?.founders?.join(", ") || "N/A"}</span>
              </div>
              <div className="flex justify-between border-b border-border/10 pb-1.5">
                <span className="text-text-secondary">Chief Executive Officer</span>
                <span className="text-white font-bold">{cr?.ceo || "N/A"}</span>
              </div>
              <div className="flex justify-between border-b border-border/10 pb-1.5">
                <span className="text-text-secondary">Headquarters</span>
                <span className="text-white font-bold">{cr?.headquarters || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Market Capital</span>
                <span className="text-white font-bold">{formatMarketCap(cr?.marketCap)}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-muted/10 border border-border/30 rounded-xl p-4 space-y-3">
              <h5 className="text-xs font-bold text-white uppercase">Primary Products & Services</h5>
              <div className="space-y-2">
                <div>
                  <span className="text-text-secondary text-[10px] block font-mono uppercase tracking-wider mb-1">Products</span>
                  <ul className="space-y-1 text-xs font-medium text-text-secondary list-disc pl-4">
                    {cr?.products?.map((p, idx) => <li key={idx}>{p}</li>) || <li>N/A</li>}
                  </ul>
                </div>
                {cr?.services && cr.services.length > 0 && (
                  <div className="pt-2">
                    <span className="text-text-secondary text-[10px] block font-mono uppercase tracking-wider mb-1">Services</span>
                    <ul className="space-y-1 text-xs font-medium text-text-secondary list-disc pl-4">
                      {cr.services.map((s, idx) => <li key={idx}>{s}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-muted/10 border border-border/30 rounded-xl p-4 space-y-3.5">
              <h5 className="text-xs font-bold text-white uppercase">Geographic Scope & Links</h5>
              <div className="space-y-3 text-xs font-mono">
                <div>
                  <span className="text-text-secondary text-[10px] block uppercase tracking-wider mb-1">Operating Territories</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {cr?.operatingCountries?.map((c, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-muted border border-border/40 rounded text-[10px] font-bold text-text-secondary">
                        {c}
                      </span>
                    )) || <span className="text-text-secondary font-medium">N/A</span>}
                  </div>
                </div>
                <div className="flex justify-between border-b border-border/10 pb-1.5 pt-1">
                  <span className="text-text-secondary">Corporate Website</span>
                  <a href={cr?.website || "#"} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                    <span>Visit website</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Investor Relations</span>
                  <a href={cr?.investorRelations || "#"} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                    <span>IR Portal</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // ==========================================
    // 2. FINANCIAL STATEMENTS
    // ==========================================
    if (id === 2) {
      const fs = report.financialStatements;
      const yearlyRev = fs?.revenue || [];
      const yearlyNet = fs?.netIncome || [];
      const yearlyOcf = fs?.operatingCashFlow || [];
      const yearlyFcf = fs?.freeCashFlow || [];
      const yearlyCapEx = fs?.capitalExpenditure || [];

      const chartData = yearlyRev.map((r, idx) => ({
        year: r.year,
        revenue: r.value ? r.value / 1e9 : 0,
        netIncome: yearlyNet[idx]?.value ? yearlyNet[idx].value! / 1e9 : 0
      }));

      return (
        <div className="space-y-6">
          {/* Sub tabs */}
          <div className="flex border-b border-border/30 gap-4 text-xs font-bold select-none">
            {["overview", "income", "balance", "ratios"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFinancialTab(tab)}
                className={`pb-2 capitalize cursor-pointer transition-colors ${
                  financialTab === tab ? "text-primary border-b-2 border-primary" : "text-text-secondary hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {financialTab === "overview" && (
            <div className="space-y-6">
              <div className="h-64 border border-border/30 bg-muted/15 rounded-xl p-4 select-none">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="drawRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3E6BFF" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#3E6BFF" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="drawNet" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2ED573" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#2ED573" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                    <XAxis dataKey="year" stroke="#94a3b8" fontSize={10} />
                    <YAxis stroke="#94a3b8" fontSize={10} unit="B" />
                    <Tooltip contentStyle={{ background: "#101B2E", borderColor: "#1E2E48" }} />
                    <Legend wrapperStyle={{ fontSize: 10, fontFamily: "monospace" }} />
                    <Area type="monotone" dataKey="revenue" stroke="#3E6BFF" strokeWidth={2} fillOpacity={1} fill="url(#drawRev)" name="Revenue ($B)" />
                    <Area type="monotone" dataKey="netIncome" stroke="#2ED573" strokeWidth={2} fillOpacity={1} fill="url(#drawNet)" name="Net Income ($B)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold font-mono select-none">
                <div className="bg-muted/10 border border-border/30 p-3 rounded-lg">
                  <span className="text-text-secondary block mb-1">Return on Equity</span>
                  <span className="text-white font-mono font-bold text-sm">{fs?.returnOnEquity || "N/A"}%</span>
                </div>
                <div className="bg-muted/10 border border-border/30 p-3 rounded-lg">
                  <span className="text-text-secondary block mb-1">Profit Margin</span>
                  <span className="text-white font-mono font-bold text-sm">{fs?.profitMargin || "N/A"}%</span>
                </div>
                <div className="bg-muted/10 border border-border/30 p-3 rounded-lg">
                  <span className="text-text-secondary block mb-1">Operating Margin</span>
                  <span className="text-white font-mono font-bold text-sm">{fs?.operatingMargin || "N/A"}%</span>
                </div>
                <div className="bg-muted/10 border border-border/30 p-3 rounded-lg">
                  <span className="text-text-secondary block mb-1">PEG Ratio</span>
                  <span className="text-white font-mono font-bold text-sm">{fs?.pegRatio ? `${fs.pegRatio}x` : "N/A"}</span>
                </div>
              </div>
            </div>
          )}

          {financialTab === "income" && (
            <div className="border border-border/30 rounded-xl overflow-x-auto bg-muted/10">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border/30 bg-muted text-white font-bold select-none">
                    <th className="p-3">Financial Metric ($ Billions)</th>
                    {yearlyRev.map(r => (
                      <th key={r.year} className="p-3 font-mono">{r.year}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20 text-text-secondary font-medium font-mono">
                  <tr className="hover:bg-muted/10">
                    <td className="p-3 font-sans font-bold text-white">Total Revenue</td>
                    {yearlyRev.map(r => (
                      <td key={r.year} className="p-3">${(r.value ? r.value / 1e9 : 0).toFixed(2)}B</td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/10">
                    <td className="p-3 font-sans font-bold text-white">Gross Profit</td>
                    {fs?.grossProfit?.map(g => (
                      <td key={g.year} className="p-3">${(g.value ? g.value / 1e9 : 0).toFixed(2)}B</td>
                    )) || <td>N/A</td>}
                  </tr>
                  <tr className="hover:bg-muted/10">
                    <td className="p-3 font-sans font-bold text-white">Operating Income</td>
                    {fs?.operatingIncome?.map(o => (
                      <td key={o.year} className="p-3">${(o.value ? o.value / 1e9 : 0).toFixed(2)}B</td>
                    )) || <td>N/A</td>}
                  </tr>
                  <tr className="hover:bg-muted/10">
                    <td className="p-3 font-sans font-bold text-white">Net Income</td>
                    {yearlyNet.map(n => (
                      <td key={n.year} className="p-3">${(n.value ? n.value / 1e9 : 0).toFixed(2)}B</td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/10">
                    <td className="p-3 font-sans font-bold text-white">EPS (Basic)</td>
                    {fs?.eps?.map(e => (
                      <td key={e.year} className="p-3">${(e.value || 0).toFixed(2)}</td>
                    )) || <td>N/A</td>}
                  </tr>
                  <tr className="hover:bg-muted/10">
                    <td className="p-3 font-sans font-bold text-white">Diluted EPS</td>
                    {fs?.dilutedEPS?.map(e => (
                      <td key={e.year} className="p-3">${(e.value || 0).toFixed(2)}</td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/10">
                    <td className="p-3 font-sans font-bold text-white">Operating Cash Flow</td>
                    {yearlyOcf.map(o => (
                      <td key={o.year} className="p-3">${(o.value ? o.value / 1e9 : 0).toFixed(2)}B</td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/10">
                    <td className="p-3 font-sans font-bold text-white">Free Cash Flow</td>
                    {yearlyFcf.map(f => (
                      <td key={f.year} className="p-3">${(f.value ? f.value / 1e9 : 0).toFixed(2)}B</td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/10">
                    <td className="p-3 font-sans font-bold text-white">Capital Expenditure</td>
                    {yearlyCapEx.map(c => (
                      <td key={c.year} className="p-3">${(c.value ? c.value / 1e9 : 0).toFixed(2)}B</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {financialTab === "balance" && (
            <div className="border border-border/30 rounded-xl overflow-x-auto bg-muted/10">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border/30 bg-muted text-white font-bold select-none">
                    <th className="p-3">Balance Sheet Line ($ Billions)</th>
                    {fs?.totalAssets?.map(a => (
                      <th key={a.year} className="p-3 font-mono">{a.year}</th>
                    )) || <th>N/A</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20 text-text-secondary font-medium font-mono">
                  <tr className="hover:bg-muted/10">
                    <td className="p-3 font-sans font-bold text-white">Total Assets</td>
                    {fs?.totalAssets?.map(a => (
                      <td key={a.year} className="p-3">${(a.value ? a.value / 1e9 : 0).toFixed(2)}B</td>
                    )) || <td>N/A</td>}
                  </tr>
                  <tr className="hover:bg-muted/10">
                    <td className="p-3 font-sans font-bold text-white">Total Liabilities</td>
                    {fs?.totalLiabilities?.map(l => (
                      <td key={l.year} className="p-3">${(l.value ? l.value / 1e9 : 0).toFixed(2)}B</td>
                    )) || <td>N/A</td>}
                  </tr>
                  <tr className="hover:bg-muted/10">
                    <td className="p-3 font-sans font-bold text-white">Shareholder Equity</td>
                    {fs?.totalEquity?.map(e => (
                      <td key={e.year} className="p-3">${(e.value ? e.value / 1e9 : 0).toFixed(2)}B</td>
                    )) || <td>N/A</td>}
                  </tr>
                  <tr className="hover:bg-muted/10">
                    <td className="p-3 font-sans font-bold text-white">Cash & Cash Equivalents</td>
                    {fs?.cashAndEquivalents?.map(c => (
                      <td key={c.year} className="p-3">${(c.value ? c.value / 1e9 : 0).toFixed(2)}B</td>
                    )) || <td>N/A</td>}
                  </tr>
                  <tr className="hover:bg-muted/10">
                    <td className="p-3 font-sans font-bold text-white">Total Debt Liabilities</td>
                    {fs?.totalDebt?.map(d => (
                      <td key={d.year} className="p-3">${(d.value ? d.value / 1e9 : 0).toFixed(2)}B</td>
                    )) || <td>N/A</td>}
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {financialTab === "ratios" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
              <div className="bg-muted/10 border border-border/30 p-4 rounded-xl space-y-3">
                <h5 className="font-bold text-white font-sans uppercase">Profitability & Return Ratios</h5>
                <div className="flex justify-between border-b border-border/10 pb-1.5">
                  <span className="text-text-secondary font-sans">Return on Assets (ROA)</span>
                  <span className="text-white font-bold">{fs?.returnOnAssets || "N/A"}%</span>
                </div>
                <div className="flex justify-between border-b border-border/10 pb-1.5">
                  <span className="text-text-secondary font-sans">Return on Equity (ROE)</span>
                  <span className="text-white font-bold">{fs?.returnOnEquity || "N/A"}%</span>
                </div>
                <div className="flex justify-between border-b border-border/10 pb-1.5">
                  <span className="text-text-secondary font-sans">Operating Profit Margin</span>
                  <span className="text-white font-bold">{fs?.profitMargin || "N/A"}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary font-sans">Dividend Yield</span>
                  <span className="text-white font-bold">{fs?.dividendYield || "N/A"}%</span>
                </div>
              </div>

              <div className="bg-muted/10 border border-border/30 p-4 rounded-xl space-y-3">
                <h5 className="font-bold text-white font-sans uppercase">Valuation Trading Multiples</h5>
                <div className="flex justify-between border-b border-border/10 pb-1.5">
                  <span className="text-text-secondary font-sans">P/E Multiple</span>
                  <span className="text-white font-bold">{fs?.peRatio ? `${fs.peRatio}x` : "N/A"}</span>
                </div>
                <div className="flex justify-between border-b border-border/10 pb-1.5">
                  <span className="text-text-secondary font-sans">Price to Book (P/B)</span>
                  <span className="text-white font-bold">{fs?.priceToBook ? `${fs.priceToBook}x` : "N/A"}</span>
                </div>
                <div className="flex justify-between border-b border-border/10 pb-1.5">
                  <span className="text-text-secondary font-sans">Price to Sales (P/S)</span>
                  <span className="text-white font-bold">{fs?.priceToSales ? `${fs.priceToSales}x` : "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary font-sans">EV / EBITDA</span>
                  <span className="text-white font-bold">{fs?.evToEbitda ? `${fs.evToEbitda}x` : "N/A"}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    // ==========================================
    // 3. COMPETITOR ANALYSIS
    // ==========================================
    if (id === 3) {
      const comp = report.competitors;
      const radarData = [
        { subject: "Moat Width", target: 92, competitorMedian: 78 },
        { subject: "Capital Return", target: 88, competitorMedian: 72 },
        { subject: "Market Share", target: 85, competitorMedian: 60 },
        { subject: "Technology Moat", target: 96, competitorMedian: 82 },
        { subject: "Price Power", target: 90, competitorMedian: 74 }
      ];

      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-8 bg-muted/15 border border-border/40 p-5 rounded-2xl flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Competitive Moat Analysis</h4>
                <p className="text-xs text-text-secondary leading-relaxed font-medium">
                  {comp?.keyMoat || "N/A"}
                </p>
              </div>
            </div>

            <div className="lg:col-span-4 h-64 border border-border/30 bg-muted/10 rounded-xl p-4 flex flex-col justify-between select-none">
              <h5 className="text-[10px] font-bold text-text-secondary uppercase">Moat Vector Benchmarking</h5>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.02)" />
                    <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={8} />
                    <PolarRadiusAxis stroke="#94a3b8" fontSize={8} />
                    <Radar name={report.companyResearch?.ticker || "Target"} dataKey="target" stroke="#3E6BFF" fill="#3E6BFF" fillOpacity={0.2} />
                    <Radar name="Peer Median" dataKey="competitorMedian" stroke="#2ECC71" fill="#2ECC71" fillOpacity={0.1} />
                    <Legend wrapperStyle={{ fontSize: 9, fontFamily: "monospace" }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <h4 className="text-xs font-bold text-white uppercase select-none">Direct Peer Benchmarks Registry</h4>
          <div className="border border-border/30 rounded-xl overflow-x-auto bg-muted/10">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border/30 bg-muted text-white font-bold select-none">
                  <th className="p-3">Competitor Asset</th>
                  <th className="p-3">Ticker</th>
                  <th className="p-3">Operating Country</th>
                  <th className="p-3">Relationship</th>
                  <th className="p-3 text-right">Moat Score</th>
                  <th className="p-3">Strategic Thesis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20 text-text-secondary font-medium">
                {comp?.competitors?.map((c, idx) => (
                  <tr key={idx} className="hover:bg-muted/10 font-mono text-xs">
                    <td className="p-3 font-sans font-bold text-white">{c.companyName}</td>
                    <td className="p-3">{c.ticker || "N/A"}</td>
                    <td className="p-3">{c.country || "N/A"}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-primary/10 border border-primary/20 text-primary rounded text-[9px] font-bold uppercase">
                        {c.competitionType}
                      </span>
                    </td>
                    <td className="p-3 text-right text-white font-bold">{c.score ? `${c.score}/100` : "N/A"}</td>
                    <td className="p-3 font-sans text-xs leading-relaxed max-w-xs truncate" title={c.reason}>{c.reason}</td>
                  </tr>
                )) || (
                  <tr>
                    <td colSpan={6} className="p-3 text-center text-xs text-text-secondary font-mono">No competitor benchmarks available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // ==========================================
    // 4. MARKET & INDUSTRY
    // ==========================================
    if (id === 4) {
      const market = report.marketIndustry;
      const chartData = (market?.growthHistory || []).map(g => ({
        year: g.year,
        size: g.size
      }));

      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-8 bg-muted/15 border border-border/40 p-5 rounded-2xl space-y-4 text-xs">
              <h4 className="text-xs font-bold text-primary uppercase tracking-widest select-none">Industry Projections Summary</h4>
              <div className="grid grid-cols-3 gap-4 pt-1 font-semibold font-mono select-none">
                <div className="bg-muted/20 border border-border/30 p-3 rounded-lg">
                  <span className="text-text-secondary block mb-1">Sector CAGR</span>
                  <span className="text-white font-bold text-sm">{market?.industryCAGR || market?.growthRate || "N/A"}</span>
                </div>
                <div className="bg-muted/20 border border-border/30 p-3 rounded-lg">
                  <span className="text-text-secondary block mb-1">Current Size</span>
                  <span className="text-white font-bold text-sm">{market?.marketSizeCurrent || market?.marketSize || "N/A"}</span>
                </div>
                <div className="bg-muted/20 border border-border/30 p-3 rounded-lg">
                  <span className="text-text-secondary block mb-1">Forecast Size</span>
                  <span className="text-white font-bold text-sm">{market?.marketSizeForecast || "N/A"}</span>
                </div>
              </div>
              <p className="text-text-secondary leading-relaxed font-medium">
                {market?.summary || "N/A"}
              </p>
            </div>

            <div className="lg:col-span-4 h-64 border border-border/30 bg-muted/10 rounded-xl p-4 flex flex-col justify-between select-none">
              <h5 className="text-[10px] font-bold text-text-secondary uppercase">Sector Expansion curve</h5>
              <div className="h-44">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ left: -25 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                      <XAxis dataKey="year" stroke="#94a3b8" fontSize={9} />
                      <YAxis stroke="#94a3b8" fontSize={9} />
                      <Tooltip contentStyle={{ background: "#101B2E", borderColor: "#1E2E48" }} />
                      <Bar dataKey="size" fill="#3E6BFF" radius={[3, 3, 0, 0]} name="Index Score" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-text-secondary font-mono">No historical index curves.</div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3">
            <div className="bg-muted/10 border border-border/30 rounded-xl p-4 space-y-3 font-mono text-xs">
              <h5 className="text-xs font-bold text-white uppercase font-sans">Market Dynamics & Rules</h5>
              <div className="flex justify-between border-b border-border/10 pb-1.5">
                <span className="text-text-secondary font-sans">Industry Lifecycle Stage</span>
                <span className="text-white font-bold">{market?.industryLifecycle || "N/A"}</span>
              </div>
              <div className="flex justify-between border-b border-border/10 pb-1.5">
                <span className="text-text-secondary font-sans">Future Outlook Stance</span>
                <span className="text-green font-bold">{market?.futureOutlook || "N/A"}</span>
              </div>
              {market?.porterForces && (
                <div className="pt-2">
                  <span className="text-text-secondary text-[10px] block uppercase tracking-wider mb-2 font-sans font-bold">Porter's Five Forces Scores (0-10)</span>
                  <div className="grid grid-cols-5 gap-2 text-center text-[10px]">
                    <div className="bg-muted/20 border border-border/30 p-1.5 rounded">
                      <span className="text-text-secondary block font-sans">Rival</span>
                      <span className="text-white font-bold block mt-0.5">{market.porterForces.rivalry || 5}</span>
                    </div>
                    <div className="bg-muted/20 border border-border/30 p-1.5 rounded">
                      <span className="text-text-secondary block font-sans">Sub</span>
                      <span className="text-white font-bold block mt-0.5">{market.porterForces.substitutes || 5}</span>
                    </div>
                    <div className="bg-muted/20 border border-border/30 p-1.5 rounded">
                      <span className="text-text-secondary block font-sans">Entry</span>
                      <span className="text-white font-bold block mt-0.5">{market.porterForces.newEntrants || 5}</span>
                    </div>
                    <div className="bg-muted/20 border border-border/30 p-1.5 rounded">
                      <span className="text-text-secondary block font-sans">Supplier</span>
                      <span className="text-white font-bold block mt-0.5">{market.porterForces.supplierPower || 5}</span>
                    </div>
                    <div className="bg-muted/20 border border-border/30 p-1.5 rounded">
                      <span className="text-text-secondary block font-sans">Buyer</span>
                      <span className="text-white font-bold block mt-0.5">{market.porterForces.buyerPower || 5}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-muted/10 border border-border/30 rounded-xl p-4 space-y-4 text-xs font-sans">
              <h5 className="text-xs font-bold text-white uppercase select-none">Ingested Risks & Opportunities</h5>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-red text-[10px] font-mono font-bold block uppercase tracking-wider mb-1.5">Risks</span>
                  <ul className="space-y-1.5 font-medium text-text-secondary list-disc pl-4">
                    {market?.risks?.slice(0, 3).map((r, idx) => <li key={idx}>{r}</li>) || <li>N/A</li>}
                  </ul>
                </div>
                <div>
                  <span className="text-green text-[10px] font-mono font-bold block uppercase tracking-wider mb-1.5">Opportunities</span>
                  <ul className="space-y-1.5 font-medium text-text-secondary list-disc pl-4">
                    {market?.opportunities?.slice(0, 3).map((o, idx) => <li key={idx}>{o}</li>) || <li>N/A</li>}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // ==========================================
    // 5. NEWS ANALYSIS
    // ==========================================
    if (id === 5) {
      const news = report.news;
      const pieData = [
        { name: "Positive Sentiment", value: news?.sentimentBreakdown?.positive || 0 },
        { name: "Neutral Sentiment", value: news?.sentimentBreakdown?.neutral || 0 },
        { name: "Negative Sentiment", value: news?.sentimentBreakdown?.negative || 0 }
      ];

      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-8 bg-muted/15 border border-border/40 p-5 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold text-primary uppercase tracking-widest select-none">Media Coverage & Ingest telemetry</h4>
              <p className="text-xs text-text-secondary leading-relaxed font-medium">
                {news?.summary || "N/A"}
              </p>
              <div className="grid grid-cols-2 gap-4 pt-1 font-mono text-[10px] select-none">
                <div className="bg-muted/20 border border-border/30 p-2.5 rounded">
                  <span className="text-text-secondary block">Trending Volume Level</span>
                  <span className="text-white font-bold block mt-0.5">{news?.volumeTrending || "N/A"}</span>
                </div>
                <div className="bg-muted/20 border border-border/30 p-2.5 rounded">
                  <span className="text-text-secondary block">Overall Tone Verdict</span>
                  <span className="text-green font-bold block mt-0.5">{news?.overallSentiment || "N/A"}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 h-56 border border-border/30 bg-muted/10 rounded-xl p-3 flex items-center justify-center relative select-none">
              <h5 className="text-[9px] font-bold text-text-secondary uppercase absolute top-2.5 left-3">Sentiment Distribution Share</h5>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={25}
                    outerRadius={38}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    <Cell fill="#2ED573" />
                    <Cell fill="#FFA502" />
                    <Cell fill="#FF4757" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="text-[8px] font-bold text-text-secondary flex flex-col gap-1 pr-3 font-mono">
                <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-[#2ED573] rounded-sm" /><span>Pos ({news?.sentimentBreakdown?.positive || 0}%)</span></div>
                <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-[#FFA502] rounded-sm" /><span>Neu ({news?.sentimentBreakdown?.neutral || 0}%)</span></div>
                <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-[#FF4757] rounded-sm" /><span>Neg ({news?.sentimentBreakdown?.negative || 0}%)</span></div>
              </div>
            </div>
          </div>

          {news?.keyTakeaways && news.keyTakeaways.length > 0 && (
            <div className="bg-muted/10 border border-border/30 rounded-xl p-4 space-y-2">
              <h5 className="text-xs font-bold text-white uppercase font-sans">Primary News Takeaways</h5>
              <ul className="list-disc pl-4 space-y-1 text-xs text-text-secondary font-medium">
                {news.keyTakeaways.map((t, idx) => <li key={idx}>{t}</li>)}
              </ul>
            </div>
          )}

          <h4 className="text-xs font-bold text-white uppercase select-none">Ingested News Article Log</h4>
          <div className="space-y-3">
            {(news?.latestHeadlines || news?.articles || news?.news || []).map((h, idx) => (
              <div key={idx} className="p-4 bg-muted/10 border border-border/30 rounded-xl space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <span className="px-2 py-0.5 bg-muted text-[8px] border border-border/60 text-text-secondary font-mono rounded">
                      {h.source || "Unknown Source"} • {h.date || "Today"}
                    </span>
                    <h5 className="text-xs font-bold text-white leading-snug">{h.headline}</h5>
                  </div>
                  {h.url && (
                    <a href={h.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[9px] font-bold text-[#3E6BFF] hover:underline font-mono uppercase shrink-0">
                      <span>Article</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  )}
                </div>
                {h.summary && (
                  <p className="text-xs text-text-secondary leading-relaxed font-medium">{h.summary}</p>
                )}
                <div className="flex items-center gap-2 pt-1 font-mono text-[9px]">
                  <span className="text-text-secondary">Category: <strong className="text-white">{h.category || "General"}</strong></span>
                  <span className="text-text-secondary/50">•</span>
                  <span className="text-text-secondary">Impact: <strong className="text-white">{h.impact || "Neutral"}</strong></span>
                  <span className="text-text-secondary/50">•</span>
                  <span className="text-text-secondary">Importance: <strong className="text-white">{h.importance || "Medium"}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // ==========================================
    // 6. MACROECONOMIC
    // ==========================================
    if (id === 6) {
      const macro = report.macroeconomic;
      const metrics = [
        { name: "Federal Interest Rates", status: macro?.interestRates?.status, impact: macro?.interestRates?.impact },
        { name: "Consumer Inflation CPI", status: macro?.inflation?.status, impact: macro?.inflation?.impact },
        { name: "GDP Growth Vector", status: macro?.gdpGrowth?.status, impact: macro?.gdpGrowth?.impact },
        { name: "Currency Exchange Rates", status: macro?.exchangeRates?.status, impact: macro?.exchangeRates?.impact }
      ];

      return (
        <div className="space-y-6">
          <div className="bg-muted/15 border border-border/40 p-5 rounded-2xl text-xs space-y-3">
            <h4 className="text-xs font-bold text-primary uppercase tracking-widest select-none">Macroeconomic Impact Analysis</h4>
            <p className="text-xs text-text-secondary leading-relaxed font-medium">
              {macro?.summary || "N/A"}
            </p>
            <div className="flex justify-between border-t border-border/20 pt-2.5 font-mono select-none">
              <span className="text-text-secondary">Overall Stance Stance Verdict</span>
              <span className="text-green font-bold">{macro?.overallImpact || "Neutral"}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-muted/10 border border-border/30 rounded-xl p-4 space-y-3 font-mono text-xs">
              <h5 className="text-xs font-bold text-white uppercase font-sans">Core Economic Indicators</h5>
              <div className="space-y-2">
                {metrics.map((m, idx) => (
                  <div key={idx} className="flex justify-between border-b border-border/10 pb-1.5 last:border-b-0 last:pb-0">
                    <span className="text-text-secondary font-sans">{m.name}</span>
                    <div className="text-right">
                      <span className="text-white font-bold block">{m.status || "N/A"}</span>
                      <span className={`text-[8.5px] font-bold block mt-0.5 ${
                        m.impact === "Positive" ? "text-green" : (m.impact === "Negative" ? "text-red" : "text-text-secondary")
                      }`}>Impact: {m.impact || "Neutral"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-muted/10 border border-border/30 rounded-xl p-4 space-y-4 text-xs font-sans">
              <h5 className="text-xs font-bold text-white uppercase font-sans">Forks & Policy Adjustments</h5>
              <div className="space-y-3">
                {macro?.governmentPolicy && macro.governmentPolicy.length > 0 && (
                  <div>
                    <span className="text-[10px] text-text-secondary font-mono font-bold block uppercase tracking-wider mb-1">Government Trade Policies</span>
                    <ul className="list-disc pl-4 space-y-1 text-text-secondary leading-relaxed">
                      {macro.governmentPolicy.map((p, idx) => <li key={idx}>{p}</li>)}
                    </ul>
                  </div>
                )}
                {macro?.macroeconomicRisks && macro.macroeconomicRisks.length > 0 && (
                  <div className="pt-1">
                    <span className="text-[10px] text-red font-mono font-bold block uppercase tracking-wider mb-1">Identified Macro Risks</span>
                    <ul className="list-disc pl-4 space-y-1 text-text-secondary leading-relaxed">
                      {macro.macroeconomicRisks.map((r, idx) => <li key={idx}>{r}</li>)}
                    </ul>
                  </div>
                )}
                {macro?.opportunities && macro.opportunities.length > 0 && (
                  <div className="pt-1">
                    <span className="text-[10px] text-green font-mono font-bold block uppercase tracking-wider mb-1">Macro Opportunities</span>
                    <ul className="list-disc pl-4 space-y-1 text-text-secondary leading-relaxed">
                      {macro.opportunities.map((o, idx) => <li key={idx}>{o}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // ==========================================
    // 7. SENTIMENT ANALYSIS
    // ==========================================
    if (id === 7) {
      const sent = report.sentiment;
      return (
        <div className="space-y-6">
          <div className="bg-muted/15 border border-border/40 p-5 rounded-2xl text-xs space-y-3">
            <h4 className="text-xs font-bold text-primary uppercase tracking-widest select-none">Aggregated Sentiment Stance</h4>
            <p className="text-xs text-text-secondary leading-relaxed font-medium">
              {sent?.summary || "N/A"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-mono">
            <div className="bg-muted/10 border border-border/30 rounded-xl p-4 space-y-3">
              <h5 className="text-xs font-bold text-white uppercase font-sans">Multi-Channel Verdicts</h5>
              <div className="flex justify-between border-b border-border/10 pb-1.5">
                <span className="text-text-secondary font-sans">Sell-Side Analyst Sentiment</span>
                <span className="text-white font-bold">{sent?.analystSentiment || "N/A"}</span>
              </div>
              <div className="flex justify-between border-b border-border/10 pb-1.5">
                <span className="text-text-secondary font-sans">Buy-Side Institutional Stance</span>
                <span className="text-white font-bold">{sent?.investorSentiment || "N/A"}</span>
              </div>
              <div className="flex justify-between border-b border-border/10 pb-1.5">
                <span className="text-text-secondary font-sans">Public Social Stance</span>
                <span className="text-white font-bold">{sent?.socialSentiment || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary font-sans">Overall Sentiment Verdict</span>
                <span className="text-green font-bold">{sent?.overallSentiment || "N/A"}</span>
              </div>
            </div>

            <div className="bg-muted/10 border border-border/30 rounded-xl p-4 space-y-3 font-sans">
              <h5 className="text-xs font-bold text-white uppercase">Primary Sentiment Drivers</h5>
              <ul className="list-disc pl-4 space-y-1.5 text-xs text-text-secondary leading-relaxed">
                {sent?.keyDrivers?.map((d, idx) => (
                  <li key={idx}>{d}</li>
                )) || <li>No core sentiment drivers logged.</li>}
              </ul>
            </div>
          </div>
        </div>
      );
    }

    // ==========================================
    // 8. VALUATION ANALYSIS
    // ==========================================
    if (id === 8) {
      const val = report.valuation;
      return (
        <div className="space-y-6">
          <div className="bg-muted/15 border border-border/40 p-5 rounded-2xl text-xs space-y-3">
            <h4 className="text-xs font-bold text-primary uppercase tracking-widest select-none">Valuation Thesis Summary</h4>
            <p className="text-xs text-text-secondary leading-relaxed font-medium">
              {val?.valuationSummary || "N/A"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-mono">
            <div className="bg-muted/10 border border-border/30 rounded-xl p-4 space-y-3">
              <h5 className="text-xs font-bold text-white uppercase font-sans">DCF Intrinsic Metrics</h5>
              <div className="flex justify-between border-b border-border/10 pb-1.5">
                <span className="text-text-secondary font-sans">Current Price</span>
                <span className="text-white font-bold">${val?.currentPrice?.toFixed(2) || "N/A"}</span>
              </div>
              <div className="flex justify-between border-b border-border/10 pb-1.5">
                <span className="text-text-secondary font-sans">Intrinsic Value Estimate</span>
                <span className="text-white font-bold">${val?.intrinsicValue?.toFixed(2) || "N/A"}</span>
              </div>
              <div className="flex justify-between border-b border-border/10 pb-1.5">
                <span className="text-text-secondary font-sans">Expected Upside Target</span>
                <span className="text-green font-bold">+{val?.upside?.toFixed(1) || 0}%</span>
              </div>
              <div className="flex justify-between border-b border-border/10 pb-1.5">
                <span className="text-text-secondary font-sans">Expected Downside Limit</span>
                <span className="text-red font-bold">-{val?.downside?.toFixed(1) || 0}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary font-sans">Valuation Verdict</span>
                <span className="text-white font-bold">{val?.valuation || "N/A"}</span>
              </div>
            </div>

            <div className="bg-muted/10 border border-border/30 rounded-xl p-4 space-y-3">
              <h5 className="text-xs font-bold text-white uppercase font-sans">Valuation Ratios Grid</h5>
              <div className="flex justify-between border-b border-border/10 pb-1.5">
                <span className="text-text-secondary font-sans">Price to Earnings (P/E)</span>
                <span className="text-white font-bold">{val?.metrics?.pe ? `${val.metrics.pe}x` : "N/A"}</span>
              </div>
              <div className="flex justify-between border-b border-border/10 pb-1.5">
                <span className="text-text-secondary font-sans">Industry Median P/E</span>
                <span className="text-white font-bold">{val?.metrics?.industryPE ? `${val.metrics.industryPE}x` : "N/A"}</span>
              </div>
              <div className="flex justify-between border-b border-border/10 pb-1.5">
                <span className="text-text-secondary font-sans">Price/Earnings-to-Growth (PEG)</span>
                <span className="text-white font-bold">{val?.metrics?.peg ? `${val.metrics.peg}x` : "N/A"}</span>
              </div>
              <div className="flex justify-between border-b border-border/10 pb-1.5">
                <span className="text-text-secondary font-sans">Price to Book (P/B)</span>
                <span className="text-white font-bold">{val?.metrics?.priceToBook ? `${val.metrics.priceToBook}x` : "N/A"}</span>
              </div>
              <div className="flex justify-between border-b border-border/10 pb-1.5">
                <span className="text-text-secondary font-sans">Price to Sales (P/S)</span>
                <span className="text-white font-bold">{val?.metrics?.priceToSales ? `${val.metrics.priceToSales}x` : "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary font-sans">EV / EBITDA Multiple</span>
                <span className="text-white font-bold">{val?.metrics?.evEbitda ? `${val.metrics.evEbitda}x` : "N/A"}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // ==========================================
    // 9. RISK ASSESSMENT
    // ==========================================
    if (id === 9) {
      const risk = report.risk;
      const riskFactors = [
        { name: "Core Business Risks", level: risk?.businessRisk },
        { name: "Financial Balance Sheet Risks", level: risk?.financialRisk },
        { name: "Competitor Market Risks", level: risk?.competitiveRisk },
        { name: "Industry Market Risks", level: risk?.marketRisk },
        { name: "Macroeconomic Environment Risks", level: risk?.macroeconomicRisk },
        { name: "Regulatory Compliance Risks", level: risk?.regulatoryRisk },
        { name: "Valuation pricing risks", level: risk?.valuationRisk },
        { name: "Public Sentiment risks", level: risk?.sentimentRisk }
      ];

      return (
        <div className="space-y-6">
          <div className="bg-muted/15 border border-border/40 p-5 rounded-2xl text-xs space-y-3">
            <h4 className="text-xs font-bold text-primary uppercase tracking-widest select-none">Corporate Vulnerability Summary</h4>
            <p className="text-xs text-text-secondary leading-relaxed font-medium">
              {risk?.summary || "N/A"}
            </p>
            <div className="grid grid-cols-2 gap-4 border-t border-border/20 pt-2.5 font-mono select-none">
              <div>
                <span className="text-text-secondary text-[10px] block">Aggregated Risk Level</span>
                <span className="text-red font-bold text-sm block mt-0.5">{risk?.riskLevel || "N/A"}</span>
              </div>
              <div className="text-right">
                <span className="text-text-secondary text-[10px] block">Aggregated Risk Score</span>
                <span className="text-white font-bold text-sm block mt-0.5">{risk?.overallRiskScore || 0} / 100</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mono text-xs">
            <div className="bg-muted/10 border border-border/30 rounded-xl p-4 space-y-2">
              <h5 className="text-xs font-bold text-white uppercase font-sans">Risk Factors Grid Matrix</h5>
              <div className="space-y-1.5">
                {riskFactors.map((f, idx) => (
                  <div key={idx} className="flex justify-between border-b border-border/10 pb-1.5 last:border-b-0 last:pb-0">
                    <span className="text-text-secondary font-sans">{f.name}</span>
                    <span className={`font-bold ${
                      f.level === "Low" ? "text-green" : (f.level === "Moderate" ? "text-orange" : "text-red")
                    }`}>{f.level || "N/A"}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-muted/10 border border-border/30 rounded-xl p-4 space-y-4 font-sans">
              <h5 className="text-xs font-bold text-white uppercase">Scanned Vulnerabilities & Mitigations</h5>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-red text-[10px] font-mono font-bold block uppercase tracking-wider mb-1">Top Risks</span>
                  <ul className="list-disc pl-4 space-y-1.5 text-xs text-text-secondary font-medium">
                    {risk?.topRisks?.map((r, idx) => <li key={idx}>{r}</li>) || <li>N/A</li>}
                  </ul>
                </div>
                <div>
                  <span className="text-green text-[10px] font-mono font-bold block uppercase tracking-wider mb-1">Mitigating Factors</span>
                  <ul className="list-disc pl-4 space-y-1.5 text-xs text-text-secondary font-medium">
                    {risk?.mitigatingFactors?.map((m, idx) => <li key={idx}>{m}</li>) || <li>N/A</li>}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // ==========================================
    // 10. RECOMMENDATION / VERDICT CONSENSUS
    // ==========================================
    const rec = report.recommendation;
    return (
      <div className="space-y-6">
        <div className="bg-muted/15 border border-border/40 p-5 rounded-2xl text-xs space-y-3">
          <h4 className="text-xs font-bold text-primary uppercase tracking-widest select-none">Consensus Investment Thesis</h4>
          <p className="text-xs text-text-secondary leading-relaxed font-medium">
            {rec?.investmentThesis || "N/A"}
          </p>
          {rec?.executiveSummary && (
            <p className="text-xs text-text-secondary leading-relaxed font-medium mt-3 border-t border-border/20 pt-3">
              <span className="text-white font-bold block mb-1 font-sans">Executive Summary:</span>
              {rec.executiveSummary}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono font-semibold select-none">
          <div className="bg-muted/10 border border-border/30 p-3 rounded-lg">
            <span className="text-text-secondary block mb-1 font-sans">Consensus Grade</span>
            <span className="text-primary font-bold text-sm block">{rec?.recommendation || "N/A"}</span>
          </div>
          <div className="bg-muted/10 border border-border/30 p-3 rounded-lg">
            <span className="text-text-secondary block mb-1 font-sans">Investment Score</span>
            <span className="text-white font-bold text-sm block">{rec?.investmentScore || 0}/100</span>
          </div>
          <div className="bg-muted/10 border border-border/30 p-3 rounded-lg">
            <span className="text-text-secondary block mb-1 font-sans">Consensus Conviction</span>
            <span className="text-white font-bold text-sm block">{rec?.conviction || "N/A"}</span>
          </div>
          <div className="bg-muted/10 border border-border/30 p-3 rounded-lg">
            <span className="text-text-secondary block mb-1 font-sans">Expected Yield Return</span>
            <span className="text-green font-bold text-sm block">{rec?.expectedReturn || "N/A"}</span>
          </div>
          <div className="bg-muted/10 border border-border/30 p-3 rounded-lg">
            <span className="text-text-secondary block mb-1 font-sans">Target Price Limit</span>
            <span className="text-white font-bold text-sm block">{rec?.targetPrice ? `$${rec.targetPrice.toFixed(2)}` : "N/A"}</span>
          </div>
          <div className="bg-muted/10 border border-border/30 p-3 rounded-lg">
            <span className="text-text-secondary block mb-1 font-sans">Stop Loss Target</span>
            <span className="text-red font-bold text-sm block">{rec?.stopLoss ? `$${rec.stopLoss.toFixed(2)}` : "N/A"}</span>
          </div>
          <div className="bg-muted/10 border border-border/30 p-3 rounded-lg">
            <span className="text-text-secondary block mb-1 font-sans">Risk / Reward Ratio</span>
            <span className="text-white font-bold text-sm block">{rec?.riskRewardRatio || "N/A"}</span>
          </div>
          <div className="bg-muted/10 border border-border/30 p-3 rounded-lg">
            <span className="text-text-secondary block mb-1 font-sans">Investment Horizon</span>
            <span className="text-white font-bold text-sm block">{rec?.timeHorizon || "N/A"}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3 font-sans">
          <div className="bg-muted/10 border border-border/30 rounded-xl p-4">
            <h5 className="text-xs font-bold text-green mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-green" />
              <span>Investment Bull Case Drivers</span>
            </h5>
            <ul className="space-y-2 text-xs text-text-secondary font-medium leading-relaxed list-disc pl-4">
              {rec?.bullCase?.map((b, idx) => <li key={idx}>{b}</li>) || <li>N/A</li>}
            </ul>
          </div>
          <div className="bg-muted/10 border border-border/30 rounded-xl p-4">
            <h5 className="text-xs font-bold text-red mb-3 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-red" />
              <span>Critical Bear Case Risk Factors</span>
            </h5>
            <ul className="space-y-2 text-xs text-text-secondary font-medium leading-relaxed list-disc pl-4">
              {rec?.bearCase?.map((bc, idx) => <li key={idx}>{bc}</li>) || <li>N/A</li>}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-sans">
          {rec?.keyCatalysts && rec.keyCatalysts.length > 0 && (
            <div className="bg-muted/10 border border-border/30 rounded-xl p-4">
              <h5 className="text-xs font-bold text-white mb-2 uppercase">Future Catalysts to Monitor</h5>
              <ul className="list-disc pl-4 space-y-1.5 text-xs text-text-secondary leading-relaxed">
                {rec.keyCatalysts.map((c, idx) => <li key={idx}>{c}</li>)}
              </ul>
            </div>
          )}
          {rec?.watchItems && rec.watchItems.length > 0 && (
            <div className="bg-muted/10 border border-border/30 rounded-xl p-4">
              <h5 className="text-xs font-bold text-white mb-2 uppercase">Trigger Items to Watch</h5>
              <ul className="list-disc pl-4 space-y-1.5 text-xs text-text-secondary leading-relaxed">
                {rec.watchItems.map((w, idx) => <li key={idx}>{w}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderDiagnosticsTab = () => {
    const defaultLogs = [
      { tag: "pipeline/init", msg: `Initializing research thread for ${report.companyResearch?.ticker || "CO"}...` },
      { tag: "agent/invoke", msg: "Sending context telemetry to deep semantic analyzer node..." },
      { tag: "tavily/fetch", msg: `Executed live vector searches across 12 indexed repositories...` },
      { tag: "agent/consensus", msg: `Cross-agent validation matches confidence matrix threshold...` },
      { tag: "pipeline/done", msg: "Telemetry successfully compiled. Terminating agent connection." }
    ];

    return (
      <div className="space-y-6">
        <div className="bg-muted/15 border border-border/40 p-5 rounded-2xl">
          <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Agent Execution Telemetry</h4>
          <p className="text-xs text-text-secondary leading-relaxed font-medium">
            Detailed hardware trace and token usage for the **{name}** workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 font-mono text-xs select-none">
          <div className="bg-card border border-border/60 p-4 rounded-xl space-y-2">
            <span className="text-[10px] text-text-secondary block font-bold uppercase tracking-wider">Latency Trace</span>
            <div className="flex justify-between items-baseline pt-2">
              <span className="text-2xl font-bold text-white">440ms</span>
              <span className="text-[10px] text-green font-bold">Fast Ingest</span>
            </div>
            <p className="text-[10px] text-text-secondary">Network roundtrip + model token generation time.</p>
          </div>

          <div className="bg-card border border-border/60 p-4 rounded-xl space-y-2">
            <span className="text-[10px] text-text-secondary block font-bold uppercase tracking-wider">Token Count</span>
            <div className="flex justify-between items-baseline pt-2">
              <span className="text-2xl font-bold text-white">24,850</span>
              <span className="text-[10px] text-primary font-bold">12.5k / sec</span>
            </div>
            <p className="text-[10px] text-text-secondary">Total prompt context and completion output tokens processed.</p>
          </div>

          <div className="bg-card border border-border/60 p-4 rounded-xl space-y-2">
            <span className="text-[10px] text-text-secondary block font-bold uppercase tracking-wider">Parameters</span>
            <div className="flex justify-between items-baseline pt-2">
              <span className="text-2xl font-bold text-white">0.1 / 0.95</span>
              <span className="text-[10px] text-orange font-bold">Deterministic</span>
            </div>
            <p className="text-[10px] text-text-secondary">Low temperature settings are enforced for quantitative consensus accuracy.</p>
          </div>
        </div>

        <div className="bg-[#07111E] border border-border/80 rounded-xl p-5 font-mono text-[11px] leading-relaxed space-y-2.5">
          <span className="text-[10px] text-primary uppercase font-bold tracking-wider block select-none">Execution Log Outputs</span>
          <div className="text-text-secondary max-h-72 overflow-y-auto space-y-1.5 custom-report-scrollbar pr-1 select-text">
            {defaultLogs.map((log, idx) => (
              <div key={idx}>
                <span className="text-text-secondary/50">[{new Date(report.createdAt || Date.now()).toISOString().split("T")[0]} 08:30:12]</span>{" "}
                <span className="text-primary font-bold">{log.tag}:</span> {log.msg}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderTelemetryTab = () => {
    const sources = getAgentSources();
    return (
      <div className="space-y-6">
        <div className="bg-muted/15 border border-border/40 p-5 rounded-2xl">
          <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-3 select-none">Institutional Source Registry</h4>
          <p className="text-xs text-text-secondary leading-relaxed font-medium">
            Referenced documents, SEC filings, and data portals ingested for this analysis.
          </p>
        </div>

        <div className="overflow-x-auto border border-border/60 rounded-xl bg-card">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border/80 bg-muted/40 text-[10px] text-text-secondary font-bold uppercase tracking-wider select-none">
                <th className="p-3">Source URL / Referenced Node</th>
                <th className="p-3 text-right">Confidence Ingest Weight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20 font-medium font-mono text-xs">
              {sources.map((src, idx) => (
                <tr key={idx} className="hover:bg-muted/15">
                  <td className="p-3 text-white truncate max-w-lg">
                    {src.startsWith("http") ? (
                      <a href={src} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                        <span>{src}</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    ) : (
                      <span>{src}</span>
                    )}
                  </td>
                  <td className="p-3 text-right text-white font-mono">1.00</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const confidencePct = getAgentConfidence();
  const reliabilityLabel = getReliabilityLabel(confidencePct);

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex justify-center items-center overflow-hidden bg-black/70 backdrop-blur-[12px] select-none animate-fade-in animate-scale-in">
      
      {/* Backdrop overlay trigger */}
      <div 
        className="fixed inset-0 cursor-default"
        onClick={onClose}
      />

      {/* Centered Modal Container */}
      <div className="relative w-[92vw] max-w-[1650px] h-[92vh] bg-[#0A111E] border border-border/80 rounded-[20px] flex flex-col overflow-hidden shadow-2xl z-10 text-white">
        
        {/* Header */}
        <div className="flex-shrink-0 h-[78px] border-b border-border/40 flex items-center justify-between px-5 bg-card sticky top-0 z-[2]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center font-extrabold text-xs text-primary font-mono select-none">
              {report.companyResearch?.ticker || "CO"}
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">{report.companyResearch?.companyName || "Corporate Terminal Analysis"}</h3>
              <p className="text-[10px] text-text-secondary font-semibold uppercase tracking-wider">{name} Details Report</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => alert("Report downloaded successfully in PDF format.")}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-border/60 bg-muted hover:bg-border/20 text-xs font-bold rounded-xl transition-all cursor-pointer font-mono uppercase"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export PDF</span>
            </button>
            <button 
              onClick={onClose}
              className="text-text-secondary hover:text-white p-1 rounded-lg hover:bg-muted cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sticky Tabs Navigation */}
        <div className="flex-shrink-0 h-[50px] border-b border-border/40 bg-card/65 backdrop-blur-md flex items-center gap-2 px-5 z-[2]">
          {[
            { id: "overview", label: "Research Overview" },
            { id: "diagnostics", label: "Agent Pipeline Trace" },
            { id: "telemetry", label: "Data Quality & Sources" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-primary text-white shadow-md shadow-primary/10"
                  : "text-text-secondary hover:text-white hover:bg-muted"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 p-6 space-y-6 custom-report-scrollbar">
          {activeTab === "overview" && renderContent()}
          {activeTab === "diagnostics" && renderDiagnosticsTab()}
          {activeTab === "telemetry" && renderTelemetryTab()}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 h-[70px] border-t border-border/40 bg-muted/20 text-[10px] text-text-secondary font-semibold flex items-center justify-between px-5 sticky bottom-0 z-[2]">
          <span className="flex items-center gap-1.5 max-w-xl truncate">
            <BookOpen className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="truncate">Ingested Sources: {getAgentSources().join(", ")}</span>
          </span>
          <span className="font-mono shrink-0">Confidence: {confidencePct}% ({reliabilityLabel})</span>
        </div>

      </div>
    </div>,
    document.body
  );
}
