// src/app/api/chat/route.ts
import { NextRequest } from 'next/server';
import { SYSTEM_PROMPT } from './prompt';
import { toolRegistry } from './tools/tool-registry';

export const config = {
  runtime: 'nodejs',
  maxDuration: 45,
};

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const API_KEY = process.env.OPENROUTER_API_KEY!;

// Convert toolRegistry to OpenAI-style functions
const FUNCTIONS = Object.entries(toolRegistry).map(([name, tool]) => ({
  name,
  description: tool.description || 'No description provided.',
  parameters: tool.parameters,
}));

function errorHandler(err: unknown): string {
  if (!err) return 'Unknown error';
  if (typeof err === 'string') return err;
  if (err instanceof Error) return err.message;
  return JSON.stringify(err);
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!Array.isArray(messages)) {
      return new Response('`messages` must be an array', { status: 400 });
    }

    const payload = {
      model: 'mistralai/mistral-small-3.2-24b-instruct-2506',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
      ],
      functions: FUNCTIONS,
      function_call: 'auto' as const,
      stream: true as const,
    };

    const resp = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok || !resp.body) {
      const errText = await resp.text().catch(() => '(no response body)');
      console.error(`❌ [Model Error ${resp.status}]`, errText);

      // Attempt to parse JSON error if available
      try {
        const jsonErr = JSON.parse(errText);
        return new Response(
          `Model error (${resp.status}): ${jsonErr.error?.message || JSON.stringify(jsonErr)}`,
          { status: 502 },
        );
      } catch {
        return new Response(`Model error: ${resp.status} — ${errText}`, { status: 502 });
      }
    }

    return new Response(resp.body, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    });

  } catch (err) {
    const message = errorHandler(err);
    console.error('⚠️ Internal route error:', message);
    return new Response(`Internal error: ${message}`, { status: 500 });
  }
}

export async function GET(): Promise<Response> {
  return new Response('Use POST to chat.', { status: 405 });
}
