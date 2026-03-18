"use client";

import React from "react";
import { Lightbulb, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Clock, AlertCircle, Star } from "lucide-react";
import { keyOpportunities, actionItems, alerts } from "@/lib/demoData";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const OpportunityCard = ({ opportunity, current, target, impact: _impact, lever, priority, estRevenue }: {
  opportunity: string; current: string; target: string; impact: string; lever: string; priority: number; estRevenue: string;
}) => {
  const priorityColors: Record<number, string> = {
    1: "bg-red-500/10 border-red-500/30 text-red-400",
    2: "bg-amber-500/10 border-amber-500/30 text-amber-400",
    3: "bg-sky-500/10 border-sky-500/30 text-sky-400",
    4: "bg-gray-500/10 border-gray-500/30 text-gray-400",
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] hover:border-emerald-500/20 transition-all duration-300 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start gap-3 mb-2">
            <div className={`${priorityColors[priority] || priorityColors[4]} rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold flex-shrink-0 border`}>P{priority}</div>
            <h3 className="font-sans font-bold text-white text-lg leading-tight">{opportunity}</h3>
          </div>
          <div className="ml-11 space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-gray-500 text-xs mb-1">Current</p><p className="font-bold text-white">{current}</p></div>
              <div><p className="text-gray-500 text-xs mb-1">Target</p><p className="font-bold text-emerald-400">{target}</p></div>
            </div>
            <div className="bg-white/5 rounded-xl p-3 space-y-2 border border-white/10">
              <p className="text-xs text-gray-400"><strong>Action:</strong> {lever}</p>
              <p className="text-xs text-gray-400"><strong>Est. Revenue Impact:</strong> <span className="text-amber-400 font-bold">{estRevenue}</span></p>
            </div>
          </div>
        </div>
      </div>
      <button className="w-full px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 text-sm border border-emerald-500/30 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]">
        <Lightbulb className="w-4 h-4" />Implement Strategy
      </button>
    </div>
  );
};

const ActionItemCard = ({ action, owner, dueDate, impact, status, description }: {
  action: string; owner: string; dueDate: string; impact: string; status: string; description: string;
}) => {
  const statusIcons: Record<string, React.ReactNode> = {
    not_started: <div className="w-5 h-5 rounded-full border-2 border-gray-500" />,
    in_progress: <div className="w-5 h-5 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-amber-400" /></div>,
    completed: <CheckCircle className="w-5 h-5 text-emerald-400" />,
  };
  const statusStyles: Record<string, string> = {
    not_started: "bg-white/5 border-white/10",
    in_progress: "bg-amber-500/5 border-amber-500/20",
    completed: "bg-emerald-500/5 border-emerald-500/20",
  };

  return (
    <div className={`border rounded-xl p-4 space-y-3 backdrop-blur-xl ${statusStyles[status] || statusStyles.not_started}`}>
      <div className="flex items-start gap-3">
        {statusIcons[status] || statusIcons.not_started}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white">{action}</h4>
          <p className="text-xs text-gray-400 mt-1">{description}</p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 text-xs">
          <span className={`px-2 py-1 rounded border ${impact === "High" ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"}`}>{impact} Impact</span>
          <span className="text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" />{dueDate}</span>
        </div>
        <span className="text-xs text-gray-500 font-medium">{owner}</span>
      </div>
    </div>
  );
};

