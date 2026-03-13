'use client';

import { useState, useEffect, useMemo } from 'react';
import Card from '@/components/ui/Card';
import { TRACKS } from '@/lib/utils/roles';
import { getContentStatus, STATUS_CONFIG, type ContentStatus, type ContentReview } from '@/lib/utils/content-metadata';
import { GLOSSARY_TERMS, GLOSSARY_CATEGORIES, type GlossaryCategory } from '@/lib/utils/glossary-data';
import { CheckCircle, Clock, AlertTriangle, BookOpen, FileText } from 'lucide-react';
import Breadcrumb from '@/components/ui/Breadcrumb';

type Tab = 'modules' | 'glossary';

export default function ContentPage() {
  const [reviews, setReviews] = useState<ContentReview[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('modules');
  const [statusFilter, setStatusFilter] = useState<ContentStatus | 'all'>('all');
  const [marking, setMarking] = useState<string | null>(null);

  // Glossary editing state
  const [editingTerm, setEditingTerm] = useState<string | null>(null);
  const [editDef, setEditDef] = useState('');

  useEffect(() => {
    fetch('/api/content/review')
      .then((r) => r.ok ? r.json() : [])
      .then((data) => setReviews(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  // Build module list with status
  const allModules = useMemo(() => {
    const reviewMap = new Map(reviews.map((r) => [r.module_id, r]));

    return TRACKS.flatMap((track) =>
      track.modules.map((mod) => {
        const review = reviewMap.get(mod.id);
        const status = review ? getContentStatus(review.last_reviewed) : 'stale';
        return {
          trackId: track.id,
          trackTitle: track.title,
          trackColor: track.color,
          moduleId: mod.id,
          title: mod.title,
          contentType: mod.contentType,
          status,
          lastReviewed: review?.last_reviewed || null,
          notes: review?.notes || '',
        };
      })
    );
  }, [reviews]);

  const filtered = statusFilter === 'all'
    ? allModules
    : allModules.filter((m) => m.status === statusFilter);

  const statusCounts = {
    current: allModules.filter((m) => m.status === 'current').length,
    'needs-review': allModules.filter((m) => m.status === 'needs-review').length,
    stale: allModules.filter((m) => m.status === 'stale').length,
  };

  const markReviewed = async (moduleId: string) => {
    setMarking(moduleId);
    try {
      const res = await fetch('/api/content/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ module_id: moduleId }),
      });
      if (res.ok) {
        setReviews((prev) => {
          const existing = prev.findIndex((r) => r.module_id === moduleId);
          const newReview: ContentReview = {
            module_id: moduleId,
            last_reviewed: new Date().toISOString(),
            reviewed_by: null,
            status: 'current',
            notes: '',
          };
          if (existing >= 0) {
            const updated = [...prev];
            updated[existing] = newReview;
            return updated;
          }
          return [...prev, newReview];
        });
      }
    } finally {
      setMarking(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumb items={[
        { label: 'Admin', href: '/admin/dashboard' },
        { label: 'Content Management' },
      ]} />
      <div>
        <h1 className="text-2xl font-extrabold">Content Management</h1>
        <p className="text-text-secondary text-sm mt-1">
          Track content freshness and manage glossary terms
        </p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('modules')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'modules'
              ? 'bg-brand-blue text-white'
              : 'bg-bg-surface text-text-secondary hover:bg-bg-hover'
          }`}
        >
          <BookOpen size={16} />
          Module Freshness
        </button>
        <button
          onClick={() => setActiveTab('glossary')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'glossary'
              ? 'bg-brand-blue text-white'
              : 'bg-bg-surface text-text-secondary hover:bg-bg-hover'
          }`}
        >
          <FileText size={16} />
          Glossary Editor
        </button>
      </div>

      {activeTab === 'modules' && (
        <>
          {/* Status summary */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="!p-4 cursor-pointer" onClick={() => setStatusFilter('current')}>
              <div className="flex items-center gap-3">
                <CheckCircle size={20} className="text-green-500" />
                <div>
                  <div className="text-xl font-extrabold text-green-500">{statusCounts.current}</div>
                  <div className="text-xs text-text-muted">Current</div>
                </div>
              </div>
            </Card>
            <Card className="!p-4 cursor-pointer" onClick={() => setStatusFilter('needs-review')}>
              <div className="flex items-center gap-3">
                <Clock size={20} className="text-amber-500" />
                <div>
                  <div className="text-xl font-extrabold text-amber-500">{statusCounts['needs-review']}</div>
                  <div className="text-xs text-text-muted">Needs Review</div>
                </div>
              </div>
            </Card>
            <Card className="!p-4 cursor-pointer" onClick={() => setStatusFilter('stale')}>
              <div className="flex items-center gap-3">
                <AlertTriangle size={20} className="text-red-500" />
                <div>
                  <div className="text-xl font-extrabold text-red-500">{statusCounts.stale}</div>
                  <div className="text-xs text-text-muted">Stale</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Filter pills */}
          <div className="flex gap-2">
            {(['all', 'stale', 'needs-review', 'current'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  statusFilter === s
                    ? 'bg-brand-blue text-white'
                    : 'bg-bg-surface text-text-secondary hover:bg-bg-hover'
                }`}
              >
                {s === 'all' ? 'All' : STATUS_CONFIG[s].label}
              </button>
            ))}
          </div>

          {/* Module list */}
          <div className="space-y-2">
            {filtered.map((mod) => {
              const cfg = STATUS_CONFIG[mod.status];
              return (
                <div
                  key={mod.moduleId}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl bg-bg-surface/50 border border-white/[0.04]"
                >
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0"
                    style={{ backgroundColor: cfg.bg, color: cfg.color }}
                  >
                    {cfg.label}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{mod.title}</p>
                    <p className="text-xs text-text-muted">
                      {mod.trackTitle} · {mod.contentType}
                      {mod.lastReviewed && ` · Last reviewed ${new Date(mod.lastReviewed).toLocaleDateString()}`}
                    </p>
                  </div>
                  <button
                    onClick={() => markReviewed(mod.moduleId)}
                    disabled={marking === mod.moduleId}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors disabled:opacity-50 shrink-0"
                  >
                    {marking === mod.moduleId ? 'Saving...' : 'Mark Reviewed'}
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}

      {activeTab === 'glossary' && (
        <div className="space-y-3">
          <p className="text-xs text-text-muted">
            {GLOSSARY_TERMS.length} terms · Click a definition to edit (changes are local to this session)
          </p>
          {GLOSSARY_TERMS.map((term) => {
            const catConfig = GLOSSARY_CATEGORIES[term.category as GlossaryCategory];
            return (
              <div
                key={term.term}
                className="flex items-start gap-4 px-4 py-3 rounded-xl bg-bg-surface/50 border border-white/[0.04]"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xs font-bold text-text-accent font-mono">{term.term}</h3>
                    <span
                      className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                      style={{ backgroundColor: `${catConfig.color}20`, color: catConfig.color }}
                    >
                      {catConfig.label}
                    </span>
                  </div>
                  {editingTerm === term.term ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editDef}
                        onChange={(e) => setEditDef(e.target.value)}
                        className="flex-1 bg-bg-primary border border-border rounded px-2 py-1 text-xs text-text-primary"
                        autoFocus
                      />
                      <button
                        onClick={() => setEditingTerm(null)}
                        className="px-2 py-1 text-xs text-green-500 hover:bg-green-500/10 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => { setEditingTerm(null); setEditDef(''); }}
                        className="px-2 py-1 text-xs text-text-muted hover:bg-bg-hover rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <p
                      className="text-xs text-text-muted leading-relaxed cursor-pointer hover:text-text-primary transition-colors"
                      onClick={() => { setEditingTerm(term.term); setEditDef(term.definition); }}
                    >
                      {term.definition}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
