"use client";

import React, { useState } from "react";
import { Calendar } from "lucide-react";

interface DateRangePickerProps {
  onDateRangeChange?: (startDate: Date, endDate: Date) => void;
  presets?: {
    label: string;
    days: number;
  }[];
}

export default function DateRangePicker({
  onDateRangeChange,
  presets = [
    { label: "Last 7 Days", days: 7 },
    { label: "Last 14 Days", days: 14 },
    { label: "Last 30 Days", days: 30 },
    { label: "Last 90 Days", days: 90 },
  ],
}: DateRangePickerProps) {
  const [selectedPreset, setSelectedPreset] = useState("30");
  const [showCustom, setShowCustom] = useState(false);
  const [startDate, setStartDate] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d;
  });
  const [endDate, setEndDate] = useState(new Date());

  const handlePresetClick = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);

    setSelectedPreset(days.toString());
    setStartDate(start);
    setEndDate(end);
    setShowCustom(false);

    if (onDateRangeChange) {
      onDateRangeChange(start, end);
    }
  };

  const handleCustomApply = () => {
    if (onDateRangeChange) {
      onDateRangeChange(startDate, endDate);
    }
    setShowCustom(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-white">
          <Calendar className="w-5 h-5" />
          <span className="font-semibold">Date Range</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {presets.map((preset) => (
          <button
            key={preset.days}
            onClick={() => handlePresetClick(preset.days)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedPreset === preset.days.toString()
                ? "bg-amber-600 text-white"
                : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {showCustom && (
        <div className="bg-slate-700/30 rounded-lg p-4 space-y-4 border border-slate-600/50">
          <div className="space-y-2">
            <label className="text-sm text-slate-300">Start Date</label>
            <input
              type="date"
              value={startDate.toISOString().split("T")[0]}
              onChange={(e) => setStartDate(new Date(e.target.value))}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-300">End Date</label>
            <input
              type="date"
              value={endDate.toISOString().split("T")[0]}
              onChange={(e) => setEndDate(new Date(e.target.value))}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white text-sm"
            />
          </div>

          <button
            onClick={handleCustomApply}
            className="w-full px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded text-sm font-medium transition-colors"
          >
            Apply
          </button>
        </div>
      )}

      <button
        onClick={() => setShowCustom(!showCustom)}
        className="w-full px-3 py-2 text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors text-center"
      >
        {showCustom ? "Close Custom Range" : "Custom Range"}
      </button>

      <div className="mt-4 pt-4 border-t border-slate-600/50">
        <p className="text-xs text-slate-400">
          {formatDate(startDate)} to {formatDate(endDate)}
        </p>
      </div>
    </div>
  );
}
