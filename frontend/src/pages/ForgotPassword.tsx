import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ChevronRight, CheckCircle2, ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setSubmitted(true);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background text-white px-4 relative overflow-hidden font-sans">
      
      {/* Background Decorative Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl p-8 relative z-10">
        
        {/* Logo Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center shadow-lg shadow-primary/20 mb-4">
            <svg className="w-5.5 h-5.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-white">Altuni Invest</h1>
          <span className="text-[9px] text-primary font-bold uppercase tracking-widest leading-none mt-0.5">Terminal Recovery</span>
        </div>

        {submitted ? (
          <div className="text-center space-y-6 animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-green/10 border border-green/20 flex items-center justify-center text-green mx-auto animate-bounce">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Recovery Link Dispatched</h3>
              <p className="text-xs text-text-secondary mt-2 leading-relaxed">
                If the email <span className="text-white font-bold">{email}</span> matches an active terminal account, a verification link has been dispatched to proceed.
              </p>
            </div>
            <Link 
              to="/login"
              className="w-full py-2.5 bg-muted hover:bg-border/20 border border-border/60 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-white text-sm">Recover Password</h3>
              <p className="text-xs text-text-secondary mt-1">Provide your registered email address to receive a password reset token link.</p>
            </div>

            {error && (
              <div className="p-3 bg-red/10 border border-red/30 text-red text-xs rounded-xl font-semibold leading-relaxed animate-fade-in">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
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

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/95 hover:to-indigo-600/95 text-white font-bold text-xs rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Dispatch Token Link</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>

            <Link 
              to="/login"
              className="w-full py-2.5 bg-muted hover:bg-border/20 border border-border/60 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        )}

      </div>
    </main>
  );
}
