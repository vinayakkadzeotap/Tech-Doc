'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Loader2, BookMarked, ExternalLink } from 'lucide-react';
import Icon from '@/components/ui/Icon';

type SearchFilter = 'all' | 'modules' | 'glossary' | 'docs';

interface SearchResult {
  modules: Array<{
    trackId: string;
    trackTitle: string;
    moduleId: string;
    title: string;
    description: string;
    icon: string;
    contentType: string;
  }>;
  glossary: Array<{
    term: string;
    definition: string;
  }>;
  docs: Array<{
    title: string;
    description: string;
    url: string;
    section?: string;
  }>;
  suggestions: string[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult>({ modules: [], glossary: [], docs: [], suggestions: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<SearchFilter>('all');
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Store the element that had focus before modal opened
  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
      setTimeout(() => inputRef.current?.focus(), 50);
    }
    return () => {
      if (!isOpen && triggerRef.current) {
        triggerRef.current.focus();
      }
    };
  }, [isOpen]);

  // Total result count for arrow key navigation
  const totalItems = results.modules.length + results.glossary.length + results.docs.length;

  // Reset selection when results change
  useEffect(() => {
    setSelectedIdx(-1);
  }, [results]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (!isOpen) return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIdx((prev) => (prev < totalItems - 1 ? prev + 1 : 0));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIdx((prev) => (prev > 0 ? prev - 1 : totalItems - 1));
      }
      if (e.key === 'Enter' && selectedIdx >= 0) {
        e.preventDefault();
        const btns = resultsRef.current?.querySelectorAll<HTMLButtonElement>('[data-result]');
        if (btns && btns[selectedIdx]) {
          btns[selectedIdx].click();
        }
      }
    },
    [onClose, isOpen, totalItems, selectedIdx]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults({ modules: [], glossary: [], docs: [], suggestions: [] });
      setError(null);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ q: query });
        if (filter !== 'all') params.set('type', filter);
        const res = await fetch(`/api/search?${params}`);
        if (!res.ok) throw new Error('Search failed');
        const data = await res.json();
        setResults({ suggestions: [], ...data });
      } catch {
        setError('Search is temporarily unavailable. Try again.');
        setResults({ modules: [], glossary: [], docs: [], suggestions: [] });
      }
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, filter]);

  const navigate = (href: string) => {
    onClose();
    setQuery('');
    router.push(href);
  };

  if (!isOpen) return null;

  const hasResults = results.modules.length > 0 || results.glossary.length > 0 || results.docs.length > 0;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh] p-4 bg-bg-primary/90 backdrop-blur-md animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      <div className="w-full max-w-xl bg-bg-elevated border border-border rounded-2xl shadow-modal animate-slide-up overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
          {loading ? (
            <Loader2 size={18} className="text-brand-blue flex-shrink-0 animate-spin" />
          ) : (
            <Search size={18} className="text-text-muted flex-shrink-0" />
          )}
          <input
            ref={inputRef}
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search modules, glossary, docs..."
            className="flex-1 bg-transparent text-sm text-text-primary placeholder-text-muted outline-none"
            aria-label="Search query"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-text-muted hover:text-text-primary p-1"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
          <kbd className="hidden sm:inline text-[10px] text-text-muted bg-bg-surface px-1.5 py-0.5 rounded border border-border-subtle">
            ESC
          </kbd>
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-2 px-5 py-2 border-b border-border-subtle">
          {(['all', 'modules', 'glossary', 'docs'] as SearchFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filter === f
                  ? 'bg-brand-blue text-white'
                  : 'bg-bg-surface text-text-muted hover:bg-bg-hover'
              }`}
            >
              {f === 'all' ? 'All' : f === 'modules' ? 'Modules' : f === 'glossary' ? 'Glossary' : 'Docs'}
            </button>
          ))}
        </div>

        {/* Screen reader announcement */}
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {!loading && query.length >= 2 && (
            hasResults
              ? `${results.modules.length} modules, ${results.glossary.length} glossary, and ${results.docs.length} docs results found`
              : `No results found for ${query}`
          )}
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto" ref={resultsRef}>
          {/* Error state */}
          {error && (
            <div className="px-5 py-6 text-center">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {!error && !loading && query.length >= 2 && !hasResults && (
            <div className="px-5 py-8 text-center">
              <Search size={24} className="text-text-muted mx-auto mb-2 opacity-40" />
              <p className="text-sm text-text-muted">
                No results found for &ldquo;{query}&rdquo;
              </p>
              <p className="text-xs text-text-muted mt-1">Try different keywords</p>
            </div>
          )}

          {/* Did you mean? suggestions */}
          {!error && !loading && results.suggestions && results.suggestions.length > 0 && (
            <div className="px-5 py-3 border-t border-border-subtle">
              <p className="text-xs text-text-muted mb-2">Did you mean?</p>
              <div className="flex flex-wrap gap-2">
                {results.suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => setQuery(s)}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-bg-surface text-brand-blue hover:bg-brand-blue/10 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!error && !loading && results.modules.length > 0 && (
            <div className="p-3">
              <div className="px-2 py-1.5 text-[10px] font-bold text-text-muted uppercase tracking-wider">
                Modules ({results.modules.length})
              </div>
              {results.modules.map((m, i) => (
                <button
                  key={`${m.trackId}/${m.moduleId}`}
                  data-result
                  onClick={() => navigate(`/learn/${m.trackId}/${m.moduleId}`)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                    selectedIdx === i ? 'bg-brand-blue/10 ring-1 ring-brand-blue/30' : 'hover:bg-bg-hover'
                  }`}
                >
                  <Icon name={m.icon} size={18} className="text-text-muted flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-text-primary truncate">{m.title}</div>
                    <div className="text-[11px] text-text-muted truncate">{m.trackTitle} &middot; {m.contentType}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {!error && !loading && results.glossary.length > 0 && (
            <div className="p-3 border-t border-border-subtle">
              <div className="px-2 py-1.5 text-[10px] font-bold text-text-muted uppercase tracking-wider">
                Glossary ({results.glossary.length})
              </div>
              {results.glossary.map((g, i) => (
                <button
                  key={g.term}
                  data-result
                  onClick={() => navigate('/glossary')}
                  className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                    selectedIdx === results.modules.length + i ? 'bg-brand-blue/10 ring-1 ring-brand-blue/30' : 'hover:bg-bg-hover'
                  }`}
                >
                  <BookMarked size={18} className="text-text-muted flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-text-accent font-mono">{g.term}</div>
                    <div className="text-[11px] text-text-muted truncate">{g.definition}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {!error && !loading && results.docs.length > 0 && (
            <div className="p-3 border-t border-border-subtle">
              <div className="px-2 py-1.5 text-[10px] font-bold text-text-muted uppercase tracking-wider">
                Zeotap Docs ({results.docs.length})
              </div>
              {results.docs.map((d, i) => (
                <a
                  key={d.url}
                  href={d.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-result
                  className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                    selectedIdx === results.modules.length + results.glossary.length + i
                      ? 'bg-brand-blue/10 ring-1 ring-brand-blue/30'
                      : 'hover:bg-bg-hover'
                  }`}
                >
                  <ExternalLink size={18} className="text-brand-cyan flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-text-primary truncate flex items-center gap-2">
                      {d.title}
                      <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20">
                        Zeotap Docs
                      </span>
                    </div>
                    <div className="text-[11px] text-text-muted truncate">
                      {d.section ? `${d.section} — ` : ''}{d.description}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}

          {!error && !loading && !query && (
            <div className="px-5 py-8 text-center">
              <Search size={24} className="text-text-muted mx-auto mb-2 opacity-40" />
              <p className="text-sm text-text-muted">
                Type to search across modules, glossary, and Zeotap docs
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
