import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Log an activity to the feed
export const logActivity = mutation({
  args: {
    action: v.string(),
    description: v.string(),
    duration_ms: v.number(),
    tokens_used: v.optional(v.number()),
    cost: v.optional(v.number()),
    status: v.string(),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("activityFeed", {
      timestamp: Date.now(),
      ...args,
    });
  },
});

// Get activity feed (last N entries)
export const getActivityFeed = query({
  args: { limit: v.number() },
  handler: async (ctx, args) => {
    const activities = await ctx.db
      .query("activityFeed")
      .order("desc")
      .take(args.limit);
    return activities;
  },
});

// Add or update a scheduled task
export const upsertScheduledTask = mutation({
  args: {
    task_id: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    schedule: v.object({
      kind: v.string(),
      expr: v.optional(v.string()),
      everyMs: v.optional(v.number()),
      atMs: v.optional(v.number()),
    }),
    next_run: v.number(),
    model: v.optional(v.string()),
    enabled: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("scheduledTasks")
      .filter((q) => q.eq(q.field("task_id"), args.task_id))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args,
        updated_at: Date.now(),
      });
    } else {
      await ctx.db.insert("scheduledTasks", {
        ...args,
        created_at: Date.now(),
        updated_at: Date.now(),
      });
    }
  },
});

// Get all scheduled tasks
export const getScheduledTasks = query({
  handler: async (ctx) => {
    const tasks = await ctx.db.query("scheduledTasks").collect();
    return tasks.sort((a, b) => a.next_run - b.next_run);
  },
});

// Index a memory file
export const indexMemory = mutation({
  args: {
    file_path: v.string(),
    content: v.string(),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("memories")
      .filter((q) => q.eq(q.field("file_path"), args.file_path))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        content: args.content,
        indexed_at: Date.now(),
        tags: args.tags,
      });
    } else {
      await ctx.db.insert("memories", {
        ...args,
        indexed_at: Date.now(),
      });
    }
  },
});

// Index a document
export const indexDocument = mutation({
  args: {
    file_path: v.string(),
    content: v.string(),
    doc_type: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("documents")
      .filter((q) => q.eq(q.field("file_path"), args.file_path))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        content: args.content,
        doc_type: args.doc_type,
        indexed_at: Date.now(),
      });
    } else {
      await ctx.db.insert("documents", {
        ...args,
        indexed_at: Date.now(),
      });
    }
  },
});

// Global search across memories and documents
export const globalSearch = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const searchTerm = args.query.toLowerCase();

    const memories = await ctx.db.query("memories").collect();
    const documents = await ctx.db.query("documents").collect();

    const memoryResults = memories.filter(
      (m) =>
        m.content.toLowerCase().includes(searchTerm) ||
        m.file_path.toLowerCase().includes(searchTerm) ||
        m.tags.some((t) => t.toLowerCase().includes(searchTerm))
    );

    const docResults = documents.filter(
      (d) =>
        d.content.toLowerCase().includes(searchTerm) ||
        d.file_path.toLowerCase().includes(searchTerm)
    );

    return {
      memories: memoryResults.map((m) => ({
        ...m,
        type: "memory",
      })),
      documents: docResults.map((d) => ({
        ...d,
        type: "document",
      })),
    };
  },
});

// Get activity stats (for dashboard summary)
export const getActivityStats = query({
  args: { last_hours: v.number() },
  handler: async (ctx, args) => {
    const cutoff = Date.now() - args.last_hours * 60 * 60 * 1000;
    const activities = await ctx.db
      .query("activityFeed")
      .filter((q) => q.gt(q.field("timestamp"), cutoff))
      .collect();

    const totalTokens = activities.reduce((sum, a) => sum + (a.tokens_used || 0), 0);
    const totalCost = activities.reduce((sum, a) => sum + (a.cost || 0), 0);
    const totalActions = activities.length;

    return {
      total_actions: totalActions,
      total_tokens: totalTokens,
      total_cost: totalCost,
      actions_by_type: activities.reduce(
        (acc, a) => {
          acc[a.action] = (acc[a.action] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      ),
    };
  },
});
