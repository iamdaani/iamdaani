// src/app/api/chat/route.ts
import { NextRequest } from 'next/server';
import { streamText } from 'ai';
import { groq } from '@ai-sdk/groq';
import { SYSTEM_PROMPT } from './prompt';
import { toolRegistry } from './tools/tool-registry';
import type { ToolExecutionOptions } from 'ai';

// Increase Vercel timeout
export const config = {
  runtime: 'nodejs',
  maxDuration: 45,
};

const model = groq('llama3-8b-8192');

/** 
 * Keyword-based detection of which tool to call.
 * Returns the key of toolRegistry, or null.
 */
function detectToolCall(msg: string): keyof typeof toolRegistry | null {
  const t = msg.trim().toLowerCase();
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

export async function POST(req: NextRequest): Promise<Response> {
  // 1) Parse incoming messages
  const { messages: raw } = await req.json().catch(() => ({}));
  const userMessages = Array.isArray(raw) ? raw : [];

  // 2) Build the base conversation with system prompt
  const baseMessages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...userMessages,
  ];

  // 3) Look at the last user message and detect a tool
  const last = baseMessages[baseMessages.length - 1];
  const text = last.role === 'user' ? last.content : '';
  const toolName = detectToolCall(text);

  let fullMessages = baseMessages;

  if (toolName && toolRegistry[toolName]) {
    // 4) Execute the tool immediately
    let toolOutput: string;
    try {
      const tool: any = toolRegistry[toolName];
      const res = await tool.execute({}, {
        toolCallId: 'manual-tool',
        messages: [],
      } as ToolExecutionOptions);
      toolOutput = typeof res === 'string' ? res : JSON.stringify(res);
    } catch (e) {
      console.error(`Tool ${toolName} failed:`, e);
      toolOutput = `⚠️ Error running ${toolName}: ${((e as Error).message)}`;
    }

    // 5) Inject the tool’s output as the assistant’s reply
    fullMessages = [
      ...baseMessages,
      { role: 'assistant', content: toolOutput },
    ];
  }

  // 6) Stream *always* via the LLM’s SSE path
  //    (this includes both normal chat and our injected tool response)
  const chatStream = await streamText({ model, messages: fullMessages });
  return chatStream.toDataStreamResponse();
}

export async function GET(): Promise<Response> {
  return new Response('Use POST to chat.', { status: 405 });
}
