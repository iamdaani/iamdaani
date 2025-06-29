// src/lib/sse-utils.ts
// Utility to create a Server-Sent Events (SSE) ReadableStream from a given text
export function createSSEStreamFromText(
  text: string,
  chunkSize: number = 10
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  // Split text into chunks of given size to mimic token-by-token streaming
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }

  return new ReadableStream<Uint8Array>({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(`data: ${chunk}\n\n`));
      }
      controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
      controller.close();
    },
    cancel() {
      console.warn('SSE stream cancelled by client.');
    }
  });
}


// src/app/api/chat/route.ts
import { NextRequest } from 'next/server';
import { streamText } from 'ai';
import { groq } from '@ai-sdk/groq';
import { SYSTEM_PROMPT } from './prompt';
import { toolRegistry } from './tools/tool-registry';
import { createSSEStreamFromText } from '../../../lib/sse-utils';
import type { ToolExecutionOptions } from 'ai';

// Allow up to 45 seconds on Vercel
export const config = {
  runtime: 'nodejs',
  maxDuration: 45,
};

// Initialize Groq model
const model = groq('llama3-8b-8192');

// Detect which tool should be invoked based on keywords
function detectToolCall(msg: string): keyof typeof toolRegistry | null {
  const t = msg.trim().toLowerCase();
  if (/(contact|reach you|how can i contact)/.test(t)) return 'getContact';
  if (/(resume|cv|background)/.test(t))           return 'getResume';
  if (/(projects?|work|portfolio)/.test(t))       return 'getProjects';
  if (/(skills?|strengths)/.test(t))              return 'getSkills';
  if (/(presentation|about you)/.test(t))          return 'getPresentation';
  if (/(sport|sports)/.test(t))                   return 'getSports';
  if (/(craziest|funny)/.test(t))                 return 'getCrazy';
  if (/(internship)/.test(t))                     return 'getInternship';
  return null;
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json();
    const rawMessages = Array.isArray(body.messages) ? body.messages : [];

    // Build conversation with system prompt
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...rawMessages,
    ];

    // Inspect last user message
    const last = messages[messages.length - 1];
    const userText = last?.role === 'user' ? last.content : '';
    const toolName = detectToolCall(userText);

    if (toolName && toolRegistry[toolName]) {
      // Execute the tool
      let toolOutput: string;
      try {
        // Cast to any to satisfy TS
        const tool: any = toolRegistry[toolName];
        const rawResult = await tool.execute({}, {
          toolCallId: 'manual-tool',
          messages: [],
        } as ToolExecutionOptions);
        toolOutput = typeof rawResult === 'string' ? rawResult : JSON.stringify(rawResult);
      } catch (toolErr) {
        console.error(`Tool ${toolName} execution error:`, toolErr);
        toolOutput = `⚠️ Error executing tool ${toolName}: ${(toolErr as Error).message}`;
      }

      // Stream tool output via SSE
      const sseStream = createSSEStreamFromText(toolOutput, 5);
      return new Response(sseStream, {
        status: 200,
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache, no-transform',
          Connection: 'keep-alive',
        },
      });
    }

    // Fallback to normal LLM chat streaming
    const chatStream = await streamText({ model, messages });
    return chatStream.toDataStreamResponse();
  } catch (err) {
    console.error('Chat route error:', err);
    const errorStream = createSSEStreamFromText('Internal server error.', 10);
    return new Response(errorStream, {
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