const AlertCard = ({ type, metric, current, previous, change, description, actionRequired }: {
  type: string; metric: string; current: number; previous: number; change: number; description: string; actionRequired: boolean;
}) => {
  const typeStyles: Record<string, string> = {
    warning: "bg-red-500/5 border-red-500/20 text-red-400",
    info: "bg-emerald-500/5 border-emerald-500/20 text-emerald-400",
  };
  const typeIcons: Record<string, React.ReactNode> = {
    warning: <AlertTriangle className="w-5 h-5" />,
    info: <Lightbulb className="w-5 h-5" />,
  };

  return (
    <div className={`border rounded-xl p-4 space-y-3 flex items-start gap-4 backdrop-blur-xl ${typeStyles[type] || typeStyles.info}`}>
      <div className="flex-shrink-0">{typeIcons[type] || typeIcons.info}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-4 mb-2">
          <h4 className="font-semibold text-white text-sm">{metric}</h4>
          <div className="flex items-center gap-1 text-xs font-bold">
            {change > 0 ? <TrendingUp className="w-4 h-4 text-emerald-400" /> : <TrendingDown className="w-4 h-4 text-red-400" />}
            <span>{change > 0 ? "+" : ""}{change}%</span>
          </div>
        </div>
        <p className="text-sm text-gray-400 mb-2">{description}</p>
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex gap-4 text-gray-500"><span>Current: <span className="font-bold text-white">{current}</span></span><span>Previous: <span className="font-bold text-white">{previous}</span></span></div>
          {actionRequired && <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-semibold border border-red-500/30">Action Required</span>}
        </div>
      </div>
    </div>
  );
};

export default function InsightsTab() {
  return (
    <div className="space-y-8">
      {/* Executive Summary */}
      <div className="bg-gradient-to-br from-emerald-500/10 to-white/5 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-6 shadow-2xl">
        <h2 className="text-2xl font-sans font-bold text-white mb-4 tracking-tight">Executive Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <p className="text-amber-400 font-semibold text-sm mb-2">⚠️ Critical Issues</p>
            <p className="text-3xl font-mono font-bold text-white">3</p>
            <p className="text-xs text-gray-500 mt-2">Metrics trending down. Need immediate action.</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <p className="text-emerald-400 font-semibold text-sm mb-2">✅ Positive Trends</p>
            <p className="text-3xl font-mono font-bold text-white">2</p>
            <p className="text-xs text-gray-500 mt-2">AOV and ROAS increasing. Bundle strategy working.</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <p className="text-sky-400 font-semibold text-sm mb-2">🎯 Opportunities</p>
            <p className="text-3xl font-mono font-bold text-white">4</p>
            <p className="text-xs text-gray-500 mt-2">High-leverage actions that could 3x growth.</p>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div>
        <h2 className="text-2xl font-sans font-bold text-white mb-4 tracking-tight">⚡ Alerts & Anomalies</h2>
        <div className="space-y-3">{alerts.map((alert, idx) => <AlertCard key={idx} {...alert} />)}</div>
      </div>

      {/* Opportunities */}
      <div>
        <h2 className="text-2xl font-sans font-bold text-white mb-4 flex items-center gap-2 tracking-tight">
          <Lightbulb className="w-6 h-6 text-amber-400" />Highest ROI Opportunities
        </h2>
        <div className="grid grid-cols-1 gap-4">{keyOpportunities.map((opp, idx) => <OpportunityCard key={idx} {...opp} />)}</div>
      </div>

      {/* Action Items */}
      <div>
        <h2 className="text-2xl font-sans font-bold text-white mb-4 flex items-center gap-2 tracking-tight">
          <Clock className="w-6 h-6 text-amber-400" />Action Items This Week
        </h2>
        <div className="space-y-3">{actionItems.map((item, idx) => <ActionItemCard key={idx} {...item} />)}</div>
      </div>

      {/* AI Recommendations */}
      <div>
        <h2 className="text-2xl font-sans font-bold text-white mb-4 flex items-center gap-2 tracking-tight">
          <Star className="w-6 h-6 text-amber-400" />AI-Powered Recommendations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: "Email Nurture Sequence", description: "Build a 5-email automated sequence targeting existing customers. Expected to increase repeat rate from 3% to 8% in 90 days.", impact: "High", complexity: "Low", timeframe: "2 weeks" },
            { title: "Product Bundling Strategy", description: "Create 3-4 strategic bundles (e.g., Golf+Work combo). Increase bundle attach rate from 25% to 35%+.", impact: "High", complexity: "Medium", timeframe: "1 week" },
            { title: "Organic Channel Focus", description: "Allocate 60% of marketing budget to organic (currently 42%). Reduce CAC from $12.50 to $8 goal.", impact: "Medium", complexity: "Medium", timeframe: "Ongoing" },
            { title: "Geographic Expansion", description: "Launch targeted campaigns for Canada (7.5% of market). Potential $2,000/month additional revenue.", impact: "Medium", complexity: "High", timeframe: "4 weeks" },
          ].map((rec, idx) => (
            <div key={idx} className="bg-gradient-to-br from-purple-500/10 to-white/5 backdrop-blur-xl border border-purple-500/20 rounded-xl p-4 space-y-3 hover:border-purple-500/30 transition-all duration-300">
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-sans font-bold text-white mb-1">{rec.title}</h4>
                  <p className="text-sm text-gray-400 mb-3">{rec.description}</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2 py-1 rounded bg-red-500/10 text-red-400 border border-red-500/20">{rec.impact} Impact</span>
                    <span className="px-2 py-1 rounded bg-white/5 text-gray-400 border border-white/10">{rec.complexity}</span>
                    <span className="px-2 py-1 rounded bg-white/5 text-gray-400 border border-white/10">{rec.timeframe}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deep Insights */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
        <h3 className="text-lg font-sans font-bold text-white mb-4">📊 Deep Insights</h3>
        <div className="space-y-4">
          {[
            { color: "border-amber-500", title: "Golf Pouch Dominance", titleColor: "text-amber-400", text: 'Golf products represent <strong>64% of revenue</strong>. Excellent product-market fit. Focus on golf influencer partnerships.' },
            { color: "border-red-500", title: "Conversion Rate Gap", titleColor: "text-red-400", text: 'Current <strong>2.8%</strong> vs target <strong>4.5%</strong> = <strong>60% gap</strong>. Small improvements in checkout flow could recover this.' },
            { color: "border-sky-500", title: "Direct Traffic Concentration", titleColor: "text-sky-400", text: '<strong>92.5% of sales from Direct</strong> channel. Single-point-of-failure risk. Diversify to Amazon, affiliates.' },
            { color: "border-emerald-500", title: "AOV is Trending Up", titleColor: "text-emerald-400", text: 'AOV increasing week-over-week ($40 → $43.37). Bundle strategy is working. Highest-ROI metric to optimize.' },
          ].map((insight, idx) => (
            <div key={idx} className={`bg-white/5 border-l-4 ${insight.color} rounded-xl p-4`}>
              <p className={`${insight.titleColor} font-semibold mb-2`}>{insight.title}</p>
              <p className="text-sm text-gray-400" dangerouslySetInnerHTML={{ __html: insight.text }} />
            </div>
          ))}
        </div>
      </div>

      {/* Next Review */}
      <div className="bg-gradient-to-br from-amber-500/10 to-white/5 backdrop-blur-xl border border-amber-500/20 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-sans font-bold text-white text-lg mb-2">Next Review: February 14</h3>
            <p className="text-gray-400 text-sm">These insights will be refreshed on Friday. Focus on implementing the 3 P1 opportunities above for maximum impact.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
