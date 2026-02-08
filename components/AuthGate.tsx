"use client";

import React, { useState, useEffect } from "react";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // CHANGE THIS PASSWORD TO SOMETHING SECURE
  const DASHBOARD_PASSWORD = "yippy2026"; // Change me!

  useEffect(() => {
    // Check if already authenticated in session
    const auth = sessionStorage.getItem("clubhouse_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"></div>
          <p className="text-white mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex items-center justify-center p-4">
        {/* Animated background */}
        <div className="fixed inset-0 -z-10 opacity-15">
          <div className="absolute top-0 left-0 w-96 h-96 bg-amber-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDuration: "8s" }}></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDuration: "6s", animationDelay: "2s" }}></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDuration: "7s", animationDelay: "1s" }}></div>
        </div>

        <div className="w-full max-w-md">
          <div className="bg-slate-800/60 backdrop-blur-xl border border-amber-600/30 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-black bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent mb-2">
                Clubhouse
              </h1>
              <p className="text-amber-300/70 text-sm">🏌️ Yippybot Performance Hub</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Enter password to continue
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
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
                className="w-full py-3 px-4 bg-gradient-to-br from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:via-amber-400 hover:to-amber-500 text-slate-900 font-bold rounded-lg transition-all duration-300 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50"
              >
                Unlock Clubhouse
              </button>
            </form>

            <p className="text-center text-slate-500 text-xs mt-6">
              Team only. Authorized access only.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
