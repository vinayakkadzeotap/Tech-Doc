'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';

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
  const router = useRouter();

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults({ modules: [], glossary: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data);
      } catch {
        // silently fail
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
    >
      <div className="w-full max-w-xl bg-bg-elevated border border-border rounded-2xl shadow-modal animate-slide-up overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
          <Search size={18} className="text-text-muted flex-shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search modules, glossary terms..."
            className="flex-1 bg-transparent text-sm text-text-primary placeholder-text-muted outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-text-muted hover:text-text-primary">
              <X size={16} />
            </button>
          )}
          <kbd className="hidden sm:inline text-[10px] text-text-muted bg-bg-surface px-1.5 py-0.5 rounded border border-border-subtle">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto">
          {loading && (
            <div className="px-5 py-8 text-center text-sm text-text-muted">Searching...</div>
          )}

          {!loading && query.length >= 2 && !hasResults && (
            <div className="px-5 py-8 text-center text-sm text-text-muted">
              No results found for &ldquo;{query}&rdquo;
            </div>
          )}

          {!loading && results.modules.length > 0 && (
            <div className="p-3">
              <div className="px-2 py-1.5 text-[10px] font-bold text-text-muted uppercase tracking-wider">
                Modules
              </div>
              {results.modules.map((m) => (
                <button
                  key={`${m.trackId}/${m.moduleId}`}
                  onClick={() => navigate(`/learn/${m.trackId}/${m.moduleId}`)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-bg-hover transition-colors"
                >
                  <span className="text-lg">{m.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-text-primary truncate">{m.title}</div>
                    <div className="text-[11px] text-text-muted truncate">{m.trackTitle} &middot; {m.contentType}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {!loading && results.glossary.length > 0 && (
            <div className="p-3 border-t border-border-subtle">
              <div className="px-2 py-1.5 text-[10px] font-bold text-text-muted uppercase tracking-wider">
                Glossary
              </div>
              {results.glossary.map((g) => (
                <button
                  key={g.term}
                  onClick={() => navigate('/glossary')}
                  className="w-full flex items-start gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-bg-hover transition-colors"
                >
                  <span className="text-lg">📖</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-text-accent font-mono">{g.term}</div>
                    <div className="text-[11px] text-text-muted truncate">{g.definition}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {!loading && !query && (
            <div className="px-5 py-8 text-center text-sm text-text-muted">
              Type to search across all modules and glossary terms
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
