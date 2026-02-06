# Mission Control - Yippybot Dashboard

Real-time monitoring and control dashboard for Yippybot activities, scheduled tasks, and memory search.

## Features

- **Activity Feed**: Track every action Yippybot takes with detailed logs, token usage, and costs
- **Calendar View**: Weekly view of all scheduled tasks with run times and models
- **Global Search**: Full-text search across memories, documents, and past conversations

## Tech Stack

- **Frontend**: Next.js 14 + React 18
- **Database**: Convex (serverless backend)
- **UI**: Tailwind CSS + Lucide Icons
- **Type Safety**: TypeScript

## Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Convex account (free at https://www.convex.dev)

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up Convex**:
   ```bash
   npm install -g convex
   convex init
   ```
   This will create a `.env.local` file with your `NEXT_PUBLIC_CONVEX_URL`

3. **Deploy Convex schema**:
   ```bash
   convex push
   ```

4. **Create .env.local**:
   ```bash
   cp .env.example .env.local
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   ```

6. **Open** [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Logging Activities

Activities are automatically logged by Yippybot via the `logActivity` mutation:

```typescript
await ctx.db.insert("activityFeed", {
  timestamp: Date.now(),
  action: "file_created",
  description: "Created GROWTH-STRATEGY.md",
  duration_ms: 1200,
  tokens_used: 4500,
  cost: 0.067,
  status: "completed",
  metadata: { file_path: "/projects/yippy-pouches/..." }
});
```

### Indexing Memories & Documents

Memories and documents are automatically indexed for search:

```typescript
await ctx.db.insert("memories", {
  file_path: "MEMORY.md",
  content: "Full file content...",
  tags: ["business", "sales", "strategy"],
  indexed_at: Date.now()
});
```

### Pulling Scheduled Tasks

Scheduled tasks (cron jobs) are pulled from OpenClaw config and synced to Convex:

```typescript
await ctx.db.insert("scheduledTasks", {
  task_id: "daily-news-briefing",
  name: "Daily News Briefing",
  schedule: { kind: "cron", expr: "0 8 * * *" },
  next_run: 1770469200000,
  model: "haiku",
  enabled: true,
  created_at: Date.now(),
  updated_at: Date.now()
});
```

## Dashboard Sections

### Activity Feed

- **Stats**: Total actions, tokens used, API cost, daily budget percentage
- **Feed**: Chronological log of all actions with status, duration, tokens, and cost
- **Filtering**: Filter by action type (coming soon)

### Calendar View

- **Weekly View**: See all tasks scheduled for this week, grouped by day
- **Task Details**: Task name, description, run time, model, and enabled status
- **Quick Stats**: Total scheduled tasks and time until next task

### Global Search

- **Full-Text Search**: Search across memory files and documents
- **Results**: Organized by type (Memory vs Document)
- **Tags**: Memory tags for quick categorization

## Integration with Yippybot

To integrate Mission Control with Yippybot:

1. After each action, call `logActivity`:
   ```javascript
   await fetch('/api/activity', {
     method: 'POST',
     body: JSON.stringify({
       action: 'api_call',
       description: 'Brave Search query',
       duration_ms: 1500,
       tokens_used: 200,
       cost: 0.003,
       status: 'completed'
     })
   });
   ```

2. Periodically sync cron jobs:
   ```bash
   npx convex run syncScheduledTasks
   ```

3. Index updated memories:
   ```bash
   npx convex run indexMemoryFile --file_path MEMORY.md
   ```

## Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_CONVEX_URL=https://your-team-name.convex.cloud
```

## Performance

- **Real-time updates**: Uses Convex subscriptions for instant data
- **Pagination**: Activity feed loads in chunks (adjust limit in `getActivityFeed`)
- **Indexing**: Full-text search optimized with Convex indexes

## Future Enhancements

- [ ] Filter activity feed by action type
- [ ] Export activity logs to CSV
- [ ] Custom date range for activity stats
- [ ] Task execution history
- [ ] Custom alerts for high token usage
- [ ] Team collaboration features
- [ ] Dark/Light mode toggle
- [ ] Mobile responsive design

## Support

For issues or feature requests, contact Mike (@Onesnipy on Telegram).

---

Built with ❤️ for Yippybot Mission Control
