import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), 'data');
const ACTIVITY_FILE = join(DATA_DIR, 'mc-activity.json');

async function ensureActivityFile() {
  try {
    await mkdir(DATA_DIR, { recursive: true });
    try {
      await readFile(ACTIVITY_FILE);
    } catch {
      await writeFile(ACTIVITY_FILE, JSON.stringify([], null, 2));
    }
  } catch (error) {
    console.error('Error initializing activity file:', error);
  }
}

export async function GET(request: NextRequest) {
  try {
    await ensureActivityFile();
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');
    
    const data = await readFile(ACTIVITY_FILE, 'utf8');
    const activities = JSON.parse(data);
    
    // Return last N entries (most recent first)
    const recent = activities.slice(-limit).reverse();
    return NextResponse.json(recent);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to read activity log', message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureActivityFile();
    const { action, description, category } = await request.json();
    
    const data = await readFile(ACTIVITY_FILE, 'utf8');
    const activities = JSON.parse(data);
    
    const newEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      action: action || 'Activity',
      description: description || '',
      category: category || 'general'
    };
    
    activities.push(newEntry);
    
    // Keep last 500 entries
    const trimmed = activities.slice(-500);
    
    await writeFile(ACTIVITY_FILE, JSON.stringify(trimmed, null, 2));
    return NextResponse.json({ success: true, entry: newEntry });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to save activity', message: error.message },
      { status: 500 }
    );
  }
}
