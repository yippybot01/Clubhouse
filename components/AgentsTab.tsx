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

const statusConfig: Record<AgentStatus, { emoji: string; label: string; color: string; bg: string; border: string }> = {
  idle: { emoji: "🟢", label: "Idle", color: "text-emerald-400", bg: "bg-emerald-500/15", border: "border-emerald-500/30" },
  working: { emoji: "🔵", label: "Working", color: "text-blue-400", bg: "bg-blue-500/15", border: "border-blue-500/30" },
  collaborating: { emoji: "🟣", label: "Collaborating", color: "text-purple-400", bg: "bg-purple-500/15", border: "border-purple-500/30" },
  review: { emoji: "🟠", label: "Review", color: "text-amber-400", bg: "bg-amber-500/15", border: "border-amber-500/30" },
  offline: { emoji: "⚫", label: "Offline", color: "text-slate-500", bg: "bg-slate-500/15", border: "border-slate-500/30" },
};

const mockAgents: Agent[] = [
  {
    id: "yippybot",
    name: "Yippybot",
    role: "Main Agent • Orchestrator",
    avatar: "🤖",
    status: "working",
    currentTask: "Processing morning brief & monitoring Shopify events",
    tasksCompleted: 1247,
    revenueImpact: "$12,450",
    qualityScore: 97,
    avgRuntime: "2.3s",
    collaboratingWith: ["devin", "echo"],
    lastActive: "Just now",
  },
  {
    id: "devin",
    name: "Devin",
    role: "Dashboard Architect • UI/UX",
    avatar: "🎨",
    status: "working",
    currentTask: "Redesigning Clubhouse with golf country club aesthetic",
    tasksCompleted: 89,
    revenueImpact: "$3,200",
    qualityScore: 95,
    avgRuntime: "45s",
    collaboratingWith: ["yippybot"],
    lastActive: "Just now",
  },
  {
    id: "echo",
    name: "Echo",
    role: "Research & Analysis",
    avatar: "🔍",
    status: "idle",
    currentTask: "Awaiting next research assignment",
    tasksCompleted: 312,
    revenueImpact: "$5,800",
    qualityScore: 93,
    avgRuntime: "8.1s",
    lastActive: "12m ago",
  },
  {
    id: "sage",
    name: "Sage",
    role: "Strategy & Insights",
    avatar: "🧠",
    status: "review",
    currentTask: "Reviewing Q1 marketing strategy recommendations",
    tasksCompleted: 156,
    revenueImpact: "$8,900",
    qualityScore: 96,
    avgRuntime: "15s",
    collaboratingWith: ["catalyst"],
    lastActive: "5m ago",
  },
  {
    id: "catalyst",
    name: "Catalyst",
    role: "Growth & Campaigns",
    avatar: "🚀",
    status: "collaborating",
    currentTask: "Co-building Masters Tournament campaign with Sage",
    tasksCompleted: 203,
    revenueImpact: "$15,200",
    qualityScore: 91,
    avgRuntime: "12s",
    collaboratingWith: ["sage"],
    lastActive: "2m ago",
  },
  {
    id: "ventures",
    name: "Ventures",
    role: "Business Development",
    avatar: "💼",
    status: "idle",
    currentTask: "Monitoring partnership opportunities",
    tasksCompleted: 78,
    revenueImpact: "$22,100",
    qualityScore: 94,
    avgRuntime: "20s",
    lastActive: "1h ago",
  },
  {
    id: "optimizer",
    name: "Optimizer",
    role: "Performance & Efficiency",
    avatar: "⚡",
    status: "offline",
    currentTask: "Scheduled maintenance window",
    tasksCompleted: 445,
    revenueImpact: "$6,300",
    qualityScore: 98,
    avgRuntime: "1.8s",
    lastActive: "3h ago",
  },
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

  // Auto-refresh every 30s
  useEffect(() => {
    const interval = setInterval(refresh, 30000);
    return () => clearInterval(interval);
  }, [refresh]);

  const totalTasks = agents.reduce((sum, a) => sum + a.tasksCompleted, 0);
  const avgQuality = (agents.reduce((sum, a) => sum + a.qualityScore, 0) / agents.length).toFixed(1);
  const activeAgents = agents.filter((a) => a.status !== "offline").length;

  return (
    <div className="space-y-8">
      {/* Header with Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold text-club-cream">Agent Command Center</h2>
          <p className="text-club-gold/60 text-sm mt-1">
            Autonomous team performance & coordination
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-club-cream/40">
            Last refresh: {lastRefresh.toLocaleTimeString()}
          </span>
          <button
            onClick={refresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-club-forest/60 border border-club-gold/30 rounded-lg text-club-gold text-sm font-semibold hover:bg-club-forest/80 hover:border-club-gold/50 transition-all duration-300"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Team Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Active Agents", value: `${activeAgents}/${agents.length}`, icon: Users, accent: "text-emerald-400" },
          { label: "Total Tasks", value: totalTasks.toLocaleString(), icon: Zap, accent: "text-club-gold" },
          { label: "Avg Quality", value: `${avgQuality}%`, icon: Star, accent: "text-purple-400" },
          { label: "Team Uptime", value: "99.2%", icon: Activity, accent: "text-blue-400" },
        ].map((metric) => (
          <div
            key={metric.label}
            className="bg-club-navy-light/60 border border-club-gold/15 rounded-xl p-5 backdrop-blur-sm hover:border-club-gold/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-club-cream/50 text-xs font-semibold uppercase tracking-wider">{metric.label}</p>
              <metric.icon className={`w-5 h-5 ${metric.accent}`} />
            </div>
            <p className={`text-3xl font-bold font-serif ${metric.accent}`}>{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Agent Cards Grid */}
      <div>
        <h3 className="text-lg font-serif font-bold text-club-cream mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-club-gold" />
          Agent Roster
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {agents.map((agent) => {
            const status = statusConfig[agent.status];
            return (
              <div
                key={agent.id}
                className={`relative bg-club-navy-light/60 border rounded-xl p-5 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-club-gold/5 ${
                  agent.status === "offline"
                    ? "border-slate-700/30 opacity-70"
                    : "border-club-gold/15 hover:border-club-gold/30"
                }`}
              >
                {/* Status indicator dot */}
                <div className="absolute top-4 right-4">
                  <span className={`text-sm`}>{status.emoji}</span>
                </div>

                {/* Avatar & Name */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-club-forest/40 border border-club-gold/20 flex items-center justify-center text-2xl">
                    {agent.avatar}
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-club-cream">{agent.name}</h4>
                    <p className="text-xs text-club-cream/40">{agent.role}</p>
                  </div>
                </div>

                {/* Status Badge */}
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.color} ${status.border} border mb-3`}>
                  {status.label}
                </div>

                {/* Current Task */}
                <p className="text-sm text-club-cream/60 mb-4 line-clamp-2 leading-relaxed">
                  {agent.currentTask}
                </p>

                {/* Collaborating With */}
                {agent.collaboratingWith && agent.collaboratingWith.length > 0 && (
                  <div className="flex items-center gap-1 mb-4 text-xs text-purple-300/70">
                    <span>↔</span>
                    <span>
                      with {agent.collaboratingWith.map((id) => {
                        const collab = agents.find((a) => a.id === id);
                        return collab?.name;
                      }).join(", ")}
                    </span>
                  </div>
                )}

                {/* Metrics */}
                <div className="border-t border-club-gold/10 pt-3 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-club-cream/40">Tasks</span>
                    <span className="text-club-cream/70 font-semibold">{agent.tasksCompleted}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-club-cream/40">Revenue Impact</span>
                    <span className="text-club-gold font-semibold">{agent.revenueImpact}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-club-cream/40">Quality</span>
                    <span className="text-emerald-400 font-semibold">{agent.qualityScore}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-club-cream/40">Avg Runtime</span>
                    <span className="text-club-cream/70 font-semibold">{agent.avgRuntime}</span>
                  </div>
                </div>

                {/* Last Active */}
                <div className="mt-3 pt-2 border-t border-club-gold/5 flex items-center gap-1 text-xs text-club-cream/30">
                  <Clock className="w-3 h-3" />
                  {agent.lastActive}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two-column: Activity Feed + Collaboration Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Activity Feed */}
        <div className="bg-club-navy-light/60 border border-club-gold/15 rounded-xl p-6 backdrop-blur-sm">
          <h3 className="text-lg font-serif font-bold text-club-cream mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-club-gold" />
            Live Activity Feed
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {activityFeed.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 py-2.5 border-b border-club-gold/5 last:border-0"
              >
                <span className="text-xs text-club-gold/50 font-mono whitespace-nowrap mt-0.5">
                  {item.time}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-club-cream/80">{item.agent}</span>
                  <p className="text-xs text-club-cream/50 mt-0.5">{item.action}</p>
                </div>
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                  item.type === "success" ? "bg-emerald-400" : "bg-blue-400"
                }`} />
              </div>
            ))}
          </div>
        </div>

        {/* Collaboration Visualization */}
        <div className="bg-club-navy-light/60 border border-club-gold/15 rounded-xl p-6 backdrop-blur-sm">
          <h3 className="text-lg font-serif font-bold text-club-cream mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-club-gold" />
            Active Collaborations
          </h3>
          <div className="space-y-4">
            {agents
              .filter((a) => a.collaboratingWith && a.collaboratingWith.length > 0 && a.status !== "offline")
              .map((agent) => (
                <div
                  key={agent.id}
                  className="bg-club-forest/20 border border-purple-500/20 rounded-lg p-4"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl">{agent.avatar}</span>
                    <span className="text-sm font-bold text-club-cream">{agent.name}</span>
                    <span className="text-purple-400 text-xs">↔</span>
                    {agent.collaboratingWith?.map((id) => {
                      const collab = agents.find((a) => a.id === id);
                      return (
                        <span key={id} className="flex items-center gap-1">
                          <span className="text-xl">{collab?.avatar}</span>
                          <span className="text-sm font-bold text-club-cream">{collab?.name}</span>
                        </span>
                      );
                    })}
                  </div>
                  <p className="text-xs text-club-cream/50 pl-8">{agent.currentTask}</p>
                </div>
              ))}

            {/* Team Performance Summary */}
            <div className="mt-6 pt-4 border-t border-club-gold/10">
              <h4 className="text-sm font-semibold text-club-cream/70 mb-3">Team Performance</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-club-navy/40 rounded-lg p-3 text-center">
                  <p className="text-2xl font-serif font-bold text-club-gold">{totalTasks.toLocaleString()}</p>
                  <p className="text-xs text-club-cream/40 mt-1">Total Tasks Done</p>
                </div>
                <div className="bg-club-navy/40 rounded-lg p-3 text-center">
                  <p className="text-2xl font-serif font-bold text-emerald-400">$73,950</p>
                  <p className="text-xs text-club-cream/40 mt-1">Total Revenue Impact</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
