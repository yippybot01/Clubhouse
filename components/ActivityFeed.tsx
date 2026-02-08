"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle, AlertCircle, Hourglass, Clock, Zap, TrendingUp } from "lucide-react";
import { useState } from "react";
import { sampleActivities } from "@/lib/seedData";

export default function ActivityFeed() {
  const activities = useQuery(api.functions.getActivityFeed, { limit: 50 });
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // Use sample data if no real activities exist
  const displayActivities = activities && activities.length > 0 
    ? activities 
    : sampleActivities.map((activity, index) => ({
        _id: `sample_${index}`,
        timestamp: Date.now() - (sampleActivities.length - index) * 300000,
        ...activity
      }));

  const getIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "failed":
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      case "in_progress":
        return <Hourglass className="w-5 h-5 text-yellow-400" />;
      default:
        return <CheckCircle className="w-5 h-5 text-slate-400" />;
    }
  };

  const getActionColor = (action: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      file_created: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30" },
      search: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/30" },
      api_call: { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/30" },
      cron_executed: { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/30" },
      memory_indexed: { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/30" },
      default: { bg: "bg-slate-700/10", text: "text-slate-400", border: "border-slate-600/30" },
    };
    return colors[action] || colors.default;
  };

  const getStatusBadge = (status: string) => {
    const statusStyles: Record<string, string> = {
      completed: "bg-green-500/20 text-green-300 border-green-500/30",
      failed: "bg-red-500/20 text-red-300 border-red-500/30",
      in_progress: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    };
    return statusStyles[status] || "bg-slate-600/20 text-slate-300 border-slate-500/30";
  };

  return (
    <div className="space-y-8">
      {/* Activity Stream */}
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl shadow-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/80 to-slate-800/40">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              Recent Activities
            </h2>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Live
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-700/30">
          {!activities ? (
            <div className="px-6 py-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
              <p className="text-slate-400 mt-4">Loading activities...</p>
            </div>
          ) : displayActivities.length === 0 ? (
            <div className="px-6 py-12 text-center text-slate-400">
              <Clock className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">No activities yet</p>
              <p className="text-sm mt-2">Activities will appear here as they happen</p>
            </div>
          ) : (
            displayActivities.map((activity, index) => {
              const actionStyle = getActionColor(activity.action);
              const isExpanded = expandedId === activity._id;
              
              return (
                <div
                  key={activity._id}
                  className="group px-6 py-4 hover:bg-slate-700/30 transition-all duration-300 cursor-pointer relative overflow-hidden"
                  onClick={() => setExpandedId(isExpanded ? null : activity._id)}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animation: 'slideIn 0.3s ease-out forwards',
                  }}
                >
                  {/* Gradient accent on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative flex items-start gap-4">
                    {/* Status Icon */}
                    <div className="flex-shrink-0 mt-1">
                      <div className="p-2 bg-slate-700/50 rounded-lg group-hover:bg-slate-600/50 transition-colors">
                        {getIcon(activity.status)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${actionStyle.bg} ${actionStyle.text} ${actionStyle.border}`}>
                            {activity.action.replace(/_/g, " ").toUpperCase()}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-md border ${getStatusBadge(activity.status)}`}>
                            {activity.status}
                          </span>
                        </div>
                        <span className="text-slate-400 text-xs whitespace-nowrap flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-white font-medium mb-3 group-hover:text-cyan-100 transition-colors">
                        {activity.description}
                      </p>

                      {/* Metrics */}
                      <div className="flex items-center gap-4 text-xs">
                        {activity.duration_ms && (
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <Clock className="w-3.5 h-3.5 text-blue-400" />
                            <span className="font-medium">{activity.duration_ms}ms</span>
                          </div>
                        )}
                        {activity.tokens_used && (
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <Zap className="w-3.5 h-3.5 text-cyan-400" />
                            <span className="font-medium">{activity.tokens_used.toLocaleString()} tokens</span>
                          </div>
                        )}
                        {activity.cost && (
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <span className="text-green-400">$</span>
                            <span className="font-medium text-green-400">{activity.cost.toFixed(4)}</span>
                          </div>
                        )}
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-slate-700/50 space-y-4 animate-fadeIn">
                          {activity.metadata?.brief_content && (
                            <div className="bg-slate-700/20 rounded-lg p-4 border border-slate-700/50">
                              <p className="text-amber-300 font-semibold mb-3">Morning Brief</p>
                              <p className="text-slate-200 text-sm whitespace-pre-line leading-relaxed">{activity.metadata.brief_content}</p>
                            </div>
                          )}
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="bg-slate-700/30 rounded-lg p-3">
                              <p className="text-slate-400 mb-1">Timestamp</p>
                              <p className="text-white font-mono">{new Date(activity.timestamp).toLocaleString()}</p>
                            </div>
                            <div className="bg-slate-700/30 rounded-lg p-3">
                              <p className="text-slate-400 mb-1">Activity ID</p>
                              <p className="text-white font-mono text-xs truncate">{activity._id}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 500px;
          }
        }
      `}</style>
    </div>
  );
}
