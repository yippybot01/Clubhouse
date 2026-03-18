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
      <div className="min-h-screen bg-gradient-to-br from-club-cream via-white to-club-cream flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"></div>
          <p className="text-club-navy mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-club-cream via-white to-club-cream flex items-center justify-center p-4">
        {/* Animated background */}
        <div className="fixed inset-0 -z-10 opacity-15">
          <div className="absolute top-0 left-0 w-96 h-96 bg-club-green rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDuration: "8s" }}></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDuration: "6s", animationDelay: "2s" }}></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-club-gold rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDuration: "7s", animationDelay: "1s" }}></div>
        </div>

        <div className="w-full max-w-md">
          <div className="bg-white shadow-md border border-club-gold/30 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-black text-club-navy mb-2">
                Clubhouse
              </h1>
              <p className="text-club-gold/70 text-sm">🏌️ Yippybot Performance Hub</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Enter password to continue
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-club-cream border border-club-gold/25 rounded-lg text-club-navy placeholder-gray-400 focus:outline-none focus:border-club-gold focus:ring-1 focus:ring-club-gold transition"
                  autoFocus
                />
                {error && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                    <span>✕</span> {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-club-green hover:bg-club-green/90 text-club-navy font-bold rounded-lg transition-all duration-300 shadow-lg shadow-club-green/20 hover:shadow-club-green/30"
              >
                Unlock Clubhouse
              </button>
            </form>

            <p className="text-center text-gray-400 text-xs mt-6">
              Team only. Authorized access only.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
