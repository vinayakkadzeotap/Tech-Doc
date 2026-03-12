import { describe, it, expect } from 'vitest';
import { feedbackSchema, feedbackPatchSchema, validateBody } from '@/lib/utils/validation';

describe('Feedback API Validation', () => {
  it('should accept valid feedback data', () => {
    const result = validateBody(feedbackSchema, {
      content_type: 'module',
      content_id: 'what-is-cdp',
      rating: 5,
      comment: 'Great module!',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.rating).toBe(5);
      expect(result.data.comment).toBe('Great module!');
    }
  });

  it('should reject rating outside 0-5 range', () => {
    const result = validateBody(feedbackSchema, {
      content_type: 'module',
      content_id: 'what-is-cdp',
      rating: 6,
    });
    expect(result.success).toBe(false);
  });

  it('should accept feedback with default rating', () => {
    const result = validateBody(feedbackSchema, {
      content_type: 'module',
      content_id: 'what-is-cdp',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.rating).toBe(0);
    }
  });

  it('should reject missing content_type', () => {
    const result = validateBody(feedbackSchema, {
      content_id: 'what-is-cdp',
      rating: 4,
    });
    expect(result.success).toBe(false);
  });

  it('should accept valid patch data', () => {
    const result = validateBody(feedbackPatchSchema, {
      feedback_id: '550e8400-e29b-41d4-a716-446655440000',
      status: 'addressed',
      admin_response: 'Thanks for the feedback!',
    });
    expect(result.success).toBe(true);
  });

  it('should reject patch with invalid status', () => {
    const result = validateBody(feedbackPatchSchema, {
      feedback_id: '550e8400-e29b-41d4-a716-446655440000',
      status: 'invalid',
    });
    expect(result.success).toBe(false);
  });

  it('should reject patch without feedback_id', () => {
    const result = validateBody(feedbackPatchSchema, {
      status: 'addressed',
    });
    expect(result.success).toBe(false);
  });
});
