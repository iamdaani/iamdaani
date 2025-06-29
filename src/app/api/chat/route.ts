// src/app/api/chat/route.ts
import { NextRequest } from 'next/server';
import { streamText } from 'ai';
import { groq } from '@ai-sdk/groq';
import { SYSTEM_PROMPT } from './prompt';
import { toolRegistry } from './tools/tool-registry';

// Bump Vercel timeout
export const config = {
  runtime: 'nodejs',
  maxDuration: 45,
};

const model = groq('llama3-8b-8192');

// Same keyword detector...
function detectToolCall(msg: string): keyof typeof toolRegistry | null {
  const t = msg.toLowerCase();
  if (/(contact|reach you|how can i contact)/.test(t)) return 'getContact';
  if (/(resume|cv|background)/.test(t))   return 'getResume';
  if (/(projects?|work|portfolio)/.test(t)) return 'getProjects';
  if (/(skills?|strengths)/.test(t))      return 'getSkills';
  if (/(presentation|about you)/.test(t))  return 'getPresentation';
  if (/(sport|sports)/.test(t))           return 'getSports';
  if (/(craziest|funny)/.test(t))         return 'getCrazy';
  if (/(internship)/.test(t))             return 'getInternship';
  return null;
}

// Helper to wrap any string into a proper SSE stream
function sseFromString(text: string): Response {
  const encoder = new TextEncoder();
  return new Response(
    new ReadableStream({
      start(ctrl) {
        ctrl.enqueue(encoder.encode(`data: ${text}\n\n`));
        ctrl.enqueue(encoder.encode(`data: [DONE]\n\n`));
        ctrl.close();
      },
    }),
    {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    }
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const { messages: raw } = await req.json();
    const rawMessages = Array.isArray(raw) ? raw : [];

    // Inject system
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...rawMessages,
    ];

    // Inspect last user message
    const last = messages[messages.length - 1];
    const userMsg = last.role === 'user' ? last.content : '';
    const toolName = detectToolCall(userMsg);

    if (toolName) {
      // Try the tool
      try {
        const tool = toolRegistry[toolName];
        const result = await tool.execute({}, {
          toolCallId: 'direct-tool',
          messages: [],
        });
        const text = typeof result === 'string'
          ? result
          : JSON.stringify(result);
        return sseFromString(text);
      } catch (toolErr) {
        console.error('Tool execution error:', toolErr);
        return sseFromString(
          `Error running tool ${toolName}: ${
            (toolErr as Error).message || 'unknown'
          }`
        );
      }
    }

    // No tool → stream the LLM response
    const stream = await streamText({ model, messages });
    return stream.toDataStreamResponse();
  } catch (e) {
    console.error('Chat route error:', e);
    // Send a minimal SSE error so frontend doesn’t hang
    return sseFromString('Server error, please try again later.');
  }
}

export async function GET(): Promise<Response> {
  return new Response('Use POST to chat.', { status: 405 });
}
