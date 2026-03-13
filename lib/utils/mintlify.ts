// Mintlify Search API client for Zeotap documentation integration
// Gracefully degrades when MINTLIFY_API_KEY is not configured

import { rateLimit } from './rate-limit';

export interface MintlifySearchResult {
  title: string;
  description: string;
  url: string;        // relative path like /getting-started/data-sources
  section?: string;   // section within the page
  content?: string;   // snippet of matching content
}

interface CacheEntry {
  results: MintlifySearchResult[];
  timestamp: number;
}

// In-memory cache with 5-minute TTL
const searchCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 5 * 60 * 1000;

// Clean up expired cache entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  searchCache.forEach((entry, key) => {
    if (now - entry.timestamp > CACHE_TTL_MS) {
      searchCache.delete(key);
    }
  });
}, CACHE_TTL_MS);

/**
 * Check if Mintlify integration is configured
 */
export function isMintlifyConfigured(): boolean {
  return !!(
    process.env.MINTLIFY_API_KEY &&
    process.env.NEXT_PUBLIC_MINTLIFY_DOCS_URL
  );
}

/**
 * Get the base docs URL (public, available client-side)
 */
export function getDocsBaseUrl(): string {
  return process.env.NEXT_PUBLIC_MINTLIFY_DOCS_URL || 'https://docs.zeotap.com';
}

/**
 * Build full URL for a docs page path
 */
export function getFullDocsUrl(path: string): string {
  const base = getDocsBaseUrl().replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

/**
 * Extract the Mintlify domain slug from the docs URL.
 * e.g., "https://docs.zeotap.com" → "zeotap" (custom domain maps to org slug)
 * Falls back to MINTLIFY_DOMAIN env var if set.
 */
function getMintlifyDomain(): string {
  if (process.env.MINTLIFY_DOMAIN) return process.env.MINTLIFY_DOMAIN;
  // Default to 'zeotap' — the org slug on dashboard.mintlify.com
  return 'zeotap';
}

/**
 * Low-level fetch wrapper for Mintlify Discovery API
 * Uses POST to /discovery/v1/search/{domain}
 */
async function mintlifyFetch(
  body: Record<string, unknown>
): Promise<Response> {
  const apiKey = process.env.MINTLIFY_API_KEY;
  if (!apiKey) {
    throw new Error('MINTLIFY_API_KEY is not configured');
  }

  const domain = getMintlifyDomain();
  const url = `https://api.mintlify.com/discovery/v1/search/${domain}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Search Mintlify documentation
 * Returns empty array if unconfigured or on error (graceful degradation)
 */
export async function mintlifySearch(
  query: string,
  limit: number = 5
): Promise<MintlifySearchResult[]> {
  if (!isMintlifyConfigured()) {
    return [];
  }

  // Rate limit: 30 requests per minute
  const rl = rateLimit('mintlify-search', 30, 60_000);
  if (!rl.success) {
    console.warn('Mintlify search rate limited');
    return [];
  }

  // Check cache
  const cacheKey = `${query.toLowerCase().trim()}:${limit}`;
  const cached = searchCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.results;
  }

  try {
    const response = await mintlifyFetch({
      query,
      pageSize: limit,
    });

    if (!response.ok) {
      console.warn(`Mintlify search failed: ${response.status}`);
      return [];
    }

    const data = await response.json();

    // Normalize response — API returns an array of { content, path, metadata }
    const rawResults = Array.isArray(data) ? data : (data.hits || data.results || []);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const results: MintlifySearchResult[] = rawResults
      .slice(0, limit)
      .map((hit: any) => ({
        title: hit.metadata?.title || hit.title || hit.name || 'Untitled',
        description: hit.metadata?.description || hit.description || '',
        url: hit.path || hit.url || hit.slug || '',
        section: hit.metadata?.href || hit.section || undefined,
        content: hit.content ? hit.content.slice(0, 300) : undefined,
      }));

    // Cache results
    searchCache.set(cacheKey, { results, timestamp: Date.now() });

    return results;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.warn('Mintlify search timed out');
    } else {
      console.warn('Mintlify search error:', error);
    }
    return [];
  }
}

/**
 * Clear the search cache (useful for testing)
 */
export function clearMintlifyCache(): void {
  searchCache.clear();
}
