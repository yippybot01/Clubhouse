import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const TASKS_FILE = path.join(process.cwd(), 'data', 'tasks.json');

function readTasks() {
  if (!fs.existsSync(TASKS_FILE)) return [];
  const raw = fs.readFileSync(TASKS_FILE, 'utf-8');
  const data = JSON.parse(raw);
  return data.tasks || [];
}

function writeTasks(tasks: any[]) {
  const dir = path.dirname(TASKS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(TASKS_FILE, JSON.stringify({ tasks }, null, 2));
}

export async function GET(request: NextRequest) {
  try {
    const tasks = readTasks();
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const assignee = searchParams.get('assignee');

    let filtered = tasks;
    if (status) filtered = filtered.filter((t: any) => t.status === status);
    if (assignee) filtered = filtered.filter((t: any) => t.assignee === assignee);

    const stats = {
      total: tasks.length,
      backlog: tasks.filter((t: any) => t.status === 'backlog').length,
      inProgress: tasks.filter((t: any) => t.status === 'in-progress').length,
      review: tasks.filter((t: any) => t.status === 'review').length,
      done: tasks.filter((t: any) => t.status === 'done').length,
      completion: tasks.length > 0 ? Math.round(tasks.filter((t: any) => t.status === 'done').length / tasks.length * 100) : 0
    };

    return NextResponse.json({ tasks: filtered, stats });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const tasks = readTasks();

    if (body.action === 'create') {
      const task = {
        id: 't' + Date.now().toString(36),
        title: body.title || 'Untitled Task',
        description: body.description || '',
        status: body.status || 'backlog',
        assignee: body.assignee || 'yippybot',
        project: body.project || 'General',
        priority: body.priority || 'medium',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      tasks.push(task);
      writeTasks(tasks);
      return NextResponse.json({ task, success: true });
    }

    if (body.action === 'update') {
      const idx = tasks.findIndex((t: any) => t.id === body.id);
      if (idx === -1) return NextResponse.json({ error: 'Task not found' }, { status: 404 });
      
      const allowed = ['title', 'description', 'status', 'assignee', 'project', 'priority'];
      allowed.forEach(key => {
        if (body[key] !== undefined) tasks[idx][key] = body[key];
      });
      tasks[idx].updatedAt = new Date().toISOString();
      writeTasks(tasks);
      return NextResponse.json({ task: tasks[idx], success: true });
    }

    if (body.action === 'delete') {
      const filtered = tasks.filter((t: any) => t.id !== body.id);
      writeTasks(filtered);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
