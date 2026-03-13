export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { TRACKS } from '@/lib/utils/roles';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin, is_manager')
      .eq('id', user.id)
      .maybeSingle();

    if (!profile?.is_admin && !profile?.is_manager) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch direct reports (or all users for admins)
    const query = profile.is_admin
      ? supabase.from('profiles').select('id, full_name, email, role, team, created_at')
      : supabase.from('profiles').select('id, full_name, email, role, team, created_at').eq('manager_id', user.id);

    const { data: reports, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    if (!reports || reports.length === 0) {
      return NextResponse.json({ summary: { total: 0, avgProgress: 0, topTrack: '' }, members: [] });
    }

    const reportIds = reports.map((r) => r.id);

    // Fetch all progress for reports
    const { data: progress } = await supabase
      .from('progress')
      .select('user_id, track_id, module_id, status')
      .in('user_id', reportIds);

    // Fetch badges for reports
    const { data: badges } = await supabase
      .from('badges')
      .select('user_id, badge_id')
      .in('user_id', reportIds);

    // Build per-member stats
    const members = reports.map((r) => {
      const userProgress = (progress || []).filter((p) => p.user_id === r.id);
      const completed = userProgress.filter((p) => p.status === 'completed');
      const userBadges = (badges || []).filter((b) => b.user_id === r.id);

      // Track-level progress
      const trackProgress = TRACKS.map((track) => {
        const trackCompleted = completed.filter((p) => p.track_id === track.id).length;
        return {
          trackId: track.id,
          trackTitle: track.title,
          color: track.color,
          completed: trackCompleted,
          total: track.modules.length,
          pct: Math.round((trackCompleted / track.modules.length) * 100),
        };
      }).filter((t) => t.completed > 0);

      return {
        id: r.id,
        name: r.full_name || 'Anonymous',
        email: r.email,
        role: r.role,
        team: r.team,
        modulesCompleted: completed.length,
        badgesEarned: userBadges.length,
        trackProgress,
      };
    });

    // Summary stats
    const totalCompleted = members.reduce((sum, m) => sum + m.modulesCompleted, 0);
    const avgProgress = members.length > 0 ? Math.round(totalCompleted / members.length) : 0;

    // Top track
    const trackCounts = new Map<string, number>();
    (progress || []).filter((p) => p.status === 'completed').forEach((p) => {
      trackCounts.set(p.track_id, (trackCounts.get(p.track_id) || 0) + 1);
    });
    let topTrack = '';
    let topCount = 0;
    trackCounts.forEach((count, trackId) => {
      if (count > topCount) {
        topCount = count;
        topTrack = TRACKS.find((t) => t.id === trackId)?.title || trackId;
      }
    });

    return NextResponse.json({
      summary: { total: members.length, avgProgress, topTrack },
      members: members.sort((a, b) => b.modulesCompleted - a.modulesCompleted),
    });
  } catch (error) {
    console.error('GET /api/team error:', error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
