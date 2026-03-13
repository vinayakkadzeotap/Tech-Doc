'use client';

import { useState, useEffect } from 'react';
import { BookOpen, ExternalLink, ChevronDown, Loader2 } from 'lucide-react';
import { getDomain } from '@/lib/utils/codebase';

interface DocsResult {
  title: string;
  description: string;
  url: string;
}

interface DocsPanelProps {
  domainId: string;
}

export default function DocsPanel({ domainId }: DocsPanelProps) {
  const [results, setResults] = useState<DocsResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const docsUrl = process.env.NEXT_PUBLIC_MINTLIFY_DOCS_URL;

  useEffect(() => {
    if (!docsUrl) return;

    // Build domain-specific search query
    const domain = getDomain(domainId);
    if (!domain) return;

    const searchQuery = domain.title;
    setLoading(true);

    fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&type=docs`)
      .then((r) => r.json())
      .then((data) => {
        setResults(data.docs || []);
        setHasSearched(true);
      })
      .catch(() => {
        setHasSearched(true);
      })
      .finally(() => setLoading(false));
  }, [domainId, docsUrl]);

  // Don't render if docs URL not configured or no results after search
  if (!docsUrl) return null;
  if (hasSearched && results.length === 0 && !loading) return null;

  return (
    <div className="mb-8 rounded-xl border border-border bg-bg-surface/30 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-bg-hover/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <BookOpen size={14} className="text-brand-cyan" />
          <h3 className="text-xs font-semibold text-text-primary">
            Related Documentation
          </h3>
          <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20">
            Zeotap Docs
          </span>
          {results.length > 0 && (
            <span className="text-[10px] text-text-muted">({results.length})</span>
          )}
        </div>
        <ChevronDown
          size={14}
          className={`text-text-muted transition-transform duration-200 ${collapsed ? '-rotate-90' : ''}`}
        />
      </button>

      {/* Content */}
      {!collapsed && (
        <div className="px-4 pb-3 space-y-1.5">
          {loading && (
            <div className="flex items-center gap-2 py-2 text-text-muted">
              <Loader2 size={12} className="animate-spin" />
              <span className="text-[10px]">Searching docs...</span>
            </div>
          )}

          {!loading && results.map((doc) => (
            <a
              key={doc.url}
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2 px-3 py-2 rounded-lg hover:bg-bg-hover/50 transition-colors group"
            >
              <ExternalLink size={12} className="flex-shrink-0 mt-0.5 text-text-muted group-hover:text-brand-cyan transition-colors" />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-text-primary group-hover:text-brand-cyan transition-colors truncate">
                  {doc.title}
                </div>
                {doc.description && (
                  <div className="text-[10px] text-text-muted truncate mt-0.5">
                    {doc.description}
                  </div>
                )}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
