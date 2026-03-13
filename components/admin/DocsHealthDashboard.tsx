'use client';

import { useState, useEffect } from 'react';
import { BookOpen, AlertTriangle, CheckCircle, ExternalLink, Loader2 } from 'lucide-react';

interface DocsHealthData {
  configured: boolean;
  docs_url: string | null;
  coverage: {
    total_modules: number;
    linked_modules: number;
    percent: number;
    total_docs_links: number;
  };
  unlinked_modules: Array<{
    trackId: string;
    trackTitle: string;
    moduleId: string;
    moduleTitle: string;
  }>;
  broken_links: Array<{
    path: string;
    url: string;
    status: number | string;
  }>;
}

export default function DocsHealthDashboard() {
  const [data, setData] = useState<DocsHealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/docs-health')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load');
        return r.json();
      })
      .then(setData)
      .catch(() => setError('Failed to load docs health data'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-6 rounded-2xl border border-border bg-bg-surface/50">
        <div className="flex items-center gap-2 text-text-muted">
          <Loader2 size={16} className="animate-spin" />
          <span className="text-sm">Loading docs health...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return null;
  }

  if (!data.configured) {
    return (
      <div className="p-6 rounded-2xl border border-border bg-bg-surface/50">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen size={16} className="text-text-muted" />
          <h2 className="text-sm font-bold text-text-primary">Documentation Health</h2>
        </div>
        <p className="text-xs text-text-muted">
          Mintlify integration is not configured. Set MINTLIFY_API_KEY and NEXT_PUBLIC_MINTLIFY_DOCS_URL to enable.
        </p>
      </div>
    );
  }

  const { coverage, unlinked_modules, broken_links } = data;

  return (
    <div className="p-6 rounded-2xl border border-border bg-bg-surface/50 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-brand-cyan" />
          <h2 className="text-sm font-bold text-text-primary">Documentation Health</h2>
        </div>
        {data.docs_url && (
          <a
            href={data.docs_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[10px] text-text-muted hover:text-brand-cyan transition-colors"
          >
            {data.docs_url} <ExternalLink size={10} />
          </a>
        )}
      </div>

      {/* Coverage meter */}
      <div>
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-text-secondary font-medium">Module Coverage</span>
          <span className="text-text-primary font-bold">
            {coverage.linked_modules}/{coverage.total_modules} ({coverage.percent}%)
          </span>
        </div>
        <div className="w-full bg-bg-elevated rounded-full h-2.5 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${coverage.percent}%`,
              backgroundColor: coverage.percent >= 70 ? '#10b981' : coverage.percent >= 40 ? '#f59e0b' : '#ef4444',
            }}
          />
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[10px] text-text-muted">
            {coverage.total_docs_links} total doc links
          </span>
          <span className="text-[10px] text-text-muted">
            {coverage.total_modules - coverage.linked_modules} modules without docs
          </span>
        </div>
      </div>

      {/* Broken links */}
      {broken_links.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-amber-400 mb-2">
            <AlertTriangle size={12} />
            <span>{broken_links.length} Broken Link{broken_links.length > 1 ? 's' : ''}</span>
          </div>
          <div className="space-y-1.5">
            {broken_links.map((link) => (
              <div
                key={link.path}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/5 border border-amber-500/10 text-xs"
              >
                <span className="text-amber-400 font-mono flex-1 truncate">{link.path}</span>
                <span className="text-text-muted">{link.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {broken_links.length === 0 && (
        <div className="flex items-center gap-1.5 text-xs text-emerald-400">
          <CheckCircle size={12} />
          <span>All checked links are healthy</span>
        </div>
      )}

      {/* Unlinked modules (show first 5) */}
      {unlinked_modules.length > 0 && (
        <div>
          <p className="text-xs font-medium text-text-secondary mb-2">
            Modules without docs links ({unlinked_modules.length}):
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {unlinked_modules.slice(0, 6).map((m) => (
              <div
                key={m.moduleId}
                className="text-[10px] px-2 py-1 rounded bg-bg-elevated text-text-muted truncate"
                title={`${m.trackTitle}: ${m.moduleTitle}`}
              >
                {m.moduleTitle}
              </div>
            ))}
          </div>
          {unlinked_modules.length > 6 && (
            <p className="text-[10px] text-text-muted mt-1.5">
              +{unlinked_modules.length - 6} more
            </p>
          )}
        </div>
      )}
    </div>
  );
}
