import { NextRequest } from 'next/server';
import { streamText } from 'ai';
import { groq } from '@ai-sdk/groq';
import { SYSTEM_PROMPT } from './prompt';

export const maxDuration = 30;

// ✅ Set the model only
const model = groq('llama3-8b-8192');

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { messages } = body;

    // ✅ Add system prompt if needed
    if (typeof SYSTEM_PROMPT === 'string') {
      messages = [{ role: 'system', content: SYSTEM_PROMPT }, ...messages];
    } else if (SYSTEM_PROMPT?.role && SYSTEM_PROMPT?.content) {
      messages = [SYSTEM_PROMPT, ...messages];
    }

    // ✅ Send request to Groq API via AI SDK
    const result = await streamText({
      model,
      messages,
    });

    // ✅ Stream back the response
    return result.toDataStreamResponse();

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
