"use client";

import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function SalesAnalytics() {
  // Revenue by product
  const revenueData = [
    { name: "Golf (FTC)", value: 2954, label: "Golf 64%" },
    { name: "Work (FTD)", value: 600, label: "Work 13%" },
    { name: "Bundles", value: 1044, label: "Bundles 23%" }
  ];

  // Units by product
  const unitsData = [
    { name: "Golf", units: 390 },
    { name: "Work", units: 90 },
    { name: "Bundles", units: 160 }
  ];

  // Growth trend (weekly)
  const growthData = [
    { week: "Dec 12-18", orders: 3, revenue: 105 },
    { week: "Jan 10-16", orders: 20, revenue: 730 },
    { week: "Jan 17-23", orders: 18, revenue: 745 },
    { week: "Jan 24-30", orders: 17, revenue: 706 },
    { week: "Jan 31-Feb 6", orders: 48, revenue: 2079 }
  ];

  // Channel breakdown
  const channelData = [
    { name: "Direct", value: 98, label: "Direct 92.5%" },
    { name: "Shop", value: 7, label: "Shop 6.6%" },
    { name: "Other", value: 1, label: "Other 0.9%" }
  ];

  // Product colors: Golf (dark green), Work (blue), Bundle (gold)
  const COLORS = ["#1f7c2f", "#3b82f6", "#f59e0b"];
  const CHANNEL_COLORS = ["#10b981", "#8b5cf6", "#ef4444"];

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 text-center">
          <p className="text-slate-400 text-sm mb-2">Total Revenue</p>
          <p className="text-3xl font-bold text-white">$4,597</p>
          <p className="text-xs text-slate-500 mt-1">57 days</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 text-center">
          <p className="text-slate-400 text-sm mb-2">Average Order Value</p>
          <p className="text-3xl font-bold text-white">$43.37</p>
          <p className="text-xs text-slate-500 mt-1">106 orders</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 text-center">
          <p className="text-slate-400 text-sm mb-2">Units Sold</p>
          <p className="text-3xl font-bold text-white">640</p>
          <p className="text-xs text-amber-400 mt-1">+185% MoM</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 text-center">
          <p className="text-slate-400 text-sm mb-2">Repeat Rate</p>
          <p className="text-3xl font-bold text-white">3%</p>
          <p className="text-xs text-red-400 mt-1">Goal: 10%+</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Product */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Revenue by Product</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={revenueData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ label }) => label}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {revenueData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Units Sold */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Units Sold by Product</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={unitsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                labelStyle={{ color: "#fff" }}
              />
              <Bar dataKey="units" radius={[8, 8, 0, 0]}>
                {unitsData.map((entry, index) => (
                  <Cell 
                    key={`bar-${index}`} 
                    fill={entry.name === "Golf" ? "#1f7c2f" : entry.name === "Work" ? "#3b82f6" : "#f59e0b"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Growth Trend */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 lg:col-span-2">
          <h3 className="text-lg font-bold text-white mb-4">Weekly Growth Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="week" stroke="#94a3b8" />
              <YAxis yAxisId="left" stroke="#94a3b8" />
              <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                labelStyle={{ color: "#fff" }}
              />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981" }} />
              <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2} dot={{ fill: "#f59e0b" }} />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xs text-slate-400 mt-2">📈 Exponential growth: Week 5 (48 orders) vs Week 4 (20 orders) = 2.4x increase</p>
        </div>

        {/* Sales Channel */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 lg:col-span-2">
          <h3 className="text-lg font-bold text-white mb-4">Sales by Channel</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={channelData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ label }) => label}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {channelData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={CHANNEL_COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-xs text-amber-400 mt-4">💡 Direct traffic dominates. Opportunity: expand channel diversity to reduce single-channel risk.</p>
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-slate-700/30 rounded-lg p-4">
            <p className="text-green-300 font-semibold mb-2">🏌️ Golf Dominates</p>
            <p className="text-slate-300">60% of units, 64% of revenue. Clear product-market fit.</p>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-4">
            <p className="text-blue-300 font-semibold mb-2">💼 Work (Desk)</p>
            <p className="text-slate-300">14% of units, 13% revenue. Growth opportunity - reposition for desk workers.</p>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-4">
            <p className="text-amber-300 font-semibold mb-2">📦 Bundles</p>
            <p className="text-slate-300">25% of units, 23% revenue. Higher AOV ($65 avg). Key upsell driver.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
