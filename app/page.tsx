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
    <div className="min-h-screen bg-gradient-to-br from-club-navy via-club-navy-light to-club-forest-dark text-club-cream">
      {/* Subtle background texture */}
      <div className="fixed inset-0 -z-10 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(212,175,55,0.1) 50px, rgba(212,175,55,0.1) 51px),
            repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(212,175,55,0.1) 50px, rgba(212,175,55,0.1) 51px)`
        }} />
      </div>
      <div className="fixed inset-0 -z-10 opacity-10">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-club-forest rounded-full mix-blend-multiply filter blur-[120px] animate-pulse" style={{ animationDuration: "10s" }} />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-club-burgundy rounded-full mix-blend-multiply filter blur-[120px] animate-pulse" style={{ animationDuration: "8s", animationDelay: "3s" }} />
        <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-club-gold/20 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse" style={{ animationDuration: "12s", animationDelay: "1s" }} />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-club-gold/20 bg-club-navy/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-club-forest/40 border-2 border-club-gold/40 flex items-center justify-center shadow-lg shadow-club-gold/10">
                <img src="/yippy-logo.png" alt="Yippy" className="h-8 w-auto drop-shadow-lg" />
              </div>
              <div>
                <h1 className="text-3xl font-serif font-bold tracking-tight">
                  <span className="bg-gradient-to-r from-club-gold via-club-gold-light to-club-gold bg-clip-text text-transparent">
                    The Clubhouse
                  </span>
                </h1>
                <p className="text-xs text-club-cream/40 mt-0.5 tracking-widest uppercase">
                  Yippy Pouches • Performance Hub
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-club-forest/30 border border-club-gold/20 rounded-full">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-club-gold text-xs font-semibold tracking-wider">LIVE</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-8 pb-16">
        {/* Tab Navigation — elegant horizontal bar */}
        <div className="mb-8">
          <div className="flex gap-1 p-1 bg-club-navy-light/50 border border-club-gold/10 rounded-xl backdrop-blur-sm overflow-x-auto">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-lg font-semibold text-sm whitespace-nowrap transition-all duration-300 ${
                  activeTab === id
                    ? "bg-gradient-to-br from-club-forest to-club-forest-dark text-club-gold border border-club-gold/30 shadow-lg shadow-club-gold/10"
                    : "text-club-cream/50 hover:text-club-cream/80 hover:bg-club-navy-light/60"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Gold divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-club-gold/30 to-transparent mb-8" />

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
      <footer className="border-t border-club-gold/10 bg-club-navy/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center">
          <div className="h-px bg-gradient-to-r from-transparent via-club-gold/20 to-transparent mb-4" />
          <p className="text-club-cream/30 text-xs tracking-widest uppercase">
            The Clubhouse • Est. 2026 • Yippy Pouches Performance Hub
          </p>
        </div>
      </footer>
    </div>
  );
}
