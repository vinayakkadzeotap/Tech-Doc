'use client';

import { useState } from 'react';
import { Database, FlaskConical } from 'lucide-react';

interface DataSourceIndicatorProps {
  isLive: boolean;
  compact?: boolean;
  className?: string;
}

export default function DataSourceIndicator({ isLive, compact = false, className = '' }: DataSourceIndicatorProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const label = isLive ? 'Live Data' : 'Sample Data';
  const Icon = isLive ? Database : FlaskConical;

  if (compact) {
    return (
      <span
        className={`relative inline-flex items-center gap-1 ${className}`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-green-400' : 'bg-amber-400'}`}
        />
        {showTooltip && (
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 rounded-md bg-bg-elevated border border-border text-[10px] text-text-primary whitespace-nowrap z-50 shadow-lg">
            {isLive
              ? 'Showing real data from your database'
              : 'Showing sample data for demonstration'}
          </span>
        )}
      </span>
    );
  }

  return (
    <span
      className={`relative inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border ${
        isLive
          ? 'bg-green-500/10 text-green-400 border-green-500/20'
          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      } ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <Icon size={10} />
      {label}
      {showTooltip && (
        <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-1 rounded-md bg-bg-elevated border border-border text-[10px] text-text-primary whitespace-nowrap z-50 shadow-lg">
          {isLive
            ? 'Showing real data from your database'
            : 'Showing sample data for demonstration'}
        </span>
      )}
    </span>
  );
}
