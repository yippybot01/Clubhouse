import { NextResponse } from 'next/server';

const SERVER_START = new Date();

export async function GET() {
  const uptime = Math.floor((Date.now() - SERVER_START.getTime()) / 1000);
  
  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);
    
    return parts.join(' ');
  };
  
  return NextResponse.json({
    status: 'online',
    uptime: uptime,
    uptimeFormatted: formatUptime(uptime),
    lastRefresh: new Date().toISOString(),
    serverTime: new Date().toISOString(),
    version: '1.0.0'
  });
}
