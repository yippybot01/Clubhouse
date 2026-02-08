"use client";

import React from "react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface SparklineData {
  value: number;
  name?: string;
}

interface SparklineProps {
  data: SparklineData[];
  color?: string;
  height?: number;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export const Sparkline = ({
  data,
  color = "#10b981",
  height = 40,
  trend,
  className = "",
}: SparklineProps) => {
  if (data.length === 0) return null;

  // Determine color based on trend if not specified
  let sparkColor = color;
  if (trend === "down") sparkColor = "#ef4444";
  else if (trend === "up") sparkColor = "#10b981";
  else if (trend === "neutral") sparkColor = "#f59e0b";

  return (
    <div className={`inline-block ${className}`}>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={data}
          margin={{ top: 2, right: 2, bottom: 2, left: 2 }}
        >
          <Line
            type="monotone"
            dataKey="value"
            stroke={sparkColor}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

interface MiniChartProps {
  data: { date: string; value: number }[];
  title: string;
  value: string | number;
  color?: string;
  trend?: "up" | "down";
  trendValue?: number;
}

export const MiniTrendChart = ({
  data,
  title,
  value,
  color = "blue",
  trend,
  trendValue,
}: MiniChartProps) => {
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-600/20 border-blue-500/30 text-blue-300",
    green: "bg-green-600/20 border-green-500/30 text-green-300",
    amber: "bg-amber-600/20 border-amber-500/30 text-amber-300",
    purple: "bg-purple-600/20 border-purple-500/30 text-purple-300",
  };

  return (
    <div className={`border rounded-lg p-3 space-y-2 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-opacity-80">{title}</span>
        {trend && trendValue && (
          <span className={`text-xs font-bold ${trend === "up" ? "text-green-400" : "text-red-400"}`}>
            {trend === "up" ? "↑" : "↓"} {trendValue}%
          </span>
        )}
      </div>
      <p className="text-lg font-bold">{value}</p>
      <Sparkline
        data={data.map((d) => ({ value: d.value }))}
        color={trend === "up" ? "#10b981" : trend === "down" ? "#ef4444" : "#f59e0b"}
        height={30}
      />
    </div>
  );
};

/**
 * Mini bar chart for quick visualizations
 */
export const MiniBar = ({
  value,
  max = 100,
  label,
  color = "amber",
  showValue = true,
}: {
  value: number;
  max?: number;
  label?: string;
  color?: string;
  showValue?: boolean;
}) => {
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    amber: "bg-amber-500",
    purple: "bg-purple-500",
  };

  const percentage = (value / max) * 100;

  return (
    <div className="space-y-1">
      {label && <p className="text-xs text-slate-400">{label}</p>}
      <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full ${colorClasses[color]} transition-all duration-300`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
      {showValue && <p className="text-xs text-slate-300 font-semibold">{Math.round(percentage)}%</p>}
    </div>
  );
};

/**
 * Gauge chart for metrics with targets
 */
export const GaugeChart = ({
  value,
  max,
  label,
  unit = "",
}: {
  value: number;
  max: number;
  label: string;
  unit?: string;
}) => {
  const percentage = (value / max) * 100;
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-4">
      <svg width="120" height="120" className="transform -rotate-90">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#334155"
          strokeWidth="8"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={percentage < 50 ? "#ef4444" : percentage < 80 ? "#f59e0b" : "#10b981"}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
      </svg>
      <div className="text-center">
        <p className="text-2xl font-bold text-white">
          {value}{unit}
        </p>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-xs text-slate-500 mt-1">
          Goal: {max}{unit}
        </p>
      </div>
    </div>
  );
};
