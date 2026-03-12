// Server-side notification helper
export async function createNotification(
  supabase: { from: (table: string) => { insert: (data: Record<string, unknown>) => unknown } },
  userId: string,
  type: 'assignment' | 'badge' | 'milestone' | 'info',
  title: string,
  body: string,
  link?: string
) {
  await supabase.from('notifications').insert({
    user_id: userId,
    type,
    title,
    body,
    link: link || null,
  });
}
