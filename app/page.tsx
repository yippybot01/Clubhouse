"use client";

import { useState } from "react";
import ActivityFeed from "@/components/ActivityFeed";
import CalendarView from "@/components/CalendarView";
import GlobalSearch from "@/components/GlobalSearch";
import DashboardStats from "@/components/DashboardStats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { BarChart3, Calendar, Search, Activity } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("stats");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDuration: "8s" }}></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDuration: "6s", animationDelay: "2s" }}></div>
      </div>

      <header className="sticky top-0 z-50 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse"></div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Mission Control
                </h1>
              </div>
              <p className="text-slate-400 text-sm">Yippybot Real-Time Visibility Hub</p>
            </div>
            <div className="text-right text-xs text-slate-400">
              <p className="text-slate-300 font-semibold mb-1">Status: LIVE</p>
              <p>Updated: {new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm p-1 rounded-xl">
            <TabsTrigger 
              value="stats" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white transition-all rounded-lg"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger 
              value="activity" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white transition-all rounded-lg"
            >
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Activity</span>
            </TabsTrigger>
            <TabsTrigger 
              value="calendar" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white transition-all rounded-lg"
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Calendar</span>
            </TabsTrigger>
            <TabsTrigger 
              value="search" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white transition-all rounded-lg"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Search</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="mt-8">
            <DashboardStats />
          </TabsContent>

          <TabsContent value="activity" className="mt-8">
            <ActivityFeed />
          </TabsContent>

          <TabsContent value="calendar" className="mt-8">
            <CalendarView />
          </TabsContent>

          <TabsContent value="search" className="mt-8">
            <GlobalSearch />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-sm mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-slate-400 text-xs">
          <p>Mission Control • Powered by Yippybot • Real-time activity monitoring with token & cost transparency</p>
        </div>
      </footer>
    </div>
  );
}
