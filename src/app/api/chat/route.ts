// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { groq } from '@ai-sdk/groq';
import { streamText } from 'ai';
import { SYSTEM_PROMPT } from './prompt';
import { toolRegistry } from './tools/tool-registry';

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
  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return errorJSON('Invalid JSON payload', 400);
  }

  let { messages: rawMessages, stream = false } = payload;
  if (!Array.isArray(rawMessages)) {
    return errorJSON('`messages` must be an array', 400);
  }

  // Prepend system prompt
  if (typeof SYSTEM_PROMPT === 'string') {
    rawMessages = [{ role: 'system', content: SYSTEM_PROMPT }, ...rawMessages];
  } else if (SYSTEM_PROMPT?.role && SYSTEM_PROMPT?.content) {
    rawMessages = [SYSTEM_PROMPT, ...rawMessages];
  }

  // Normalize messages
  const messages = rawMessages.map((m: any) => ({
    role: m.role,
    content: String(m.content ?? ''),
  }));

  // Select Groq model
  const model = groq('mistral-saba-24b');

  // Non-streaming path
  if (!stream) {
    try {
      const result = await streamText({
        model,
        messages,
        tools: toolRegistry,
      });

      const text = await result.text;
      return NextResponse.json({ content: text });
    } catch (err: any) {
      console.error('Non-stream error:', err);
      return errorJSON('Error generating completion', 500);
    }
  }

  // Streaming path
  try {
    const result = await streamText({
      model,
      messages,
      tools: toolRegistry,
    });

    // ✅ Correct streaming response for `useChat`
    return await result.toDataStreamResponse();
  } catch (err: any) {
    console.error('Stream error:', err);
    return errorJSON('Error streaming completion', 500);
  }
}

export async function GET() {
  return new NextResponse('Use POST to chat', {
    status: 405,
    headers: { 'Content-Type': 'text/plain' },
  });
}
