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

  const displayActivities = activities && activities.length > 0
    ? activities
    : sampleActivities.map((activity, index) => ({
        _id: `sample_${index}`,
        timestamp: Date.now() - (sampleActivities.length - index) * 300000,
        ...activity
      }));

  const getIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case "failed": return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "in_progress": return <Hourglass className="w-5 h-5 text-club-gold" />;
      default: return <CheckCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getActionColor = (action: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      file_created: { bg: "bg-club-green/5", text: "text-emerald-600", border: "border-club-forest-light/30" },
      search: { bg: "bg-club-burgundy/5", text: "text-club-burgundy-light", border: "border-club-burgundy/20" },
      api_call: { bg: "bg-club-green/5", text: "text-emerald-600", border: "border-club-forest-light/30" },
      cron_executed: { bg: "bg-club-gold/5", text: "text-club-gold", border: "border-club-gold/20" },
      memory_indexed: { bg: "bg-blue-500/10", text: "text-blue-600", border: "border-blue-500/20" },
      default: { bg: "bg-club-cream-dark/50", text: "text-gray-400", border: "border-club-gold/25" },
    };
    return colors[action] || colors.default;
  };

  const getStatusBadge = (status: string) => {
    const s: Record<string, string> = {
      completed: "bg-emerald-50 text-emerald-600 border-emerald-500/20",
      failed: "bg-club-burgundy/5 text-red-600 border-club-burgundy/20",
      in_progress: "bg-club-gold/5 text-club-gold border-club-gold/20",
    };
    return s[status] || "bg-club-cream text-gray-400 border-club-gold/25";
  };

  return (
    <div className="space-y-8">
      <div className="bg-white shadow-sm border border-club-gold/30 rounded-xl shadow-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-club-gold/30 bg-gradient-to-r from-club-navy-light/80 to-club-navy/40">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif font-bold text-club-navy flex items-center gap-3">
              <div className="p-2 bg-club-green/5 rounded-lg border border-club-gold/30">
                <TrendingUp className="w-6 h-6 text-club-gold" />
              </div>
              Recent Activities
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Live
            </div>
          </div>
        </div>

        <div className="divide-y divide-club-gold/5">
          {!activities ? (
            <div className="px-6 py-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-club-gold" />
              <p className="text-gray-400 mt-4">Loading activities...</p>
            </div>
          ) : displayActivities.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-400">
              <Clock className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">No activities yet</p>
            </div>
          ) : (
            displayActivities.map((activity) => {
              const actionStyle = getActionColor(activity.action);
              const isExpanded = expandedId === activity._id;

              return (
                <div
                  key={activity._id}
                  className="group px-6 py-4 hover:bg-club-green/5 transition-all duration-300 cursor-pointer relative overflow-hidden"
                  onClick={() => setExpandedId(isExpanded ? null : activity._id)}
                >
                  <div className="relative flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="p-2 bg-club-cream rounded-lg border border-club-gold/25 group-hover:border-club-gold/20 transition-colors">
                        {getIcon(activity.status)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${actionStyle.bg} ${actionStyle.text} ${actionStyle.border}`}>
                            {activity.action.replace(/_/g, " ").toUpperCase()}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-md border ${getStatusBadge(activity.status)}`}>
                            {activity.status}
                          </span>
                        </div>
                        <span className="text-club-gold/40 text-xs whitespace-nowrap flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-club-navy font-medium mb-3 group-hover:text-club-gold/90 transition-colors">{activity.description}</p>
                      <div className="flex items-center gap-4 text-xs">
                        {activity.duration_ms && (
                          <div className="flex items-center gap-1.5 text-gray-400">
                            <Clock className="w-3.5 h-3.5 text-club-forest-light" /><span className="font-medium">{activity.duration_ms}ms</span>
                          </div>
                        )}
                        {activity.tokens_used && (
                          <div className="flex items-center gap-1.5 text-gray-400">
                            <Zap className="w-3.5 h-3.5 text-club-gold" /><span className="font-medium">{activity.tokens_used.toLocaleString()} tokens</span>
                          </div>
                        )}
                        {activity.cost && (
                          <div className="flex items-center gap-1.5 text-gray-400">
                            <span className="text-emerald-600">$</span><span className="font-medium text-emerald-600">{activity.cost.toFixed(4)}</span>
                          </div>
                        )}
                      </div>
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-club-gold/25 space-y-4 animate-fadeIn">
                          {activity.metadata?.brief_content && (
                            <div className="bg-club-cream-dark/50 rounded-lg p-4 border border-club-gold/25">
                              <p className="text-club-gold font-semibold mb-3">Morning Brief</p>
                              <p className="text-gray-500 text-sm whitespace-pre-line leading-relaxed">{activity.metadata.brief_content}</p>
                            </div>
                          )}
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="bg-club-cream-dark/50 rounded-lg p-3 border border-club-gold/20">
                              <p className="text-gray-400 mb-1">Timestamp</p>
                              <p className="text-club-navy font-mono">{new Date(activity.timestamp).toLocaleString()}</p>
                            </div>
                            <div className="bg-club-cream-dark/50 rounded-lg p-3 border border-club-gold/20">
                              <p className="text-gray-400 mb-1">Activity ID</p>
                              <p className="text-club-navy font-mono text-xs truncate">{activity._id}</p>
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
    </div>
  );
}
