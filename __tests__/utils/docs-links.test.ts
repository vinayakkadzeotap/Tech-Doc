import { describe, it, expect } from 'vitest';
import {
  MODULE_DOCS_MAP,
  getDocsLinksForModule,
  getModuleDocsUrls,
  getLinkedModuleIds,
  getTotalDocsLinkCount,
} from '@/lib/utils/docs-links';

describe('Docs Links', () => {
  describe('MODULE_DOCS_MAP', () => {
    it('has mappings for engineering modules', () => {
      expect(MODULE_DOCS_MAP['platform-overview']).toBeDefined();
      expect(MODULE_DOCS_MAP['identity-resolution']).toBeDefined();
      expect(MODULE_DOCS_MAP['data-collection']).toBeDefined();
    });

    it('has mappings for product modules', () => {
      expect(MODULE_DOCS_MAP['audience-builder']).toBeDefined();
      expect(MODULE_DOCS_MAP['unity-dashboard']).toBeDefined();
    });

    it('each link has required fields', () => {
      Object.entries(MODULE_DOCS_MAP).forEach(([moduleId, links]) => {
        links.forEach((link) => {
          expect(link.title).toBeTruthy();
          expect(link.path).toBeTruthy();
          expect(link.path.startsWith('/')).toBe(true);
        });
      });
    });
  });

  describe('getDocsLinksForModule', () => {
    it('returns links for mapped module', () => {
      const links = getDocsLinksForModule('identity-resolution');
      expect(links.length).toBeGreaterThan(0);
      expect(links[0].title).toBeTruthy();
    });

    it('returns empty array for unmapped module', () => {
      const links = getDocsLinksForModule('nonexistent-module');
      expect(links).toEqual([]);
    });
  });

  describe('getModuleDocsUrls', () => {
    it('builds full URLs for module docs', () => {
      const originalUrl = process.env.NEXT_PUBLIC_MINTLIFY_DOCS_URL;
      process.env.NEXT_PUBLIC_MINTLIFY_DOCS_URL = 'https://docs.zeotap.com';
      const urls = getModuleDocsUrls('identity-resolution');
      expect(urls.length).toBeGreaterThan(0);
      expect(urls[0].fullUrl).toContain('https://docs.zeotap.com');
      process.env.NEXT_PUBLIC_MINTLIFY_DOCS_URL = originalUrl;
    });

    it('returns empty array for unmapped module', () => {
      const urls = getModuleDocsUrls('no-such-module');
      expect(urls).toEqual([]);
    });
  });

  describe('getLinkedModuleIds', () => {
    it('returns array of module IDs', () => {
      const ids = getLinkedModuleIds();
      expect(ids.length).toBeGreaterThan(10);
      expect(ids).toContain('identity-resolution');
      expect(ids).toContain('audience-builder');
    });
  });

  describe('getTotalDocsLinkCount', () => {
    it('returns positive count', () => {
      const count = getTotalDocsLinkCount();
      expect(count).toBeGreaterThan(20);
    });
  });
});
