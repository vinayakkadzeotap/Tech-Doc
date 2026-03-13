'use client';

import { useState, useEffect } from 'react';
import { Flame, Trophy } from 'lucide-react';

interface DayData {
  date: string;
  count: number;
}

interface StreakData {
  days: DayData[];
  currentStreak: number;
  longestStreak: number;
}

function getIntensity(count: number): string {
  if (count === 0) return 'bg-bg-surface/50';
  if (count <= 1) return 'bg-green-900/50';
  if (count <= 3) return 'bg-green-700/60';
  if (count <= 5) return 'bg-green-500/70';
  return 'bg-green-400/80';
}

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

export default function StreakHeatmap() {
  const [data, setData] = useState<StreakData | null>(null);
  const [hoveredDay, setHoveredDay] = useState<{ date: string; count: number; x: number; y: number } | null>(null);

  useEffect(() => {
    fetch('/api/streaks')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setData(d))
      .catch(() => setData({ days: [], currentStreak: 0, longestStreak: 0 }));
  }, []);

  if (!data) {
    return (
      <div className="animate-pulse h-32 bg-bg-surface rounded-xl" />
    );
  }

  // Build grid: 52 weeks × 7 days, ending today
  const today = new Date();
  const dayCountMap: Record<string, number> = {};
  for (const d of data.days) {
    dayCountMap[d.date] = d.count;
  }

  // Calculate start date (52 weeks ago, aligned to Sunday)
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 364);
  // Align to Sunday
  startDate.setDate(startDate.getDate() - startDate.getDay());

  const weeks: { date: string; count: number }[][] = [];
  const current = new Date(startDate);
  let weekIdx = 0;

  while (current <= today) {
    if (!weeks[weekIdx]) weeks[weekIdx] = [];
    const key = current.toISOString().slice(0, 10);
    weeks[weekIdx].push({ date: key, count: dayCountMap[key] || 0 });

    if (current.getDay() === 6) weekIdx++;
    current.setDate(current.getDate() + 1);
  }

  // Month labels positions
  const monthPositions: { label: string; col: number }[] = [];
  let lastMonth = -1;
  for (let w = 0; w < weeks.length; w++) {
    const firstDay = weeks[w][0];
    if (firstDay) {
      const month = new Date(firstDay.date).getMonth();
      if (month !== lastMonth) {
        monthPositions.push({ label: MONTH_LABELS[month], col: w });
        lastMonth = month;
      }
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <Flame size={16} className="text-brand-amber" />
          Activity
        </h3>
        <div className="flex items-center gap-4 text-xs text-text-muted">
          <span className="flex items-center gap-1.5">
            <Flame size={12} className="text-brand-amber" />
            {data.currentStreak} day streak
          </span>
          <span className="flex items-center gap-1.5">
            <Trophy size={12} className="text-brand-amber" />
            {data.longestStreak} best
          </span>
        </div>
      </div>

      <div className="relative overflow-x-auto">
        {/* Month labels */}
        <div className="flex ml-8 mb-1">
          {monthPositions.map((mp, i) => (
            <div
              key={i}
              className="text-[10px] text-text-muted absolute"
              style={{ left: mp.col * 14 + 32 }}
            >
              {mp.label}
            </div>
          ))}
        </div>

        <div className="flex gap-0 mt-4 relative">
          {/* Day labels */}
          <div className="flex flex-col gap-[2px] mr-1 flex-shrink-0">
            {DAY_LABELS.map((label, i) => (
              <div key={i} className="h-[12px] w-7 text-[9px] text-text-muted flex items-center justify-end pr-1">
                {label}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="flex gap-[2px]">
            {weeks.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-[2px]">
                {Array.from({ length: 7 }).map((_, dayIdx) => {
                  const cell = week[dayIdx];
                  if (!cell) {
                    return <div key={dayIdx} className="w-[12px] h-[12px]" />;
                  }
                  return (
                    <div
                      key={dayIdx}
                      className={`w-[12px] h-[12px] rounded-[2px] ${getIntensity(cell.count)} transition-colors cursor-pointer hover:ring-1 hover:ring-text-muted/50`}
                      aria-label={`${cell.date}: ${cell.count} ${cell.count === 1 ? 'activity' : 'activities'}`}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setHoveredDay({ date: cell.date, count: cell.count, x: rect.left, y: rect.top });
                      }}
                      onMouseLeave={() => setHoveredDay(null)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 mt-2 ml-8">
          <span className="text-[10px] text-text-muted">Less</span>
          {[0, 1, 3, 5, 7].map((v) => (
            <div key={v} className={`w-[10px] h-[10px] rounded-[2px] ${getIntensity(v)}`} />
          ))}
          <span className="text-[10px] text-text-muted">More</span>
        </div>
      </div>

      {/* Tooltip */}
      {hoveredDay && (
        <div
          className="fixed z-50 px-2.5 py-1.5 rounded-lg bg-bg-elevated border border-border text-xs text-text-primary shadow-lg pointer-events-none"
          style={{ left: hoveredDay.x - 30, top: hoveredDay.y - 36 }}
        >
          <span className="font-medium">{hoveredDay.count} activities</span>
          <span className="text-text-muted ml-1.5">{new Date(hoveredDay.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
      )}
    </div>
  );
}
