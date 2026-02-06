/**
 * Activity Logger for Mission Control Dashboard
 * Logs all Yippybot actions to Convex for real-time visibility
 */

interface ActivityLogEntry {
  action: string;
  description: string;
  duration_ms: number;
  tokens_used?: number;
  cost?: number;
  status: "completed" | "failed" | "in_progress";
  metadata?: Record<string, any>;
}

const CONVEX_API_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

/**
 * Log an activity to Mission Control
 */
export async function logActivity(entry: ActivityLogEntry): Promise<void> {
  if (!CONVEX_API_URL) {
    console.warn("[Activity Logger] CONVEX_API_URL not set");
    return;
  }

  try {
    const response = await fetch(`${CONVEX_API_URL}/api/logActivity`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        timestamp: Date.now(),
        ...entry,
      }),
    });

    if (!response.ok) {
      console.warn(`[Activity Logger] Failed to log activity: ${response.statusText}`);
    }
  } catch (error) {
    console.warn("[Activity Logger] Error logging activity:", error);
  }
}

/**
 * Wrapper to log file operations
 */
export async function logFileOperation(
  operation: "read" | "write" | "delete" | "move",
  filePath: string,
  duration_ms: number,
  tokens_used?: number,
  cost?: number,
  status: "completed" | "failed" = "completed"
): Promise<void> {
  await logActivity({
    action: `file_${operation}`,
    description: `${operation.charAt(0).toUpperCase() + operation.slice(1)} ${filePath}`,
    duration_ms,
    tokens_used,
    cost,
    status,
    metadata: { file_path: filePath, operation },
  });
}

/**
 * Wrapper to log search operations
 */
export async function logSearch(
  query: string,
  results_count: number,
  duration_ms: number,
  tokens_used?: number,
  cost?: number,
  search_type: "web" | "local" = "web"
): Promise<void> {
  await logActivity({
    action: "search",
    description: `${search_type === "web" ? "Web" : "Local"} search: "${query}" (${results_count} results)`,
    duration_ms,
    tokens_used,
    cost,
    status: "completed",
    metadata: {
      query,
      results_count,
      search_type,
    },
  });
}

/**
 * Wrapper to log API calls
 */
export async function logAPICall(
  api_name: string,
  endpoint: string,
  duration_ms: number,
  tokens_used?: number,
  cost?: number,
  status: "completed" | "failed" = "completed"
): Promise<void> {
  await logActivity({
    action: "api_call",
    description: `${api_name} → ${endpoint}`,
    duration_ms,
    tokens_used,
    cost,
    status,
    metadata: { api_name, endpoint },
  });
}

/**
 * Wrapper to log cron job execution
 */
export async function logCronExecution(
  job_name: string,
  job_id: string,
  duration_ms: number,
  tokens_used?: number,
  cost?: number,
  status: "completed" | "failed" = "completed"
): Promise<void> {
  await logActivity({
    action: "cron_executed",
    description: `Cron job: ${job_name}`,
    duration_ms,
    tokens_used,
    cost,
    status,
    metadata: { job_name, job_id },
  });
}

/**
 * Wrapper to log memory indexing
 */
export async function logMemoryIndexing(
  file_path: string,
  lines: number,
  duration_ms: number,
  tokens_used?: number,
  cost?: number
): Promise<void> {
  await logActivity({
    action: "memory_indexed",
    description: `Indexed memory: ${file_path} (${lines} lines)`,
    duration_ms,
    tokens_used,
    cost,
    status: "completed",
    metadata: { file_path, lines },
  });
}

/**
 * Estimate token cost (placeholder - replace with actual calculation)
 */
export function estimateTokenCost(tokens: number, model: "haiku" | "opus" = "haiku"): number {
  const rates: Record<string, number> = {
    haiku: 0.00000080, // $0.80 per million tokens
    opus: 0.00001500, // $15 per million tokens
  };
  return tokens * rates[model];
}
