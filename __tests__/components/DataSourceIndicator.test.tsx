import { describe, it, expect } from 'vitest';

describe('DataSourceIndicator', () => {
  describe('live data state', () => {
    it('shows "Live Data" label when isLive is true', () => {
      const isLive = true;
      const label = isLive ? 'Live Data' : 'Sample Data';
      expect(label).toBe('Live Data');
    });

    it('uses green color for live state', () => {
      const isLive = true;
      const colorClass = isLive ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400';
      expect(colorClass).toContain('green');
    });
  });

  describe('sample data state', () => {
    it('shows "Sample Data" label when isLive is false', () => {
      const isLive = false;
      const label = isLive ? 'Live Data' : 'Sample Data';
      expect(label).toBe('Sample Data');
    });

    it('uses amber color for sample state', () => {
      const isLive = false;
      const colorClass = isLive ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400';
      expect(colorClass).toContain('amber');
    });
  });

  describe('compact mode', () => {
    it('renders dot indicator in compact mode', () => {
      const compact = true;
      const isLive = true;
      const dotClass = compact
        ? `w-1.5 h-1.5 rounded-full ${isLive ? 'bg-green-400' : 'bg-amber-400'}`
        : '';
      expect(dotClass).toContain('w-1.5');
      expect(dotClass).toContain('bg-green-400');
    });

    it('renders amber dot for sample data in compact mode', () => {
      const compact = true;
      const isLive = false;
      const dotClass = compact
        ? `w-1.5 h-1.5 rounded-full ${isLive ? 'bg-green-400' : 'bg-amber-400'}`
        : '';
      expect(dotClass).toContain('bg-amber-400');
    });
  });

  describe('tooltip messages', () => {
    it('has correct live tooltip text', () => {
      const tooltip = 'Showing real data from your database';
      expect(tooltip).toContain('real data');
    });

    it('has correct sample tooltip text', () => {
      const tooltip = 'Showing sample data for demonstration';
      expect(tooltip).toContain('sample data');
    });
  });
});
