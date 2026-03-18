"use client";

import React, { useState } from "react";
import {
  LineChart,
  Line,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";
import { TrendingUp, MapPin } from "lucide-react";
import {
  coreMetrics,
  aovTrendData,
  repeatCustomerTrend,
  bundleAttachTrend,
  clvEstimate,
  productPerformanceDetail,
  geographicBreakdown,
  trafficSourceBreakdown,
  salesByChannel,
} from "@/lib/demoData";

const tt = { backgroundColor: "#FFFFFF", border: "1px solid #D4AF37", borderRadius: "8px" };

const KPICard = ({ title, value, subtitle, metric, goal, status }: {
  title: string; value: string | number; subtitle?: string; metric?: number; goal?: number; status?: "on_track" | "at_risk" | "warning";
}) => {
  const statusStyles = {
    on_track: "border-emerald-300 bg-emerald-600/10",
    at_risk: "border-club-gold/30 bg-club-gold/5",
    warning: "border-club-burgundy/30 bg-club-burgundy/5",
  };
  const progressPercent = goal ? (metric! / goal) * 100 : 0;

  return (
    <div className={`rounded-xl p-5 border shadow-sm ${status ? statusStyles[status] : "border-club-gold/30 bg-white"}`}>
      <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">{title}</p>
      <p className="text-3xl font-serif font-bold text-club-navy mb-2">{value}</p>
      {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
      {goal && metric !== undefined && (
        <div className="mt-3 space-y-1">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Progress to goal</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className={`h-2 rounded-full transition-all ${status === "on_track" ? "bg-emerald-500" : status === "warning" ? "bg-club-burgundy" : "bg-club-gold"}`} style={{ width: `${Math.min(progressPercent, 100)}%` }} />
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
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${dateRange === range
              ? "bg-club-green text-club-navy border border-club-gold/30 shadow-lg shadow-lg"
              : "bg-white border border-club-gold/25 text-gray-400 hover:border-club-gold/25"}`}>
            {range === "7d" ? "7 Days" : range === "14d" ? "14 Days" : range === "30d" ? "30 Days" : "90 Days"}
          </button>
        ))}
      </div>

      {/* KPIs */}
      <div>
        <h2 className="text-2xl font-serif font-bold text-club-navy mb-4">Sales Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard title="Total Orders" value={coreMetrics.totalOrders} subtitle="All time" status="on_track" />
          <KPICard title="Average Order Value" value={`$${coreMetrics.aov.toFixed(2)}`} subtitle="Increasing trend" metric={coreMetrics.aov} goal={50} status="on_track" />
          <KPICard title="Repeat Rate" value={`${coreMetrics.repeatCustomerRate}%`} subtitle={`Goal: ${coreMetrics.repeatCustomerGoal}%`} metric={coreMetrics.repeatCustomerRate} goal={coreMetrics.repeatCustomerGoal} status="warning" />
          <KPICard title="Bundle Attach" value={`${coreMetrics.bundleAttachRate}%`} subtitle={`Goal: ${coreMetrics.bundleAttachGoal}%`} metric={coreMetrics.bundleAttachRate} goal={coreMetrics.bundleAttachGoal} status="at_risk" />
        </div>
      </div>

      {/* AOV Trend */}
      <div className="bg-white border border-club-gold/30 rounded-xl p-6 shadow-sm hover:border-club-gold/25 transition-colors">
        <h3 className="text-lg font-serif font-bold text-club-navy mb-2">Average Order Value Trend</h3>
        <p className="text-xs text-gray-400 mb-4">7-day, 14-day, and 30-day moving averages (in $)</p>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={aovTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.1)" />
            <XAxis dataKey="day" stroke="#D4AF37" opacity={0.5} />
            <YAxis stroke="#D4AF37" opacity={0.5} domain={[38, 46]} />
            <Tooltip contentStyle={tt} labelStyle={{ color: "#0A1628" }} formatter={(value) => `$${value}`} />
            <Legend />
            <Line type="monotone" dataKey="ma7" stroke="#2D6A4F" strokeWidth={2} name="7-Day MA" dot={false} />
            <Line type="monotone" dataKey="ma14" stroke="#D4AF37" strokeWidth={2} name="14-Day MA" dot={false} />
            <Line type="monotone" dataKey="ma30" stroke="#6A1B38" strokeWidth={2} name="30-Day MA" dot={false} />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 p-4 bg-club-cream-dark/50 rounded-lg border-l-4 border-emerald-500">
          <p className="text-sm text-gray-500">📈 <strong className="text-club-gold">Positive Trend:</strong> AOV increasing week-over-week. Bundle strategy contributing to higher values.</p>
        </div>
      </div>

      {/* Repeat & Bundle Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-club-gold/30 rounded-xl p-6 shadow-sm hover:border-club-gold/25 transition-colors">
          <h3 className="text-lg font-serif font-bold text-club-navy mb-2">Repeat Customer Rate</h3>
          <p className="text-xs text-gray-400 mb-4">Current: 3% → Goal: 10%</p>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={repeatCustomerTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.1)" />
              <XAxis dataKey="month" stroke="#D4AF37" opacity={0.5} />
              <YAxis stroke="#D4AF37" opacity={0.5} />
              <Tooltip contentStyle={tt} labelStyle={{ color: "#0A1628" }} formatter={(value) => `${value}%`} />
              <Bar dataKey="rate" fill="#1B4332" stroke="#D4AF37" strokeWidth={0.5} radius={[8, 8, 0, 0]} />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="mt-4 text-xs text-gray-400">💡 Stagnating at 3%. <strong className="text-club-gold">Action:</strong> Launch email nurture sequence, loyalty program.</div>
        </div>

        <div className="bg-white border border-club-gold/30 rounded-xl p-6 shadow-sm hover:border-club-gold/25 transition-colors">
          <h3 className="text-lg font-serif font-bold text-club-navy mb-2">Bundle Attach Rate</h3>
          <p className="text-xs text-gray-400 mb-4">Current: 25% → Goal: 35%+</p>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={bundleAttachTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.1)" />
              <XAxis dataKey="month" stroke="#D4AF37" opacity={0.5} />
              <YAxis stroke="#D4AF37" opacity={0.5} />
              <Tooltip contentStyle={tt} labelStyle={{ color: "#0A1628" }} formatter={(value) => `${value}%`} />
              <Bar dataKey="rate" fill="#D4AF37" radius={[8, 8, 0, 0]} />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="mt-4 text-xs text-gray-400">📦 Slow growth. <strong className="text-club-gold">Action:</strong> A/B test checkout upsells, bundle messaging.</div>
        </div>
      </div>

      {/* CLV */}
      <div className="bg-gradient-to-br from-club-burgundy/5 to-club-cream border border-club-burgundy/20 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-serif font-bold text-club-navy mb-4">Customer Lifetime Value (CLV)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Baseline CLV:</span>
                <span className="text-2xl font-serif font-bold text-club-gold">${clvEstimate.estimatedClv.toFixed(0)}</span>
              </div>
              <div className="bg-club-cream-dark/50 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-400">Repeat Rate:</span><span className="text-club-navy">{(clvEstimate.baselineRepeatRate * 100).toFixed(1)}%</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Avg Order Value:</span><span className="text-club-navy">${clvEstimate.avgOrderValue.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Orders/Year:</span><span className="text-club-navy">{clvEstimate.avgOrdersPerYear}</span></div>
                <div className="flex justify-between pt-2 border-t border-club-gold/25"><span className="text-gray-400">Gross Margin:</span><span className="text-club-navy">{(clvEstimate.grossMargin * 100).toFixed(0)}%</span></div>
              </div>
            </div>
          </div>
          <div>
            <p className="text-gray-500 mb-4">If repeat rate reaches <strong className="text-club-gold">10%</strong> (goal):</p>
            <div className="bg-club-cream-dark/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-emerald-500/20 border border-emerald-300 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Potential CLV</p>
                  <p className="text-xl font-serif font-bold text-emerald-600">$1,880+</p>
                </div>
              </div>
              <p className="text-xs text-gray-400">That's a <strong className="text-club-gold">235% increase</strong> in customer lifetime value. Each customer becomes worth 3.3x more.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Performance */}
      <div className="bg-white border border-club-gold/30 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-serif font-bold text-club-navy mb-4">Product Performance Scorecard</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {productPerformanceDetail.map((product, idx) => (
            <div key={idx} className="bg-club-cream border border-club-gold/25 rounded-lg p-5 space-y-3 hover:border-club-gold/25 transition-colors">
              <h4 className="font-serif font-semibold text-club-navy text-lg">{product.name}</h4>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-sm text-gray-400">Revenue</span><span className="text-sm font-bold text-club-navy">${(product.revenue ?? 0).toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-sm text-gray-400">Units Sold</span><span className="text-sm font-bold text-club-navy">{product.units ?? 0}</span></div>
                <div className="flex justify-between"><span className="text-sm text-gray-400">Avg Price</span><span className="text-sm font-bold text-club-navy">${((product.revenue ?? 0) / (product.units ?? 1)).toFixed(2)}</span></div>
              </div>
              <div className="border-t border-club-gold/25 pt-3">
                <div className="flex justify-between mb-2"><span className="text-sm text-gray-400">Conversion Rate</span><span className="text-sm font-bold text-club-gold">{product.conversionRate}%</span></div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="h-2 rounded-full bg-club-gold" style={{ width: `${(product.conversionRate / 5) * 100}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Geographic & Source */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-club-gold/30 rounded-xl p-6 shadow-sm hover:border-club-gold/25 transition-colors">
          <h3 className="text-lg font-serif font-bold text-club-navy mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-club-forest-light" />
            Geographic Breakdown
          </h3>
          <div className="space-y-3">
            {geographicBreakdown.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-club-navy">{item.region}</span>
                    <span className="text-xs text-gray-400">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="h-2 rounded-full bg-gradient-to-r from-club-forest to-club-forest-light" style={{ width: `${item.percentage}%` }} />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">${item.revenue?.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-club-green/5 rounded-lg border border-club-forest-light/30">
            <p className="text-xs text-emerald-600">🌍 90% US-based. Opportunity: Expand to Canada, Europe.</p>
          </div>
        </div>

        <div className="bg-white border border-club-gold/30 rounded-xl p-6 shadow-sm hover:border-club-gold/25 transition-colors">
          <h3 className="text-lg font-serif font-bold text-club-navy mb-4">Traffic Source Performance</h3>
          <div className="space-y-3">
            {trafficSourceBreakdown.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-club-navy">{item.source}</span>
                    <span className="text-xs text-gray-400">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="h-2 rounded-full bg-gradient-to-r from-club-burgundy to-club-burgundy-light" style={{ width: `${item.percentage}%` }} />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">${item.revenue?.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-club-burgundy/5 rounded-lg border border-club-burgundy/30">
            <p className="text-xs text-club-burgundy-light">💡 Organic (42%) has best ROI. Scale this channel.</p>
          </div>
        </div>
      </div>

      {/* Sales Channel */}
      <div className="bg-white border border-club-gold/30 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-serif font-bold text-club-navy mb-4">Sales Channel Distribution</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={salesByChannel} cx="50%" cy="50%" labelLine={false} label={(entry) => entry.name} outerRadius={70} fill="#8884d8" dataKey="value">
                  {salesByChannel.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? "#1B4332" : index === 1 ? "#D4AF37" : "#6A1B38"} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} orders`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="lg:col-span-2 space-y-4">
            {salesByChannel.map((channel, idx) => (
              <div key={idx} className="bg-club-cream-dark/50 rounded-lg p-4 border border-club-gold/25">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: idx === 0 ? "#1B4332" : idx === 1 ? "#D4AF37" : "#6A1B38" }} />
                    <span className="font-semibold text-club-navy">{channel.name}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-500">{channel.value} orders</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="h-2 rounded-full transition-all" style={{ width: `${channel.percentage}%`, backgroundColor: idx === 0 ? "#1B4332" : idx === 1 ? "#D4AF37" : "#6A1B38" }} />
                </div>
                <p className="text-xs text-gray-400 mt-1">{channel.percentage}% of sales</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
