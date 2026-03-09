import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import ProgressBar from '@/components/ui/ProgressBar';
import Icon from '@/components/ui/Icon';

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Fetch org-wide stats
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  const { data: allProgress } = await supabase
    .from('progress')
    .select('user_id, status');

  const { data: allQuizzes } = await supabase
    .from('quiz_attempts')
    .select('user_id, percentage, passed');

  const { data: allBadges } = await supabase
    .from('badges')
    .select('user_id');

  const { data: allProfiles } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, team, created_at');

  const completedModules = allProgress?.filter((p) => p.status === 'completed').length || 0;
  const activeUsers = new Set(allProgress?.map((p) => p.user_id)).size;
  const avgQuizScore = allQuizzes?.length
    ? Math.round(allQuizzes.reduce((sum, q) => sum + q.percentage, 0) / allQuizzes.length)
    : 0;
  const totalBadges = allBadges?.length || 0;

  // Role breakdown
  const roleBreakdown: Record<string, number> = {};
  allProfiles?.forEach((p) => {
    roleBreakdown[p.role] = (roleBreakdown[p.role] || 0) + 1;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Icon name="⚡" size={22} color="#6366f1" />
          <h1 className="text-2xl font-extrabold">Admin Dashboard</h1>
        </div>
        <p className="text-text-secondary text-sm">Organization-wide learning analytics</p>
        <div className="flex gap-3 mt-3">
          <Link
            href="/admin/users"
            className="text-sm text-brand-blue hover:underline font-medium"
          >
            Manage Users
          </Link>
          <Link
            href="/admin/assignments"
            className="text-sm text-brand-purple hover:underline font-medium"
          >
            Manage Assignments
          </Link>
        </div>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: totalUsers || 0, icon: '👥', color: '#3b82f6' },
          { label: 'Active Learners', value: activeUsers, icon: '📚', color: '#10b981' },
          { label: 'Modules Completed', value: completedModules, icon: '✅', color: '#a855f7' },
          { label: 'Avg Quiz Score', value: `${avgQuizScore}%`, icon: '📝', color: '#f59e0b' },
        ].map((stat) => (
          <Card key={stat.label}>
            <div className="flex items-center gap-3">
              <Icon name={stat.icon} contained color={stat.color} containerSize="sm" />
              <div>
                <div className="text-2xl font-extrabold" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="text-xs text-text-muted">{stat.label}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Role breakdown */}
      <Card>
        <h2 className="font-bold mb-4">Users by Role</h2>
        <div className="space-y-3">
          {Object.entries(roleBreakdown)
            .sort((a, b) => b[1] - a[1])
            .map(([role, count]) => (
              <div key={role} className="flex items-center gap-4">
                <span className="text-sm font-medium w-32 capitalize">{role}</span>
                <div className="flex-1">
                  <ProgressBar
                    value={(count / (totalUsers || 1)) * 100}
                    color="#3b82f6"
                    size="sm"
                  />
                </div>
                <span className="text-sm font-bold text-text-secondary w-8 text-right">
                  {count}
                </span>
              </div>
            ))}
        </div>
      </Card>

      {/* Recent users */}
      <Card>
        <h2 className="font-bold mb-4">Recent Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 text-text-muted font-medium">Name</th>
                <th className="text-left py-3 px-2 text-text-muted font-medium">Email</th>
                <th className="text-left py-3 px-2 text-text-muted font-medium">Role</th>
                <th className="text-left py-3 px-2 text-text-muted font-medium">Team</th>
                <th className="text-left py-3 px-2 text-text-muted font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {allProfiles
                ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .slice(0, 20)
                .map((p) => (
                  <tr key={p.id} className="border-b border-border-subtle hover:bg-bg-hover">
                    <td className="py-3 px-2 font-medium">{p.full_name || '—'}</td>
                    <td className="py-3 px-2 text-text-muted">{p.email}</td>
                    <td className="py-3 px-2 capitalize">{p.role}</td>
                    <td className="py-3 px-2 text-text-muted">{p.team || '—'}</td>
                    <td className="py-3 px-2 text-text-muted">
                      {new Date(p.created_at).toLocaleDateString()}
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
