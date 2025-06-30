// src/app/api/chat/route.ts
import { NextRequest } from 'next/server';
import { SYSTEM_PROMPT } from './prompt';
import { toolRegistry } from './tools/tool-registry';
import { ZodError } from 'zod';

export const config = {
  runtime: 'nodejs',
  maxDuration: 45,
};

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const API_KEY = process.env.OPENROUTER_API_KEY!;

// Convert tools into OpenAI-style function objects
const FUNCTIONS = Object.entries(toolRegistry).map(([name, tool]) => {
  try {
    return {
      name,
      description: tool.description || 'No description provided.',
      parameters: tool.parameters,
    };
  } catch (err) {
    console.warn(`⚠️ Tool "${name}" has invalid parameters`, err);
    return null;
  }
}).filter((t): t is NonNullable<typeof t> => Boolean(t));

// Smart error debugger
function debugError(reason: string, payload: any) {
  console.error(`❌ Likely cause: ${reason}`);
  console.log('🔍 Payload preview:', JSON.stringify(payload, null, 2));
  return new Response(`Model input error: ${reason}`, { status: 400 });
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!Array.isArray(messages)) {
      return new Response('`messages` must be an array', { status: 400 });
    }

    // Validate messages
    if (!messages.some(m => m.role === 'user')) {
      return debugError('No user message found in messages.', { messages });
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

    // Final payload checks
    if (payload.functions.length === 0) {
      return debugError('No valid functions defined. Check your toolRegistry.', payload);
    }

    for (const fn of payload.functions) {
      if (!fn.name || !fn.parameters) {
        return debugError(`Function ${fn.name} missing name or parameters`, fn);
      }

      try {
        // Validate Zod structure if present
        fn.parameters.parse({});
      } catch (zerr) {
        if (zerr instanceof ZodError) {
          return debugError(`Function ${fn.name} has invalid Zod schema`, zerr.format());
        }
      }
    }

    // Make the call to OpenRouter
    const resp = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok || !resp.body) {
      const raw = await resp.text();
      console.error(`❌ Model returned status ${resp.status}:`, raw);

      let parsed = null;
      try {
        parsed = JSON.parse(raw);
      } catch {}

      const modelMessage = parsed?.error?.message || raw;

      if (modelMessage.includes('function') && modelMessage.includes('parameter')) {
        return debugError('Function parameter schema is likely malformed.', payload);
      }
      if (modelMessage.includes('messages')) {
        return debugError('Message format likely invalid. Ensure role/content strings.', payload);
      }
      if (modelMessage.includes('model')) {
        return debugError('Invalid model name or unsupported capabilities.', payload);
      }

      return new Response(`Model error (${resp.status}): ${modelMessage}`, {
        status: 502,
      });
    }

    return new Response(resp.body, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    });
  } catch (err: any) {
    const message = err instanceof Error ? err.message : JSON.stringify(err);
    console.error('⚠️ Internal route error:', message);
    return new Response(`Internal error: ${message}`, { status: 500 });
  }
}

export async function GET() {
  return new Response('Use POST to chat.', { status: 405 });
}
