// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export const config = {
  runtime: 'nodejs',
  maxDuration: 45,
};

// Set up OpenAI SDK with OpenRouter
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY!,
  defaultHeaders: {
    'HTTP-Referer': 'https://www.ahmadyar.site/', // optional but recommended
    'X-Title': 'Ahmad Yar',                  // optional
  },
});

// Helper to format errors
function formatError(error: unknown) {
  if (!error) return 'Unknown error';
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  try {
    return JSON.stringify(error, null, 2);
  } catch {
    return 'Unserializable error';
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json();
    const { messages } = body;

    // Validate messages
    if (!Array.isArray(messages)) {
      return new NextResponse('`messages` must be an array', { status: 400 });
    }

    // Make sure there’s at least one user message
    const hasUserMessage = messages.some(m => m.role === 'user');
    if (!hasUserMessage) {
      return new NextResponse('At least one user message required', { status: 400 });
    }

    // Create completion request
    const completion = await openai.chat.completions.create({
      model: 'mistralai/mistral-small-3.2-24b-instruct:free',
      messages,
      stream: false, // ← important!
    });

    if (!('choices' in completion)) {
      console.error('Unexpected model response:', completion);
      return new NextResponse('Unexpected model response format', { status: 502 });
    }

    const reply = completion.choices[0]?.message?.content ?? '[No response]';

    return new Response(reply, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (err) {
    console.error('❌ Route error:', err);
    return new NextResponse(`Internal error: ${formatError(err)}`, { status: 500 });
  }
}

export async function GET(): Promise<Response> {
  return new Response('Use POST to chat.', { status: 405 });
}
