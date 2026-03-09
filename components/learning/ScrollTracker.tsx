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

      await supabase.from('progress').upsert({
        user_id: user.id,
        track_id: trackId,
        module_id: moduleId,
        scroll_pct: maxScroll.current,
        time_spent_seconds: timeSpent,
        status: maxScroll.current >= 90 ? 'in_progress' : 'not_started',
      }, { onConflict: 'user_id,track_id,module_id' });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Save on unmount (page leave)
    const handleBeforeUnload = () => {
      saveProgress();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Save periodically every 30s
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
