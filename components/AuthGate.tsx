"use client";

import React, { useState, useEffect } from "react";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const DASHBOARD_PASSWORD = "yippy2026";

  useEffect(() => {
    const auth = sessionStorage.getItem("clubhouse_auth");
    if (auth === "true") setIsAuthenticated(true);
    setIsLoading(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === DASHBOARD_PASSWORD) {
      sessionStorage.setItem("clubhouse_auth", "true");
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password");
      setPassword("");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A1628] via-[#0F1D32] to-[#1B4332]/80 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400"></div>
          <p className="text-gray-400 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A1628] via-[#0F1D32] to-[#1B4332]/80 flex items-center justify-center p-4 grid-overlay">
        {/* Animated glow orbs */}
        <div className="fixed inset-0 -z-10 opacity-20">
          <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-500 rounded-full filter blur-[120px] animate-pulse" style={{ animationDuration: "8s" }}></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-700 rounded-full filter blur-[120px] animate-pulse" style={{ animationDuration: "6s", animationDelay: "2s" }}></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-emerald-500/20 rounded-2xl p-8 shadow-[0_8px_32px_rgba(16,185,129,0.2)]">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <span className="text-3xl">⛳</span>
              </div>
              <h1 className="text-3xl font-sans font-bold text-white tracking-tight drop-shadow-lg">
                The Clubhouse
              </h1>
              <p className="text-gray-400 text-sm mt-1">🏌️ Yippy Pouches Performance Hub</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Enter password to continue
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/40 focus:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition"
                  autoFocus
                />
                {error && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                    <span>✕</span> {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]"
              >
                Unlock Clubhouse
              </button>
            </form>

            <p className="text-center text-gray-600 text-xs mt-6">
              Team only. Authorized access only.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
