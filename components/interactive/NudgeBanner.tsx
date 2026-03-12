'use client';

import { useState, useEffect } from 'react';
import { X, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Nudge {
  id: string;
  message: string;
  cta: string;
  link: string;
  color: string;
}

export default function NudgeBanner() {
  const [nudges, setNudges] = useState<Nudge[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load dismissed nudges from session
    const stored = sessionStorage.getItem('dismissed-nudges');
    if (stored) setDismissed(new Set(JSON.parse(stored)));

    fetch('/api/nudges')
      .then((r) => r.ok ? r.json() : [])
      .then((data) => setNudges(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const dismiss = (id: string) => {
    const next = new Set(dismissed);
    next.add(id);
    setDismissed(next);
    sessionStorage.setItem('dismissed-nudges', JSON.stringify(Array.from(next)));
  };

  const visible = nudges.filter((n) => !dismissed.has(n.id));
  if (visible.length === 0) return null;

  return (
    <div className="space-y-3">
      {visible.map((nudge) => (
        <div
          key={nudge.id}
          className="relative flex items-center justify-between gap-4 px-5 py-3.5 rounded-xl border border-white/[0.06] overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${nudge.color}15, ${nudge.color}08)`,
            borderColor: `${nudge.color}30`,
          }}
        >
          <p className="text-sm text-text-primary font-medium flex-1">{nudge.message}</p>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href={nudge.link}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: nudge.color }}
            >
              {nudge.cta}
              <ArrowRight size={12} />
            </Link>
            <button
              onClick={() => dismiss(nudge.id)}
              className="p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-white/[0.06] transition-colors"
              aria-label="Dismiss nudge"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
