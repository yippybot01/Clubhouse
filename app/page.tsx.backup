"use client";

import { useState } from "react";
import ActivityFeed from "@/components/ActivityFeed";
import CalendarView from "@/components/CalendarView";
import GlobalSearch from "@/components/GlobalSearch";
import EnhancedDashboard from "@/components/EnhancedDashboard";
import EnhancedSalesAnalytics from "@/components/EnhancedSalesAnalytics";
import InsightsTab from "@/components/InsightsTab";
import TokenSpend from "@/components/TokenSpend";
import AgentsTab from "@/components/AgentsTab";
import { BarChart3, Calendar, Search, Activity, TrendingUp, Lightbulb, Zap, Coffee, MapPin, Users } from "lucide-react";
import MorningBriefs from "@/components/MorningBriefs";
import SeasonalCalendar from "@/components/SeasonalCalendar";

export default function Home() {
  const [activeTab, setActiveTab] = useState("agents");

  const tabs = [
    { id: "agents", label: "Agents", icon: Users },
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "sales", label: "Sales", icon: TrendingUp },
    { id: "insights", label: "Insights", icon: Lightbulb },
    { id: "briefs", label: "Morning Briefs", icon: Coffee },
    { id: "seasonal", label: "Seasonal", icon: MapPin },
    { id: "tokens", label: "Token Spend", icon: Zap },
    { id: "activity", label: "Activity", icon: Activity },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "search", label: "Search", icon: Search },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1628] via-[#0F1D32] to-[#1B4332]/80 text-gray-100 grid-overlay">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <img src="/yippy-logo.png" alt="Yippy" className="h-8 w-auto drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
              </div>
              <div>
                <h1 className="text-2xl font-sans font-bold tracking-tight text-white drop-shadow-lg">
                  The Clubhouse
                </h1>
                <p className="text-xs text-gray-400 mt-0.5 tracking-widest uppercase">
                  Yippy Pouches • Performance Hub
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
                <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse" />
                <p className="text-emerald-400 text-xs font-semibold tracking-wider">LIVE</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-8 pb-16 relative z-10">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex gap-1 p-1.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-x-auto">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`relative flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm whitespace-nowrap transition-all duration-300 ${
                  activeTab === id
                    ? "bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                    : "text-gray-400 hover:text-emerald-400 hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
                {activeTab === id && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-emerald-400 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Emerald divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent mb-8" />

        {/* Content */}
        <div className="animate-fadeIn">
          {activeTab === "agents" && <AgentsTab />}
          {activeTab === "dashboard" && <EnhancedDashboard />}
          {activeTab === "sales" && <EnhancedSalesAnalytics />}
          {activeTab === "insights" && <InsightsTab />}
          {activeTab === "briefs" && <MorningBriefs />}
          {activeTab === "seasonal" && <SeasonalCalendar />}
          {activeTab === "tokens" && <TokenSpend />}
          {activeTab === "activity" && <ActivityFeed />}
          {activeTab === "calendar" && <CalendarView />}
          {activeTab === "search" && <GlobalSearch />}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center">
          <p className="text-gray-500 text-xs tracking-widest uppercase">
            The Clubhouse • Est. 2026 • Yippy Pouches Performance Hub
          </p>
        </div>
      </footer>
    </div>
  );
}
