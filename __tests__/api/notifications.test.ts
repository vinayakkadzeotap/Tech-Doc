import { describe, it, expect } from 'vitest';
import { computeLearnerHealth } from '@/lib/utils/learner-health';

describe('Learner Health Scoring', () => {
  const baseProfile = {
    id: 'user-1',
    full_name: 'Test User',
    email: 'test@example.com',
    role: 'engineering',
    team: 'Platform',
  };

  it('should classify active learners correctly', () => {
    const profiles = [baseProfile];
    const progress = [
      { user_id: 'user-1', status: 'completed', completed_at: new Date().toISOString(), created_at: new Date().toISOString() },
    ];

    const result = computeLearnerHealth(profiles, progress, [], 10);
    expect(result.length).toBe(1);
    expect(result[0].status).toBe('active');
    expect(result[0].score).toBeGreaterThanOrEqual(60);
  });

  it('should classify inactive learners as disengaged', () => {
    const profiles = [baseProfile];
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const progress = [
      { user_id: 'user-1', status: 'in_progress', completed_at: null, created_at: thirtyDaysAgo },
    ];

    const result = computeLearnerHealth(profiles, progress, [], 10);
    expect(result.length).toBe(1);
    expect(result[0].status).toBe('disengaged');
    expect(result[0].score).toBeLessThan(30);
  });

  it('should penalize overdue assignments', () => {
    const profiles = [baseProfile];
    const recentDate = new Date().toISOString();
    const pastDeadline = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const progress = [
      { user_id: 'user-1', status: 'in_progress', completed_at: null, created_at: recentDate },
    ];
    const assignments = [
      { user_id: 'user-1', track_id: 'cdp-fundamentals', due_date: pastDeadline, status: 'assigned' },
    ];

    const result = computeLearnerHealth(profiles, progress, assignments, 10);
    expect(result[0].overdueAssignments).toBe(1);
    expect(result[0].score).toBeLessThan(100);
  });

  it('should sort by health score ascending (most at-risk first)', () => {
    const profiles = [
      { ...baseProfile, id: 'active-user', full_name: 'Active' },
      { ...baseProfile, id: 'inactive-user', full_name: 'Inactive' },
    ];
    const recentDate = new Date().toISOString();
    const oldDate = new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString();
    const progress = [
      { user_id: 'active-user', status: 'completed', completed_at: recentDate, created_at: recentDate },
      { user_id: 'inactive-user', status: 'in_progress', completed_at: null, created_at: oldDate },
    ];

    const result = computeLearnerHealth(profiles, progress, [], 10);
    expect(result[0].name).toBe('Inactive');
    expect(result[1].name).toBe('Active');
  });

  it('should handle users with no progress', () => {
    const profiles = [baseProfile];
    const result = computeLearnerHealth(profiles, [], [], 10);
    expect(result.length).toBe(1);
    expect(result[0].status).toBe('disengaged');
    expect(result[0].completionPct).toBe(0);
  });
});
