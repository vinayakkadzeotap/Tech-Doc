'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Zap } from 'lucide-react';
import { type RefresherCard } from '@/lib/utils/refresher-data';

interface RefresherModeProps {
  cards: RefresherCard[];
  onClose: () => void;
}

export default function RefresherMode({ cards, onClose }: RefresherModeProps) {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => Math.max(0, c - 1));
  const next = () => setCurrent((c) => Math.min(cards.length - 1, c + 1));

  return (
    <div className="relative rounded-2xl bg-bg-primary border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-bg-surface/50">
        <div className="flex items-center gap-2 text-sm font-semibold text-brand-amber">
          <Zap size={16} />
          Quick Refresher
          <span className="text-text-muted font-normal">
            {current + 1} / {cards.length}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-bg-primary/50 text-text-muted hover:text-text-primary transition-colors"
          aria-label="Close refresher"
        >
          <X size={16} />
        </button>
      </div>

      {/* Card */}
      <div className="p-6 min-h-[180px]">
        <h3 className="text-lg font-bold mb-4 text-text-primary">
          {cards[current].title}
        </h3>
        <ul className="space-y-2.5">
          {cards[current].points.map((point, i) => (
            <li
              key={i}
              className="flex items-start gap-2.5 text-sm text-text-secondary leading-relaxed"
            >
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-brand-blue flex-shrink-0" />
              {point}
            </li>
          ))}
        </ul>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-border">
        <button
          onClick={prev}
          disabled={current === 0}
          className="flex items-center gap-1 text-sm text-text-muted hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} /> Previous
        </button>

        {/* Dots */}
        <div className="flex items-center gap-1.5">
          {cards.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === current
                  ? 'bg-brand-blue w-4'
                  : 'bg-text-muted/30 hover:bg-text-muted/50'
              }`}
              aria-label={`Go to card ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={next}
          disabled={current === cards.length - 1}
          className="flex items-center gap-1 text-sm text-text-muted hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
