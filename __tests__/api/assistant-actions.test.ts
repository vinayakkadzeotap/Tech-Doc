import { describe, it, expect } from 'vitest';
import { TRACKS } from '@/lib/utils/roles';
import { actionSchema } from '@/lib/utils/assistant-actions';

const VALID_TRACK = TRACKS[0];
const VALID_MODULE = VALID_TRACK.modules[0];

describe('Assistant Actions API validation', () => {
  describe('valid actions', () => {
    it('accepts mark_progress with required fields', () => {
      const result = actionSchema.safeParse({
        action_type: 'mark_progress',
        track_id: VALID_TRACK.id,
        module_id: VALID_MODULE.id,
      });
      expect(result.success).toBe(true);
    });

    it('accepts navigate with path', () => {
      const result = actionSchema.safeParse({
        action_type: 'navigate',
        path: '/home',
      });
      expect(result.success).toBe(true);
    });

    it('accepts create_bookmark', () => {
      const result = actionSchema.safeParse({
        action_type: 'create_bookmark',
        content_type: 'module',
        content_id: 'what-is-cdp',
      });
      expect(result.success).toBe(true);
    });

    it('accepts start_quiz', () => {
      const result = actionSchema.safeParse({
        action_type: 'start_quiz',
        quiz_id: 'quiz-1',
        track_id: VALID_TRACK.id,
        module_id: VALID_MODULE.id,
      });
      expect(result.success).toBe(true);
    });

    it('accepts show_recommendation', () => {
      const result = actionSchema.safeParse({
        action_type: 'show_recommendation',
        track_id: VALID_TRACK.id,
        module_id: VALID_MODULE.id,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('invalid actions', () => {
    it('rejects missing action_type', () => {
      const result = actionSchema.safeParse({
        track_id: VALID_TRACK.id,
      });
      expect(result.success).toBe(false);
    });

    it('rejects unknown action_type', () => {
      const result = actionSchema.safeParse({
        action_type: 'delete_user',
        user_id: '123',
      });
      expect(result.success).toBe(false);
    });

    it('rejects mark_progress with missing module_id', () => {
      const result = actionSchema.safeParse({
        action_type: 'mark_progress',
        track_id: VALID_TRACK.id,
      });
      expect(result.success).toBe(false);
    });

    it('rejects navigate with empty path', () => {
      const result = actionSchema.safeParse({
        action_type: 'navigate',
        path: '',
      });
      expect(result.success).toBe(false);
    });

    it('rejects empty body', () => {
      const result = actionSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });
});
