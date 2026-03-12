import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Fetch all progress, quiz attempts, and badges
  const [progressRes, quizRes, badgeRes, profilesRes] = await Promise.all([
    supabase.from('progress').select('user_id, status'),
    supabase.from('quiz_attempts').select('user_id, passed'),
    supabase.from('badges').select('user_id'),
    supabase.from('profiles').select('id, full_name, role, team'),
  ]);

  const profiles = profilesRes.data || [];
  const progress = progressRes.data || [];
  const quizzes = quizRes.data || [];
  const badges = badgeRes.data || [];

  // Build score per user
  const scoreMap = new Map<string, { modules: number; quizzes: number; badges: number }>();

  for (const p of progress) {
    if (p.status !== 'completed') continue;
    const entry = scoreMap.get(p.user_id) || { modules: 0, quizzes: 0, badges: 0 };
    entry.modules++;
    scoreMap.set(p.user_id, entry);
  }

  for (const q of quizzes) {
    if (!q.passed) continue;
    const entry = scoreMap.get(q.user_id) || { modules: 0, quizzes: 0, badges: 0 };
    entry.quizzes++;
    scoreMap.set(q.user_id, entry);
  }

  for (const b of badges) {
    const entry = scoreMap.get(b.user_id) || { modules: 0, quizzes: 0, badges: 0 };
    entry.badges++;
    scoreMap.set(b.user_id, entry);
  }

  // Score formula: modules * 10 + quizzes * 25 + badges * 50
  const leaderboard = profiles
    .map((p) => {
      const stats = scoreMap.get(p.id) || { modules: 0, quizzes: 0, badges: 0 };
      const xp = stats.modules * 10 + stats.quizzes * 25 + stats.badges * 50;
      return {
        id: p.id,
        name: p.full_name || 'Anonymous',
        role: p.role || 'engineering',
        team: p.team || '',
        xp,
        modulesCompleted: stats.modules,
        badges: stats.badges,
        isCurrentUser: p.id === user.id,
      };
    })
    .sort((a, b) => b.xp - a.xp)
    .slice(0, 30);

  const response = NextResponse.json(leaderboard);
  response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
  return response;
}
