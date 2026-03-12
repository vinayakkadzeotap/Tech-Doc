'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import { Target } from 'lucide-react';
import { computeSalesReadiness, type SalesReadinessScore } from '@/lib/utils/sales-readiness';

interface SalesReadinessGaugeProps {
  progress: Array<{ track_id: string; module_id: string; status: string }>;
  quizAttempts: Array<{ quiz_id: string; percentage: number; passed: boolean }>;
}

function GaugeCircle({ score }: { score: number }) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative w-28 h-28">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="currentColor" strokeWidth="8" className="text-bg-elevated" />
        <circle
          cx="50" cy="50" r={radius} fill="none" stroke={color} strokeWidth="8"
          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-extrabold" style={{ color }}>{score}%</span>
        <span className="text-[9px] text-text-muted font-medium">READY</span>
      </div>
    </div>
  );
}

const BREAKDOWN_LABELS: Record<string, { label: string; color: string }> = {
  trackCompletion: { label: 'Track Progress', color: '#3b82f6' },
  battleCardFamiliarity: { label: 'Battle Cards', color: '#f59e0b' },
  quizPerformance: { label: 'Quiz Scores', color: '#a855f7' },
  dealPrepEngagement: { label: 'Deal Prep', color: '#10b981' },
};

export default function SalesReadinessGauge({ progress, quizAttempts }: SalesReadinessGaugeProps) {
  const [readiness, setReadiness] = useState<SalesReadinessScore | null>(null);

  useEffect(() => {
    // Fetch view counts from analytics
    fetch('/api/analytics?type=page_views&pages=battle-cards,deal-prep')
      .then((r) => r.ok ? r.json() : { battleCardViews: 0, dealPrepViews: 0 })
      .then((data) => {
        const score = computeSalesReadiness(
          progress,
          quizAttempts,
          data.battleCardViews || 0,
          data.dealPrepViews || 0
        );
        setReadiness(score);
      })
      .catch(() => {
        // Compute with zero views as fallback
        setReadiness(computeSalesReadiness(progress, quizAttempts, 0, 0));
      });
  }, [progress, quizAttempts]);

  if (!readiness) return null;

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Target size={16} className="text-brand-amber" />
        <h3 className="font-bold text-sm">Sales Readiness</h3>
      </div>

      <div className="flex items-center gap-6">
        <GaugeCircle score={readiness.overall} />

        <div className="flex-1 space-y-2">
          {Object.entries(readiness.breakdown).map(([key, value]) => {
            const config = BREAKDOWN_LABELS[key];
            return (
              <div key={key} className="flex items-center gap-2">
                <span className="text-xs text-text-muted w-24 truncate">{config.label}</span>
                <div className="flex-1 h-2 bg-bg-elevated rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${value}%`, backgroundColor: config.color }}
                  />
                </div>
                <span className="text-xs font-medium w-8 text-right">{value}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
