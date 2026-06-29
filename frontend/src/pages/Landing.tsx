import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { 
  Award, 
  Search, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  LineChart, 
  TrendingUp, 
  Cpu, 
  Lock 
} from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();
  const { triggerAnalysis, user } = useApp();
  const [searchInput, setSearchInput] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    if (user) {
      triggerAnalysis(searchInput);
      navigate("/dashboard");
    } else {
      // If not logged in, redirect to login but cache search query
      localStorage.setItem("altuni_pending_search", searchInput);
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col justify-between">
      
      {/* Background Decorative Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Top Navbar */}
      <header className="w-full max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-border/30 relative z-20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center shadow-lg shadow-primary/20">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-tight leading-none text-white">Altuni Invest</h1>
            <span className="text-[10px] text-primary font-bold uppercase tracking-widest leading-none mt-0.5 block">AI Research Terminal</span>
          </div>
        </div>

        <nav className="flex items-center gap-6">
          <Link to="/login" className="text-xs font-bold text-text-secondary hover:text-white transition-colors">
            Sign In
          </Link>
          <Link 
            to="/register" 
            className="px-4 py-2 bg-primary hover:bg-primary/95 text-white text-xs font-bold rounded-xl shadow-lg shadow-primary/15 transition-all"
          >
            Create Account
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="w-full max-w-7xl mx-auto px-6 py-16 flex-1 flex flex-col items-center justify-center text-center relative z-10">
        
        {/* Sparkle Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-primary/20 bg-primary/10 text-primary text-[10px] font-bold rounded-full mb-8 uppercase tracking-widest animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Generation Institutional Intelligence</span>
        </div>

        {/* Headline */}
        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-tight">
          AI-Powered{" "}
          <span className="bg-gradient-to-r from-primary via-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Investment Research
          </span>
        </h2>
        <p className="text-sm md:text-base text-text-secondary mt-5 max-w-2xl leading-relaxed">
          Search any public company. Run 10 specialized AI agents in parallel scraping real-time metrics, financial reports, news sentiment, and valuations to generate elite reports.
        </p>

        {/* Hero Search Bar Demo */}
        <form onSubmit={handleSearchSubmit} className="w-full max-w-xl bg-card border border-border/80 rounded-2xl p-2.5 shadow-2xl flex items-center gap-2 mt-10 relative group focus-within:border-primary/50 transition-all duration-300">
          <div className="absolute inset-0 bg-primary/5 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
          <div className="relative flex-1 flex items-center pl-3">
            <Search className="w-4.5 h-4.5 text-text-secondary shrink-0" />
            <input 
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search ticker or company (e.g., NVIDIA, AAPL, Tesla)..."
              className="w-full bg-transparent border-none text-xs text-white focus:outline-none placeholder:text-text-secondary/60 py-2.5 pl-2.5"
            />
          </div>
          <button 
            type="submit"
            className="px-5 py-2.5 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/95 hover:to-indigo-600/95 text-white text-xs font-bold rounded-xl shadow-lg shadow-primary/20 flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <span>Analyze</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Animated Dashboard Teaser */}
        <div className="w-full max-w-5xl mt-16 border border-border/50 bg-[#0B1524]/60 rounded-2xl shadow-2xl p-3 relative overflow-hidden group">
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-primary/10 rounded-full blur-2xl" />
          
          <div className="border border-border/30 rounded-xl overflow-hidden aspect-video bg-[#070e17] flex flex-col justify-between relative">
            
            {/* Top Mock Header */}
            <div className="h-10 border-b border-border/20 bg-[#0B1524] px-4 flex items-center justify-between text-[10px] text-text-secondary">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-orange/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green/60" />
                <div className="h-4 w-px bg-border/20 ml-2" />
                <span className="font-mono">altuni-terminal-v2.0.sh</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-16 h-2 bg-border/40 rounded-full" />
                <div className="w-8 h-2 bg-primary/35 rounded-full animate-pulse" />
              </div>
            </div>

            {/* Mock Layout Grid */}
            <div className="flex-1 p-4 grid grid-cols-4 gap-3 relative">
              <div className="col-span-1 border border-border/20 bg-card/45 rounded-lg p-2.5 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="w-12 h-2.5 bg-primary/30 rounded-full" />
                  <div className="w-full h-2 bg-border/20 rounded-full" />
                  <div className="w-3/4 h-2 bg-border/20 rounded-full" />
                </div>
                <div className="h-12 w-full bg-border/10 rounded border border-border/15 flex items-center justify-center text-[10px] font-mono text-primary/80">
                  SEC FILINGS ANALYZED
                </div>
              </div>
              
              <div className="col-span-2 border border-border/20 bg-card/45 rounded-lg p-3 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className="text-[11px] font-bold text-white">NVIDIA Corporation</h5>
                    <span className="text-[8px] text-text-secondary leading-none">NVDA | NASDAQ</span>
                  </div>
                  <span className="text-[10px] bg-green/10 text-green px-1.5 py-0.5 rounded border border-green/20 font-bold uppercase tracking-wider">INVEST</span>
                </div>
                {/* Mock Sparkline */}
                <div className="h-20 flex items-end gap-1 px-1">
                  {[22, 28, 25, 32, 40, 38, 48, 55, 62, 59, 72, 85, 91].map((val, i) => (
                    <div 
                      key={i} 
                      className="flex-1 bg-gradient-to-t from-primary to-blue-400 rounded-t-sm"
                      style={{ height: `${val}%` }}
                    />
                  ))}
                </div>
              </div>

              <div className="col-span-1 border border-border/20 bg-card/45 rounded-lg p-2.5 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-14 h-2.5 bg-blue-500/20 rounded-full" />
                  <div className="flex items-center gap-1.5 justify-between">
                    <span className="text-[8px] text-text-secondary">WACC</span>
                    <span className="text-[9px] font-mono font-bold text-white">9.2%</span>
                  </div>
                  <div className="flex items-center gap-1.5 justify-between">
                    <span className="text-[8px] text-text-secondary">Beta</span>
                    <span className="text-[9px] font-mono font-bold text-white">1.84</span>
                  </div>
                  <div className="flex items-center gap-1.5 justify-between">
                    <span className="text-[8px] text-text-secondary">P/E Ratio</span>
                    <span className="text-[9px] font-mono font-bold text-white">42.6x</span>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-border/20 rounded-full overflow-hidden">
                  <div className="w-4/5 h-full bg-green rounded-full" />
                </div>
              </div>
            </div>

            {/* Dark glass cover */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#070e17] via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

      </main>

      {/* Feature Grids */}
      <section className="w-full border-t border-border/30 bg-[#0B1524]/30 py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h3 className="text-xl font-extrabold text-white tracking-tight">Standard Analytical Framework</h3>
            <p className="text-xs text-text-secondary mt-1">
              Multi-agent coordination system orchestrating standard financial and market analyses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel rounded-2xl p-5 border border-border/50">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-extrabold text-white">10 Specialized Agents</h4>
              <p className="text-xs text-text-secondary mt-2 leading-relaxed">
                Dividing workload across company research, financial filings, competitors, industry trends, sentiments, and DCF models.
              </p>
            </div>
            <div className="glass-panel rounded-2xl p-5 border border-border/50">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                <LineChart className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-extrabold text-white">Interactive Multi-Charts</h4>
              <p className="text-xs text-text-secondary mt-2 leading-relaxed">
                Recharts implementation illustrating cash flows, net income ratios, competitor radars, and sentiment timelines.
              </p>
            </div>
            <div className="glass-panel rounded-2xl p-5 border border-border/50">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-extrabold text-white">Institutional Grade Quality</h4>
              <p className="text-xs text-text-secondary mt-2 leading-relaxed">
                Aggregates real-time SEC database queries, news sentiment indices, and DCF validation models for clear recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-border/20 bg-[#070e17] py-6 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-text-secondary text-[11px] font-medium gap-4">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-primary" />
            <span>&copy; {new Date().getFullYear()} Altuni Invest Inc. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-white transition-colors cursor-pointer">Security Protocol</span>
            <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-white transition-colors cursor-pointer">API Integration Docs</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
