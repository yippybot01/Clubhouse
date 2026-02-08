"use client";

import React, { useState } from "react";
import {
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Clock,
  Zap,
  AlertCircle,
  Star,
} from "lucide-react";
import {
  keyOpportunities,
  actionItems,
  alerts,
} from "@/lib/demoData";

const OpportunityCard = ({
  opportunity,
  current,
  target,
  impact,
  lever,
  priority,
  estRevenue,
}: {
  opportunity: string;
  current: string;
  target: string;
  impact: string;
  lever: string;
  priority: number;
  estRevenue: string;
}) => {
  const priorityColors = {
    1: "bg-red-600/20 border-red-500/30 text-red-300",
    2: "bg-amber-600/20 border-amber-500/30 text-amber-300",
    3: "bg-blue-600/20 border-blue-500/30 text-blue-300",
    4: "bg-slate-600/20 border-slate-500/30 text-slate-300",
  };

  const impactIcons = {
    "High ROI": <Zap className="w-4 h-4" />,
    "Medium ROI": <TrendingUp className="w-4 h-4" />,
    "Risk mitigation": <AlertCircle className="w-4 h-4" />,
  };

  return (
    <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 hover:border-slate-600/50 transition-colors space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start gap-3 mb-2">
            <div
              className={`${priorityColors[priority as keyof typeof priorityColors]} rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold flex-shrink-0`}
            >
              P{priority}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white text-lg leading-tight">
                {opportunity}
              </h3>
            </div>
          </div>

          <div className="ml-11 space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-400 text-xs mb-1">Current</p>
                <p className="font-bold text-white">{current}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs mb-1">Target</p>
                <p className="font-bold text-emerald-300">{target}</p>
              </div>
            </div>

            <div className="bg-slate-700/30 rounded-lg p-3 space-y-2">
              <p className="text-xs text-slate-400">
                <strong>Action:</strong> {lever}
              </p>
              <p className="text-xs text-slate-400">
                <strong>Est. Revenue Impact:</strong> <span className="text-emerald-300 font-bold">{estRevenue}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs font-semibold">
                {impactIcons[impact as keyof typeof impactIcons]}
                <span className="text-slate-300">{impact}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button className="w-full px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 text-sm">
        <Lightbulb className="w-4 h-4" />
        Implement Strategy
      </button>
    </div>
  );
};

const ActionItemCard = ({
  action,
  owner,
  dueDate,
  impact,
  status,
  description,
}: {
  action: string;
  owner: string;
  dueDate: string;
  impact: string;
  status: string;
  description: string;
}) => {
  const statusIcons = {
    not_started: (
      <div className="w-5 h-5 rounded-full border-2 border-slate-400"></div>
    ),
    in_progress: (
      <div className="w-5 h-5 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-amber-500"></div>
      </div>
    ),
    completed: (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ),
  };

  const statusColors = {
    not_started: "bg-slate-700/30 border-slate-600/50",
    in_progress: "bg-amber-600/20 border-amber-500/30",
    completed: "bg-green-600/20 border-green-500/30",
  };

  const impactColors = {
    High: "bg-red-600/20 text-red-300 border-red-500/30",
    Medium: "bg-amber-600/20 text-amber-300 border-amber-500/30",
  };

  return (
    <div
      className={`border rounded-xl p-4 space-y-3 ${
        statusColors[status as keyof typeof statusColors]
      }`}
    >
      <div className="flex items-start gap-3">
        {statusIcons[status as keyof typeof statusIcons]}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white">{action}</h4>
          <p className="text-xs text-slate-400 mt-1">{description}</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 text-xs">
          <span className={`px-2 py-1 rounded border ${impactColors[impact as keyof typeof impactColors]}`}>
            {impact} Impact
          </span>
          <span className="text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {dueDate}
          </span>
        </div>
        <span className="text-xs text-slate-400 font-medium">{owner}</span>
      </div>
    </div>
  );
};

