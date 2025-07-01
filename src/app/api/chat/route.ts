// src/app/api/chat/route.ts
import { NextRequest } from 'next/server';
import OpenAI from 'openai';

export const config = {
  runtime: 'edge',
};

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY!,
  defaultHeaders: {
    'HTTP-Referer': 'https://www.ahmadyar.site/',
    'X-Title': 'Ahmad Yar',
  },
});

export async function POST(req: NextRequest) {
  try {
    const { messages, stream: clientWantsStream = false } = await req.json();
    
    // Validation
    if (!Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Messages must be an array' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!messages.some(m => m.role === 'user')) {
      return new Response(JSON.stringify({ error: 'At least one user message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Handle streaming request
    if (clientWantsStream) {
      const stream = await openai.chat.completions.create({
        model: 'mistralai/mistral-small-3.2-24b-instruct:free',
        messages,
        stream: true,
      });

      const responseStream = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();
          for await (const chunk of stream) {
            controller.enqueue(encoder.encode(chunk.choices[0]?.delta?.content || ''));
          }
          controller.close();
        },
      });

      return new Response(responseStream, {
        headers: { 'Content-Type': 'text/event-stream' },
      });
    }

    // Handle non-streaming request
    const completion = await openai.chat.completions.create({
      model: 'mistralai/mistral-small-3.2-24b-instruct:free',
      messages,
      stream: false,
    });

    return new Response(JSON.stringify({
      content: completion.choices[0]?.message?.content || ''
    }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({
      error: error.message || 'Unknown error occurred'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
