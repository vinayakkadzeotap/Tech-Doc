'use client';

import { useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Props {
  trackId: string;
  moduleId: string;
}

export default function ScrollTracker({ trackId, moduleId }: Props) {
  const startTime = useRef(Date.now());
  const maxScroll = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const pct = Math.round((window.scrollY / scrollHeight) * 100);
        if (pct > maxScroll.current) {
          maxScroll.current = pct;
        }
      }
    };

    const saveProgress = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const timeSpent = Math.round((Date.now() - startTime.current) / 1000);

      // Use select + insert/update to avoid 409 when unique constraint is missing
      const { data: existing } = await supabase
        .from('progress')
        .select('id, scroll_pct, time_spent_seconds, status')
        .eq('user_id', user.id)
        .eq('track_id', trackId)
        .eq('module_id', moduleId)
        .maybeSingle();

      if (existing) {
        // Only update scroll/time, never downgrade status
        const updates: Record<string, unknown> = {
          scroll_pct: Math.max(maxScroll.current, existing.scroll_pct || 0),
          time_spent_seconds: (existing.time_spent_seconds || 0) + timeSpent,
        };
        if (existing.status !== 'completed' && maxScroll.current >= 90) {
          updates.status = 'in_progress';
        }
        await supabase.from('progress').update(updates).eq('id', existing.id);
      } else {
        await supabase.from('progress').insert({
          user_id: user.id,
          track_id: trackId,
          module_id: moduleId,
          scroll_pct: maxScroll.current,
          time_spent_seconds: timeSpent,
          status: maxScroll.current >= 90 ? 'in_progress' : 'not_started',
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const handleBeforeUnload = () => {
      saveProgress();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    const interval = setInterval(saveProgress, 30000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearInterval(interval);
      saveProgress();
    };
  }, [trackId, moduleId]);

  return null;
}
