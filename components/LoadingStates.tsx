"use client";

import React from "react";
import { Zap, TrendingUp, BarChart3 } from "lucide-react";

export const ChartSkeleton = () => (
  <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm animate-pulse">
    <div className="h-6 bg-slate-700/50 rounded w-1/3 mb-4"></div>
    <div className="h-4 bg-slate-700/50 rounded w-1/4 mb-6"></div>
    <div className="space-y-3 mb-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-12 bg-slate-700/50 rounded"></div>
      ))}
    </div>
    <div className="h-48 bg-slate-700/50 rounded"></div>
  </div>
);

export const KPICardSkeleton = () => (
  <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 animate-pulse">
    <div className="h-4 bg-slate-700/50 rounded w-1/2 mb-4"></div>
    <div className="h-8 bg-slate-700/50 rounded w-2/3 mb-4"></div>
    <div className="h-3 bg-slate-700/50 rounded w-1/3"></div>
  </div>
);

export const GridSkeleton = ({ count = 4 }: { count?: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {[...Array(count)].map((_, i) => (
      <KPICardSkeleton key={i} />
    ))}
  </div>
);

export const LoadingOverlay = () => (
  <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 space-y-4">
      <div className="flex justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-slate-700 border-t-amber-500 animate-spin"></div>
      </div>
      <p className="text-white font-semibold text-center">Loading dashboard...</p>
      <p className="text-slate-400 text-xs text-center">Fetching real-time data</p>
    </div>
  </div>
);

export const EmptyState = ({
  title = "No data available",
  description = "Check back soon for updated metrics.",
  icon: Icon = TrendingUp,
}: {
  title?: string;
  description?: string;
  icon?: React.ComponentType<any>;
}) => (
  <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-12 text-center backdrop-blur-sm">
    <Icon className="w-12 h-12 text-slate-500 mx-auto mb-4" />
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    <p className="text-slate-400 text-sm">{description}</p>
  </div>
);

export const DataNotReadyState = () => (
  <div className="bg-gradient-to-br from-blue-600/20 to-blue-900/20 border border-blue-500/30 rounded-xl p-8 text-center backdrop-blur-sm">
    <div className="flex justify-center mb-4">
      <Zap className="w-8 h-8 text-blue-400" />
    </div>
    <h3 className="text-lg font-semibold text-white mb-2">
      Shopify Integration Coming Soon
    </h3>
    <p className="text-slate-300 text-sm mb-4">
      This dashboard is currently displaying demo data. Once your Shopify store is connected, real-time metrics will appear here.
    </p>
    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
      Connect Shopify Store
    </button>
  </div>
);
