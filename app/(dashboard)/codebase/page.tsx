import Link from 'next/link';
import { DOMAINS } from '@/lib/utils/codebase';
import DomainCard from '@/components/codebase/DomainCard';
import { Code2, GitBranch, Layers, Network, Microscope } from 'lucide-react';

export const metadata = {
  title: 'Codebase Intelligence | Zeotap Learning',
  description: 'Deep architectural analysis of the Zeotap product codebase across 9 domains.',
};

export default function CodebaseIndexPage() {
  const totalRepos = DOMAINS.reduce((sum, d) => sum + d.repos.length, 0);
  const allLanguages = Array.from(new Set(DOMAINS.flatMap((d) => d.repos.map((r) => r.language))));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-blue/10">
            <Code2 size={20} className="text-brand-blue" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">
              Codebase Intelligence
            </h1>
            <p className="text-sm text-text-muted">
              Architectural analysis of the Zeotap product codebase
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-bg-surface border border-border">
          <Layers size={18} className="text-brand-blue" />
          <div>
            <p className="text-lg font-bold text-text-primary">{DOMAINS.length}</p>
            <p className="text-xs text-text-muted">Domains</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-xl bg-bg-surface border border-border">
          <GitBranch size={18} className="text-brand-purple" />
          <div>
            <p className="text-lg font-bold text-text-primary">{totalRepos}</p>
            <p className="text-xs text-text-muted">Repos Analyzed</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-xl bg-bg-surface border border-border">
          <Code2 size={18} className="text-green-500" />
          <div>
            <p className="text-lg font-bold text-text-primary">{allLanguages.length}</p>
            <p className="text-xs text-text-muted">Languages</p>
          </div>
        </div>
      </div>

      {/* Explore Graph CTA */}
      <Link
        href="/codebase/graph"
        className="flex items-center gap-3 p-4 mb-8 rounded-xl bg-gradient-to-r from-brand-blue/10 via-brand-purple/10 to-emerald-500/10 border border-brand-blue/20 hover:border-brand-blue/40 transition-all group"
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-blue/20 group-hover:bg-brand-blue/30 transition-colors">
          <Network size={20} className="text-brand-blue" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-text-primary">Explore Interactive Code Graph</p>
          <p className="text-xs text-text-muted">
            Visualize all {totalRepos} repos, modules, and dependencies as an interactive force-directed graph
          </p>
        </div>
        <span className="text-xs text-brand-blue font-medium hidden sm:block">Open Graph &rarr;</span>
      </Link>

      {/* Deep Code Graph CTA */}
      <Link
        href="/codebase/deep-graph"
        className="flex items-center gap-3 p-4 mb-8 rounded-xl bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-brand-purple/10 border border-emerald-500/20 hover:border-emerald-500/40 transition-all group"
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/20 group-hover:bg-emerald-500/30 transition-colors">
          <Microscope size={20} className="text-emerald-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-text-primary">Deep Code Graph</p>
          <p className="text-xs text-text-muted">
            Explore files, classes, functions, and their relationships — powered by CodeGraphContext
          </p>
        </div>
        <span className="text-xs text-emerald-400 font-medium hidden sm:block">Explore &rarr;</span>
      </Link>

      {/* Domain Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DOMAINS.map((domain) => (
          <DomainCard key={domain.id} domain={domain} />
        ))}
      </div>
    </div>
  );
}
