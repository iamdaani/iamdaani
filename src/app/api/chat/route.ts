// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { SYSTEM_PROMPT } from './prompt';

export const config = {
  runtime: 'nodejs',
  maxDuration: 45,
};

// Initialize OpenAI client to talk to OpenRouter
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

  const { messages } = body;
  if (!Array.isArray(messages)) {
    return new NextResponse('`messages` must be an array', { status: 400 });
  }

  // Build payload for OpenRouter
  const payload = {
    model: 'mistralai/mistral-small-3.2-24b-instruct:free',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages,
    ],
    // you can pass extra headers or body if desired:
    extra_headers: {
      'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || '',
      'X-Title': process.env.NEXT_PUBLIC_SITE_NAME || '',
    },
    extra_body: {},
    stream: false, // non‑streaming for now
  };

  try {
    const completion = await client.chat.completions.create(payload);
    if ('choices' in completion && Array.isArray(completion.choices)) {
      const reply = completion.choices[0]?.message?.content;
      if (typeof reply !== 'string') {
        console.error('Unexpected response format', completion);
        return new NextResponse('Invalid response format', { status: 502 });
      }
      return new NextResponse(reply, {
        status: 200,
        headers: { 'Content-Type': 'text/plain' },
      });
    } else {
      console.error('Unexpected response type', completion);
      return new NextResponse('Invalid response type', { status: 502 });
    }
  } catch (e: any) {
    console.error('OpenRouter error:', e);
    const msg = e?.response?.status
      ? `Model error ${e.response.status}: ${e.response.body}`
      : e.message || 'Unknown error';
    return new NextResponse(msg, { status: 502 });
  }
}

export async function GET() {
  return new NextResponse('Use POST to chat.', { status: 405 });
}
