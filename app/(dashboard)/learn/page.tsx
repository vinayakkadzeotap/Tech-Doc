import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { TRACKS, getTracksForRole, type UserRole, type Track } from '@/lib/utils/roles';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import EngineerPOCTable from '@/components/learning/EngineerPOCTable';

function TrackDetail({ track, completedModules }: { track: Track; completedModules: Set<string> }) {
  const pct = Math.round(
    (track.modules.filter((m) => completedModules.has(`${track.id}:${m.id}`)).length / track.totalModules) * 100
  );

  const contentTypeColors: Record<string, string> = {
    concept: '#3b82f6',
    tutorial: '#10b981',
    reference: '#f59e0b',
    'deep-dive': '#a855f7',
  };

  return (
    <div className="space-y-4">
      {/* Track header */}
      <div className="flex items-center gap-4 mb-6">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
          style={{ background: `${track.color}15` }}
        >
          {track.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold">{track.title}</h2>
          <p className="text-sm text-text-secondary">{track.subtitle}</p>
          <div className="flex items-center gap-4 mt-2 text-xs text-text-muted">
            <span>{track.totalModules} modules</span>
            <span>~{track.estimatedHours} hours</span>
            {track.mandatory && <Badge color="#ef4444">Required</Badge>}
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-extrabold" style={{ color: track.color }}>
            {pct}%
          </div>
          <div className="text-xs text-text-muted">complete</div>
        </div>
      </div>

      <ProgressBar value={pct} color={track.color} size="md" />

      {/* Module list */}
      <div className="space-y-2 mt-6">
        {track.modules.map((module, idx) => {
          const isComplete = completedModules.has(`${track.id}:${module.id}`);

          return (
            <Link
              key={module.id}
              href={`/learn/${track.id}/${module.id}`}
              className={`
                flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all duration-200
                ${isComplete
                  ? 'bg-bg-surface/30 border-border'
                  : 'bg-bg-surface/50 border-border hover:border-border-strong hover:-translate-y-0.5'
                }
              `}
            >
              {/* Completion indicator */}
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 border-2 transition-all
                  ${isComplete
                    ? 'bg-brand-green border-brand-green text-white'
                    : 'border-border-strong text-text-muted'
                  }
                `}
              >
                {isComplete ? '✓' : idx + 1}
              </div>

              {/* Icon */}
              <span className="text-xl flex-shrink-0">{module.icon}</span>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">{module.title}</div>
                <div className="text-xs text-text-muted mt-0.5 line-clamp-1">{module.description}</div>
              </div>

              {/* Meta */}
              <div className="hidden sm:flex items-center gap-2">
                <Badge color={contentTypeColors[module.contentType] || '#3b82f6'}>
                  {module.contentType}
                </Badge>
                <span className="text-xs text-text-muted">{module.estimatedMinutes} min</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default async function LearnPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const role = (profile?.role || 'engineering') as UserRole;

  // Get all progress
  const { data: progressData } = await supabase
    .from('progress')
    .select('track_id, module_id, status')
    .eq('user_id', user.id);

  const completedModules = new Set(
    progressData
      ?.filter((p) => p.status === 'completed')
      .map((p) => `${p.track_id}:${p.module_id}`) || []
  );

  const recommendedTracks = getTracksForRole(role);
  const otherTracks = TRACKS.filter((t) => !recommendedTracks.some((rt) => rt.id === t.id));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold">Learning Hub</h1>
        <p className="text-text-secondary text-sm mt-1">
          Tracks recommended for your role. Complete modules, take quizzes, earn badges.
        </p>
      </div>

      {/* Recommended tracks */}
      <div className="space-y-8">
        <h2 className="text-sm font-bold text-text-muted uppercase tracking-wider">
          Recommended for You
        </h2>
        {recommendedTracks.map((track) => (
          <Card key={track.id} className="!p-6">
            <TrackDetail track={track} completedModules={completedModules} />
            {track.id === 'engineering' && <EngineerPOCTable />}
          </Card>
        ))}
      </div>

      {/* Other tracks */}
      {otherTracks.length > 0 && (
        <div className="space-y-8">
          <h2 className="text-sm font-bold text-text-muted uppercase tracking-wider">
            Other Tracks
          </h2>
          {otherTracks.map((track) => (
            <Card key={track.id} className="!p-6 opacity-75 hover:opacity-100 transition-opacity">
              <TrackDetail track={track} completedModules={completedModules} />
              {track.id === 'engineering' && <EngineerPOCTable />}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
