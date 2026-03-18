"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { TrendingUp, Zap, DollarSign, Activity } from "lucide-react";
import { sampleActivities } from "@/lib/seedData";

export default function DashboardStats() {
  const stats = useQuery(api.functions.getActivityStats, { last_hours: 24 });
  
  // Calculate stats from sample data if no real data exists
  const displayStats = stats && stats.total_actions > 0 
    ? stats 
    : {
        total_actions: sampleActivities.length,
        total_tokens: sampleActivities.reduce((sum, a) => sum + (a.tokens_used || 0), 0),
        total_cost: sampleActivities.reduce((sum, a) => sum + (a.cost || 0), 0),
        actions_by_type: sampleActivities.reduce((acc, a) => {
          acc[a.action] = (acc[a.action] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      };

  const budgetPercent = ((displayStats.total_cost / 5) * 100).toFixed(1);

  return (
    <div className="space-y-10">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Actions */}
        <div className="relative overflow-hidden rounded-xl p-6 card-hover bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-300 hover:border-blue-400/50 text-center">
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-3">
              <p className="text-blue-600 text-sm font-semibold mr-2">Total Actions</p>
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-4xl font-bold text-club-navy">{displayStats.total_actions}</p>
            <p className="text-xs text-blue-600/70 mt-2">in the last 24 hours</p>
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full -mr-12 -mt-12"></div>
        </div>

        {/* Tokens Used */}
        <div className="relative overflow-hidden rounded-xl p-6 card-hover bg-gradient-to-br from-cyan-50 to-cyan-100 border border-cyan-500/30 hover:border-cyan-400/50 text-center">
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-3">
              <p className="text-cyan-600 text-sm font-semibold mr-2">Tokens Used</p>
              <Zap className="w-5 h-5 text-cyan-600" />
            </div>
            <p className="text-4xl font-bold text-club-navy">{displayStats.total_tokens.toLocaleString()}</p>
            <p className="text-xs text-cyan-600/70 mt-2">across all operations</p>
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full -mr-12 -mt-12"></div>
        </div>

        {/* API Cost */}
        <div className="relative overflow-hidden rounded-xl p-6 card-hover bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-300 hover:border-purple-400/50 text-center">
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-3">
              <p className="text-purple-600 text-sm font-semibold mr-2">API Cost</p>
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-4xl font-bold text-club-navy">${displayStats.total_cost.toFixed(3)}</p>
            <p className="text-xs text-purple-600 mt-2">{budgetPercent}% of daily budget</p>
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full -mr-12 -mt-12"></div>
        </div>

        {/* Budget Remaining */}
        <div className="relative overflow-hidden rounded-xl p-6 card-hover bg-gradient-to-br from-green-50 to-green-100 border border-green-500/30 hover:border-green-400/50 text-center">
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-3">
              <p className="text-green-600 text-sm font-semibold mr-2">Budget Remaining</p>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-4xl font-bold text-club-navy">${(5 - displayStats.total_cost).toFixed(2)}</p>
            <p className="text-xs text-green-600/70 mt-2">of $5.00 daily limit</p>
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full -mr-12 -mt-12"></div>
        </div>
      </div>

      {/* Simple Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl p-6 bg-white border border-club-gold/25 shadow-sm text-center">
          <p className="text-gray-500 text-sm mb-3">Avg Tokens per Action</p>
          <p className="text-3xl font-bold text-club-navy">
            {Math.round(displayStats.total_tokens / (displayStats.total_actions || 1))}
          </p>
        </div>
        <div className="rounded-xl p-6 bg-white border border-club-gold/25 shadow-sm text-center">
          <p className="text-gray-500 text-sm mb-3">Cost per Action</p>
          <p className="text-3xl font-bold text-club-navy">
            ${(displayStats.total_cost / (displayStats.total_actions || 1)).toFixed(4)}
          </p>
        </div>
        <div className="rounded-xl p-6 bg-white border border-club-gold/25 shadow-sm text-center">
          <p className="text-gray-500 text-sm mb-3">Daily Budget Status</p>
          <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
            <div
              className="bg-gradient-to-r from-amber-500 to-yellow-400 h-3 rounded-full transition-all"
              style={{ width: `${Math.min(budgetPercent as any, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">{budgetPercent}% used</p>
        </div>
      </div>
    </div>
  );
}
