import { SupabaseClient } from '@supabase/supabase-js';
import { TRACKS } from './roles';
import { createNotification } from './notify';

const TRACK_BADGE_MAP: Record<string, string> = {
  'business-essentials': 'business_grad',
  'product-mastery': 'product_expert',
  'sales-enablement': 'sales_pro',
  'cs-playbook': 'cs_champion',
  'engineering': 'engineering_master',
};

export async function awardBadgesAfterCompletion(
  supabase: SupabaseClient,
  userId: string,
  trackId: string
) {
  const awarded: string[] = [];

  // Fetch all progress for user
  const { data: progress } = await supabase
    .from('progress')
    .select('track_id, module_id, status')
    .eq('user_id', userId);

  const completed = progress?.filter((p) => p.status === 'completed') || [];
  const completedKeys = new Set(completed.map((p) => `${p.track_id}:${p.module_id}`));

  // 1. First module badge
  if (completed.length >= 1) {
    awarded.push('first_module');
  }

  // 2. Fast learner (5+ modules completed)
  if (completed.length >= 5) {
    awarded.push('fast_learner');
  }

  // 3. Track completion badges
  for (const track of TRACKS) {
    const badgeId = TRACK_BADGE_MAP[track.id];
    if (!badgeId) continue;
    const allDone = track.modules.every((m) => completedKeys.has(`${track.id}:${m.id}`));
    if (allDone) {
      awarded.push(badgeId);
    }
  }

  // 4. All-rounder (all tracks complete)
  const allTracksComplete = TRACKS.every((track) =>
    track.modules.every((m) => completedKeys.has(`${track.id}:${m.id}`))
  );
  if (allTracksComplete) {
    awarded.push('all_rounder');
  }

  // 5. 7-day streak
  const { data: recentProgress } = await supabase
    .from('progress')
    .select('completed_at')
    .eq('user_id', userId)
    .eq('status', 'completed')
    .not('completed_at', 'is', null)
    .order('completed_at', { ascending: false })
    .limit(50);

  if (recentProgress && recentProgress.length > 0) {
    const days = new Set(
      recentProgress.map((p) => new Date(p.completed_at).toISOString().split('T')[0])
    );
    const sortedDays = Array.from(days).sort().reverse();
    let streak = 1;
    for (let i = 1; i < sortedDays.length; i++) {
      const curr = new Date(sortedDays[i]);
      const prev = new Date(sortedDays[i - 1]);
      const diff = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);
      if (diff <= 1.5) {
        streak++;
      } else {
        break;
      }
    }
    if (streak >= 7) {
      awarded.push('streak_7');
    }
  }

  // Upsert all earned badges
  if (awarded.length > 0) {
    const rows = awarded.map((badge_id) => ({
      user_id: userId,
      badge_id,
    }));
    await supabase.from('badges').upsert(rows, { onConflict: 'user_id,badge_id' });

    // Notify user of new badges
    for (const badge_id of awarded) {
      createNotification(
        supabase,
        userId,
        'badge',
        'Badge Earned!',
        `You earned the "${badge_id.replace(/_/g, ' ')}" badge!`,
        '/achievements'
      );
    }
  }

  return awarded;
}
