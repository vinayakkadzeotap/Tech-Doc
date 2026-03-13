import React from 'react';
import { vi } from 'vitest';

// Mock next/navigation
export const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn(),
};

export const mockPathname = '/home';
export const mockSearchParams = new URLSearchParams();

vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  usePathname: () => mockPathname,
  useSearchParams: () => mockSearchParams,
}));

// Mock fetch for API calls
export function mockFetch(response: unknown, options?: { ok?: boolean; status?: number }) {
  const { ok = true, status = 200 } = options || {};
  return vi.fn().mockResolvedValue({
    ok,
    status,
    json: () => Promise.resolve(response),
  });
}

// Simple wrapper for rendering components in tests
export function TestWrapper({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
