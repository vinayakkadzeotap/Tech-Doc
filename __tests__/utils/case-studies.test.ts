import { describe, it, expect } from 'vitest';
import { CASE_STUDIES, INDUSTRIES } from '@/lib/utils/case-studies';

describe('Case Studies', () => {
  it('should have at least 5 case studies', () => {
    expect(CASE_STUDIES.length).toBeGreaterThanOrEqual(5);
  });

  it('each case study should have required fields', () => {
    for (const cs of CASE_STUDIES) {
      expect(cs.id).toBeTruthy();
      expect(cs.customer).toBeTruthy();
      expect(cs.industry).toBeTruthy();
      expect(cs.challenge).toBeTruthy();
      expect(cs.solution).toBeTruthy();
      expect(cs.outcome).toBeTruthy();
      expect(cs.metrics.length).toBeGreaterThan(0);
      expect(cs.tags.length).toBeGreaterThan(0);
    }
  });

  it('should have unique case study IDs', () => {
    const ids = CASE_STUDIES.map((cs) => cs.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('INDUSTRIES should match unique industries from case studies', () => {
    const uniqueIndustries = Array.from(new Set(CASE_STUDIES.map((cs) => cs.industry)));
    expect(INDUSTRIES.length).toBe(uniqueIndustries.length);
    for (const ind of uniqueIndustries) {
      expect(INDUSTRIES).toContain(ind);
    }
  });

  it('each metric should have label and value', () => {
    for (const cs of CASE_STUDIES) {
      for (const m of cs.metrics) {
        expect(m.label).toBeTruthy();
        expect(m.value).toBeTruthy();
      }
    }
  });
});
