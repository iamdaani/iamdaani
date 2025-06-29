import { NextRequest } from 'next/server';
import { streamText } from 'ai';
import { groq } from '@ai-sdk/groq';
import { SYSTEM_PROMPT } from './prompt';
import { toolRegistry } from './tools/tool-registry';
import type { ToolExecutionOptions } from 'ai';

export const maxDuration = 30;
const model = groq('llama3-8b-8192');

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const { messages: rawMessages } = await req.json();
    let messages = Array.isArray(rawMessages) ? rawMessages : [];

    // 1️⃣ Inject system prompt
    if (typeof SYSTEM_PROMPT === 'string') {
      messages = [{ role: 'system', content: SYSTEM_PROMPT }, ...messages];
    } else if (SYSTEM_PROMPT?.role && SYSTEM_PROMPT?.content) {
      messages = [SYSTEM_PROMPT, ...messages];
    }

    // 2️⃣ Call the LLM
    const maybeStream = await streamText({ model, messages });

    // 3️⃣ Extract text safely
    let fullText: string;
    if (typeof maybeStream === 'string') {
      fullText = maybeStream;
    } else if ('text' in maybeStream && maybeStream.text instanceof Promise) {
      // NOTE: no parentheses after .text — it's already a Promise<string>
      fullText = await maybeStream.text;
    } else {
      // Fallback if structure differs
      fullText = String(maybeStream);
    }
    fullText = fullText.trim();

    // 4️⃣ Try parsing for a tool call
    try {
      const parsed = JSON.parse(fullText);
      const toolName = parsed?.tool_call;
      const toolArgs = parsed?.arguments ?? {};

      if (
        typeof toolName === 'string' &&
        toolName in toolRegistry
      ) {
        const tool = toolRegistry[toolName as keyof typeof toolRegistry];
        const options: ToolExecutionOptions = {
          toolCallId: 'manual-tool-call',
          messages: [],
        };
        const toolResult = await tool.execute(toolArgs, options);
        const output = typeof toolResult === 'string'
          ? toolResult
          : JSON.stringify(toolResult);
        return new Response(output, {
          status: 200,
          headers: { 'Content-Type': 'text/plain' },
        });
      }
    } catch {
      // not a tool call → fall through
    }

    // 5️⃣ Fallback: return the plain LLM response
    return new Response(fullText, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  } catch (err) {
    console.error('API error:', err);
    return new Response('Internal server error', { status: 500 });
  }
}

export async function GET(): Promise<Response> {
  return new Response('Use POST to chat.', {
    status: 405,
    headers: { 'Content-Type': 'text/plain' },
  });
}
