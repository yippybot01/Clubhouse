import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';

const CACHE_FILE = join(process.cwd(), 'data', 'brand-analysis.json');

async function ensureFile() {
  try {
    await mkdir(dirname(CACHE_FILE), { recursive: true });
  } catch {}
  try {
    await readFile(CACHE_FILE, 'utf-8');
  } catch {
    await writeFile(CACHE_FILE, JSON.stringify({ brand: {}, competitors: [], recommendations: [], lastUpdated: null }, null, 2));
  }
}

// GET: Return cached brand analysis
export async function GET(request: NextRequest) {
  try {
    await ensureFile();
    const cached = await readFile(CACHE_FILE, 'utf-8');
    const data = JSON.parse(cached);
    return NextResponse.json(data);
  } catch (error) {
    console.error('GET /api/mc/brand error:', error);
    return NextResponse.json(
      { error: 'Failed to load brand analysis' },
      { status: 500 }
    );
  }
}

// POST: Accept updated brand analysis data (from agent or manual refresh)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // If body has brand data, merge/replace
    if (body.brand || body.recommendations || body.competitors) {
      body.lastUpdated = new Date().toISOString();
      await writeFile(CACHE_FILE, JSON.stringify(body, null, 2));
      return NextResponse.json(body);
    }
    
    // Otherwise just return cached with refreshed timestamp
    await ensureFile();
    const cached = JSON.parse(await readFile(CACHE_FILE, 'utf-8'));
    cached.lastUpdated = new Date().toISOString();
    await writeFile(CACHE_FILE, JSON.stringify(cached, null, 2));
    return NextResponse.json(cached);
  } catch (error) {
    console.error('POST /api/mc/brand error:', error);
    return NextResponse.json(
      { error: 'Failed to update brand analysis' },
      { status: 500 }
    );
  }
}
