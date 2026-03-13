import { describe, it, expect } from 'vitest';
import { quizSchema, validateBody } from '@/lib/utils/validation';

describe('quizSchema', () => {
  it('accepts a perfect score', () => {
    const result = validateBody(quizSchema, {
      quiz_id: 'cdp-fundamentals-quiz',
      score: 10,
      total: 10,
      percentage: 100,
      passed: true,
    });
    expect(result.success).toBe(true);
  });

  it('accepts a zero score', () => {
    const result = validateBody(quizSchema, {
      quiz_id: 'quiz-hard',
      score: 0,
      total: 5,
      percentage: 0,
      passed: false,
    });
    expect(result.success).toBe(true);
  });

  it('accepts answers record', () => {
    const result = validateBody(quizSchema, {
      quiz_id: 'quiz-1',
      score: 3,
      total: 5,
      percentage: 60,
      passed: true,
      answers: { q1: 'a', q2: 'b', q3: 'c' },
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.answers).toEqual({ q1: 'a', q2: 'b', q3: 'c' });
  });

  it('defaults answers to empty object', () => {
    const result = validateBody(quizSchema, {
      quiz_id: 'quiz-1',
      score: 5,
      total: 5,
      percentage: 100,
      passed: true,
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.answers).toEqual({});
  });

  it('rejects missing quiz_id', () => {
    const result = validateBody(quizSchema, {
      score: 5,
      total: 10,
      percentage: 50,
      passed: false,
    });
    expect(result.success).toBe(false);
  });

  it('rejects negative score', () => {
    const result = validateBody(quizSchema, {
      quiz_id: 'quiz-1',
      score: -1,
      total: 10,
      percentage: 0,
      passed: false,
    });
    expect(result.success).toBe(false);
  });

  it('rejects percentage over 100', () => {
    const result = validateBody(quizSchema, {
      quiz_id: 'quiz-1',
      score: 10,
      total: 10,
      percentage: 110,
      passed: true,
    });
    expect(result.success).toBe(false);
  });

  it('rejects total of 0', () => {
    const result = validateBody(quizSchema, {
      quiz_id: 'quiz-1',
      score: 0,
      total: 0,
      percentage: 0,
      passed: false,
    });
    expect(result.success).toBe(false);
  });

  it('rejects non-boolean passed', () => {
    const result = validateBody(quizSchema, {
      quiz_id: 'quiz-1',
      score: 5,
      total: 10,
      percentage: 50,
      passed: 'yes',
    });
    expect(result.success).toBe(false);
  });

  it('rejects float score', () => {
    const result = validateBody(quizSchema, {
      quiz_id: 'quiz-1',
      score: 4.5,
      total: 10,
      percentage: 45,
      passed: false,
    });
    expect(result.success).toBe(false);
  });
});
