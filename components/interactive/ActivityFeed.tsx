'use client';

import { useState, useEffect, useCallback } from 'react';
import { BookOpen, Award, GraduationCap } from 'lucide-react';

interface FeedItem {
  id: string;
  type: 'completion' | 'badge' | 'certification';
  userName: string;
  detail: string;
  timestamp: string;
}

const typeConfig = {
  completion: { icon: BookOpen, color: '#3b82f6', bg: '#3b82f6' },
  badge: { icon: Award, color: '#f59e0b', bg: '#f59e0b' },
  certification: { icon: GraduationCap, color: '#8b5cf6', bg: '#8b5cf6' },
};

function formatTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// Sample feed for demo when real data is sparse
const SAMPLE_FEED: FeedItem[] = [
  { id: 's1', type: 'completion', userName: 'Priya S.', detail: 'completed "audience builder"', timestamp: new Date(Date.now() - 1200000).toISOString() },
  { id: 's2', type: 'badge', userName: 'Marco R.', detail: 'earned the "fast learner" badge', timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: 's3', type: 'completion', userName: 'Sarah K.', detail: 'completed "identity resolution"', timestamp: new Date(Date.now() - 7200000).toISOString() },
  { id: 's4', type: 'certification', userName: 'Alex T.', detail: 'achieved foundation certification', timestamp: new Date(Date.now() - 14400000).toISOString() },
  { id: 's5', type: 'completion', userName: 'Jordan L.', detail: 'completed "data ingestion"', timestamp: new Date(Date.now() - 28800000).toISOString() },
];

export default function ActivityFeed() {
  const [feed, setFeed] = useState<FeedItem[]>([]);

  const fetchFeed = useCallback(async () => {
    try {
      const res = await fetch('/api/activity-feed');
      if (!res.ok) return;
      const data = await res.json();
      setFeed(Array.isArray(data) && data.length >= 3 ? data : SAMPLE_FEED);
    } catch {
      setFeed(SAMPLE_FEED);
    }
  }, []);

  useEffect(() => {
    fetchFeed();
    const interval = setInterval(fetchFeed, 60_000);
    return () => clearInterval(interval);
  }, [fetchFeed]);

  if (feed.length === 0) return null;

  return (
    <div className="space-y-2" role="feed" aria-label="Recent activity feed">
      {feed.slice(0, 5).map((item) => {
        const config = typeConfig[item.type];
        const IconComp = config.icon;
        return (
          <div
            key={item.id}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-bg-surface/50 border border-white/[0.04]"
            aria-label={`${item.userName} ${item.detail} — ${formatTime(item.timestamp)}`}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${config.bg}15` }}
            >
              <IconComp size={14} style={{ color: config.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-text-primary truncate">
                <span className="font-semibold">{item.userName}</span>{' '}
                <span className="text-text-muted">{item.detail}</span>
              </p>
            </div>
            <span className="text-[10px] text-text-muted/60 shrink-0">{formatTime(item.timestamp)}</span>
          </div>
        );
      })}
    </div>
  );
}
