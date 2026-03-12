import { describe, it, expect } from 'vitest';
import { LEARNING_PLAN_TEMPLATES } from '@/lib/utils/learning-plans';
import { TRACKS } from '@/lib/utils/roles';

describe('Learning Plan Templates', () => {
  it('should have at least 3 templates', () => {
    expect(LEARNING_PLAN_TEMPLATES.length).toBeGreaterThanOrEqual(3);
  });

  it('each template should reference valid track IDs', () => {
    const trackIds = TRACKS.map((t) => t.id);
    for (const template of LEARNING_PLAN_TEMPLATES) {
      for (const trackId of template.tracks) {
        expect(trackIds).toContain(trackId);
      }
    }
  });

  it('each template should have valid estimated days', () => {
    for (const template of LEARNING_PLAN_TEMPLATES) {
      expect(template.estimatedDays).toBeGreaterThan(0);
    }
  });

  it('should have unique template IDs', () => {
    const ids = LEARNING_PLAN_TEMPLATES.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
