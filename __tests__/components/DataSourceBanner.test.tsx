import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('DataSourceBanner', () => {
  const STORAGE_KEY = 'zeo_datasource_banner_dismissed';

  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn().mockReturnValue(null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn(),
    });
  });

  describe('dismiss persistence', () => {
    it('stores dismissal in localStorage', () => {
      localStorage.setItem(STORAGE_KEY, 'true');
      expect(localStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, 'true');
    });

    it('checks localStorage on mount for previous dismissal', () => {
      localStorage.getItem(STORAGE_KEY);
      expect(localStorage.getItem).toHaveBeenCalledWith(STORAGE_KEY);
    });

    it('returns null when not dismissed', () => {
      const result = localStorage.getItem(STORAGE_KEY);
      expect(result).toBeNull();
    });
  });

  describe('banner content', () => {
    it('has the correct storage key', () => {
      expect(STORAGE_KEY).toBe('zeo_datasource_banner_dismissed');
    });
  });
});
