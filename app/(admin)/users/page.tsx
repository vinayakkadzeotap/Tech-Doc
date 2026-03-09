import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import { TRACKS } from '@/lib/utils/roles';

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: allProfiles } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  const { data: allProgress } = await supabase
    .from('progress')
    .select('user_id, track_id, module_id, status');

  const { data: allBadges } = await supabase
    .from('badges')
    .select('user_id, badge_id');

  const { data: allQuizzes } = await supabase
    .from('quiz_attempts')
    .select('user_id, passed');

  // Build per-user stats
  const totalModules = TRACKS.reduce((sum, t) => sum + t.totalModules, 0);

  const userStats = (allProfiles || []).map((profile) => {
    const completed = (allProgress || []).filter(
      (p) => p.user_id === profile.id && p.status === 'completed'
    ).length;
    const badges = (allBadges || []).filter((b) => b.user_id === profile.id).length;
    const quizzesPassed = new Set(
      (allQuizzes || [])
        .filter((q) => q.user_id === profile.id && q.passed)
        .map((q) => q.user_id)
    ).size;
    const pct = totalModules > 0 ? Math.round((completed / totalModules) * 100) : 0;

    return { ...profile, completed, badges, quizzesPassed, pct };
  });

  const roleColors: Record<string, string> = {
    engineering: '#3b82f6',
    sales: '#f59e0b',
    cs: '#10b981',
    product: '#a855f7',
    marketing: '#ec4899',
    leadership: '#6366f1',
    hr: '#14b8a6',
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">User Management</h1>
        <p className="text-text-secondary text-sm mt-1">
          {allProfiles?.length || 0} registered users
        </p>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 text-text-muted font-medium">User</th>
                <th className="text-left py-3 px-2 text-text-muted font-medium">Role</th>
                <th className="text-left py-3 px-2 text-text-muted font-medium">Team</th>
                <th className="text-left py-3 px-2 text-text-muted font-medium">Progress</th>
                <th className="text-left py-3 px-2 text-text-muted font-medium">Modules</th>
                <th className="text-left py-3 px-2 text-text-muted font-medium">Badges</th>
                <th className="text-left py-3 px-2 text-text-muted font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {userStats.map((u) => (
                <tr key={u.id} className="border-b border-border-subtle hover:bg-bg-hover">
                  <td className="py-3 px-2">
                    <div className="font-medium">
                      {u.full_name || '—'}
                      {u.is_admin && <span className="ml-1 text-[10px] text-brand-purple">(admin)</span>}
                      {u.is_manager && <span className="ml-1 text-[10px] text-brand-blue">(mgr)</span>}
                    </div>
                    <div className="text-[11px] text-text-muted">{u.email}</div>
                  </td>
                  <td className="py-3 px-2">
                    <Badge color={roleColors[u.role] || '#94a3b8'}>
                      {u.role}
                    </Badge>
                  </td>
                  <td className="py-3 px-2 text-text-muted">{u.team || '—'}</td>
                  <td className="py-3 px-2 min-w-[120px]">
                    <ProgressBar value={u.pct} color="#3b82f6" size="sm" showLabel />
                  </td>
                  <td className="py-3 px-2 text-center font-bold">{u.completed}</td>
                  <td className="py-3 px-2 text-center font-bold">{u.badges}</td>
                  <td className="py-3 px-2 text-text-muted">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
