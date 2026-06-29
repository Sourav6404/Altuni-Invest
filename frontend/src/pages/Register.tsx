import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { 
  Lock, 
  Mail, 
  User,
  ChevronRight, 
  TrendingUp, 
  Sparkles, 
  ShieldCheck,
  Chrome,
  Github
} from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState("");

  const handleFormRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!terms) {
      setError("Please accept the terms of service.");
      return;
    }

    register(name, email, password, (err) => {
      if (err) {
        setError(err);
      } else {
        navigate("/dashboard");
      }
    });
  };

  const handleOAuthRegister = (provider: "google" | "github") => {
    register(provider === "google" ? "Google Investor" : "GitHub Developer", `oauth_${provider}@altuni.com`, "oauth_password", (err) => {
      if (!err) navigate("/dashboard");
    });
  };

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-background text-white font-sans overflow-hidden">
      
      {/* Left Screen - Premium Illustration, Floating Cards, Charts */}
      <div className="hidden lg:flex lg:col-span-7 bg-[#050B14] relative items-center justify-center p-12 overflow-hidden border-r border-border/40">
        
        {/* Glows */}
        <div className="absolute top-[-20%] left-[-20%] w-[50vw] h-[50vw] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-xl space-y-12 relative z-10 w-full">
          {/* Main Visual Widget */}
          <div className="glass-panel border-border/80 rounded-2xl p-6 shadow-2xl relative">
            <div className="absolute -top-3.5 -left-3.5 w-7 h-7 rounded-lg bg-primary/20 border border-primary/45 flex items-center justify-center text-primary">
              <Sparkles className="w-4 h-4" />
            </div>

            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center text-primary">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold">Research Matrix</h4>
                  <span className="text-[9px] text-text-secondary leading-none block">Real-time SEC Scanning</span>
                </div>
              </div>
              <span className="text-[10px] text-green font-semibold bg-green/10 px-2 py-0.5 border border-green/20 rounded-full uppercase tracking-wider">ACTIVE</span>
            </div>

            {/* Simulated Agent logs */}
            <div className="space-y-3 font-mono text-[10px] text-text-secondary">
              <div className="flex justify-between border-b border-border/20 pb-1.5">
                <span>[AGENT_1] SEC 10-K Retrieval</span>
                <span className="text-green font-bold">SUCCESS</span>
              </div>
              <div className="flex justify-between border-b border-border/20 pb-1.5">
                <span>[AGENT_2] DCF Multiple Calculations</span>
                <span className="text-green font-bold">100% COMPLETE</span>
              </div>
              <div className="flex justify-between border-b border-border/20 pb-1.5">
                <span>[AGENT_3] Competitor Benchmark Index</span>
                <span className="text-primary font-bold">CALCULATING...</span>
              </div>
            </div>

            {/* Sparkline */}
            <div className="h-28 mt-6 flex items-end gap-1 px-1">
              {[25, 45, 30, 60, 52, 75, 80, 72, 95].map((val, i) => (
                <div 
                  key={i} 
                  className="flex-1 bg-gradient-to-t from-primary to-blue-400 rounded-t-sm"
                  style={{ height: `${val}%` }}
                />
              ))}
            </div>
          </div>

          {/* Marketing text */}
          <div className="space-y-4">
            <h3 className="text-2xl font-extrabold text-white tracking-tight leading-tight">
              Decouple your investment research workflows.
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Altuni Invest uses a coordinate multi-agent system to scrape real-time financial statements, news items, and market trends, providing clear institutional intelligence in seconds.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-primary">
                <ShieldCheck className="w-4 h-4" />
                <span>256-bit encryption protocol</span>
              </div>
              <span className="text-text-secondary/40">•</span>
              <span className="text-[11px] text-text-secondary font-semibold">SEC compliant interfaces</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Screen - Beautiful Registration Panel */}
      <div className="lg:col-span-5 flex flex-col justify-center px-6 py-12 md:px-16 bg-[#07111E] relative">
        <div className="absolute top-1/4 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="w-full max-w-sm mx-auto space-y-8 relative z-10">
          
          {/* Logo & title */}
          <div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center shadow-lg shadow-primary/20">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h2 className="font-extrabold text-base tracking-tight leading-none text-white">Altuni Invest</h2>
                <span className="text-[9px] text-primary font-bold uppercase tracking-widest leading-none mt-0.5 block">Access Terminal</span>
              </div>
            </div>
            <h3 className="text-xl font-extrabold text-white tracking-tight mt-8">Create New Account</h3>
            <p className="text-xs text-text-secondary mt-1">Register credentials to start researching markets.</p>
          </div>

          {/* Validation Alert */}
          {error && (
            <div className="p-3 bg-red/10 border border-red/30 text-red text-xs rounded-xl font-semibold leading-relaxed animate-fade-in">
              {error}
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleFormRegister} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-secondary">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-xs bg-muted border border-border/80 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all placeholder:text-text-secondary/50"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-secondary">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-xs bg-muted border border-border/80 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all placeholder:text-text-secondary/50"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-secondary">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-xs bg-muted border border-border/80 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all placeholder:text-text-secondary/50"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-secondary">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-xs bg-muted border border-border/80 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all placeholder:text-text-secondary/50"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox"
                  checked={terms}
                  onChange={(e) => setTerms(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border border-border/60 bg-muted text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                />
                <span className="text-[11px] text-text-secondary font-medium">I accept the Terms of Service & Privacy Policy</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/95 hover:to-indigo-600/95 text-white font-bold text-xs rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer mt-4"
            >
              <span>Create Account</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>

          {/* Dividers */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-[1px] bg-border/40" />
            <span className="px-3 text-[10px] uppercase font-bold text-text-secondary tracking-widest leading-none">OR PROTOCOL</span>
            <div className="flex-1 h-[1px] bg-border/40" />
          </div>

          {/* Social Sign-In buttons */}
          <div className="grid grid-cols-2 gap-3.5">
            <button
              onClick={() => handleOAuthRegister("google")}
              className="flex items-center justify-center gap-2 py-2 bg-muted hover:bg-border/20 border border-border/60 text-xs font-semibold rounded-xl transition-all cursor-pointer"
            >
              <Chrome className="w-4 h-4 text-orange" />
              <span>Google</span>
            </button>
            <button
              onClick={() => handleOAuthRegister("github")}
              className="flex items-center justify-center gap-2 py-2 bg-muted hover:bg-border/20 border border-border/60 text-xs font-semibold rounded-xl transition-all cursor-pointer"
            >
              <Github className="w-4 h-4 text-white" />
              <span>GitHub</span>
            </button>
          </div>

          <div className="text-center text-xs text-text-secondary pt-4 border-t border-border/20">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline font-bold">
              Sign In
            </Link>
          </div>

        </div>
      </div>

    </main>
  );
}
