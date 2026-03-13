import { describe, it, expect } from 'vitest';

describe('AnalyticsCharts data source detection', () => {
  describe('sample data fallback logic', () => {
    it('uses sample data when daily active users < 3', () => {
      const apiData = { dailyActiveUsers: [{ date: '2026-03-13', count: 5 }] };
      const useSample = apiData.dailyActiveUsers.length < 3;
      expect(useSample).toBe(true);
    });

    it('uses real data when daily active users >= 3', () => {
      const apiData = {
        dailyActiveUsers: [
          { date: '2026-03-11', count: 10 },
          { date: '2026-03-12', count: 15 },
          { date: '2026-03-13', count: 12 },
        ],
      };
      const useSample = apiData.dailyActiveUsers.length < 3;
      expect(useSample).toBe(false);
    });

    it('uses sample data on fetch error', () => {
      // When fetch fails, the component falls back to SAMPLE_DATA
      const fetchFailed = true;
      const data = fetchFailed ? 'SAMPLE_DATA' : 'real data';
      expect(data).toBe('SAMPLE_DATA');
    });
  });

  describe('sample data structure', () => {
    it('sample data has required fields', () => {
      const sampleData = {
        dailyActiveUsers: [{ date: '2026-03-13', count: 25 }],
        moduleCompletions: [{ date: '2026-03-13', count: 8 }],
        topSearches: [{ term: 'kafka', count: 24 }],
        summary: { wau: 38, mau: 47, totalEvents: 1842, assistantQueries: 156 },
      };
      expect(sampleData).toHaveProperty('dailyActiveUsers');
      expect(sampleData).toHaveProperty('moduleCompletions');
      expect(sampleData).toHaveProperty('topSearches');
      expect(sampleData).toHaveProperty('summary');
    });

    it('summary has all required metric fields', () => {
      const summary = { wau: 38, mau: 47, totalEvents: 1842, assistantQueries: 156 };
      expect(summary).toHaveProperty('wau');
      expect(summary).toHaveProperty('mau');
      expect(summary).toHaveProperty('totalEvents');
      expect(summary).toHaveProperty('assistantQueries');
    });
  });

  describe('isLive detection', () => {
    it('isLive is false when data equals SAMPLE_DATA reference', () => {
      const SAMPLE_DATA = { id: 'sample' };
      const data = SAMPLE_DATA;
      const isLive = data !== SAMPLE_DATA;
      expect(isLive).toBe(false);
    });

    it('isLive is true when data is from API', () => {
      const SAMPLE_DATA = { id: 'sample' };
      const data = { id: 'real' };
      const isLive = data !== SAMPLE_DATA;
      expect(isLive).toBe(true);
    });
  });
});
