// Sample data for dashboard testing
export const sampleActivities = [
  {
    action: "cron_executed",
    description: "☕ Daily Morning Brief — Friday, February 6, 2026 @ 7:30am EST",
    duration_ms: 8200,
    tokens_used: 4200,
    cost: 0.063,
    status: "completed",
    metadata: { 
      job_id: "daily_morning_brief",
      timestamp: new Date().toISOString(),
      brief_content: `☕ CLUBHOUSE BRIEF — Saturday, February 7, 2026\n\n🌍 GLOBAL TRENDING\n• **Trump Nomination Rattles Markets** — Fed nominee Kevin Warsh announcement sent crypto and tech stocks down 2-3%. Market uncertainty around monetary policy (watch FOMC next week).\n• **Super Bowl Economics** — $600B wagered this year, hospitality + sports betting booming. Brands spending record on ads. Smart time for premium positioning.\n• **Energy Crisis Update** — Oil prices steady at $84/barrel, renewable energy investments accelerating. Clean energy ETFs outperforming.\n\n🤖 TECH/AI\n• **Claude Opus 4.6** — Anthropic's latest shows 15% performance gains on reasoning tasks. Competitors scrambling. Your edge: AI automation getting cheaper daily.\n• **Big Tech CapEx Race** — Google, Meta, Amazon, Microsoft dumping $650B on data centers this year. Supply increase = commoditizing AI models.\n\n📊 BUSINESS & MARKETS\n• **DTC Sector** — E-commerce brands seeing 8-12% conversion lift from AI personalization. CPG companies losing to digital upstarts.\n• **Nicotine Alternatives Boom** — Health-conscious consumer spending up 34% YoY in wellness category. Your timing is excellent.\n\n⚡ YIPPY POUCHES\n✓ Masters golf season starting (brand partnerships ramping)\n✓ Remote work productivity tools trending (desk formula alignment)\n✓ Wellness/health trends favor premium positioning\n⚠ Competitor activity in nicotine alternative space\n\nACTION ITEMS:\n→ Capitalize on Masters marketing window (2 weeks)\n→ Double down on golf influencers (timing is perfect)\n→ Position desk formula around \"focus\" trend\n→ Monitor crypto/tech volatility (affects ad budgets)\n\n═══════════════════════════════════════\nReady for the day. 🎯`
    }
  },
  {
    action: "api_call",
    description: "Searched for golf influencer trends via Brave API",
    duration_ms: 2150,
    tokens_used: 1240,
    cost: 0.0186,
    status: "completed",
    metadata: { source: "brave", query: "golf influencers 2026" }
  },
  {
    action: "search",
    description: "Indexed memory file: MEMORY.md for AI scarcity research",
    duration_ms: 450,
    tokens_used: 0,
    cost: 0,
    status: "completed",
    metadata: { file_path: "MEMORY.md", lines: 342 }
  },
  {
    action: "file_created",
    description: "Generated GROWTH-STRATEGY.md for Yippy Pouches",
    duration_ms: 3200,
    tokens_used: 8542,
    cost: 0.1285,
    status: "completed",
    metadata: { file: "GROWTH-STRATEGY.md", size_kb: 45 }
  },
  {
    action: "api_call",
    description: "Claude analysis: DTC customer acquisition trends",
    duration_ms: 5100,
    tokens_used: 15240,
    cost: 0.2286,
    status: "completed",
    metadata: { model: "claude-opus", input_tokens: 8542, output_tokens: 6698 }
  },
  {
    action: "search",
    description: "Brave search: Competitor nicotine pouch market analysis",
    duration_ms: 1840,
    tokens_used: 980,
    cost: 0.0147,
    status: "completed",
    metadata: { source: "brave", results: 8 }
  },
  {
    action: "cron_executed",
    description: "Daily Morning Brief generated and delivered to Telegram",
    duration_ms: 8200,
    tokens_used: 4200,
    cost: 0.063,
    status: "completed",
    metadata: { job_id: "daily_morning_brief", timestamp: new Date().toISOString() }
  },
  {
    action: "memory_indexed",
    description: "Synced ACTIVITY-LOG.jsonl to Mission Control dashboard",
    duration_ms: 1200,
    tokens_used: 0,
    cost: 0,
    status: "completed",
    metadata: { entries_synced: 1 }
  },
];

export const sampleScheduledTasks = (() => {
  const tasks = [];
  const today = new Date();
  
  // Get Sunday of this week (start of week)
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - today.getDay());
  sunday.setHours(0, 0, 0, 0);
  
  // Create Daily Morning Brief for each day of the week (Sun-Sat)
  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const date = new Date(sunday);
    date.setDate(sunday.getDate() + dayOffset);
    date.setHours(7, 30, 0, 0);
    
    tasks.push({
      task_id: `daily_morning_brief_${dayOffset}`,
      name: "Daily Morning Brief",
      description: "Daily news and market briefing sent at 7:30am EST",
      schedule: { kind: "cron", expr: "30 7 * * *" },
      next_run: date.getTime(),
      model: "haiku",
      enabled: true
    });
  }
  
  return tasks;
})();
