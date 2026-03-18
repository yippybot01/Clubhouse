"use client";

import React from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area,
} from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, Target, AlertCircle, Zap } from "lucide-react";
import { coreMetrics, revenueForecastData, revenue30DayForecast, productPerformance, customerSegmentation, topProductsData } from "@/lib/demoData";

const MetricCard = ({ title, value, subtitle, trend, trendValue, icon: Icon, color = "emerald" }: {
  title: string; value: string | number; subtitle?: string; trend?: "up" | "down" | "neutral"; trendValue?: number; icon: React.ComponentType<any>; color?: string;
}) => {
  const borderColors: Record<string, string> = {
    emerald: "border-emerald-500/20 hover:border-emerald-500/40",
    amber: "border-amber-500/20 hover:border-amber-500/40",
    sky: "border-sky-500/20 hover:border-sky-500/40",
    purple: "border-purple-500/20 hover:border-purple-500/40",
  };
  const accentColors: Record<string, string> = { emerald: "text-emerald-400", amber: "text-amber-400", sky: "text-sky-400", purple: "text-purple-400" };

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border ${borderColors[color]} rounded-2xl p-6 shadow-2xl transition-all duration-500 hover:shadow-[0_8px_32px_rgba(16,185,129,0.2)] group`}>
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <p className={`text-xs font-semibold mb-1 uppercase tracking-wider ${accentColors[color]}`}>{title}</p>
            <p className="text-3xl font-mono font-bold text-white">{value}</p>
            {subtitle && <p className="text-xs text-gray-400 mt-2">{subtitle}</p>}
          </div>
          <div className="p-2 bg-white/5 rounded-xl border border-white/10 group-hover:scale-110 transition-transform">
            <Icon className={`w-5 h-5 ${accentColors[color]}`} />
          </div>
        </div>
        {trend && trendValue !== undefined && (
          <div className="flex items-center gap-1 mt-2">
            {trend === "up" ? <TrendingUp className="w-4 h-4 text-emerald-400" /> : trend === "down" ? <TrendingDown className="w-4 h-4 text-red-400" /> : null}
            <span className={`text-xs font-semibold ${trend === "up" ? "text-emerald-400" : trend === "down" ? "text-red-400" : "text-gray-400"}`}>
              {trend === "up" ? "+" : ""}{trendValue}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const darkTooltip = {
  backgroundColor: 'rgba(15, 23, 42, 0.9)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '12px',
  color: 'white',
};

export default function EnhancedDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-sans font-bold text-white mb-4 tracking-tight">Key Performance Indicators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Total Revenue" value={`$${coreMetrics.totalRevenue.toLocaleString()}`} subtitle="All time" icon={DollarSign} color="emerald" trend="up" trendValue={32} />
          <MetricCard title="Conversion Rate" value={`${coreMetrics.conversionRate}%`} subtitle={`Goal: ${coreMetrics.conversionGoal}%`} icon={Target} color="amber" trend="down" trendValue={12} />
          <MetricCard title="Customer Acquisition Cost" value={`$${coreMetrics.cac.toFixed(2)}`} subtitle={`Goal: $${coreMetrics.cacGoal.toFixed(2)}`} icon={Users} color="sky" trend="neutral" />
          <MetricCard title="Return on Ad Spend" value={`${coreMetrics.roas}x`} subtitle={`Goal: ${coreMetrics.roasGoal}x`} icon={Zap} color="purple" trend="up" trendValue={8} />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-sans font-semibold text-white mb-4">Customer Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard title="Average Order Value" value={`$${coreMetrics.aov.toFixed(2)}`} subtitle={`${coreMetrics.totalOrders} total orders`} icon={ShoppingCart} color="sky" />
          <MetricCard title="Repeat Customer Rate" value={`${coreMetrics.repeatCustomerRate}%`} subtitle={`Goal: ${coreMetrics.repeatCustomerGoal}%`} icon={Users} color="emerald" trend="up" trendValue={7} />
          <MetricCard title="Bundle Attach Rate" value={`${coreMetrics.bundleAttachRate}%`} subtitle={`Goal: ${coreMetrics.bundleAttachGoal}%`} icon={Zap} color="amber" />
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl hover:bg-white/[0.07] transition-all duration-300">
          <h3 className="text-lg font-sans font-bold text-white mb-2">7-Day Revenue Forecast</h3>
          <p className="text-xs text-gray-400 mb-4">Actual vs Projected (in $)</p>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueForecastData}>
              <defs>
                <linearGradient id="colorActualDark" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorForecastDark" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FBBF24" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FBBF24" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="day" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={darkTooltip} labelStyle={{ color: 'white' }} formatter={(value) => `$${value}`} />
              <Legend />
              <Area type="monotone" dataKey="actual" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorActualDark)" />
              <Area type="monotone" dataKey="forecast" stroke="#FBBF24" strokeWidth={2} fillOpacity={1} fill="url(#colorForecastDark)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl hover:bg-white/[0.07] transition-all duration-300">
          <h3 className="text-lg font-sans font-bold text-white mb-2">Customer Segmentation</h3>
          <p className="text-xs text-gray-400 mb-4">Repeat vs First-Time Customers</p>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={customerSegmentation} cx="50%" cy="50%" labelLine={false} label={(entry) => `${entry.name}: ${entry.percentage}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                {customerSegmentation.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? "#10B981" : "#A78BFA"} />
                ))}
              </Pie>
              <Tooltip contentStyle={darkTooltip} formatter={(value) => `${value} customers`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/10">
            <p className="text-gray-400 text-xs">💡 <strong className="text-amber-400">Opportunity:</strong> Only 3% repeat customers. Implementing a loyalty program could 3x this rate.</p>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl hover:bg-white/[0.07] transition-all duration-300">
          <h3 className="text-lg font-sans font-bold text-white mb-2">Top Products</h3>
          <p className="text-xs text-gray-400 mb-4">Revenue by Product</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={topProductsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={darkTooltip} labelStyle={{ color: 'white' }} formatter={(value) => `$${value}`} />
              <Bar dataKey="revenue" radius={[8, 8, 0, 0]} fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl hover:bg-white/[0.07] transition-all duration-300">
          <h3 className="text-lg font-sans font-bold text-white mb-2">30-Day Revenue Projection</h3>
          <p className="text-xs text-gray-400 mb-4">Weekly Forecast (in $)</p>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenue30DayForecast}>
              <defs>
                <linearGradient id="colorProjectionDark" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A78BFA" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#A78BFA" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="week" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={darkTooltip} labelStyle={{ color: 'white' }} formatter={(value) => `$${value}`} />
              <Area type="monotone" dataKey="forecast" stroke="#A78BFA" strokeWidth={3} fillOpacity={1} fill="url(#colorProjectionDark)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Product Performance */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
        <h3 className="text-lg font-sans font-bold text-white mb-4">Product Performance Scorecard</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {productPerformance.map((product, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/[0.07] hover:border-emerald-500/20 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-sans font-semibold text-white text-sm">{product.name}</h4>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: product.color }} />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Revenue:</span><span className="text-white font-semibold">${product.revenue.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Units Sold:</span><span className="text-white font-semibold">{product.units}</span></div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">% of Total:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-white/10 rounded-full h-2">
                      <div className="h-2 rounded-full bg-emerald-400" style={{ width: `${product.percentage}%` }} />
                    </div>
                    <span className="text-white font-semibold text-xs">{product.percentage}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Insights */}
      <div className="bg-gradient-to-br from-emerald-500/10 to-white/5 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-6 shadow-2xl">
        <h3 className="text-lg font-sans font-bold text-white mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-400" />Quick Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-white/5 rounded-xl p-4 border-l-4 border-emerald-500">
            <p className="text-emerald-400 font-semibold mb-1">✅ Golf dominates</p>
            <p className="text-gray-400">64% of revenue from Golf product. Clear product-market fit.</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border-l-4 border-red-500">
            <p className="text-red-400 font-semibold mb-1">⚠️ Low repeat rate</p>
            <p className="text-gray-400">3% repeat rate vs 10% goal. Need retention strategy.</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border-l-4 border-sky-500">
            <p className="text-sky-400 font-semibold mb-1">📈 Conversion gap</p>
            <p className="text-gray-400">2.8% actual vs 4.5% target. Optimize checkout flow.</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border-l-4 border-amber-500">
            <p className="text-amber-400 font-semibold mb-1">💰 CAC too high</p>
            <p className="text-gray-400">$12.50 actual vs $8 goal. Focus on organic channels.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
