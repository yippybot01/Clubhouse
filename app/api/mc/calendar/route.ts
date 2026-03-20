import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Read cron jobs from OpenClaw's cron state file
const CRON_STATE = '/home/yippy/.openclaw/gateway/cron-jobs.json';

interface CronJob {
  id: string;
  name: string;
  enabled: boolean;
  schedule: any;
  payload: any;
  state?: any;
  delivery?: any;
}

interface CalendarEvent {
  id: string;
  name: string;
  time: string; // HH:MM
  hour: number;
  minute: number;
  type: 'cron' | 'interval' | 'one-shot';
  frequency: string;
  enabled: boolean;
  model?: string;
  lastRun?: string;
  lastStatus?: string;
  nextRun?: string;
  daysOfWeek?: number[]; // 0=Sun..6=Sat, null=every day
  color: string;
}

const COLORS = [
  '#f87171', // red
  '#fb923c', // orange
  '#fbbf24', // amber
  '#4ade80', // green
  '#60a5fa', // blue
  '#c084fc', // purple
  '#f472b6', // pink
  '#2dd4bf', // teal
];

export async function GET(request: NextRequest) {
  try {
    let jobs: CronJob[] = [];

    if (fs.existsSync(CRON_STATE)) {
      const raw = fs.readFileSync(CRON_STATE, 'utf-8');
      const data = JSON.parse(raw);
      jobs = Array.isArray(data) ? data : (data.jobs || []);
    }

    const events: CalendarEvent[] = [];
    let colorIdx = 0;

    for (const job of jobs) {
      const color = COLORS[colorIdx % COLORS.length];
      colorIdx++;

      if (job.schedule?.kind === 'cron' && job.schedule.expr) {
        // Parse cron expression: min hour dom month dow
        const parts = job.schedule.expr.split(/\s+/);
        if (parts.length >= 5) {
          const min = parseInt(parts[0]) || 0;
          const hour = parseInt(parts[1]) || 0;
          const dow = parts[4]; // day of week

          let daysOfWeek: number[] | undefined;
          if (dow !== '*') {
            daysOfWeek = dow.split(',').map((d: string) => parseInt(d));
          }

          const timeStr = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
          const tz = job.schedule.tz || 'UTC';

          events.push({
            id: job.id,
            name: job.name || 'Unnamed Job',
            time: timeStr,
            hour,
            minute: min,
            type: 'cron',
            frequency: formatCronExpr(job.schedule.expr, tz),
            enabled: job.enabled !== false,
            model: job.payload?.model,
            lastRun: job.state?.lastRunAtMs ? new Date(job.state.lastRunAtMs).toISOString() : undefined,
            lastStatus: job.state?.lastStatus,
            nextRun: job.state?.nextRunAtMs ? new Date(job.state.nextRunAtMs).toISOString() : undefined,
            daysOfWeek,
            color
          });
        }
      } else if (job.schedule?.kind === 'every') {
        const ms = job.schedule.everyMs || 0;
        const hours = ms / 3600000;
        const mins = ms / 60000;

        events.push({
          id: job.id,
          name: job.name || 'Unnamed Job',
          time: '--:--',
          hour: -1,
          minute: 0,
          type: 'interval',
          frequency: hours >= 1 ? `Every ${hours}h` : `Every ${mins}m`,
          enabled: job.enabled !== false,
          model: job.payload?.model,
          lastRun: job.state?.lastRunAtMs ? new Date(job.state.lastRunAtMs).toISOString() : undefined,
          lastStatus: job.state?.lastStatus,
          nextRun: job.state?.nextRunAtMs ? new Date(job.state.nextRunAtMs).toISOString() : undefined,
          color
        });
      } else if (job.schedule?.kind === 'at') {
        const atDate = new Date(job.schedule.at);
        events.push({
          id: job.id,
          name: job.name || 'Unnamed Job',
          time: atDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
          hour: atDate.getHours(),
          minute: atDate.getMinutes(),
          type: 'one-shot',
          frequency: `Once at ${atDate.toLocaleDateString()}`,
          enabled: job.enabled !== false,
          model: job.payload?.model,
          lastRun: job.state?.lastRunAtMs ? new Date(job.state.lastRunAtMs).toISOString() : undefined,
          lastStatus: job.state?.lastStatus,
          nextRun: job.schedule.at,
          daysOfWeek: [atDate.getDay()],
          color
        });
      }
    }

    // Sort by time
    events.sort((a, b) => {
      if (a.hour === -1) return -1;
      if (b.hour === -1) return 1;
      return a.hour * 60 + a.minute - (b.hour * 60 + b.minute);
    });

    return NextResponse.json({ events, totalJobs: jobs.length });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to load calendar', message: error.message },
      { status: 500 }
    );
  }
}

function formatCronExpr(expr: string, tz: string): string {
  const parts = expr.split(/\s+/);
  if (parts.length < 5) return expr;

  const [min, hour, dom, month, dow] = parts;
  let desc = '';

  if (dow === '*' && dom === '*') desc = 'Daily';
  else if (dow !== '*') {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayNames = dow.split(',').map((d: string) => days[parseInt(d)] || d).join(', ');
    desc = dayNames;
  } else {
    desc = expr;
  }

  const h = parseInt(hour);
  const m = parseInt(min);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  const timeStr = `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;

  const tzShort = tz === 'America/New_York' ? 'EST' : tz;
  return `${desc} at ${timeStr} ${tzShort}`;
}
