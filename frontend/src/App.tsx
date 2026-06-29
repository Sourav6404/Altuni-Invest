import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import AnalysisProgress from "./pages/AnalysisProgress";

// Protected Route Guard
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useApp();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Global Toast Component
const ToastNotification = () => {
  const { toast } = useApp();
  if (!toast || !toast.visible) return null;

  const bgColors = {
    success: "border-green-500/30 bg-green-500/10 text-green-400",
    error: "border-red-500/30 bg-red-500/10 text-red-400",
    warning: "border-orange-500/30 bg-orange-500/10 text-orange-400",
    info: "border-blue-500/30 bg-blue-500/10 text-blue-400"
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 border rounded-xl shadow-xl backdrop-blur-xl animate-fade-in ${bgColors[toast.type]}`}>
      <span className="text-xs font-semibold">{toast.message}</span>
    </div>
  );
};

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

// Main Router Renders
function AppContent() {
  const { isAnalyzing } = useApp();
  return (
    <div className="relative min-h-screen bg-background text-text-primary antialiased font-sans">
      
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastNotification />
      {isAnalyzing && <AnalysisProgress />}
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AppProvider>
    </QueryClientProvider>
  );
}
