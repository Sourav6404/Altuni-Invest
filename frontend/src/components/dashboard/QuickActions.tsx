import React from "react";
import { useApp, TabType } from "../../context/AppContext";
import { 
  FileText, 
  Briefcase, 
  Star, 
  Bell
} from "lucide-react";

export default function QuickActions() {
  const { 
    setActiveTab, 
    savedReportsList, 
    portfolio, 
    watchlist, 
    alerts 
  } = useApp();

  const savedCount = savedReportsList?.length || 0;
  const portfolioCount = portfolio?.length || 0;
  const watchlistCount = watchlist?.length || 0;
  const activeAlertsCount = alerts?.filter(a => a.enabled).length || 0;

  const totalPortfolioValue = portfolio?.reduce((acc, curr) => acc + (curr.shares * curr.currentPrice), 0) || 0;
  const formattedVal = totalPortfolioValue > 0 
    ? `$${(totalPortfolioValue / 1e3).toFixed(1)}k` 
    : "$124.5k";

  return (
    <div className="space-y-3.5 select-none text-white animate-fade-in pt-4">
      <div className="border-b border-border pb-2">
        <h4 className="text-[10px] text-muted font-bold uppercase tracking-widest block font-mono">
          Platform Activity Indicators
        </h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Saved Reports Widget */}
        <button
          onClick={() => setActiveTab("reports" as TabType)}
          className="bg-card border border-border/80 hover:border-primary/30 rounded-xl p-4.5 text-left shadow-sm hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer flex flex-col justify-between min-h-[130px] active:scale-[0.99]"
        >
          <div className="flex items-center justify-between w-full">
            <div className="w-7 h-7 rounded bg-[#3E6BFF]/10 border border-[#3E6BFF]/20 flex items-center justify-center">
              <FileText className="w-3.5 h-3.5 text-[#3E6BFF]" />
            </div>
            <span className="text-[9px] font-bold text-text-secondary bg-secondary-card px-2 py-0.5 rounded font-mono uppercase">
              {savedCount} compilations
            </span>
          </div>
          
          {/* Mini Sparkline Visualization */}
          <div className="h-6 w-full mt-2 opacity-60">
            <svg className="w-full h-full" viewBox="0 0 100 20">
              <path d="M 0,15 Q 20,5 40,12 T 80,4 T 100,18" fill="none" stroke="#3E6BFF" strokeWidth="1.5" />
            </svg>
          </div>

          <div className="mt-2.5">
            <h5 className="text-[11px] font-bold text-white group-hover:text-primary transition-colors leading-none">
              Platform Research Reports
            </h5>
            <span className="text-[8px] text-muted block mt-1 font-mono uppercase leading-none">
              Updated 2m ago
            </span>
          </div>
        </button>

        {/* Portfolio Widget */}
        <button
          onClick={() => setActiveTab("portfolio" as TabType)}
          className="bg-card border border-border/80 hover:border-primary/30 rounded-xl p-4.5 text-left shadow-sm hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer flex flex-col justify-between min-h-[130px] active:scale-[0.99]"
        >
          <div className="flex items-center justify-between w-full">
            <div className="w-7 h-7 rounded bg-[#2ECC71]/10 border border-[#2ECC71]/20 flex items-center justify-center">
              <Briefcase className="w-3.5 h-3.5 text-[#2ECC71]" />
            </div>
            <span className="text-[9px] font-bold text-green bg-green/10 border border-green/20 px-2 py-0.5 rounded font-mono">
              {formattedVal}
            </span>
          </div>

          {/* Mini Sparkline Visualization */}
          <div className="h-6 w-full mt-2 opacity-60">
            <svg className="w-full h-full" viewBox="0 0 100 20">
              <path d="M 0,18 Q 30,8 50,5 T 80,12 T 100,2" fill="none" stroke="#2ECC71" strokeWidth="1.5" />
            </svg>
          </div>

          <div className="mt-2.5">
            <h5 className="text-[11px] font-bold text-white group-hover:text-primary transition-colors leading-none">
              Asset Holdings Tracker
            </h5>
            <span className="text-[8px] text-muted block mt-1 font-mono uppercase leading-none">
              Synced {portfolioCount} open positions
            </span>
          </div>
        </button>

        {/* Watchlist Widget */}
        <button
          onClick={() => setActiveTab("watchlist" as TabType)}
          className="bg-card border border-border/80 hover:border-primary/30 rounded-xl p-4.5 text-left shadow-sm hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer flex flex-col justify-between min-h-[130px] active:scale-[0.99]"
        >
          <div className="flex items-center justify-between w-full">
            <div className="w-7 h-7 rounded bg-[#F5B942]/10 border border-[#F5B942]/20 flex items-center justify-center">
              <Star className="w-3.5 h-3.5 text-[#F5B942]" />
            </div>
            <span className="text-[9px] font-bold text-text-secondary bg-secondary-card px-2 py-0.5 rounded font-mono uppercase">
              {watchlistCount} Assets
            </span>
          </div>

          {/* Mini Sparkline Visualization */}
          <div className="h-6 w-full mt-2 opacity-60">
            <svg className="w-full h-full" viewBox="0 0 100 20">
              <path d="M 0,10 Q 25,18 50,6 T 75,10 T 100,5" fill="none" stroke="#F5B942" strokeWidth="1.5" />
            </svg>
          </div>

          <div className="mt-2.5">
            <h5 className="text-[11px] font-bold text-white group-hover:text-primary transition-colors leading-none">
              Target Watchlists
            </h5>
            <span className="text-[8px] text-muted block mt-1 font-mono uppercase leading-none">
              Last synced 2m ago
            </span>
          </div>
        </button>

        {/* Alerts Widget */}
        <button
          onClick={() => setActiveTab("alerts" as TabType)}
          className="bg-card border border-border/80 hover:border-primary/30 rounded-xl p-4.5 text-left shadow-sm hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer flex flex-col justify-between min-h-[130px] active:scale-[0.99]"
        >
          <div className="flex items-center justify-between w-full">
            <div className="w-7 h-7 rounded bg-[#FF5D73]/10 border border-[#FF5D73]/20 flex items-center justify-center">
              <Bell className="w-3.5 h-3.5 text-[#FF5D73]" />
            </div>
            <span className="text-[9px] font-bold text-red bg-red/10 border border-red/20 px-2 py-0.5 rounded font-mono uppercase">
              {activeAlertsCount} Active
            </span>
          </div>

          {/* Mini Sparkline Visualization */}
          <div className="h-6 w-full mt-2 opacity-60">
            <svg className="w-full h-full" viewBox="0 0 100 20">
              <path d="M 0,15 L 30,15 L 40,3 L 50,18 L 60,15 L 100,15" fill="none" stroke="#FF5D73" strokeWidth="1.5" />
            </svg>
          </div>

          <div className="mt-2.5">
            <h5 className="text-[11px] font-bold text-white group-hover:text-primary transition-colors leading-none">
              Active Trigger Signals
            </h5>
            <span className="text-[8px] text-muted block mt-1 font-mono uppercase leading-none">
              Active limits monitor
            </span>
          </div>
        </button>

      </div>
    </div>
  );
}
