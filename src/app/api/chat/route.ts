// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { SYSTEM_PROMPT } from './prompt';

export const config = {
  runtime: 'nodejs',
  maxDuration: 45,
};

// Point official OpenAI client at OpenRouter
const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY!,
  baseURL: 'https://openrouter.ai/api/v1',
});

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return new NextResponse('Invalid JSON', { status: 400 });
  }

  let { messages } = body;
  if (!Array.isArray(messages)) {
    return new NextResponse('`messages` must be an array', { status: 400 });
  }

  // Flatten content to string and log payload
  messages = messages.map((m: any) => {
    let contentStr: string;
    if (typeof m.content === 'string') {
      contentStr = m.content;
    } else if (typeof m.content === 'object') {
      // turn arrays or objects into JSON text
      contentStr = JSON.stringify(m.content);
      console.warn(`⚠️ Converted non‑string content to JSON string:`, m.content);
    } else {
      contentStr = String(m.content);
    }
    return { role: m.role, content: contentStr };
  });
  const payload = {
    model: 'mistralai/mistral-small-3.2-24b-instruct-2506',  // try this ID
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages,
    ],
    stream: false,  // non-streaming for now
  };
  console.log('🔔 Sending payload to OpenRouter:', JSON.stringify(payload, null, 2));

  try {
    const completion = await client.chat.completions.create(payload);
    // Ensure completion is not a stream
    if (!('choices' in completion)) {
      console.error('Unexpected response format (no choices property)', completion);
      return new NextResponse('Invalid response format', { status: 502 });
    }
    const reply = completion.choices[0]?.message?.content;
    if (typeof reply !== 'string') {
      console.error('Unexpected response format', completion);
      return new NextResponse('Invalid response format', { status: 502 });
    }
    return new NextResponse(reply, { status: 200, headers: { 'Content-Type': 'text/plain' } });
  } catch (e: any) {
    console.error('OpenRouter error:', e);
    const status = e.response?.status || 500;
    const text = e.response?.body || e.message || 'Unknown error';
    return new NextResponse(`Model error ${status}: ${text}`, { status });
  }
}

export async function GET() {
  return new NextResponse('Use POST to chat.', { status: 405 });
}
