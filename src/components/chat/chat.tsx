// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export const config = {
  runtime: 'edge', // Required for @ai-sdk/react compatibility
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
    // Validate request
    if (!req.body) {
      return NextResponse.json(
        { error: 'Request body is required' },
        { status: 400 }
      );
    }

    const { messages, stream = false } = await req.json();

    // Validate messages array
    if (!Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages must be an array' },
        { status: 400 }
      );
    }

    // Check for at least one user message
    if (!messages.some(m => m.role === 'user')) {
      return NextResponse.json(
        { error: 'At least one user message is required' },
        { status: 400 }
      );
    }

    // Process messages (ensure content is string)
    const processedMessages = messages.map(m => ({
      role: m.role,
      content: String(m.content || ''),
    }));

    // Handle streaming response
    if (stream) {
      const openaiStream = await openai.chat.completions.create({
        model: 'mistralai/mistral-small-3.2-24b-instruct:free',
        messages: processedMessages,
        stream: true,
      });

      const streamResponse = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();
          
          for await (const chunk of openaiStream) {
            const content = chunk.choices[0]?.delta?.content || '';
            controller.enqueue(encoder.encode(content));
          }
          
          controller.close();
        },
      });

      return new Response(streamResponse, {
        headers: { 'Content-Type': 'text/event-stream' },
      });
    }

    // Handle non-streaming response
    const completion = await openai.chat.completions.create({
      model: 'mistralai/mistral-small-3.2-24b-instruct:free',
      messages: processedMessages,
      stream: false,
    });

    // Validate and format response for @ai-sdk/react
    if (!completion.choices?.[0]?.message?.content) {
      console.error('Invalid response structure:', completion);
      return NextResponse.json(
        { error: 'Invalid response from AI provider' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      id: `chatcmpl-${Date.now()}`,       // Required by ai-sdk
      role: 'assistant',                 // Required
      content: completion.choices[0].message.content,
      model: 'mistralai/mistral-small-3.2-24b-instruct:free', // Required
      usage: completion.usage,           // Optional but useful
      created: Math.floor(Date.now() / 1000), // Unix timestamp
    });

  } catch (error: any) {
    console.error('API Error:', error);

    // Handle OpenAI-specific errors
    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { 
          error: error.message,
          code: error.code,
          status: error.status 
        },
        { status: error.status || 500 }
      );
    }

    // Handle generic errors
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to chat.' },
    { status: 405 }
  );
}
