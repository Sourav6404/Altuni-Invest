import React, { createContext, useContext, useState, useEffect } from "react";
import { PlatformReport } from "../mock/mockData";
import { API_BASE_URL } from "../config";

export type TabType =
  | "dashboard"
  | "history"
  | "watchlist"
  | "compare"
  | "portfolio"
  | "reports"
  | "alerts"
  | "settings";

export interface User {
  name: string;
  email: string;
  avatar?: string;
  apiKey?: string;
  theme?: string;
}

export interface HistoryItem {
  id: string;
  companyName: string;
  ticker: string;
  date: string;
  recommendation: string;
  investmentScore: number;
  confidence: number;
}

export interface WatchlistItem {
  ticker: string;
  companyName: string;
  price: number;
  changePct: number;
  recommendation: string;
  riskLevel: string;
  alertOn: boolean;
}

export interface PortfolioHolding {
  id: string;
  ticker: string;
  companyName: string;
  shares: number;
  buyPrice: number;
  currentPrice: number;
}

export interface CustomAlert {
  id: string;
  ticker: string;
  companyName: string;
  type: "Price" | "Sentiment" | "Earnings" | "Macro";
  condition: "Above" | "Below" | "Released" | "Changes";
  target: string;
  current: string;
  enabled: boolean;
}

interface AppContextProps {
  user: User | null;
  login: (email: string, password: string, callback?: (err?: string) => void) => void;
  register: (name: string, email: string, password: string, callback?: (err?: string) => void) => void;
  logout: () => void;
  updateProfile: (name: string, email: string, password?: string) => void;
  
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  analyzedCompany: string;
  activeReport: PlatformReport | null;
  isAnalyzing: boolean;
  analysisStep: number;
  triggerAnalysis: (query: string) => void;
  cancelAnalysis: () => void;
  
  history: HistoryItem[];
  loadReportById: (id: string) => void;
  deleteHistoryItem: (id: string) => void;
  clearHistory: () => void;
  
  watchlist: WatchlistItem[];
  toggleWatchlist: (ticker: string, companyName?: string) => void;
  toggleWatchlistAlert: (ticker: string) => void;
  
  portfolio: PortfolioHolding[];
  addHolding: (ticker: string, companyName: string, shares: number, buyPrice: number) => void;
  removeHolding: (id: string) => void;
  
  savedReportsList: PlatformReport[];
  saveActiveReport: () => void;
  deleteSavedReport: (ticker: string) => void;
  isCurrentReportSaved: boolean;
  
  alerts: CustomAlert[];
  addCustomAlert: (alert: Omit<CustomAlert, "id" | "current" | "enabled">) => void;
  toggleAlertEnabled: (id: string) => void;
  deleteAlert: (id: string) => void;
  
