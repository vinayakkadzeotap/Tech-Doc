export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { awardBadgesAfterCompletion } from '@/lib/utils/award-badges';
import { trackServerEvent, EVENTS } from '@/lib/utils/analytics';
import { createNotification } from '@/lib/utils/notify';
import { TRACKS } from '@/lib/utils/roles';
import { progressSchema, validateBody } from '@/lib/utils/validation';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const validation = validateBody(progressSchema, body);
  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }
  const { track_id, module_id, status } = validation.data;

  // Use select + insert/update to avoid 409 when unique constraint is missing
  const { data: existing } = await supabase
    .from('progress')
    .select('id')
    .eq('user_id', user.id)
    .eq('track_id', track_id)
    .eq('module_id', module_id)
    .maybeSingle();

  const now = new Date().toISOString();
  const { data, error } = existing
    ? await supabase.from('progress').update({
        status,
        completed_at: status === 'completed' ? now : null,
      }).eq('id', existing.id).select()
    : await supabase.from('progress').insert({
        user_id: user.id,
        track_id,
        module_id,
        status,
        completed_at: status === 'completed' ? now : null,
      }).select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Track module completion
  if (status === 'completed') {
    trackServerEvent(supabase, user.id, EVENTS.MODULE_COMPLETE, {
      track_id,
      module_id,
    });
  }

  // Check track completion percentage for milestone notifications
  if (status === 'completed') {
    const track = TRACKS.find((t) => t.id === track_id);
    if (track) {
      const { data: trackProgress } = await supabase
        .from('progress')
        .select('module_id')
        .eq('user_id', user.id)
        .eq('track_id', track_id)
        .eq('status', 'completed');

      const completedCount = trackProgress?.length || 0;
      const totalModules = track.modules.length;
      const pct = Math.round((completedCount / totalModules) * 100);

      if (pct === 100) {
        createNotification(supabase, user.id, 'milestone', 'Track Complete!', `You completed the "${track.title}" track!`, `/learn/${track_id}`);
      } else if (pct >= 80 && pct < 100) {
        createNotification(supabase, user.id, 'milestone', 'Almost There!', `You're ${pct}% through "${track.title}" — just ${totalModules - completedCount} modules left!`, `/learn/${track_id}`);
      }
    }
  }

  // Award badges after marking complete
  let newBadges: string[] = [];
  if (status === 'completed') {
    newBadges = await awardBadgesAfterCompletion(supabase, user.id, track_id);
  }

  return NextResponse.json({ success: true, data, newBadges });
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('progress')
    .select('*')
    .eq('user_id', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
