import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TRACKS } from '@/lib/utils/roles';
import {
  getLinkedModuleIds,
  getTotalDocsLinkCount,
  MODULE_DOCS_MAP,
} from '@/lib/utils/docs-links';
import { isMintlifyConfigured } from '@/lib/utils/mintlify';

describe('Docs Health', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('coverage calculation', () => {
    it('calculates module coverage correctly', () => {
      const allModuleIds = TRACKS.flatMap((t) => t.modules.map((m) => m.id));
      const linkedModuleIds = getLinkedModuleIds();
      const coveragePercent = Math.round((linkedModuleIds.length / allModuleIds.length) * 100);

      expect(coveragePercent).toBeGreaterThan(0);
      expect(coveragePercent).toBeLessThanOrEqual(100);
      expect(allModuleIds.length).toBeGreaterThan(linkedModuleIds.length); // not 100% coverage
    });

    it('identifies unlinked modules', () => {
      const linkedSet = new Set(getLinkedModuleIds());
      const unlinked = TRACKS.flatMap((t) =>
        t.modules.filter((m) => !linkedSet.has(m.id))
      );
      expect(unlinked.length).toBeGreaterThan(0);
    });

    it('counts total docs links', () => {
      const count = getTotalDocsLinkCount();
      expect(count).toBeGreaterThan(20); // we mapped ~40 doc links
    });
  });

  describe('configuration check', () => {
    it('returns false when not configured', () => {
      delete process.env.MINTLIFY_API_KEY;
      delete process.env.NEXT_PUBLIC_MINTLIFY_DOCS_URL;
      expect(isMintlifyConfigured()).toBe(false);
    });

    it('returns true when configured', () => {
      process.env.MINTLIFY_API_KEY = 'mint_dsc_test';
      process.env.NEXT_PUBLIC_MINTLIFY_DOCS_URL = 'https://docs.zeotap.com';
      expect(isMintlifyConfigured()).toBe(true);
    });
  });

  describe('MODULE_DOCS_MAP structure', () => {
    it('all paths start with /', () => {
      Object.values(MODULE_DOCS_MAP).forEach((links) => {
        links.forEach((link) => {
          expect(link.path).toMatch(/^\//);
        });
      });
    });

    it('all mapped module IDs exist in TRACKS', () => {
      const allModuleIds = new Set(TRACKS.flatMap((t) => t.modules.map((m) => m.id)));
      const linkedIds = getLinkedModuleIds();
      linkedIds.forEach((id) => {
        expect(allModuleIds.has(id)).toBe(true);
      });
    });
  });
});
