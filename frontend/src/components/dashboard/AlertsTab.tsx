import React, { useState } from "react";
import { useApp, CustomAlert } from "../../context/AppContext";
import { Bell, Plus, Trash2 } from "lucide-react";

export default function AlertsTab() {
  const { alerts, addCustomAlert, toggleAlertEnabled, deleteAlert } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [ticker, setTicker] = useState("");
  const [type, setType] = useState<"Price" | "Sentiment" | "Earnings" | "Macro">("Price");
  const [condition, setCondition] = useState<"Above" | "Below" | "Released" | "Changes">("Above");
  const [target, setTarget] = useState("");

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker || !target) return;

    addCustomAlert({
      ticker: ticker.toUpperCase(),
      companyName: `${ticker.toUpperCase()} Corp.`,
      type,
      condition,
      target
    });

    setTicker("");
    setTarget("");
    setShowAddForm(false);
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 transition-all duration-300 space-y-6 animate-fade-in">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-base font-extrabold text-white">Custom Alerts</h3>
          <p className="text-[11px] text-text-secondary mt-0.5 font-medium">Configure and manage automated alerts for target securities pricing or sentiment thresholds.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary/95 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Alert</span>
        </button>
      </div>

      {/* Add Alert Form */}
      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="p-4 bg-muted/20 border border-border/80 rounded-xl grid grid-cols-1 md:grid-cols-5 gap-4 items-end animate-fade-in text-white">
          <div>
            <label className="block text-[9px] font-bold text-text-secondary uppercase mb-1">Ticker</label>
            <input 
              type="text" 
              value={ticker} 
              onChange={(e) => setTicker(e.target.value)} 
              placeholder="e.g. NVDA" 
              className="w-full px-3 py-1.5 text-xs bg-background border border-border rounded-lg text-white uppercase focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-[9px] font-bold text-text-secondary uppercase mb-1">Alert Vector</label>
            <select 
              value={type} 
              onChange={(e) => setType(e.target.value as any)} 
              className="w-full px-3 py-1.5 text-xs bg-background border border-border rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="Price">Price Bound</option>
              <option value="Sentiment">Sentiment Level</option>
              <option value="Earnings">Earnings Release</option>
              <option value="Macro">Macro Indicator</option>
            </select>
          </div>
          <div>
            <label className="block text-[9px] font-bold text-text-secondary uppercase mb-1">Condition</label>
            <select 
              value={condition} 
              onChange={(e) => setCondition(e.target.value as any)} 
              className="w-full px-3 py-1.5 text-xs bg-background border border-border rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="Above">Price Above (&gt;)</option>
              <option value="Below">Price Below (&lt;)</option>
              <option value="Released">Released</option>
              <option value="Changes">Changes</option>
            </select>
          </div>
          <div>
            <label className="block text-[9px] font-bold text-text-secondary uppercase mb-1">Target Value</label>
            <input 
              type="text" 
              value={target} 
              onChange={(e) => setTarget(e.target.value)} 
              placeholder="e.g. $190.00" 
              className="w-full px-3 py-1.5 text-xs bg-background border border-border rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>
          <button 
            type="submit" 
            className="py-1.5 bg-green hover:bg-green/95 text-white font-bold text-xs rounded-lg transition-all cursor-pointer"
          >
            Create Alert
          </button>
        </form>
      )}

      {/* Alerts listings */}
      {alerts.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-muted/10 border border-dashed border-border/60 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center text-text-secondary mx-auto">
            <Bell className="w-4.5 h-4.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">No active alerts.</h4>
            <p className="text-[10px] text-text-secondary mt-1">Price and news alerts will appear here.</p>
          </div>
        </div>
      ) : (
        <div className="border border-border/40 rounded-xl overflow-hidden bg-muted/10">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border/40 bg-muted text-text-secondary font-bold">
                  <th className="p-3">Asset</th>
                  <th className="p-3">Vector type</th>
                  <th className="p-3">Alert Trigger Condition</th>
                  <th className="p-3 font-mono">Target Bounds</th>
                  <th className="p-3 font-mono">Current Val</th>
                  <th className="p-3">Monitor Status</th>
                  <th className="p-3 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20 text-text-secondary font-medium">
                {alerts.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/10">
                    <td className="p-3">
                      <span className="text-white font-bold block">{item.companyName}</span>
                      <span className="text-[10px] font-mono text-text-secondary">{item.ticker}</span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded font-bold text-[8px] uppercase">
                        {item.type}
                      </span>
                    </td>
                    <td className="p-3 text-white font-medium">{item.condition}</td>
                    <td className="p-3 font-mono text-white">{item.target}</td>
                    <td className="p-3 font-mono">{item.current}</td>
                    <td className="p-3">
                      <label className="inline-flex items-center cursor-pointer select-none">
                        <input 
                          type="checkbox"
                          checked={item.enabled}
                          onChange={() => toggleAlertEnabled(item.id)}
                          className="sr-only peer"
                        />
                        <div className="w-8 h-4 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-text-secondary after:border-border after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-green peer-checked:after:bg-white relative" />
                      </label>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => deleteAlert(item.id)}
                        className="text-text-secondary hover:text-red p-1 rounded transition-colors cursor-pointer"
                        title="Delete alert"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
