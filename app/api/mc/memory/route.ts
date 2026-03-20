import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const WORKSPACE = '/home/yippy/.openclaw/workspace';
const MEMORY_DIR = path.join(WORKSPACE, 'memory');
const MEMORY_FILE = path.join(WORKSPACE, 'MEMORY.md');

interface MemoryFile {
  name: string;
  path: string;
  type: 'long-term' | 'daily';
  date?: string;
  size: number;
  words: number;
  modified: string;
  content: string;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get('search')?.toLowerCase() || '';
  const file = searchParams.get('file') || '';

  try {
    const files: MemoryFile[] = [];

    // Load MEMORY.md (long-term)
    if (fs.existsSync(MEMORY_FILE)) {
      const content = fs.readFileSync(MEMORY_FILE, 'utf-8');
      const stat = fs.statSync(MEMORY_FILE);
      files.push({
        name: 'Long-Term Memory',
        path: 'MEMORY.md',
        type: 'long-term',
        size: stat.size,
        words: content.split(/\s+/).filter(Boolean).length,
        modified: stat.mtime.toISOString(),
        content
      });
    }

    // Load daily memory files
    if (fs.existsSync(MEMORY_DIR)) {
      const dailyFiles = fs.readdirSync(MEMORY_DIR)
        .filter(f => f.endsWith('.md'))
        .sort()
        .reverse();

      for (const fname of dailyFiles) {
        const fpath = path.join(MEMORY_DIR, fname);
        const content = fs.readFileSync(fpath, 'utf-8');
        const stat = fs.statSync(fpath);
        const dateMatch = fname.match(/(\d{4}-\d{2}-\d{2})/);

        files.push({
          name: fname.replace('.md', ''),
          path: `memory/${fname}`,
          type: 'daily',
          date: dateMatch ? dateMatch[1] : undefined,
          size: stat.size,
          words: content.split(/\s+/).filter(Boolean).length,
          modified: stat.mtime.toISOString(),
          content
        });
      }
    }

    // If requesting a specific file
    if (file) {
      const found = files.find(f => f.path === file);
      if (found) {
        return NextResponse.json({ file: found });
      }
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Search filter
    let filtered = files;
    if (search) {
      filtered = files.filter(f =>
        f.content.toLowerCase().includes(search) ||
        f.name.toLowerCase().includes(search)
      );
    }

    // Return list (without full content for listing) + stats
    const list = filtered.map(f => ({
      name: f.name,
      path: f.path,
      type: f.type,
      date: f.date,
      size: f.size,
      words: f.words,
      modified: f.modified,
      // Include snippet if searching
      snippet: search ? getSnippet(f.content, search) : undefined,
      matchCount: search ? countMatches(f.content.toLowerCase(), search) : undefined
    }));

    const totalWords = files.reduce((sum, f) => sum + f.words, 0);
    const totalSize = files.reduce((sum, f) => sum + f.size, 0);

    return NextResponse.json({
      files: list,
      stats: {
        totalFiles: files.length,
        totalWords,
        totalSize,
        dailyCount: files.filter(f => f.type === 'daily').length,
        oldestDate: files.filter(f => f.date).map(f => f.date).pop(),
        newestDate: files.filter(f => f.date).map(f => f.date).shift()
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to load memory files', message: error.message },
      { status: 500 }
    );
  }
}

function getSnippet(content: string, search: string): string {
  const lower = content.toLowerCase();
  const idx = lower.indexOf(search);
  if (idx === -1) return '';
  const start = Math.max(0, idx - 80);
  const end = Math.min(content.length, idx + search.length + 80);
  let snippet = content.slice(start, end).replace(/\n/g, ' ');
  if (start > 0) snippet = '...' + snippet;
  if (end < content.length) snippet = snippet + '...';
  return snippet;
}

function countMatches(content: string, search: string): number {
  let count = 0;
  let pos = 0;
  while ((pos = content.indexOf(search, pos)) !== -1) {
    count++;
    pos += search.length;
  }
  return count;
}
