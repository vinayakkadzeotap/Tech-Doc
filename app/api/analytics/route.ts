import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Check admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile?.is_admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Fetch analytics events from last 30 days
  const { data: events } = await supabase
    .from('analytics_events')
    .select('event_type, event_data, created_at, user_id')
    .gte('created_at', thirtyDaysAgo.toISOString())
    .order('created_at', { ascending: true });

  const allEvents = events || [];

  // Daily active users (last 30 days)
  const dauMap = new Map<string, Set<string>>();
  for (const e of allEvents) {
    const day = e.created_at.slice(0, 10);
    if (!dauMap.has(day)) dauMap.set(day, new Set());
    dauMap.get(day)!.add(e.user_id);
  }
  const dailyActiveUsers = Array.from(dauMap.entries())
    .map(([date, users]) => ({ date, count: users.size }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Event counts by type
  const eventCounts: Record<string, number> = {};
  for (const e of allEvents) {
    eventCounts[e.event_type] = (eventCounts[e.event_type] || 0) + 1;
  }

  // Top searched terms (from search events)
  const searchTerms: Record<string, number> = {};
  for (const e of allEvents) {
    if (e.event_type === 'search' && e.event_data?.query) {
      const q = String(e.event_data.query).toLowerCase();
      searchTerms[q] = (searchTerms[q] || 0) + 1;
    }
  }
  const topSearches = Object.entries(searchTerms)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([term, count]) => ({ term, count }));

  // Weekly stats
  const weekEvents = allEvents.filter((e) => new Date(e.created_at) >= sevenDaysAgo);
  const wau = new Set(weekEvents.map((e) => e.user_id)).size;
  const mau = new Set(allEvents.map((e) => e.user_id)).size;

  // Module completions over time
  const completionsByDay = new Map<string, number>();
  for (const e of allEvents) {
    if (e.event_type === 'module_complete') {
      const day = e.created_at.slice(0, 10);
      completionsByDay.set(day, (completionsByDay.get(day) || 0) + 1);
    }
  }
  const moduleCompletions = Array.from(completionsByDay.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Assistant queries count
  const assistantQueries = allEvents.filter((e) => e.event_type === 'assistant_query').length;

  return NextResponse.json({
    dailyActiveUsers,
    moduleCompletions,
    topSearches,
    eventCounts,
    summary: {
      wau,
      mau,
      totalEvents: allEvents.length,
      assistantQueries,
    },
  });
}
