"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
  RefreshCw,
  Zap,
  Clock,
  TrendingUp,
  Star,
  Activity,
} from "lucide-react";

type AgentStatus = "idle" | "working" | "collaborating" | "review" | "offline";

interface Agent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: AgentStatus;
  currentTask: string;
  tasksCompleted: number;
  revenueImpact: string;
  qualityScore: number;
  avgRuntime: string;
  collaboratingWith?: string[];
  lastActive: string;
}

const statusConfig: Record<AgentStatus, { label: string; color: string; glow: string; bg: string }> = {
  idle: { label: "Idle", color: "bg-emerald-400", glow: "shadow-[0_0_20px_rgba(16,185,129,0.8)]", bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" },
  working: { label: "Working", color: "bg-sky-400", glow: "shadow-[0_0_20px_rgba(56,189,248,0.8)]", bg: "bg-sky-500/10 text-sky-400 border-sky-500/30" },
  collaborating: { label: "Collaborating", color: "bg-purple-400", glow: "shadow-[0_0_20px_rgba(167,139,250,0.8)]", bg: "bg-purple-500/10 text-purple-400 border-purple-500/30" },
  review: { label: "Review", color: "bg-amber-400", glow: "shadow-[0_0_20px_rgba(251,191,36,0.8)]", bg: "bg-amber-500/10 text-amber-400 border-amber-500/30" },
  offline: { label: "Offline", color: "bg-gray-500", glow: "", bg: "bg-gray-500/10 text-gray-400 border-gray-500/30" },
};

const agentIconGradients: Record<string, string> = {
  yippybot: "from-emerald-500 to-emerald-700",
  devin: "from-purple-500 to-purple-700",
  echo: "from-sky-500 to-sky-700",
  sage: "from-amber-500 to-amber-700",
  catalyst: "from-orange-500 to-orange-700",
  ventures: "from-indigo-500 to-indigo-700",
  optimizer: "from-cyan-500 to-cyan-700",
};

const mockAgents: Agent[] = [
  { id: "yippybot", name: "Yippybot", role: "Main Agent • Orchestrator", avatar: "🤖", status: "working", currentTask: "Processing morning brief & monitoring Shopify events", tasksCompleted: 1247, revenueImpact: "$12,450", qualityScore: 97, avgRuntime: "2.3s", collaboratingWith: ["devin", "echo"], lastActive: "Just now" },
  { id: "devin", name: "Devin", role: "Dashboard Architect • UI/UX", avatar: "🎨", status: "working", currentTask: "Redesigning Clubhouse with dark golf-tech aesthetic", tasksCompleted: 89, revenueImpact: "$3,200", qualityScore: 95, avgRuntime: "45s", collaboratingWith: ["yippybot"], lastActive: "Just now" },
  { id: "echo", name: "Echo", role: "Research & Analysis", avatar: "🔍", status: "idle", currentTask: "Awaiting next research assignment", tasksCompleted: 312, revenueImpact: "$5,800", qualityScore: 93, avgRuntime: "8.1s", lastActive: "12m ago" },
  { id: "sage", name: "Sage", role: "Strategy & Insights", avatar: "🧠", status: "review", currentTask: "Reviewing Q1 marketing strategy recommendations", tasksCompleted: 156, revenueImpact: "$8,900", qualityScore: 96, avgRuntime: "15s", collaboratingWith: ["catalyst"], lastActive: "5m ago" },
  { id: "catalyst", name: "Catalyst", role: "Growth & Campaigns", avatar: "🚀", status: "collaborating", currentTask: "Co-building Masters Tournament campaign with Sage", tasksCompleted: 203, revenueImpact: "$15,200", qualityScore: 91, avgRuntime: "12s", collaboratingWith: ["sage"], lastActive: "2m ago" },
  { id: "ventures", name: "Ventures", role: "Business Development", avatar: "💼", status: "idle", currentTask: "Monitoring partnership opportunities", tasksCompleted: 78, revenueImpact: "$22,100", qualityScore: 94, avgRuntime: "20s", lastActive: "1h ago" },
  { id: "optimizer", name: "Optimizer", role: "Performance & Efficiency", avatar: "⚡", status: "offline", currentTask: "Scheduled maintenance window", tasksCompleted: 445, revenueImpact: "$6,300", qualityScore: 98, avgRuntime: "1.8s", lastActive: "3h ago" },
];

const activityFeed = [
  { time: "11:52 AM", agent: "Yippybot", action: "Completed morning brief delivery", type: "success" },
  { time: "11:48 AM", agent: "Devin", action: "Started Clubhouse redesign sprint", type: "info" },
  { time: "11:45 AM", agent: "Sage", action: "Generated Q1 strategy report", type: "success" },
  { time: "11:40 AM", agent: "Catalyst", action: "Launched A/B test for Masters campaign", type: "info" },
  { time: "11:35 AM", agent: "Echo", action: "Completed competitor analysis on NicoDose", type: "success" },
  { time: "11:30 AM", agent: "Yippybot", action: "Synced Shopify order #1248", type: "info" },
  { time: "11:22 AM", agent: "Ventures", action: "Identified 3 new partnership leads", type: "success" },
  { time: "11:15 AM", agent: "Optimizer", action: "Reduced API latency by 12%", type: "success" },
];

export default function AgentsTab() {
  const [agents] = useState(mockAgents);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastRefresh(new Date());
      setIsRefreshing(false);
    }, 800);
  }, []);

  useEffect(() => {
    const interval = setInterval(refresh, 30000);
    return () => clearInterval(interval);
  }, [refresh]);

  const totalTasks = agents.reduce((sum, a) => sum + a.tasksCompleted, 0);
  const avgQuality = (agents.reduce((sum, a) => sum + a.qualityScore, 0) / agents.length).toFixed(1);
  const activeAgents = agents.filter((a) => a.status !== "offline").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-sans font-bold text-white tracking-tight">Agent Command Center</h2>
          <p className="text-gray-400 text-sm mt-1">Autonomous team performance & coordination</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-500">Last refresh: {lastRefresh.toLocaleTimeString()}</span>
          <button onClick={refresh} disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-emerald-400 text-sm font-semibold hover:bg-white/10 hover:border-emerald-500/30 transition-all duration-300">
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Team Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Active Agents", value: `${activeAgents}/${agents.length}`, icon: Users, color: "emerald" },
          { label: "Total Tasks", value: totalTasks.toLocaleString(), icon: Zap, color: "amber" },
          { label: "Avg Quality", value: `${avgQuality}%`, icon: Star, color: "purple" },
          { label: "Team Uptime", value: "99.2%", icon: Activity, color: "sky" },
        ].map((metric) => {
          const colors: Record<string, string> = {
            emerald: "border-emerald-500/20 text-emerald-400",
            amber: "border-amber-500/20 text-amber-400",
            purple: "border-purple-500/20 text-purple-400",
            sky: "border-sky-500/20 text-sky-400",
          };
          const glows: Record<string, string> = {
            emerald: "hover:shadow-[0_8px_32px_rgba(16,185,129,0.15)]",
            amber: "hover:shadow-[0_8px_32px_rgba(251,191,36,0.15)]",
            purple: "hover:shadow-[0_8px_32px_rgba(167,139,250,0.15)]",
            sky: "hover:shadow-[0_8px_32px_rgba(56,189,248,0.15)]",
          };
          return (
            <div key={metric.label}
              className={`bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border ${colors[metric.color]} rounded-2xl p-5 shadow-2xl ${glows[metric.color]} transition-all duration-500`}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">{metric.label}</p>
                <metric.icon className={`w-5 h-5 ${colors[metric.color].split(" ")[1]}`} />
              </div>
              <p className={`text-3xl font-mono font-bold ${colors[metric.color].split(" ")[1]}`}>{metric.value}</p>
            </div>
          );
        })}
      </div>

      {/* Agent Cards Grid */}
      <div>
        <h3 className="text-lg font-sans font-bold text-white mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-emerald-400" />
          Agent Roster
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {agents.map((agent) => {
            const status = statusConfig[agent.status];
            const gradient = agentIconGradients[agent.id] || "from-emerald-500 to-emerald-700";
            return (
              <div key={agent.id}
                className={`relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-2xl border border-emerald-500/20 rounded-xl p-5 shadow-[0_8px_32px_0_rgba(16,185,129,0.15)] hover:shadow-[0_8px_48px_0_rgba(16,185,129,0.3)] hover:border-emerald-500/40 transition-all duration-300 group ${
                  agent.status === "offline" ? "opacity-60" : ""
                }`}>
                {/* Status glow dot */}
                <div className={`absolute -top-1.5 -right-1.5 w-3.5 h-3.5 ${status.color} rounded-full ${status.glow} ${agent.status !== "offline" ? "animate-pulse" : ""}`} />

                {/* Avatar & Name */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 text-2xl`}>
                    {agent.avatar}
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-white">{agent.name}</h4>
                    <p className="text-xs text-gray-400">{agent.role}</p>
                  </div>
                </div>

                {/* Status Badge */}
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${status.bg} border mb-3`}>
                  {status.label}
                </div>

                {/* Current Task */}
                <p className="text-sm text-gray-400 mb-4 line-clamp-2 leading-relaxed">{agent.currentTask}</p>

                {/* Collaborating With */}
                {agent.collaboratingWith && agent.collaboratingWith.length > 0 && (
                  <div className="flex items-center gap-1 mb-4 text-xs text-purple-400">
                    <span>↔</span>
                    <span>with {agent.collaboratingWith.map((id) => agents.find((a) => a.id === id)?.name).join(", ")}</span>
                  </div>
                )}

                {/* Metrics */}
                <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Tasks</span>
                    <span className="text-gray-300 font-semibold">{agent.tasksCompleted}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Revenue Impact</span>
                    <span className="text-emerald-400 font-mono font-semibold">{agent.revenueImpact}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Quality</span>
                    <span className="text-amber-400 font-semibold">{agent.qualityScore}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Avg Runtime</span>
                    <span className="text-gray-300 font-semibold">{agent.avgRuntime}</span>
                  </div>
                </div>

                {/* Last Active */}
                <div className="mt-3 pt-2 border-t border-white/5 flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  {agent.lastActive}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Activity Feed + Collaboration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Activity Feed */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
          <h3 className="text-lg font-sans font-bold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            Live Activity Feed
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {activityFeed.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 py-2.5 border-b border-white/5 last:border-0">
                <span className="text-xs text-gray-500 font-mono whitespace-nowrap mt-0.5">{item.time}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-gray-200">{item.agent}</span>
                  <p className="text-xs text-gray-400 mt-0.5">{item.action}</p>
                </div>
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                  item.type === "success" ? "bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]" : "bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.6)]"
                }`} />
              </div>
            ))}
          </div>
        </div>

        {/* Collaboration */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
          <h3 className="text-lg font-sans font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Active Collaborations
          </h3>
          <div className="space-y-4">
            {agents.filter((a) => a.collaboratingWith && a.collaboratingWith.length > 0 && a.status !== "offline").map((agent) => (
              <div key={agent.id} className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl">{agent.avatar}</span>
                  <span className="text-sm font-bold text-white">{agent.name}</span>
                  <span className="text-purple-400 text-xs">↔</span>
                  {agent.collaboratingWith?.map((id) => {
                    const collab = agents.find((a) => a.id === id);
                    return (
                      <span key={id} className="flex items-center gap-1">
                        <span className="text-xl">{collab?.avatar}</span>
                        <span className="text-sm font-bold text-white">{collab?.name}</span>
                      </span>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-400 pl-8">{agent.currentTask}</p>
              </div>
            ))}

            {/* Team Performance */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <h4 className="text-sm font-semibold text-gray-300 mb-3">Team Performance</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
                  <p className="text-2xl font-mono font-bold text-amber-400">{totalTasks.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">Total Tasks Done</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
                  <p className="text-2xl font-mono font-bold text-emerald-400">$73,950</p>
                  <p className="text-xs text-gray-500 mt-1">Total Revenue Impact</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
