'use client';

import Link from 'next/link';
import Card from '@/components/ui/Card';
import Icon from '@/components/ui/Icon';
import { Sparkles, ArrowRight } from 'lucide-react';
import type { Recommendation } from '@/lib/utils/recommendations';

interface RecommendedNextProps {
  recommendations: Recommendation[];
}

export default function RecommendedNext({ recommendations }: RecommendedNextProps) {
  if (recommendations.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={18} className="text-brand-amber" />
        <h2 className="text-lg font-bold">Recommended For You</h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((rec) => (
          <Link
            key={`${rec.trackId}/${rec.moduleId}`}
            href={`/learn/${rec.trackId}/${rec.moduleId}`}
          >
            <Card hover className="h-full group">
              <div className="flex items-start gap-3 mb-3">
                <Icon name={rec.trackIcon} contained color={rec.trackColor} containerSize="md" />
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-sm truncate">{rec.moduleTitle}</h3>
                  <p className="text-xs text-text-muted mt-0.5">{rec.trackTitle}</p>
                </div>
                <ArrowRight
                  size={16}
                  className="text-text-muted group-hover:text-brand-blue group-hover:translate-x-1 transition-all flex-shrink-0 mt-1"
                />
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">{rec.reason}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
