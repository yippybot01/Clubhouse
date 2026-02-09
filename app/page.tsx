"use client";

import { useState } from "react";
import ActivityFeed from "@/components/ActivityFeed";
import CalendarView from "@/components/CalendarView";
import GlobalSearch from "@/components/GlobalSearch";
import EnhancedDashboard from "@/components/EnhancedDashboard";
import EnhancedSalesAnalytics from "@/components/EnhancedSalesAnalytics";
import InsightsTab from "@/components/InsightsTab";
import TokenSpend from "@/components/TokenSpend";
import { BarChart3, Calendar, Search, Activity, TrendingUp, Lightbulb, Zap, Coffee } from "lucide-react";
import MorningBriefs from "@/components/MorningBriefs";

export default function Home() {
  const [activeTab, setActiveTab] = useState("stats");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white">
      {/* Animated premium background */}
      <div className="fixed inset-0 -z-10 opacity-15">
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDuration: "8s" }}></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDuration: "6s", animationDelay: "2s" }}></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDuration: "7s", animationDelay: "1s" }}></div>
      </div>

      <header className="sticky top-0 z-50 border-b border-amber-600/20 bg-slate-950/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-4 mb-3">
                <img src="/yippy-logo.png" alt="Yippy" className="h-12 w-auto drop-shadow-lg" />
                <div>
                  <h1 className="text-4xl font-black bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent">
                    Clubhouse
                  </h1>
                  <p className="text-xs text-amber-300/70 mt-1">🏌️ Yippybot Performance Hub</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm ml-16">Real-time visibility into every action, token, and dollar spent</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end mb-2">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
                <p className="text-amber-300 font-bold text-sm">LIVE</p>
              </div>
              <p className="text-xs text-slate-400">Always Running</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-20 pb-16">
        {/* Custom Tab Navigation */}
        <div className="flex gap-2 mb-8 justify-center flex-wrap">
          {[
            { id: "dashboard", label: "Dashboard", icon: BarChart3 },
            { id: "sales", label: "Sales", icon: TrendingUp },
            { id: "insights", label: "Insights", icon: Lightbulb },
            { id: "briefs", label: "Morning Briefs", icon: Coffee },
            { id: "tokens", label: "Token Spend", icon: Zap },
            { id: "activity", label: "Activity", icon: Activity },
            { id: "calendar", label: "Calendar", icon: Calendar },
            { id: "search", label: "Search", icon: Search },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex flex-col items-center gap-2 px-10 py-4 rounded-lg font-bold text-sm transition-all duration-300 ${
                activeTab === id
                  ? "bg-gradient-to-br from-amber-600 via-amber-500 to-amber-600 text-slate-900 border border-amber-400 shadow-2xl shadow-amber-500/40"
                  : "bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:bg-slate-700/60 hover:border-amber-500/30"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="mt-12 animate-fadeIn">
          {activeTab === "dashboard" && <EnhancedDashboard />}
          {activeTab === "sales" && <EnhancedSalesAnalytics />}
          {activeTab === "insights" && <InsightsTab />}
          {activeTab === "briefs" && <MorningBriefs />}
          {activeTab === "tokens" && <TokenSpend />}
          {activeTab === "activity" && <ActivityFeed />}
          {activeTab === "calendar" && <CalendarView />}
          {activeTab === "search" && <GlobalSearch />}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-amber-600/20 bg-slate-950/50 backdrop-blur-sm mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <p className="text-slate-400 text-xs mb-2">🏌️ Clubhouse • Powered by Yippybot</p>
          <p className="text-slate-500 text-xs">Real-time activity monitoring with token & cost transparency • Yippy Pouches Performance Hub</p>
        </div>
      </footer>
    </div>
  );
}
