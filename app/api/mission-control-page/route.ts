import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    const htmlPath = join(process.cwd(), 'public', 'mission-control.html');
    const html = await readFile(htmlPath, 'utf-8');
    
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error: any) {
    return new NextResponse('Mission Control page not found', { status: 404 });
  }
}
