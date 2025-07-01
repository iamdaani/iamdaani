// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export const config = {
  runtime: 'nodejs',
  maxDuration: 45,
};

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY!,
  defaultHeaders: {
    'HTTP-Referer': 'https://www.ahmadyar.site/',
    'X-Title': 'Ahmad Yar',
  },
});

function formatError(e: unknown) {
  if (typeof e === 'string') return e;
  if (e instanceof Error) return e.message;
  try { return JSON.stringify(e); } catch { return String(e); }
}

export async function POST(req: NextRequest): Promise<Response> {
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

  const hasUser = messages.some((m: any) => m.role === 'user');
  if (!hasUser) {
    return new NextResponse('At least one user message is required', { status: 400 });
  }

  // Align payload to OpenRouter's expected type structure
  const payload: any = {
    model: 'mistralai/mistral-small-3.2-24b-instruct:free',
    messages: messages.map((m: any) => ({
      role: m.role,
      content: typeof m.content === 'string' ? m.content : m.content,
    })),
    stream: false,
  };

  console.log('➡️ Sending payload:', JSON.stringify(payload, null, 2));

  try {
    const completion = await openai.chat.completions.create(payload);

    if (!('choices' in completion)) {
      console.error('⛔️ Unexpected format:', completion);
      return new NextResponse('Unexpected model response format', { status: 502 });
    }

    const reply = completion.choices[0]?.message?.content ?? '[No response]';
    return new NextResponse(reply, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (err: any) {
    console.error('❌ OpenRouter error status', err.response?.status, formatError(err.response?.body ?? err));
    const status = err.response?.status || 500;
    const message = err.response?.body?.error?.message || err.message || 'Unknown error';
    return new NextResponse(`Model error ${status}: ${message}`, { status });
  }
}

export async function GET(): Promise<Response> {
  return new NextResponse('Use POST to chat.', { status: 405 });
}