  compareTickers: string[];
  toggleCompareTicker: (ticker: string) => void;
  clearCompare: () => void;
  
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  
  showToast: (message: string, type?: "success" | "error" | "info" | "warning") => void;
  toast: { message: string; type: "success" | "error" | "info" | "warning"; visible: boolean } | null;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Authentication
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("altuni_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" | "warning"; visible: boolean } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info" | "warning" = "info") => {
    setToast({ message, type, visible: true });
  };

  useEffect(() => {
    if (toast?.visible) {
      const timer = setTimeout(() => {
        setToast(prev => prev ? { ...prev, visible: false } : null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const login = (email: string, password: string, callback?: (err?: string) => void) => {
    fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const userObj = data.data.user;
          setUser(userObj);
          localStorage.setItem("altuni_user", JSON.stringify(userObj));
          localStorage.setItem("altuni_token", data.data.token);
          showToast(`Welcome back, ${userObj.name}!`, "success");
          if (callback) callback();
        } else {
          showToast(data.error || "Login failed.", "error");
          if (callback) callback(data.error || "Login failed.");
        }
      })
      .catch(err => {
        console.error(err);
        showToast("Error connecting to auth server.", "error");
        if (callback) callback("Error connecting to auth server.");
      });
  };

  const register = (name: string, email: string, password: string, callback?: (err?: string) => void) => {
    fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const userObj = data.data.user;
          setUser(userObj);
          localStorage.setItem("altuni_user", JSON.stringify(userObj));
          localStorage.setItem("altuni_token", data.data.token);
          showToast("Account created successfully!", "success");
          if (callback) callback();
        } else {
          showToast(data.error || "Registration failed.", "error");
          if (callback) callback(data.error || "Registration failed.");
        }
      })
      .catch(err => {
        console.error(err);
        showToast("Error connecting to auth server.", "error");
        if (callback) callback("Error connecting to auth server.");
      });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("altuni_user");
    localStorage.removeItem("altuni_token");
    showToast("Logged out of Altuni Terminal.", "info");
  };

  const updateProfile = (name: string, email: string, password?: string) => {
    if (!user) return;
    
    fetch(`${API_BASE_URL}/api/auth/profile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, currentEmail: user.email })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const userObj = data.data.user;
          setUser(userObj);
          localStorage.setItem("altuni_user", JSON.stringify(userObj));
          showToast("Profile settings updated.", "success");
        } else {
          showToast(data.error || "Failed to update profile.", "error");
        }
      })
      .catch(err => {
        console.error(err);
        showToast("Error updating profile settings.", "error");
      });
  };

  // UI Tabs
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");

  // Analysis State
  const [searchQuery, setSearchQuery] = useState("");
  const [analyzedCompany, setAnalyzedCompany] = useState("");
  const [activeReport, setActiveReport] = useState<PlatformReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem("altuni_history");
    return saved ? JSON.parse(saved) : [];
  });

  // Fetch real history list from the backend database on app mount
  useEffect(() => {
    console.log("[AppContext] Fetching analysis history list from backend...");
    fetch(`${API_BASE_URL}/api/history`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.length > 0) {
          const formatted = data.data.map((item: any) => ({
            id: item._id,
            companyName: item.companyName,
            ticker: item.ticker,
            date: new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            recommendation: item.recommendation.recommendation,
            investmentScore: item.recommendation.investmentScore,
            confidence: Math.round(item.recommendation.confidence * 100) || 90
          }));
          setHistory(formatted);
        }
      })
      .catch(err => {
        console.warn("[AppContext] Backend unreachable for initial history logs, using cache:", err);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem("altuni_history", JSON.stringify(history));
  }, [history]);

  // Watchlist state
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);

  useEffect(() => {
    localStorage.setItem("altuni_watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  // Portfolio holdings
  const [portfolio, setPortfolio] = useState<PortfolioHolding[]>([]);

  useEffect(() => {
    localStorage.setItem("altuni_portfolio", JSON.stringify(portfolio));
  }, [portfolio]);

  // Fetch real watchlist and portfolio from the backend database on app mount
  useEffect(() => {
    console.log("[AppContext] Fetching watchlist logs from backend...");
    fetch(`${API_BASE_URL}/api/watchlist`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.length > 0) {
          setWatchlist(data.data);
        }
      })
      .catch(err => {
        console.warn("[AppContext] Backend unreachable for watchlist items, using local storage:", err);
        const saved = localStorage.getItem("altuni_watchlist");
        if (saved) setWatchlist(JSON.parse(saved));
      });

    console.log("[AppContext] Fetching portfolio holdings from backend...");
    fetch(`${API_BASE_URL}/api/portfolio`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.length > 0) {
          const formatted = data.data.map((item: any) => ({
            id: item._id,
            ticker: item.ticker,
            companyName: item.companyName,
            shares: item.shares,
            buyPrice: item.buyPrice,
            currentPrice: item.currentPrice
          }));
          setPortfolio(formatted);
        }
      })
      .catch(err => {
        console.warn("[AppContext] Backend unreachable for portfolio logs, using local storage:", err);
        const saved = localStorage.getItem("altuni_portfolio");
        if (saved) setPortfolio(JSON.parse(saved));
      });
  }, []);

  // Saved reports (stores full PlatformReport objects instead of tickers)
  const [savedReportsList, setSavedReportsList] = useState<PlatformReport[]>(() => {
    const saved = localStorage.getItem("altuni_saved_reports_list");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("altuni_saved_reports_list", JSON.stringify(savedReportsList));
  }, [savedReportsList]);

  // Price Alerts
  const [alerts, setAlerts] = useState<CustomAlert[]>(() => {
    const saved = localStorage.getItem("altuni_alerts");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("altuni_alerts", JSON.stringify(alerts));
  }, [alerts]);

  // Compare Tickers
  const [compareTickers, setCompareTickers] = useState<string[]>([]);

  // Recent searches
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Computed state
  const isCurrentReportSaved = activeReport 
    ? savedReportsList.some(r => r.companyResearch.ticker?.toUpperCase() === activeReport.companyResearch.ticker?.toUpperCase()) 
    : false;

  const [abortController, setAbortController] = useState<AbortController | null>(null);

  const triggerAnalysis = async (query: string) => {
    if (!query.trim() || isAnalyzing) return;

    setSearchQuery(query);
    setIsAnalyzing(true);
    setAnalysisStep(0);
    setActiveTab("dashboard");

    const controller = new AbortController();
    setAbortController(controller);

    console.log(`[AppContext] Invoking backend API analyze stream for: ${query}`);
    try {
      const res = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ companyName: query }),
        signal: controller.signal,
      });

      if (!res.ok) throw new Error(`HTTP error status: ${res.status}`);

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("Response body is not readable.");
      }

      let buffer = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // Save the last incomplete line to parse later

        for (const line of lines) {
          const cleanLine = line.trim();
          if (!cleanLine.startsWith("data: ")) continue;

          const jsonStr = cleanLine.substring(6);
          try {
            const payload = JSON.parse(jsonStr);
            if (payload.type === "progress") {
              setAnalysisStep(payload.step);
            } else if (payload.type === "complete") {
              const report = payload.data;
              setActiveReport(report);
              setAnalyzedCompany(report.companyName || report.companyResearch.companyName);
              
              const formattedDate = new Date(report.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
              const newHistoryItem: HistoryItem = {
                id: report._id || Math.random().toString(),
                companyName: report.companyName || report.companyResearch.companyName,
                ticker: report.ticker || report.companyResearch.ticker || "MOCK",
                date: formattedDate,
                recommendation: report.recommendation.recommendation,
                investmentScore: report.recommendation.investmentScore,
                confidence: Math.round(report.recommendation.confidence * 100)
              };
              
              setHistory(prev => [newHistoryItem, ...prev.filter(h => h.ticker !== newHistoryItem.ticker)].slice(0, 15));
              addRecentSearch(query);
              showToast(`Analysis for ${newHistoryItem.companyName} completed successfully!`, "success");
            } else if (payload.type === "error") {
              throw new Error(payload.error);
            }
          } catch (errPayload: any) {
            console.error("[AppContext] Stream payload parse failure:", errPayload);
          }
        }
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("[AppContext] Request aborted successfully.");
        return;
      }
      console.error("[AppContext] Backend connection failed:", err);
      showToast(err.message || "We couldn't analyze this company right now. Please try again.", "error");
    } finally {
      setIsAnalyzing(false);
      setAbortController(null);
    }
  };

  const cancelAnalysis = () => {
    if (abortController) {
      abortController.abort();
    }
    setIsAnalyzing(false);
    setAnalysisStep(0);
    showToast("Analysis cancelled.", "warning");
  };

  // Watchlist functions
  const toggleWatchlist = (ticker: string, companyName?: string) => {
    const exists = watchlist.some(w => w.ticker === ticker);
    if (exists) {
      fetch(`${API_BASE_URL}/api/watchlist/${ticker}`, {
        method: "DELETE"
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setWatchlist(prev => prev.filter(w => w.ticker !== ticker));
            showToast(`${ticker} removed from Watchlist.`, "info");
          }
        })
        .catch(err => {
          console.error(err);
          setWatchlist(prev => prev.filter(w => w.ticker !== ticker));
        });
    } else {
      fetch(`${API_BASE_URL}/api/watchlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker, companyName })
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setWatchlist(prev => [...prev, data.data]);
            showToast(`${ticker} added to Watchlist.`, "success");
          }
        })
        .catch(err => {
          console.error(err);
          let resName = companyName || `${ticker} Corp.`;
          let resPrice = 100;
          let resRec = "HOLD";
          let resRisk = "Medium";

          if (activeReport && activeReport.companyResearch.ticker?.toUpperCase() === ticker.toUpperCase()) {
            resName = activeReport.companyResearch.companyName;
            resPrice = activeReport.valuation.currentPrice || 100;
            resRec = activeReport.recommendation.recommendation;
            resRisk = activeReport.risk.riskLevel;
          }

          const newWatch: WatchlistItem = {
            ticker,
            companyName: resName,
            price: resPrice,
            changePct: 0,
            recommendation: resRec,
            riskLevel: resRisk,
            alertOn: false
          };
          setWatchlist(prev => [...prev, newWatch]);
        });
    }
  };

  const toggleWatchlistAlert = (ticker: string) => {
    const item = watchlist.find(w => w.ticker === ticker);
    if (!item) return;

    const nextAlertState = !item.alertOn;
    fetch(`${API_BASE_URL}/api/watchlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticker, alertOn: nextAlertState })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setWatchlist(prev => prev.map(w => w.ticker === ticker ? { ...w, alertOn: nextAlertState } : w));
          showToast(`Alerts for ${ticker} ${nextAlertState ? "enabled" : "disabled"}.`, "info");
        }
      })
      .catch(err => {
        console.error(err);
        setWatchlist(prev => prev.map(w => w.ticker === ticker ? { ...w, alertOn: nextAlertState } : w));
      });
  };

  // History functions
  const loadReportById = (id: string) => {
    setIsAnalyzing(true);
    setAnalysisStep(0);
    setActiveTab("dashboard");

    console.log(`[AppContext] Fetching full report details for document: ${id}`);
    fetch(`${API_BASE_URL}/api/report/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const report = data.data;
          setActiveReport(report);
          setAnalyzedCompany(report.companyName || report.companyResearch.companyName);
          showToast(`Loaded report for ${report.companyName}`, "success");
        } else {
          showToast("Failed to retrieve report details.", "error");
        }
      })
      .catch(err => {
        console.error(err);
        showToast("Error connecting to backend server.", "error");
      })
      .finally(() => {
        setIsAnalyzing(false);
        setAnalysisStep(10);
      });
  };

  const deleteHistoryItem = (id: string) => {
    console.log(`[AppContext] Deleting analysis record: ${id}`);
    fetch(`${API_BASE_URL}/api/report/${id}`, {
      method: "DELETE",
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setHistory(prev => prev.filter(h => h.id !== id));
          showToast("Analysis deleted from history.", "success");
        } else {
          showToast("Failed to delete report.", "error");
        }
      })
      .catch(err => {
        console.error(err);
        // local fallback
        setHistory(prev => prev.filter(h => h.id !== id));
      });
  };

  const clearHistory = () => {
    setHistory([]);
    showToast("History cleared locally.", "info");
  };

  // Portfolio holdings functions
  const addHolding = (ticker: string, companyName: string, shares: number, buyPrice: number) => {
    fetch(`${API_BASE_URL}/api/portfolio`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticker, companyName, shares, buyPrice })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const item = data.data;
          const formatted = {
            id: item._id,
            ticker: item.ticker,
            companyName: item.companyName,
            shares: item.shares,
            buyPrice: item.buyPrice,
            currentPrice: item.currentPrice
          };
          setPortfolio(prev => [...prev, formatted]);
          showToast(`Added ${shares} shares of ${ticker} to Portfolio.`, "success");
        }
      })
      .catch(err => {
        console.error(err);
        const newHold: PortfolioHolding = {
          id: Math.random().toString(),
          ticker: ticker.toUpperCase(),
          companyName,
          shares,
          buyPrice,
          currentPrice: buyPrice
        };
        setPortfolio(prev => [...prev, newHold]);
      });
  };

  const removeHolding = (id: string) => {
    const item = portfolio.find(p => p.id === id);
    fetch(`${API_BASE_URL}/api/portfolio/${id}`, {
      method: "DELETE"
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPortfolio(prev => prev.filter(p => p.id !== id));
          if (item) {
            showToast(`Removed ${item.ticker} holding.`, "info");
          }
        }
      })
      .catch(err => {
        console.error(err);
        setPortfolio(prev => prev.filter(p => p.id !== id));
      });
  };

  // Saved reports functions
  const saveActiveReport = () => {
    if (activeReport) {
      const ticker = activeReport.companyResearch.ticker || "";
      if (savedReportsList.some(r => r.companyResearch.ticker?.toUpperCase() === ticker.toUpperCase())) {
        setSavedReportsList(prev => prev.filter(r => r.companyResearch.ticker?.toUpperCase() !== ticker.toUpperCase()));
        showToast("Report removed from Saved Reports.", "info");
      } else {
        setSavedReportsList(prev => [...prev, activeReport]);
        showToast("Report saved to Terminal library.", "success");
      }
    }
  };

  const deleteSavedReport = (ticker: string) => {
    setSavedReportsList(prev => prev.filter(r => r.companyResearch.ticker?.toUpperCase() !== ticker.toUpperCase()));
    showToast(`Saved report for ${ticker} deleted.`, "info");
  };

  // Custom Alerts
  const addCustomAlert = (alert: Omit<CustomAlert, "id" | "current" | "enabled">) => {
    let currentPriceVal = "N/A";
    if (activeReport && activeReport.companyResearch.ticker?.toUpperCase() === alert.ticker.toUpperCase()) {
      currentPriceVal = `$${activeReport.valuation.currentPrice || 0}`;
    }
    const newAlert: CustomAlert = {
      ...alert,
      id: Math.random().toString(),
      current: currentPriceVal,
      enabled: true
    };
    setAlerts(prev => [newAlert, ...prev]);
    showToast(`Custom alert created for ${alert.ticker}.`, "success");
  };

  const toggleAlertEnabled = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  const deleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    showToast("Alert deleted.", "info");
  };

  // Compare companies
  const toggleCompareTicker = (ticker: string) => {
    const tickUpper = ticker.toUpperCase();
    if (compareTickers.includes(tickUpper)) {
      setCompareTickers(prev => prev.filter(t => t !== tickUpper));
    } else {
      if (compareTickers.length >= 4) {
        showToast("Can compare up to 4 companies simultaneously.", "warning");
        return;
      }
      setCompareTickers(prev => [...prev, tickUpper]);
      showToast(`${tickUpper} added to comparison list.`, "success");
    }
  };

  const clearCompare = () => {
    setCompareTickers([]);
  };

  const addRecentSearch = (query: string) => {
    if (!query) return;
    const clean = query.trim();
    setRecentSearches(prev => [clean, ...prev.filter(q => q.toLowerCase() !== clean.toLowerCase())].slice(0, 8));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateProfile,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        analyzedCompany,
        activeReport,
        isAnalyzing,
        analysisStep,
        triggerAnalysis,
        cancelAnalysis,
        history,
        loadReportById,
        deleteHistoryItem,
        clearHistory,
        watchlist,
        toggleWatchlist,
        toggleWatchlistAlert,
        portfolio,
        addHolding,
        removeHolding,
        savedReportsList,
        saveActiveReport,
        deleteSavedReport,
        isCurrentReportSaved,
        alerts,
        addCustomAlert,
        toggleAlertEnabled,
        deleteAlert,
        compareTickers,
        toggleCompareTicker,
        clearCompare,
        recentSearches,
        addRecentSearch,
        showToast,
        toast
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
