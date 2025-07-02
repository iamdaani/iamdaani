import { NextRequest } from 'next/server';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { streamText } from 'ai'; // Only import streamText

export const config = {
  runtime: 'edge',
};
// Turn off caching so our SSE can flow freely
export const dynamic = 'force-dynamic';

// Create OpenAI-compatible client
const openrouter = createOpenAICompatible({
  name: 'openrouter',
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY!,
  headers: {
    'HTTP-Referer': 'https://www.ahmadyar.site/',
    'X-Title': 'Ahmad Yar',
  },
});

// Helper function for error responses
function errorResponse(message: string, status: number = 400): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(req: NextRequest) {
  console.log('🔥 /api/chat POST hit');              // (1)

  let body;
  try {
    body = await req.json();
    console.log('🔍 Parsed JSON:', body.stream);     // (2)
  } catch (e) {
    console.error('❌ JSON parse failed', e);
    return errorResponse('Invalid JSON payload', 400);
  }

  const { messages, stream = false } = body;
  if (!stream) {
    console.log('🟢 non-stream branch entered');      // (3)
    try {
      // Prepare messages and model as before
      const cleanedMessages = messages.map((m: { role?: string; content?: unknown }) => ({
        role: m.role,
        content: String(m.content || ''),
      }));
      const model = openrouter('mistralai/mistral-small-3.2-24b-instruct:free');

      console.log('⏳ Calling streamText…');           // (4)
      const result = await streamText({ model, messages: cleanedMessages });
      console.log('✅ streamText returned');          // (5)

      console.log('⏳ Awaiting result.text…');
      const text = await result.text;
      console.log('✅ Got text:', text);              // (6)

      return new Response(JSON.stringify({ content: text }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (e) {
      console.error('❌ Non-stream error:', e);        // (7)
      return errorResponse('Error in non-stream path', 500);
    }
  }

  // Handle streaming request
  try {
    const cleanedMessages = messages.map((m: { role?: string; content?: unknown }) => ({
      role: m.role,
      content: String(m.content || ''),
    }));
    const model = openrouter('mistralai/mistral-small-3.2-24b-instruct:free');

    const result = await streamText({
      model,
      messages: cleanedMessages,
    });

    // this one does:
    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Streaming error:', error);
    return errorResponse('Error processing stream', 500);
  } 

}

export async function GET(): Promise<Response> {
  return errorResponse('Method not allowed. Use POST to chat.', 405);
}