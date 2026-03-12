import { describe, it, expect } from 'vitest';
import { KNOWLEDGE_CHECKS } from '@/lib/utils/knowledge-checks';

describe('Knowledge Checks', () => {
  it('should have checks for multiple modules', () => {
    const moduleIds = Object.keys(KNOWLEDGE_CHECKS);
    expect(moduleIds.length).toBeGreaterThanOrEqual(5);
  });

  it('each question should have valid structure', () => {
    for (const [moduleId, questions] of Object.entries(KNOWLEDGE_CHECKS)) {
      expect(questions.length).toBeGreaterThan(0);
      for (const q of questions) {
        expect(q.text).toBeTruthy();
        expect(q.options.length).toBeGreaterThanOrEqual(2);
        expect(q.correct).toBeGreaterThanOrEqual(0);
        expect(q.correct).toBeLessThan(q.options.length);
        expect(q.explanation).toBeTruthy();
      }
    }
  });
});
