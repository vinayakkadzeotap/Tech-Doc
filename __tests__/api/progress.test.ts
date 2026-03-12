import { describe, it, expect } from 'vitest';
import { progressSchema, validateBody } from '@/lib/utils/validation';
import { TRACKS } from '@/lib/utils/roles';

describe('Progress API Validation', () => {
  const firstTrack = TRACKS[0];
  const firstModule = firstTrack?.modules[0];

  it('should have TRACKS loaded', () => {
    expect(TRACKS.length).toBeGreaterThan(0);
    expect(firstTrack.id).toBeTruthy();
    expect(firstModule.id).toBeTruthy();
  });

  it('should accept valid progress data', () => {
    const result = validateBody(progressSchema, {
      track_id: firstTrack.id,
      module_id: firstModule.id,
      status: 'completed',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.track_id).toBe(firstTrack.id);
      expect(result.data.module_id).toBe(firstModule.id);
      expect(result.data.status).toBe('completed');
    }
  });

  it('should reject invalid track_id', () => {
    const result = validateBody(progressSchema, {
      track_id: 'nonexistent-track',
      module_id: 'some-module',
      status: 'completed',
    });
    expect(result.success).toBe(false);
  });

  it('should reject missing fields', () => {
    const result = validateBody(progressSchema, {
      track_id: firstTrack.id,
    });
    expect(result.success).toBe(false);
  });

  it('should reject invalid status values', () => {
    const result = validateBody(progressSchema, {
      track_id: firstTrack.id,
      module_id: firstModule.id,
      status: 'invalid-status',
    });
    expect(result.success).toBe(false);
  });

  it('should accept in_progress status', () => {
    const result = validateBody(progressSchema, {
      track_id: firstTrack.id,
      module_id: firstModule.id,
      status: 'in_progress',
    });
    expect(result.success).toBe(true);
  });

  it('should reject module_id from wrong track', () => {
    const secondTrack = TRACKS[1];
    if (secondTrack) {
      const result = validateBody(progressSchema, {
        track_id: firstTrack.id,
        module_id: secondTrack.modules[0]?.id || 'wrong-module',
        status: 'completed',
      });
      expect(result.success).toBe(false);
    }
  });
});
