import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendSlackNotification } from '@/lib/utils/slack';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .maybeSingle();

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { data } = await supabase
      .from('platform_settings')
      .select('key, value');

    const settings: Record<string, unknown> = {};
    (data || []).forEach((row) => {
      settings[row.key] = row.value;
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error('GET /api/admin/settings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .maybeSingle();

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { key, value, testSlack } = await request.json();

    // Test Slack webhook
    if (testSlack && typeof value === 'object' && value.webhook_url) {
      const sent = await sendSlackNotification(
        value.webhook_url,
        'ZeoAI Learning Test',
        'This is a test notification from ZeoAI Learning Platform.',
      );
      return NextResponse.json({ success: sent, message: sent ? 'Test message sent!' : 'Failed to send. Check webhook URL.' });
    }

    if (!key) {
      return NextResponse.json({ error: 'key required' }, { status: 400 });
    }

    const { error } = await supabase.from('platform_settings').upsert({
      key,
      value: value || {},
      updated_at: new Date().toISOString(),
    }, { onConflict: 'key' });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('POST /api/admin/settings error:', error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
