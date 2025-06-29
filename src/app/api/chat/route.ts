// src/app/api/chat/route.ts
import { NextRequest } from 'next/server';
import { streamText } from 'ai';
import { groq } from '@ai-sdk/groq';
import { SYSTEM_PROMPT } from './prompt';
import { toolRegistry } from './tools/tool-registry';
import type { ToolExecutionOptions } from 'ai';

// Allow up to 45 s on Vercel
export const config = {
  runtime: 'nodejs',
  maxDuration: 45,
};

// Your Groq model
const model = groq('llama3-8b-8192');

/** Keyword‑based detector for tool calls. */
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
    const payload = await req.json();
    const raw = Array.isArray(payload.messages) ? payload.messages : [];
    
    // 1) Inject system prompt
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...raw,
    ];

    // 2) Check last user message for a tool request
    const last = messages[messages.length - 1];
    const userText = last.role === 'user' ? last.content : '';
    const toolName = detectToolCall(userText);

    if (toolName) {
      // 3) Run the tool immediately
      const tool = toolRegistry[toolName];
      const result = await tool.execute({}, {
        toolCallId: 'direct-tool',
        messages: [],
      });
      const output = typeof result === 'string' ? result : JSON.stringify(result);

      return new Response(output, {
        status: 200,
        headers: { 'Content-Type': 'text/plain' },
      });
    }

    // 4) Fallback: run full chat completion
    const completion = await streamText({ model, messages });
    // Groq (via ai-sdk) returns a string or object with .text(): handle both:
    let fullText: string;
    if (typeof completion === 'string') {
      fullText = completion;
    } else if ('text' in completion && completion.text instanceof Promise) {
      fullText = await completion.text;
    } else {
      fullText = String(completion);
    }

    return new Response(fullText.trim(), {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  } catch (err) {
    console.error('Chat route error:', err);
    return new Response('Internal server error', { status: 500 });
  }
}

export async function GET(): Promise<Response> {
  return new Response('Use POST to chat.', { status: 405 });
}
