import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getTracksForRole, TRACKS, type UserRole } from '@/lib/utils/roles';
import Card from '@/components/ui/Card';
import ProgressBar from '@/components/ui/ProgressBar';
import Badge from '@/components/ui/Badge';
import Icon from '@/components/ui/Icon';
import ProgressDashboard from '@/components/interactive/ProgressDashboard';
import NudgeBanner from '@/components/interactive/NudgeBanner';
import ActivityFeed from '@/components/interactive/ActivityFeed';
import RecommendedNext from '@/components/interactive/RecommendedNext';
import { getRecommendations } from '@/lib/utils/recommendations';
import { ArrowRight, PlayCircle, BookOpen } from 'lucide-react';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

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
    .eq('user_id', user.id);

  const completedModules = progressData?.filter((p) => p.status === 'completed').length || 0;
  const earnedBadges = badgeData?.length || 0;
  const passedQuizzes = new Set(quizData?.filter((q) => q.passed).map((q) => q.quiz_id)).size;

  // Get relevant tracks
  const tracks = getTracksForRole(role);
  const totalModules = tracks.reduce((sum, t) => sum + t.totalModules, 0);
  const overallProgress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

  // Greeting based on time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const stats = [
    { label: 'Overall Progress', value: `${overallProgress}%`, color: '#3b82f6', icon: '📊' },
    { label: 'Modules Done', value: String(completedModules), color: '#10b981', icon: '✅' },
    { label: 'Quizzes Passed', value: String(passedQuizzes), color: '#a855f7', icon: '📝' },
    { label: 'Badges Earned', value: String(earnedBadges), color: '#f59e0b', icon: '🏆' },
  ];

  // Find "Continue where you left off" module
  const completedSet = new Set(
    (progressData || []).filter((p) => p.status === 'completed').map((p) => `${p.track_id}:${p.module_id}`)
  );
  const inProgressEntries = (progressData || [])
    .filter((p) => p.status === 'in_progress')
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  let resumeTrack: typeof tracks[0] | null = null;
  let resumeModule: { id: string; title: string; icon: string } | null = null;
  let resumeTrackPct = 0;

  if (inProgressEntries.length > 0) {
    // Most recent in-progress module
    const entry = inProgressEntries[0];
    resumeTrack = tracks.find((t) => t.id === entry.track_id) || null;
    if (resumeTrack) {
      const mod = resumeTrack.modules.find((m) => m.id === entry.module_id);
      if (mod) resumeModule = { id: mod.id, title: mod.title, icon: mod.icon };
      const done = (progressData || []).filter((p) => p.track_id === resumeTrack!.id && p.status === 'completed').length;
      resumeTrackPct = Math.round((done / resumeTrack.totalModules) * 100);
    }
  }

  if (!resumeModule) {
    // Find first incomplete module in most active track
    for (const track of tracks) {
      const nextMod = track.modules.find((m) => !completedSet.has(`${track.id}:${m.id}`));
      if (nextMod) {
        resumeTrack = track;
        resumeModule = { id: nextMod.id, title: nextMod.title, icon: nextMod.icon };
        const done = (progressData || []).filter((p) => p.track_id === track.id && p.status === 'completed').length;
        resumeTrackPct = Math.round((done / track.totalModules) * 100);
        break;
      }
    }
  }

  const quickActions = [
    { href: '/explore?tab=pipeline', icon: '🔄', label: 'Data Pipeline', desc: 'Live data flow simulator', color: '#6366f1' },
    { href: '/explore?tab=segments', icon: '🎯', label: 'Segment Builder', desc: 'Practice building audiences', color: '#10b981' },
    { href: '/explore?tab=identity', icon: '🔗', label: 'Identity Viz', desc: 'See profiles merge live', color: '#3b82f6' },
    { href: '/assess', icon: '📝', label: 'Assessments', desc: 'Quizzes & scenarios', color: '#a855f7' },
    { href: '/achievements', icon: '🏆', label: 'Achievements', desc: `${earnedBadges} badges earned`, color: '#f59e0b' },
    { href: '/certifications', icon: '🎓', label: 'Certifications', desc: 'Earn credentials', color: '#ec4899' },
    { href: '/glossary', icon: '📖', label: 'Glossary', desc: 'Key terms & concepts', color: '#14b8a6' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            {greeting}, <span className="text-gradient">{fullName.split(' ')[0]}</span>
          </h1>
          <p className="mt-1 text-text-secondary text-sm">
            Continue your learning journey. You&apos;re doing great!
          </p>
        </div>
        {completedModules > 0 && (
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-2xl bg-bg-surface/50 border border-border">
            <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
            <span className="text-xs text-text-muted font-medium">
              {completedModules} module{completedModules !== 1 ? 's' : ''} completed
            </span>
          </div>
        )}
      </div>

      {/* Continue where you left off */}
      {resumeTrack && resumeModule ? (
        <Link href={`/learn/${resumeTrack.id}/${resumeModule.id}`}>
          <div className="group relative overflow-hidden rounded-2xl border border-brand-blue/20 bg-gradient-to-r from-brand-blue/[0.08] to-brand-purple/[0.05] p-5 transition-all duration-300 hover:border-brand-blue/40 hover:shadow-lg hover:shadow-brand-blue/5 hover:-translate-y-0.5">
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-[0.04] blur-3xl bg-brand-blue translate-x-16 -translate-y-16" />
            <div className="relative flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center bg-brand-blue/10 border border-brand-blue/20">
                <PlayCircle size={24} className="text-brand-blue" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs text-brand-blue font-semibold uppercase tracking-wider mb-1">
                  Continue where you left off
                </div>
                <div className="font-bold text-text-primary truncate">{resumeModule.title}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-text-muted">{resumeTrack.title}</span>
                  <span className="text-xs text-text-muted">·</span>
                  <span className="text-xs text-text-muted">{resumeTrackPct}% complete</span>
                </div>
              </div>
              <ArrowRight size={20} className="text-text-muted group-hover:text-brand-blue group-hover:translate-x-1 transition-all flex-shrink-0" />
            </div>
          </div>
        </Link>
      ) : completedModules === 0 ? (
        <Link href="/learn">
          <div className="group relative overflow-hidden rounded-2xl border border-brand-green/20 bg-gradient-to-r from-brand-green/[0.08] to-brand-cyan/[0.05] p-5 transition-all duration-300 hover:border-brand-green/40 hover:shadow-lg hover:shadow-brand-green/5 hover:-translate-y-0.5">
            <div className="relative flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center bg-brand-green/10 border border-brand-green/20">
                <BookOpen size={24} className="text-brand-green" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs text-brand-green font-semibold uppercase tracking-wider mb-1">
                  Get Started
                </div>
                <div className="font-bold text-text-primary">Start your first module</div>
                <div className="text-xs text-text-muted mt-1">{tracks.length} learning tracks available for your role</div>
              </div>
              <ArrowRight size={20} className="text-text-muted group-hover:text-brand-green group-hover:translate-x-1 transition-all flex-shrink-0" />
            </div>
          </div>
        </Link>
      ) : null}

      {/* Recommendations */}
      <RecommendedNext
        recommendations={getRecommendations(role, (progressData || []).map((p) => ({
          track_id: p.track_id,
          module_id: p.module_id,
          status: p.status,
        })))}
      />

      {/* Nudge banners */}
      <NudgeBanner />

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="group relative overflow-hidden rounded-2xl border border-border bg-bg-surface/50 p-5 transition-all duration-300 hover:border-border-strong hover:-translate-y-0.5 hover:shadow-card"
          >
            {/* Subtle gradient accent */}
            <div
              className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-[0.07] blur-2xl -translate-y-8 translate-x-8"
              style={{ background: stat.color }}
            />
            <div className="relative flex items-start justify-between">
              <div>
                <div className="text-3xl font-extrabold tracking-tight" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="text-xs text-text-muted mt-1 font-medium">{stat.label}</div>
              </div>
              <Icon name={stat.icon} contained color={stat.color} containerSize="sm" />
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Dashboard */}
      <ProgressDashboard
        progress={(progressData || []).map((p) => ({
          track_id: p.track_id,
          module_id: p.module_id,
          status: p.status,
          completed_at: p.completed_at,
          time_spent_seconds: p.time_spent_seconds || 0,
        }))}
        quizAttempts={(quizData || []).map((q) => ({
          quiz_id: q.quiz_id,
          score: q.score,
          total: q.total,
          percentage: q.percentage,
          passed: q.passed,
          created_at: q.created_at,
        }))}
        badgeCount={earnedBadges}
        tracks={tracks.map((t) => ({
          id: t.id,
          title: t.title,
          color: t.color,
          totalModules: t.totalModules,
          modules: t.modules.map((m) => ({ id: m.id, contentType: m.contentType })),
        }))}
      />

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
                    <Icon name={track.icon} contained color={track.color} containerSize="lg" />
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

      {/* Activity Feed */}
      <div>
        <h2 className="text-lg font-bold mb-4">Recent Activity</h2>
        <ActivityFeed />
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {quickActions.map((action) => (
            <Link key={action.label} href={action.href}>
              <Card hover className="text-center group">
                <div className="flex justify-center mb-3">
                  <Icon name={action.icon} contained color={action.color} containerSize="lg" />
                </div>
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
