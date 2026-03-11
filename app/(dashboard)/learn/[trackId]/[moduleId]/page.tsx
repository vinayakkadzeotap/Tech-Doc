import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TRACKS } from '@/lib/utils/roles';
import MarkCompleteBar from '@/components/learning/MarkCompleteBar';
import ModuleToolbar from '@/components/learning/ModuleToolbar';
import ScrollTracker from '@/components/learning/ScrollTracker';
import Badge from '@/components/ui/Badge';
import Icon from '@/components/ui/Icon';
import { getModuleContent } from '@/lib/mdx';
import { serialize } from 'next-mdx-remote/serialize';
import MDXRenderer from '@/components/mdx/MDXRenderer';

interface Props {
  params: Promise<{ trackId: string; moduleId: string }>;
}

export default async function ModulePage({ params }: Props) {
  const { trackId, moduleId } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const track = TRACKS.find((t) => t.id === trackId);
  if (!track) notFound();

  const moduleIdx = track.modules.findIndex((m) => m.id === moduleId);
  const module = track.modules[moduleIdx];
  if (!module) notFound();

  const prevModule = moduleIdx > 0 ? track.modules[moduleIdx - 1] : null;
  const nextModule = moduleIdx < track.modules.length - 1 ? track.modules[moduleIdx + 1] : null;

  // Check completion status
  const { data: progress } = await supabase
    .from('progress')
    .select('status')
    .eq('user_id', user.id)
    .eq('track_id', trackId)
    .eq('module_id', moduleId)
    .maybeSingle();

  const isComplete = progress?.status === 'completed';

  // Load MDX content if available
  const moduleContent = getModuleContent(trackId, moduleId);
  let mdxSource = null;
  if (moduleContent) {
    try {
      mdxSource = await serialize(moduleContent.content, { blockJS: false });
    } catch {
      // MDX parse error - leave mdxSource as null to show fallback UI
    }
  }

  const contentTypeColors: Record<string, string> = {
    concept: '#3b82f6',
    tutorial: '#10b981',
    reference: '#f59e0b',
    'deep-dive': '#a855f7',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-text-muted mb-6">
        <Link href="/learn" className="hover:text-text-primary transition-colors">
          Learning Hub
        </Link>
        <span>/</span>
        <Link href={`/learn?track=${trackId}`} className="hover:text-text-primary transition-colors">
          {track.title}
        </Link>
        <span>/</span>
        <span className="text-text-primary font-medium">{module.title}</span>
      </nav>

      {/* Module header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <Badge color={contentTypeColors[module.contentType] || '#3b82f6'}>
            {module.contentType}
          </Badge>
          <span className="text-xs text-text-muted">{module.estimatedMinutes} min read</span>
          {isComplete && (
            <Badge color="#10b981">Completed</Badge>
          )}
        </div>
        <div className="flex items-center gap-4 mb-2">
          <Icon name={module.icon} contained color={track.color} containerSize="lg" />
          <h1 className="text-3xl font-extrabold">{module.title}</h1>
        </div>
        <p className="text-text-secondary">{module.description}</p>
      </div>

      {/* Module toolbar: bookmark, notes, feedback */}
      <ModuleToolbar trackId={trackId} moduleId={moduleId} />

      {/* Scroll & time tracker */}
      <ScrollTracker trackId={trackId} moduleId={moduleId} />

      {/* Content area */}
      <article className="mb-12 pb-16">
        {mdxSource ? (
          <MDXRenderer source={mdxSource} />
        ) : (
          <div className="bg-bg-surface/50 border border-border rounded-2xl p-8 text-center space-y-4">
            <div className="flex justify-center">
              <Icon name={module.icon} contained color={track.color} containerSize="lg" />
            </div>
            <h2 className="text-xl font-bold">Content Coming Soon</h2>
            <p className="text-text-secondary max-w-md mx-auto">
              This module&apos;s content is being prepared. The full interactive content with diagrams,
              code examples, and exercises will be available here.
            </p>
            <p className="text-xs text-text-muted">
              Track: {track.title} &middot; Module {moduleIdx + 1} of {track.totalModules}
            </p>
          </div>
        )}
      </article>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-border">
        {prevModule ? (
          <Link
            href={`/learn/${trackId}/${prevModule.id}`}
            className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            <div>
              <div className="text-[11px] text-text-muted">Previous</div>
              <div className="font-medium">{prevModule.title}</div>
            </div>
          </Link>
        ) : (
          <div />
        )}
        {nextModule ? (
          <Link
            href={`/learn/${trackId}/${nextModule.id}`}
            className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors text-right group"
          >
            <div>
              <div className="text-[11px] text-text-muted">Next</div>
              <div className="font-medium">{nextModule.title}</div>
            </div>
            <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        ) : (
          <Link
            href="/learn"
            className="text-sm text-brand-blue hover:underline font-medium"
          >
            Back to Learning Hub
          </Link>
        )}
      </div>

      {/* Mark Complete floating bar */}
      <MarkCompleteBar
        trackId={trackId}
        moduleId={moduleId}
        isComplete={isComplete}
      />
    </div>
  );
}
