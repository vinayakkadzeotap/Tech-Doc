import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { TRACKS } from '@/lib/utils/roles';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const nudges: Array<{ id: string; message: string; cta: string; link: string; color: string }> = [];

  // Fetch user progress
  const { data: progress } = await supabase
    .from('progress')
    .select('track_id, module_id, status')
    .eq('user_id', user.id);

  const completed = (progress || []).filter((p) => p.status === 'completed');
  const completedKeys = new Set(completed.map((p) => `${p.track_id}:${p.module_id}`));

  // Check each track for near-completion
  for (const track of TRACKS) {
    const trackCompleted = track.modules.filter((m) => completedKeys.has(`${track.id}:${m.id}`)).length;
    const pct = Math.round((trackCompleted / track.modules.length) * 100);
    const remaining = track.modules.length - trackCompleted;

    if (pct >= 80 && pct < 100) {
      nudges.push({
        id: `almost-${track.id}`,
        message: `You're ${pct}% through "${track.title}" — just ${remaining} module${remaining > 1 ? 's' : ''} left!`,
        cta: 'Continue Learning',
        link: `/learn/${track.id}`,
        color: '#10b981',
      });
    }
  }

  // Check for inactivity (no completions in last 3 days)
  if (completed.length > 0) {
    const { data: recentCompletion } = await supabase
      .from('progress')
      .select('completed_at')
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .not('completed_at', 'is', null)
      .order('completed_at', { ascending: false })
      .limit(1);

    if (recentCompletion?.[0]) {
      const lastActive = new Date(recentCompletion[0].completed_at);
      const daysSince = Math.floor((Date.now() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
      if (daysSince >= 3) {
        nudges.push({
          id: 'inactive',
          message: `It's been ${daysSince} days since your last module. Keep your streak going!`,
          cta: 'Resume Learning',
          link: '/learn',
          color: '#f59e0b',
        });
      }
    }
  }

  // Check certification proximity
  const { data: certs } = await supabase
    .from('certifications')
    .select('level')
    .eq('user_id', user.id);

  const certLevels = new Set((certs || []).map((c) => c.level));
  const totalCompleted = completed.length;

  if (totalCompleted >= 8 && !certLevels.has('foundation')) {
    nudges.push({
      id: 'cert-foundation',
      message: 'You qualify for the Foundation certification! Claim it now.',
      cta: 'View Certifications',
      link: '/certifications',
      color: '#8b5cf6',
    });
  }

  // New user: no progress yet
  if (completed.length === 0) {
    nudges.push({
      id: 'get-started',
      message: 'Start your CDP learning journey! Pick a track that matches your role.',
      cta: 'Browse Tracks',
      link: '/learn',
      color: '#3b82f6',
    });
  }

  return NextResponse.json(nudges.slice(0, 2)); // Max 2 nudges at a time
}
