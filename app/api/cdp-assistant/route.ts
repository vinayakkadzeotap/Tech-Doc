import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { matchSkills } from '@/lib/utils/cdp-skills';
import { trackServerEvent, EVENTS } from '@/lib/utils/analytics';
import { rateLimit } from '@/lib/utils/rate-limit';
import { isMintlifyConfigured } from '@/lib/utils/mintlify';

const MINTLIFY_ASSISTANT_URL = 'https://api.mintlify.com/discovery/v1/assistant';
const MINTLIFY_DOMAIN = process.env.MINTLIFY_DOMAIN || 'zeotap';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Rate limit: 20 requests per minute per user
  const rl = rateLimit(`cdp-assistant:${user.id}`, 20, 60_000);
  if (!rl.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait before sending another message.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.reset / 1000)) } }
    );
  }

  const body = await request.json();
  const { session_id, message } = body;

  if (!message || typeof message !== 'string') {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 });
  }

  // Create or retrieve session
  let activeSessionId = session_id;
  if (!activeSessionId) {
    const title = message.length > 50 ? message.slice(0, 50) + '...' : message;
    const { data: session, error: sessionError } = await supabase
      .from('chat_sessions')
      .insert({ user_id: user.id, title })
      .select('id')
      .single();

    if (sessionError) {
      return NextResponse.json({ error: sessionError.message }, { status: 500 });
    }
    activeSessionId = session.id;
  }

  // Save user message
  await supabase.from('chat_messages').insert({
    session_id: activeSessionId,
    user_id: user.id,
    role: 'user',
    content: message,
  });

  // Track analytics event
  trackServerEvent(supabase, user.id, EVENTS.ASSISTANT_QUERY, {
    session_id: activeSessionId,
    query_length: message.length,
  });

  // Load conversation history (last 20 messages)
  const { data: history } = await supabase
    .from('chat_messages')
    .select('role, content')
    .eq('session_id', activeSessionId)
    .order('created_at', { ascending: true })
    .limit(20);

  // Build Mintlify-compatible messages array
  const mintlifyMessages = (history || []).map((m, idx) => ({
    id: `msg-${idx}`,
    role: m.role as 'user' | 'assistant',
    content: m.content,
    parts: [{ type: 'text' as const, text: m.content }],
  }));

  // Match skills for analytics/UI badges
  const matchedSkills = matchSkills(message);
  const skillNames = matchedSkills.map((s) => s.name);

  // Update session with matched skills
  await supabase
    .from('chat_sessions')
    .update({ skill_ids: skillNames, updated_at: new Date().toISOString() })
    .eq('id', activeSessionId);

  // Check Mintlify configuration
  if (!isMintlifyConfigured()) {
    return NextResponse.json(
      { error: 'CDP Assistant requires Mintlify API key. Please configure MINTLIFY_API_KEY.' },
      { status: 503 }
    );
  }

  // Call Mintlify Assistant API
  const mintlifyApiKey = process.env.MINTLIFY_API_KEY!;
  const mintlifyUrl = `${MINTLIFY_ASSISTANT_URL}/${MINTLIFY_DOMAIN}/message`;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const mintlifyRes = await fetch(mintlifyUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${mintlifyApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fp: user.id,
            messages: mintlifyMessages,
          }),
        });

        if (!mintlifyRes.ok) {
          const errText = await mintlifyRes.text();
          const errChunk = JSON.stringify({
            type: 'error',
            error: `Mintlify API error: ${mintlifyRes.status} ${errText}`,
          }) + '\n';
          controller.enqueue(encoder.encode(errChunk));
          controller.close();
          return;
        }

        const reader = mintlifyRes.body?.getReader();
        if (!reader) throw new Error('No response body');

        const decoder = new TextDecoder();
        let fullContent = '';
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          // Keep incomplete last line in buffer
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.trim()) continue;

            // Mintlify data stream protocol: prefix:JSON
            // 0:"text" = text delta
            // e:{...} = step finish
            // d:{...} = done
            if (line.startsWith('0:')) {
              try {
                const text = JSON.parse(line.slice(2));
                if (typeof text === 'string') {
                  fullContent += text;
                  const chunk = JSON.stringify({
                    type: 'content',
                    text,
                    session_id: activeSessionId,
                  }) + '\n';
                  controller.enqueue(encoder.encode(chunk));
                }
              } catch {
                // Skip malformed text chunks
              }
            }
          }
        }

        // Process remaining buffer
        if (buffer.trim() && buffer.startsWith('0:')) {
          try {
            const text = JSON.parse(buffer.slice(2));
            if (typeof text === 'string') {
              fullContent += text;
              const chunk = JSON.stringify({
                type: 'content',
                text,
                session_id: activeSessionId,
              }) + '\n';
              controller.enqueue(encoder.encode(chunk));
            }
          } catch {
            // Skip
          }
        }

        // Save assistant message to DB
        await supabase.from('chat_messages').insert({
          session_id: activeSessionId,
          user_id: user.id,
          role: 'assistant',
          content: fullContent,
          matched_skills: skillNames,
        });

        // Send done event
        const doneChunk = JSON.stringify({
          type: 'done',
          session_id: activeSessionId,
          matched_skills: skillNames,
          docs_augmented: true,
        }) + '\n';
        controller.enqueue(encoder.encode(doneChunk));
        controller.close();
      } catch (error) {
        const errMessage = error instanceof Error ? error.message : 'Unknown error';
        const errChunk = JSON.stringify({
          type: 'error',
          error: errMessage,
        }) + '\n';
        controller.enqueue(encoder.encode(errChunk));
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
}

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);

  // List sessions
  if (searchParams.get('sessions') === 'true') {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('id, title, skill_ids, created_at, updated_at')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(50);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  }

  // Load messages for a session
  const sessionId = searchParams.get('session_id');
  if (sessionId) {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('id, role, content, matched_skills, created_at')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  }

  return NextResponse.json({ error: 'Provide ?sessions=true or ?session_id=<id>' }, { status: 400 });
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { session_id } = await request.json();
  if (!session_id) {
    return NextResponse.json({ error: 'session_id required' }, { status: 400 });
  }

  const { error } = await supabase
    .from('chat_sessions')
    .delete()
    .eq('id', session_id)
    .eq('user_id', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
