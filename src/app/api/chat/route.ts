import { NextRequest } from 'next/server';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { streamText, StreamTextResult } from 'ai'; // Import StreamTextResult type
import { toAIStream } from 'ai/streams'; // Add this import

export const config = {
  runtime: 'edge',
};

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

    // Get the model
    const model = openrouter('mistralai/mistral-small-3.2-24b-instruct:free');
    
    // Handle streaming request
    if (stream) {
      try {
        const result = await streamText({
          model,
          messages: cleanedMessages,
        });

        // Convert to AI stream response
        return result.toDataStreamResponse();
        
      } catch (error) {
        console.error('Streaming error:', error);
        return errorResponse('Error processing stream', 500);
      }
    } 

    // Handle non-streaming request
    const result = await streamText({
      model,
      messages: cleanedMessages,
    });
    
    const text = await result.text;
    
    return new Response(JSON.stringify({
      id: `chatcmpl-${Date.now()}`,
      role: 'assistant',
      content: text,
      model: 'mistralai/mistral-small-3.2-24b-instruct:free',
    }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('API Error:', error);
    
    return errorResponse(
      error.message || 'Internal server error',
      500
    );
  }
}

export async function GET(): Promise<Response> {
  return errorResponse('Method not allowed. Use POST to chat.', 405);
}