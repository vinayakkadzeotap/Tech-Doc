export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { TRACKS } from '@/lib/utils/roles';

async function isAdmin(supabase: ReturnType<typeof createClient> extends Promise<infer T> ? T : never) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle();
  if (!profile?.is_admin) return null;
  return user;
}

export async function GET() {
  try {
    const supabase = await createClient();
    const user = await isAdmin(supabase);
    if (!user) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { data: targets, error } = await supabase
      .from('adoption_targets')
      .select('*')
      .order('deadline', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Compute current progress for each target
    const enriched = await Promise.all(
      (targets || []).map(async (target) => {
        const track = TRACKS.find((t) => t.id === target.track_id);
        const totalModules = track?.modules.length || 0;

        // Get profiles matching the target criteria
        let profileQuery = supabase.from('profiles').select('id');
        if (target.team) profileQuery = profileQuery.eq('team', target.team);
        if (target.role) profileQuery = profileQuery.eq('role', target.role);
        const { data: matchingProfiles } = await profileQuery;

        const userIds = matchingProfiles?.map((p) => p.id) || [];
        const totalUsers = userIds.length;

        if (totalUsers === 0 || totalModules === 0) {
          return { ...target, trackTitle: track?.title || target.track_id, currentPct: 0, totalUsers, usersCompleted: 0 };
        }

        // Count users who completed ALL modules in the track
        let usersCompleted = 0;
        for (const userId of userIds) {
          const { count } = await supabase
            .from('progress')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('track_id', target.track_id)
            .eq('status', 'completed');
          if ((count || 0) >= totalModules) usersCompleted++;
        }

        const currentPct = Math.round((usersCompleted / totalUsers) * 100);

        return {
          ...target,
          trackTitle: track?.title || target.track_id,
          currentPct,
          totalUsers,
          usersCompleted,
        };
      })
    );

    return NextResponse.json(enriched);
  } catch (error) {
    console.error('GET /api/admin/targets error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const user = await isAdmin(supabase);
    if (!user) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { team, role, track_id, target_pct, deadline } = await request.json();
    if (!track_id || !target_pct || !deadline) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabase.from('adoption_targets').insert({
      team: team || null,
      role: role || null,
      track_id,
      target_pct,
      deadline,
      created_by: user.id,
    }).select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('POST /api/admin/targets error:', error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const user = await isAdmin(supabase);
    if (!user) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Missing target id' }, { status: 400 });
    }

    const { error } = await supabase.from('adoption_targets').delete().eq('id', id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/admin/targets error:', error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
