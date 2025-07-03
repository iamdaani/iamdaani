// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { groq } from '@ai-sdk/groq';
import { streamText, createDataStreamResponse } from 'ai';
import { z } from 'zod';

export const config = {
  runtime: 'edge',
  dynamic: 'force-dynamic',
};

// --- Inline tool definitions to test tool calling ---
const getSkills = {
  name: 'getSkills',
  description: 'Returns a list of technical skills',
  parameters: z.object({}),
  execute: async (_params: any, _ctx: any) => {
    return 'TypeScript, React, Node.js, Python';
  },
};

const getContact = {
  name: 'getContact',
  description: 'Returns contact information',
  parameters: z.object({}),
  execute: async (_params: any, _ctx: any) => {
    return {
      email: 'you@example.com',
      phone: '+1234567890',
    };
  },
};

// Helper for JSON error responses
function errorJSON(message: string, status = 400) {
  return new NextResponse(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function extractError(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  return 'Unknown error';
}

export async function POST(req: NextRequest) {
  // 1) Parse payload
  let body: any;
  try {
    body = await req.json();
  } catch {
    return errorJSON('Invalid JSON body', 400);
  }

  // 2) Validate messages array
  const { messages: raw, stream = true } = body;
  if (!Array.isArray(raw)) {
    return errorJSON('`messages` must be an array', 400);
  }

  // 3) Normalize messages
  const messages = raw.map((m: any) => ({
    role: m.role,
    content: String(m.content ?? ''),
  }));

  // 4) Call the model with inline tools
  try {
    const result = await streamText({
      model: groq('mistral-saba-24b'),
      messages,
      tools: { getSkills, getContact },
      toolCallStreaming: true,
    });

    // 5) Stream or one‑shot
    if (stream) {
      return result.toDataStreamResponse;
    } else {
      const text = await result.text;
      return NextResponse.json({ content: text });
    }
  } catch (err: unknown) {
    console.error('StreamText error:', err);
    return errorJSON(extractError(err), 500);
  }
}

export async function GET() {
  return new NextResponse('Use POST to chat', {
    status: 405,
    headers: { 'Content-Type': 'text/plain' },
  });
}

function Chat() {
  // ...your React component logic here...
  return <div>Chat UI goes here</div>;
}

export default Chat;
