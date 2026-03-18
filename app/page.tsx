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
    <div className="min-h-screen bg-club-cream text-club-navy">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b-2 border-club-gold/30 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-club-green/10 border-2 border-club-gold flex items-center justify-center shadow-md">
                <img src="/yippy-logo.png" alt="Yippy" className="h-8 w-auto" />
              </div>
              <div>
                <h1 className="text-3xl font-serif font-bold tracking-tight text-club-navy">
                  The Clubhouse
                </h1>
                <p className="text-xs text-gray-500 mt-0.5 tracking-widest uppercase">
                  Yippy Pouches • Performance Hub
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-club-green/10 border border-club-green/30 rounded-full">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-club-green text-xs font-semibold tracking-wider">LIVE</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-8 pb-16">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex gap-1 p-1 bg-white border-2 border-club-gold/20 rounded-xl shadow-sm overflow-x-auto">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-lg font-semibold text-sm whitespace-nowrap transition-all duration-300 ${
                  activeTab === id
                    ? "bg-club-green text-white border border-club-gold shadow-md"
                    : "text-club-navy/60 hover:text-club-green hover:bg-club-cream"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Gold divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-club-gold/40 to-transparent mb-8" />

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
      <footer className="border-t-2 border-club-gold/20 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center">
          <p className="text-gray-400 text-xs tracking-widest uppercase">
            The Clubhouse • Est. 2026 • Yippy Pouches Performance Hub
          </p>
        </div>
      </footer>
    </div>
  );
}
