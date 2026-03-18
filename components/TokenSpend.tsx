"use client";

import React from "react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { AlertCircle, TrendingUp, Zap, DollarSign, AlertTriangle } from "lucide-react";
import { getRealSpendData, getOperationBreakdown, getModelInsights } from "@/lib/realSpendData";

const tt = {
  backgroundColor: 'rgba(15, 23, 42, 0.9)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '12px',
  color: 'white',
};

export default function TokenSpend() {
  const spendData = getRealSpendData();
  const operationBreakdown = getOperationBreakdown();
  const modelInsights = getModelInsights();
  const monthlySpend = spendData.totalSpend;
  const monthlyBudget = 200.0;
  const remainingMonth = monthlyBudget - monthlySpend;
  const monthlyPercentage = (monthlySpend / monthlyBudget) * 100;
  const creditBalance = 33.96;
  const avgCostPerDay = spendData.avgDailySpend.toFixed(4);
  const projectedMonthlySpend = spendData.monthlyProjection.toFixed(2);

  const modelSpendData = [
    { name: `Haiku ($${spendData.spendByModel.haiku.cost.toFixed(3)})`, value: spendData.spendByModel.haiku.cost, color: "#10B981" },
    { name: `Opus ($${spendData.spendByModel.opus.cost.toFixed(3)})`, value: spendData.spendByModel.opus.cost, color: "#A78BFA" },
  ];

  const StatCard = ({ title, value, subtitle, icon: Icon, color = "emerald" }: {
    title: string; value: string | number; subtitle?: string; icon: React.ComponentType<any>; color?: string;
  }) => {
    const borderColors: Record<string, string> = { emerald: "border-emerald-500/20", amber: "border-amber-500/20", purple: "border-purple-500/20", sky: "border-sky-500/20" };
    const accentColors: Record<string, string> = { emerald: "text-emerald-400", amber: "text-amber-400", purple: "text-purple-400", sky: "text-sky-400" };

    return (
      <div className={`bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-2xl p-6 border ${borderColors[color]} transition-all duration-300 hover:bg-white/[0.08] hover:shadow-[0_8px_32px_rgba(16,185,129,0.15)]`}>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-400 text-sm mb-2">{title}</p>
            <p className="text-3xl font-mono font-bold text-white">{value}</p>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <div className="p-2 bg-white/5 rounded-xl border border-white/10">
            <Icon className={`w-6 h-6 ${accentColors[color]}`} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Feb Spend to Date" value={`$${monthlySpend.toFixed(3)}`} subtitle={`vs $${monthlyBudget} monthly target`} icon={DollarSign} color="emerald" />
        <StatCard title="Credit Balance" value={`$${creditBalance.toFixed(2)}`} subtitle="Anthropic account balance" icon={AlertCircle} color="amber" />
        <StatCard title="Avg Daily Spend" value={`$${avgCostPerDay}`} subtitle={`Projected: $${projectedMonthlySpend}/month`} icon={TrendingUp} color="purple" />
        <StatCard title="Remaining" value={`$${remainingMonth.toFixed(2)}`} subtitle={`${(100 - monthlyPercentage).toFixed(2)}% of budget`} icon={Zap} color="sky" />
      </div>

      {/* Progress */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
        <h3 className="text-lg font-sans font-bold text-white mb-4">Monthly Spend vs Budget ($200 Target)</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-400">${monthlySpend.toFixed(3)} of $200</span>
              <span className="text-sm text-emerald-400 font-semibold">{monthlyPercentage.toFixed(2)}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: `${Math.min(monthlyPercentage, 100)}%` }} />
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <p className="text-xs text-gray-400"><span className="text-emerald-400 font-semibold">✓ Excellent pace</span> — 8 days in, only ${monthlySpend.toFixed(2)} spent. On track for ~${projectedMonthlySpend} total.</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
          <h3 className="text-lg font-sans font-bold text-white mb-4">Spend by Model</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={modelSpendData} cx="50%" cy="50%" labelLine={true} label={({ name }) => name} outerRadius={80} dataKey="value">
                {modelSpendData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(value) => `$${(value as number).toFixed(3)}`} contentStyle={tt} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
          <h3 className="text-lg font-sans font-bold text-white mb-4">Daily Spend Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={spendData.dailySpend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={tt} labelStyle={{ color: 'white' }} formatter={(value) => `$${(value as number).toFixed(3)}`} />
              <Bar dataKey="amount" fill="#10B981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Model Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-6 shadow-2xl">
          <h3 className="text-lg font-sans font-bold text-white mb-4">Haiku (claude-haiku-4-5)</h3>
          <div className="space-y-3">
            <div className="flex justify-between"><span className="text-gray-500">Input Tokens</span><span className="text-emerald-400 font-semibold">{modelInsights.haiku.inputTokens.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Output Tokens</span><span className="text-emerald-400 font-semibold">{modelInsights.haiku.outputTokens.toLocaleString()}</span></div>
            <div className="flex justify-between border-t border-white/10 pt-3"><span className="text-gray-500">Total Cost</span><span className="text-emerald-400 font-bold text-lg">${modelInsights.haiku.totalCost.toFixed(3)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">% of Total</span><span className="text-emerald-400 font-semibold">{modelInsights.haiku.percentOfSpend}%</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Cost per Call</span><span className="text-emerald-400 font-semibold">${modelInsights.haiku.costPerCall}</span></div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 shadow-2xl">
          <h3 className="text-lg font-sans font-bold text-white mb-4">Opus (claude-opus-4-6)</h3>
          <div className="space-y-3">
            <div className="flex justify-between"><span className="text-gray-500">Input Tokens</span><span className="text-purple-400 font-semibold">{modelInsights.opus.inputTokens.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Output Tokens</span><span className="text-purple-400 font-semibold">{modelInsights.opus.outputTokens.toLocaleString()}</span></div>
            <div className="flex justify-between border-t border-white/10 pt-3"><span className="text-gray-500">Total Cost</span><span className="text-purple-400 font-bold text-lg">${modelInsights.opus.totalCost.toFixed(3)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">% of Total</span><span className="text-purple-400 font-semibold">{modelInsights.opus.percentOfSpend}%</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Cost per Call</span><span className="text-purple-400 font-semibold">${modelInsights.opus.costPerCall}</span></div>
          </div>
        </div>
      </div>

      {/* Operation Table */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
        <h3 className="text-lg font-sans font-bold text-white mb-4">Cost by Operation</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-gray-500 py-3 px-4 uppercase text-xs tracking-wider">Operation</th>
                <th className="text-left text-gray-500 py-3 px-4 uppercase text-xs tracking-wider">Model</th>
                <th className="text-right text-gray-500 py-3 px-4 uppercase text-xs tracking-wider">Cost</th>
                <th className="text-right text-gray-500 py-3 px-4 uppercase text-xs tracking-wider">Calls</th>
                <th className="text-right text-gray-500 py-3 px-4 uppercase text-xs tracking-wider">% of Total</th>
              </tr>
            </thead>
            <tbody>
              {operationBreakdown.map((row, idx) => (
                <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 text-white font-medium">{row.operation}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded border ${row.model === "haiku" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-purple-500/10 text-purple-400 border-purple-500/20"}`}>{row.model}</span>
                  </td>
                  <td className="py-3 px-4 text-right text-amber-400 font-mono font-semibold">${row.cost.toFixed(4)}</td>
                  <td className="py-3 px-4 text-right text-gray-400">{row.calls}</td>
                  <td className="py-3 px-4 text-right text-gray-400">{((row.cost / monthlySpend) * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl">
        <h3 className="text-lg font-sans font-bold text-white flex items-center gap-2"><Zap className="w-5 h-5 text-amber-400" />Efficiency Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <p className="text-emerald-400 font-semibold mb-2">💡 Model Split</p>
            <p className="text-gray-400">Haiku: {modelInsights.haiku.percentOfSpend}% | Opus: {modelInsights.opus.percentOfSpend}%</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <p className="text-emerald-400 font-semibold mb-2">📈 Account Runway</p>
            <p className="text-gray-400">At ${avgCostPerDay}/day, your <strong className="text-white">$33.96 balance</strong> supports <strong className="text-white">~{Math.floor(creditBalance / parseFloat(avgCostPerDay))} days</strong>.</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <p className="text-amber-400 font-semibold mb-2">🎯 Monthly Projection</p>
            <p className="text-gray-400">Feb pace: ~${projectedMonthlySpend}. Budget: $200 (headroom available).</p>
          </div>
        </div>
      </div>

      {/* How to Read */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
        <h3 className="text-lg font-sans font-bold text-white mb-3">📊 How to Read This Dashboard</h3>
        <div className="space-y-2 text-sm text-gray-400">
          <p><strong className="text-white">Credit Balance ($33.96):</strong> Your actual Anthropic API account balance.</p>
          <p><strong className="text-white">Monthly Budget ($200):</strong> Your target monthly spend for tracking.</p>
          <p><strong className="text-white">Total Spend ($0.80):</strong> Actual spend across all operations Feb 1-8.</p>
          <p><strong className="text-white">Runway:</strong> At ${avgCostPerDay}/day, your $33.96 balance lasts ~{Math.floor(creditBalance / parseFloat(avgCostPerDay))} days.</p>
        </div>
      </div>

      {creditBalance < 50 && (
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 flex items-start gap-3 backdrop-blur-xl">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-400 font-semibold">Low Credit Balance</p>
            <p className="text-gray-400 text-sm mt-1">Your account balance is $33.96. At current spend (${avgCostPerDay}/day), you have ~{Math.floor(creditBalance / parseFloat(avgCostPerDay))} days of runway.</p>
          </div>
        </div>
      )}
    </div>
  );
}
