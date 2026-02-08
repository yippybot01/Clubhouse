"use client";

import React from "react";
import {
  BarChart,
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
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  ShoppingCart,
  Target,
  AlertCircle,
  Zap,
} from "lucide-react";
import {
  coreMetrics,
  revenueForecastData,
  revenue30DayForecast,
  productPerformance,
  customerSegmentation,
  topProductsData,
} from "@/lib/demoData";

const MetricCard = ({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  icon: Icon,
  color = "blue",
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: number;
  icon: React.ComponentType<any>;
  color?: string;
}) => {
  const colorClasses: Record<string, string> = {
    blue: "from-blue-600/20 to-blue-900/20 border-blue-500/30",
    purple: "from-purple-600/20 to-purple-900/20 border-purple-500/30",
    green: "from-green-600/20 to-green-900/20 border-green-500/30",
    amber: "from-amber-600/20 to-amber-900/20 border-amber-500/30",
    cyan: "from-cyan-600/20 to-cyan-900/20 border-cyan-500/30",
  };

  const iconColors: Record<string, string> = {
    blue: "text-blue-400",
    purple: "text-purple-400",
    green: "text-green-400",
    amber: "text-amber-400",
    cyan: "text-cyan-400",
  };

  return (
    <div
      className={`relative overflow-hidden rounded-xl p-6 bg-gradient-to-br ${colorClasses[color]} border card-hover cursor-default transition-all duration-300 hover:shadow-lg`}
    >
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <p className={`text-sm font-semibold mb-1 ${iconColors[color].replace("text-", "text-")}`}>
              {title}
            </p>
            <p className="text-3xl font-bold text-white">{value}</p>
            {subtitle && (
              <p className="text-xs text-slate-400 mt-2">{subtitle}</p>
            )}
          </div>
          <Icon className={`w-6 h-6 ${iconColors[color]}`} />
        </div>

        {trend && trendValue !== undefined && (
          <div className="flex items-center gap-1">
            {trend === "up" ? (
              <TrendingUp className="w-4 h-4 text-green-400" />
            ) : trend === "down" ? (
              <TrendingDown className="w-4 h-4 text-red-400" />
            ) : null}
            <span
              className={`text-xs font-semibold ${
                trend === "up"
                  ? "text-green-400"
                  : trend === "down"
                  ? "text-red-400"
                  : "text-slate-400"
              }`}
            >
              {trend === "up" ? "+" : ""}{trendValue}%
            </span>
          </div>
        )}
      </div>

      {/* Decorative gradient orb */}
      <div className={`absolute top-0 right-0 w-32 h-32 ${colorClasses[color].split(" ")[0]} rounded-full mix-blend-multiply filter blur-3xl opacity-20 -mr-16 -mt-16`}></div>
    </div>
  );
};

