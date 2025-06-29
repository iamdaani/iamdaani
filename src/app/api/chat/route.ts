// src/app/api/chat/route.ts
import { NextRequest } from 'next/server';
import { streamText } from 'ai';
import { groq } from '@ai-sdk/groq';
import { SYSTEM_PROMPT } from './prompt';
import { toolRegistry } from './tools/tool-registry';
import type { ToolExecutionOptions } from 'ai';

// Give yourself a bit more time on Vercel
export const config = {
  runtime: 'nodejs',
  maxDuration: 45,
};

const model = groq('llama3-8b-8192');

// Simple keyword detector
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

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const { messages: raw } = await req.json();
    const rawMessages = Array.isArray(raw) ? raw : [];

    // 1️⃣ Inject system prompt
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...rawMessages,
    ];

    // 2️⃣ Detect tool
    const last = messages[messages.length - 1];
    const userText = last.role === 'user' ? last.content : '';
    const toolName = detectToolCall(userText);

    if (toolName) {
      // 3️⃣ Execute tool
      const tool = toolRegistry[toolName];
      const toolResult = await tool.execute({}, {
        toolCallId: 'direct-tool',
        messages: [],
      });
      const output =
        typeof toolResult === 'string'
          ? toolResult
          : JSON.stringify(toolResult);

      // 4️⃣ Return SSE stream with the tool output as a single "data:" message
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(`data: ${output}\n\n`));
          controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
          controller.close();
        }
      });

      return new Response(stream, {
        status: 200,
        headers: { 'Content-Type': 'text/event-stream' }
      });
    }

    // 5️⃣ Fallback to streaming LLM
    const aiStream = await streamText({ model, messages });
    return aiStream.toDataStreamResponse();

  } catch (err) {
    console.error('Chat route error:', err);
    return new Response('Internal server error', { status: 500 });
  }
}

export async function GET(): Promise<Response> {
  return new Response('Use POST to chat.', { status: 405 });
}
