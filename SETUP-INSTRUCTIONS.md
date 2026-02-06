# Mission Control - Setup Instructions

## Overview

Mission Control is a Next.js + Convex dashboard that provides real-time visibility into Yippybot's activities, scheduled tasks, and searchable memory.

## Quick Start (5 minutes)

### Step 1: Clone/Copy the Project

The project is already in your workspace:
```
/home/yippy/.openclaw/workspace/mission-control/
```

Also available in Windows:
```
C:\Users\Yippyops\Documents\Yippy\mission-control\
```

### Step 2: Create Convex Account

1. Go to https://www.convex.dev
2. Sign up (free tier available)
3. Create a new project
4. You'll get a `NEXT_PUBLIC_CONVEX_URL` — save this

### Step 3: Install Dependencies

From the `mission-control` directory:

```bash
npm install
```

This will install:
- next, react, react-dom
- convex, convex-react
- tailwindcss, lucide-react, date-fns

### Step 4: Set Up Convex CLI

```bash
npm install -g convex
convex init
```

This will:
- Ask you to log in
- Create a `.env.local` file with your `NEXT_PUBLIC_CONVEX_URL`
- Ask if you want to create a new Convex project (say yes)

### Step 5: Deploy Schema

```bash
convex push
```

This deploys the database schema to Convex:
- `activityFeed` table (logs all actions)
- `scheduledTasks` table (upcoming cron jobs)
- `memories` table (searchable memory files)
- `documents` table (searchable documents)

### Step 6: Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

You should see:
- **Activity Feed**: Empty initially (will populate as Yippybot logs actions)
- **Calendar View**: Empty (will populate as scheduled tasks are synced)
- **Global Search**: Ready to search

## Integration with Yippybot

### Automatic Activity Logging

After Yippybot completes an action, I'll log it:

```javascript
// Example: File created
await logActivity({
  action: "file_created",
  description: "Created GOLF-INFLUENCERS-100.csv",
  duration_ms: 2500,
  tokens_used: 150,
  cost: 0.0022,
  status: "completed",
  metadata: { file_path: "Research/Golf-Influencers/..." }
});
```

### Activity Types

- `file_created` — File created or updated
- `file_read` — File read from disk
- `search` — Web search executed
- `api_call` — API call made (Convex, Brave, etc.)
- `cron_executed` — Scheduled task ran
- `memory_indexed` — Memory file indexed
- `document_indexed` — Document indexed
- Custom types as needed

### Syncing Scheduled Tasks

Every hour, I'll sync OpenClaw cron jobs to Mission Control:

```javascript
// Pulls from `cron list` and inserts/updates in Convex
const cronJobs = await getCronJobs();
cronJobs.forEach(job => {
  await upsertScheduledTask({
    task_id: job.id,
    name: job.name,
    schedule: job.schedule,
    next_run: job.state.nextRunAtMs,
    model: job.payload.model,
    enabled: job.enabled
  });
});
```

### Indexing Memory Files

When memory files are updated, they're indexed:

```javascript
// Indexes MEMORY.md, memory/*.md, and documents
const memoryContent = await fs.readFile('MEMORY.md', 'utf8');
await indexMemory({
  file_path: "MEMORY.md",
  content: memoryContent,
  tags: ["business", "strategy", "yippy-pouches"]
});
```

## File Structure

```
mission-control/
├── app/
│   ├── page.tsx           # Main dashboard
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/
│   ├── ActivityFeed.tsx    # Activity log component
│   ├── CalendarView.tsx    # Weekly task calendar
│   ├── GlobalSearch.tsx    # Memory/doc search
│   ├── ConvexClientProvider.tsx
│   └── ui/
│       └── Tabs.tsx        # Radix UI Tabs
├── convex/
│   ├── schema.ts          # Database schema
│   └── functions.ts       # Backend queries/mutations
├── package.json
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── .env.example
├── README.md
└── SETUP-INSTRUCTIONS.md  # This file
```

## Troubleshooting

### "NEXT_PUBLIC_CONVEX_URL is not set"

Add to `.env.local`:
```
NEXT_PUBLIC_CONVEX_URL=https://your-team.convex.cloud
```

Find your URL in Convex dashboard → Settings → URL

### "Port 3000 is already in use"

Run on a different port:
```bash
npm run dev -- -p 3001
```

### "Schema mismatch"

Push the latest schema:
```bash
convex push
```

### Activity Feed is empty

Activities are only logged when Yippybot takes actions. The integration code needs to be added to the main Yippybot script to call `logActivity` after each action.

## Next Steps

1. ✅ Set up and run locally
2. 🔄 Integrate activity logging into Yippybot
3. 🔄 Set up cron job syncing
4. 🔄 Index memory files on startup
5. 🚀 Deploy to Vercel (optional)

## Deployment (Optional)

Deploy to Vercel for remote access:

```bash
npm install -g vercel
vercel
```

Choose:
- Project name: `mission-control`
- Framework: Next.js
- Deploy

Then set environment variables in Vercel dashboard:
```
NEXT_PUBLIC_CONVEX_URL=https://your-team.convex.cloud
```

## Support

Questions? Reach out to Mike (@Onesnipy).

---

**Status**: MVP complete. Ready for Yippybot integration.
