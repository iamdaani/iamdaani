// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { streamText, createDataStreamResponse } from 'ai';
import { toolRegistry } from './tools/tool-registry';
import { SYSTEM_PROMPT } from './prompt';

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

// Initialize OpenRouter client
const openrouter = createOpenAICompatible({
  name: 'openrouter',
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY!,
});

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

  // Prepend system prompt if provided
  if (typeof SYSTEM_PROMPT === 'string') {
    rawMessages = [{ role: 'system', content: SYSTEM_PROMPT }, ...rawMessages];
  } else if (SYSTEM_PROMPT?.role && SYSTEM_PROMPT?.content) {
    rawMessages = [SYSTEM_PROMPT, ...rawMessages];
  }

  // Normalize into { role, content }
  const messages = rawMessages.map((m: any) => ({
    role: m.role,
    content: String(m.content ?? ''),
  }));

  // Choose your model
  const model = openrouter('mistralai/mistral-small-3.2-24b-instruct:free');

  // Non‑streaming (one-shot) path
  if (!stream) {
    try {
      const result = await streamText({
        model,
        messages,
        tools: toolRegistry,            // pass your registry directly
      });

      const text = await result.text;
      return NextResponse.json({ content: text });
    } catch (err: any) {
      console.error('Non-stream error:', err);
      return errorJSON('Error generating completion', 500);
    }
  }

  // Streaming (SSE) path
  try {
    const result = await streamText({
      model,
      messages,
      tools: toolRegistry,
    });

    // ✅ THIS is the correct return
    return result.toDataStreamResponse();

    // OR:
    // return createDataStreamResponse(result);

  } catch (err: any) {
    console.error('Stream error:', err);
    return errorJSON('Error streaming completion', 500);
  }
}
