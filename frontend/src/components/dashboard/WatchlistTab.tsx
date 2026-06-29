import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Star, Bell, BellOff, Trash2, ArrowUpRight, Search, TrendingUp } from "lucide-react";

export default function WatchlistTab() {
  const { watchlist, toggleWatchlist, toggleWatchlistAlert, triggerAnalysis } = useApp();
  const [filter, setFilter] = useState("");

  const filteredList = watchlist.filter(item => 
    item.companyName.toLowerCase().includes(filter.toLowerCase()) ||
    item.ticker.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="bg-card border border-border rounded-2xl p-6 transition-all duration-300 space-y-6 animate-fade-in">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-base font-extrabold text-white">Watchlist Monitor</h3>
          <p className="text-[11px] text-text-secondary mt-0.5 font-medium">Track your target companies and configure automatic notifications on rating shifts.</p>
        </div>
        
        {/* Filter input */}
        <div className="relative max-w-xs">
          <Search className="w-3.5 h-3.5 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search watchlist..."
            className="pl-8 pr-3 py-1.5 text-xs bg-background border border-border rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent placeholder:text-text-secondary/50"
          />
        </div>
      </div>

      {filteredList.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-muted/10 border border-dashed border-border/60 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center text-text-secondary mx-auto">
            <Star className="w-4.5 h-4.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Your watchlist is empty.</h4>
            <p className="text-[10px] text-text-secondary mt-1">Save companies to monitor them over time.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredList.map((item) => (
            <div 
              key={item.ticker}
              className="bg-muted/10 border border-border/60 rounded-xl p-5 hover:border-primary/50 hover:shadow-lg transition-all duration-200 flex flex-col justify-between min-h-[160px] group"
            >
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-extrabold text-sm text-white">{item.companyName}</h4>
                    <span className="text-[10px] font-mono text-text-secondary">{item.ticker}</span>
                  </div>
                  <button
                    onClick={() => toggleWatchlistAlert(item.ticker)}
                    className={`p-1.5 border rounded-lg transition-colors cursor-pointer ${
                      item.alertOn 
                        ? "bg-primary/10 border-primary/20 text-primary" 
                        : "bg-muted hover:text-white border-border/60"
                    }`}
                    title={item.alertOn ? "Disable alert notifications" : "Enable alert notifications"}
                  >
                    {item.alertOn ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5 text-text-secondary" />}
                  </button>
                </div>

                <div className="flex justify-between items-end mt-5">
                  <div>
                    <span className="text-[9px] text-text-secondary block uppercase">Price</span>
                    <span className="text-lg font-extrabold text-white">${item.price.toFixed(2)}</span>
                  </div>
                  <span className={`text-[10px] font-bold ${
                    item.changePct >= 0 ? "text-green" : "text-red"
                  }`}>
                    {item.changePct >= 0 ? "+" : ""}{item.changePct.toFixed(2)}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-5 pt-3.5 border-t border-border/30 text-[10px] font-bold">
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 bg-green/10 text-green rounded border border-green/20 uppercase text-[8px]">
                    {item.recommendation}
                  </span>
                  <span className="px-2 py-0.5 bg-primary/10 text-primary rounded border border-primary/20 uppercase text-[8px]">
                    Risk: {item.riskLevel}
                  </span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => triggerAnalysis(item.ticker)}
                    className="text-primary hover:text-primary/80 flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>Analyze</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => toggleWatchlist(item.ticker)}
                    className="text-text-secondary hover:text-red cursor-pointer"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
