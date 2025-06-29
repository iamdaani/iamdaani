// src/app/api/chat/route.ts
// Comprehensive chat handler with manual tool calls and SSE streaming

import { NextRequest } from 'next/server';
import { streamText } from 'ai';
import { groq } from '@ai-sdk/groq';
import { SYSTEM_PROMPT } from './prompt';
import { toolRegistry } from './tools/tool-registry';
import type { ToolExecutionOptions } from 'ai';

// Vercel configuration: allow Node.js runtime with extended timeout
export const config = {
  runtime: 'nodejs',
  maxDuration: 45,
};

// Initialize Groq model
const model = groq('llama3-8b-8192');

/**
 * Utility: create SSE stream from a text by chunking into small parts.
 * This ensures front-end SSE parser receives many 'data:' events.
 */
function createSSEStreamFromText(
  text: string,
  chunkSize: number = 5
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  // Break text into character chunks
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }

  return new ReadableStream<Uint8Array>({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(`data: ${chunk}\n\n`));
      }
      // Final done event
      controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
      controller.close();
    },
    cancel() {
      console.warn('SSE stream cancelled');
    },
  });
}

/**
 * Keyword-based detection of which tool to call.
 * Returns tool name if detected, otherwise null.
 */
function detectToolCall(msg: string): keyof typeof toolRegistry | null {
  const t = msg.trim().toLowerCase();
  if (/(contact|reach you|how can i contact)/.test(t)) return 'getContact';
  if (/(resume|cv|background)/.test(t)) return 'getResume';
  if (/(project|portfolio|work)/.test(t)) return 'getProjects';
  if (/(skills?|strengths)/.test(t)) return 'getSkills';
  if (/(presentation|about you)/.test(t)) return 'getPresentation';
  if (/(sport|sports)/.test(t)) return 'getSports';
  if (/(craziest|funny)/.test(t)) return 'getCrazy';
  if (/(internship)/.test(t)) return 'getInternship';
  return null;
}

/**
 * POST handler for chat messages.
 * - Detects tool calls and streams tool output.
 * - Falls back to streaming LLM chat responses.
 */
export async function POST(req: NextRequest): Promise<Response> {
  try {
    // Parse request body
    const body = await req.json();
    const rawMessages = Array.isArray(body.messages) ? body.messages : [];

    // Build messages array, injecting system prompt
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...rawMessages,
    ];

    // Extract last user message
    const last = messages[messages.length - 1];
    const userText = last.role === 'user' ? last.content : '';

    // Detect if a tool should be called
    const toolName = detectToolCall(userText);

    if (toolName && toolRegistry[toolName]) {
      // Execute tool and stream its output
      let toolOutput: string;
      try {
        // Cast to any to align with toolRegistry type
        const tool: any = toolRegistry[toolName];
        const rawResult = await tool.execute({}, {
          toolCallId: 'manual-tool',
          messages: [],
        } as ToolExecutionOptions);
        toolOutput =
          typeof rawResult === 'string' ? rawResult : JSON.stringify(rawResult);
      } catch (toolErr) {
        console.error(`Error in tool ${toolName}:`, toolErr);
        toolOutput = `⚠️ ${toolName} failed: ${(toolErr as Error).message}`;
      }

      // Create SSE stream from tool output
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

    // No tool detected: stream LLM chat response
    const aiStream = await streamText({ model, messages });
    return aiStream.toDataStreamResponse();

  } catch (err) {
    console.error('Chat route error:', err);
    // On fatal error, send an SSE with an error message
    const errStream = createSSEStreamFromText(
      'Internal server error. Please try again.',
      10
    );
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

/**
 * GET handler for the chat route.
 */
export async function GET(): Promise<Response> {
  return new Response('Use POST to chat.', { status: 405 });
}
