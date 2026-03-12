'use client';

import { useState, useMemo } from 'react';
import { CASE_STUDIES, INDUSTRIES } from '@/lib/utils/case-studies';
import Card from '@/components/ui/Card';
import { Search, ChevronDown, ChevronUp, TrendingUp, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function CaseStudiesPage() {
  const [search, setSearch] = useState('');
  const [industryFilter, setIndustryFilter] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let studies = CASE_STUDIES;
    if (industryFilter !== 'all') {
      studies = studies.filter((s) => s.industry === industryFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      studies = studies.filter(
        (s) =>
          s.customer.toLowerCase().includes(q) ||
          s.useCase.toLowerCase().includes(q) ||
          s.challenge.toLowerCase().includes(q) ||
          s.tags.some((t) => t.includes(q))
      );
    }
    return studies;
  }, [search, industryFilter]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold flex items-center gap-2">
          <BookOpen size={24} className="text-brand-blue" />
          Case Studies
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Real-world proof points for sales conversations
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search case studies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-bg-surface/50 border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setIndustryFilter('all')}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              industryFilter === 'all'
                ? 'bg-brand-blue text-white'
                : 'bg-bg-surface/50 border border-border text-text-secondary hover:text-text-primary'
            }`}
          >
            All
          </button>
          {INDUSTRIES.map((ind) => (
            <button
              key={ind}
              onClick={() => setIndustryFilter(ind)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                industryFilter === ind
                  ? 'bg-brand-blue text-white'
                  : 'bg-bg-surface/50 border border-border text-text-secondary hover:text-text-primary'
              }`}
            >
              {ind}
            </button>
          ))}
        </div>
      </div>

      {/* Studies */}
      <div className="space-y-4">
        {filtered.map((study) => {
          const isExpanded = expandedId === study.id;

          return (
            <Card key={study.id} className="!p-0 overflow-hidden">
              <button
                onClick={() => setExpandedId(isExpanded ? null : study.id)}
                className="w-full flex items-center justify-between p-5 hover:bg-bg-primary/20 transition-colors text-left"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-brand-blue/10 text-brand-blue">
                      {study.industry}
                    </span>
                    <span className="text-[10px] text-text-muted">{study.useCase}</span>
                  </div>
                  <h3 className="font-bold text-sm">{study.customer}</h3>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                  <div className="hidden sm:flex items-center gap-2">
                    {study.metrics.slice(0, 2).map((m) => (
                      <span
                        key={m.label}
                        className="px-2 py-1 rounded bg-green-500/10 text-green-400 text-xs font-medium"
                      >
                        {m.value}
                      </span>
                    ))}
                  </div>
                  {isExpanded ? (
                    <ChevronUp size={20} className="text-text-muted" />
                  ) : (
                    <ChevronDown size={20} className="text-text-muted" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-border p-5 space-y-5">
                  {/* Challenge */}
                  <div>
                    <h4 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">
                      Challenge
                    </h4>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {study.challenge}
                    </p>
                  </div>

                  {/* Solution */}
                  <div>
                    <h4 className="text-xs font-semibold text-brand-blue uppercase tracking-wider mb-2">
                      Solution
                    </h4>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {study.solution}
                    </p>
                  </div>

                  {/* Outcome */}
                  <div>
                    <h4 className="text-xs font-semibold text-green-400 uppercase tracking-wider mb-2">
                      Outcome
                    </h4>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {study.outcome}
                    </p>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {study.metrics.map((m) => (
                      <div
                        key={m.label}
                        className="p-3 rounded-xl bg-bg-primary/50 border border-border text-center"
                      >
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <TrendingUp size={12} className="text-green-400" />
                        </div>
                        <div className="text-lg font-extrabold text-text-primary">
                          {m.value}
                        </div>
                        <div className="text-[10px] text-text-muted">{m.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {study.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded text-[10px] bg-bg-surface/80 text-text-muted"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <BookOpen size={48} className="mx-auto text-text-muted/30 mb-4" />
          <p className="text-text-muted">No case studies match your search.</p>
        </div>
      )}
    </div>
  );
}
