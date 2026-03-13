import { describe, it, expect } from 'vitest';
import { TRACKS } from '@/lib/utils/roles';
import {
  parseAssistantAction,
  ACTION_TYPES,
  actionSchema,
} from '@/lib/utils/assistant-actions';

const VALID_TRACK = TRACKS[0];
const VALID_MODULE = VALID_TRACK.modules[0];

describe('parseAssistantAction', () => {
  it('parses mark_progress action', () => {
    const text = `Sure! [ACTION:mark_progress:${VALID_TRACK.id}:${VALID_MODULE.id}] I've marked it.`;
    const result = parseAssistantAction(text);
    expect(result).not.toBeNull();
    expect(result?.action_type).toBe('mark_progress');
    if (result?.action_type === 'mark_progress') {
      expect(result.track_id).toBe(VALID_TRACK.id);
      expect(result.module_id).toBe(VALID_MODULE.id);
    }
  });

  it('parses navigate action', () => {
    const text = 'Let me take you there [ACTION:navigate:/learn]';
    const result = parseAssistantAction(text);
    expect(result).not.toBeNull();
    expect(result?.action_type).toBe('navigate');
    if (result?.action_type === 'navigate') {
      expect(result.path).toBe('/learn');
    }
  });

  it('parses create_bookmark action', () => {
    const text = 'Bookmarking [ACTION:create_bookmark:module:what-is-cdp:Review later]';
    const result = parseAssistantAction(text);
    expect(result).not.toBeNull();
    expect(result?.action_type).toBe('create_bookmark');
    if (result?.action_type === 'create_bookmark') {
      expect(result.content_type).toBe('module');
      expect(result.content_id).toBe('what-is-cdp');
    }
  });

  it('parses start_quiz action', () => {
    const text = '[ACTION:start_quiz:quiz-1:track-1:module-1]';
    const result = parseAssistantAction(text);
    expect(result).not.toBeNull();
    expect(result?.action_type).toBe('start_quiz');
  });

  it('parses show_recommendation action', () => {
    const text = '[ACTION:show_recommendation:track-1:module-1:Great next step]';
    const result = parseAssistantAction(text);
    expect(result).not.toBeNull();
    expect(result?.action_type).toBe('show_recommendation');
  });

  it('returns null for messages without actions', () => {
    const text = 'This is a regular response with no action markers.';
    const result = parseAssistantAction(text);
    expect(result).toBeNull();
  });

  it('returns null for invalid action type', () => {
    const text = '[ACTION:unknown_action:param1:param2]';
    const result = parseAssistantAction(text);
    expect(result).toBeNull();
  });

  it('returns null for incomplete action params', () => {
    const text = '[ACTION:mark_progress]'; // Missing track_id and module_id
    const result = parseAssistantAction(text);
    expect(result).toBeNull();
  });
});

describe('actionSchema', () => {
  it('validates mark_progress action', () => {
    const result = actionSchema.safeParse({
      action_type: 'mark_progress',
      track_id: VALID_TRACK.id,
      module_id: VALID_MODULE.id,
      status: 'completed',
    });
    expect(result.success).toBe(true);
  });

  it('rejects unknown action_type', () => {
    const result = actionSchema.safeParse({
      action_type: 'delete_everything',
      target: 'all',
    });
    expect(result.success).toBe(false);
  });

  it('validates navigate action', () => {
    const result = actionSchema.safeParse({
      action_type: 'navigate',
      path: '/learn',
    });
    expect(result.success).toBe(true);
  });

  it('rejects navigate without leading slash', () => {
    const result = actionSchema.safeParse({
      action_type: 'navigate',
      path: 'learn',
    });
    expect(result.success).toBe(false);
  });
});

describe('ACTION_TYPES', () => {
  it('has all 5 action types', () => {
    expect(ACTION_TYPES).toHaveLength(5);
  });

  it('includes expected types', () => {
    expect(ACTION_TYPES).toContain('mark_progress');
    expect(ACTION_TYPES).toContain('navigate');
    expect(ACTION_TYPES).toContain('create_bookmark');
    expect(ACTION_TYPES).toContain('start_quiz');
    expect(ACTION_TYPES).toContain('show_recommendation');
  });
});
