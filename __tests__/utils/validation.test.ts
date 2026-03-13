import { describe, it, expect } from 'vitest';
import { TRACKS } from '@/lib/utils/roles';
import {
  progressSchema,
  feedbackSchema,
  feedbackPatchSchema,
  quizSchema,
  assignmentSchema,
  bulkAssignmentSchema,
  validateBody,
} from '@/lib/utils/validation';

const VALID_TRACK = TRACKS[0];
const VALID_MODULE = VALID_TRACK.modules[0];

describe('progressSchema', () => {
  it('accepts valid progress data', () => {
    const result = validateBody(progressSchema, {
      track_id: VALID_TRACK.id,
      module_id: VALID_MODULE.id,
      status: 'completed',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid track_id', () => {
    const result = validateBody(progressSchema, {
      track_id: 'nonexistent-track',
      module_id: VALID_MODULE.id,
      status: 'completed',
    });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toContain('Invalid track_id');
  });

  it('rejects module_id not in track', () => {
    const result = validateBody(progressSchema, {
      track_id: VALID_TRACK.id,
      module_id: 'nonexistent-module',
      status: 'completed',
    });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toContain('module_id');
  });

  it('rejects invalid status', () => {
    const result = validateBody(progressSchema, {
      track_id: VALID_TRACK.id,
      module_id: VALID_MODULE.id,
      status: 'invalid_status',
    });
    expect(result.success).toBe(false);
  });
});

describe('feedbackSchema', () => {
  it('accepts valid feedback', () => {
    const result = validateBody(feedbackSchema, {
      content_type: 'module',
      content_id: 'test-module',
      rating: 4,
      comment: 'Great content',
    });
    expect(result.success).toBe(true);
  });

  it('defaults rating to 0 when omitted', () => {
    const result = validateBody(feedbackSchema, {
      content_type: 'module',
      content_id: 'test-module',
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.rating).toBe(0);
  });

  it('rejects rating > 5', () => {
    const result = validateBody(feedbackSchema, {
      content_type: 'module',
      content_id: 'test-module',
      rating: 10,
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty content_type', () => {
    const result = validateBody(feedbackSchema, {
      content_type: '',
      content_id: 'test',
    });
    expect(result.success).toBe(false);
  });
});

describe('feedbackPatchSchema', () => {
  it('accepts valid patch', () => {
    const result = validateBody(feedbackPatchSchema, {
      feedback_id: '550e8400-e29b-41d4-a716-446655440000',
      status: 'addressed',
    });
    expect(result.success).toBe(true);
  });

  it('rejects non-UUID feedback_id', () => {
    const result = validateBody(feedbackPatchSchema, {
      feedback_id: 'not-a-uuid',
      status: 'open',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid status', () => {
    const result = validateBody(feedbackPatchSchema, {
      feedback_id: '550e8400-e29b-41d4-a716-446655440000',
      status: 'closed',
    });
    expect(result.success).toBe(false);
  });
});

describe('quizSchema', () => {
  it('accepts valid quiz result', () => {
    const result = validateBody(quizSchema, {
      quiz_id: 'quiz-1',
      score: 8,
      total: 10,
      percentage: 80,
      passed: true,
    });
    expect(result.success).toBe(true);
  });

  it('accepts 0 score', () => {
    const result = validateBody(quizSchema, {
      quiz_id: 'quiz-1',
      score: 0,
      total: 5,
      percentage: 0,
      passed: false,
    });
    expect(result.success).toBe(true);
  });

  it('rejects percentage > 100', () => {
    const result = validateBody(quizSchema, {
      quiz_id: 'quiz-1',
      score: 10,
      total: 10,
      percentage: 150,
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
});

describe('assignmentSchema', () => {
  it('accepts valid assignment', () => {
    const result = validateBody(assignmentSchema, {
      user_id: '550e8400-e29b-41d4-a716-446655440000',
      track_id: VALID_TRACK.id,
    });
    expect(result.success).toBe(true);
  });

  it('rejects non-UUID user_id', () => {
    const result = validateBody(assignmentSchema, {
      user_id: 'not-uuid',
      track_id: VALID_TRACK.id,
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid track_id', () => {
    const result = validateBody(assignmentSchema, {
      user_id: '550e8400-e29b-41d4-a716-446655440000',
      track_id: 'nonexistent',
    });
    expect(result.success).toBe(false);
  });
});

describe('bulkAssignmentSchema', () => {
  it('accepts valid bulk assignment', () => {
    const result = validateBody(bulkAssignmentSchema, {
      templateId: 'template-1',
      userIds: ['550e8400-e29b-41d4-a716-446655440000'],
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty userIds', () => {
    const result = validateBody(bulkAssignmentSchema, {
      templateId: 'template-1',
      userIds: [],
    });
    expect(result.success).toBe(false);
  });

  it('rejects non-UUID in userIds', () => {
    const result = validateBody(bulkAssignmentSchema, {
      templateId: 'template-1',
      userIds: ['not-a-uuid'],
    });
    expect(result.success).toBe(false);
  });
});

describe('validateBody helper', () => {
  it('returns data on success', () => {
    const result = validateBody(feedbackSchema, {
      content_type: 'module',
      content_id: 'test',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.content_type).toBe('module');
    }
  });

  it('returns error string on failure', () => {
    const result = validateBody(feedbackSchema, {});
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(typeof result.error).toBe('string');
      expect(result.error.length).toBeGreaterThan(0);
    }
  });
});
