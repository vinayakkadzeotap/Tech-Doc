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

export async function GET(request: Request) {
  try {
  const supabase = await createClient();
  const user = await isAdmin(supabase);
  if (!user) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const daysBack = parseInt(searchParams.get('days') || '30', 10);
  const since = new Date(Date.now() - daysBack * 86400000).toISOString();

  // Parallel data fetches
  const [
    { count: totalUsers },
    { data: allProfiles },
    { data: allProgress },
    { data: recentProgress },
    { data: quizzes },
    { data: badges },
    { data: feedback },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('id, full_name, role, team, created_at'),
    supabase.from('progress').select('user_id, track_id, module_id, status, completed_at'),
    supabase.from('progress').select('user_id, track_id, module_id, status, completed_at').gte('completed_at', since),
    supabase.from('quiz_attempts').select('user_id, percentage, passed, created_at').gte('created_at', since),
    supabase.from('badges').select('user_id, badge_type, awarded_at').gte('awarded_at', since),
    supabase.from('feedback').select('rating, created_at').not('rating', 'eq', 0).gte('created_at', since),
  ]);

  // Adoption rate
  const usersWithProgress = new Set(allProgress?.map((p) => p.user_id)).size;
  const adoptionRate = totalUsers ? Math.round((usersWithProgress / totalUsers) * 100) : 0;

  // Completion by team
  const teamCompletion: Record<string, { total: number; completed: number; members: Set<string> }> = {};
  allProfiles?.forEach((p) => {
    const team = p.team || 'Unassigned';
    if (!teamCompletion[team]) teamCompletion[team] = { total: 0, completed: 0, members: new Set() };
    teamCompletion[team].members.add(p.id);
  });
  allProgress?.forEach((p) => {
    const profile = allProfiles?.find((pr) => pr.id === p.user_id);
    const team = profile?.team || 'Unassigned';
    if (teamCompletion[team]) {
      teamCompletion[team].total++;
      if (p.status === 'completed') teamCompletion[team].completed++;
    }
  });

  const teamBreakdown = Object.entries(teamCompletion).map(([team, data]) => ({
    team,
    memberCount: data.members.size,
    completedModules: data.completed,
    totalModules: data.total,
    completionRate: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
  })).sort((a, b) => b.completionRate - a.completionRate);

  // Completion by role
  const roleCompletion: Record<string, { completed: number; total: number; members: number }> = {};
  allProfiles?.forEach((p) => {
    if (!roleCompletion[p.role]) roleCompletion[p.role] = { completed: 0, total: 0, members: 0 };
    roleCompletion[p.role].members++;
  });
  allProgress?.forEach((p) => {
    const profile = allProfiles?.find((pr) => pr.id === p.user_id);
    if (profile && roleCompletion[profile.role]) {
      roleCompletion[profile.role].total++;
      if (p.status === 'completed') roleCompletion[profile.role].completed++;
    }
  });

  const roleBreakdown = Object.entries(roleCompletion).map(([role, data]) => ({
    role,
    members: data.members,
    completionRate: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
  })).sort((a, b) => b.completionRate - a.completionRate);

  // Trending modules (most completed in period)
  const moduleCounts: Record<string, number> = {};
  recentProgress?.forEach((p) => {
    if (p.status === 'completed') {
      const key = `${p.track_id}/${p.module_id}`;
      moduleCounts[key] = (moduleCounts[key] || 0) + 1;
    }
  });
  const trendingModules = Object.entries(moduleCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([key, count]) => {
      const [trackId, moduleId] = key.split('/');
      const track = TRACKS.find((t) => t.id === trackId);
      const module = track?.modules.find((m) => m.id === moduleId);
      return { trackId, moduleId, trackTitle: track?.title || trackId, moduleTitle: module?.title || moduleId, completions: count };
    });

  // Top performers (most completions in period)
  const userCompletions: Record<string, number> = {};
  recentProgress?.forEach((p) => {
    if (p.status === 'completed') {
      userCompletions[p.user_id] = (userCompletions[p.user_id] || 0) + 1;
    }
  });
  const topPerformers = Object.entries(userCompletions)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([userId, completions]) => {
      const profile = allProfiles?.find((p) => p.id === userId);
      return { userId, name: profile?.full_name || 'Unknown', role: profile?.role || '', team: profile?.team || '', completions };
    });

  // Summary stats
  const avgQuizScore = quizzes?.length
    ? Math.round(quizzes.reduce((sum, q) => sum + q.percentage, 0) / quizzes.length)
    : 0;
  const avgFeedbackRating = feedback?.length
    ? parseFloat((feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1))
    : 0;

  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    period: { days: daysBack, since },
    summary: {
      totalUsers: totalUsers || 0,
      activeUsers: usersWithProgress,
      adoptionRate,
      modulesCompletedInPeriod: recentProgress?.filter((p) => p.status === 'completed').length || 0,
      badgesEarnedInPeriod: badges?.length || 0,
      avgQuizScore,
      avgFeedbackRating,
    },
    teamBreakdown,
    roleBreakdown,
    trendingModules,
    topPerformers,
  });
  } catch (error) {
    console.error('GET /api/admin/executive-report error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
