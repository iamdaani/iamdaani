import { NextRequest, NextResponse } from 'next/server';
import { groq } from '@ai-sdk/groq';
import { streamText } from 'ai';
import { SYSTEM_PROMPT } from './prompt';
import { toolRegistry } from './tools/tool-registry';

export const config = {
  runtime: 'edge',
  dynamic: 'force-dynamic',
};

// Simple error response
function errorJSON(message: string, status = 400) {
  return new NextResponse(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

// Optional: friendly error extractor
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Unknown error';
}

export async function POST(req: NextRequest) {
  let body: any;

  try {
    body = await req.json();
  } catch {
    return errorJSON('Invalid JSON body', 400);
  }

  let { messages: rawMessages, stream = true } = body;

  if (!Array.isArray(rawMessages)) {
    return errorJSON('`messages` must be an array', 400);
  }

  // Add system prompt if available
  if (typeof SYSTEM_PROMPT === 'string') {
    rawMessages = [{ role: 'system', content: SYSTEM_PROMPT }, ...rawMessages];
  } else if (SYSTEM_PROMPT?.role && SYSTEM_PROMPT?.content) {
    rawMessages = [SYSTEM_PROMPT, ...rawMessages];
  }

  // Normalize to required shape
  const messages = rawMessages.map((m: any) => ({
    role: m.role,
    content: String(m.content ?? ''),
  }));

  try {
    const result = await streamText({
      model: groq('mistral-saba-24b'),
      messages,
      tools: toolRegistry,
      toolCallStreaming: true,
      maxSteps: 2,
    });

    if (stream) {
      return result.toDataStreamResponse({
        getErrorMessage,
      });
    } else {
      const text = await result.text;
      return NextResponse.json({ content: text });
    }
  } catch (err) {
    console.error('StreamText error:', err);
    return errorJSON(getErrorMessage(err), 500);
  }
}

export async function GET() {
  return new NextResponse('Use POST for chat.', {
    status: 405,
    headers: { 'Content-Type': 'text/plain' },
  });
}
