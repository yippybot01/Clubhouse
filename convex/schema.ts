import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  activityFeed: defineTable({
    timestamp: v.number(),
    action: v.string(), // "file_created", "search", "api_call", "cron_executed", etc.
    description: v.string(),
    duration_ms: v.number(), // How long the action took
    tokens_used: v.optional(v.number()),
    cost: v.optional(v.number()), // In dollars
    status: v.string(), // "completed", "failed", "in_progress"
    metadata: v.optional(v.any()), // Extra data (file path, search query, etc.)
  }).index("by_timestamp", ["timestamp"]),

  scheduledTasks: defineTable({
    task_id: v.string(), // UUID
    name: v.string(),
    description: v.optional(v.string()),
    schedule: v.object({
      kind: v.string(), // "cron", "every", "at"
      expr: v.optional(v.string()), // For cron
      everyMs: v.optional(v.number()), // For recurring
      atMs: v.optional(v.number()), // For one-shot
    }),
    next_run: v.number(), // Unix timestamp
    model: v.optional(v.string()), // haiku, opus, ollama, etc.
    enabled: v.boolean(),
    created_at: v.number(),
    updated_at: v.number(),
  }).index("by_next_run", ["next_run"]),

  memories: defineTable({
    file_path: v.string(), // e.g., "MEMORY.md", "memory/2026-02-06.md"
    content: v.string(),
    indexed_at: v.number(),
    tags: v.array(v.string()), // For categorization
  }).index("by_file_path", ["file_path"]),

  documents: defineTable({
    file_path: v.string(), // e.g., "projects/yippy-pouches/GROWTH-STRATEGY.md"
    content: v.string(),
    doc_type: v.string(), // "strategy", "research", "marketing", etc.
    indexed_at: v.number(),
  }).index("by_doc_type", ["doc_type"]),
});
