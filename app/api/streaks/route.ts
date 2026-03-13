export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    // Query analytics events for this user in the last year
    const { data: events } = await supabase
      .from('analytics_events')
      .select('created_at')
      .eq('user_id', user.id)
      .gte('created_at', oneYearAgo.toISOString())
      .order('created_at', { ascending: true });

    // Also count module completions as activity
    const { data: completions } = await supabase
      .from('progress')
      .select('updated_at')
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .gte('updated_at', oneYearAgo.toISOString());

    // Group by day
    const dayCounts: Record<string, number> = {};

    for (const e of events || []) {
      const day = e.created_at.slice(0, 10);
      dayCounts[day] = (dayCounts[day] || 0) + 1;
    }
    for (const c of completions || []) {
      const day = c.updated_at.slice(0, 10);
      dayCounts[day] = (dayCounts[day] || 0) + 1;
    }

    // Convert to sorted array
    const days = Object.entries(dayCounts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Calculate streaks
    const today = new Date().toISOString().slice(0, 10);
    const activeDays = new Set(days.map((d) => d.date));

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // Current streak: count backwards from today
    const d = new Date();
    while (true) {
      const key = d.toISOString().slice(0, 10);
      if (activeDays.has(key)) {
        currentStreak++;
        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }

    // Longest streak
    const allDates = Array.from(activeDays).sort();
    for (let i = 0; i < allDates.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const prev = new Date(allDates[i - 1]);
        const curr = new Date(allDates[i]);
        const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
        tempStreak = diff === 1 ? tempStreak + 1 : 1;
      }
      longestStreak = Math.max(longestStreak, tempStreak);
    }

    return NextResponse.json({ days, currentStreak, longestStreak, today });
  } catch (error) {
    console.error('GET /api/streaks error:', error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
