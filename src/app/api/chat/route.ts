// src/app/api/chat/route.ts
import { NextRequest } from 'next/server';
import { SYSTEM_PROMPT } from './prompt';
import { toolRegistry } from './tools/tool-registry';

export const config = {
  runtime: 'nodejs',
  maxDuration: 45,
};

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const API_KEY = process.env.OPENROUTER_API_KEY!;

// Convert toolRegistry into function call definitions
const FUNCTIONS = Object.entries(toolRegistry).map(([name, tool]) => ({
  name,
  description: tool.description || 'No description provided.',
  parameters: tool.parameters,
}));

function errorHandler(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === 'string') return e;
  return 'Unknown error';
}

export async function POST(req: NextRequest): Promise<Response> {
  let body;
  try {
    body = await req.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }
  const { messages } = body;
  if (!Array.isArray(messages)) {
    return new Response('`messages` must be an array', { status: 400 });
  }

  const payload = {
    model: 'mistralai/mistral-small-3.2-24b-instruct-2506',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages,
    ],
    functions: FUNCTIONS,
    function_call: 'auto' as const,
    stream: true as const,
  };

  const resp = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!resp.ok || !resp.body) {
    const text = await resp.text().catch(() => '');
    console.error('Model call failed:', resp.status, text);
    return new Response(`Model error: ${resp.status}`, { status: 502 });
  }

  return new Response(resp.body, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}

export async function GET(): Promise<Response> {
  return new Response('Use POST to chat.', { status: 405 });
}
