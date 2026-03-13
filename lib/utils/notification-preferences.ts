export type NotificationType = 'assignment' | 'badge' | 'milestone' | 'nudge' | 'system';
export type NotificationChannel = 'in_app' | 'email';

export interface NotificationPreference {
  notification_type: NotificationType;
  channels: NotificationChannel[];
}

export interface UserNotificationPreferences {
  user_id: string;
  preferences: NotificationPreference[];
  updated_at: string;
}

// Default preferences for new users
export const DEFAULT_PREFERENCES: NotificationPreference[] = [
  { notification_type: 'assignment', channels: ['in_app', 'email'] },
  { notification_type: 'badge', channels: ['in_app'] },
  { notification_type: 'milestone', channels: ['in_app'] },
  { notification_type: 'nudge', channels: ['in_app', 'email'] },
  { notification_type: 'system', channels: ['in_app', 'email'] },
];

export const NOTIFICATION_TYPES: { type: NotificationType; label: string; description: string }[] = [
  { type: 'assignment', label: 'Assignments', description: 'New track assignments and due date reminders' },
  { type: 'badge', label: 'Badges', description: 'Badge earned and achievement notifications' },
  { type: 'milestone', label: 'Milestones', description: 'Track completion and progress milestones' },
  { type: 'nudge', label: 'Nudges', description: 'Learning reminders from managers' },
  { type: 'system', label: 'System', description: 'Platform updates and announcements' },
];

export const CHANNELS: { channel: NotificationChannel; label: string }[] = [
  { channel: 'in_app', label: 'In-App' },
  { channel: 'email', label: 'Email' },
];

export async function getPreferences(
  supabase: { from: (table: string) => { select: (cols: string) => { eq: (col: string, val: string) => { maybeSingle: () => Promise<{ data: UserNotificationPreferences | null; error: unknown }> } } } },
  userId: string
): Promise<NotificationPreference[]> {
  const { data } = await supabase
    .from('notification_preferences')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  return data?.preferences || DEFAULT_PREFERENCES;
}

export async function updatePreferences(
  supabase: { from: (table: string) => { upsert: (data: Record<string, unknown>) => { select: () => Promise<{ data: unknown; error: unknown }> } } },
  userId: string,
  preferences: NotificationPreference[]
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('notification_preferences')
    .upsert({
      user_id: userId,
      preferences,
      updated_at: new Date().toISOString(),
    })
    .select();

  return error
    ? { success: false, error: 'Failed to update preferences' }
    : { success: true };
}
