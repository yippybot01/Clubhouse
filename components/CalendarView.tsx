"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatDistanceToNow, isThisWeek, startOfWeek, format, addDays } from "date-fns";
import { Clock, Zap } from "lucide-react";
import { sampleScheduledTasks } from "@/lib/seedData";

export default function CalendarView() {
  const tasks = useQuery(api.functions.getScheduledTasks, undefined);
  const displayTasks = (tasks && tasks.length > 0 ? tasks : sampleScheduledTasks).map((task: any) => ({
    ...task, _id: task._id || task.task_id, schedule: task.schedule || { kind: "cron" }
  }));

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 0 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const thisWeekTasks = displayTasks.filter((task) => isThisWeek(new Date(task.next_run), { weekStartsOn: 0 })) || [];
  const futureTasksThisWeek = thisWeekTasks.filter((task) => task.next_run > Date.now());

  const getTaskColor = (index: number) => {
    const colors = [
      { bg: "bg-purple-500/10", border: "border-purple-500/20", text: "text-purple-400" },
      { bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-400" },
      { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400" },
      { bg: "bg-sky-500/10", border: "border-sky-500/20", text: "text-sky-400" },
      { bg: "bg-orange-500/10", border: "border-orange-500/20", text: "text-orange-400" },
    ];
    return colors[index % colors.length];
  };

  const getTasksForDay = (day: Date) => thisWeekTasks.filter((task) => {
    const d = new Date(task.next_run);
    return d.getFullYear() === day.getFullYear() && d.getMonth() === day.getMonth() && d.getDate() === day.getDate();
  });

  const isToday = (date: Date) => {
    const t = new Date();
    return date.getDate() === t.getDate() && date.getMonth() === t.getMonth() && date.getFullYear() === t.getFullYear();
  };

  const upcomingTasks = futureTasksThisWeek.sort((a, b) => a.next_run - b.next_run).slice(0, 5);
  const getTimeString = (ts: number) => new Date(ts).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="space-y-10">
      {thisWeekTasks.length > 0 && (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-sans font-semibold text-white">Always Running</h2>
          </div>
          <p className="text-sm text-gray-400 mb-4">Yippybot's automated routines</p>
          <div className="flex flex-wrap gap-2">
            {thisWeekTasks.slice(0, 3).map((task) => (
              <div key={task._id} className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
                {task.name} • Daily @ 7:30am
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-7 gap-3">
          {days.map((day) => {
            const dayTasks = getTasksForDay(day);
            const todayFlag = isToday(day);
            return (
              <div key={day.toISOString()} className={`rounded-2xl p-4 min-h-96 transition-all duration-300 backdrop-blur-xl ${
                todayFlag
                  ? "bg-white/[0.07] border-2 border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.15)]"
                  : "bg-white/5 border border-white/10 hover:bg-white/[0.07] hover:border-white/20"
              }`}>
                <h3 className={`text-sm font-sans font-semibold mb-4 ${todayFlag ? "text-emerald-400" : "text-gray-500"}`}>
                  {format(day, "EEE")}
                </h3>
                <div className="space-y-2">
                  {dayTasks.length === 0 ? (
                    <p className="text-xs text-gray-600">No tasks</p>
                  ) : (
                    dayTasks.map((task, taskIndex) => {
                      const colors = getTaskColor(taskIndex);
                      return (
                        <div key={task._id} className={`${colors.bg} border ${colors.border} rounded-xl p-3 text-xs transition-all hover:border-opacity-100`}>
                          <p className={`font-medium truncate ${colors.text}`}>{task.name}</p>
                          <p className={`text-xs mt-1 opacity-70 ${colors.text}`}>{getTimeString(task.next_run)}</p>
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

      {upcomingTasks.length > 0 && (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-sans font-semibold text-white">Next Up</h2>
          </div>
          <div className="space-y-3">
            {upcomingTasks.map((task, index) => {
              const colors = getTaskColor(index);
              return (
                <div key={task._id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-1 h-6 rounded ${colors.bg}`} />
                    <div>
                      <p className={`text-sm font-medium ${colors.text}`}>{task.name}</p>
                      {task.description && <p className="text-xs text-gray-500 mt-0.5">{task.description}</p>}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 font-mono">In {formatDistanceToNow(new Date(task.next_run))}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-center">
          <p className="text-gray-500 text-xs mb-1">This Week</p>
          <p className="text-2xl font-mono font-bold text-white">{thisWeekTasks.length}</p>
          <p className="text-xs text-gray-600 mt-1">scheduled tasks</p>
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-center">
          <p className="text-gray-500 text-xs mb-1">Next Task</p>
          {futureTasksThisWeek.length > 0 ? (
            <>
              <p className="text-2xl font-mono font-bold text-amber-400">{formatDistanceToNow(new Date(futureTasksThisWeek[0].next_run)).split(" ")[0]}</p>
              <p className="text-xs text-gray-600 mt-1">{formatDistanceToNow(new Date(futureTasksThisWeek[0].next_run)).split(" ").slice(1).join(" ")}</p>
            </>
          ) : <p className="text-gray-600 mt-1">None</p>}
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-center md:col-span-1">
          <p className="text-gray-500 text-xs mb-1">Status</p>
          <div className="flex items-center justify-center gap-1 mt-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
            <p className="text-sm font-semibold text-emerald-400">LIVE</p>
          </div>
        </div>
      </div>
    </div>
  );
}
