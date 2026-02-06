# Activity Logging Specification

**Purpose**: Every action Yippybot takes is logged to Mission Control for real-time visibility, token tracking, and cost transparency.

---

## What Gets Logged

### 1. File Operations
- **Trigger**: After any file read/write/delete/move
- **Data**: file path, operation type, duration
- **Tokens/Cost**: Included if API was used

```
Action: file_created
Description: Created GROWTH-STRATEGY.md
Duration: 1200ms
Tokens: N/A (local operation)
```

### 2. Web Searches
- **Trigger**: After each Brave Search API call
- **Data**: search query, result count, duration
- **Tokens/Cost**: Brave API cost (~$0.01-0.02 per search)

```
Action: search
Description: Web search: "golf influencers" (42 results)
Duration: 1500ms
Tokens: 0
Cost: $0.015
```

### 3. API Calls
- **Trigger**: After Convex, OpenAI, Brave, or other API calls
- **Data**: API name, endpoint, duration
- **Tokens/Cost**: Actual token count + calculated cost

```
Action: api_call
Description: Convex → logActivity
Duration: 250ms
Tokens: 150
Cost: $0.00012
```

### 4. Scheduled Tasks (Cron)
- **Trigger**: After each cron job execution
- **Data**: job name, job ID, duration
- **Tokens/Cost**: Ollama (free) or Claude (charged)

```
Action: cron_executed
Description: Cron job: Daily News Briefing
Duration: 5000ms
Tokens: 2500
Cost: $0.002
```

### 5. Memory Indexing
- **Trigger**: When memory files are read/indexed for search
- **Data**: file path, lines indexed, duration
- **Tokens/Cost**: Usually zero (local operation)

```
Action: memory_indexed
Description: Indexed memory: MEMORY.md (250 lines)
Duration: 800ms
Tokens: 0
Cost: $0.00
```

---

## Integration Points

### Immediate Integration (This Session)

I will manually log activities after major tasks using the `logActivity()` function from `lib/activityLogger.ts`:

```typescript
// After a file operation
await logFileOperation("write", "Research/Golf-Influencers/list.csv", 1200, 0, 0);

// After a web search
await logSearch("golf influencers", 42, 1500, 0, 0.015, "web");

// After an API call
await logAPICall("Brave", "/search", 1500, 0, 0.015);
```

### Future Integration (Automated)

Once the main Yippybot workflow is updated, I'll automatically:
- Wrap file operations with logging
- Log every API call with actual token count
- Sync cron job results
- Index memory files with logging
- Track execution time for every action

---

## Token & Cost Tracking

### Token Estimation

**Haiku (default)**
- Input: $0.80 per 1M tokens
- Output: $0.80 per 1M tokens
- Formula: `(input_tokens + output_tokens) * 0.0000008`

**Opus (complex reasoning)**
- Input: $15 per 1M tokens
- Output: $15 per 1M tokens  
- Formula: `(input_tokens + output_tokens) * 0.000015`

**Ollama (local)**
- Cost: $0.00 (free, runs locally)

### Daily Budget

- **Limit**: $5.00/day
- **Warning**: 75% usage ($3.75) triggers notification
- **Breakdown**: Web searches, API calls, Claude usage

---

## Dashboard Views

### Activity Feed
- Chronological log of all actions
- Stats: total actions, tokens used, cost, % of daily budget
- Filters: by action type, status, date range

### Calendar View
- Weekly schedule of upcoming cron jobs
- Task details: name, model, enabled status, next run time
- Color-coded by model (Haiku=blue, Opus=purple, Ollama=green)

### Global Search
- Full-text search across indexed memories and documents
- Results organized by type
- Tag-based filtering

---

## Example Daily Log

```
[09:00 AM] cron_executed: Daily News Briefing (2500 tokens, $0.002)
[10:30 AM] search: "golf market trends" (15 results, $0.01)
[11:00 AM] api_call: Convex → globalSearch (150 tokens, $0.00012)
[02:00 PM] file_created: GOLF-INFLUENCERS-100.csv (0 tokens, $0.00)
[03:15 PM] search: "golf influencer marketing" (42 results, $0.015)
[04:00 PM] api_call: Brave → search (0 tokens, $0.015)

Daily Totals:
- Total Actions: 6
- Total Tokens: 2650
- Total Cost: $0.042
- Daily Budget Used: 0.84%
```

---

## Status

- ✅ Activity logger created (`lib/activityLogger.ts`)
- ✅ Logging functions ready for integration
- ⏳ Manual logging starting now
- ⏳ Automated integration pending main workflow update

---

**Next**: Start logging activities to Mission Control. Every action = visible, tracked, and transparent.
