import { sendSlackNotification } from './slack';

// Server-side notification helper
// Creates a DB notification and optionally forwards to Slack
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createNotification(
  supabase: any,
  userId: string,
  type: 'assignment' | 'badge' | 'milestone' | 'info',
  title: string,
  body: string,
  link?: string
) {
  // 1. Write to notifications table
  await supabase.from('notifications').insert({
    user_id: userId,
    type,
    title,
    body,
    link: link || null,
  });

  // 2. Forward to Slack if configured
  try {
    const { data: slackSettings } = await supabase
      .from('platform_settings')
      .select('value')
      .eq('key', 'slack')
      .maybeSingle();

    if (slackSettings?.value) {
      const config = slackSettings.value as { webhook_url?: string; events?: Record<string, boolean> };
      if (config.webhook_url) {
        // Check if this event type is enabled
        const typeToEvent: Record<string, string> = {
          assignment: 'assignments',
          badge: 'badges',
          milestone: 'completions',
          info: 'completions',
        };
        const eventKey = typeToEvent[type] || type;
        const events = config.events || {};
        if (events[eventKey] !== false) {
          sendSlackNotification(config.webhook_url, title, body, link || undefined);
        }
      }
    }
  } catch {
    // Slack forwarding is best-effort, don't block on failure
  }
}
