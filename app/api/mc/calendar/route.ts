import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const CALENDAR_FILE = path.join(process.cwd(), 'data', 'calendar-events.json');

async function ensureFile() {
  const dir = path.dirname(CALENDAR_FILE);
  await fs.mkdir(dir, { recursive: true });
  try {
    await fs.access(CALENDAR_FILE);
  } catch {
    await fs.writeFile(CALENDAR_FILE, '[]', 'utf-8');
  }
}

async function readEvents(): Promise<any[]> {
  await ensureFile();
  const raw = await fs.readFile(CALENDAR_FILE, 'utf-8');
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeEvents(events: any[]) {
  await ensureFile();
  await fs.writeFile(CALENDAR_FILE, JSON.stringify(events, null, 2), 'utf-8');
}

// GET — retrieve all events
export async function GET(request: Request) {
  try {
    const events = await readEvents();
    
    // Sort by date
    events.sort((a: any, b: any) => a.date.localeCompare(b.date));
    
    return NextResponse.json({ events, count: events.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST — add a new event
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, title, date, endDate, type, time, description, color } = body;
    
    if (!title || !date) {
      return NextResponse.json({ error: 'title and date are required' }, { status: 400 });
    }
    
    let events = await readEvents();
    
    const newEvent = {
      id: id || `event_${Date.now()}`,
      title,
      date,
      endDate: endDate || null,
      type: type || 'personal',
      time: time || null,
      description: description || null,
      color: color || '#60a5fa',
      createdAt: new Date().toISOString()
    };
    
    // If updating an existing event, replace it
    if (id) {
      events = events.filter((e: any) => e.id !== id);
    }
    
    events.push(newEvent);
    await writeEvents(events);
    
    return NextResponse.json({ success: true, event: newEvent });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE — remove an event
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }
    
    let events = await readEvents();
    events = events.filter((e: any) => e.id !== id);
    await writeEvents(events);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
