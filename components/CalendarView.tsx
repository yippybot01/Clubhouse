"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatDistanceToNow, isThisWeek, startOfWeek, format, addDays } from "date-fns";
import { Clock, Zap } from "lucide-react";
import { sampleScheduledTasks } from "@/lib/seedData";

export default function CalendarView() {
  const tasks = useQuery(api.functions.getScheduledTasks, undefined);

  // Use real tasks or sample data if not loaded yet
  const displayTasks = (tasks && tasks.length > 0 ? tasks : sampleScheduledTasks).map((task: any) => ({
    ...task,
    _id: task._id || task.task_id,
    schedule: task.schedule || { kind: "cron" }
  }));

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 0 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const thisWeekTasks = displayTasks.filter((task) =>
    isThisWeek(new Date(task.next_run), { weekStartsOn: 0 })
  ) || [];

  const futureTasksThisWeek = thisWeekTasks.filter(
    (task) => task.next_run > Date.now()
  );

  // Color mapping for task types
  const getTaskColor = (index: number) => {
    const colors = [
      { bg: "bg-purple-900/40", border: "border-purple-500/50", text: "text-purple-300" },
      { bg: "bg-yellow-900/40", border: "border-yellow-500/50", text: "text-yellow-300" },
      { bg: "bg-red-900/40", border: "border-red-500/50", text: "text-red-300" },
      { bg: "bg-green-900/40", border: "border-green-500/50", text: "text-green-300" },
      { bg: "bg-blue-900/40", border: "border-blue-500/50", text: "text-blue-300" },
      { bg: "bg-cyan-900/40", border: "border-cyan-500/50", text: "text-cyan-300" },
      { bg: "bg-pink-900/40", border: "border-pink-500/50", text: "text-pink-300" },
    ];
    return colors[index % colors.length];
  };

  const getTasksForDay = (day: Date) => {
    // Show all this week's tasks for each day (not just future ones)
    return thisWeekTasks.filter((task) => {
      const taskDate = new Date(task.next_run);
      return (
        taskDate.getFullYear() === day.getFullYear() &&
        taskDate.getMonth() === day.getMonth() &&
        taskDate.getDate() === day.getDate()
      );
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const upcomingTasks = futureTasksThisWeek
    .sort((a, b) => a.next_run - b.next_run)
    .slice(0, 5);

  const getTimeString = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-10">
      {/* Always Running */}
      {thisWeekTasks.length > 0 && (
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-semibold text-white">Always Running</h2>
          </div>
          <p className="text-sm text-slate-400 mb-4">Yippybot's automated routines</p>
          <div className="flex flex-wrap gap-2">
            {thisWeekTasks.slice(0, 3).map((task) => (
              <div
                key={task._id}
                className="px-4 py-2 rounded-lg bg-amber-900/30 border border-amber-500/50 text-amber-300 text-sm font-medium"
              >
                {task.name} • Daily @ 7:30am
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weekly Calendar Grid */}
      <div className="space-y-4">
        <div className="grid grid-cols-7 gap-3">
          {days.map((day) => {
            const dayName = format(day, "EEE");
            const dayTasks = getTasksForDay(day);
            const todayFlag = isToday(day);

            return (
              <div
                key={day.toISOString()}
                className={`rounded-xl p-4 min-h-96 transition-all ${
                  todayFlag
                    ? "bg-slate-800/80 border-2 border-amber-500/50"
                    : "bg-slate-900/50 border border-slate-700/50"
                } backdrop-blur-sm hover:border-slate-600/50`}
              >
                <h3 className={`text-sm font-semibold mb-4 ${todayFlag ? "text-amber-300" : "text-slate-300"}`}>
                  {dayName}
                </h3>

                <div className="space-y-2">
                  {dayTasks.length === 0 ? (
                    <p className="text-xs text-slate-500">No tasks</p>
                  ) : (
                    dayTasks.map((task, taskIndex) => {
                      const colors = getTaskColor(taskIndex);
                      return (
                        <div
                          key={task._id}
                          className={`${colors.bg} border ${colors.border} rounded-lg p-3 text-xs transition-all hover:border-opacity-100`}
                        >
                          <p className={`font-medium truncate ${colors.text}`}>
                            {task.name}
                          </p>
                          <p className={`text-xs mt-1 ${colors.text}/70`}>
                            {getTimeString(task.next_run)}
                          </p>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Next Up */}
      {upcomingTasks.length > 0 && (
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-slate-400" />
            <h2 className="text-lg font-semibold text-white">Next Up</h2>
          </div>

          <div className="space-y-3">
            {upcomingTasks.map((task, index) => {
              const colors = getTaskColor(index);
              const timeUntil = formatDistanceToNow(new Date(task.next_run));

              return (
                <div
                  key={task._id}
                  className="flex items-center justify-between py-3 border-b border-slate-700/30 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-1 h-6 rounded ${colors.border.replace("border", "bg")} opacity-50`}></div>
                    <div>
                      <p className={`text-sm font-medium ${colors.text}`}>
                        {task.name}
                      </p>
                      {task.description && (
                        <p className="text-xs text-slate-400 mt-0.5">{task.description}</p>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">In {timeUntil}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 text-center">
          <p className="text-slate-400 text-xs mb-1">This Week</p>
          <p className="text-2xl font-bold text-white">{thisWeekTasks.length}</p>
          <p className="text-xs text-slate-500 mt-1">scheduled tasks</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 text-center">
          <p className="text-slate-400 text-xs mb-1">Next Task</p>
          {futureTasksThisWeek.length > 0 ? (
            <>
              <p className="text-2xl font-bold text-cyan-400">
                {formatDistanceToNow(new Date(futureTasksThisWeek[0].next_run)).split(" ")[0]}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {formatDistanceToNow(new Date(futureTasksThisWeek[0].next_run)).split(" ").slice(1).join(" ")}
              </p>
            </>
          ) : (
            <p className="text-slate-500 mt-1">None</p>
          )}
        </div>
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 text-center md:col-span-1">
          <p className="text-slate-400 text-xs mb-1">Status</p>
          <div className="flex items-center justify-center gap-1 mt-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <p className="text-sm font-semibold text-green-300">LIVE</p>
          </div>
        </div>
      </div>
    </div>
  );
}
