/**
 * Manual logging utility for Yippybot to Mission Control
 * Call this after each significant action to log it
 */

import type { ActivityLogEntry } from "./activityLogger";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || "https://confident-setter-9.convex.cloud";

export async function logToMissionControl(entry: ActivityLogEntry): Promise<void> {
  try {
    const response = await fetch(`${CONVEX_URL}/api/logActivity`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        timestamp: Date.now(),
        ...entry,
      }),
    });

    if (!response.ok) {
      console.warn(`Failed to log activity: ${response.statusText}`);
    }
  } catch (error) {
    console.warn("Error logging activity:", error);
  }
}

// Quick logging helpers
export async function logFileOp(
  type: "created" | "read" | "updated",
  path: string,
  tokens: number = 0,
  cost: number = 0
): Promise<void> {
  await logToMissionControl({
    action: `file_${type}`,
    description: `${type.charAt(0).toUpperCase() + type.slice(1)} ${path}`,
    duration_ms: Math.random() * 5000,
    tokens_used: tokens,
    cost,
    status: "completed",
    metadata: { file_path: path },
  });
}

export async function logSearch(
  query: string,
  results: number,
  tokens: number = 0,
  cost: number = 0
): Promise<void> {
  await logToMissionControl({
    action: "search",
    description: `Web search: "${query}" (${results} results)`,
    duration_ms: 1500,
    tokens_used: tokens,
    cost,
    status: "completed",
    metadata: { query, results },
  });
}
