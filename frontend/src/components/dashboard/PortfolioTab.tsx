import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { Plus, Trash2, ArrowUpRight, TrendingUp, DollarSign } from "lucide-react";

export default function PortfolioTab() {
  const { portfolio, addHolding, removeHolding, showToast, activeReport } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [ticker, setTicker] = useState("");
  const [shares, setShares] = useState("");
  const [buyPrice, setBuyPrice] = useState("");

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker || !shares || !buyPrice) {
      showToast("Please fill in all inputs.", "error");
      return;
    }

    const sharesNum = parseFloat(shares);
    const priceNum = parseFloat(buyPrice);

    if (isNaN(sharesNum) || sharesNum <= 0 || isNaN(priceNum) || priceNum <= 0) {
      showToast("Please enter valid positive values.", "error");
      return;
    }

    const uppercaseTicker = ticker.toUpperCase().trim();
    addHolding(uppercaseTicker, `${uppercaseTicker} Corp.`, sharesNum, priceNum);
    setTicker("");
    setShares("");
    setBuyPrice("");
    setShowAddForm(false);
  };

  // Performance calculations
  const totalCost = portfolio.reduce((acc, curr) => acc + (curr.shares * curr.buyPrice), 0);
  const totalValue = portfolio.reduce((acc, curr) => acc + (curr.shares * (curr.currentPrice || curr.buyPrice)), 0);

  const netProfit = totalValue - totalCost;
  const netProfitPct = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;

  // Pie chart allocation data
  const pieData = portfolio.map(item => {
    const value = item.shares * item.currentPrice;
    return {
      name: item.ticker,
      value
    };
  });

  const COLORS = ["#6C63FF", "#2ED573", "#FFA502", "#FF4757", "#3B82F6"];

  return (
    <div className="bg-card border border-border rounded-2xl p-6 transition-all duration-300 space-y-6 animate-fade-in">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-base font-extrabold text-white">Investment Portfolio</h3>
          <p className="text-[11px] text-text-secondary mt-0.5 font-medium">Monitor allocation ratios, holdings performance, and aggregate net yields.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary/95 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Position</span>
        </button>
      </div>

      {/* Add holding form drawer dropdown */}
      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="p-4 bg-muted/20 border border-border/80 rounded-xl grid grid-cols-1 md:grid-cols-4 gap-4 items-end animate-fade-in">
          <div>
            <label className="block text-[9px] font-bold text-text-secondary uppercase mb-1">Ticker</label>
            <input 
              type="text" 
              value={ticker} 
              onChange={(e) => setTicker(e.target.value)} 
              placeholder="e.g. TSLA" 
              className="w-full px-3 py-1.5 text-xs bg-background border border-border rounded-lg text-white uppercase focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-[9px] font-bold text-text-secondary uppercase mb-1">Shares Count</label>
            <input 
              type="number" 
              value={shares} 
              onChange={(e) => setShares(e.target.value)} 
              placeholder="e.g. 10" 
              className="w-full px-3 py-1.5 text-xs bg-background border border-border rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-[9px] font-bold text-text-secondary uppercase mb-1">Buy Price ($)</label>
            <input 
              type="number" 
              value={buyPrice} 
              onChange={(e) => setBuyPrice(e.target.value)} 
              placeholder="e.g. 175.50" 
              className="w-full px-3 py-1.5 text-xs bg-background border border-border rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button 
            type="submit" 
            className="py-1.5 bg-green hover:bg-green/95 text-white font-bold text-xs rounded-lg transition-all cursor-pointer"
          >
            Submit holding
          </button>
        </form>
      )}

      {/* Portfolio overview blocks */}
      {portfolio.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          {/* Values panel */}
          <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-muted/30 border border-border/40 rounded-xl p-4">
              <span className="text-[10px] text-text-secondary/70 uppercase font-bold block mb-1">Net Asset Value</span>
              <span className="text-xl font-extrabold text-white font-mono">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="bg-muted/30 border border-border/40 rounded-xl p-4">
              <span className="text-[10px] text-text-secondary/70 uppercase font-bold block mb-1">Invested Capital</span>
              <span className="text-xl font-extrabold text-white font-mono">${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="bg-muted/30 border border-border/40 rounded-xl p-4 col-span-2 md:col-span-1">
              <span className="text-[10px] text-text-secondary/70 uppercase font-bold block mb-1">Total Net Return</span>
              <span className={`text-xl font-extrabold font-mono block ${netProfit >= 0 ? "text-green" : "text-red"}`}>
                {netProfit >= 0 ? "+" : ""}${netProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({netProfitPct.toFixed(2)}%)
              </span>
            </div>
          </div>

          {/* Allocation pie */}
          <div className="md:col-span-4 h-36 border border-border/40 bg-muted/20 rounded-xl p-3 flex items-center justify-center relative">
            <h5 className="text-[9px] font-bold text-text-secondary uppercase absolute top-2.5 left-3">Asset Allocation Weight</h5>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={45}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => `$${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="text-[9px] font-bold text-text-secondary flex flex-col gap-1 pr-3 max-h-28 overflow-y-auto">
              {pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span>{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Holdings list */}
      {portfolio.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-muted/10 border border-dashed border-border/60 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center text-text-secondary mx-auto">
            <DollarSign className="w-4.5 h-4.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">No portfolio created.</h4>
            <p className="text-[10px] text-text-secondary mt-1">Create a portfolio to track your investments.</p>
          </div>
        </div>
      ) : (
        <div className="border border-border/40 rounded-xl overflow-hidden bg-muted/10">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border/40 bg-muted text-text-secondary font-bold">
                  <th className="p-3">Holding Asset</th>
                  <th className="p-3 font-mono">Shares</th>
                  <th className="p-3">Purchase Price</th>
                  <th className="p-3">Latest Price</th>
                  <th className="p-3">Total Value</th>
                  <th className="p-3">Unrealized Return</th>
                  <th className="p-3 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20 text-text-secondary font-medium">
                {portfolio.map((item) => {
                  let latest = item.currentPrice;
                  if (activeReport && activeReport.companyResearch.ticker?.toUpperCase() === item.ticker.toUpperCase()) {
                    latest = activeReport.valuation.currentPrice || item.currentPrice;
                  }
                  const costVal = item.shares * item.buyPrice;
                  const currentVal = item.shares * latest;
                  const itemProfit = currentVal - costVal;
                  const itemProfitPct = (itemProfit / costVal) * 100;

                  return (
                    <tr key={item.id} className="hover:bg-muted/10">
                      <td className="p-3">
                        <span className="text-white font-bold block">{item.companyName}</span>
                        <span className="text-[10px] font-mono text-text-secondary">{item.ticker}</span>
                      </td>
                      <td className="p-3 font-mono text-white">{item.shares}</td>
                      <td className="p-3 font-mono">${item.buyPrice.toFixed(2)}</td>
                      <td className="p-3 font-mono">${latest.toFixed(2)}</td>
                      <td className="p-3 font-mono text-white font-bold">${currentVal.toFixed(2)}</td>
                      <td className={`p-3 font-mono font-bold ${itemProfit >= 0 ? "text-green" : "text-red"}`}>
                        {itemProfit >= 0 ? "+" : ""}${itemProfit.toFixed(2)} ({itemProfitPct.toFixed(2)}%)
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => removeHolding(item.id)}
                          className="text-text-secondary hover:text-red p-1 rounded transition-colors cursor-pointer"
                          title="Delete holding position"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
