import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET(request: NextRequest) {
  try {
    // Call openclaw cron list
    const { stdout } = await execAsync('openclaw cron list --json 2>/dev/null || echo "{}"');
    const data = JSON.parse(stdout.trim() || '{}');
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Cron list error:', error);
    return NextResponse.json({ jobs: [] }, { status: 500 });
  }
}
