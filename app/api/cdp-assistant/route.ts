import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import Anthropic from '@anthropic-ai/sdk';
import { matchSkills, loadSkillContent } from '@/lib/utils/cdp-skills';
import { trackServerEvent, EVENTS } from '@/lib/utils/analytics';
import { rateLimit } from '@/lib/utils/rate-limit';
import { fetchDocsContext } from '@/lib/utils/mintlify-context';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are the Zeotap CDP Assistant — an expert guide for the Zeotap Customer Data Platform. You help marketers, data analysts, and business users understand and leverage CDP capabilities.

Your core capabilities:
- Build audience segments from business goals
- Identify churn risk and retention opportunities
- Analyze customer data trends and patterns
- Recommend customer journeys and next-best-actions
- Guide data enrichment strategies
- Monitor pipeline health and data quality
- Design predictive ML models
- Navigate industry-specific marketing strategies

Guidelines:
- Be concise but thorough. Use bullet points and structured formats.
- When a user asks about a specific CDP task, follow the relevant skill workflow.
- Always ground recommendations in data — suggest what to measure and how.
- If the user's question is vague, ask clarifying questions before diving in.
- Use markdown formatting: headers, bold, code blocks, tables where appropriate.
- Reference Zeotap-specific terminology and capabilities naturally.
- Be practical — focus on actionable steps, not theory.`;

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

  const messages = (history || []).map((m) => ({
    role: m.role as 'user' | 'assistant',
    content: m.content,
  }));

  // Match skills and build context
  const matchedSkills = matchSkills(message);
  const skillContext = matchedSkills
    .map((skill) => loadSkillContent(skill.name))
    .filter(Boolean)
    .join('\n\n---\n\n');

  // Fetch documentation context for RAG augmentation
  const docsContext = await fetchDocsContext(message);
  const docsAugmented = docsContext.length > 0;

  let systemPrompt = skillContext
    ? `${SYSTEM_PROMPT}\n\n## Active Skill Context\n\nThe following CDP skill knowledge is relevant to this conversation:\n\n${skillContext}`
    : SYSTEM_PROMPT;

  if (docsContext) {
    systemPrompt += `\n\n## Zeotap Product Documentation\n\nThe following documentation from Zeotap's official docs is relevant:\n\n${docsContext}`;
  }

  // Update session with matched skills
  const skillNames = matchedSkills.map((s) => s.name);
  await supabase
    .from('chat_sessions')
    .update({ skill_ids: skillNames, updated_at: new Date().toISOString() })
    .eq('id', activeSessionId);

  // Stream response from Anthropic
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = anthropic.messages.stream({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2048,
          system: systemPrompt,
          messages,
        });

        let fullContent = '';

        response.on('text', (text) => {
          fullContent += text;
          const chunk = JSON.stringify({
            type: 'content',
            text,
            session_id: activeSessionId,
          }) + '\n';
          controller.enqueue(encoder.encode(chunk));
        });

        response.on('end', async () => {
          // Save assistant message
          await supabase.from('chat_messages').insert({
            session_id: activeSessionId,
            user_id: user.id,
            role: 'assistant',
            content: fullContent,
            matched_skills: skillNames,
          });

          const doneChunk = JSON.stringify({
            type: 'done',
            session_id: activeSessionId,
            matched_skills: skillNames,
            docs_augmented: docsAugmented,
          }) + '\n';
          controller.enqueue(encoder.encode(doneChunk));
          controller.close();
        });

        response.on('error', (error) => {
          const errChunk = JSON.stringify({
            type: 'error',
            error: error.message || 'Stream error',
          }) + '\n';
          controller.enqueue(encoder.encode(errChunk));
          controller.close();
        });
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
