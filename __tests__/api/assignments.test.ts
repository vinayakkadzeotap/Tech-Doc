import { describe, it, expect } from 'vitest';
import { TRACKS } from '@/lib/utils/roles';
import {
  assignmentSchema,
  bulkAssignmentSchema,
  validateBody,
} from '@/lib/utils/validation';

const VALID_TRACK = TRACKS[0];
const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000';

describe('assignmentSchema', () => {
  it('accepts valid assignment with all fields', () => {
    const result = validateBody(assignmentSchema, {
      user_id: VALID_UUID,
      track_id: VALID_TRACK.id,
      due_date: '2026-06-01T00:00:00.000Z',
      notes: 'Complete by end of month',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.user_id).toBe(VALID_UUID);
      expect(result.data.track_id).toBe(VALID_TRACK.id);
      expect(result.data.notes).toBe('Complete by end of month');
    }
  });

  it('accepts assignment without optional fields', () => {
    const result = validateBody(assignmentSchema, {
      user_id: VALID_UUID,
      track_id: VALID_TRACK.id,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.notes).toBe('');
    }
  });

  it('rejects non-UUID user_id', () => {
    const result = validateBody(assignmentSchema, {
      user_id: 'plain-string',
      track_id: VALID_TRACK.id,
    });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toContain('user_id');
  });

  it('rejects invalid track_id', () => {
    const result = validateBody(assignmentSchema, {
      user_id: VALID_UUID,
      track_id: 'fake-track',
    });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toContain('track_id');
  });

  it('rejects notes exceeding 500 chars', () => {
    const result = validateBody(assignmentSchema, {
      user_id: VALID_UUID,
      track_id: VALID_TRACK.id,
      notes: 'x'.repeat(501),
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid datetime for due_date', () => {
    const result = validateBody(assignmentSchema, {
      user_id: VALID_UUID,
      track_id: VALID_TRACK.id,
      due_date: 'not-a-date',
    });
    expect(result.success).toBe(false);
  });

  it('validates all tracks are assignable', () => {
    TRACKS.forEach((track) => {
      const result = validateBody(assignmentSchema, {
        user_id: VALID_UUID,
        track_id: track.id,
      });
      expect(result.success).toBe(true);
    });
  });
});

describe('bulkAssignmentSchema', () => {
  it('accepts valid bulk assignment', () => {
    const result = validateBody(bulkAssignmentSchema, {
      templateId: 'onboarding-template',
      userIds: [VALID_UUID, '6ba7b810-9dad-41d1-80b4-00c04fd430c8'],
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty userIds array', () => {
    const result = validateBody(bulkAssignmentSchema, {
      templateId: 'template-1',
      userIds: [],
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing templateId', () => {
    const result = validateBody(bulkAssignmentSchema, {
      userIds: [VALID_UUID],
    });
    expect(result.success).toBe(false);
  });

  it('rejects non-UUID entries in userIds', () => {
    const result = validateBody(bulkAssignmentSchema, {
      templateId: 'template-1',
      userIds: ['not-a-uuid'],
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty templateId', () => {
    const result = validateBody(bulkAssignmentSchema, {
      templateId: '',
      userIds: [VALID_UUID],
    });
    expect(result.success).toBe(false);
  });
});
