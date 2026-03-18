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
    <div className="bg-white border border-club-gold/25 rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-club-navy">
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
                ? "bg-club-green text-club-navy"
                : "bg-gray-200 text-gray-600 hover:bg-slate-700"
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {showCustom && (
        <div className="bg-club-cream rounded-lg p-4 space-y-4 border border-club-gold/20">
          <div className="space-y-2">
            <label className="text-sm text-gray-600">Start Date</label>
            <input
              type="date"
              value={startDate.toISOString().split("T")[0]}
              onChange={(e) => setStartDate(new Date(e.target.value))}
              className="w-full px-3 py-2 bg-white border border-club-gold/20 rounded text-club-navy text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-600">End Date</label>
            <input
              type="date"
              value={endDate.toISOString().split("T")[0]}
              onChange={(e) => setEndDate(new Date(e.target.value))}
              className="w-full px-3 py-2 bg-white border border-club-gold/20 rounded text-club-navy text-sm"
            />
          </div>

          <button
            onClick={handleCustomApply}
            className="w-full px-3 py-2 bg-club-green hover:bg-club-green/90 text-club-navy rounded text-sm font-medium transition-colors"
          >
            Apply
          </button>
        </div>
      )}

      <button
        onClick={() => setShowCustom(!showCustom)}
        className="w-full px-3 py-2 text-sm font-medium text-club-gold hover:text-club-gold transition-colors text-center"
      >
        {showCustom ? "Close Custom Range" : "Custom Range"}
      </button>

      <div className="mt-4 pt-4 border-t border-club-gold/20">
        <p className="text-xs text-gray-500">
          {formatDate(startDate)} to {formatDate(endDate)}
        </p>
      </div>
    </div>
  );
}
