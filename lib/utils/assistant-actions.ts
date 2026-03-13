import { z } from 'zod';
import { TRACKS } from '@/lib/utils/roles';

// --- Action Types ---

export const ACTION_TYPES = [
  'mark_progress',
  'navigate',
  'create_bookmark',
  'start_quiz',
  'show_recommendation',
] as const;

export type ActionType = (typeof ACTION_TYPES)[number];

// --- Action Schemas ---

const VALID_TRACK_IDS = TRACKS.map((t) => t.id) as string[];

export const markProgressSchema = z.object({
  action_type: z.literal('mark_progress'),
  track_id: z.string().refine((val) => VALID_TRACK_IDS.includes(val), {
    message: 'Invalid track_id',
  }),
  module_id: z.string().min(1),
  status: z.enum(['in_progress', 'completed'] as const).default('completed'),
});

export const navigateSchema = z.object({
  action_type: z.literal('navigate'),
  path: z.string().min(1).startsWith('/'),
});

export const createBookmarkSchema = z.object({
  action_type: z.literal('create_bookmark'),
  content_type: z.string().min(1),
  content_id: z.string().min(1),
  note: z.string().max(500).optional().default(''),
});

export const startQuizSchema = z.object({
  action_type: z.literal('start_quiz'),
  quiz_id: z.string().min(1),
  track_id: z.string().min(1),
  module_id: z.string().min(1),
});

export const showRecommendationSchema = z.object({
  action_type: z.literal('show_recommendation'),
  track_id: z.string().min(1),
  module_id: z.string().min(1),
  reason: z.string().optional().default(''),
});

// --- Action Discriminator ---

export const actionSchema = z.discriminatedUnion('action_type', [
  markProgressSchema,
  navigateSchema,
  createBookmarkSchema,
  startQuizSchema,
  showRecommendationSchema,
]);

export type AssistantAction = z.infer<typeof actionSchema>;

// --- Action Parser ---

const ACTION_PATTERN = /\[ACTION:(\w+)(?::([^\]]+))?\]/g;

export function parseAssistantAction(text: string): AssistantAction | null {
  const match = ACTION_PATTERN.exec(text);
  ACTION_PATTERN.lastIndex = 0; // Reset regex state

  if (!match) return null;

  const actionType = match[1];
  const paramsStr = match[2] || '';
  const params = paramsStr.split(':').filter(Boolean);

  switch (actionType) {
    case 'mark_progress':
      if (params.length >= 2) {
        return {
          action_type: 'mark_progress',
          track_id: params[0],
          module_id: params[1],
          status: (params[2] as 'in_progress' | 'completed') || 'completed',
        };
      }
      break;
    case 'navigate':
      if (params.length >= 1) {
        return { action_type: 'navigate', path: params[0].startsWith('/') ? params[0] : `/${params[0]}` };
      }
      break;
    case 'create_bookmark':
      if (params.length >= 2) {
        return {
          action_type: 'create_bookmark',
          content_type: params[0],
          content_id: params[1],
          note: params[2] || '',
        };
      }
      break;
    case 'start_quiz':
      if (params.length >= 3) {
        return {
          action_type: 'start_quiz',
          quiz_id: params[0],
          track_id: params[1],
          module_id: params[2],
        };
      }
      break;
    case 'show_recommendation':
      if (params.length >= 2) {
        return {
          action_type: 'show_recommendation',
          track_id: params[0],
          module_id: params[1],
          reason: params[2] || '',
        };
      }
      break;
  }

  return null;
}

// --- Action Executor ---

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function executeAction(
  action: AssistantAction,
  userId: string,
  supabase: { from: (table: string) => any }
): Promise<{ success: boolean; message: string }> {
  switch (action.action_type) {
    case 'mark_progress': {
      const { error } = await supabase
        .from('progress')
        .upsert({
          user_id: userId,
          track_id: action.track_id,
          module_id: action.module_id,
          status: action.status,
          updated_at: new Date().toISOString(),
        })
        .select();

      return error
        ? { success: false, message: 'Failed to update progress' }
        : { success: true, message: `Module marked as ${action.status}` };
    }

    case 'navigate':
      return { success: true, message: `Navigate to ${action.path}` };

    case 'create_bookmark': {
      const { error } = await supabase
        .from('bookmarks')
        .upsert({
          user_id: userId,
          content_type: action.content_type,
          content_id: action.content_id,
          note: action.note,
        })
        .select();

      return error
        ? { success: false, message: 'Failed to create bookmark' }
        : { success: true, message: 'Bookmark created' };
    }

    case 'start_quiz':
      return { success: true, message: `Start quiz: ${action.quiz_id}` };

    case 'show_recommendation':
      return {
        success: true,
        message: `Recommended: ${action.track_id}/${action.module_id}${action.reason ? ` — ${action.reason}` : ''}`,
      };
  }
}
