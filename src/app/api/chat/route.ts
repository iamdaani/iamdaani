// src/app/api/chat/route.ts
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { SYSTEM_PROMPT } from './prompt';
import { getContact } from './tools/getContact';
import { getCrazy } from './tools/getCrazy';
import { getInternship } from './tools/getInternship';
import { getPresentation } from './tools/getPresentation';
import { getProjects } from './tools/getProjects';
import { getResume } from './tools/getResume';
import { getSkills } from './tools/getSkills';
import { getSports } from './tools/getSport';
import { getExperience } from './tools/getExperience';

export const maxDuration = 30;

// Friendly error extractor
function errorHandler(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return JSON.stringify(error);
}

export async function POST(req: Request) {
  try {
    const { messages: rawMessages } = await req.json();
    console.log('[CHAT-API] Incoming messages:', rawMessages);

    // Ensure messages is an array
    const messages = Array.isArray(rawMessages) ? [...rawMessages] : [];
    // Prepend system prompt
    messages.unshift(SYSTEM_PROMPT);

    // Tool set
    const tools = {
      getProjects,
      getPresentation,
      getResume,
      getContact,
      getSkills,
      getSports,
      getCrazy,
      getInternship,
      getExperience,
    };

    // Kick off streaming with Groq + mistral-saba-24b
    const result = streamText({
      model: openai('gpt-4o-mini'),
      messages,
      toolCallStreaming: true,
      tools,
      maxSteps: 2,
    });

    // Stream back to client
    return result.toDataStreamResponse({
      getErrorMessage: errorHandler,
    });
  } catch (err) {
    console.error('Global error:', err);
    const msg = errorHandler(err);
    return new Response(msg, { status: 500 });
  }
}

export async function GET() {
  return new Response('Use POST to chat', {
    status: 405,
    headers: { 'Content-Type': 'text/plain' },
  });
}
