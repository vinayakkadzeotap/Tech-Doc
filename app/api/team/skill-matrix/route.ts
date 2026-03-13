import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { TRACKS } from '@/lib/utils/roles';

export async function GET(request: Request) {
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
      return NextResponse.json({ error: 'Manager or admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const trackId = searchParams.get('track_id') || TRACKS[0]?.id || 'business-essentials';

    // Get team members
    let membersQuery = supabase.from('profiles').select('id, full_name, role, team');
    if (!profile.is_admin) {
      membersQuery = membersQuery.eq('manager_id', user.id);
    }
    const { data: members } = await membersQuery;

    if (!members || members.length === 0) {
      return NextResponse.json({ track: null, members: [] });
    }

    // Get track info
    const track = TRACKS.find((t) => t.id === trackId);
    if (!track) {
      return NextResponse.json({ error: 'Track not found' }, { status: 404 });
    }

    // Get progress for all team members for this track
    const memberIds = members.map((m) => m.id);
    const { data: progressData } = await supabase
      .from('progress')
      .select('user_id, module_id, status')
      .eq('track_id', trackId)
      .in('user_id', memberIds);

    // Build matrix
    const progressMap = new Map<string, Map<string, string>>();
    (progressData || []).forEach((p) => {
      if (!progressMap.has(p.user_id)) progressMap.set(p.user_id, new Map());
      progressMap.get(p.user_id)!.set(p.module_id, p.status);
    });

    const matrixMembers = members.map((m) => {
      const userProgress = progressMap.get(m.id) || new Map<string, string>();
      const modules = track.modules.map((mod) => ({
        moduleId: mod.id,
        moduleTitle: mod.title,
        status: userProgress.get(mod.id) || 'not_started',
      }));
      const completed = modules.filter((mod) => mod.status === 'completed').length;
      return {
        id: m.id,
        name: m.full_name || 'Unknown',
        role: m.role || '',
        team: m.team || '',
        modules,
        completedCount: completed,
        completionPct: Math.round((completed / track.modules.length) * 100),
      };
    }).sort((a, b) => b.completedCount - a.completedCount);

    return NextResponse.json({
      track: { id: track.id, title: track.title, color: track.color, moduleCount: track.modules.length },
      members: matrixMembers,
    });
  } catch (error) {
    console.error('GET /api/team/skill-matrix error:', error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
