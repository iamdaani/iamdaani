// src/app/api/chat/route.ts
import { NextRequest } from 'next/server';
import { SYSTEM_PROMPT } from './prompt';
import { toolRegistry } from './tools/tool-registry';

const MODEL_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL_API_KEY = process.env.OPENROUTER_API_KEY;

export const config = {
  runtime: 'nodejs',
  maxDuration: 45,
};

function detectToolCall(message: string): keyof typeof toolRegistry | null {
  const text = message.toLowerCase();
  if (/(contact|reach you|how can i contact)/.test(text)) return 'getContact';
  if (/(resume|cv|background)/.test(text)) return 'getResume';
  if (/(projects?|work|portfolio)/.test(text)) return 'getProjects';
  if (/(skills?|strengths)/.test(text)) return 'getSkills';
  if (/(presentation|about you)/.test(text)) return 'getPresentation';
  if (/(sport|sports)/.test(text)) return 'getSports';
  if (/(craziest|funny)/.test(text)) return 'getCrazy';
  if (/(internship)/.test(text)) return 'getInternship';
  return null;
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const { messages: rawMessages } = await req.json();
    if (!Array.isArray(rawMessages)) {
      return new Response('Invalid payload', { status: 400 });
    }

    const messages = [
      ...(typeof SYSTEM_PROMPT === 'string'
        ? [{ role: 'system', content: SYSTEM_PROMPT }]
        : SYSTEM_PROMPT.role
        ? [SYSTEM_PROMPT]
        : []),
      ...rawMessages,
    ];

    const lastMsg = messages[messages.length - 1];
    const userText = lastMsg?.role === 'user' ? lastMsg.content : '';

    // Step 1: Keyword tool call detection
    const toolName = detectToolCall(userText);
    if (toolName && toolRegistry[toolName]) {
      const tool = toolRegistry[toolName];
      const toolResult = await tool.execute({}, {
        toolCallId: 'manual-tool',
        messages: [],
      });
      const output = typeof toolResult === 'string' ? toolResult : JSON.stringify(toolResult);
      return new Response(output, {
        status: 200,
        headers: { 'Content-Type': 'text/plain' },
      });
    }

    // Step 2: Call OpenRouter model (Mistral Small 3.2)
    const response = await fetch(MODEL_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MODEL_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://yourdomain.com',
        'X-Title': 'MyAgent',
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-small-3.2-24b-instruct',
        messages,
        tools: Object.entries(toolRegistry).map(([name, tool]) => ({
          type: 'function',
          function: {
            name,
            description: tool.description ?? name,
            parameters: tool.parameters,
          },
        })),
        tool_choice: 'auto',
        stream: false,
      }),
    });

    if (!response.ok) {
      console.error('Model call failed', await response.text());
      return new Response('Model call failed', { status: 500 });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'No reply';

    return new Response(reply, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  } catch (err) {
    console.error('Handler error:', err);
    return new Response('Internal server error', { status: 500 });
  }
}

export async function GET() {
  return new Response('Use POST to chat.', { status: 405 });
}
