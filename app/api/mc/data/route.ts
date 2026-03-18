import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), 'data');
const DATA_FILE = join(DATA_DIR, 'mc-data.json');

async function ensureDataFile() {
  try {
    await mkdir(DATA_DIR, { recursive: true });
    try {
      await readFile(DATA_FILE);
    } catch {
      const initialData = {
        lastUpdated: new Date().toISOString(),
        revenue: 0,
        orders: 0,
        mrr: 0,
        tasks: [],
        notes: ''
      };
      await writeFile(DATA_FILE, JSON.stringify(initialData, null, 2));
    }
  } catch (error) {
    console.error('Error initializing data file:', error);
  }
}

export async function GET() {
  try {
    await ensureDataFile();
    const data = await readFile(DATA_FILE, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to read data', message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDataFile();
    const body = await request.json();
    const data = {
      ...body,
      lastUpdated: new Date().toISOString()
    };
    await writeFile(DATA_FILE, JSON.stringify(data, null, 2));
    return NextResponse.json({ success: true, message: 'Data saved successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to save data', message: error.message },
      { status: 500 }
    );
  }
}
