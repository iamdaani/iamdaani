// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export const config = {
  runtime: 'nodejs',
  maxDuration: 45,
};

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY!,
  defaultHeaders: {
    'HTTP-Referer': 'https://www.ahmadyar.site/',
    'X-Title': 'Ahmad Yar',
  },
});

export async function POST(req: NextRequest): Promise<Response> {
  try {
    // Parse and validate request
    const { messages } = await req.json();
    
    if (!Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages must be an array' },
        { status: 400 }
      );
    }

    if (!messages.some((m: any) => m.role === 'user')) {
      return NextResponse.json(
        { error: 'At least one user message is required' },
        { status: 400 }
      );
    }

    // Create completion without streaming
    const completion = await openai.chat.completions.create({
      model: 'mistralai/mistral-small-3.2-24b-instruct:free',
      messages: messages.map(({ role, content }) => ({ role, content })),
      stream: false, // Explicitly disable streaming
    });

    // Extract and validate response
    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      console.error('Invalid response format:', completion);
      return NextResponse.json(
        { error: 'Invalid response from model' },
        { status: 502 }
      );
    }

    // Return properly formatted JSON response
    return NextResponse.json({
      success: true,
      message: responseContent
    });

  } catch (error: any) {
    console.error('API Error:', error);
    
    // Handle OpenAI-specific errors
    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { 
          error: error.message,
          status: error.status,
          code: error.code
        },
        { status: error.status || 500 }
      );
    }
    
    // Handle generic errors
    return NextResponse.json(
      { error: error?.message || 'Unknown error occurred' },
      { status: 500 }
    );
  }
}

export async function GET(): Promise<Response> {
  return NextResponse.json(
    { error: 'Use POST method to chat' },
    { status: 405 }
  );
}
