'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, GitBranch, Link2 } from 'lucide-react';
import type { Repo, DomainId } from '@/lib/utils/codebase/types';
import { getRelatedCDPSkills } from '@/lib/utils/codebase/search-index';
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

interface Props {
  repo: Repo;
  domainId: DomainId;
  domainTitle: string;
  domainColor: string;
}

export default function ExploreRepoCard({ repo, domainId, domainTitle, domainColor }: Props) {
  const [showDiagram, setShowDiagram] = useState(false);
  const cdpSkills = getRelatedCDPSkills(domainId);

  return (
    <div className="border border-border rounded-xl bg-bg-surface overflow-hidden">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href={`/codebase/${domainId}`}
                className="text-sm font-bold text-text-primary hover:text-brand-blue transition-colors"
              >
                {repo.displayName}
              </Link>
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                style={{
                  backgroundColor: `${LANG_COLORS[repo.language] || '#666'}20`,
                  color: LANG_COLORS[repo.language] || '#666',
                }}
              >
                {repo.language}
              </span>
              <span className="text-[10px] text-text-muted bg-bg-elevated px-1.5 py-0.5 rounded">
                {repo.size}
              </span>
            </div>
            <p className="text-xs text-text-muted mt-1 line-clamp-2">{repo.purpose}</p>
          </div>
          <span
            className="shrink-0 text-[9px] font-medium px-2 py-1 rounded-full"
            style={{ backgroundColor: `${domainColor}15`, color: domainColor }}
          >
            {domainTitle}
          </span>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 mt-3">
          {repo.interRepoLinks.length > 0 && (
            <span className="inline-flex items-center gap-1 text-[10px] text-text-muted">
              <Link2 size={10} />
              {repo.interRepoLinks.length} connected repos
            </span>
          )}
          {repo.dependencies.length > 0 && (
            <span className="inline-flex items-center gap-1 text-[10px] text-text-muted">
              <GitBranch size={10} />
              {repo.dependencies.length} dependencies
            </span>
          )}
          {repo.keyModules.length > 0 && (
            <span className="text-[10px] text-text-muted">
              {repo.keyModules.length} modules
            </span>
          )}
        </div>

        {/* CDP skill cross-links */}
        {cdpSkills.length > 0 && (
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-[9px] text-text-muted">Related:</span>
            {cdpSkills.map((skill) => (
              <Link
                key={skill.id}
                href="/cdp-assistant"
                className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-brand-purple/10 text-brand-purple hover:bg-brand-purple/20 transition-colors"
              >
                {skill.label}
              </Link>
            ))}
          </div>
        )}

        {/* Diagram toggle */}
        <button
          onClick={() => setShowDiagram(!showDiagram)}
          className="mt-3 inline-flex items-center gap-1 text-[10px] font-medium text-brand-blue hover:text-brand-blue/80 transition-colors"
        >
          <ChevronDown
            size={12}
            className={`transition-transform duration-200 ${showDiagram ? 'rotate-180' : ''}`}
          />
          {showDiagram ? 'Hide' : 'View'} Relationships
        </button>
      </div>

      {/* Diagram */}
      {showDiagram && (
        <div className="border-t border-border p-4 bg-bg-primary/50">
          <RepoRelationshipDiagram repo={repo} domainColor={domainColor} />
        </div>
      )}
    </div>
  );
}
