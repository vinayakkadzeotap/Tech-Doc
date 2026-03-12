import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import ProgressBar from '@/components/ui/ProgressBar';
import Icon from '@/components/ui/Icon';
import { TRACKS } from '@/lib/utils/roles';
import AnalyticsCharts from '@/components/admin/AnalyticsCharts';

// Sample data for demo when real user count is low
const SAMPLE_ROLE_BREAKDOWN: Record<string, number> = {
  engineering: 18,
  sales: 9,
  cs: 8,
  product: 6,
  marketing: 4,
  leadership: 3,
  hr: 2,
};

const SAMPLE_TRACK_COMPLETION = TRACKS.map((t) => ({
  id: t.id,
  title: t.title,
  color: t.color,
  enrolled: Math.floor(Math.random() * 30) + 15,
  completed: Math.floor(Math.random() * 15) + 5,
}));

const SAMPLE_RECENT_USERS = [
  { id: '1', full_name: 'Priya Sharma', email: 'priya.s@zeotap.com', role: 'engineering', team: 'Platform', created_at: '2026-03-12T10:30:00Z' },
  { id: '2', full_name: 'Alex Chen', email: 'alex.c@zeotap.com', role: 'engineering', team: 'Data', created_at: '2026-03-11T14:20:00Z' },
  { id: '3', full_name: 'Sarah Mitchell', email: 'sarah.m@zeotap.com', role: 'cs', team: 'Enterprise CS', created_at: '2026-03-10T09:15:00Z' },
  { id: '4', full_name: 'James Okoro', email: 'james.o@zeotap.com', role: 'product', team: 'Audiences', created_at: '2026-03-09T16:45:00Z' },
  { id: '5', full_name: 'Maria Garcia', email: 'maria.g@zeotap.com', role: 'sales', team: 'EMEA Sales', created_at: '2026-03-08T11:00:00Z' },
  { id: '6', full_name: 'David Kim', email: 'david.k@zeotap.com', role: 'engineering', team: 'Identity', created_at: '2026-03-07T13:30:00Z' },
  { id: '7', full_name: 'Emma Wilson', email: 'emma.w@zeotap.com', role: 'marketing', team: 'Growth', created_at: '2026-03-06T08:20:00Z' },
  { id: '8', full_name: 'Raj Patel', email: 'raj.p@zeotap.com', role: 'engineering', team: 'Activation', created_at: '2026-03-05T15:10:00Z' },
  { id: '9', full_name: 'Chloe Dubois', email: 'chloe.d@zeotap.com', role: 'cs', team: 'Mid-Market CS', created_at: '2026-03-04T10:00:00Z' },
  { id: '10', full_name: 'Marcus Johnson', email: 'marcus.j@zeotap.com', role: 'leadership', team: 'Executive', created_at: '2026-03-03T09:00:00Z' },
];

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
    .select('user_id, status, track_id');

  const { data: allQuizzes } = await supabase
    .from('quiz_attempts')
    .select('user_id, percentage, passed');

  const { data: allBadges } = await supabase
    .from('badges')
    .select('user_id');

  const { data: allProfiles } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, team, created_at');

  const { data: allFeedback } = await supabase
    .from('feedback')
    .select('rating')
    .not('rating', 'eq', 0);

  const isDemo = (totalUsers || 0) < 5;

  const completedModules = allProgress?.filter((p) => p.status === 'completed').length || 0;
  const activeUsers = new Set(allProgress?.map((p) => p.user_id)).size;
  const avgQuizScore = allQuizzes?.length
    ? Math.round(allQuizzes.reduce((sum, q) => sum + q.percentage, 0) / allQuizzes.length)
    : 0;
  const totalBadges = allBadges?.length || 0;
  const quizPassRate = allQuizzes?.length
    ? Math.round((allQuizzes.filter((q) => q.passed).length / allQuizzes.length) * 100)
    : 0;
  const avgFeedbackRating = allFeedback?.length
    ? (allFeedback.reduce((sum, f) => sum + f.rating, 0) / allFeedback.length).toFixed(1)
    : '0';

  // Role breakdown
  const roleBreakdown: Record<string, number> = isDemo
    ? SAMPLE_ROLE_BREAKDOWN
    : {};
  if (!isDemo) {
    allProfiles?.forEach((p) => {
      roleBreakdown[p.role] = (roleBreakdown[p.role] || 0) + 1;
    });
  }

  // Track completion stats
  const trackCompletionMap: Record<string, { enrolled: number; completed: number }> = {};
  if (!isDemo && allProgress) {
    for (const p of allProgress) {
      if (!trackCompletionMap[p.track_id]) {
        trackCompletionMap[p.track_id] = { enrolled: 0, completed: 0 };
      }
      trackCompletionMap[p.track_id].enrolled++;
      if (p.status === 'completed') trackCompletionMap[p.track_id].completed++;
    }
  }

  const trackStats = isDemo
    ? SAMPLE_TRACK_COMPLETION
    : TRACKS.map((t) => ({
        id: t.id,
        title: t.title,
        color: t.color,
        enrolled: trackCompletionMap[t.id]?.enrolled || 0,
        completed: trackCompletionMap[t.id]?.completed || 0,
      }));

  const displayUsers = isDemo ? SAMPLE_RECENT_USERS : (allProfiles || []);
  const displayTotalUsers = isDemo ? 50 : (totalUsers || 0);
  const displayActiveUsers = isDemo ? 38 : activeUsers;
  const displayCompletedModules = isDemo ? 342 : completedModules;
  const displayAvgScore = isDemo ? 78 : avgQuizScore;
  const displayBadges = isDemo ? 124 : totalBadges;
  const displayPassRate = isDemo ? 82 : quizPassRate;
  const displayFeedbackRating = isDemo ? '4.3' : avgFeedbackRating;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Icon name="⚡" size={22} color="#6366f1" />
          <h1 className="text-2xl font-extrabold">Admin Dashboard</h1>
        </div>
        <p className="text-text-secondary text-sm">Organization-wide learning analytics</p>
        {isDemo && (
          <p className="text-[10px] text-brand-blue mt-1 font-medium">
            Showing sample data for demonstration ({displayTotalUsers} simulated users)
          </p>
        )}
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
          { label: 'Total Users', value: displayTotalUsers, icon: '👥', color: '#3b82f6' },
          { label: 'Active Learners', value: displayActiveUsers, icon: '📚', color: '#10b981' },
          { label: 'Modules Completed', value: displayCompletedModules, icon: '✅', color: '#a855f7' },
          { label: 'Avg Quiz Score', value: `${displayAvgScore}%`, icon: '📝', color: '#f59e0b' },
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

      {/* Secondary stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Badges Earned', value: displayBadges, icon: '🏅', color: '#f59e0b' },
          { label: 'Quiz Pass Rate', value: `${displayPassRate}%`, icon: '🎯', color: '#10b981' },
          { label: 'Avg Feedback', value: `${displayFeedbackRating}/5`, icon: '⭐', color: '#a855f7' },
        ].map((stat) => (
          <Card key={stat.label}>
            <div className="flex items-center gap-3">
              <Icon name={stat.icon} contained color={stat.color} containerSize="sm" />
              <div>
                <div className="text-xl font-extrabold" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="text-xs text-text-muted">{stat.label}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Engagement Analytics */}
      <div>
        <h2 className="font-bold mb-4">Engagement Analytics</h2>
        <AnalyticsCharts />
      </div>

      {/* Track completion rates */}
      <Card>
        <h2 className="font-bold mb-4">Track Completion Rates</h2>
        <div className="space-y-3">
          {trackStats.map((track) => {
            const pct = track.enrolled > 0 ? Math.round((track.completed / track.enrolled) * 100) : 0;
            return (
              <div key={track.id} className="flex items-center gap-4">
                <span className="text-sm font-medium w-48 truncate">{track.title}</span>
                <div className="flex-1">
                  <ProgressBar value={pct} color={track.color} size="sm" />
                </div>
                <span className="text-xs text-text-muted w-24 text-right">
                  {track.completed}/{track.enrolled} ({pct}%)
                </span>
              </div>
            );
          })}
        </div>
      </Card>

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
                    value={(count / displayTotalUsers) * 100}
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

      {/* Most active this week */}
      {isDemo && (
        <Card>
          <h2 className="font-bold mb-4">Most Active This Week</h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {SAMPLE_RECENT_USERS.slice(0, 5).map((u, i) => (
              <div key={u.id} className="flex flex-col items-center gap-1 p-3 rounded-xl bg-bg-elevated/50">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{
                    backgroundColor: ['#3b82f620', '#a855f720', '#10b98120', '#f59e0b20', '#ec489920'][i],
                    color: ['#3b82f6', '#a855f7', '#10b981', '#f59e0b', '#ec4899'][i],
                  }}
                >
                  {u.full_name.split(' ').map((n) => n[0]).join('')}
                </div>
                <span className="text-xs font-semibold text-text-primary text-center truncate w-full">
                  {u.full_name.split(' ')[0]}
                </span>
                <span className="text-[10px] text-text-muted capitalize">{u.role}</span>
                <span className="text-[10px] font-bold text-brand-blue">
                  {[285, 240, 215, 190, 170][i]} XP
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

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
              {displayUsers
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .slice(0, 20)
                .map((p) => (
                  <tr key={p.id} className="border-b border-border-subtle hover:bg-bg-hover">
                    <td className="py-3 px-2 font-medium">{p.full_name || '\u2014'}</td>
                    <td className="py-3 px-2 text-text-muted">{p.email}</td>
                    <td className="py-3 px-2 capitalize">{p.role}</td>
                    <td className="py-3 px-2 text-text-muted">{p.team || '\u2014'}</td>
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
