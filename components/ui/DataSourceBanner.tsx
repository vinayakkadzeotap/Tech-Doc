'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

const STORAGE_KEY = 'zeoai-banner-dismissed';

export default function DataSourceBanner() {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setDismissed(localStorage.getItem(STORAGE_KEY) === '1');
  }, []);

  if (dismissed) return null;

  return (
    <div className="flex items-start gap-3 px-4 py-3 mb-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-text-secondary">
      <AlertTriangle size={14} className="text-amber-400 shrink-0 mt-0.5" />
      <div className="flex-1 space-y-1">
        <p className="font-medium text-amber-400">Some sections use sample data</p>
        <p>
          Analytics charts, ROI metrics, and leaderboard scores may show demonstration data when
          real usage data is sparse. Look for the{' '}
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-medium">
            Sample Data
          </span>{' '}
          badge on individual sections.
        </p>
      </div>
      <button
        onClick={() => {
          localStorage.setItem(STORAGE_KEY, '1');
          setDismissed(true);
        }}
        className="shrink-0 p-0.5 hover:text-text-primary transition-colors"
        aria-label="Dismiss data source banner"
      >
        <X size={12} />
      </button>
    </div>
  );
}
