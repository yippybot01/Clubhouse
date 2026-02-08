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
import {
  TrendingUp,
  MapPin,
} from "lucide-react";
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

const KPICard = ({
  title,
  value,
  subtitle,
  metric,
  goal,
  status,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  metric?: number;
  goal?: number;
  status?: "on_track" | "at_risk" | "warning";
}) => {
  const statusStyles = {
    on_track: "border-green-500/30 bg-green-600/10",
    at_risk: "border-amber-500/30 bg-amber-600/10",
    warning: "border-red-500/30 bg-red-600/10",
  };

  const progressPercent = goal ? (metric! / goal) * 100 : 0;

  return (
    <div
      className={`rounded-xl p-5 border backdrop-blur-sm ${
        status ? statusStyles[status] : "border-slate-700/50 bg-slate-800/40"
      }`}
    >
      <p className="text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
        {title}
      </p>
      <p className="text-3xl font-bold text-white mb-2">{value}</p>
      {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      {goal && metric !== undefined && (
        <div className="mt-3 space-y-1">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Progress to goal</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full bg-slate-700/50 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                status === "on_track"
                  ? "bg-green-500"
                  : status === "warning"
                  ? "bg-red-500"
                  : "bg-amber-500"
              }`}
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            ></div>
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
      {/* Date Range Selector */}
      <div className="flex gap-2">
        {["7d", "14d", "30d", "90d"].map((range) => (
          <button
            key={range}
            onClick={() => setDateRange(range)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              dateRange === range
                ? "bg-amber-600 text-white shadow-lg shadow-amber-500/40"
                : "bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:border-amber-500/30"
            }`}
          >
            {range === "7d"
              ? "7 Days"
              : range === "14d"
              ? "14 Days"
              : range === "30d"
              ? "30 Days"
              : "90 Days"}
          </button>
        ))}
      </div>

      {/* Primary Sales KPIs */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Sales Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Total Orders"
            value={coreMetrics.totalOrders}
            subtitle="All time"
            status="on_track"
          />
          <KPICard
            title="Average Order Value"
            value={`$${coreMetrics.aov.toFixed(2)}`}
            subtitle="Increasing trend"
            metric={coreMetrics.aov}
            goal={50}
            status="on_track"
          />
          <KPICard
            title="Repeat Rate"
            value={`${coreMetrics.repeatCustomerRate}%`}
            subtitle={`Goal: ${coreMetrics.repeatCustomerGoal}%`}
            metric={coreMetrics.repeatCustomerRate}
            goal={coreMetrics.repeatCustomerGoal}
            status="warning"
          />
          <KPICard
            title="Bundle Attach"
            value={`${coreMetrics.bundleAttachRate}%`}
            subtitle={`Goal: ${coreMetrics.bundleAttachGoal}%`}
            metric={coreMetrics.bundleAttachRate}
            goal={coreMetrics.bundleAttachGoal}
            status="at_risk"
          />
        </div>
      </div>

      {/* AOV Trend Analysis */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm hover:border-slate-600/50 transition-colors">
        <h3 className="text-lg font-bold text-white mb-2">Average Order Value Trend</h3>
        <p className="text-xs text-slate-400 mb-4">
          7-day, 14-day, and 30-day moving averages (in $)
        </p>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={aovTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="day" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" domain={[38, 46]} />
            <Tooltip
              contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
              labelStyle={{ color: "#fff" }}
              formatter={(value) => `$${value}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="ma7"
              stroke="#10b981"
              strokeWidth={2}
              name="7-Day MA"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="ma14"
              stroke="#f59e0b"
              strokeWidth={2}
              name="14-Day MA"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="ma30"
              stroke="#8b5cf6"
              strokeWidth={2}
              name="30-Day MA"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 p-4 bg-slate-700/30 rounded-lg border-l-4 border-green-500">
          <p className="text-sm text-slate-300">
            📈 <strong>Positive Trend:</strong> AOV increasing week-over-week. Bundle
            strategy contributing to higher values.
          </p>
        </div>
      </div>

      {/* Repeat Customer & Bundle Attach Rates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Repeat Customer Rate Trend */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm hover:border-slate-600/50 transition-colors">
          <h3 className="text-lg font-bold text-white mb-2">Repeat Customer Rate</h3>
          <p className="text-xs text-slate-400 mb-4">Current: 3% → Goal: 10%</p>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={repeatCustomerTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                labelStyle={{ color: "#fff" }}
                formatter={(value) => `${value}%`}
              />
              <Bar dataKey="rate" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="mt-4 text-xs text-slate-300">
            💡 Stagnating at 3%. <strong>Action:</strong> Launch email nurture sequence,
            loyalty program.
          </div>
        </div>

        {/* Bundle Attach Rate Trend */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm hover:border-slate-600/50 transition-colors">
          <h3 className="text-lg font-bold text-white mb-2">Bundle Attach Rate</h3>
          <p className="text-xs text-slate-400 mb-4">Current: 25% → Goal: 35%+</p>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={bundleAttachTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                labelStyle={{ color: "#fff" }}
                formatter={(value) => `${value}%`}
              />
              <Bar dataKey="rate" fill="#f59e0b" radius={[8, 8, 0, 0]} />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="mt-4 text-xs text-slate-300">
            📦 Slow growth. <strong>Action:</strong> A/B test checkout upsells, bundle
            messaging.
          </div>
        </div>
      </div>

      {/* Customer Lifetime Value */}
      <div className="bg-gradient-to-br from-purple-600/20 to-purple-900/20 border border-purple-500/30 rounded-xl p-6 backdrop-blur-sm">
        <h3 className="text-lg font-bold text-white mb-4">Customer Lifetime Value (CLV)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Baseline CLV:</span>
                <span className="text-2xl font-bold text-purple-300">
                  ${clvEstimate.estimatedClv.toFixed(0)}
                </span>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Repeat Rate:</span>
                  <span className="text-white">{(clvEstimate.baselineRepeatRate * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Avg Order Value:</span>
                  <span className="text-white">${clvEstimate.avgOrderValue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Orders/Year:</span>
                  <span className="text-white">{clvEstimate.avgOrdersPerYear}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-600">
                  <span className="text-slate-400">Gross Margin:</span>
                  <span className="text-white">{(clvEstimate.grossMargin * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="text-slate-300 mb-4">
              If repeat rate reaches <strong>10%</strong> (goal):
            </p>
            <div className="bg-slate-700/30 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Potential CLV</p>
                  <p className="text-xl font-bold text-green-300">$1,880+</p>
                </div>
              </div>
              <p className="text-xs text-slate-400">
                That's a <strong>235% increase</strong> in customer lifetime value. Each
                customer becomes worth 3.3x more.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Performance Scorecard */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm hover:border-slate-600/50 transition-colors">
        <h3 className="text-lg font-bold text-white mb-4">Product Performance Scorecard</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {productPerformanceDetail.map((product, idx) => (
            <div
              key={idx}
              className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-5 space-y-3"
            >
              <h4 className="font-semibold text-white text-lg">{product.name}</h4>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-400">Revenue</span>
                  <span className="text-sm font-bold text-white">
                    ${(product.revenue ?? 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-400">Units Sold</span>
                  <span className="text-sm font-bold text-white">{product.units ?? 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-400">Avg Price</span>
                  <span className="text-sm font-bold text-white">
                    ${((product.revenue ?? 0) / (product.units ?? 1)).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-600 pt-3">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-slate-400">Conversion Rate</span>
                  <span className="text-sm font-bold text-amber-300">
                    {product.conversionRate}%
                  </span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-amber-500"
                    style={{
                      width: `${(product.conversionRate / 5) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Geographic & Source Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Geographic Breakdown */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm hover:border-slate-600/50 transition-colors">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-400" />
            Geographic Breakdown
          </h3>
          <div className="space-y-3">
            {geographicBreakdown.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-white">
                      {item.region}
                    </span>
                    <span className="text-xs text-slate-400">
                      {item.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    ${item.revenue?.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-blue-600/20 rounded-lg border border-blue-500/30">
            <p className="text-xs text-blue-300">
              🌍 90% US-based. Opportunity: Expand to Canada, Europe.
            </p>
          </div>
        </div>

        {/* Traffic Source Breakdown */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm hover:border-slate-600/50 transition-colors">
          <h3 className="text-lg font-bold text-white mb-4">Traffic Source Performance</h3>
          <div className="space-y-3">
            {trafficSourceBreakdown.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-white">
                      {item.source}
                    </span>
                    <span className="text-xs text-slate-400">
                      {item.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-400"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    ${item.revenue?.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-purple-600/20 rounded-lg border border-purple-500/30">
            <p className="text-xs text-purple-300">
              💡 Organic (42%) has best ROI. Scale this channel.
            </p>
          </div>
        </div>
      </div>

      {/* Sales Channel Distribution */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm hover:border-slate-600/50 transition-colors">
        <h3 className="text-lg font-bold text-white mb-4">Sales Channel Distribution</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={salesByChannel}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => entry.name}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {salesByChannel.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} orders`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="lg:col-span-2 space-y-4">
            {salesByChannel.map((channel, idx) => (
              <div
                key={idx}
                className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: channel.color }}
                    ></div>
                    <span className="font-semibold text-white">{channel.name}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-300">
                    {channel.value} orders
                  </span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${channel.percentage}%`,
                      backgroundColor: channel.color,
                    }}
                  ></div>
                </div>
                <p className="text-xs text-slate-400 mt-1">{channel.percentage}% of sales</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
