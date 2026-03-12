import { createClient } from '@/lib/supabase/client';

// Event type constants
export const EVENTS = {
  PAGE_VIEW: 'page_view',
  MODULE_START: 'module_start',
  MODULE_COMPLETE: 'module_complete',
  QUIZ_COMPLETE: 'quiz_complete',
  SEARCH: 'search',
  ASSISTANT_QUERY: 'assistant_query',
  BADGE_EARNED: 'badge_earned',
  FEEDBACK_SUBMIT: 'feedback_submit',
  ASSIGNMENT_CREATED: 'assignment_created',
} as const;

export type EventType = (typeof EVENTS)[keyof typeof EVENTS];

// Client-side event tracking
export async function trackEvent(eventType: string, eventData: Record<string, unknown> = {}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from('analytics_events').insert({
    user_id: user.id,
    event_type: eventType,
    event_data: eventData,
  });
}

// Server-side event tracking (for use in API routes with an existing supabase client)
export async function trackServerEvent(
  supabase: { from: (table: string) => { insert: (data: Record<string, unknown>) => unknown } },
  userId: string,
  eventType: string,
  eventData: Record<string, unknown> = {}
) {
  await supabase.from('analytics_events').insert({
    user_id: userId,
    event_type: eventType,
    event_data: eventData,
  });
}
