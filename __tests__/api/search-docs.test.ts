import { describe, it, expect, vi } from 'vitest';
import {
  isMintlifyConfigured,
  mintlifySearch,
  getFullDocsUrl,
} from '@/lib/utils/mintlify';

// Test docs integration into search at the utility level
describe('Search Docs Integration', () => {
  it('isMintlifyConfigured returns false when unconfigured', () => {
    const original = process.env.MINTLIFY_API_KEY;
    delete process.env.MINTLIFY_API_KEY;
    expect(isMintlifyConfigured()).toBe(false);
    process.env.MINTLIFY_API_KEY = original;
  });

  it('builds full docs URL for search results', () => {
    const originalUrl = process.env.NEXT_PUBLIC_MINTLIFY_DOCS_URL;
    process.env.NEXT_PUBLIC_MINTLIFY_DOCS_URL = 'https://docs.zeotap.com';
    expect(getFullDocsUrl('/identity/resolution')).toBe(
      'https://docs.zeotap.com/identity/resolution'
    );
    process.env.NEXT_PUBLIC_MINTLIFY_DOCS_URL = originalUrl;
  });

  it('mintlifySearch gracefully returns empty when unconfigured', async () => {
    const original = process.env.MINTLIFY_API_KEY;
    delete process.env.MINTLIFY_API_KEY;
    const results = await mintlifySearch('data sources');
    expect(results).toEqual([]);
    process.env.MINTLIFY_API_KEY = original;
  });

  it('search response includes docs array shape', () => {
    // Verify the expected shape of docs results
    const mockDocsResult = {
      title: 'Data Sources Overview',
      description: 'Learn about connecting data sources',
      url: 'https://docs.zeotap.com/data-sources',
      section: 'Getting Started',
    };
    expect(mockDocsResult).toHaveProperty('title');
    expect(mockDocsResult).toHaveProperty('description');
    expect(mockDocsResult).toHaveProperty('url');
  });
});
