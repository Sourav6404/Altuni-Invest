import React from "react";
import { useApp, TabType } from "../../context/AppContext";
import { 
  LayoutDashboard, 
  History, 
  Star, 
  GitCompare, 
  Briefcase, 
  FileText, 
  Bell, 
  Settings, 
  LogOut,
  X,
  HelpCircle
} from "lucide-react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const { activeTab, setActiveTab, user, logout } = useApp();

  const menuItems = [
    { id: "dashboard" as TabType, label: "Dashboard", icon: LayoutDashboard },
    { id: "history" as TabType, label: "Research History", icon: History },
    { id: "watchlist" as TabType, label: "Watchlist", icon: Star },
    { id: "compare" as TabType, label: "Compare Companies", icon: GitCompare },
    { id: "portfolio" as TabType, label: "Portfolio", icon: Briefcase },
    { id: "reports" as TabType, label: "Saved Reports", icon: FileText },
    { id: "alerts" as TabType, label: "Alerts", icon: Bell },
    { id: "settings" as TabType, label: "Settings", icon: Settings }
  ];

  const handleTabClick = (tabId: TabType) => {
    setActiveTab(tabId);
    if (onClose) onClose();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between p-5 bg-[#08111F] border-r border-border select-none">
      <div>
        {/* Logo and close trigger for mobile */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-8.5 h-8.5 rounded-lg bg-[#3E6BFF]/10 border border-[#3E6BFF]/20 flex items-center justify-center shadow-[0_0_15px_rgba(62,107,255,0.1)]">
              <svg className="w-4.5 h-4.5 text-[#3E6BFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h2 className="font-extrabold text-[13px] tracking-tight leading-none text-white font-sans">Altuni Invest</h2>
              <span className="text-[9px] text-[#3E6BFF] font-bold uppercase tracking-widest leading-none mt-0.5 block font-mono">Research Core</span>
            </div>
          </div>
          {onClose && (
            <button 
              onClick={onClose}
              className="lg:hidden text-text-secondary hover:text-white p-1 rounded-lg hover:bg-secondary-card"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation list */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isSelected = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-semibold text-[11px] transition-all text-left cursor-pointer border-l-2 ${
                  isSelected
                    ? "bg-[#172338] text-white border-[#3E6BFF] shadow-[0_0_15px_rgba(62,107,255,0.08)]"
                    : "border-transparent text-text-secondary hover:text-white hover:bg-secondary-card/40"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 transition-opacity ${isSelected ? "opacity-100" : "opacity-60 group-hover:opacity-90"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile Info, Settings, and Logout */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-t border-border pt-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7.5 h-7.5 rounded bg-[#3E6BFF]/15 border border-[#3E6BFF]/30 text-[#3E6BFF] font-extrabold text-[10px] flex items-center justify-center shrink-0">
              {user?.name ? getInitials(user.name) : "AI"}
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-white truncate block leading-tight">
                {user?.name || "Investor"}
              </span>
              <span className="text-[8.5px] text-text-secondary leading-tight block font-semibold truncate mt-0.5">
                {user?.email || "institutional@altuni.com"}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-1 shrink-0">
            <button 
              onClick={() => alert("Institutional Help & Manual details. Access system metrics at docs.altuni.com.")}
              className="p-1.5 text-text-secondary hover:text-white rounded hover:bg-secondary-card/40 transition-all cursor-pointer"
              title="Help Manual"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => handleTabClick("settings")}
              className={`p-1.5 rounded hover:bg-secondary-card/40 transition-all cursor-pointer ${
                activeTab === "settings" ? "text-primary" : "text-text-secondary hover:text-white"
              }`}
              title="Settings"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={logout}
              className="text-text-secondary hover:text-red p-1.5 rounded hover:bg-secondary-card/40 transition-all cursor-pointer"
              title="Log Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-56 h-screen shrink-0 sticky top-0">
        {sidebarContent}
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden animate-fade-in select-none">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Content */}
          <div className="relative w-64 max-w-xs h-full flex flex-col z-10 animate-slide-in">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
