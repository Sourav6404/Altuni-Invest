import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { User, Lock, Key, Bell, Shield, Download } from "lucide-react";

export default function SettingsTab() {
  const { user, updateProfile, showToast } = useApp();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [apiKey, setApiKey] = useState(user?.apiKey || "at_DEMO_KEY_6C63FF");

  // Notifications toggles states
  const [priceAlerts, setPriceAlerts] = useState(true);
  const [earningsAlerts, setEarningsAlerts] = useState(true);
  const [newsletter, setNewsletter] = useState(false);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      showToast("Name and email are required.", "error");
      return;
    }

    if (password) {
      if (password !== confirmPassword) {
        showToast("Passwords do not match.", "error");
        return;
      }
      updateProfile(name, email, password);
      setPassword("");
      setConfirmPassword("");
    } else {
      updateProfile(name, email);
    }
  };

  const handleRegenerateKey = () => {
    const nextKey = "at_" + Math.random().toString(36).substring(2, 10).toUpperCase();
    setApiKey(nextKey);
    showToast("API security key regenerated.", "success");
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 transition-all duration-300 space-y-8 animate-fade-in text-white max-w-4xl">
      <div>
        <h3 className="text-base font-extrabold">Terminal Settings</h3>
        <p className="text-[11px] text-text-secondary mt-0.5 font-medium">Manage your profile credentials, custom API credentials, and notification settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Profile and Security Form */}
        <form onSubmit={handleProfileSubmit} className="md:col-span-8 space-y-6">
          <h4 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-1.5 border-b border-border/40 pb-2">
            <User className="w-4 h-4" />
            <span>Profile & Account Security</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1.5">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-muted border border-border rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1.5">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-muted border border-border rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1.5">New Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave blank to keep current"
                className="w-full px-3 py-2 text-xs bg-muted border border-border rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-text-secondary/30"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1.5">Confirm New Password</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Leave blank to keep current"
                className="w-full px-3 py-2 text-xs bg-muted border border-border rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-text-secondary/30"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-primary/10 cursor-pointer"
          >
            Save Account Changes
          </button>
        </form>

        {/* Sidebar Settings: API Credentials, Subscriptions */}
        <div className="md:col-span-4 space-y-6">
          {/* API Key Panel */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-1.5 border-b border-border/40 pb-2">
              <Key className="w-4 h-4" />
              <span>Developer API Key</span>
            </h4>
            <p className="text-[10px] text-text-secondary leading-relaxed">
              Use this key to query Altuni Invest multi-agent engines via terminal endpoints.
            </p>
            <div className="bg-muted border border-border p-3 rounded-lg flex items-center justify-between font-mono text-[11px] text-white">
              <span className="truncate">{apiKey}</span>
            </div>
            <button 
              type="button"
              onClick={handleRegenerateKey}
              className="text-[10px] text-primary font-bold hover:underline cursor-pointer"
            >
              Regenerate Security Key
            </button>
          </div>

          {/* Subscriptions Tier Panel */}
          <div className="space-y-3.5 pt-2">
            <h4 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-1.5 border-b border-border/40 pb-2">
              <Shield className="w-4 h-4" />
              <span>Terminal Subscription</span>
            </h4>
            <div className="bg-muted border border-border p-3 rounded-lg">
              <div className="flex justify-between items-center text-xs font-bold text-white">
                <span>Free Tier</span>
                <span className="text-[9px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full">ACTIVE</span>
              </div>
              <p className="text-[10px] text-text-secondary mt-1.5 leading-relaxed font-medium">Upgrade to Pro level for expanded SEC queries and advanced DCF modules.</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
