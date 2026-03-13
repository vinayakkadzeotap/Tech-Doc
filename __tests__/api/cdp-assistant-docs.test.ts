import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchDocsContext, isDocsAugmentationAvailable } from '@/lib/utils/mintlify-context';
import { clearMintlifyCache } from '@/lib/utils/mintlify';

describe('CDP Assistant Docs Integration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    clearMintlifyCache();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('docs context is injected when Mintlify returns results', async () => {
    process.env.MINTLIFY_API_KEY = 'mint_dsc_test';
    process.env.NEXT_PUBLIC_MINTLIFY_DOCS_URL = 'https://docs.zeotap.com';
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          hits: [{ title: 'Data Sources', description: 'How to set up', url: '/data-sources' }],
        }),
        { status: 200 }
      )
    );

    const context = await fetchDocsContext('How do I set up data sources?');
    expect(context).toContain('Data Sources');
    expect(context).toContain('https://docs.zeotap.com/data-sources');
  });

  it('docs context is empty when Mintlify is not configured', async () => {
    delete process.env.MINTLIFY_API_KEY;
    const context = await fetchDocsContext('data sources');
    expect(context).toBe('');
    expect(isDocsAugmentationAvailable()).toBe(false);
  });

  it('docs context is empty when Mintlify search fails', async () => {
    process.env.MINTLIFY_API_KEY = 'mint_dsc_test';
    process.env.NEXT_PUBLIC_MINTLIFY_DOCS_URL = 'https://docs.zeotap.com';
    vi.spyOn(global, 'fetch').mockRejectedValue(new Error('Timeout'));
    const context = await fetchDocsContext('test query');
    expect(context).toBe('');
  });

  it('context format is suitable for system prompt injection', async () => {
    process.env.MINTLIFY_API_KEY = 'mint_dsc_test';
    process.env.NEXT_PUBLIC_MINTLIFY_DOCS_URL = 'https://docs.zeotap.com';
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          hits: [
            { title: 'Identity Resolution', description: 'Unify customer profiles', url: '/identity' },
          ],
        }),
        { status: 200 }
      )
    );

    const context = await fetchDocsContext('identity resolution');
    // Should be formatted with markdown headers and source URLs
    expect(context).toMatch(/^### 1\./);
    expect(context).toContain('Source:');
  });
});
