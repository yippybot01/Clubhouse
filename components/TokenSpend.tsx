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
  ResponsiveContainer,
} from "recharts";
import { AlertCircle, TrendingUp, Zap, DollarSign, AlertTriangle } from "lucide-react";
import { getRealSpendData, getOperationBreakdown, getModelInsights } from "@/lib/realSpendData";

export default function TokenSpend() {
  // Get real spend data
  const spendData = getRealSpendData();
  const operationBreakdown = getOperationBreakdown();
  const modelInsights = getModelInsights();

  // Daily spend
  const todaySpend = spendData.dailySpend[spendData.dailySpend.length - 1]?.amount || 0;
  const dailyLimit = 5.0;
  const remainingToday = dailyLimit - todaySpend;
  const todayPercentage = (todaySpend / dailyLimit) * 100;

  // Monthly/Total Spend Tracking
  const monthlySpend = spendData.totalSpend;
  const monthlyBudget = 200.0; // Operation budget for tracking purposes
  const remainingMonth = monthlyBudget - monthlySpend;
  const monthlyPercentage = (monthlySpend / monthlyBudget) * 100;

  // Credit Balance (REAL ACCOUNT BALANCE as of Feb 8, 2026)
  const creditBalance = 33.96; // Your actual Anthropic account balance
  const budgetPercentageOfBalance = (monthlyBudget / creditBalance) * 100;

  // Efficiency metrics
  const avgCostPerDay = spendData.avgDailySpend.toFixed(4);
  const projectedMonthlySpend = spendData.monthlyProjection.toFixed(2);
  
  // Model breakdown pie data
  const modelSpendData = [
    { name: `Haiku ($${spendData.spendByModel.haiku.cost.toFixed(3)})`, value: spendData.spendByModel.haiku.cost, color: "#3b82f6" },
    { name: `Opus ($${spendData.spendByModel.opus.cost.toFixed(3)})`, value: spendData.spendByModel.opus.cost, color: "#8b5cf6" },
  ];

  const StatCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    color = "blue",
  }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ComponentType<any>;
    color?: string;
  }) => {
    const colorClasses: Record<string, string> = {
      blue: "from-blue-600/20 to-blue-900/20 border-blue-500/30",
      green: "from-green-600/20 to-green-900/20 border-green-500/30",
      amber: "from-amber-600/20 to-amber-900/20 border-amber-500/30",
      purple: "from-purple-600/20 to-purple-900/20 border-purple-500/30",
    };

    const iconColors: Record<string, string> = {
      blue: "text-blue-400",
      green: "text-green-400",
      amber: "text-amber-400",
      purple: "text-purple-400",
    };

    return (
      <div
        className={`rounded-xl p-6 bg-gradient-to-br ${colorClasses[color]} border transition-all duration-300`}
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="text-slate-400 text-sm mb-2">{title}</p>
            <p className="text-3xl font-bold text-white">{value}</p>
            {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
          </div>
          <Icon className={`w-8 h-8 ${iconColors[color]}`} />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Feb Spend to Date"
          value={`$${monthlySpend.toFixed(3)}`}
          subtitle={`vs $${monthlyBudget} monthly target`}
          icon={DollarSign}
          color="blue"
        />
        <StatCard
          title="Credit Balance"
          value={`$${creditBalance.toFixed(2)}`}
          subtitle={`Anthropic account balance`}
          icon={AlertCircle}
          color="green"
        />
        <StatCard
          title="Avg Daily Spend"
          value={`$${avgCostPerDay}`}
          subtitle={`Projected: $${projectedMonthlySpend}/month`}
          icon={TrendingUp}
          color="amber"
        />
        <StatCard
          title="Remaining"
          value={`$${remainingMonth.toFixed(2)}`}
          subtitle={`${(100 - monthlyPercentage).toFixed(2)}% of budget`}
          icon={Zap}
          color="purple"
        />
      </div>

      {/* Month Progress */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Monthly Spend vs Budget ($200 Target)</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-slate-400">${monthlySpend.toFixed(3)} of $200</span>
              <span className="text-sm text-green-400 font-semibold">{monthlyPercentage.toFixed(2)}%</span>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-600 to-green-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(monthlyPercentage, 100)}%` }}
              ></div>
            </div>
          </div>
          <div className="bg-slate-700/20 rounded-lg p-3">
            <p className="text-xs text-slate-400">
              <span className="text-green-400 font-semibold">✓ Excellent pace</span> — 8 days in, only ${monthlySpend.toFixed(2)} spent. On track for ~${projectedMonthlySpend} total.
            </p>
          </div>
        </div>
      </div>

      {/* Model Spend Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spend by Model */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Spend by Model</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={modelSpendData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name }) => name}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {modelSpendData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${(value as number).toFixed(3)}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Daily Spend Trend */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Daily Spend Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={spendData.dailySpend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 12 }} />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                labelStyle={{ color: "#fff" }}
                formatter={(value) => `$${(value as number).toFixed(3)}`}
              />
              <Bar dataKey="amount" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Model Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Haiku Details */}
        <div className="bg-slate-800/40 border border-blue-500/30 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Haiku (claude-haiku-4-5)</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-400">Input Tokens</span>
              <span className="text-blue-300 font-semibold">{modelInsights.haiku.inputTokens.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Output Tokens</span>
              <span className="text-blue-300 font-semibold">{modelInsights.haiku.outputTokens.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t border-slate-700/30 pt-3">
              <span className="text-slate-400">Total Cost</span>
              <span className="text-blue-300 font-bold text-lg">${modelInsights.haiku.totalCost.toFixed(3)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">% of Total</span>
              <span className="text-blue-300 font-semibold">{modelInsights.haiku.percentOfSpend}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Cost per Call</span>
              <span className="text-blue-300 font-semibold">${modelInsights.haiku.costPerCall}</span>
            </div>
          </div>
        </div>

        {/* Opus Details */}
        <div className="bg-slate-800/40 border border-purple-500/30 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Opus (claude-opus-4-6)</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-400">Input Tokens</span>
              <span className="text-purple-300 font-semibold">{modelInsights.opus.inputTokens.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Output Tokens</span>
              <span className="text-purple-300 font-semibold">{modelInsights.opus.outputTokens.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t border-slate-700/30 pt-3">
              <span className="text-slate-400">Total Cost</span>
              <span className="text-purple-300 font-bold text-lg">${modelInsights.opus.totalCost.toFixed(3)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">% of Total</span>
              <span className="text-purple-300 font-semibold">{modelInsights.opus.percentOfSpend}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Cost per Call</span>
              <span className="text-purple-300 font-semibold">${modelInsights.opus.costPerCall}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cost per Operation Table */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Cost by Operation</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left text-slate-400 py-3 px-4">Operation</th>
                <th className="text-left text-slate-400 py-3 px-4">Model</th>
                <th className="text-right text-slate-400 py-3 px-4">Cost</th>
                <th className="text-right text-slate-400 py-3 px-4">Calls</th>
                <th className="text-right text-slate-400 py-3 px-4">% of Total</th>
              </tr>
            </thead>
            <tbody>
              {operationBreakdown.map((row, idx) => (
                <tr key={idx} className="border-b border-slate-700/20 hover:bg-slate-700/10 transition-colors">
                  <td className="py-3 px-4 text-white font-medium">{row.operation}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded ${row.model === "haiku" ? "bg-blue-900/30 text-blue-300" : "bg-purple-900/30 text-purple-300"}`}>
                      {row.model}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-amber-400 font-semibold">${row.cost.toFixed(4)}</td>
                  <td className="py-3 px-4 text-right text-slate-400">{row.calls}</td>
                  <td className="py-3 px-4 text-right text-slate-400">
                    {((row.cost / monthlySpend) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          Efficiency Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-slate-700/30 rounded-lg p-4">
            <p className="text-blue-300 font-semibold mb-2">💡 Model Split</p>
            <p className="text-slate-300">
              Haiku: {modelInsights.haiku.percentOfSpend}% ($${modelInsights.haiku.totalCost.toFixed(3)}) | Opus: {modelInsights.opus.percentOfSpend}% ($${modelInsights.opus.totalCost.toFixed(3)})
            </p>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-4">
            <p className="text-green-300 font-semibold mb-2">📈 Account Runway</p>
            <p className="text-slate-300">
              At $${avgCostPerDay}/day average, your <strong>$33.96 balance</strong> supports <strong>~{Math.floor(creditBalance / parseFloat(avgCostPerDay))} days</strong> of operations.
            </p>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-4">
            <p className="text-amber-300 font-semibold mb-2">🎯 Monthly Projection</p>
            <p className="text-slate-300">
              Feb pace: ~${projectedMonthlySpend}. Budget tracked: $200 (you have headroom).
            </p>
          </div>
        </div>
      </div>

      {/* Clarification Section */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-3">📊 How to Read This Dashboard</h3>
        <div className="space-y-2 text-sm text-slate-300">
          <p>
            <strong>Credit Balance ($33.96):</strong> Your actual Anthropic API account balance. This is real money/credits that can be spent.
          </p>
          <p>
            <strong>Monthly Budget ($200):</strong> Your target monthly spend for tracking. You're on pace to spend ~${projectedMonthlySpend} in Feb (well under budget).
          </p>
          <p>
            <strong>Total Spend ($0.80):</strong> Actual spend across all operations Feb 1-8. Broken down by model (Haiku vs Opus).
          </p>
          <p>
            <strong>Runway:</strong> At $${avgCostPerDay}/day, your $33.96 balance lasts ~{Math.floor(creditBalance / parseFloat(avgCostPerDay))} days before needing a top-up.
          </p>
        </div>
      </div>

      {/* Alerts */}
      {creditBalance < 50 && (
        <div className="bg-amber-900/20 border border-amber-600/30 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-300 font-semibold">Low Credit Balance</p>
            <p className="text-amber-200/80 text-sm mt-1">
              Your account balance is $33.96. At current spend ($${avgCostPerDay}/day), you have ~{Math.floor(creditBalance / parseFloat(avgCostPerDay))} days of runway. Consider topping up if scaling operations.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
