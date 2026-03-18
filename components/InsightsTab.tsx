"use client";

import React from "react";
import { Lightbulb, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Clock, AlertCircle, Star } from "lucide-react";
import { keyOpportunities, actionItems, alerts } from "@/lib/demoData";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const OpportunityCard = ({ opportunity, current, target, impact: _impact, lever, priority, estRevenue }: {
  opportunity: string; current: string; target: string; impact: string; lever: string; priority: number; estRevenue: string;
}) => {
  const priorityColors = {
    1: "bg-club-burgundy/5 border-club-burgundy/30 text-red-600",
    2: "bg-club-gold/15 border-club-gold/30 text-club-gold",
    3: "bg-blue-600/15 border-blue-300 text-blue-600",
    4: "bg-club-offwhite border-club-gold/25 text-gray-400",
  };

  return (
    <div className="bg-white border border-club-gold/30 rounded-xl p-6 hover:border-club-gold/25 transition-colors space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start gap-3 mb-2">
            <div className={`${priorityColors[priority as keyof typeof priorityColors]} rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold flex-shrink-0 border`}>P{priority}</div>
            <h3 className="font-serif font-bold text-club-navy text-lg leading-tight">{opportunity}</h3>
          </div>
          <div className="ml-11 space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-gray-400 text-xs mb-1">Current</p><p className="font-bold text-club-navy">{current}</p></div>
              <div><p className="text-gray-400 text-xs mb-1">Target</p><p className="font-bold text-emerald-600">{target}</p></div>
            </div>
            <div className="bg-club-cream-dark/50 rounded-lg p-3 space-y-2">
              <p className="text-xs text-gray-400"><strong>Action:</strong> {lever}</p>
              <p className="text-xs text-gray-400"><strong>Est. Revenue Impact:</strong> <span className="text-club-gold font-bold">{estRevenue}</span></p>
            </div>
          </div>
        </div>
      </div>
      <button className="w-full px-4 py-2 bg-club-green hover:bg-club-green/90 text-club-gold font-semibold rounded-lg transition-all flex items-center justify-center gap-2 text-sm border border-club-gold/20">
        <Lightbulb className="w-4 h-4" />Implement Strategy
      </button>
    </div>
  );
};

const ActionItemCard = ({ action, owner, dueDate, impact, status, description }: {
  action: string; owner: string; dueDate: string; impact: string; status: string; description: string;
}) => {
  const statusIcons = {
    not_started: <div className="w-5 h-5 rounded-full border-2 border-club-cream/30" />,
    in_progress: <div className="w-5 h-5 rounded-full bg-club-gold/10 border-2 border-club-gold flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-club-gold" /></div>,
    completed: <CheckCircle className="w-5 h-5 text-emerald-500" />,
  };
  const statusColors = {
    not_started: "bg-club-cream-dark/50 border-club-gold/25",
    in_progress: "bg-club-gold/5 border-club-gold/20",
    completed: "bg-emerald-600/10 border-emerald-500/20",
  };

  return (
    <div className={`border rounded-xl p-4 space-y-3 ${statusColors[status as keyof typeof statusColors]}`}>
      <div className="flex items-start gap-3">
        {statusIcons[status as keyof typeof statusIcons]}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-club-navy">{action}</h4>
          <p className="text-xs text-gray-400 mt-1">{description}</p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 text-xs">
          <span className={`px-2 py-1 rounded border ${impact === "High" ? "bg-club-burgundy/5 text-red-600 border-club-burgundy/30" : "bg-club-gold/5 text-club-gold border-club-gold/20"}`}>{impact} Impact</span>
          <span className="text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" />{dueDate}</span>
        </div>
        <span className="text-xs text-gray-400 font-medium">{owner}</span>
      </div>
    </div>
  );
};

