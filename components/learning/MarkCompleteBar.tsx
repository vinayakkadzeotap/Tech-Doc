'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { BADGES } from '@/lib/utils/badges';
import { TRACKS } from '@/lib/utils/roles';
import { trackEvent } from '@/lib/utils/analytics';

interface Props {
  trackId: string;
  moduleId: string;
  isComplete: boolean;
}

export default function MarkCompleteBar({ trackId, moduleId, isComplete }: Props) {
  const [complete, setComplete] = useState(isComplete);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { show } = useToast();

  const handleMarkComplete = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    // Use select + insert/update to avoid 409 when unique constraint is missing
    const { data: existing } = await supabase
      .from('progress')
      .select('id')
      .eq('user_id', user.id)
      .eq('track_id', trackId)
      .eq('module_id', moduleId)
      .maybeSingle();

    const now = new Date().toISOString();
    const { error } = existing
      ? await supabase.from('progress').update({
          status: 'completed',
          completed_at: now,
        }).eq('id', existing.id)
      : await supabase.from('progress').insert({
          user_id: user.id,
          track_id: trackId,
          module_id: moduleId,
          status: 'completed',
          completed_at: now,
        });

    if (!error) {
      setComplete(true);
      show({ message: 'Module completed! Great work.', icon: '🎉', color: '#10b981' });
      trackEvent('module_completed', { trackId, moduleId });

      // Check and award badges
      const { data: allProgress } = await supabase
        .from('progress')
        .select('track_id, module_id, status')
        .eq('user_id', user.id)
        .eq('status', 'completed');

      const completedKeys = new Set(
        allProgress?.map((p) => `${p.track_id}:${p.module_id}`) || []
      );

      // First module badge
      if (completedKeys.size === 1) {
        await supabase.from('badges').upsert(
          { user_id: user.id, badge_id: 'first_module' },
          { onConflict: 'user_id,badge_id' }
        );
        show({ message: 'Badge Unlocked: First Steps!', icon: '🌱', color: '#10b981' });
      }

      // Fast learner (5+ modules)
      if (completedKeys.size >= 5) {
        const { data: existing } = await supabase
          .from('badges')
          .select('id')
          .eq('user_id', user.id)
          .eq('badge_id', 'fast_learner')
          .maybeSingle();
        if (!existing) {
          await supabase.from('badges').upsert(
            { user_id: user.id, badge_id: 'fast_learner' },
            { onConflict: 'user_id,badge_id' }
          );
          show({ message: 'Badge Unlocked: Fast Learner!', icon: '⚡', color: '#a78bfa' });
        }
      }

      // Track completion badges
      const trackBadgeMap: Record<string, string> = {
        'business-essentials': 'business_grad',
        'product-mastery': 'product_expert',
        'sales-enablement': 'sales_pro',
        'cs-playbook': 'cs_champion',
        'engineering': 'engineering_master',
      };
      const track = TRACKS.find((t) => t.id === trackId);
      if (track) {
        const allDone = track.modules.every((m) => completedKeys.has(`${track.id}:${m.id}`));
        if (allDone && trackBadgeMap[trackId]) {
          const badgeId = trackBadgeMap[trackId];
          const badge = BADGES[badgeId];
          await supabase.from('badges').upsert(
            { user_id: user.id, badge_id: badgeId },
            { onConflict: 'user_id,badge_id' }
          );
          show({ message: `Badge Unlocked: ${badge?.title}!`, icon: badge?.icon || '🏆', color: badge?.color || '#f59e0b' });
        }
      }

      // All-rounder check
      const allTracksComplete = TRACKS.every((t) =>
        t.modules.every((m) => completedKeys.has(`${t.id}:${m.id}`))
      );
      if (allTracksComplete) {
        await supabase.from('badges').upsert(
          { user_id: user.id, badge_id: 'all_rounder' },
          { onConflict: 'user_id,badge_id' }
        );
        show({ message: 'Badge Unlocked: All-Rounder!', icon: '👑', color: '#f43f5e' });
      }

      router.refresh();
    }

    setLoading(false);
  };

  if (complete) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-brand-green/10 border-t border-brand-green/30 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-brand-green font-medium">
            <span>✓</span> Module completed
          </div>
          <Button variant="ghost" size="sm" onClick={() => router.push('/learn')}>
            Back to Learning Hub
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-bg-secondary/95 border-t border-border backdrop-blur-xl">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <p className="text-sm text-text-secondary">
          Finished reading? Mark this module as complete.
        </p>
        <Button onClick={handleMarkComplete} loading={loading} size="sm" aria-label="Mark module as complete">
          Mark Complete
        </Button>
      </div>
    </div>
  );
}
