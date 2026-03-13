export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { TRACKS } from '@/lib/utils/roles';
import { GLOSSARY_TERMS } from '@/lib/utils/glossary-data';
import { trackServerEvent, EVENTS } from '@/lib/utils/analytics';
import { mintlifySearch, isMintlifyConfigured, getFullDocsUrl } from '@/lib/utils/mintlify';

// Levenshtein distance for fuzzy matching
function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return dp[m][n];
}

// Build searchable corpus for suggestions
const SEARCHABLE_TERMS = [
  ...GLOSSARY_TERMS.map((t) => t.term.toLowerCase()),
  ...TRACKS.flatMap((t) => t.modules.map((m) => m.title.toLowerCase())),
  ...TRACKS.map((t) => t.title.toLowerCase()),
];

function findSuggestions(query: string): string[] {
  const q = query.toLowerCase();
  const scored = SEARCHABLE_TERMS
    .map((term) => ({ term, dist: levenshtein(q, term.length > q.length + 3 ? term.slice(0, q.length + 3) : term) }))
    .filter(({ dist, term }) => dist <= Math.max(2, Math.floor(term.length * 0.4)))
    .sort((a, b) => a.dist - b.dist);

  // Deduplicate and return top 3
  const seen = new Set<string>();
  const results: string[] = [];
  for (const { term } of scored) {
    if (!seen.has(term) && term !== q) {
      seen.add(term);
      results.push(term);
      if (results.length >= 3) break;
    }
  }
  return results;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get('q') || '').toLowerCase().trim();
    const typeFilter = searchParams.get('type') || 'all'; // 'all' | 'modules' | 'glossary' | 'docs'

    if (!q || q.length < 2) {
      return NextResponse.json({ modules: [], glossary: [], docs: [], suggestions: [] });
    }

    // Search modules
    const moduleResults: Array<{
      trackId: string;
      trackTitle: string;
      moduleId: string;
      title: string;
      description: string;
      icon: string;
      contentType: string;
    }> = [];

    if (typeFilter === 'all' || typeFilter === 'modules') {
      for (const track of TRACKS) {
        for (const mod of track.modules) {
          if (
            mod.title.toLowerCase().includes(q) ||
            mod.description.toLowerCase().includes(q)
          ) {
            moduleResults.push({
              trackId: track.id,
              trackTitle: track.title,
              moduleId: mod.id,
              title: mod.title,
              description: mod.description,
              icon: mod.icon,
              contentType: mod.contentType,
            });
          }
        }
      }
    }

    // Search glossary (all 43+ terms)
    let glossaryResults: Array<{ term: string; definition: string }> = [];
    if (typeFilter === 'all' || typeFilter === 'glossary') {
      glossaryResults = GLOSSARY_TERMS.filter(
        (t) =>
          t.term.toLowerCase().includes(q) ||
          t.definition.toLowerCase().includes(q)
      ).map((t) => ({ term: t.term, definition: t.definition }));
    }

    // Search Mintlify documentation (if configured)
    let docsResults: Array<{
      title: string;
      description: string;
      url: string;
      section?: string;
    }> = [];
    if ((typeFilter === 'all' || typeFilter === 'docs') && isMintlifyConfigured()) {
      const mintlifyResults = await mintlifySearch(q, 5);
      docsResults = mintlifyResults.map((r) => ({
        title: r.title,
        description: r.description || r.content || '',
        url: getFullDocsUrl(r.url),
        section: r.section,
      }));
    }

    // Generate "did you mean?" suggestions if few results
    const totalResults = moduleResults.length + glossaryResults.length + docsResults.length;
    const suggestions = totalResults < 3 ? findSuggestions(q) : [];

    // Track search event
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      trackServerEvent(supabase, user.id, EVENTS.SEARCH, {
        query: q,
        type_filter: typeFilter,
        module_results: moduleResults.length,
        glossary_results: glossaryResults.length,
        docs_results: docsResults.length,
      });
    }

    const response = NextResponse.json({
      modules: moduleResults.slice(0, 10),
      glossary: glossaryResults.slice(0, 5),
      docs: docsResults.slice(0, 5),
      suggestions,
    });
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    return response;
  } catch (error) {
    console.error('GET /api/search error:', error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
