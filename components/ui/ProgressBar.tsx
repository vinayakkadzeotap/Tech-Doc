'use client';

interface ProgressBarProps {
  value: number; // 0-100
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export default function ProgressBar({
  value,
  color = '#3b82f6',
  size = 'md',
  showLabel = false,
  className = '',
}: ProgressBarProps) {
  const heights = { sm: 'h-1', md: 'h-1.5', lg: 'h-2.5' };
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className={`flex-1 ${heights[size]} bg-white/[0.06] rounded-full overflow-hidden`}
        role="progressbar"
        aria-valuenow={Math.round(clamped)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${Math.round(clamped)}% complete`}
      >
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${clamped}%`, background: `linear-gradient(90deg, ${color}, ${color}cc)` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-bold min-w-[36px] text-right" style={{ color }}>
          {Math.round(clamped)}%
        </span>
      )}
    </div>
  );
}
