import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const NEWS_FILE = path.join(process.cwd(), 'data', 'morning-news.json');

function readNews() {
  if (!fs.existsSync(NEWS_FILE)) return [];
  const raw = fs.readFileSync(NEWS_FILE, 'utf-8');
  const data = JSON.parse(raw);
  return data.briefs || [];
}

function writeNews(briefs: any[]) {
  const dir = path.dirname(NEWS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(NEWS_FILE, JSON.stringify({ briefs }, null, 2));
}

export async function GET(request: NextRequest) {
  try {
    const briefs = readNews();
    // Sort by timestamp descending (newest first)
    briefs.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return NextResponse.json({ briefs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const briefs = readNews();

    const newBrief = {
      id: `news_${Date.now()}`,
      timestamp: body.timestamp || new Date().toISOString(),
      content: body.content || '',
      market: body.market || null,
      weather: body.weather || null,
      structured: body.structured || false,
      createdAt: new Date().toISOString()
    };

    briefs.push(newBrief);
    
    // Keep last 30 days
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const filtered = briefs.filter((b: any) => 
      new Date(b.timestamp).getTime() > thirtyDaysAgo
    );

    writeNews(filtered);
    return NextResponse.json({ success: true, brief: newBrief });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
