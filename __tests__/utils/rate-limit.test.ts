import { describe, it, expect } from 'vitest';
import { rateLimit } from '@/lib/utils/rate-limit';

describe('rateLimit', () => {
  it('allows requests under the limit', () => {
    const id = `test-allow-${Date.now()}`;
    const result = rateLimit(id, 5, 60_000);
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it('tracks remaining count correctly', () => {
    const id = `test-remaining-${Date.now()}`;
    rateLimit(id, 3, 60_000);
    const result = rateLimit(id, 3, 60_000);
    expect(result.remaining).toBe(1);
  });

  it('blocks when limit is exceeded', () => {
    const id = `test-block-${Date.now()}`;
    rateLimit(id, 2, 60_000);
    rateLimit(id, 2, 60_000);
    const result = rateLimit(id, 2, 60_000);
    expect(result.success).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it('returns reset time when blocked', () => {
    const id = `test-reset-${Date.now()}`;
    rateLimit(id, 1, 60_000);
    const result = rateLimit(id, 1, 60_000);
    expect(result.success).toBe(false);
    expect(result.reset).toBeGreaterThan(0);
    expect(result.reset).toBeLessThanOrEqual(60_000);
  });

  it('allows requests from different identifiers', () => {
    const id1 = `test-multi-a-${Date.now()}`;
    const id2 = `test-multi-b-${Date.now()}`;
    rateLimit(id1, 1, 60_000);
    const result = rateLimit(id2, 1, 60_000);
    expect(result.success).toBe(true);
  });

  it('returns full window duration as reset when successful', () => {
    const id = `test-window-${Date.now()}`;
    const result = rateLimit(id, 5, 30_000);
    expect(result.reset).toBe(30_000);
  });
});
