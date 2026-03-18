"use client";

import React from "react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { AlertCircle, TrendingUp, Zap, DollarSign, AlertTriangle } from "lucide-react";
import { getRealSpendData, getOperationBreakdown, getModelInsights } from "@/lib/realSpendData";

const tt = { backgroundColor: "#FFFFFF", border: "1px solid #D4AF37", borderRadius: "8px" };

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
    { name: `Haiku ($${spendData.spendByModel.haiku.cost.toFixed(3)})`, value: spendData.spendByModel.haiku.cost, color: "#1B4332" },
    { name: `Opus ($${spendData.spendByModel.opus.cost.toFixed(3)})`, value: spendData.spendByModel.opus.cost, color: "#6A1B38" },
  ];

  const StatCard = ({ title, value, subtitle, icon: Icon, color = "forest" }: {
    title: string; value: string | number; subtitle?: string; icon: React.ComponentType<any>; color?: string;
  }) => {
    const colorClasses: Record<string, string> = {
      forest: "from-club-green/5 to-club-forest-dark/20 border-club-forest-light/30",
      gold: "from-club-gold/5 to-club-gold-dark/10 border-club-gold/25",
      burgundy: "from-club-burgundy/5 to-club-burgundy-dark/15 border-club-burgundy/25",
      navy: "from-club-navy-mid/30 to-club-navy/30 border-blue-500/20",
    };
    const iconColors: Record<string, string> = { forest: "text-emerald-600", gold: "text-club-gold", burgundy: "text-club-burgundy-light", navy: "text-blue-600" };

    return (
      <div className={`rounded-xl p-6 bg-gradient-to-br ${colorClasses[color]} border transition-all duration-300 hover:shadow-lg hover:shadow-md`}>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-400 text-sm mb-2">{title}</p>
            <p className="text-3xl font-serif font-bold text-club-navy">{value}</p>
            {subtitle && <p className="text-xs text-gray-300 mt-1">{subtitle}</p>}
          </div>
          <div className="p-2 bg-club-cream-dark/50 rounded-lg border border-club-gold/25">
            <Icon className={`w-6 h-6 ${iconColors[color]}`} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Feb Spend to Date" value={`$${monthlySpend.toFixed(3)}`} subtitle={`vs $${monthlyBudget} monthly target`} icon={DollarSign} color="forest" />
        <StatCard title="Credit Balance" value={`$${creditBalance.toFixed(2)}`} subtitle="Anthropic account balance" icon={AlertCircle} color="gold" />
        <StatCard title="Avg Daily Spend" value={`$${avgCostPerDay}`} subtitle={`Projected: $${projectedMonthlySpend}/month`} icon={TrendingUp} color="burgundy" />
        <StatCard title="Remaining" value={`$${remainingMonth.toFixed(2)}`} subtitle={`${(100 - monthlyPercentage).toFixed(2)}% of budget`} icon={Zap} color="navy" />
      </div>

      {/* Progress */}
      <div className="bg-white border border-club-gold/30 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-serif font-bold text-club-navy mb-4">Monthly Spend vs Budget ($200 Target)</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-400">${monthlySpend.toFixed(3)} of $200</span>
              <span className="text-sm text-emerald-600 font-semibold">{monthlyPercentage.toFixed(2)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden border border-club-gold/25">
              <div className="bg-gradient-to-r from-club-forest to-club-forest-light h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(monthlyPercentage, 100)}%` }} />
            </div>
          </div>
          <div className="bg-club-cream-dark/50 rounded-lg p-3 border border-club-gold/20">
            <p className="text-xs text-gray-400"><span className="text-emerald-600 font-semibold">✓ Excellent pace</span> — 8 days in, only ${monthlySpend.toFixed(2)} spent. On track for ~${projectedMonthlySpend} total.</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-club-gold/30 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-serif font-bold text-club-navy mb-4">Spend by Model</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={modelSpendData} cx="50%" cy="50%" labelLine={true} label={({ name }) => name} outerRadius={80} dataKey="value">
                {modelSpendData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="#D4AF37" strokeWidth={1} />)}
              </Pie>
              <Tooltip formatter={(value) => `$${(value as number).toFixed(3)}`} contentStyle={tt} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-club-gold/30 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-serif font-bold text-club-navy mb-4">Daily Spend Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={spendData.dailySpend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.1)" />
              <XAxis dataKey="date" stroke="#D4AF37" opacity={0.5} tick={{ fontSize: 12 }} />
              <YAxis stroke="#D4AF37" opacity={0.5} />
              <Tooltip contentStyle={tt} labelStyle={{ color: "#0A1628" }} formatter={(value) => `$${(value as number).toFixed(3)}`} />
              <Bar dataKey="amount" fill="#1B4332" stroke="#D4AF37" strokeWidth={0.5} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Model Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-club-forest-light/30 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-serif font-bold text-club-navy mb-4">Haiku (claude-haiku-4-5)</h3>
          <div className="space-y-3">
            <div className="flex justify-between"><span className="text-gray-400">Input Tokens</span><span className="text-emerald-600 font-semibold">{modelInsights.haiku.inputTokens.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Output Tokens</span><span className="text-emerald-600 font-semibold">{modelInsights.haiku.outputTokens.toLocaleString()}</span></div>
            <div className="flex justify-between border-t border-club-gold/25 pt-3"><span className="text-gray-400">Total Cost</span><span className="text-emerald-600 font-bold text-lg">${modelInsights.haiku.totalCost.toFixed(3)}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">% of Total</span><span className="text-emerald-600 font-semibold">{modelInsights.haiku.percentOfSpend}%</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Cost per Call</span><span className="text-emerald-600 font-semibold">${modelInsights.haiku.costPerCall}</span></div>
          </div>
        </div>

        <div className="bg-white border border-club-burgundy/25 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-serif font-bold text-club-navy mb-4">Opus (claude-opus-4-6)</h3>
          <div className="space-y-3">
            <div className="flex justify-between"><span className="text-gray-400">Input Tokens</span><span className="text-club-burgundy-light font-semibold">{modelInsights.opus.inputTokens.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Output Tokens</span><span className="text-club-burgundy-light font-semibold">{modelInsights.opus.outputTokens.toLocaleString()}</span></div>
            <div className="flex justify-between border-t border-club-gold/25 pt-3"><span className="text-gray-400">Total Cost</span><span className="text-club-burgundy-light font-bold text-lg">${modelInsights.opus.totalCost.toFixed(3)}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">% of Total</span><span className="text-club-burgundy-light font-semibold">{modelInsights.opus.percentOfSpend}%</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Cost per Call</span><span className="text-club-burgundy-light font-semibold">${modelInsights.opus.costPerCall}</span></div>
          </div>
        </div>
      </div>

      {/* Operation Table */}
      <div className="bg-white border border-club-gold/30 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-serif font-bold text-club-navy mb-4">Cost by Operation</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-club-gold/30">
                <th className="text-left text-gray-400 py-3 px-4 uppercase text-xs tracking-wider">Operation</th>
                <th className="text-left text-gray-400 py-3 px-4 uppercase text-xs tracking-wider">Model</th>
                <th className="text-right text-gray-400 py-3 px-4 uppercase text-xs tracking-wider">Cost</th>
                <th className="text-right text-gray-400 py-3 px-4 uppercase text-xs tracking-wider">Calls</th>
                <th className="text-right text-gray-400 py-3 px-4 uppercase text-xs tracking-wider">% of Total</th>
              </tr>
            </thead>
            <tbody>
              {operationBreakdown.map((row, idx) => (
                <tr key={idx} className="border-b border-club-gold/20 hover:bg-club-cream transition-colors">
                  <td className="py-3 px-4 text-club-navy font-medium">{row.operation}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded border ${row.model === "haiku" ? "bg-club-green/5 text-emerald-600 border-club-forest-light/30" : "bg-club-burgundy/5 text-club-burgundy-light border-club-burgundy/25"}`}>{row.model}</span>
                  </td>
                  <td className="py-3 px-4 text-right text-club-gold font-semibold">${row.cost.toFixed(4)}</td>
                  <td className="py-3 px-4 text-right text-gray-400">{row.calls}</td>
                  <td className="py-3 px-4 text-right text-gray-400">{((row.cost / monthlySpend) * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-white border border-club-gold/30 rounded-xl p-6 space-y-4 shadow-sm">
        <h3 className="text-lg font-serif font-bold text-club-navy flex items-center gap-2"><Zap className="w-5 h-5 text-club-gold" />Efficiency Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-club-cream-dark/50 rounded-lg p-4 border border-club-gold/20">
            <p className="text-club-forest-light font-semibold mb-2">💡 Model Split</p>
            <p className="text-gray-400">Haiku: {modelInsights.haiku.percentOfSpend}% (${modelInsights.haiku.totalCost.toFixed(3)}) | Opus: {modelInsights.opus.percentOfSpend}% (${modelInsights.opus.totalCost.toFixed(3)})</p>
          </div>
          <div className="bg-club-cream-dark/50 rounded-lg p-4 border border-club-gold/20">
            <p className="text-emerald-600 font-semibold mb-2">📈 Account Runway</p>
            <p className="text-gray-400">At ${avgCostPerDay}/day average, your <strong>$33.96 balance</strong> supports <strong>~{Math.floor(creditBalance / parseFloat(avgCostPerDay))} days</strong> of operations.</p>
          </div>
          <div className="bg-club-cream-dark/50 rounded-lg p-4 border border-club-gold/20">
            <p className="text-club-gold font-semibold mb-2">🎯 Monthly Projection</p>
            <p className="text-gray-400">Feb pace: ~${projectedMonthlySpend}. Budget tracked: $200 (you have headroom).</p>
          </div>
        </div>
      </div>

      {/* How to Read */}
      <div className="bg-white border border-club-gold/30 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-serif font-bold text-club-navy mb-3">📊 How to Read This Dashboard</h3>
        <div className="space-y-2 text-sm text-gray-400">
          <p><strong className="text-club-navy">Credit Balance ($33.96):</strong> Your actual Anthropic API account balance.</p>
          <p><strong className="text-club-navy">Monthly Budget ($200):</strong> Your target monthly spend for tracking.</p>
          <p><strong className="text-club-navy">Total Spend ($0.80):</strong> Actual spend across all operations Feb 1-8.</p>
          <p><strong className="text-club-navy">Runway:</strong> At ${avgCostPerDay}/day, your $33.96 balance lasts ~{Math.floor(creditBalance / parseFloat(avgCostPerDay))} days.</p>
        </div>
      </div>

      {creditBalance < 50 && (
        <div className="bg-club-gold/5 border border-club-gold/25 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-club-gold flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-club-gold font-semibold">Low Credit Balance</p>
            <p className="text-gray-400 text-sm mt-1">Your account balance is $33.96. At current spend (${avgCostPerDay}/day), you have ~{Math.floor(creditBalance / parseFloat(avgCostPerDay))} days of runway.</p>
          </div>
        </div>
      )}
    </div>
  );
}
