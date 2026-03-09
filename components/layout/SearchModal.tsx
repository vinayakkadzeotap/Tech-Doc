'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Loader2, BookMarked } from 'lucide-react';
import Icon from '@/components/ui/Icon';

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
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult>({ modules: [], glossary: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

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

  // Handle ⌘K and Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (!isOpen) return; // handled by parent
      }
    },
    [onClose, isOpen]
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
      setResults({ modules: [], glossary: [] });
      setError(null);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error('Search failed');
        const data = await res.json();
        setResults(data);
      } catch {
        setError('Search is temporarily unavailable. Try again.');
        setResults({ modules: [], glossary: [] });
      }
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const navigate = (href: string) => {
    onClose();
    setQuery('');
    router.push(href);
  };

  if (!isOpen) return null;

  const hasResults = results.modules.length > 0 || results.glossary.length > 0;

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
            placeholder="Search modules, glossary terms..."
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

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto">
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

          {!error && !loading && results.modules.length > 0 && (
            <div className="p-3">
              <div className="px-2 py-1.5 text-[10px] font-bold text-text-muted uppercase tracking-wider">
                Modules ({results.modules.length})
              </div>
              {results.modules.map((m) => (
                <button
                  key={`${m.trackId}/${m.moduleId}`}
                  onClick={() => navigate(`/learn/${m.trackId}/${m.moduleId}`)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-bg-hover transition-colors"
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
              {results.glossary.map((g) => (
                <button
                  key={g.term}
                  onClick={() => navigate('/glossary')}
                  className="w-full flex items-start gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-bg-hover transition-colors"
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

          {!error && !loading && !query && (
            <div className="px-5 py-8 text-center">
              <Search size={24} className="text-text-muted mx-auto mb-2 opacity-40" />
              <p className="text-sm text-text-muted">
                Type to search across all modules and glossary terms
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