const AlertCard = ({
  type,
  metric,
  current,
  previous,
  change,
  description,
  actionRequired,
}: {
  type: string;
  metric: string;
  current: number;
  previous: number;
  change: number;
  description: string;
  actionRequired: boolean;
}) => {
  const typeStyles = {
    warning: "bg-red-600/20 border-red-500/30 text-red-300",
    info: "bg-blue-600/20 border-blue-500/30 text-blue-300",
  };

  const typeIcons = {
    warning: <AlertTriangle className="w-5 h-5" />,
    info: <Lightbulb className="w-5 h-5" />,
  };

  const trendIcon =
    change > 0 ? (
      <TrendingUp className="w-4 h-4 text-green-400" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-400" />
    );

  return (
    <div
      className={`border rounded-lg p-4 space-y-3 flex items-start gap-4 ${
        typeStyles[type as keyof typeof typeStyles]
      }`}
    >
      <div className="flex-shrink-0">{typeIcons[type as keyof typeof typeIcons]}</div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-4 mb-2">
          <h4 className="font-semibold text-white text-sm">{metric}</h4>
          <div className="flex items-center gap-1 text-xs font-bold">
            {trendIcon}
            <span>{change > 0 ? "+" : ""}{change}%</span>
          </div>
        </div>

        <p className="text-sm text-slate-300 mb-2">{description}</p>

        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex gap-4">
            <span>
              Current: <span className="font-bold">{current}</span>
            </span>
            <span>
              Previous: <span className="font-bold">{previous}</span>
            </span>
          </div>
          {actionRequired && (
            <span className="px-2 py-1 bg-red-500 text-white rounded text-xs font-semibold">
              Action Required
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const SmartRecommendation = ({
  title,
  description,
  impact,
  complexity,
  timeframe,
}: {
  title: string;
  description: string;
  impact: string;
  complexity: string;
  timeframe: string;
}) => {
  return (
    <div className="bg-gradient-to-br from-purple-600/20 to-purple-900/20 border border-purple-500/30 rounded-lg p-4 space-y-3">
      <div className="flex items-start gap-3">
        <Star className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-bold text-white mb-1">{title}</h4>
          <p className="text-sm text-slate-300 mb-3">{description}</p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-2 py-1 rounded bg-purple-600/40 text-purple-200">
              {impact} Impact
            </span>
            <span className="px-2 py-1 rounded bg-slate-600/40 text-slate-200">
              {complexity}
            </span>
            <span className="px-2 py-1 rounded bg-slate-600/40 text-slate-200">
              {timeframe}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function InsightsTab() {
  const [expandedSection, setExpandedSection] = useState("opportunities");

  return (
    <div className="space-y-8">
      {/* Executive Summary */}
      <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-white mb-4">Executive Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-700/30 rounded-lg p-4">
            <p className="text-amber-300 font-semibold text-sm mb-2">⚠️ Critical Issues</p>
            <p className="text-3xl font-bold text-white">3</p>
            <p className="text-xs text-slate-400 mt-2">
              Metrics trending down. Need immediate action.
            </p>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-4">
            <p className="text-green-300 font-semibold text-sm mb-2">✅ Positive Trends</p>
            <p className="text-3xl font-bold text-white">2</p>
            <p className="text-xs text-slate-400 mt-2">
              AOV and ROAS increasing. Bundle strategy working.
            </p>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-4">
            <p className="text-blue-300 font-semibold text-sm mb-2">🎯 Opportunities</p>
            <p className="text-3xl font-bold text-white">4</p>
            <p className="text-xs text-slate-400 mt-2">
              High-leverage actions that could 3x growth.
            </p>
          </div>
        </div>
      </div>

      {/* Alerts (Trending Down, Anomalies) */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">⚡ Alerts & Anomalies</h2>
        <div className="space-y-3">
          {alerts.map((alert, idx) => (
            <AlertCard key={idx} {...alert} />
          ))}
        </div>
      </div>

      {/* Key Opportunities */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-amber-400" />
          Highest ROI Opportunities
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {keyOpportunities.map((opp, idx) => (
            <OpportunityCard key={idx} {...opp} />
          ))}
        </div>
      </div>

      {/* Action Items This Week */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <Clock className="w-6 h-6 text-blue-400" />
          Action Items This Week
        </h2>
        <div className="space-y-3">
          {actionItems.map((item, idx) => (
            <ActionItemCard key={idx} {...item} />
          ))}
        </div>
      </div>

      {/* Smart Recommendations */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <Star className="w-6 h-6 text-purple-400" />
          AI-Powered Recommendations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SmartRecommendation
            title="Email Nurture Sequence"
            description="Build a 5-email automated sequence targeting existing customers. Expected to increase repeat rate from 3% to 8% in 90 days."
            impact="High"
            complexity="Low"
            timeframe="2 weeks"
          />
          <SmartRecommendation
            title="Product Bundling Strategy"
            description="Create 3-4 strategic bundles (e.g., Golf+Work combo). Increase bundle attach rate from 25% to 35%+."
            impact="High"
            complexity="Medium"
            timeframe="1 week"
          />
          <SmartRecommendation
            title="Organic Channel Focus"
            description="Allocate 60% of marketing budget to organic (currently 42%). Reduce CAC from $12.50 to $8 goal."
            impact="Medium"
            complexity="Medium"
            timeframe="Ongoing"
          />
          <SmartRecommendation
            title="Geographic Expansion"
            description="Launch targeted campaigns for Canada (7.5% of market). Potential $2,000/month additional revenue."
            impact="Medium"
            complexity="High"
            timeframe="4 weeks"
          />
        </div>
      </div>

      {/* Data Insights */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
        <h3 className="text-lg font-bold text-white mb-4">📊 Deep Insights</h3>
        <div className="space-y-4">
          <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4">
            <p className="text-amber-300 font-semibold mb-2">Golf Pouch Dominance</p>
            <p className="text-sm text-slate-300">
              Golf products represent <strong>64% of revenue</strong> (2,954 of 4,597). This is excellent product-market fit. Focus on scaling this with golf influencer partnerships.
            </p>
          </div>

          <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4">
            <p className="text-red-300 font-semibold mb-2">Conversion Rate Gap</p>
            <p className="text-sm text-slate-300">
              Current <strong>2.8%</strong> vs target <strong>4.5%</strong> = <strong>60% gap</strong>. Small improvements in checkout flow (reduce friction, add trust signals) could recover this.
            </p>
          </div>

          <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4">
            <p className="text-blue-300 font-semibold mb-2">Direct Traffic Concentration</p>
            <p className="text-sm text-slate-300">
              <strong>92.5% of sales from Direct</strong> channel. This is a single-point-of-failure risk. Urgent: diversify to Amazon, Shopify Partners, affiliates.
            </p>
          </div>

          <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4">
            <p className="text-green-300 font-semibold mb-2">AOV is Trending Up</p>
            <p className="text-sm text-slate-300">
              AOV increasing week-over-week ($40 → $43.37). Bundle strategy is working. This is the highest-ROI metric to optimize.
            </p>
          </div>
        </div>
      </div>

      {/* Next Review */}
      <div className="bg-gradient-to-br from-amber-600/20 to-amber-900/20 border border-amber-500/30 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-white text-lg mb-2">Next Review: February 14</h3>
            <p className="text-amber-100/80 text-sm">
              These insights will be refreshed on Friday. Focus on implementing the 3 P1 opportunities above for maximum impact.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
