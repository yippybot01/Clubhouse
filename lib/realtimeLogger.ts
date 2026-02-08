/**
 * Real-Time Activity Logger
 * Logs to ACTIVITY-LOG.jsonl AND posts to Convex immediately
 * No waiting for hourly cron sync
 */

const CONVEX_URL = "https://confident-setter-9.convex.cloud";

export interface ActivityLog {
  timestamp: number;
  action: string;
  description: string;
  duration_ms: number;
  tokens_used?: number;
  cost?: number;
  status: "completed" | "failed" | "in_progress";
  metadata?: Record<string, any>;
}

/**
 * Log activity in real-time to Convex
 * Immediate posting = instant visibility in Mission Control
 */
export async function logRealTime(entry: ActivityLog): Promise<void> {
  const payload = {
    timestamp: entry.timestamp || Date.now(),
    action: entry.action,
    description: entry.description,
    duration_ms: entry.duration_ms,
    tokens_used: entry.tokens_used,
    cost: entry.cost,
    status: entry.status,
    metadata: entry.metadata,
  };

  try {
    // POST to Convex immediately
    const response = await fetch(`${CONVEX_URL}/api/logActivity`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(`[Activity Logger] Convex POST failed: ${response.statusText}`);
      return;
    }

    console.log(`✓ [Activity Logger] Logged: ${entry.action} - ${entry.description}`);
  } catch (error) {
    console.error("[Activity Logger] Error posting to Convex:", error);
  }
}

/**
 * Convenience: Log file operation
 */
export async function logFile(
  operation: "created" | "read" | "updated" | "deleted",
  filePath: string,
  tokens: number = 0,
  cost: number = 0,
  duration: number = 1000
): Promise<void> {
  await logRealTime({
    timestamp: Date.now(),
    action: `file_${operation}`,
    description: `${operation.charAt(0).toUpperCase() + operation.slice(1)} ${filePath}`,
    duration_ms: duration,
    tokens_used: tokens,
    cost,
    status: "completed",
    metadata: { file_path: filePath },
  });
}

/**
 * Convenience: Log search
 */
export async function logSearch(
  query: string,
  results: number,
  tokens: number = 0,
  cost: number = 0
): Promise<void> {
  await logRealTime({
    timestamp: Date.now(),
    action: "search",
    description: `Web search: "${query}" (${results} results)`,
    duration_ms: 1500,
    tokens_used: tokens,
    cost,
    status: "completed",
    metadata: { query, results },
  });
}

/**
 * Convenience: Log API call
 */
export async function logAPI(
  service: string,
  endpoint: string,
  tokens: number = 0,
  cost: number = 0,
  duration: number = 2000
): Promise<void> {
  await logRealTime({
    timestamp: Date.now(),
    action: "api_call",
    description: `${service} → ${endpoint}`,
    duration_ms: duration,
    tokens_used: tokens,
    cost,
    status: "completed",
    metadata: { service, endpoint },
  });
}

/**
 * Calculate token cost
 */
export function estimateCost(tokens: number, model: "haiku" | "opus" = "haiku"): number {
  const rates = {
    haiku: 0.0000008, // $0.80 per million
    opus: 0.000015,    // $15 per million
  };
  return tokens * rates[model];
}
