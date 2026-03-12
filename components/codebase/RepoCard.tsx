'use client';

import { useState } from 'react';
import { ChevronDown, ExternalLink, Eye } from 'lucide-react';
import type { Repo } from '@/lib/utils/codebase/types';
import RepoRelationshipDiagram from './RepoRelationshipDiagram';

const LANG_COLORS: Record<string, string> = {
  Scala: '#DC322F',
  Java: '#B07219',
  Go: '#00ADD8',
  Python: '#3572A5',
  'JS/TS': '#F7DF1E',
  TypeScript: '#3178C6',
  JavaScript: '#F7DF1E',
  Ruby: '#CC342D',
};

export default function RepoCard({ repo, domainColor }: { repo: Repo; domainColor?: string }) {
  const [expanded, setExpanded] = useState(false);
  const [showDiagram, setShowDiagram] = useState(false);

  return (
    <div className="border border-border rounded-xl bg-bg-surface overflow-hidden transition-all duration-200 hover:border-border-strong">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4 text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-text-primary truncate">
              {repo.displayName}
            </h4>
            <span
              className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded"
              style={{
                backgroundColor: `${LANG_COLORS[repo.language] || '#666'}20`,
                color: LANG_COLORS[repo.language] || '#666',
              }}
            >
              {repo.language}
            </span>
            <span className="shrink-0 text-[10px] text-text-muted bg-bg-elevated px-1.5 py-0.5 rounded">
              {repo.size}
            </span>
          </div>
          <p className="text-xs text-text-muted mt-0.5 line-clamp-1">
            {repo.purpose}
          </p>
        </div>
        <ChevronDown
          size={16}
          className={`shrink-0 text-text-muted transition-transform duration-200 ${
            expanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {expanded && (
        <div className="border-t border-border px-4 pb-4 pt-3 space-y-4 animate-fade-in">
          {/* Language Breakdown */}
          {repo.languages.length > 0 && (
            <div>
              <h5 className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                Languages
              </h5>
              <div className="flex h-2 rounded-full overflow-hidden bg-bg-elevated">
                {repo.languages.map((l) => (
                  <div
                    key={l.name}
                    className="h-full"
                    style={{
                      width: `${l.pct}%`,
                      backgroundColor: LANG_COLORS[l.name] || '#666',
                    }}
                    title={`${l.name}: ${l.pct}%`}
                  />
                ))}
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
                {repo.languages.map((l) => (
                  <span key={l.name} className="text-[10px] text-text-muted">
                    {l.name} {l.pct}%
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Key Modules */}
          {repo.keyModules.length > 0 && (
            <div>
              <h5 className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                Key Modules
              </h5>
              <div className="space-y-1.5">
                {repo.keyModules.map((m) => (
                  <div key={m.name} className="flex gap-2 text-xs">
                    <code className="shrink-0 text-brand-blue font-mono text-[11px]">
                      {m.name}
                    </code>
                    <span className="text-text-muted">{m.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dependencies */}
          {repo.dependencies.length > 0 && (
            <div>
              <h5 className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                Dependencies
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {repo.dependencies.map((d) => (
                  <span
                    key={d.name}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full border border-border text-text-secondary"
                    title={d.description}
                  >
                    {d.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Cross-repo Links */}
          {repo.interRepoLinks.length > 0 && (
            <div>
              <h5 className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                Connected Repos
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {repo.interRepoLinks.map((link) => (
                  <span
                    key={link}
                    className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-brand-blue/10 text-brand-blue"
                  >
                    <ExternalLink size={8} />
                    {link}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Relationship Diagram Toggle */}
          <button
            onClick={() => setShowDiagram(!showDiagram)}
            className="inline-flex items-center gap-1 text-[10px] font-medium text-brand-blue hover:text-brand-blue/80 transition-colors"
          >
            <Eye size={12} />
            {showDiagram ? 'Hide' : 'View'} Relationships
          </button>

          {showDiagram && (
            <div className="p-3 rounded-lg bg-bg-primary/50 border border-border">
              <RepoRelationshipDiagram repo={repo} domainColor={domainColor || '#3b82f6'} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
