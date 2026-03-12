'use client';

import { useState, useMemo } from 'react';
import Card from '@/components/ui/Card';
import {
  GLOSSARY_TERMS,
  GLOSSARY_CATEGORIES,
  type GlossaryCategory,
  type GlossaryTerm,
} from '@/lib/utils/glossary-data';

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query || query.length < 2) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-brand-blue/30 text-text-primary rounded px-0.5">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export default function GlossaryClient() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<GlossaryCategory | 'all'>('all');
  const [jumpLetter, setJumpLetter] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let terms = [...GLOSSARY_TERMS];
    if (activeCategory !== 'all') {
      terms = terms.filter((t) => t.category === activeCategory);
    }
    if (search.length >= 2) {
      const q = search.toLowerCase();
      terms = terms.filter(
        (t) => t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q)
      );
    }
    return terms.sort((a, b) => a.term.localeCompare(b.term));
  }, [search, activeCategory]);

  // Group by first letter
  const grouped = useMemo(() => {
    const map = new Map<string, GlossaryTerm[]>();
    for (const term of filtered) {
      const letter = term.term[0].toUpperCase();
      if (!map.has(letter)) map.set(letter, []);
      map.get(letter)!.push(term);
    }
    return map;
  }, [filtered]);

  // Available letters from all terms (not filtered)
  const allLetters = useMemo(() => {
    const set = new Set<string>();
    for (const t of GLOSSARY_TERMS) set.add(t.term[0].toUpperCase());
    return Array.from(set).sort();
  }, []);

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search terms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-bg-secondary border border-border-primary rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue"
          aria-label="Search glossary terms"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary text-xs"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            activeCategory === 'all'
              ? 'bg-brand-blue text-white'
              : 'bg-bg-secondary text-text-secondary hover:bg-bg-hover'
          }`}
        >
          All ({GLOSSARY_TERMS.length})
        </button>
        {(Object.entries(GLOSSARY_CATEGORIES) as [GlossaryCategory, { label: string; color: string }][]).map(
          ([key, { label, color }]) => {
            const count = GLOSSARY_TERMS.filter((t) => t.category === key).length;
            return (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  activeCategory === key
                    ? 'text-white'
                    : 'bg-bg-secondary text-text-secondary hover:bg-bg-hover'
                }`}
                style={activeCategory === key ? { backgroundColor: color } : undefined}
              >
                {label} ({count})
              </button>
            );
          }
        )}
      </div>

      {/* A-Z jump bar */}
      <div className="flex flex-wrap gap-1">
        {allLetters.map((letter) => {
          const hasResults = grouped.has(letter);
          return (
            <button
              key={letter}
              onClick={() => {
                if (!hasResults) return;
                setJumpLetter(letter);
                document.getElementById(`glossary-${letter}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className={`w-7 h-7 rounded text-xs font-bold flex items-center justify-center transition-colors ${
                hasResults
                  ? 'bg-bg-secondary text-text-primary hover:bg-brand-blue hover:text-white cursor-pointer'
                  : 'bg-bg-primary text-text-muted/30 cursor-default'
              } ${jumpLetter === letter ? 'ring-2 ring-brand-blue' : ''}`}
              aria-label={`Jump to letter ${letter}`}
              disabled={!hasResults}
            >
              {letter}
            </button>
          );
        })}
      </div>

      {/* Results count */}
      <p className="text-xs text-text-muted" aria-live="polite">
        Showing {filtered.length} of {GLOSSARY_TERMS.length} terms
      </p>

      {/* Terms grouped by letter */}
      {filtered.length === 0 ? (
        <Card className="!p-6 text-center">
          <p className="text-text-muted text-sm">No terms match your search.</p>
        </Card>
      ) : (
        Array.from(grouped.entries()).map(([letter, terms]) => (
          <div key={letter} id={`glossary-${letter}`}>
            <h2 className="text-lg font-extrabold text-text-accent mb-3 sticky top-0 bg-bg-primary py-1 z-10">
              {letter}
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {terms.map((item) => (
                <Card key={item.term} className="!p-4">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3 className="text-xs font-bold text-text-accent font-mono">
                      {highlightMatch(item.term, search)}
                    </h3>
                    <span
                      className="text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0"
                      style={{
                        backgroundColor: `${GLOSSARY_CATEGORIES[item.category].color}20`,
                        color: GLOSSARY_CATEGORIES[item.category].color,
                      }}
                    >
                      {GLOSSARY_CATEGORIES[item.category].label}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed">
                    {highlightMatch(item.definition, search)}
                  </p>
                  {item.relatedTerms && item.relatedTerms.length > 0 && (
                    <div className="mt-2 flex items-center gap-1 flex-wrap">
                      <span className="text-[10px] text-text-muted">See also:</span>
                      {item.relatedTerms.map((rt) => {
                        const exists = GLOSSARY_TERMS.some((t) => t.term === rt);
                        return (
                          <button
                            key={rt}
                            onClick={() => {
                              if (!exists) return;
                              setSearch('');
                              setActiveCategory('all');
                              const letter = rt[0].toUpperCase();
                              setTimeout(() => {
                                const el = document.getElementById(`glossary-${letter}`);
                                el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                setJumpLetter(letter);
                              }, 50);
                            }}
                            className={`text-[10px] px-1.5 py-0.5 rounded ${
                              exists
                                ? 'text-brand-blue bg-brand-blue/10 hover:bg-brand-blue/20 cursor-pointer'
                                : 'text-text-muted bg-bg-surface cursor-default'
                            } transition-colors`}
                          >
                            {rt}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
