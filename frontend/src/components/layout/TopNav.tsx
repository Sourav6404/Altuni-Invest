import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { API_BASE_URL } from "../../config";
import { 
  Search, 
  Bell, 
  Menu, 
  ChevronDown,
  Sparkles,
  RefreshCw,
  LogOut,
  User,
  Settings as SettingsIcon
} from "lucide-react";

interface TopNavProps {
  onToggleMobileSidebar: () => void;
}



export default function TopNav({ onToggleMobileSidebar }: TopNavProps) {
  const { 
    triggerAnalysis, 
    isAnalyzing, 
    user, 
    logout, 
    setActiveTab, 
    recentSearches,
    alerts
  } = useApp();

  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close menus on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
        setShowNotifications(false);
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Filter suggestions
  useEffect(() => {
    if (!input.trim()) {
      setSuggestions([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      fetch(`${API_BASE_URL}/api/search?q=${encodeURIComponent(input)}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setSuggestions(data.data);
          }
        })
        .catch(err => {
          console.warn("[TopNav] Search autocomplete failed:", err);
          setSuggestions([]);
        });
    }, 150);

    return () => clearTimeout(delayDebounce);
  }, [input]);

  // Reset active suggestion on filter change
  useEffect(() => {
    setActiveSuggestionIndex(-1);
  }, [suggestions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isAnalyzing) return;
    triggerAnalysis(input);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (ticker: string) => {
    setInput(ticker);
    triggerAnalysis(ticker);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveSuggestionIndex(prev => (prev + 1) % suggestions.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveSuggestionIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
      } else if (e.key === "Enter") {
        if (activeSuggestionIndex >= 0 && activeSuggestionIndex < suggestions.length) {
          e.preventDefault();
          handleSuggestionClick(suggestions[activeSuggestionIndex].ticker);
        }
      } else if (e.key === "Escape") {
        setShowSuggestions(false);
      }
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };



  return (
    <header className="h-16 border-b border-border bg-[#07111E] flex items-center justify-between px-6 shrink-0 relative z-30 select-none">
      
      {/* Search and mobile hamburger */}
      <div className="flex-1 flex items-center gap-3 max-w-xl" ref={containerRef}>
        <button 
          onClick={onToggleMobileSidebar}
          className="lg:hidden text-text-secondary hover:text-white p-1 rounded-lg hover:bg-muted"
        >
          <Menu className="w-5 h-5" />
        </button>

        <form onSubmit={handleSubmit} className="w-full relative flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={handleKeyDown}
              placeholder="Search ticker or enter company name to start research..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-background border border-border/80 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all placeholder:text-text-secondary/50 font-medium"
            />

            {/* Auto-Complete Suggestions Box */}
            {showSuggestions && (
              <div className="absolute top-11 inset-x-0 bg-[#07111E] border border-border rounded-xl shadow-2xl overflow-hidden z-40 max-h-80 overflow-y-auto">
                {suggestions.length > 0 ? (
                  <div>
                    <h5 className="text-[10px] font-bold text-text-secondary uppercase px-4 py-2 border-b border-border/40 tracking-wider">
                      Matching Assets
                    </h5>
                    {suggestions.map((item, idx) => (
                      <button
                        key={item.ticker}
                        type="button"
                        onClick={() => handleSuggestionClick(item.ticker)}
                        className={`w-full px-4 py-2.5 flex items-center justify-between text-left transition-colors border-l-2 ${
                          activeSuggestionIndex === idx 
                            ? "bg-primary/10 border-primary" 
                            : "hover:bg-muted/40 border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {/* Mini logo badge with gradient */}
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-primary/30 to-blue-500/30 flex items-center justify-center font-extrabold text-[10px] text-white shrink-0">
                            {item.ticker.substring(0, 2)}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white">{item.ticker}</span>
                            <span className="text-[10px] text-text-secondary ml-2 font-semibold">{item.name}</span>
                            <span className="text-[9px] text-text-secondary/50 block font-semibold">{item.sector} • {item.country}</span>
                          </div>
                        </div>
                        <span className="text-[9px] text-text-secondary font-mono bg-muted/60 px-1.5 py-0.5 rounded border border-border/30">
                          {item.exchange}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div>
                    {recentSearches.length > 0 && (
                      <div>
                        <h5 className="text-[10px] font-bold text-text-secondary uppercase px-4 py-2 border-b border-border/40 tracking-wider">
                          Recent Researches
                        </h5>
                        {recentSearches.map((query) => (
                          <button
                            key={query}
                            type="button"
                            onClick={() => handleSuggestionClick(query)}
                            className="w-full px-4 py-2 flex items-center gap-2.5 hover:bg-muted/40 text-xs font-bold text-white/90 text-left transition-colors"
                          >
                            <RefreshCw className="w-3.5 h-3.5 text-text-secondary shrink-0" />
                            <span>{query}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    


                    <div className="p-3.5 text-center text-[10px] text-text-secondary border-t border-border/20 font-semibold tracking-wider uppercase">
                      Press enter to run Tavily analysis engine
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isAnalyzing || !input.trim()}
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-primary/10 transition-all cursor-pointer disabled:bg-muted disabled:text-text-secondary/50 disabled:cursor-not-allowed shrink-0"
          >
            <span>Analyze</span>
          </button>
        </form>
      </div>

      {/* Right Side Icons */}
      <div className="flex items-center gap-4">
        {/* Notifications Icon and Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="text-text-secondary hover:text-white p-1.5 rounded-lg hover:bg-muted/40 transition-all relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-11 w-80 bg-[#07111E] border border-border rounded-xl shadow-2xl overflow-hidden z-40 animate-fade-in">
              <div className="p-3.5 border-b border-border/40 flex justify-between items-center bg-muted/20">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
                  <span>Signals alerts</span>
                </h4>
                <span className="text-[9px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">NEW</span>
              </div>
              <div className="divide-y divide-border/30 max-h-80 overflow-y-auto">
                {alerts.length === 0 ? (
                  <div className="p-4 text-center text-xs text-text-secondary font-medium">
                    No active signal alerts configured.
                  </div>
                ) : (
                  alerts.map((item) => (
                    <div key={item.id} className="p-3 hover:bg-muted/15 transition-colors text-left">
                      <p className="text-[10px] text-white/95 leading-relaxed font-semibold">
                        Alert set: {item.companyName} ({item.ticker}) is {item.condition} {item.target}.
                      </p>
                      <span className="text-[9px] text-text-secondary mt-1 block font-medium">Status: {item.enabled ? "Active Monitor" : "Disabled"}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-5 w-px bg-border/40" />

        {/* User Account Menu */}
        <div className="relative">
          <div 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-blue-500 text-white font-bold text-xs flex items-center justify-center shadow-md shadow-primary/20 cursor-pointer">
              {user?.name ? getInitials(user.name) : "AI"}
            </div>
            <div className="hidden md:flex items-center gap-1">
              <span className="text-xs font-bold text-text-secondary group-hover:text-white transition-colors">
                {user?.name || "Investor"}
              </span>
              <ChevronDown className="w-3 h-3 text-text-secondary group-hover:text-white transition-colors" />
            </div>
          </div>

          {showProfileMenu && (
            <div className="absolute right-0 top-11 w-48 bg-[#07111E] border border-border rounded-xl shadow-2xl overflow-hidden z-40 divide-y divide-border/30 animate-fade-in">
              <div className="px-4 py-3">
                <span className="text-xs font-bold text-white block truncate">{user?.name}</span>
                <span className="text-[9px] text-text-secondary block truncate mt-0.5">{user?.email}</span>
              </div>
              <div className="py-1">
                <button
                  onClick={() => { setActiveTab("settings"); setShowProfileMenu(false); }}
                  className="w-full px-4 py-2 flex items-center gap-2 text-xs font-bold text-text-secondary hover:text-white hover:bg-muted/40 transition-colors text-left"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Profile Settings</span>
                </button>
                <button
                  onClick={() => { setActiveTab("settings"); setShowProfileMenu(false); }}
                  className="w-full px-4 py-2 flex items-center gap-2 text-xs font-bold text-text-secondary hover:text-white hover:bg-muted/40 transition-colors text-left"
                >
                  <SettingsIcon className="w-3.5 h-3.5" />
                  <span>API Integration</span>
                </button>
              </div>
              <div className="py-1">
                <button
                  onClick={() => { logout(); setShowProfileMenu(false); }}
                  className="w-full px-4 py-2 flex items-center gap-2 text-xs font-bold text-red hover:bg-red/10 transition-colors text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout Terminal</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

    </header>
  );
}
