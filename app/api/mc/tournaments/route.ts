import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const TOURNAMENTS_FILE = path.join(process.cwd(), 'data', 'golf-tournaments-2026.json');

export async function GET(request: NextRequest) {
  try {
    if (!fs.existsSync(TOURNAMENTS_FILE)) {
      return NextResponse.json({ tournaments: [] });
    }

    const raw = fs.readFileSync(TOURNAMENTS_FILE, 'utf-8');
    const data = JSON.parse(raw);
    
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type'); // major, regular, designated, playoffs
    const tour = searchParams.get('tour'); // PGA, LIV, TGL
    const upcoming = searchParams.get('upcoming'); // true/false
    
    let tournaments = data.tournaments || [];
    
    // Filter by type
    if (type) {
      tournaments = tournaments.filter((t: any) => t.type === type);
    }
    
    // Filter by tour
    if (tour) {
      tournaments = tournaments.filter((t: any) => t.tour === tour);
    }
    
    // Filter upcoming only
    if (upcoming === 'true') {
      const now = new Date();
      tournaments = tournaments.filter((t: any) => new Date(t.startDate) > now);
    }
    
    // Sort by start date
    tournaments.sort((a: any, b: any) => 
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
    
    return NextResponse.json({ tournaments });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
