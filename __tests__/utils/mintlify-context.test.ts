import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchDocsContext, isDocsAugmentationAvailable } from '@/lib/utils/mintlify-context';
import { clearMintlifyCache } from '@/lib/utils/mintlify';

describe('Mintlify Context', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    clearMintlifyCache();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('isDocsAugmentationAvailable', () => {
    it('returns false when unconfigured', () => {
      delete process.env.MINTLIFY_API_KEY;
      delete process.env.NEXT_PUBLIC_MINTLIFY_DOCS_URL;
      expect(isDocsAugmentationAvailable()).toBe(false);
    });

    it('returns true when configured', () => {
      process.env.MINTLIFY_API_KEY = 'mint_dsc_test';
      process.env.NEXT_PUBLIC_MINTLIFY_DOCS_URL = 'https://docs.zeotap.com';
      expect(isDocsAugmentationAvailable()).toBe(true);
    });
  });

  describe('fetchDocsContext', () => {
    it('returns empty string when unconfigured', async () => {
      delete process.env.MINTLIFY_API_KEY;
      const ctx = await fetchDocsContext('data sources');
      expect(ctx).toBe('');
    });

    it('returns empty string when search returns no results', async () => {
      process.env.MINTLIFY_API_KEY = 'mint_dsc_test';
      process.env.NEXT_PUBLIC_MINTLIFY_DOCS_URL = 'https://docs.zeotap.com';
      vi.spyOn(global, 'fetch').mockResolvedValue(
        new Response(JSON.stringify({ hits: [] }), { status: 200 })
      );
      const ctx = await fetchDocsContext('nonexistent topic');
      expect(ctx).toBe('');
    });

    it('formats docs context with numbered sections', async () => {
      process.env.MINTLIFY_API_KEY = 'mint_dsc_test';
      process.env.NEXT_PUBLIC_MINTLIFY_DOCS_URL = 'https://docs.zeotap.com';
      vi.spyOn(global, 'fetch').mockResolvedValue(
        new Response(
          JSON.stringify({
            hits: [
              { title: 'Data Sources', description: 'Connect your data', url: '/data-sources' },
              { title: 'Identity', description: 'Resolve identities', url: '/identity' },
            ],
          }),
          { status: 200 }
        )
      );
      const ctx = await fetchDocsContext('data');
      expect(ctx).toContain('### 1. Data Sources');
      expect(ctx).toContain('### 2. Identity');
      expect(ctx).toContain('https://docs.zeotap.com/data-sources');
    });

    it('truncates long context to max length', async () => {
      process.env.MINTLIFY_API_KEY = 'mint_dsc_test';
      process.env.NEXT_PUBLIC_MINTLIFY_DOCS_URL = 'https://docs.zeotap.com';
      // mintlifySearch slices content to 300 chars, so use long descriptions instead
      // fetchDocsContext uses content || description, and 3 * 800 = 2400 > 2000
      const longDesc = 'B'.repeat(800);
      vi.spyOn(global, 'fetch').mockResolvedValue(
        new Response(
          JSON.stringify([
            { path: '/doc1', metadata: { title: 'Doc 1', description: longDesc } },
            { path: '/doc2', metadata: { title: 'Doc 2', description: longDesc } },
            { path: '/doc3', metadata: { title: 'Doc 3', description: longDesc } },
          ]),
          { status: 200 }
        )
      );
      const ctx = await fetchDocsContext('test');
      expect(ctx.length).toBeLessThanOrEqual(2100); // 2000 + truncation marker
      expect(ctx).toContain('[...truncated]');
    });

    it('handles fetch errors gracefully', async () => {
      process.env.MINTLIFY_API_KEY = 'mint_dsc_test';
      process.env.NEXT_PUBLIC_MINTLIFY_DOCS_URL = 'https://docs.zeotap.com';
      vi.spyOn(global, 'fetch').mockRejectedValue(new Error('Network error'));
      const ctx = await fetchDocsContext('test');
      expect(ctx).toBe('');
    });
  });
});
