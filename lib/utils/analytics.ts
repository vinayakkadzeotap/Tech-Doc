import { createClient } from '@/lib/supabase/client';

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
