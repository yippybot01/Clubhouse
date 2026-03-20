"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from "lucide-react";

interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  type: "personal" | "scheduled";
  time?: string;
  description?: string;
}

type ViewMode = "week" | "month" | "year";

export default function CalendarTab() {
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventTime, setNewEventTime] = useState("");
  const [newEventDesc, setNewEventDesc] = useState("");

  // Load events from API
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const res = await fetch("/api/mc/calendar");
      const data = await res.json();
      setEvents(data.events || []);
    } catch (err) {
      console.error("Failed to load events:", err);
    }
  };

  const addEvent = async () => {
    if (!newEventTitle || !selectedDate) return;

    const newEvent: CalendarEvent = {
      id: `event_${Date.now()}`,
      title: newEventTitle,
      date: selectedDate,
      type: "personal",
      time: newEventTime || undefined,
      description: newEventDesc || undefined,
    };

    try {
      await fetch("/api/mc/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      });
      setEvents([...events, newEvent]);
      setShowAddModal(false);
      setNewEventTitle("");
      setNewEventTime("");
      setNewEventDesc("");
    } catch (err) {
      console.error("Failed to add event:", err);
    }
  };

  // Navigation
  const navigate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (viewMode === "week") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
    } else if (viewMode === "month") {
      newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
    } else {
      newDate.setFullYear(newDate.getFullYear() + (direction === "next" ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => setCurrentDate(new Date());

  // Week View
  const renderWeekView = () => {
    const weekStart = new Date(currentDate);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      return d;
    });

    return (
      <div className="grid grid-cols-7 gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-sm font-semibold text-gray-400 py-2">
            {day}
          </div>
        ))}
        {days.map((day) => {
          const dateStr = day.toISOString().split("T")[0];
          const dayEvents = events.filter((e) => e.date === dateStr);
          const isToday = day.toDateString() === new Date().toDateString();

          return (
            <div
              key={dateStr}
              onClick={() => {
                setSelectedDate(dateStr);
                setShowAddModal(true);
              }}
              className={`min-h-[120px] p-3 rounded-lg border cursor-pointer transition-all ${
                isToday
                  ? "bg-emerald-500/10 border-emerald-500/30"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
            >
              <div className="text-lg font-bold text-white mb-2">{day.getDate()}</div>
              <div className="space-y-1">
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-300 truncate"
                    title={event.title}
                  >
                    {event.time && <span className="mr-1">{event.time}</span>}
                    {event.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Month View
  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = Array.from({ length: 42 }, (_, i) => {
      const dayNum = i - firstDay + 1;
      if (dayNum < 1 || dayNum > daysInMonth) return null;
      return new Date(year, month, dayNum);
    });

    return (
      <div className="grid grid-cols-7 gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-sm font-semibold text-gray-400 py-2">
            {day}
          </div>
        ))}
        {days.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} className="min-h-[100px]"></div>;
          
          const dateStr = day.toISOString().split("T")[0];
          const dayEvents = events.filter((e) => e.date === dateStr);
          const isToday = day.toDateString() === new Date().toDateString();

          return (
            <div
              key={dateStr}
              onClick={() => {
                setSelectedDate(dateStr);
                setShowAddModal(true);
              }}
              className={`min-h-[100px] p-2 rounded-lg border cursor-pointer transition-all ${
                isToday
                  ? "bg-emerald-500/10 border-emerald-500/30"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
            >
              <div className="text-sm font-bold text-white mb-1">{day.getDate()}</div>
              <div className="space-y-1">
                {dayEvents.slice(0, 2).map((event) => (
                  <div
                    key={event.id}
                    className="text-[10px] px-1 py-0.5 rounded bg-blue-500/20 text-blue-300 truncate"
                    title={event.title}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-[10px] text-gray-400">+{dayEvents.length - 2} more</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Year View
  const renderYearView = () => {
    const year = currentDate.getFullYear();
    const months = Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));

    return (
      <div className="grid grid-cols-3 gap-6">
        {months.map((month) => {
          const monthName = month.toLocaleString("default", { month: "long" });
          const monthEvents = events.filter(
            (e) => e.date.startsWith(`${year}-${String(month.getMonth() + 1).padStart(2, "0")}`)
          );

          return (
            <div
              key={month.getMonth()}
              onClick={() => {
                setCurrentDate(month);
                setViewMode("month");
              }}
              className="bg-white/5 border border-white/10 rounded-lg p-4 cursor-pointer hover:bg-white/10 transition-all"
            >
              <div className="font-bold text-white mb-2">{monthName}</div>
              <div className="text-sm text-gray-400">
                {monthEvents.length} event{monthEvents.length !== 1 ? "s" : ""}
              </div>
              {monthEvents.length > 0 && (
                <div className="mt-2 space-y-1">
                  {monthEvents.slice(0, 3).map((event) => (
                    <div key={event.id} className="text-xs text-gray-300 truncate">
                      • {event.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <CalendarIcon className="w-8 h-8 text-emerald-400" />
            Calendar
          </h2>
          <p className="text-gray-400 mt-1">
            {viewMode === "week" && `Week of ${currentDate.toLocaleDateString()}`}
            {viewMode === "month" && currentDate.toLocaleDateString("default", { month: "long", year: "numeric" })}
            {viewMode === "year" && currentDate.getFullYear()}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
            {(["week", "month", "year"] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                  viewMode === mode
                    ? "bg-emerald-500 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>

          {/* Navigation */}
          <button
            onClick={() => navigate("prev")}
            className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={goToToday}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-semibold transition-all"
          >
            Today
          </button>
          <button
            onClick={() => navigate("next")}
            className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>

          {/* Add Event Button */}
          <button
            onClick={() => {
              setSelectedDate(new Date().toISOString().split("T")[0]);
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Event
          </button>
        </div>
      </div>

      {/* Calendar Views */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        {viewMode === "week" && renderWeekView()}
        {viewMode === "month" && renderMonthView()}
        {viewMode === "year" && renderYearView()}
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-gray-900 border border-white/20 rounded-2xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-white mb-4">Add Event</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Event Title</label>
                <input
                  type="text"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder="Enter event title"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Time (optional)</label>
                <input
                  type="time"
                  value={newEventTime}
                  onChange={(e) => setNewEventTime(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Description (optional)</label>
                <textarea
                  value={newEventDesc}
                  onChange={(e) => setNewEventDesc(e.target.value)}
                  placeholder="Add details..."
                  rows={3}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                onClick={addEvent}
                className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-all"
              >
                Add Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
