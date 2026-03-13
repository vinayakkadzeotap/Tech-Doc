import { vi } from 'vitest';

// --- Mock Supabase Client Factory ---

export interface MockSupabaseQuery {
  select: ReturnType<typeof vi.fn>;
  insert: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  upsert: ReturnType<typeof vi.fn>;
  eq: ReturnType<typeof vi.fn>;
  neq: ReturnType<typeof vi.fn>;
  gte: ReturnType<typeof vi.fn>;
  lte: ReturnType<typeof vi.fn>;
  order: ReturnType<typeof vi.fn>;
  limit: ReturnType<typeof vi.fn>;
  single: ReturnType<typeof vi.fn>;
  maybeSingle: ReturnType<typeof vi.fn>;
}

export function createMockSupabaseClient(overrides: {
  data?: unknown;
  error?: { message: string } | null;
  user?: { id: string; email: string } | null;
} = {}) {
  const { data = [], error = null, user = { id: 'test-user-id', email: 'test@example.com' } } = overrides;

  const queryResult = { data, error };

  const chainable: MockSupabaseQuery = {
    select: vi.fn().mockReturnValue(queryResult),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    upsert: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnValue(queryResult),
    limit: vi.fn().mockReturnValue(queryResult),
    single: vi.fn().mockReturnValue(queryResult),
    maybeSingle: vi.fn().mockReturnValue(queryResult),
  };

  // Make chainable methods return chainable object
  for (const method of ['insert', 'update', 'delete', 'upsert', 'eq', 'neq', 'gte', 'lte'] as const) {
    chainable[method].mockReturnValue(chainable);
  }

  return {
    from: vi.fn().mockReturnValue(chainable),
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user },
        error: null,
      }),
    },
    _chainable: chainable,
  };
}

// --- Mock NextRequest ---

export function createMockRequest(options: {
  method?: string;
  url?: string;
  body?: unknown;
  searchParams?: Record<string, string>;
} = {}) {
  const { method = 'GET', url = 'http://localhost:3000/api/test', body, searchParams = {} } = options;

  const urlObj = new URL(url);
  for (const [key, value] of Object.entries(searchParams)) {
    urlObj.searchParams.set(key, value);
  }

  return {
    method,
    url: urlObj.toString(),
    json: body !== undefined ? vi.fn().mockResolvedValue(body) : vi.fn().mockRejectedValue(new SyntaxError('Unexpected token')),
    nextUrl: urlObj,
  };
}

// --- Test user fixtures ---

export const TEST_USER = {
  id: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
  email: 'test@example.com',
  role: 'learner',
};

export const TEST_ADMIN = {
  id: '11111111-2222-3333-4444-555555555555',
  email: 'admin@example.com',
  role: 'admin',
};
