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
  color = "green",
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
    green: "from-club-forest/30 to-club-forest-dark/30 border-club-forest-light/40",
    burgundy: "from-club-burgundy/5 to-club-burgundy-dark/20 border-club-burgundy/30",
    gold: "from-club-gold/5 to-club-gold-dark/10 border-club-gold/30",
    navy: "from-club-navy-mid/40 to-club-navy/40 border-blue-500/20",
  };

  const iconColors: Record<string, string> = {
    green: "text-emerald-600",
    burgundy: "text-club-burgundy-light",
    gold: "text-club-gold",
    navy: "text-blue-600",
  };

  return (
    <div
      className={`relative overflow-hidden rounded-xl p-6 bg-gradient-to-br ${colorClasses[color]} border shadow-lg shadow-md transition-all duration-300 hover:shadow-xl hover:shadow-md hover:border-club-gold/30`}
    >
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <p className={`text-xs font-semibold mb-1 uppercase tracking-wider ${iconColors[color]}`}>
              {title}
            </p>
            <p className="text-3xl font-serif font-bold text-club-navy">{value}</p>
            {subtitle && (
              <p className="text-xs text-gray-400 mt-2">{subtitle}</p>
            )}
          </div>
          <div className="p-2 bg-club-cream-dark/50 rounded-lg border border-club-gold/25">
            <Icon className={`w-5 h-5 ${iconColors[color]}`} />
          </div>
        </div>

        {trend && trendValue !== undefined && (
          <div className="flex items-center gap-1 mt-2">
            {trend === "up" ? (
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            ) : trend === "down" ? (
              <TrendingDown className="w-4 h-4 text-red-500" />
            ) : null}
            <span
              className={`text-xs font-semibold ${
                trend === "up"
                  ? "text-emerald-600"
                  : trend === "down"
                  ? "text-red-500"
                  : "text-gray-400"
              }`}
            >
              {trend === "up" ? "+" : ""}{trendValue}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const chartTooltipStyle = {
  backgroundColor: "#FFFFFF",
  border: "1px solid #D4AF37",
  borderRadius: "8px",
};

export default function EnhancedDashboard() {
  return (
    <div className="space-y-8">
      {/* Primary KPIs */}
      <div>
        <h2 className="text-2xl font-serif font-bold text-club-navy mb-4">Key Performance Indicators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Total Revenue" value={`$${coreMetrics.totalRevenue.toLocaleString()}`} subtitle="All time" icon={DollarSign} color="green" trend="up" trendValue={32} />
          <MetricCard title="Conversion Rate" value={`${coreMetrics.conversionRate}%`} subtitle={`Goal: ${coreMetrics.conversionGoal}%`} icon={Target} color="burgundy" trend="down" trendValue={12} />
          <MetricCard title="Customer Acquisition Cost" value={`$${coreMetrics.cac.toFixed(2)}`} subtitle={`Goal: $${coreMetrics.cacGoal.toFixed(2)}`} icon={Users} color="navy" trend="neutral" />
          <MetricCard title="Return on Ad Spend" value={`${coreMetrics.roas}x`} subtitle={`Goal: ${coreMetrics.roasGoal}x`} icon={Zap} color="gold" trend="up" trendValue={8} />
        </div>
      </div>

      {/* Secondary KPIs */}
      <div>
        <h2 className="text-lg font-serif font-semibold text-club-navy mb-4">Customer Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard title="Average Order Value" value={`$${coreMetrics.aov.toFixed(2)}`} subtitle={`${coreMetrics.totalOrders} total orders`} icon={ShoppingCart} color="navy" />
          <MetricCard title="Repeat Customer Rate" value={`${coreMetrics.repeatCustomerRate}%`} subtitle={`Goal: ${coreMetrics.repeatCustomerGoal}%`} icon={Users} color="green" trend="up" trendValue={7} />
          <MetricCard title="Bundle Attach Rate" value={`${coreMetrics.bundleAttachRate}%`} subtitle={`Goal: ${coreMetrics.bundleAttachGoal}%`} icon={Zap} color="gold" />
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-club-gold/30 rounded-xl p-6 shadow-sm hover:border-club-gold/25 transition-colors">
          <h3 className="text-lg font-serif font-bold text-club-navy mb-2">7-Day Revenue Forecast</h3>
          <p className="text-xs text-gray-400 mb-4">Actual vs Projected (in $)</p>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueForecastData}>
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1B4332" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#1B4332" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.1)" />
              <XAxis dataKey="day" stroke="#D4AF37" opacity={0.5} />
              <YAxis stroke="#D4AF37" opacity={0.5} />
              <Tooltip contentStyle={chartTooltipStyle} labelStyle={{ color: "#0A1628" }} formatter={(value) => `$${value}`} />
              <Legend />
              <Area type="monotone" dataKey="actual" stroke="#2D6A4F" strokeWidth={2} fillOpacity={1} fill="url(#colorActual)" />
              <Area type="monotone" dataKey="forecast" stroke="#D4AF37" strokeWidth={2} fillOpacity={1} fill="url(#colorForecast)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-club-gold/30 rounded-xl p-6 shadow-sm hover:border-club-gold/25 transition-colors">
          <h3 className="text-lg font-serif font-bold text-club-navy mb-2">Customer Segmentation</h3>
          <p className="text-xs text-gray-400 mb-4">Repeat vs First-Time Customers</p>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={customerSegmentation} cx="50%" cy="50%" labelLine={false} label={(entry) => `${entry.name}: ${entry.percentage}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                {customerSegmentation.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? "#1B4332" : "#6A1B38"} />
                ))}
              </Pie>
              <Tooltip contentStyle={chartTooltipStyle} formatter={(value) => `${value} customers`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2 text-xs">
            <p className="text-gray-500">
              💡 <strong className="text-club-gold">Opportunity:</strong> Only 3% repeat customers. Implementing a loyalty program could 3x this rate.
            </p>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-club-gold/30 rounded-xl p-6 shadow-sm hover:border-club-gold/25 transition-colors">
          <h3 className="text-lg font-serif font-bold text-club-navy mb-2">Top Products</h3>
          <p className="text-xs text-gray-400 mb-4">Revenue by Product</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={topProductsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.1)" />
              <XAxis dataKey="name" stroke="#D4AF37" opacity={0.5} />
              <YAxis stroke="#D4AF37" opacity={0.5} />
              <Tooltip contentStyle={chartTooltipStyle} labelStyle={{ color: "#0A1628" }} formatter={(value) => `$${value}`} />
              <Bar dataKey="revenue" radius={[8, 8, 0, 0]} fill="#1B4332" stroke="#D4AF37" strokeWidth={1} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-club-gold/30 rounded-xl p-6 shadow-sm hover:border-club-gold/25 transition-colors">
          <h3 className="text-lg font-serif font-bold text-club-navy mb-2">30-Day Revenue Projection</h3>
          <p className="text-xs text-gray-400 mb-4">Weekly Forecast (in $)</p>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenue30DayForecast}>
              <defs>
                <linearGradient id="colorProjection" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6A1B38" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#6A1B38" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.1)" />
              <XAxis dataKey="week" stroke="#D4AF37" opacity={0.5} />
              <YAxis stroke="#D4AF37" opacity={0.5} />
              <Tooltip contentStyle={chartTooltipStyle} labelStyle={{ color: "#0A1628" }} formatter={(value) => `$${value}`} />
              <Area type="monotone" dataKey="forecast" stroke="#6A1B38" strokeWidth={2} fillOpacity={1} fill="url(#colorProjection)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Product Performance Scorecard */}
      <div className="bg-white border border-club-gold/30 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-serif font-bold text-club-navy mb-4">Product Performance Scorecard</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {productPerformance.map((product, idx) => (
            <div key={idx} className="bg-club-cream border border-club-gold/25 rounded-lg p-4 hover:border-club-gold/25 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-serif font-semibold text-club-navy text-sm">{product.name}</h4>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: product.color }} />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Revenue:</span>
                  <span className="text-club-navy font-semibold">${product.revenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Units Sold:</span>
                  <span className="text-club-navy font-semibold">{product.units}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">% of Total:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div className="h-2 rounded-full bg-club-gold" style={{ width: `${product.percentage}%` }} />
                    </div>
                    <span className="text-club-navy font-semibold text-xs">{product.percentage}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-br from-club-green/5 to-club-cream border border-club-gold/30 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-serif font-bold text-club-navy mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-club-gold" />
          Quick Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-club-cream-dark/50 rounded-lg p-4 border-l-4 border-emerald-500">
            <p className="text-emerald-600 font-semibold mb-1">✅ Golf dominates</p>
            <p className="text-gray-500">64% of revenue from Golf product. Clear product-market fit.</p>
          </div>
          <div className="bg-club-cream-dark/50 rounded-lg p-4 border-l-4 border-club-burgundy">
            <p className="text-red-600 font-semibold mb-1">⚠️ Low repeat rate</p>
            <p className="text-gray-500">3% repeat rate vs 10% goal. Need retention strategy.</p>
          </div>
          <div className="bg-club-cream-dark/50 rounded-lg p-4 border-l-4 border-blue-500">
            <p className="text-blue-600 font-semibold mb-1">📈 Conversion gap</p>
            <p className="text-gray-500">2.8% actual vs 4.5% target. Optimize checkout flow.</p>
          </div>
          <div className="bg-club-cream-dark/50 rounded-lg p-4 border-l-4 border-club-gold">
            <p className="text-club-gold font-semibold mb-1">💰 CAC too high</p>
            <p className="text-gray-500">$12.50 actual vs $8 goal. Focus on organic channels.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
