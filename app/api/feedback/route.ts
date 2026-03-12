import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { trackServerEvent, EVENTS } from '@/lib/utils/analytics';
import { sendSlackNotification } from '@/lib/utils/slack';
import { createNotification } from '@/lib/utils/notify';
import { feedbackSchema, feedbackPatchSchema, validateBody } from '@/lib/utils/validation';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const rawBody = await request.json();
  const validation = validateBody(feedbackSchema, rawBody);
  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }
  const { content_type, content_id, rating, comment, issue_type } = validation.data;

  const { data, error } = await supabase.from('feedback').insert({
    user_id: user.id,
    content_type,
    content_id,
    rating: rating || 0,
    comment: comment || '',
    issue_type: issue_type || '',
  }).select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  trackServerEvent(supabase, user.id, EVENTS.FEEDBACK_SUBMIT, {
    content_type,
    content_id,
    rating: rating || 0,
  });

  // Send Slack notification for content team
  try {
    const { data: slackSettings } = await supabase
      .from('platform_settings')
      .select('value')
      .eq('key', 'slack')
      .maybeSingle();

    if (slackSettings?.value) {
      const config = slackSettings.value as { webhook_url?: string; events?: Record<string, boolean> };
      if (config.webhook_url && config.events?.feedback !== false) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .maybeSingle();
        const userName = profile?.full_name || user.email || 'A user';
        sendSlackNotification(
          config.webhook_url,
          `New Feedback: ${content_type}/${content_id}`,
          `${userName} rated ${rating}/5${comment ? `: "${comment}"` : ''}${issue_type ? ` (Issue: ${issue_type})` : ''}`,
          undefined
        );
      }
    }
  } catch { /* best-effort Slack notification */ }

  return NextResponse.json({ success: true, data });
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Check admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile?.is_admin) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }

  const rawPatchBody = await request.json();
  const patchValidation = validateBody(feedbackPatchSchema, rawPatchBody);
  if (!patchValidation.success) {
    return NextResponse.json({ error: patchValidation.error }, { status: 400 });
  }
  const { feedback_id, status, admin_response } = patchValidation.data;

  // Get original feedback for notification
  const { data: feedback } = await supabase
    .from('feedback')
    .select('user_id, content_type, content_id')
    .eq('id', feedback_id)
    .maybeSingle();

  const { error } = await supabase
    .from('feedback')
    .update({
      status,
      addressed_by: user.id,
      addressed_at: new Date().toISOString(),
      admin_response: admin_response || '',
    })
    .eq('id', feedback_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Notify the original feedback author
  if (feedback?.user_id && status === 'addressed') {
    try {
      await createNotification(
        supabase,
        feedback.user_id,
        'info',
        'Feedback Addressed',
        admin_response
          ? `Your feedback on ${feedback.content_type}/${feedback.content_id} has been reviewed: "${admin_response}"`
          : `Your feedback on ${feedback.content_type}/${feedback.content_id} has been reviewed and addressed.`,
        `/learn`
      );
    } catch { /* best-effort */ }
  }

  return NextResponse.json({ success: true });
}

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const isAdminView = searchParams.get('admin') === 'true';

  // Check admin for admin view
  if (isAdminView) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .maybeSingle();

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { data, error } = await supabase
      .from('feedback')
      .select('*, profiles!feedback_user_id_fkey(full_name, email, role)')
      .order('created_at', { ascending: false });

    if (error) {
      // Fallback without join if foreign key doesn't exist
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (fallbackError) return NextResponse.json({ error: fallbackError.message }, { status: 500 });
      return NextResponse.json(fallbackData);
    }

    return NextResponse.json(data);
  }

  // Regular user: own feedback only
  const { data, error } = await supabase
    .from('feedback')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