export default function EnhancedDashboard() {
  return (
    <div className="space-y-8">
      {/* Primary KPIs */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Key Performance Indicators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Revenue"
            value={`$${coreMetrics.totalRevenue.toLocaleString()}`}
            subtitle="All time"
            icon={DollarSign}
            color="green"
            trend="up"
            trendValue={32}
          />
          <MetricCard
            title="Conversion Rate"
            value={`${coreMetrics.conversionRate}%`}
            subtitle={`Goal: ${coreMetrics.conversionGoal}%`}
            icon={Target}
            color="purple"
            trend="down"
            trendValue={12}
          />
          <MetricCard
            title="Customer Acquisition Cost"
            value={`$${coreMetrics.cac.toFixed(2)}`}
            subtitle={`Goal: $${coreMetrics.cacGoal.toFixed(2)}`}
            icon={Users}
            color="blue"
            trend="neutral"
          />
          <MetricCard
            title="Return on Ad Spend"
            value={`${coreMetrics.roas}x`}
            subtitle={`Goal: ${coreMetrics.roasGoal}x`}
            icon={Zap}
            color="amber"
            trend="up"
            trendValue={8}
          />
        </div>
      </div>

      {/* Secondary KPIs */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Customer Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            title="Average Order Value"
            value={`$${coreMetrics.aov.toFixed(2)}`}
            subtitle={`${coreMetrics.totalOrders} total orders`}
            icon={ShoppingCart}
            color="cyan"
          />
          <MetricCard
            title="Repeat Customer Rate"
            value={`${coreMetrics.repeatCustomerRate}%`}
            subtitle={`Goal: ${coreMetrics.repeatCustomerGoal}%`}
            icon={Users}
            color="green"
            trend="up"
            trendValue={7}
          />
          <MetricCard
            title="Bundle Attach Rate"
            value={`${coreMetrics.bundleAttachRate}%`}
            subtitle={`Goal: ${coreMetrics.bundleAttachGoal}%`}
            icon={Zap}
            color="amber"
          />
        </div>
      </div>

      {/* Charts Row 1: Revenue Forecast + Customer Segmentation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 7-Day Revenue Forecast */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm hover:border-slate-600/50 transition-colors">
          <h3 className="text-lg font-bold text-white mb-2">7-Day Revenue Forecast</h3>
          <p className="text-xs text-slate-400 mb-4">Actual vs Projected (in $)</p>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueForecastData}>
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="day" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px" }}
                labelStyle={{ color: "#fff" }}
                formatter={(value) => `$${value}`}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="actual"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorActual)"
              />
              <Area
                type="monotone"
                dataKey="forecast"
                stroke="#f59e0b"
                fillOpacity={1}
                fill="url(#colorForecast)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Customer Segmentation */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm hover:border-slate-600/50 transition-colors">
          <h3 className="text-lg font-bold text-white mb-2">Customer Segmentation</h3>
          <p className="text-xs text-slate-400 mb-4">Repeat vs First-Time Customers</p>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={customerSegmentation}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {customerSegmentation.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                formatter={(value) => `${value} customers`}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2 text-xs">
            <p className="text-slate-300">
              💡 <strong>Opportunity:</strong> Only 3% repeat customers.
              Implementing a loyalty program could 3x this rate.
            </p>
          </div>
        </div>
      </div>

      {/* Charts Row 2: Top Products + 30-Day Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products Performance */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm hover:border-slate-600/50 transition-colors">
          <h3 className="text-lg font-bold text-white mb-2">Top Products</h3>
          <p className="text-xs text-slate-400 mb-4">Revenue by Product</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={topProductsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                labelStyle={{ color: "#fff" }}
                formatter={(value) => `$${value}`}
              />
              <Bar dataKey="revenue" radius={[8, 8, 0, 0]} fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 30-Day Revenue Projection */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm hover:border-slate-600/50 transition-colors">
          <h3 className="text-lg font-bold text-white mb-2">30-Day Revenue Projection</h3>
          <p className="text-xs text-slate-400 mb-4">Weekly Forecast (in $)</p>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenue30DayForecast}>
              <defs>
                <linearGradient id="colorProjection" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="week" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                labelStyle={{ color: "#fff" }}
                formatter={(value) => `$${value}`}
              />
              <Area
                type="monotone"
                dataKey="forecast"
                stroke="#8b5cf6"
                fillOpacity={1}
                fill="url(#colorProjection)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Product Performance Scorecard */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm hover:border-slate-600/50 transition-colors">
        <h3 className="text-lg font-bold text-white mb-4">Product Performance Scorecard</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {productPerformance.map((product, idx) => (
            <div
              key={idx}
              className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-white text-sm">{product.name}</h4>
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: product.color }}
                ></div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Revenue:</span>
                  <span className="text-white font-semibold">
                    ${product.revenue.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Units Sold:</span>
                  <span className="text-white font-semibold">{product.units}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">% of Total:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-slate-600 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${product.percentage}%`,
                          backgroundColor: product.color,
                        }}
                      ></div>
                    </div>
                    <span className="text-white font-semibold text-xs">
                      {product.percentage}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights & Recommendations */}
      <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-400" />
          Quick Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-slate-700/30 rounded-lg p-4 border-l-4 border-green-500">
            <p className="text-green-300 font-semibold mb-1">✅ Golf dominates</p>
            <p className="text-slate-300">
              64% of revenue from Golf product. Clear product-market fit.
            </p>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-4 border-l-4 border-red-500">
            <p className="text-red-300 font-semibold mb-1">⚠️ Low repeat rate</p>
            <p className="text-slate-300">
              3% repeat rate vs 10% goal. Need retention strategy.
            </p>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-4 border-l-4 border-blue-500">
            <p className="text-blue-300 font-semibold mb-1">📈 Conversion gap</p>
            <p className="text-slate-300">
              2.8% actual vs 4.5% target. Optimize checkout flow.
            </p>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-4 border-l-4 border-purple-500">
            <p className="text-purple-300 font-semibold mb-1">💰 CAC too high</p>
            <p className="text-slate-300">
              $12.50 actual vs $8 goal. Focus on organic channels.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
