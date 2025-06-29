import { NextRequest } from 'next/server';
import { streamText } from 'ai';
import { groq } from '@ai-sdk/groq';
import { SYSTEM_PROMPT } from './prompt';
import { toolRegistry } from './tools/tool-registry';

// Allow up to 45s on Vercel
export const config = {
  runtime: 'nodejs',
  maxDuration: 45,
};

// Your Groq model
const model = groq('llama3-8b-8192');

/** Simple keyword-based tool detector */
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
    if (!Array.isArray(raw)) {
      return new Response('Invalid payload', { status: 400 });
    }

    // 1️⃣ Inject the system prompt
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...raw,
    ];

    // 2️⃣ Check the last user message for a tool keyword
    const last = messages[messages.length - 1];
    const userMsg = last.role === 'user' ? last.content : '';
    const toolName = detectToolCall(userMsg);

    if (toolName) {
      // 3️⃣ Run the tool immediately
      const tool = toolRegistry[toolName];
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

    // 4️⃣ No tool detected → stream the LLM response back
    const stream = await streamText({ model, messages });
    return stream.toDataStreamResponse();

  } catch (err) {
    console.error('Chat route error:', err);
    return new Response('Internal server error', { status: 500 });
  }
}

export async function GET(): Promise<Response> {
  return new Response('Use POST to chat.', { status: 405 });
}
