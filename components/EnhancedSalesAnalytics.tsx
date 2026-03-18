"use client";

import React, { useState } from "react";
import {
  LineChart, Line, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart,
} from "recharts";
import { TrendingUp, MapPin } from "lucide-react";
import {
  coreMetrics, aovTrendData, repeatCustomerTrend, bundleAttachTrend, clvEstimate, productPerformanceDetail, geographicBreakdown, trafficSourceBreakdown, salesByChannel,
} from "@/lib/demoData";

const tt = {
  backgroundColor: 'rgba(15, 23, 42, 0.9)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '12px',
  color: 'white',
};

const KPICard = ({ title, value, subtitle, metric, goal, status }: {
  title: string; value: string | number; subtitle?: string; metric?: number; goal?: number; status?: "on_track" | "at_risk" | "warning";
}) => {
  const statusStyles = {
    on_track: "border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]",
    at_risk: "border-amber-500/30 shadow-[0_0_20px_rgba(251,191,36,0.1)]",
    warning: "border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.1)]",
  };
  const progressPercent = goal ? (metric! / goal) * 100 : 0;

  return (
    <div className={`bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-2xl p-5 border ${status ? statusStyles[status] : "border-white/10"} transition-all duration-300 hover:bg-white/[0.08]`}>
      <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">{title}</p>
      <p className="text-3xl font-mono font-bold text-white mb-2">{value}</p>
      {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      {goal && metric !== undefined && (
        <div className="mt-3 space-y-1">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Progress to goal</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div className={`h-2 rounded-full transition-all ${status === "on_track" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : status === "warning" ? "bg-red-500" : "bg-amber-500"}`} style={{ width: `${Math.min(progressPercent, 100)}%` }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default function EnhancedSalesAnalytics() {
  const [dateRange, setDateRange] = useState("30d");

  return (
    <div className="space-y-8">
      {/* Date Range */}
      <div className="flex gap-2">
        {["7d", "14d", "30d", "90d"].map((range) => (
          <button key={range} onClick={() => setDateRange(range)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${dateRange === range
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
              : "bg-white/5 border border-white/10 text-gray-400 hover:text-emerald-400 hover:bg-white/10"}`}>
            {range === "7d" ? "7 Days" : range === "14d" ? "14 Days" : range === "30d" ? "30 Days" : "90 Days"}
          </button>
        ))}
      </div>

      {/* KPIs */}
      <div>
        <h2 className="text-2xl font-sans font-bold text-white mb-4 tracking-tight">Sales Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard title="Total Orders" value={coreMetrics.totalOrders} subtitle="All time" status="on_track" />
          <KPICard title="Average Order Value" value={`$${coreMetrics.aov.toFixed(2)}`} subtitle="Increasing trend" metric={coreMetrics.aov} goal={50} status="on_track" />
          <KPICard title="Repeat Rate" value={`${coreMetrics.repeatCustomerRate}%`} subtitle={`Goal: ${coreMetrics.repeatCustomerGoal}%`} metric={coreMetrics.repeatCustomerRate} goal={coreMetrics.repeatCustomerGoal} status="warning" />
          <KPICard title="Bundle Attach" value={`${coreMetrics.bundleAttachRate}%`} subtitle={`Goal: ${coreMetrics.bundleAttachGoal}%`} metric={coreMetrics.bundleAttachRate} goal={coreMetrics.bundleAttachGoal} status="at_risk" />
        </div>
      </div>

      {/* AOV Trend */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
        <h3 className="text-lg font-sans font-bold text-white mb-2">Average Order Value Trend</h3>
        <p className="text-xs text-gray-400 mb-4">7-day, 14-day, and 30-day moving averages (in $)</p>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={aovTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="day" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" domain={[38, 46]} />
            <Tooltip contentStyle={tt} labelStyle={{ color: 'white' }} formatter={(value) => `$${value}`} />
            <Legend />
            <Line type="monotone" dataKey="ma7" stroke="#10B981" strokeWidth={3} name="7-Day MA" dot={false} />
            <Line type="monotone" dataKey="ma14" stroke="#FBBF24" strokeWidth={2} name="14-Day MA" dot={false} />
            <Line type="monotone" dataKey="ma30" stroke="#A78BFA" strokeWidth={2} name="30-Day MA" dot={false} />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 p-4 bg-white/5 rounded-xl border-l-4 border-emerald-500">
          <p className="text-sm text-gray-400">📈 <strong className="text-emerald-400">Positive Trend:</strong> AOV increasing week-over-week. Bundle strategy contributing to higher values.</p>
        </div>
      </div>

      {/* Repeat & Bundle */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
          <h3 className="text-lg font-sans font-bold text-white mb-2">Repeat Customer Rate</h3>
          <p className="text-xs text-gray-400 mb-4">Current: 3% → Goal: 10%</p>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={repeatCustomerTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={tt} labelStyle={{ color: 'white' }} formatter={(value) => `${value}%`} />
              <Bar dataKey="rate" fill="#10B981" radius={[8, 8, 0, 0]} />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="mt-4 text-xs text-gray-400">💡 Stagnating at 3%. <strong className="text-amber-400">Action:</strong> Launch email nurture sequence, loyalty program.</div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
          <h3 className="text-lg font-sans font-bold text-white mb-2">Bundle Attach Rate</h3>
          <p className="text-xs text-gray-400 mb-4">Current: 25% → Goal: 35%+</p>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={bundleAttachTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={tt} labelStyle={{ color: 'white' }} formatter={(value) => `${value}%`} />
              <Bar dataKey="rate" fill="#FBBF24" radius={[8, 8, 0, 0]} />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="mt-4 text-xs text-gray-400">📦 Slow growth. <strong className="text-amber-400">Action:</strong> A/B test checkout upsells, bundle messaging.</div>
        </div>
      </div>

      {/* CLV */}
      <div className="bg-gradient-to-br from-purple-500/10 to-white/5 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 shadow-2xl">
        <h3 className="text-lg font-sans font-bold text-white mb-4">Customer Lifetime Value (CLV)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Baseline CLV:</span>
                <span className="text-2xl font-mono font-bold text-amber-400">${clvEstimate.estimatedClv.toFixed(0)}</span>
              </div>
              <div className="bg-white/5 rounded-xl p-4 space-y-2 text-sm border border-white/10">
                <div className="flex justify-between"><span className="text-gray-500">Repeat Rate:</span><span className="text-white">{(clvEstimate.baselineRepeatRate * 100).toFixed(1)}%</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Avg Order Value:</span><span className="text-white">${clvEstimate.avgOrderValue.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Orders/Year:</span><span className="text-white">{clvEstimate.avgOrdersPerYear}</span></div>
                <div className="flex justify-between pt-2 border-t border-white/10"><span className="text-gray-500">Gross Margin:</span><span className="text-white">{(clvEstimate.grossMargin * 100).toFixed(0)}%</span></div>
              </div>
            </div>
          </div>
          <div>
            <p className="text-gray-400 mb-4">If repeat rate reaches <strong className="text-amber-400">10%</strong> (goal):</p>
            <div className="bg-white/5 rounded-xl p-4 space-y-3 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                  <TrendingUp className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Potential CLV</p>
                  <p className="text-xl font-mono font-bold text-emerald-400">$1,880+</p>
                </div>
              </div>
              <p className="text-xs text-gray-400">That's a <strong className="text-amber-400">235% increase</strong> in customer lifetime value.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Performance */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
        <h3 className="text-lg font-sans font-bold text-white mb-4">Product Performance Scorecard</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {productPerformanceDetail.map((product, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-3 hover:border-emerald-500/20 transition-all duration-300">
              <h4 className="font-sans font-semibold text-white text-lg">{product.name}</h4>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-sm text-gray-500">Revenue</span><span className="text-sm font-bold text-white">${(product.revenue ?? 0).toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-sm text-gray-500">Units Sold</span><span className="text-sm font-bold text-white">{product.units ?? 0}</span></div>
                <div className="flex justify-between"><span className="text-sm text-gray-500">Avg Price</span><span className="text-sm font-bold text-white">${((product.revenue ?? 0) / (product.units ?? 1)).toFixed(2)}</span></div>
              </div>
              <div className="border-t border-white/10 pt-3">
                <div className="flex justify-between mb-2"><span className="text-sm text-gray-500">Conversion Rate</span><span className="text-sm font-bold text-amber-400">{product.conversionRate}%</span></div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="h-2 rounded-full bg-amber-400" style={{ width: `${(product.conversionRate / 5) * 100}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Geographic & Source */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
          <h3 className="text-lg font-sans font-bold text-white mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-400" />Geographic Breakdown
          </h3>
          <div className="space-y-3">
            {geographicBreakdown.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-white">{item.region}</span>
                    <span className="text-xs text-gray-400">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400" style={{ width: `${item.percentage}%` }} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">${item.revenue?.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/20">
            <p className="text-xs text-emerald-400">🌍 90% US-based. Opportunity: Expand to Canada, Europe.</p>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
          <h3 className="text-lg font-sans font-bold text-white mb-4">Traffic Source Performance</h3>
          <div className="space-y-3">
            {trafficSourceBreakdown.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-white">{item.source}</span>
                    <span className="text-xs text-gray-400">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-400" style={{ width: `${item.percentage}%` }} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">${item.revenue?.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-purple-500/5 rounded-xl border border-purple-500/20">
            <p className="text-xs text-purple-400">💡 Organic (42%) has best ROI. Scale this channel.</p>
          </div>
        </div>
      </div>

      {/* Sales Channel */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
        <h3 className="text-lg font-sans font-bold text-white mb-4">Sales Channel Distribution</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={salesByChannel} cx="50%" cy="50%" labelLine={false} label={(entry) => entry.name} outerRadius={70} fill="#8884d8" dataKey="value">
                  {salesByChannel.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? "#10B981" : index === 1 ? "#FBBF24" : "#A78BFA"} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tt} formatter={(value) => `${value} orders`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="lg:col-span-2 space-y-4">
            {salesByChannel.map((channel, idx) => (
              <div key={idx} className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full shadow-lg" style={{ backgroundColor: idx === 0 ? "#10B981" : idx === 1 ? "#FBBF24" : "#A78BFA" }} />
                    <span className="font-semibold text-white">{channel.name}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-400">{channel.value} orders</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="h-2 rounded-full transition-all" style={{ width: `${channel.percentage}%`, backgroundColor: idx === 0 ? "#10B981" : idx === 1 ? "#FBBF24" : "#A78BFA" }} />
                </div>
                <p className="text-xs text-gray-500 mt-1">{channel.percentage}% of sales</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
