import { groq } from '@ai-sdk/groq';
import { streamText } from 'ai';
import { SYSTEM_PROMPT } from '@/lib/system-prompt';

// Use Vercel Edge Runtime for low-latency streaming
export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response('Invalid request: messages array required', { status: 400 });
    }

    const result = await streamText({
      model: groq('llama-3.3-70b-versatile'),
      system: SYSTEM_PROMPT,
      messages,
    });

    const anyResult = result as any;
    return anyResult.toDataStreamResponse ? anyResult.toDataStreamResponse() : (anyResult.toUIMessageStreamResponse ? anyResult.toUIMessageStreamResponse() : anyResult.toTextStreamResponse());
  } catch (error: unknown) {
    console.error('[/api/chat] Error:', error);

    // Handle Groq rate limit (free tier)
    if (error instanceof Error && error.message.includes('429')) {
      return new Response(
        JSON.stringify({ error: 'Rate limit reached. Please wait a moment before sending another message.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Handle missing API key
    if (error instanceof Error && error.message.includes('API key')) {
      return new Response(
        JSON.stringify({ error: 'Server configuration error. Please contact support.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Something went wrong. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
