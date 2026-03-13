import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  isMintlifyConfigured,
  getDocsBaseUrl,
  getFullDocsUrl,
  mintlifySearch,
  clearMintlifyCache,
} from '@/lib/utils/mintlify';

describe('Mintlify Client', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    clearMintlifyCache();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('isMintlifyConfigured', () => {
    it('returns false when no env vars set', () => {
      delete process.env.MINTLIFY_API_KEY;
      delete process.env.NEXT_PUBLIC_MINTLIFY_DOCS_URL;
      expect(isMintlifyConfigured()).toBe(false);
    });

    it('returns false when only API key set', () => {
      process.env.MINTLIFY_API_KEY = 'mint_dsc_test';
      delete process.env.NEXT_PUBLIC_MINTLIFY_DOCS_URL;
      expect(isMintlifyConfigured()).toBe(false);
    });

    it('returns true when both env vars set', () => {
      process.env.MINTLIFY_API_KEY = 'mint_dsc_test';
      process.env.NEXT_PUBLIC_MINTLIFY_DOCS_URL = 'https://docs.zeotap.com';
      expect(isMintlifyConfigured()).toBe(true);
    });
  });

  describe('getDocsBaseUrl', () => {
    it('returns configured URL', () => {
      process.env.NEXT_PUBLIC_MINTLIFY_DOCS_URL = 'https://docs.zeotap.com';
      expect(getDocsBaseUrl()).toBe('https://docs.zeotap.com');
    });

    it('returns default when not configured', () => {
      delete process.env.NEXT_PUBLIC_MINTLIFY_DOCS_URL;
      expect(getDocsBaseUrl()).toBe('https://docs.zeotap.com');
    });
  });

  describe('getFullDocsUrl', () => {
    it('builds full URL from relative path', () => {
      process.env.NEXT_PUBLIC_MINTLIFY_DOCS_URL = 'https://docs.zeotap.com';
      expect(getFullDocsUrl('/getting-started')).toBe('https://docs.zeotap.com/getting-started');
    });

    it('handles path without leading slash', () => {
      process.env.NEXT_PUBLIC_MINTLIFY_DOCS_URL = 'https://docs.zeotap.com';
      expect(getFullDocsUrl('getting-started')).toBe('https://docs.zeotap.com/getting-started');
    });

    it('handles trailing slash on base URL', () => {
      process.env.NEXT_PUBLIC_MINTLIFY_DOCS_URL = 'https://docs.zeotap.com/';
      expect(getFullDocsUrl('/intro')).toBe('https://docs.zeotap.com/intro');
    });
  });

  describe('mintlifySearch', () => {
    it('returns empty array when not configured', async () => {
      delete process.env.MINTLIFY_API_KEY;
      const results = await mintlifySearch('test query');
      expect(results).toEqual([]);
    });

    it('returns empty array on fetch error', async () => {
      process.env.MINTLIFY_API_KEY = 'mint_dsc_test';
      process.env.NEXT_PUBLIC_MINTLIFY_DOCS_URL = 'https://docs.zeotap.com';
      vi.spyOn(global, 'fetch').mockRejectedValue(new Error('Network error'));
      const results = await mintlifySearch('test query');
      expect(results).toEqual([]);
    });

    it('returns empty array on non-ok response', async () => {
      process.env.MINTLIFY_API_KEY = 'mint_dsc_test';
      process.env.NEXT_PUBLIC_MINTLIFY_DOCS_URL = 'https://docs.zeotap.com';
      vi.spyOn(global, 'fetch').mockResolvedValue(
        new Response('Unauthorized', { status: 401 })
      );
      const results = await mintlifySearch('test query');
      expect(results).toEqual([]);
    });

    it('returns parsed results on success', async () => {
      process.env.MINTLIFY_API_KEY = 'mint_dsc_test';
      process.env.NEXT_PUBLIC_MINTLIFY_DOCS_URL = 'https://docs.zeotap.com';
      vi.spyOn(global, 'fetch').mockResolvedValue(
        new Response(
          JSON.stringify({
            hits: [
              {
                title: 'Identity Resolution',
                description: 'How identity resolution works',
                url: '/identity/resolution',
                section: 'Getting Started',
              },
            ],
          }),
          { status: 200 }
        )
      );
      const results = await mintlifySearch('identity');
      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('Identity Resolution');
      expect(results[0].url).toBe('/identity/resolution');
    });

    it('uses cache on repeated queries', async () => {
      process.env.MINTLIFY_API_KEY = 'mint_dsc_test';
      process.env.NEXT_PUBLIC_MINTLIFY_DOCS_URL = 'https://docs.zeotap.com';
      const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(
        new Response(JSON.stringify({ hits: [{ title: 'Test', url: '/test' }] }), { status: 200 })
      );
      await mintlifySearch('cached query');
      await mintlifySearch('cached query');
      // fetch should only be called once due to caching
      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });
  });
});
