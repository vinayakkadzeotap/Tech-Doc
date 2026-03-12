import { z } from 'zod';
import { TRACKS } from '@/lib/utils/roles';

// Valid track and module IDs derived from TRACKS data
const VALID_TRACK_IDS = TRACKS.map((t) => t.id);
const VALID_MODULE_IDS_BY_TRACK: Record<string, string[]> = {};
TRACKS.forEach((t) => {
  VALID_MODULE_IDS_BY_TRACK[t.id] = t.modules.map((m) => m.id);
});

// --- Schemas ---

export const progressSchema = z.object({
  track_id: z.string().refine((val) => VALID_TRACK_IDS.includes(val), {
    message: 'Invalid track_id. Must be one of: ' + VALID_TRACK_IDS.join(', '),
  }),
  module_id: z.string().min(1, 'module_id is required'),
  status: z.enum(['in_progress', 'completed'], {
    errorMap: () => ({ message: 'status must be "in_progress" or "completed"' }),
  }),
}).refine(
  (data) => {
    const validModules = VALID_MODULE_IDS_BY_TRACK[data.track_id];
    return validModules ? validModules.includes(data.module_id) : false;
  },
  { message: 'module_id does not exist in the specified track', path: ['module_id'] }
);

export const feedbackSchema = z.object({
  content_type: z.string().min(1, 'content_type is required'),
  content_id: z.string().min(1, 'content_id is required'),
  rating: z.number().int().min(0).max(5).optional().default(0),
  comment: z.string().max(2000).optional().default(''),
  issue_type: z.string().max(100).optional().default(''),
});

export const feedbackPatchSchema = z.object({
  feedback_id: z.string().uuid('feedback_id must be a valid UUID'),
  status: z.enum(['open', 'addressed'], {
    errorMap: () => ({ message: 'status must be "open" or "addressed"' }),
  }),
  admin_response: z.string().max(2000).optional().default(''),
});

export const quizSchema = z.object({
  quiz_id: z.string().min(1, 'quiz_id is required'),
  score: z.number().int().min(0),
  total: z.number().int().min(1),
  percentage: z.number().min(0).max(100),
  passed: z.boolean(),
  answers: z.record(z.unknown()).optional().default({}),
});

export const assignmentSchema = z.object({
  user_id: z.string().uuid('user_id must be a valid UUID'),
  track_id: z.string().refine((val) => VALID_TRACK_IDS.includes(val), {
    message: 'Invalid track_id',
  }),
  due_date: z.string().datetime().optional(),
  notes: z.string().max(500).optional().default(''),
});

export const bulkAssignmentSchema = z.object({
  templateId: z.string().min(1, 'templateId is required'),
  userIds: z.array(z.string().uuid()).min(1, 'At least one user is required'),
});

// --- Helper ---

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export function validateBody<T>(
  schema: z.ZodSchema<T>,
  body: unknown
): ValidationResult<T> {
  const result = schema.safeParse(body);
  if (!result.success) {
    const firstError = result.error.errors[0];
    const path = firstError.path.length ? `${firstError.path.join('.')}: ` : '';
    return { success: false, error: `${path}${firstError.message}` };
  }
  return { success: true, data: result.data };
}
