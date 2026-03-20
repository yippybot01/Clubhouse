import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const TRENDS_FILE = path.join(process.cwd(), 'data', 'trends.json');

async function ensureFile() {
  const dir = path.dirname(TRENDS_FILE);
  await fs.mkdir(dir, { recursive: true });
  try {
    await fs.access(TRENDS_FILE);
  } catch {
    await fs.writeFile(TRENDS_FILE, '[]', 'utf-8');
  }
}

async function readTrends(): Promise<any[]> {
  await ensureFile();
  const raw = await fs.readFile(TRENDS_FILE, 'utf-8');
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeTrends(trends: any[]) {
  await ensureFile();
  await fs.writeFile(TRENDS_FILE, JSON.stringify(trends, null, 2), 'utf-8');
}

// GET — retrieve trends (optional ?days=14 filter, ?search=keyword)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '1');
    const search = (searchParams.get('search') || '').toLowerCase();
    
    let trends = await readTrends();
    
    // Filter by date range
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    trends = trends.filter((t: any) => new Date(t.timestamp) >= cutoff);
    
    // Filter by search term
    if (search) {
      trends = trends.filter((t: any) => 
        (t.content || '').toLowerCase().includes(search) ||
        (t.type || '').toLowerCase().includes(search)
      );
    }
    
    // Sort reverse chronological by actual creation time
    trends.sort((a: any, b: any) => new Date(b.createdAt || b.timestamp).getTime() - new Date(a.createdAt || a.timestamp).getTime());
    
    return NextResponse.json({ trends, count: trends.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST — add a new trend update
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, content, timestamp } = body;
    
    if (!type || !content) {
      return NextResponse.json({ error: 'type and content are required' }, { status: 400 });
    }
    
    const trends = await readTrends();
    
    const entry = {
      id: `trend_${Date.now()}`,
      type, // morning, midday, evening
      content,
      timestamp: timestamp || new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    
    trends.push(entry);
    
    // Keep max 60 days of data (3 per day * 60 = 180 entries max)
    const maxAge = new Date();
    maxAge.setDate(maxAge.getDate() - 60);
    const filtered = trends.filter((t: any) => new Date(t.timestamp) >= maxAge);
    
    await writeTrends(filtered);
    
    return NextResponse.json({ success: true, entry });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
