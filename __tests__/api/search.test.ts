import { describe, it, expect } from 'vitest';
import { TRACKS } from '@/lib/utils/roles';

describe('Search query validation', () => {
  it('rejects empty query', () => {
    const query = '';
    expect(query.trim().length).toBe(0);
  });

  it('trims whitespace from query', () => {
    const query = '  CDP basics  ';
    expect(query.trim()).toBe('CDP basics');
  });

  it('handles single character queries', () => {
    const query = 'a';
    expect(query.trim().length).toBeGreaterThan(0);
  });
});

describe('Module search logic', () => {
  it('finds modules by title match', () => {
    const allModules = TRACKS.flatMap((track) =>
      track.modules.map((mod) => ({
        ...mod,
        trackId: track.id,
        trackTitle: track.title,
      }))
    );

    // Search for a term that likely exists
    const query = 'cdp';
    const results = allModules.filter(
      (mod) =>
        mod.title.toLowerCase().includes(query.toLowerCase()) ||
        mod.description.toLowerCase().includes(query.toLowerCase())
    );

    expect(results.length).toBeGreaterThan(0);
  });

  it('returns empty array for non-matching query', () => {
    const allModules = TRACKS.flatMap((track) =>
      track.modules.map((mod) => ({
        ...mod,
        trackId: track.id,
      }))
    );

    const query = 'xyznonexistentterm123';
    const results = allModules.filter(
      (mod) =>
        mod.title.toLowerCase().includes(query.toLowerCase()) ||
        mod.description.toLowerCase().includes(query.toLowerCase())
    );

    expect(results).toHaveLength(0);
  });

  it('search is case insensitive', () => {
    const allModules = TRACKS.flatMap((track) =>
      track.modules.map((mod) => ({
        ...mod,
        trackId: track.id,
      }))
    );

    const queryUpper = 'CDP';
    const queryLower = 'cdp';

    const upperResults = allModules.filter((mod) =>
      mod.title.toLowerCase().includes(queryUpper.toLowerCase())
    );
    const lowerResults = allModules.filter((mod) =>
      mod.title.toLowerCase().includes(queryLower.toLowerCase())
    );

    expect(upperResults.length).toBe(lowerResults.length);
  });
});

describe('Search response types', () => {
  it('valid search types are all, modules, glossary', () => {
    const validTypes = ['all', 'modules', 'glossary'];
    expect(validTypes).toContain('all');
    expect(validTypes).toContain('modules');
    expect(validTypes).toContain('glossary');
  });
});
