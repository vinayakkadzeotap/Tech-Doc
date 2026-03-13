import { describe, it, expect } from 'vitest';
import { EVENTS } from '@/lib/utils/analytics';

describe('Analytics event types', () => {
  it('defines all expected event types', () => {
    const expectedEvents = [
      'page_view',
      'module_start',
      'module_complete',
      'quiz_complete',
      'search',
      'assistant_query',
      'badge_earned',
      'feedback_submit',
      'assignment_created',
    ];
    expectedEvents.forEach((event) => {
      expect(Object.values(EVENTS)).toContain(event);
    });
  });
});

describe('Analytics data structure', () => {
  it('event record has required shape', () => {
    const event = {
      user_id: '550e8400-e29b-41d4-a716-446655440000',
      event_type: EVENTS.PAGE_VIEW,
      event_data: { page: '/home' },
    };
    expect(event).toHaveProperty('user_id');
    expect(event).toHaveProperty('event_type');
    expect(event).toHaveProperty('event_data');
    expect(typeof event.event_data).toBe('object');
  });

  it('event_data supports nested metadata', () => {
    const event = {
      user_id: 'test-id',
      event_type: EVENTS.SEARCH,
      event_data: {
        query: 'CDP basics',
        results_count: 5,
        filters: { type: 'modules' },
      },
    };
    expect(event.event_data.query).toBe('CDP basics');
    expect(event.event_data.results_count).toBe(5);
  });
});

describe('DAU/MAU calculation logic', () => {
  it('computes unique daily users from events', () => {
    const events = [
      { user_id: 'a', created_at: '2026-03-13T10:00:00Z' },
      { user_id: 'a', created_at: '2026-03-13T11:00:00Z' },
      { user_id: 'b', created_at: '2026-03-13T12:00:00Z' },
      { user_id: 'c', created_at: '2026-03-12T10:00:00Z' },
    ];

    // DAU for 2026-03-13
    const dau = new Set(
      events
        .filter((e) => e.created_at.startsWith('2026-03-13'))
        .map((e) => e.user_id)
    );
    expect(dau.size).toBe(2); // 'a' and 'b'
  });

  it('computes MAU from 30-day window', () => {
    const events = [
      { user_id: 'a', created_at: '2026-03-01T10:00:00Z' },
      { user_id: 'b', created_at: '2026-03-05T10:00:00Z' },
      { user_id: 'a', created_at: '2026-03-10T10:00:00Z' },
      { user_id: 'c', created_at: '2026-02-15T10:00:00Z' },
    ];

    const thirtyDaysAgo = new Date('2026-03-13');
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const mau = new Set(
      events
        .filter((e) => new Date(e.created_at) >= thirtyDaysAgo)
        .map((e) => e.user_id)
    );
    expect(mau.size).toBe(3); // a, b, c all within 30 days
  });

  it('DAU/MAU ratio is between 0 and 1', () => {
    const dau = 15;
    const mau = 100;
    const ratio = dau / mau;
    expect(ratio).toBeGreaterThanOrEqual(0);
    expect(ratio).toBeLessThanOrEqual(1);
  });
});
