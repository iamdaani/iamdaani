// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { streamText, createDataStreamResponse } from 'ai';

export const config = {
  runtime: 'edge',
  // Force no caching so SSE always flows
  dynamic: 'force-dynamic',
};

const openrouter = createOpenAICompatible({
  name: 'openrouter',
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY!,
});

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
    return errorJSON('Invalid JSON body', 400);
  }

  const { messages, stream = false } = payload;
  if (!Array.isArray(messages)) {
    return errorJSON('`messages` must be an array', 400);
  }

  // Normalize messages
  const cleaned = messages.map((m: any) => ({
    role: m.role,
    content: String(m.content ?? ''),
  }));

  const model = openrouter('mistralai/mistral-small-3.2-24b-instruct:free');

  // Non‑streaming: return a one‑shot JSON
  if (!stream) {
    try {
      const result = await streamText({ model, messages: cleaned });
      // Safely await first or full text
      let text = 'No content';
      try {
        text = result.fullStream
          ? ((await result.fullStream[Symbol.asyncIterator]().next()).value?.text ?? (await result.text))
          : await result.text;
      } catch {
        text = await result.text;
      }
      return NextResponse.json({ content: text });
    } catch (err: any) {
      console.error('❌ non‑stream error', err);
      return errorJSON('Error generating completion', 500);
    }
  }

  // Streaming: proper SSE with data: {...} chunks
  try {
    const result = await streamText({ model, messages: cleaned });
    return createDataStreamResponse({
      execute: async (writer) => {
        for await (const chunk of result.fullStream ?? []) {
          writer.write(`a:${JSON.stringify(chunk)}\n`);
        }
      }
    });
  } catch (err: any) {
    console.error('❌ stream error', err);
    return errorJSON('Error streaming completion', 500);
  }
}

export async function GET() {
  return errorJSON('Method not allowed. Use POST', 405);
}
