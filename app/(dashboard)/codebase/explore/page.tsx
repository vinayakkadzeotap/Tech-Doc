'use client';

import { useState, useMemo, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, ChevronLeft, X, Database, Box, GitBranch, Layers } from 'lucide-react';
import { DOMAINS } from '@/lib/utils/codebase';
import {
  searchCodebase,
  getSearchStats,
  getAllLanguages,
  type SearchFilters,
  type SearchableItem,
} from '@/lib/utils/codebase/search-index';
import ExploreRepoCard from '@/components/codebase/ExploreRepoCard';
import type { DomainId } from '@/lib/utils/codebase/types';

const DEP_TYPE_COLORS: Record<string, string> = {
  database: '#22c55e',
  queue: '#f59e0b',
  cloud: '#06b6d4',
  library: '#a855f7',
  service: '#ec4899',
};

const QUICK_SEARCHES = [
  { label: 'All Scala repos', q: '', type: 'repo' as const, lang: 'Scala' },
  { label: 'All Go repos', q: '', type: 'repo' as const, lang: 'Go' },
  { label: 'Queue dependencies', q: '', type: 'dependency' as const, depType: 'queue' },
  { label: 'Database dependencies', q: '', type: 'dependency' as const, depType: 'database' },
  { label: 'Kafka', q: 'Kafka' },
  { label: 'Redis', q: 'Redis' },
  { label: 'RabbitMQ', q: 'RabbitMQ' },
  { label: 'BigQuery', q: 'BigQuery' },
];

function ExploreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialQ = searchParams.get('q') ?? '';
  const initialType = (searchParams.get('type') as SearchFilters['type']) ?? undefined;
  const initialDomain = (searchParams.get('domain') as DomainId) ?? undefined;
  const initialLang = searchParams.get('lang') ?? undefined;
  const initialDepType = searchParams.get('depType') ?? undefined;

  const [query, setQuery] = useState(initialQ);
  const [typeFilter, setTypeFilter] = useState<SearchFilters['type'] | undefined>(initialType);
  const [domainFilter, setDomainFilter] = useState<DomainId | undefined>(initialDomain);
  const [langFilter, setLangFilter] = useState<string | undefined>(initialLang);
  const [depTypeFilter, setDepTypeFilter] = useState<string | undefined>(initialDepType);

  const stats = useMemo(() => getSearchStats(), []);
  const languages = useMemo(() => getAllLanguages(), []);

  const results = useMemo(
    () =>
      searchCodebase(query, {
        type: typeFilter,
        domainId: domainFilter,
        language: langFilter,
        depType: depTypeFilter,
      }),
    [query, typeFilter, domainFilter, langFilter, depTypeFilter]
  );

  const hasFilters = !!(typeFilter || domainFilter || langFilter || depTypeFilter);

  const clearAll = useCallback(() => {
    setQuery('');
    setTypeFilter(undefined);
    setDomainFilter(undefined);
    setLangFilter(undefined);
    setDepTypeFilter(undefined);
  }, []);

  const applyQuickSearch = useCallback((qs: typeof QUICK_SEARCHES[number]) => {
    setQuery(qs.q);
    setTypeFilter(qs.type ?? undefined);
    setLangFilter(qs.lang ?? undefined);
    setDepTypeFilter(qs.depType ?? undefined);
    setDomainFilter(undefined);
  }, []);

  // Find the repo object for a search result
  const getRepoForResult = (item: SearchableItem) => {
    for (const domain of DOMAINS) {
      for (const repo of domain.repos) {
        if (repo.id === item.repoId) return repo;
      }
    }
    return null;
  };

  const showDefault = !query && !hasFilters;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <Link
        href="/codebase"
        className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-brand-blue transition-colors mb-6"
      >
        <ChevronLeft size={14} />
        Codebase Intelligence
      </Link>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-text-primary">Codebase Explorer</h1>
        <p className="text-sm text-text-muted mt-1">
          Search across {stats.repos} repos, {stats.modules} modules, and {stats.deps} dependencies
        </p>
      </div>

      {/* Search bar */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search repos, modules, dependencies..."
          className="w-full pl-10 pr-10 py-3 rounded-xl bg-bg-surface border border-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-blue transition-colors"
          autoFocus
        />
        {(query || hasFilters) && (
          <button
            onClick={clearAll}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {/* Type filters */}
        {(['repo', 'module', 'dependency'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(typeFilter === t ? undefined : t)}
            className={`text-[10px] font-medium px-2.5 py-1 rounded-full border transition-colors ${
              typeFilter === t
                ? 'bg-brand-blue/15 border-brand-blue/40 text-brand-blue'
                : 'border-border text-text-muted hover:border-border-strong'
            }`}
          >
            {t === 'repo' ? 'Repos' : t === 'module' ? 'Modules' : 'Dependencies'}
          </button>
        ))}

        <span className="w-px h-5 bg-border self-center" />

        {/* Domain filter */}
        <select
          value={domainFilter ?? ''}
          onChange={(e) => setDomainFilter((e.target.value || undefined) as DomainId | undefined)}
          className="text-[10px] font-medium px-2 py-1 rounded-full border border-border bg-bg-surface text-text-muted focus:outline-none"
        >
          <option value="">All Domains</option>
          {DOMAINS.map((d) => (
            <option key={d.id} value={d.id}>{d.title}</option>
          ))}
        </select>

        {/* Language filter */}
        <select
          value={langFilter ?? ''}
          onChange={(e) => setLangFilter(e.target.value || undefined)}
          className="text-[10px] font-medium px-2 py-1 rounded-full border border-border bg-bg-surface text-text-muted focus:outline-none"
        >
          <option value="">All Languages</option>
          {languages.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>

        {/* Dep type filter (only when viewing dependencies) */}
        {typeFilter === 'dependency' && (
          <select
            value={depTypeFilter ?? ''}
            onChange={(e) => setDepTypeFilter(e.target.value || undefined)}
            className="text-[10px] font-medium px-2 py-1 rounded-full border border-border bg-bg-surface text-text-muted focus:outline-none"
          >
            <option value="">All Types</option>
            {['database', 'queue', 'cloud', 'library', 'service'].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        )}
      </div>

      {/* Quick searches (shown when no query) */}
      {showDefault && (
        <div className="mb-8">
          <h3 className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2">Quick searches</h3>
          <div className="flex flex-wrap gap-2">
            {QUICK_SEARCHES.map((qs) => (
              <button
                key={qs.label}
                onClick={() => applyQuickSearch(qs)}
                className="text-xs px-3 py-1.5 rounded-lg border border-border text-text-secondary hover:text-text-primary hover:border-border-strong transition-all"
              >
                {qs.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      <div className="space-y-3">
        {!showDefault && (
          <p className="text-xs text-text-muted mb-2">
            {results.length} result{results.length !== 1 ? 's' : ''}
            {query && <> for &ldquo;{query}&rdquo;</>}
          </p>
        )}

        {results.map((item) => {
          if (item.type === 'repo') {
            const repo = getRepoForResult(item);
            if (!repo) return null;
            return (
              <ExploreRepoCard
                key={item.id}
                repo={repo}
                domainId={item.domainId}
                domainTitle={item.domainTitle}
                domainColor={item.domainColor}
              />
            );
          }

          if (item.type === 'module') {
            return (
              <div key={item.id} className="flex items-start gap-3 p-3 rounded-xl border border-border bg-bg-surface">
                <Box size={14} className="shrink-0 mt-0.5 text-text-muted" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-text-primary">{item.name}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-bg-elevated text-text-muted">module</span>
                  </div>
                  <p className="text-xs text-text-muted mt-0.5">{item.description}</p>
                  {item.path && (
                    <code className="text-[10px] text-text-muted font-mono mt-1 block">{item.path}</code>
                  )}
                  <Link
                    href={`/codebase/${item.domainId}`}
                    className="text-[10px] mt-1 inline-block"
                    style={{ color: item.domainColor }}
                  >
                    {item.repoName} &middot; {item.domainTitle}
                  </Link>
                </div>
              </div>
            );
          }

          if (item.type === 'dependency') {
            const color = DEP_TYPE_COLORS[item.depType ?? ''] || '#666';
            return (
              <div key={item.id} className="flex items-start gap-3 p-3 rounded-xl border border-border bg-bg-surface">
                <Database size={14} className="shrink-0 mt-0.5" style={{ color }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-text-primary">{item.name}</span>
                    <span
                      className="text-[9px] px-1.5 py-0.5 rounded font-medium"
                      style={{ backgroundColor: `${color}15`, color }}
                    >
                      {item.depType}
                    </span>
                    {item.usedByRepoCount && item.usedByRepoCount > 1 && (
                      <span className="text-[9px] text-text-muted">
                        used by {item.usedByRepoCount} repos
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-muted mt-0.5">{item.description}</p>
                </div>
              </div>
            );
          }

          return null;
        })}

        {!showDefault && results.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-text-muted">No results found</p>
            <button
              onClick={clearAll}
              className="text-xs text-brand-blue mt-2 hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <div className="w-6 h-6 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}
