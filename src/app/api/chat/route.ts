// src/app/api/chat/route.ts
import { NextRequest } from 'next/server';
import { streamText } from 'ai';
import { groq } from '@ai-sdk/groq';
import { SYSTEM_PROMPT } from './prompt';
import { toolRegistry } from './tools/tool-registry';
import type { ToolExecutionOptions } from 'ai';

// Give Vercel up to 45 s
export const config = {
  runtime: 'nodejs',
  maxDuration: 45,
};

const model = groq('llama3-8b-8192');

/** Detect which tool to call based on user text */
function detectToolCall(msg: string): keyof typeof toolRegistry | null {
  const t = msg.toLowerCase();
  if (/(contact|reach you|how can i contact)/.test(t)) return 'getContact';
  if (/(resume|cv|background)/.test(t)) return 'getResume';
  if (/(projects?|work|portfolio)/.test(t)) return 'getProjects';
  if (/(skills?|strengths)/.test(t)) return 'getSkills';
  if (/(presentation|about you)/.test(t)) return 'getPresentation';
  if (/(sport|sports)/.test(t)) return 'getSports';
  if (/(craziest|funny)/.test(t)) return 'getCrazy';
  if (/(internship)/.test(t)) return 'getInternship';
  return null;
}

/** 
 * Build a ReadableStream that emits one SSE `data:` event per token,
 * then a final `[DONE]` event, exactly like the LLM stream.
 */
function streamSseFromText(text: string): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  // Simple tokenizer: split on spaces
  const tokens = text.split(/(\s+)/).filter((t) => t.length > 0);
  return new ReadableStream<Uint8Array>({
    start(controller) {
      for (const token of tokens) {
        // Each token in its own `data:` event
        const chunk = `data: ${token}\n\n`;
        controller.enqueue(encoder.encode(chunk));
      }
      // Final done event
      controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
      controller.close();
    },
  });
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const payload = await req.json();
    const raw = Array.isArray(payload.messages) ? payload.messages : [];

    // 1️⃣ Build messages with SYSTEM_PROMPT
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...raw,
    ];

    // 2️⃣ Look at last user message
    const last = messages[messages.length - 1];
    const userText = last.role === 'user' ? last.content : '';
    const toolName = detectToolCall(userText);

    // 3️⃣ If a tool is requested, run it and stream its output
    if (toolName && toolRegistry[toolName]) {
      try {
        // Execute the tool
        const toolResult = await toolRegistry[toolName].execute({}, {
          toolCallId: 'manual-tool',
          messages: [],
        });
        const resultText =
          typeof toolResult === 'string' ? toolResult : JSON.stringify(toolResult);

        // Create an SSE stream of tokens
        const sseStream = streamSseFromText(resultText);

        return new Response(sseStream, {
          status: 200,
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            Connection: 'keep-alive',
          },
        });
      } catch (toolError) {
        console.error(`Tool ${toolName} failed:`, toolError);
        // Stream the error message
        const errStream = streamSseFromText(
          `⚠️ Tool ${toolName} error: ${(toolError as Error).message}`
        );
        return new Response(errStream, {
          status: 200,
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            Connection: 'keep-alive',
          },
        });
      }
    }

    // 4️⃣ No tool → fallback to LLM streaming
    const stream = await streamText({ model, messages });
    return stream.toDataStreamResponse();
  } catch (e) {
    console.error('Route error:', e);
    // In case of fatal error, stream a single error token then DONE
    const errStream = streamSseFromText('Internal server error.');
    return new Response(errStream, {
      status: 500,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    });
  }
}

export async function GET(): Promise<Response> {
  return new Response('Use POST to chat.', { status: 405 });
}
