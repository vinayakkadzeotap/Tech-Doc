import { describe, it, expect } from 'vitest';
import { EVENTS } from '@/lib/utils/analytics';

describe('EVENTS constants', () => {
  it('has all required event types', () => {
    expect(EVENTS.PAGE_VIEW).toBe('page_view');
    expect(EVENTS.MODULE_START).toBe('module_start');
    expect(EVENTS.MODULE_COMPLETE).toBe('module_complete');
    expect(EVENTS.QUIZ_COMPLETE).toBe('quiz_complete');
    expect(EVENTS.SEARCH).toBe('search');
    expect(EVENTS.ASSISTANT_QUERY).toBe('assistant_query');
    expect(EVENTS.BADGE_EARNED).toBe('badge_earned');
    expect(EVENTS.FEEDBACK_SUBMIT).toBe('feedback_submit');
    expect(EVENTS.ASSIGNMENT_CREATED).toBe('assignment_created');
  });

  it('has 9 event types total', () => {
    expect(Object.keys(EVENTS)).toHaveLength(9);
  });

  it('has unique event type values', () => {
    const values = Object.values(EVENTS);
    const unique = new Set(values);
    expect(unique.size).toBe(values.length);
  });

  it('all values are lowercase snake_case strings', () => {
    Object.values(EVENTS).forEach((value) => {
      expect(value).toMatch(/^[a-z_]+$/);
    });
  });
});
