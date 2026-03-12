import { describe, it, expect, vi } from 'vitest';
import { downloadCSV } from '@/lib/utils/csv-export';

describe('CSV Export', () => {
  it('should trigger a download when called', () => {
    const clickSpy = vi.fn();
    const origCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      const el = origCreateElement(tag);
      if (tag === 'a') {
        el.click = clickSpy;
      }
      return el;
    });

    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock');
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});

    downloadCSV(
      ['Name', 'Score'],
      [['Alice', '95'], ['Bob', '87']],
      'test-export'
    );

    expect(clickSpy).toHaveBeenCalled();

    vi.restoreAllMocks();
  });

  it('should be a callable function', () => {
    expect(typeof downloadCSV).toBe('function');
  });
});
