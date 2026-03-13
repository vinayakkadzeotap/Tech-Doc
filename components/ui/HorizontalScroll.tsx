'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function HorizontalScroll({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll, { passive: true });
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      ro.disconnect();
    };
  }, [checkScroll]);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
  };

  return (
    <div className={`relative group ${className}`}>
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-bg-surface border border-border shadow-lg flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-border-strong transition-all"
          aria-label="Scroll left"
        >
          <ChevronLeft size={16} />
        </button>
      )}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
      >
        {children}
      </div>
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-bg-surface border border-border shadow-lg flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-border-strong transition-all"
          aria-label="Scroll right"
        >
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
}
