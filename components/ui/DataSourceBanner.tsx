'use client';

import { useState, useEffect } from 'react';
import { Info, X } from 'lucide-react';

const STORAGE_KEY = 'zeoai-banner-dismissed';

export default function DataSourceBanner() {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setDismissed(localStorage.getItem(STORAGE_KEY) === '1');
  }, []);

  if (dismissed) return null;

  return (
    <div className="flex items-center gap-2 px-4 py-2 mb-4 rounded-xl bg-brand-blue/5 border border-brand-blue/15 text-xs text-text-muted">
      <Info size={14} className="text-brand-blue shrink-0" />
      <span>
        Content curated from internal documentation and public sources. Ready for live system integration.
      </span>
      <button
        onClick={() => {
          localStorage.setItem(STORAGE_KEY, '1');
          setDismissed(true);
        }}
        className="ml-auto shrink-0 p-0.5 hover:text-text-primary transition-colors"
        aria-label="Dismiss"
      >
        <X size={12} />
      </button>
    </div>
  );
}
