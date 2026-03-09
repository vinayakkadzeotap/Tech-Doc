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
  const saved = useRef(false);

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
      if (saved.current) return;
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const timeSpent = Math.round((Date.now() - startTime.current) / 1000);
      if (timeSpent < 3 && maxScroll.current < 5) return; // skip trivial visits

      await supabase.from('analytics_events').insert({
        user_id: user.id,
        event_type: 'module_reading',
        event_data: {
          track_id: trackId,
          module_id: moduleId,
          scroll_pct: maxScroll.current,
          time_spent_seconds: timeSpent,
        },
      });

      saved.current = true;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('beforeunload', saveProgress);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', saveProgress);
      saveProgress();
    };
  }, [trackId, moduleId]);

  return null;
}