const AlertCard = ({ type, metric, current, previous, change, description, actionRequired }: {
  type: string; metric: string; current: number; previous: number; change: number; description: string; actionRequired: boolean;
}) => {
  const typeStyles = { warning: "bg-club-burgundy/5 border-club-burgundy/20 text-red-600", info: "bg-club-green/5 border-club-forest-light/30 text-emerald-600" };
  const typeIcons = { warning: <AlertTriangle className="w-5 h-5" />, info: <Lightbulb className="w-5 h-5" /> };

  return (
    <div className={`border rounded-lg p-4 space-y-3 flex items-start gap-4 ${typeStyles[type as keyof typeof typeStyles]}`}>
      <div className="flex-shrink-0">{typeIcons[type as keyof typeof typeIcons]}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-4 mb-2">
          <h4 className="font-semibold text-club-navy text-sm">{metric}</h4>
          <div className="flex items-center gap-1 text-xs font-bold">
            {change > 0 ? <TrendingUp className="w-4 h-4 text-emerald-600" /> : <TrendingDown className="w-4 h-4 text-red-500" />}
            <span>{change > 0 ? "+" : ""}{change}%</span>
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-2">{description}</p>
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex gap-4"><span>Current: <span className="font-bold">{current}</span></span><span>Previous: <span className="font-bold">{previous}</span></span></div>
          {actionRequired && <span className="px-2 py-1 bg-club-burgundy text-club-navy rounded text-xs font-semibold">Action Required</span>}
        </div>
      </div>
    </div>
  );
};

