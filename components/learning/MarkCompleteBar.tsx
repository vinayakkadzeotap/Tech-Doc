'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

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

    // Check if a row already exists
    const { data: existing } = await supabase
      .from('progress')
      .select('id')
      .eq('user_id', user.id)
      .eq('track_id', trackId)
      .eq('module_id', moduleId)
      .maybeSingle();

    let error;
    if (existing) {
      ({ error } = await supabase
        .from('progress')
        .update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq('id', existing.id));
    } else {
      ({ error } = await supabase.from('progress').insert({
        user_id: user.id,
        track_id: trackId,
        module_id: moduleId,
        status: 'completed',
        completed_at: new Date().toISOString(),
      }));
    }

    setLoading(false);

    if (!error) {
      setComplete(true);
      show({ message: 'Module completed! Great work.', icon: '🎉', color: '#10b981' });
      router.refresh();
    }
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
        <Button onClick={handleMarkComplete} loading={loading} size="sm">
          Mark Complete
        </Button>
      </div>
    </div>
  );
}
