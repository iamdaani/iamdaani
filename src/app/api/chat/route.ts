import { NextRequest } from 'next/server';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { streamText } from 'ai';

export const config = {
  runtime: 'edge',
};
export const dynamic = 'force-dynamic';

const openrouter = createOpenAICompatible({
  name: 'openrouter',
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY!,
  headers: {
    'HTTP-Referer': 'https://www.ahmadyar.site/',
    'X-Title': 'Ahmad Yar',
  },
});

function errorResponse(message: string, status: number = 400): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(req: NextRequest) {
  console.log('🔥 /api/chat POST hit');

  let body;
  try {
    body = await req.json();
    console.log('🔍 Parsed JSON:', body.stream);
  } catch (e) {
    console.error('❌ JSON parse failed', e);
    return errorResponse('Invalid JSON payload', 400);
  }

  const { messages, stream = false } = body;

  const cleanedMessages = messages.map((m: { role?: string; content?: unknown }) => ({
    role: m.role,
    content: String(m.content || ''),
  }));

  const model = openrouter('mistralai/mistral-small-3.2-24b-instruct:free');

  if (!stream) {
    console.log('🟢 non-stream branch entered');
    try {
      console.log('⏳ Calling streamText…');
      const result = await streamText({ model, messages: cleanedMessages });
      console.log('✅ streamText returned');

      console.log('⏳ Awaiting first chunk from fullStream…');
      const iterator = result.fullStream?.[Symbol.asyncIterator]();
      const { value } = await iterator.next();
      const text = value?.text || 'No content';
      console.log('✅ Got first chunk text:', text);

      return new Response(JSON.stringify({ content: text }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (e) {
      console.error('❌ Non-stream error:', e);
      return errorResponse('Error in non-stream path', 500);
    }
  }

  try {
    const result = await streamText({ model, messages: cleanedMessages });
    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Streaming error:', error);
    return errorResponse('Error processing stream', 500);
  }
}

export async function GET(): Promise<Response> {
  return errorResponse('Method not allowed. Use POST to chat.', 405);
}
