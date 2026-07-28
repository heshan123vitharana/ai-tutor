import { groq } from '@ai-sdk/groq';
import { streamText, convertToModelMessages } from 'ai';
import { SYSTEM_PROMPT } from '@/lib/system-prompt';

// Use Vercel Edge Runtime for low-latency streaming
export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response('Invalid request: messages array required', { status: 400 });
    }
    
    // Robust mapping from UIMessage to CoreMessage
    const coreMessages = messages
      .filter((msg: any) => msg.role === 'user' || msg.role === 'assistant' || msg.role === 'system')
      .map((msg: any) => {
        let textContent = msg.content || '';
        
        // Handle cases where the UI or tests send 'parts' instead of 'content'
        if (!textContent && msg.parts && Array.isArray(msg.parts)) {
          textContent = msg.parts
            .filter((p: any) => p.type === 'text')
            .map((p: any) => p.text)
            .join('');
        }

        return {
          role: msg.role,
          content: textContent
        };
      });

    const result = await streamText({
      model: groq('llama-3.3-70b-versatile'),
      system: SYSTEM_PROMPT,
      messages: coreMessages,
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
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
