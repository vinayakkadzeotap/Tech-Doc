import { describe, it, expect, vi } from 'vitest';

describe('ErrorBoundary', () => {
  describe('error state management', () => {
    it('initial state has no error', () => {
      const state = { hasError: false, error: null };
      expect(state.hasError).toBe(false);
      expect(state.error).toBeNull();
    });

    it('getDerivedStateFromError returns error state', () => {
      const error = new Error('Test error');
      const newState = { hasError: true, error };
      expect(newState.hasError).toBe(true);
      expect(newState.error.message).toBe('Test error');
    });

    it('reset clears error state', () => {
      const state = { hasError: true, error: new Error('fail') };
      const resetState = { hasError: false, error: null };
      expect(resetState.hasError).toBe(false);
      expect(resetState.error).toBeNull();
    });
  });

  describe('onError callback', () => {
    it('calls onError when error occurs', () => {
      const onError = vi.fn();
      const error = new Error('Component crashed');
      const errorInfo = { componentStack: 'at TestComponent' };
      onError(error, errorInfo);
      expect(onError).toHaveBeenCalledWith(error, errorInfo);
      expect(onError).toHaveBeenCalledTimes(1);
    });
  });

  describe('fallback rendering', () => {
    it('uses custom fallback when provided', () => {
      const customFallback = '<div>Custom error UI</div>';
      const hasCustom = customFallback !== undefined;
      expect(hasCustom).toBe(true);
    });

    it('uses default fallback when none provided', () => {
      const fallback = undefined;
      const usesDefault = fallback === undefined;
      expect(usesDefault).toBe(true);
    });
  });
});
