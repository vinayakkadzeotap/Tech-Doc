import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getTracksForRole, TRACKS, type UserRole } from '@/lib/utils/roles';
import Card from '@/components/ui/Card';
import ProgressBar from '@/components/ui/ProgressBar';
import Badge from '@/components/ui/Badge';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const role = (profile?.role || 'engineering') as UserRole;
  const fullName = profile?.full_name || user.email || 'Learner';

  // Get progress
  const { data: progressData } = await supabase
    .from('progress')
    .select('*')
    .eq('user_id', user.id);

  const { data: badgeData } = await supabase
    .from('badges')
    .select('*')
    .eq('user_id', user.id);

  const { data: quizData } = await supabase
    .from('quiz_attempts')
    .select('*')
    .eq('user_id', user.id)
    .eq('passed', true);

  const completedModules = progressData?.filter((p) => p.status === 'completed').length || 0;
  const earnedBadges = badgeData?.length || 0;
  const passedQuizzes = new Set(quizData?.map((q) => q.quiz_id)).size;

  // Get relevant tracks
  const tracks = getTracksForRole(role);
  const totalModules = tracks.reduce((sum, t) => sum + t.totalModules, 0);
  const overallProgress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

  // Greeting based on time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold">
          {greeting}, <span className="text-gradient">{fullName.split(' ')[0]}</span>
        </h1>
        <p className="mt-1 text-text-secondary text-sm">
          Continue your learning journey. You&apos;re doing great!
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Overall Progress', value: `${overallProgress}%`, color: '#3b82f6', icon: '📊' },
          { label: 'Modules Done', value: String(completedModules), color: '#10b981', icon: '✅' },
          { label: 'Quizzes Passed', value: String(passedQuizzes), color: '#a855f7', icon: '📝' },
          { label: 'Badges Earned', value: String(earnedBadges), color: '#f59e0b', icon: '🏆' },
        ].map((stat) => (
          <Card key={stat.label}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{stat.icon}</span>
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

      {/* Your tracks */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Your Learning Tracks</h2>
          <Link
            href="/learn"
            className="text-sm text-brand-blue hover:underline font-medium"
          >
            View all tracks
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tracks.map((track) => {
            const trackProgress = progressData?.filter(
              (p) => p.track_id === track.id && p.status === 'completed'
            ).length || 0;
            const pct = Math.round((trackProgress / track.totalModules) * 100);

            return (
              <Link key={track.id} href={`/learn?track=${track.id}`}>
                <Card hover className="h-full">
                  <div className="flex items-start gap-3 mb-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ background: `${track.color}15` }}
                    >
                      {track.icon}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-sm">{track.title}</h3>
                      <p className="text-xs text-text-muted mt-0.5 line-clamp-2">{track.subtitle}</p>
                    </div>
                  </div>

                  <ProgressBar value={pct} color={track.color} showLabel size="sm" />

                  <div className="flex items-center gap-3 mt-3 text-xs text-text-muted">
                    <span>{track.totalModules} modules</span>
                    <span>~{track.estimatedHours}h</span>
                    {track.mandatory && (
                      <Badge color="#ef4444">Required</Badge>
                    )}
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: '/explore', icon: '🗺️', label: 'Architecture Map', desc: 'Interactive CDP graph' },
            { href: '/assess', icon: '📝', label: 'Take a Quiz', desc: 'Test your knowledge' },
            { href: '/achievements', icon: '🏆', label: 'Achievements', desc: `${earnedBadges} badges earned` },
            { href: '/glossary', icon: '📖', label: 'Glossary', desc: 'Key terms & concepts' },
          ].map((action) => (
            <Link key={action.href} href={action.href}>
              <Card hover className="text-center">
                <span className="text-3xl block mb-2">{action.icon}</span>
                <div className="text-sm font-semibold">{action.label}</div>
                <div className="text-[11px] text-text-muted mt-0.5">{action.desc}</div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
