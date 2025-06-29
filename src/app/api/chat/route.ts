import { NextRequest } from 'next/server';
import { streamText } from 'ai';
import { groq } from '@ai-sdk/groq';
import { SYSTEM_PROMPT } from './prompt';
import { toolRegistry } from './tools/tool-registry';

export const maxDuration = 30;

// ✅ Model setup
const model = groq('llama3-8b-8192');

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { messages } = body;

    // ✅ Inject system prompt
    if (typeof SYSTEM_PROMPT === 'string') {
      messages = [{ role: 'system', content: SYSTEM_PROMPT }, ...messages];
    } else if (SYSTEM_PROMPT?.role && SYSTEM_PROMPT?.content) {
      messages = [SYSTEM_PROMPT, ...messages];
    }

    // ✅ Call the Groq model
    const result = await streamText({
      model,
      messages,
    });

    // ✅ Collect stream into string
    let textResponse = '';
    for await (const delta of result.textStream) {
      // delta is string not object → just add directly
      textResponse += delta;
    }

    // ✅ Try to detect and run tool manually
    try {
      const parsed = JSON.parse(textResponse.trim());
      const toolName = parsed.tool_call as keyof typeof toolRegistry;

      if (toolName && toolRegistry[toolName]) {
        const toolResult = await toolRegistry[toolName].execute(parsed.arguments || {}, {
          toolCallId: 'manual-tool-call',
          messages: [],
            }); // <-- second arg required
        const finalResponse = typeof toolResult === 'string' ? toolResult : JSON.stringify(toolResult);
        return new Response(finalResponse);
      }
    } catch (e) {
      // Not a tool call or malformed JSON — fall back to AI reply
    }

    // ✅ Return normal LLM response
    return new Response(textResponse);

  } catch (error) {
    console.error('Global error:', error);
    return new Response('Server error', { status: 500 });
  }
}

export async function GET() {
  return new Response("Use POST method to send chat messages.", {
    status: 405,
    headers: { 'Content-Type': 'text/plain' }
  });
}
