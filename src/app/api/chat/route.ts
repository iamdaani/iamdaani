// src/app/api/chat/route.ts
import { NextRequest } from 'next/server';
import { streamText } from 'ai';
import { groq } from '@ai-sdk/groq';
import { SYSTEM_PROMPT } from './prompt';
import { toolRegistry } from './tools/tool-registry';

// Tell Vercel you might run up to 45s if needed
export const config = {
  runtime: 'nodejs',
  maxDuration: 45,
};

// Our Groq model
const model = groq('llama3-8b-8192');

// Simple function to detect which tool (if any) based on the user’s last message:
function detectToolCall(lastUserMsg: string): string | null {
  const text = lastUserMsg.toLowerCase();
  if (/(contact|reach you|how can i contact)/.test(text)) return 'getContact';
  if (/(resume|cv|background)/.test(text))   return 'getResume';
  if (/(projects?|work|portfolio)/.test(text)) return 'getProjects';
  if (/(skills?|strengths)/.test(text))      return 'getSkills';
  if (/(presentation|about you)/.test(text))  return 'getPresentation';
  if (/(sport|sports)/.test(text))           return 'getSport';
  if (/(craziest|funny)/.test(text))         return 'getCrazy';
  if (/(internship)/.test(text))             return 'getInternship';
  return null;
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const { messages: rawMessages } = await req.json();
    if (!Array.isArray(rawMessages)) {
      return new Response('Invalid payload', { status: 400 });
    }

    // Always inject system prompt first
    const messages = [
      ...(typeof SYSTEM_PROMPT === 'string'
        ? [{ role: 'system', content: SYSTEM_PROMPT }]
        : SYSTEM_PROMPT.role
        ? [SYSTEM_PROMPT]
        : []),
      ...rawMessages,
    ];

    // Look at the last user message
    const last = messages[messages.length - 1];
    const userText = last?.role === 'user' ? last.content : '';

    // 1) If a tool is clearly requested by keyword, call it immediately
    const toolName = detectToolCall(userText);
    if (toolName && toolName in toolRegistry) {
      const tool = toolRegistry[toolName as keyof typeof toolRegistry];
      const toolResult = await tool.execute({}, {
        toolCallId: 'direct-tool',
        messages: [],
      });
      const output = typeof toolResult === 'string'
        ? toolResult
        : JSON.stringify(toolResult);

      return new Response(output, {
        status: 200,
        headers: { 'Content-Type': 'text/plain' },
      });
    }

    // 2) Otherwise, fall back to the LLM (Groq) and stream the chat response
    const stream = await streamText({ model, messages });
    return stream.toDataStreamResponse();

  } catch (err) {
    console.error('Chat route error:', err);
    return new Response('Internal server error', { status: 500 });
  }
}

export async function GET() {
  return new Response('Use POST to chat.', { status: 405 });
}
