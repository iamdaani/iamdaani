import { NextRequest, NextResponse } from 'next/server';
import { groq } from '@ai-sdk/groq';
import { streamText, createDataStreamResponse } from 'ai';
import { z } from 'zod';

// Define your tool inline
const getSkills = {
  name: 'getSkills',
  description: 'Returns a list of my technical skills',
  parameters: z.object({}),          // no parameters
  execute: async (_params: any, _ctx: any) => {
    // simulate fetching or computation
    return 'My skills are: TypeScript, React, Node.js, and Python.';
  },
};

export const config = {
  runtime: 'edge',
  dynamic: 'force-dynamic',
};

function errorJSON(msg: string, status = 400) {
  return new NextResponse(JSON.stringify({ error: msg }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return errorJSON('Invalid JSON payload', 400);
  }

  const { messages: raw, stream = true } = body;
  if (!Array.isArray(raw)) {
    return errorJSON('`messages` must be an array', 400);
  }

  // normalize
  const messages = raw.map((m: any) => ({
    role: m.role,
    content: String(m.content ?? ''),
  }));

  try {
    // Kick off streaming with tool support
    const result = await streamText({
      model: groq('mistral-saba-24b'),
      messages,
      tools: { getSkills },
      toolCallStreaming: true,
    });

    // Return proper SSE to the client
     result.toDataStreamResponse;
  } catch (err: any) {
    console.error('API error:', err);
    return errorJSON(err.message || 'Internal error', 500);
  }
}

export async function GET() {
  return new NextResponse('Use POST to chat', { status: 405 });
}
