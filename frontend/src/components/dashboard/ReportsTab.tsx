import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Search, Trash2, Download, ExternalLink, FileText } from "lucide-react";
import { API_BASE_URL } from "../../config";

export default function ReportsTab() {
  const { savedReportsList, deleteSavedReport, triggerAnalysis } = useApp();
  const [filter, setFilter] = useState("");

  const filteredReports = savedReportsList.filter(rep => {
    if (!rep) return false;
    const clean = filter.toLowerCase();
    return (
      rep.companyResearch.companyName.toLowerCase().includes(clean) ||
      rep.companyResearch.ticker?.toLowerCase().includes(clean)
    );
  });

  return (
    <div className="bg-card border border-border rounded-2xl p-6 transition-all duration-300 space-y-6 animate-fade-in">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-base font-extrabold text-white">Saved Reports</h3>
          <p className="text-[11px] text-text-secondary mt-0.5 font-medium">Access your offline copy library of multi-agent investment research drafts.</p>
        </div>
        
        {/* Search */}
        <div className="relative max-w-xs">
          <Search className="w-3.5 h-3.5 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search reports..."
            className="pl-8 pr-3 py-1.5 text-xs bg-background border border-border rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent placeholder:text-text-secondary/50"
          />
        </div>
      </div>

      {filteredReports.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-muted/10 border border-dashed border-border/60 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center text-text-secondary mx-auto">
            <FileText className="w-4.5 h-4.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">No saved reports.</h4>
            <p className="text-[10px] text-text-secondary mt-1">Your analyzed reports can be saved for future reference.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredReports.map((item) => {
            if (!item) return null;
            const ticker = item.companyResearch.ticker || "";
            return (
              <div 
                key={ticker}
                className="bg-muted/10 border border-border/60 rounded-xl p-5 hover:border-primary/50 hover:shadow-lg transition-all duration-200 flex flex-col justify-between min-h-[170px]"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-extrabold text-sm text-white leading-tight">{item.companyResearch.companyName}</h4>
                      <span className="text-[10px] font-mono text-text-secondary">{ticker}</span>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                      item.recommendation.recommendation.includes("Buy")
                        ? "bg-green/10 text-green border-green/20"
                        : "bg-orange/10 text-orange border-orange/20"
                    }`}>
                      {item.recommendation.recommendation}
                    </span>
                  </div>

                  <div className="text-[10px] text-text-secondary mt-4 flex justify-between font-medium">
                    <span>Score: <span className="font-bold text-white">{item.recommendation.investmentScore}/100</span></span>
                    <span>Confidence: <span className="font-bold text-white">{Math.round(item.recommendation.confidence * 100)}%</span></span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-5 pt-3 border-t border-border/30">
                  <button 
                    onClick={() => window.open(`${API_BASE_URL}/api/report/${ticker}/pdf`, "_blank")}
                    className="flex items-center justify-center gap-1.5 py-1.5 bg-muted border border-border hover:bg-border/20 text-[10px] font-bold rounded-lg transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>PDF</span>
                  </button>
                  <button 
                    onClick={() => triggerAnalysis(ticker)}
                    className="flex items-center justify-center gap-1.5 py-1.5 bg-primary text-white hover:bg-primary/95 text-[10px] font-bold rounded-lg transition-all cursor-pointer"
                  >
                    <span>Analyze</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button 
                  onClick={() => deleteSavedReport(ticker)}
                  className="absolute top-2 right-2 text-text-secondary hover:text-red opacity-0 group-hover:opacity-100 transition-opacity p-1.5"
                  title="Delete report"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
