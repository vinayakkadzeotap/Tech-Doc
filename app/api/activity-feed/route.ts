import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface FeedItem {
  id: string;
  type: 'completion' | 'badge' | 'certification';
  userName: string;
  detail: string;
  timestamp: string;
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const feed: FeedItem[] = [];

  // Recent module completions (last 7 days)
  const { data: completions } = await supabase
    .from('progress')
    .select('user_id, track_id, module_id, completed_at')
    .eq('status', 'completed')
    .not('completed_at', 'is', null)
    .gte('completed_at', new Date(Date.now() - 7 * 86400000).toISOString())
    .order('completed_at', { ascending: false })
    .limit(15);

  // Recent badges (last 7 days)
  const { data: badges } = await supabase
    .from('badges')
    .select('user_id, badge_id, earned_at')
    .gte('earned_at', new Date(Date.now() - 7 * 86400000).toISOString())
    .order('earned_at', { ascending: false })
    .limit(10);

  // Recent certifications (last 7 days)
  const { data: certs } = await supabase
    .from('certifications')
    .select('user_id, level, earned_at')
    .gte('earned_at', new Date(Date.now() - 7 * 86400000).toISOString())
    .order('earned_at', { ascending: false })
    .limit(5);

  // Collect user IDs
  const userIds = new Set<string>();
  completions?.forEach((c) => userIds.add(c.user_id));
  badges?.forEach((b) => userIds.add(b.user_id));
  certs?.forEach((c) => userIds.add(c.user_id));

  // Fetch user names
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name')
    .in('id', Array.from(userIds));

  const nameMap = new Map<string, string>();
  profiles?.forEach((p) => {
    const name = p.full_name || 'Anonymous';
    // Show first name + last initial for privacy
    const parts = name.split(' ');
    nameMap.set(p.id, parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1][0]}.` : parts[0]);
  });

  // Build feed
  completions?.forEach((c) => {
    feed.push({
      id: `comp-${c.user_id}-${c.module_id}`,
      type: 'completion',
      userName: nameMap.get(c.user_id) || 'Someone',
      detail: `completed "${c.module_id.replace(/-/g, ' ')}"`,
      timestamp: c.completed_at,
    });
  });

  badges?.forEach((b) => {
    feed.push({
      id: `badge-${b.user_id}-${b.badge_id}`,
      type: 'badge',
      userName: nameMap.get(b.user_id) || 'Someone',
      detail: `earned the "${b.badge_id.replace(/_/g, ' ')}" badge`,
      timestamp: b.earned_at,
    });
  });

  certs?.forEach((c) => {
    feed.push({
      id: `cert-${c.user_id}-${c.level}`,
      type: 'certification',
      userName: nameMap.get(c.user_id) || 'Someone',
      detail: `achieved ${c.level} certification`,
      timestamp: c.earned_at,
    });
  });

  // Sort by timestamp desc, take top 10
  feed.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const response = NextResponse.json(feed.slice(0, 10));
  response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
  return response;
}
