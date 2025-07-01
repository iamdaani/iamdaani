// src/app/api/chat/route.ts
import { NextRequest } from 'next/server';
import { SYSTEM_PROMPT } from './prompt';

export const config = {
  runtime: 'nodejs',
  maxDuration: 45,
};

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const API_KEY = process.env.OPENROUTER_API_KEY!;

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

  // Build payload without any functions or streaming
  const payload = {
    model: 'mistralai/mistral-small-3.2-24b-instruct-2506',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages,
    ],
    stream: false
  };

  // Send to OpenRouter
  const resp = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    console.error(`Model error ${resp.status}:`, text);
    return new Response(`Model error: ${resp.status}`, { status: 502 });
  }

  // Parse the non‑streaming JSON response
  const data = await resp.json();
  const reply = data.choices?.[0]?.message?.content;
  if (typeof reply !== 'string') {
    console.error('Unexpected response format', data);
    return new Response('Invalid response format', { status: 502 });
  }

  // Return plain-text chat reply
  return new Response(reply, {
    status: 200,
    headers: { 'Content-Type': 'text/plain' },
  });
}

export async function GET(): Promise<Response> {
  return new Response('Use POST to chat.', { status: 405 });
}
