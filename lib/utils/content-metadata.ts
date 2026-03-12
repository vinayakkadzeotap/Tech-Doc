export type ContentStatus = 'current' | 'needs-review' | 'stale';

export interface ContentReview {
  module_id: string;
  last_reviewed: string;
  reviewed_by: string | null;
  status: ContentStatus;
  notes: string;
}

// Determine content status based on review date
export function getContentStatus(lastReviewed: string | null): ContentStatus {
  if (!lastReviewed) return 'stale';

  const daysSince = Math.floor(
    (Date.now() - new Date(lastReviewed).getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSince <= 90) return 'current';
  if (daysSince <= 180) return 'needs-review';
  return 'stale';
}

export const STATUS_CONFIG: Record<ContentStatus, { label: string; color: string; bg: string }> = {
  current: { label: 'Current', color: '#10b981', bg: '#10b98115' },
  'needs-review': { label: 'Needs Review', color: '#f59e0b', bg: '#f59e0b15' },
  stale: { label: 'Stale', color: '#ef4444', bg: '#ef444415' },
};
