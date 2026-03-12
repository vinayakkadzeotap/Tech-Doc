import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getDomain, DOMAINS } from '@/lib/utils/codebase';
import RepoCard from '@/components/codebase/RepoCard';
import MermaidDiagram from '@/components/mdx/MermaidDiagram';
import { getRelatedCDPSkills } from '@/lib/utils/codebase/search-index';
import type { DomainId } from '@/lib/utils/codebase/types';
import {
  ChevronLeft,
  Fingerprint,
  Database,
  Users,
  Send,
  Layout,
  Brain,
  HardDrive,
  BarChart3,
  Shield,
  type LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  Fingerprint,
  Database,
  Users,
  Send,
  Layout,
  Brain,
  HardDrive,
  BarChart3,
  Shield,
};

export function generateStaticParams() {
  return DOMAINS.map((d) => ({ domainId: d.id }));
}

export function generateMetadata({ params }: { params: { domainId: string } }) {
  const domain = getDomain(params.domainId);
  return {
    title: domain ? `${domain.title} | Codebase Intelligence` : 'Not Found',
  };
}

export default function DomainPage({ params }: { params: { domainId: string } }) {
  const domain = getDomain(params.domainId);
  if (!domain) return notFound();

  const Icon = ICON_MAP[domain.icon] || Database;
  const languages = Array.from(new Set(domain.repos.map((r) => r.language)));
  const cdpSkills = getRelatedCDPSkills(domain.id as DomainId);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <Link
        href="/codebase"
        className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-brand-blue transition-colors mb-6"
      >
        <ChevronLeft size={14} />
        Codebase Intelligence
      </Link>

      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div
          className="flex items-center justify-center w-12 h-12 rounded-xl shrink-0"
          style={{ backgroundColor: `${domain.color}15` }}
        >
          <Icon size={24} style={{ color: domain.color }} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-text-primary">{domain.title}</h1>
          <p className="text-sm text-text-muted mt-1">{domain.description}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-bg-elevated text-text-secondary">
              {domain.repos.length} repos
            </span>
            {languages.map((lang) => (
              <span
                key={lang}
                className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-bg-elevated text-text-secondary"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* CDP Skills Cross-Links */}
      {cdpSkills.length > 0 && (
        <div className="flex items-center gap-2 mb-6">
          <span className="text-[10px] text-text-muted font-medium">Related CDP Skills:</span>
          {cdpSkills.map((skill) => (
            <Link
              key={skill.id}
              href="/cdp-assistant"
              className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-brand-purple/10 text-brand-purple hover:bg-brand-purple/20 transition-colors"
            >
              {skill.label}
            </Link>
          ))}
        </div>
      )}

      <>
        {/* Architecture Notes */}
        {domain.architectureNotes && (
          <div className="mb-8 p-5 rounded-xl bg-bg-surface border border-border">
            <h2 className="text-sm font-semibold text-text-primary mb-2">Architecture Overview</h2>
            <p className="text-xs text-text-secondary leading-relaxed whitespace-pre-line">
              {domain.architectureNotes}
            </p>
          </div>
        )}

        {/* Architecture Diagram */}
        {domain.mermaidArch && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-text-primary mb-3">System Architecture</h2>
            <div className="p-4 rounded-xl bg-bg-surface border border-border">
              <MermaidDiagram chart={domain.mermaidArch} />
            </div>
          </div>
        )}

        {/* Repos */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-text-primary mb-3">
            Repositories ({domain.repos.length})
          </h2>
          <div className="space-y-2">
            {domain.repos.map((repo) => (
              <RepoCard key={repo.id} repo={repo} domainColor={domain.color} />
            ))}
            {domain.repos.length === 0 && (
              <p className="text-xs text-text-muted p-4 bg-bg-surface border border-border rounded-xl text-center">
                Analysis in progress...
              </p>
            )}
          </div>
        </div>

        {/* Data Flow Diagram */}
        {domain.mermaidDataFlow && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-text-primary mb-3">Data Flow</h2>
            <div className="p-4 rounded-xl bg-bg-surface border border-border">
              <MermaidDiagram chart={domain.mermaidDataFlow} />
            </div>
          </div>
        )}

        {/* Domain Navigation */}
        <div className="border-t border-border pt-6">
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
            Other Domains
          </h3>
          <div className="flex flex-wrap gap-2">
            {DOMAINS.filter((d) => d.id !== domain.id).map((d) => {
              const DIcon = ICON_MAP[d.icon] || Database;
              return (
                <Link
                  key={d.id}
                  href={`/codebase/${d.id}`}
                  className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-border text-text-secondary hover:text-text-primary hover:border-border-strong transition-all"
                >
                  <DIcon size={12} style={{ color: d.color }} />
                  {d.title}
                </Link>
              );
            })}
          </div>
        </div>
      </>
    </div>
  );
}
