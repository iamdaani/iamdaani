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
    console.log('🔍 Parsed JSON stream flag:', body?.stream);
  } catch (e) {
    console.error('❌ JSON parse failed:', e);
    return errorResponse('Invalid JSON payload', 400);
  }

  const { messages, stream = false } = body || {};

  if (!Array.isArray(messages)) {
    return errorResponse('Invalid or missing "messages" array', 400);
  }

  const cleanedMessages = messages.map((m: any) => ({
    role: m?.role || 'user',
    content: String(m?.content || ''),
  }));

  const model = openrouter('mistralai/mistral-small-3.2-24b-instruct:free');

  if (!stream) {
    console.log('🟢 Entered non-stream path');
    try {
      const result = await streamText({ model, messages: cleanedMessages });
      console.log('✅ streamText() returned');

      let text = 'No content';

      try {
        console.log('⏳ Trying fullStream()...');
        const fullStream = result.fullStream;

        if (fullStream && Symbol.asyncIterator in fullStream) {
          const iterator = fullStream[Symbol.asyncIterator]();
          const { value } = await iterator.next();

          if (value?.text?.trim()) {
            text = value.text;
            console.log('✅ Got first chunk text:', text);
          } else {
            console.warn('⚠️ First chunk is empty, falling back to .text');
            text = await result.text;
          }
        } else {
          console.warn('⚠️ fullStream not async iterable, using .text');
          text = await result.text;
        }
      } catch (streamErr) {
        console.error('❌ Error during fullStream fallback:', streamErr);
        text = await result.text;
      }

      return new Response(JSON.stringify({ content: text }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err) {
      console.error('❌ Non-stream path failure:', err);
      return errorResponse('Server error in non-stream mode', 500);
    }
  }

  // Streaming path
  try {
    const result = await streamText({ model, messages: cleanedMessages });
    if (typeof result.toDataStreamResponse === 'function') {
      return result.toDataStreamResponse();
    } else {
      console.error('❌ toDataStreamResponse() not available on result');
      return errorResponse('Streaming not supported by result', 500);
    }
  } catch (err) {
    console.error('❌ Streaming path failure:', err);
    return errorResponse('Server error in stream mode', 500);
  }
}

export async function GET(): Promise<Response> {
  return errorResponse('Method not allowed. Use POST to chat.', 405);
}