export default function InsightsTab() {
  return (
    <div className="space-y-8">
      {/* Executive Summary */}
      <div className="bg-gradient-to-br from-club-green/5 to-club-cream border border-club-gold/30 rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-serif font-bold text-club-navy mb-4">Executive Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-club-cream-dark/50 rounded-lg p-4 border border-club-gold/25">
            <p className="text-club-gold font-semibold text-sm mb-2">⚠️ Critical Issues</p>
            <p className="text-3xl font-serif font-bold text-club-navy">3</p>
            <p className="text-xs text-gray-400 mt-2">Metrics trending down. Need immediate action.</p>
          </div>
          <div className="bg-club-cream-dark/50 rounded-lg p-4 border border-club-gold/25">
            <p className="text-emerald-600 font-semibold text-sm mb-2">✅ Positive Trends</p>
            <p className="text-3xl font-serif font-bold text-club-navy">2</p>
            <p className="text-xs text-gray-400 mt-2">AOV and ROAS increasing. Bundle strategy working.</p>
          </div>
          <div className="bg-club-cream-dark/50 rounded-lg p-4 border border-club-gold/25">
            <p className="text-blue-600 font-semibold text-sm mb-2">🎯 Opportunities</p>
            <p className="text-3xl font-serif font-bold text-club-navy">4</p>
            <p className="text-xs text-gray-400 mt-2">High-leverage actions that could 3x growth.</p>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div>
        <h2 className="text-2xl font-serif font-bold text-club-navy mb-4">⚡ Alerts & Anomalies</h2>
        <div className="space-y-3">{alerts.map((alert, idx) => <AlertCard key={idx} {...alert} />)}</div>
      </div>

      {/* Opportunities */}
      <div>
        <h2 className="text-2xl font-serif font-bold text-club-navy mb-4 flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-club-gold" />Highest ROI Opportunities
        </h2>
        <div className="grid grid-cols-1 gap-4">{keyOpportunities.map((opp, idx) => <OpportunityCard key={idx} {...opp} />)}</div>
      </div>

      {/* Action Items */}
      <div>
        <h2 className="text-2xl font-serif font-bold text-club-navy mb-4 flex items-center gap-2">
          <Clock className="w-6 h-6 text-club-gold" />Action Items This Week
        </h2>
        <div className="space-y-3">{actionItems.map((item, idx) => <ActionItemCard key={idx} {...item} />)}</div>
      </div>

      {/* AI Recommendations */}
      <div>
        <h2 className="text-2xl font-serif font-bold text-club-navy mb-4 flex items-center gap-2">
          <Star className="w-6 h-6 text-club-gold" />AI-Powered Recommendations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: "Email Nurture Sequence", description: "Build a 5-email automated sequence targeting existing customers. Expected to increase repeat rate from 3% to 8% in 90 days.", impact: "High", complexity: "Low", timeframe: "2 weeks" },
            { title: "Product Bundling Strategy", description: "Create 3-4 strategic bundles (e.g., Golf+Work combo). Increase bundle attach rate from 25% to 35%+.", impact: "High", complexity: "Medium", timeframe: "1 week" },
            { title: "Organic Channel Focus", description: "Allocate 60% of marketing budget to organic (currently 42%). Reduce CAC from $12.50 to $8 goal.", impact: "Medium", complexity: "Medium", timeframe: "Ongoing" },
            { title: "Geographic Expansion", description: "Launch targeted campaigns for Canada (7.5% of market). Potential $2,000/month additional revenue.", impact: "Medium", complexity: "High", timeframe: "4 weeks" },
          ].map((rec, idx) => (
            <div key={idx} className="bg-gradient-to-br from-club-burgundy/5 to-club-cream border border-club-burgundy/20 rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 text-club-gold flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-serif font-bold text-club-navy mb-1">{rec.title}</h4>
                  <p className="text-sm text-gray-500 mb-3">{rec.description}</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2 py-1 rounded bg-club-burgundy/5 text-club-burgundy-light border border-club-burgundy/20">{rec.impact} Impact</span>
                    <span className="px-2 py-1 rounded bg-club-cream text-gray-400 border border-club-gold/25">{rec.complexity}</span>
                    <span className="px-2 py-1 rounded bg-club-cream text-gray-400 border border-club-gold/25">{rec.timeframe}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deep Insights */}
      <div className="bg-white border border-club-gold/30 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-serif font-bold text-club-navy mb-4">📊 Deep Insights</h3>
        <div className="space-y-4">
          {[
            { color: "border-club-gold", title: "Golf Pouch Dominance", titleColor: "text-club-gold", text: 'Golf products represent <strong>64% of revenue</strong> (2,954 of 4,597). This is excellent product-market fit. Focus on scaling this with golf influencer partnerships.' },
            { color: "border-club-burgundy", title: "Conversion Rate Gap", titleColor: "text-red-600", text: 'Current <strong>2.8%</strong> vs target <strong>4.5%</strong> = <strong>60% gap</strong>. Small improvements in checkout flow (reduce friction, add trust signals) could recover this.' },
            { color: "border-blue-500", title: "Direct Traffic Concentration", titleColor: "text-blue-600", text: '<strong>92.5% of sales from Direct</strong> channel. This is a single-point-of-failure risk. Urgent: diversify to Amazon, Shopify Partners, affiliates.' },
            { color: "border-emerald-500", title: "AOV is Trending Up", titleColor: "text-emerald-600", text: 'AOV increasing week-over-week ($40 → $43.37). Bundle strategy is working. This is the highest-ROI metric to optimize.' },
          ].map((insight, idx) => (
            <div key={idx} className={`bg-club-cream-dark/50 border-l-4 ${insight.color} rounded-lg p-4`}>
              <p className={`${insight.titleColor} font-semibold mb-2`}>{insight.title}</p>
              <p className="text-sm text-gray-500" dangerouslySetInnerHTML={{ __html: insight.text }} />
            </div>
          ))}
        </div>
      </div>

      {/* Next Review */}
      <div className="bg-gradient-to-br from-club-gold/5 to-club-cream border border-club-gold/20 rounded-xl p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-club-gold flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-serif font-bold text-club-navy text-lg mb-2">Next Review: February 14</h3>
            <p className="text-gray-400 text-sm">These insights will be refreshed on Friday. Focus on implementing the 3 P1 opportunities above for maximum impact.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
