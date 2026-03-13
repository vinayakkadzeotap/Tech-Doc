export const dynamic = 'force-dynamic';

// Lightweight proxy to Mintlify Assistant API — no auth required
// The mint_dsc_ key is a public token, but we proxy to avoid CORS issues

const MINTLIFY_API_KEY = process.env.MINTLIFY_API_KEY || process.env.NEXT_PUBLIC_MINTLIFY_API_KEY || '';
const MINTLIFY_DOMAIN = process.env.MINTLIFY_DOMAIN || 'zeotap';
const MINTLIFY_URL = `https://api.mintlify.com/discovery/v1/assistant/${MINTLIFY_DOMAIN}/message`;

export async function POST(request: Request) {
  if (!MINTLIFY_API_KEY) {
    return new Response(
      JSON.stringify({ type: 'error', error: 'Mintlify API key not configured' }) + '\n',
      { status: 503, headers: { 'Content-Type': 'text/event-stream' } }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ type: 'error', error: 'Invalid request body' }) + '\n',
      { status: 400, headers: { 'Content-Type': 'text/event-stream' } }
    );
  }

  const { messages } = body;
  if (!messages || !Array.isArray(messages)) {
    return new Response(
      JSON.stringify({ type: 'error', error: 'messages array is required' }) + '\n',
      { status: 400, headers: { 'Content-Type': 'text/event-stream' } }
    );
  }

  // Build Mintlify-compatible messages
  const mintlifyMessages = messages.map((m: { role: string; content: string }, idx: number) => ({
    id: `msg-${idx}`,
    role: m.role,
    content: m.content,
    parts: [{ type: 'text', text: m.content }],
  }));

  try {
    const mintlifyRes = await fetch(MINTLIFY_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${MINTLIFY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fp: 'zeobot-user',
        messages: mintlifyMessages,
      }),
    });

    if (!mintlifyRes.ok) {
      const errText = await mintlifyRes.text();
      return new Response(
        JSON.stringify({ type: 'error', error: `Mintlify error: ${mintlifyRes.status}` }) + '\n',
        { status: 502, headers: { 'Content-Type': 'text/event-stream' } }
      );
    }

    // Stream Mintlify's response, converting their data stream protocol to our format
    const reader = mintlifyRes.body?.getReader();
    if (!reader) {
      return new Response(
        JSON.stringify({ type: 'error', error: 'No response body from Mintlify' }) + '\n',
        { status: 502, headers: { 'Content-Type': 'text/event-stream' } }
      );
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        let buffer = '';

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (!line.trim()) continue;
              // Mintlify: 0:"text" = text delta
              if (line.startsWith('0:')) {
                try {
                  const text = JSON.parse(line.slice(2));
                  if (typeof text === 'string') {
                    const chunk = JSON.stringify({ type: 'content', text }) + '\n';
                    controller.enqueue(encoder.encode(chunk));
                  }
                } catch {
                  // Skip malformed
                }
              }
            }
          }

          // Process remaining buffer
          if (buffer.trim() && buffer.startsWith('0:')) {
            try {
              const text = JSON.parse(buffer.slice(2));
              if (typeof text === 'string') {
                const chunk = JSON.stringify({ type: 'content', text }) + '\n';
                controller.enqueue(encoder.encode(chunk));
              }
            } catch {
              // Skip
            }
          }

          controller.enqueue(encoder.encode(JSON.stringify({ type: 'done' }) + '\n'));
          controller.close();
        } catch (error) {
          const errMsg = error instanceof Error ? error.message : 'Stream error';
          controller.enqueue(encoder.encode(JSON.stringify({ type: 'error', error: errMsg }) + '\n'));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ type: 'error', error: errMsg }) + '\n',
      { status: 500, headers: { 'Content-Type': 'text/event-stream' } }
    );
  }
}
