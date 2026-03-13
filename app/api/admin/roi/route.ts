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
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile?.is_admin) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }

  // Fetch all data in parallel
  const [profilesRes, progressRes, certsRes, quizRes] = await Promise.all([
    supabase.from('profiles').select('id, full_name, role, team, created_at'),
    supabase.from('progress').select('user_id, track_id, module_id, status, completed_at'),
    supabase.from('certifications').select('user_id, cert_id, level'),
    supabase.from('quiz_attempts').select('user_id, quiz_id, passed, percentage'),
  ]);

  const profiles = profilesRes.data || [];
  const progress = progressRes.data || [];
  const certs = certsRes.data || [];
  const quizzes = quizRes.data || [];

  const totalUsers = profiles.length;
  const usersWithProgress = new Set(progress.filter((p) => p.status === 'completed').map((p) => p.user_id)).size;

  // Adoption rate
  const adoptionRate = totalUsers > 0 ? Math.round((usersWithProgress / totalUsers) * 100) : 0;

  // Certified users
  const certifiedUsers = new Set(certs.map((c) => c.user_id)).size;
  const certificationRate = totalUsers > 0 ? Math.round((certifiedUsers / totalUsers) * 100) : 0;

  // Mandatory tracks
  const mandatoryTracks = TRACKS.filter((t) => t.mandatory);
  const mandatoryModuleIds = new Set<string>();
  mandatoryTracks.forEach((t) => t.modules.forEach((m) => mandatoryModuleIds.add(`${t.id}:${m.id}`)));
  const mandatoryModuleCount = mandatoryModuleIds.size;

  // Time-to-competency by role: days from profile creation to all mandatory modules complete
  const roleCompetency: Record<string, number[]> = {};
  profiles.forEach((p) => {
    const userMandatoryCompleted = progress.filter(
      (pr) => pr.user_id === p.id && pr.status === 'completed' && mandatoryModuleIds.has(`${pr.track_id}:${pr.module_id}`)
    );
    if (userMandatoryCompleted.length >= mandatoryModuleCount) {
      const lastCompletion = userMandatoryCompleted
        .map((pr) => new Date(pr.completed_at).getTime())
        .sort((a, b) => b - a)[0];
      const created = new Date(p.created_at).getTime();
      const days = Math.round((lastCompletion - created) / (1000 * 60 * 60 * 24));
      const role = p.role || 'unknown';
      if (!roleCompetency[role]) roleCompetency[role] = [];
      roleCompetency[role].push(days);
    }
  });

  const timeToCompetency = Object.entries(roleCompetency).map(([role, days]) => {
    const sorted = [...days].sort((a, b) => a - b);
    const avg = Math.round(sorted.reduce((s, d) => s + d, 0) / sorted.length);
    const median = sorted[Math.floor(sorted.length / 2)];
    return { role, avgDays: avg, medianDays: median, fastest: sorted[0], slowest: sorted[sorted.length - 1], count: sorted.length };
  });

  const avgTimeToCompetency = timeToCompetency.length > 0
    ? Math.round(timeToCompetency.reduce((s, t) => s + t.avgDays, 0) / timeToCompetency.length)
    : 0;

  // Completion rates by role
  const completionByRole: Record<string, { total: number; completed: number }> = {};
  profiles.forEach((p) => {
    const role = p.role || 'unknown';
    if (!completionByRole[role]) completionByRole[role] = { total: 0, completed: 0 };
    completionByRole[role].total++;
    const userCompleted = progress.filter((pr) => pr.user_id === p.id && pr.status === 'completed').length;
    if (userCompleted > 0) completionByRole[role].completed++;
  });

  const roleCompletion = Object.entries(completionByRole).map(([role, data]) => ({
    role,
    total: data.total,
    active: data.completed,
    rate: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
  }));

  // Completion rates by team
  const completionByTeam: Record<string, { total: number; completed: number; mandatoryComplete: number }> = {};
  profiles.forEach((p) => {
    const team = p.team || 'Unassigned';
    if (!completionByTeam[team]) completionByTeam[team] = { total: 0, completed: 0, mandatoryComplete: 0 };
    completionByTeam[team].total++;
    const userCompleted = progress.filter((pr) => pr.user_id === p.id && pr.status === 'completed').length;
    if (userCompleted > 0) completionByTeam[team].completed++;
    // Check mandatory completion
    const userMandatory = progress.filter(
      (pr) => pr.user_id === p.id && pr.status === 'completed' && mandatoryModuleIds.has(`${pr.track_id}:${pr.module_id}`)
    ).length;
    if (userMandatory >= mandatoryModuleCount) completionByTeam[team].mandatoryComplete++;
  });

  const teamCompletion = Object.entries(completionByTeam).map(([team, data]) => ({
    team,
    members: data.total,
    active: data.completed,
    activeRate: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
    mandatoryComplete: data.mandatoryComplete,
    mandatoryRate: data.total > 0 ? Math.round((data.mandatoryComplete / data.total) * 100) : 0,
  }));

  // Certified vs non-certified comparison
  const certifiedUserIds = new Set(certs.map((c) => c.user_id));
  const certifiedModules: number[] = [];
  const nonCertifiedModules: number[] = [];
  profiles.forEach((p) => {
    const count = progress.filter((pr) => pr.user_id === p.id && pr.status === 'completed').length;
    if (certifiedUserIds.has(p.id)) {
      certifiedModules.push(count);
    } else {
      nonCertifiedModules.push(count);
    }
  });

  const avgModulesCertified = certifiedModules.length > 0
    ? Math.round(certifiedModules.reduce((s, c) => s + c, 0) / certifiedModules.length)
    : 0;
  const avgModulesNonCertified = nonCertifiedModules.length > 0
    ? Math.round(nonCertifiedModules.reduce((s, c) => s + c, 0) / nonCertifiedModules.length)
    : 0;

  // Average quiz score
  const passedQuizzes = quizzes.filter((q) => q.passed);
  const avgQuizScore = passedQuizzes.length > 0
    ? Math.round(passedQuizzes.reduce((s, q) => s + q.percentage, 0) / passedQuizzes.length)
    : 0;

  // Overall avg completion %
  const totalModulesInPlatform = TRACKS.reduce((s, t) => s + t.modules.length, 0);
  const avgCompletionPct = totalUsers > 0
    ? Math.round(progress.filter((p) => p.status === 'completed').length / (totalUsers * totalModulesInPlatform) * 100)
    : 0;

  // Median time to first module completion
  const firstCompletionDays: number[] = [];
  profiles.forEach((p) => {
    const userCompleted = progress
      .filter((pr) => pr.user_id === p.id && pr.status === 'completed' && pr.completed_at)
      .map((pr) => new Date(pr.completed_at).getTime())
      .sort((a, b) => a - b);
    if (userCompleted.length > 0) {
      const created = new Date(p.created_at).getTime();
      const days = Math.max(0, Math.round((userCompleted[0] - created) / (1000 * 60 * 60 * 24)));
      firstCompletionDays.push(days);
    }
  });
  const sortedFirstDays = [...firstCompletionDays].sort((a, b) => a - b);
  const medianTimeToFirst = sortedFirstDays.length > 0
    ? sortedFirstDays[Math.floor(sortedFirstDays.length / 2)]
    : 0;

  return NextResponse.json({
    medianTimeToFirstCompletion: medianTimeToFirst,
    firstCompletionCount: firstCompletionDays.length,
    summary: {
      adoptionRate,
      avgTimeToCompetency,
      certificationRate,
      avgCompletionPct,
      totalUsers,
      activeUsers: usersWithProgress,
      certifiedUsers,
      avgQuizScore,
    },
    roleCompletion,
    teamCompletion,
    timeToCompetency,
    certifiedComparison: {
      certified: { count: certifiedModules.length, avgModules: avgModulesCertified },
      nonCertified: { count: nonCertifiedModules.length, avgModules: avgModulesNonCertified },
    },
  });
  } catch (error) {
    console.error('GET /api/admin/roi error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
