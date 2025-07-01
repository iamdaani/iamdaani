import { NextRequest } from 'next/server';
import { OpenAI } from 'openai';

export const config = {
  runtime: 'edge',
};

// Create custom fetch adapter with correct types
const customFetch: typeof fetch = async (input, init) => {
  return fetch(input, init);
};

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY!,
  baseURL: 'https://openrouter.ai/api/v1',
  fetch: customFetch,
  defaultHeaders: {
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

export async function POST(req: NextRequest): Promise<Response> {
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

    // Prepare messages
    const cleanedMessages = messages.map(m => ({
      role: m.role,
      content: String(m.content || ''),
    }));

    // Handle streaming request
    if (stream) {
      try {
        const openaiResponse = await openai.chat.completions.create({
          model: 'mistralai/mistral-small-3.2-24b-instruct:free',
          messages: cleanedMessages,
          stream: true,
        });

        const encoder = new TextEncoder();
        
        const readableStream = new ReadableStream({
          async start(controller) {
            for await (const chunk of openaiResponse) {
              const content = chunk.choices[0]?.delta?.content || '';
              const toolCalls = chunk.choices[0]?.delta?.tool_calls;
              
              if (content) {
                controller.enqueue(encoder.encode(content));
              }
              
              if (toolCalls) {
                controller.enqueue(encoder.encode(
                  `\n<function>${JSON.stringify(toolCalls)}</function>`
                ));
              }
            }
            controller.close();
          }
        });

        return new Response(readableStream, {
          headers: { 
            'Content-Type': 'text/event-stream',
            'X-Stream-Type': 'openrouter'
          },
        });
        
      } catch (error: any) {
        console.error('Streaming Error:', error);
        return errorResponse(
          `Streaming failed: ${error.message || 'Unknown error'}`,
          500
        );
      }
    }

    // Handle non-streaming request
    const completion = await openai.chat.completions.create({
      model: 'mistralai/mistral-small-3.2-24b-instruct:free',
      messages: cleanedMessages,
      stream: false,
    });

    const content = completion.choices[0]?.message?.content || '';
    
    return new Response(JSON.stringify({
      id: `chatcmpl-${Date.now()}`,
      role: 'assistant',
      content,
      model: 'mistralai/mistral-small-3.2-24b-instruct:free',
      usage: completion.usage,
    }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('API Error:', error);
    
    // Handle OpenAI errors
    if (error instanceof OpenAI.APIError) {
      return errorResponse(
        `OpenRouter Error: ${error.message}`,
        error.status || 500
      );
    }
    
    return errorResponse(
      error.message || 'Internal server error',
      500
    );
  }
}

export async function GET(): Promise<Response> {
  return errorResponse('Method not allowed. Use POST to chat.', 405);
}