// src/app/api/chat/route.ts
import { NextRequest } from 'next/server';
import OpenAI from 'openai';

export const config = {
  runtime: 'edge', // Required for proper streaming support
};

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY!,
  defaultHeaders: {
    'HTTP-Referer': 'https://www.ahmadyar.site/',
    'X-Title': 'Ahmad Yar',
  },
});

// Helper function for error responses
function errorResponse(message: string, status: number = 400) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(req: NextRequest) {
  try {
    // Parse and validate request body
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return errorResponse('Invalid JSON payload', 400);
    }

    const { messages, stream = false } = body;
    
    if (!Array.isArray(messages)) {
      return errorResponse('Messages must be an array', 400);
    }

    if (!messages.some(m => m?.role === 'user')) {
      return errorResponse('At least one user message is required', 400);
    }

    // Prepare messages (ensure content is string)
    const cleanedMessages = messages.map(m => ({
      role: m.role,
      content: String(m.content || ''),
    }));

    // Handle streaming request
    if (stream) {
      const stream = await openai.chat.completions.create({
        model: 'mistralai/mistral-small-3.2-24b-instruct:free',
        messages: cleanedMessages,
        stream: true,
      });

      const responseStream = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();
          try {
            for await (const chunk of stream) {
              const content = chunk.choices?.[0]?.delta?.content || '';
              controller.enqueue(encoder.encode(content));
            }
          } catch (e) {
            console.error('Stream error:', e);
          } finally {
            controller.close();
          }
        },
      });

      return new Response(responseStream, {
        headers: { 'Content-Type': 'text/event-stream' },
      });
    }

    // Handle non-streaming request
    const completion = await openai.chat.completions.create({
      model: 'mistralai/mistral-small-3.2-24b-instruct:free',
      messages: cleanedMessages,
      stream: false,
    });

    // Validate response structure
    if (!completion?.choices?.[0]?.message?.content) {
      console.error('Invalid response structure:', completion);
      return errorResponse('Invalid response from AI provider', 502);
    }

    return new Response(JSON.stringify({
      content: completion.choices[0].message.content
    }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('API Error:', error);
    
    // Handle OpenAI-specific errors
    if (error instanceof OpenAI.APIError) {
      return errorResponse(
        `AI service error: ${error.message}`,
        error.status || 500
      );
    }
    
    // Handle generic errors
    return errorResponse(
      error?.message || 'Internal server error',
      500
    );
  }
}
