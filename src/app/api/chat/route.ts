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

function formatError(e: unknown): string {
  if (typeof e === 'string') return e;
  if (e instanceof Error) return e.message;
  try { return JSON.stringify(e); } catch { return String(e); }
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json();
    
    // Validate request body
    if (!Array.isArray(body?.messages)) {
      return new NextResponse('`messages` must be an array', { status: 400 });
    }

    const hasUser = body.messages.some((m: any) => m.role === 'user');
    if (!hasUser) {
      return new NextResponse('At least one user message is required', { status: 400 });
    }

    // Prepare the payload
    const payload = {
      model: 'mistralai/mistral-small-3.2-24b-instruct:free',
      messages: body.messages.map((m: any) => ({
        role: m.role,
        content: m.content,
      })),
      stream: false, // Explicitly set to false
    };

    // Make the API call
    const completion = await openai.chat.completions.create(payload);

    // Check if completion is a stream (has no 'choices' property)
    if (!('choices' in completion) || !completion.choices?.[0]?.message?.content) {
      console.error('Unexpected response format:', completion);
      return new NextResponse('Unexpected model response format', { status: 502 });
    }

    // Return the response
    return NextResponse.json({
      content: completion.choices[0].message.content
    });

  } catch (err: any) {
    console.error('OpenRouter error:', formatError(err));
    
    // Handle OpenAI API errors
    if (err instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: err.message },
        { status: err.status || 500 }
      );
    }
    
    // Handle other errors
    return NextResponse.json(
      { error: formatError(err) },
      { status: 500 }
    );
  }
}

export async function GET(): Promise<Response> {
  return new NextResponse('Use POST to chat.', { status: 405 });
}
