// src/app/api/chat/route.ts
import { getContact } from './tools/getContact';
import { getCrazy } from './tools/getCrazy';
import { getInternship } from './tools/getIntership';
import { getPresentation } from './tools/getPresentation';
import { getProjects } from './tools/getProjects';
import { getResume } from './tools/getResume';
import { getSkills } from './tools/getSkills';
import { getSports } from './tools/getSport';
// filepath: z:\github\ahmadyar\src\app\api\chat\route.ts
import { NextRequest } from 'next/server';
import { streamText } from 'ai';
import { groq } from '@ai-sdk/groq';
import { SYSTEM_PROMPT } from './prompt';

export const maxDuration = 30;

// ✅ Set the model only
const model = groq('Mistral Saba 24B');

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { messages } = body;

    // ✅ Add system prompt if needed
    if (typeof SYSTEM_PROMPT === 'string') {
      messages = [{ role: 'system', content: SYSTEM_PROMPT }, ...messages];
    } else if (SYSTEM_PROMPT?.role && SYSTEM_PROMPT?.content) {
      messages = [SYSTEM_PROMPT, ...messages];
    }

    // Add tools for tool calling
    const tools = {
      getProjects,
      getPresentation,
      getResume,
      getContact,
      getSkills,
      getSports,
      getCrazy,
      getInternship,
    };

    // ✅ Send request to Groq API via AI SDK (add tools if needed)
    const result = await streamText({
      model,
      messages,
      tools,
    });

    // ✅ Stream back the response
    return result.toDataStreamResponse();

  } catch (error) {
    console.error('Global error:', error);
    return new Response('Server error', { status: 500 });
  }
}

export async function GET() {
  return new Response("Use POST method to send chat messages.", {
    status: 405,
    headers: { 'Content-Type': 'text/plain' }
  });
}