'use client';

import { useState, useEffect, useRef } from 'react';
import {
  BarChart,
  PieChart,
  RadarChart,
  AreaChart,
  Bar,
  Pie,
  Radar,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PolarGrid,
  PolarAngleAxis,
  Legend,
} from 'recharts';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ProgressRecord {
  track_id: string;
  module_id: string;
  status: string;
  completed_at: string | null;
  time_spent_seconds: number;
}

interface QuizRecord {
  quiz_id: string;
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  created_at: string;
}

interface TrackInfo {
  id: string;
  title: string;
  color: string;
  totalModules: number;
  modules: { id: string; contentType: string }[];
}

export interface ProgressDashboardProps {
  progress: ProgressRecord[];
  quizAttempts: QuizRecord[];
  badgeCount: number;
  tracks: TrackInfo[];
}

// ---------------------------------------------------------------------------
// Custom Tooltip
// ---------------------------------------------------------------------------

function CustomTooltip({
  active,
  payload,
  label,
  suffix,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color?: string }>;
  label?: string;
  suffix?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-[#1a1a2e]/95 px-4 py-3 shadow-2xl backdrop-blur-md">
      {label && (
        <p className="mb-1 text-xs font-medium text-white/60">{label}</p>
      )}
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-semibold text-white">
          <span
            className="mr-2 inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color || '#818cf8' }}
          />
          {entry.value}
          {suffix || ''}
        </p>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Animated counter hook
// ---------------------------------------------------------------------------

function useAnimatedCounter(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) {
        raf.current = requestAnimationFrame(animate);
      }
    };
    raf.current = requestAnimationFrame(animate);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [target, duration]);

  return value;
}

// ---------------------------------------------------------------------------
// Stat Card
// ---------------------------------------------------------------------------

function StatCard({
  label,
  value,
  suffix,
  color,
  icon,
}: {
  label: string;
  value: number;
  suffix?: string;
  color: string;
  icon: React.ReactNode;
}) {
  const animatedValue = useAnimatedCounter(value);
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#12121f]/80 p-5 backdrop-blur-sm">
      <div
        className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-10 blur-2xl"
        style={{ backgroundColor: color }}
      />
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl text-lg"
          style={{ backgroundColor: `${color}20`, color }}
        >
          {icon}
        </div>
        <div>
          <div className="text-2xl font-extrabold tracking-tight text-white">
            {animatedValue}
            {suffix && (
              <span className="ml-0.5 text-base font-semibold text-white/50">
                {suffix}
              </span>
            )}
          </div>
          <div className="text-xs font-medium text-white/40">{label}</div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Chart Card
// ---------------------------------------------------------------------------

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#12121f]/80 p-5 backdrop-blur-sm">
      <h3 className="mb-4 text-sm font-bold tracking-wide text-white/70">
        {title}
      </h3>
      <div className="h-[260px] w-full">{children}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Data computation from real records
// ---------------------------------------------------------------------------

function computeActivityData(progress: ProgressRecord[]) {
  const now = new Date();
  const buckets: Record<string, number> = {};

  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    buckets[key] = 0;
  }

  for (const p of progress) {
    if (p.completed_at) {
      const key = p.completed_at.slice(0, 10);
      if (key in buckets) {
        buckets[key] += Math.round((p.time_spent_seconds || 0) / 60);
      }
    }
  }

  return Object.entries(buckets).map(([date, minutes]) => ({
    date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    minutes,
  }));
}

function computeTrackCompletion(progress: ProgressRecord[], tracks: TrackInfo[]) {
  return tracks.map((t) => {
    const completed = progress.filter(
      (p) => p.track_id === t.id && p.status === 'completed'
    ).length;
    const pct = t.totalModules > 0 ? Math.round((completed / t.totalModules) * 100) : 0;
    return { name: t.title.replace(' ', '\n'), completed: pct, color: t.color };
  });
}

function computeSkillsData(progress: ProgressRecord[], tracks: TrackInfo[]) {
  const skillMap: Record<string, string> = {
    'business-essentials': 'CDP Concepts',
    'product-mastery': 'Product Knowledge',
    'engineering': 'Technical Depth',
    'sales-enablement': 'Sales Skills',
    'cs-playbook': 'Customer Success',
  };

  return tracks.map((t) => {
    const completed = progress.filter(
      (p) => p.track_id === t.id && p.status === 'completed'
    ).length;
    const proficiency = t.totalModules > 0 ? Math.round((completed / t.totalModules) * 100) : 0;
    return {
      skill: skillMap[t.id] || t.title,
      proficiency,
      fullMark: 100,
    };
  });
}

function computeContentDistribution(progress: ProgressRecord[], tracks: TrackInfo[]) {
  const typeCount: Record<string, number> = {};
  const completedModuleIds = new Set(
    progress.filter((p) => p.status === 'completed').map((p) => p.module_id)
  );

  for (const track of tracks) {
    for (const mod of track.modules) {
      if (completedModuleIds.has(mod.id)) {
        const type = mod.contentType || 'other';
        const label = type.charAt(0).toUpperCase() + type.slice(1);
        typeCount[label] = (typeCount[label] || 0) + 1;
      }
    }
  }

  const palette = ['#3b82f6', '#a855f7', '#f59e0b', '#6366f1', '#10b981', '#ec4899'];
  let colorIdx = 0;

  return Object.entries(typeCount).map(([name, value]) => ({
    name: name + 's',
    value,
    color: palette[colorIdx++ % palette.length],
  }));
}

function computeStreak(progress: ProgressRecord[]) {
  const completedDates = new Set(
    progress
      .filter((p) => p.completed_at)
      .map((p) => p.completed_at!.slice(0, 10))
  );

  let streak = 0;
  const now = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    if (completedDates.has(key)) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }
  return streak;
}

function computeTotalHours(progress: ProgressRecord[]) {
  const totalSeconds = progress.reduce((s, p) => s + (p.time_spent_seconds || 0), 0);
  return Math.round(totalSeconds / 3600);
}

function computeQuizAverage(quizAttempts: QuizRecord[]) {
  if (quizAttempts.length === 0) return 0;
  const sum = quizAttempts.reduce((s, q) => s + q.percentage, 0);
  return Math.round(sum / quizAttempts.length);
}

// ---------------------------------------------------------------------------
// Empty State
// ---------------------------------------------------------------------------

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-8">
      <p className="text-sm text-white/40">No data yet</p>
      <p className="text-xs text-white/25 mt-1">Complete modules to see your progress</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function ProgressDashboard({
  progress,
  quizAttempts,
  badgeCount,
  tracks,
}: ProgressDashboardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activityData = computeActivityData(progress);
  const trackCompletion = computeTrackCompletion(progress, tracks);
  const skillsData = computeSkillsData(progress, tracks);
  const contentDist = computeContentDistribution(progress, tracks);
  const totalCompletedModules = progress.filter((p) => p.status === 'completed').length;

  const streak = computeStreak(progress);
  const totalHours = computeTotalHours(progress);
  const quizAvg = computeQuizAverage(quizAttempts);

  const hasAnyData = progress.length > 0;

  if (!mounted) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-20 animate-pulse rounded-2xl bg-white/5"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Learning Streak" value={streak} suffix=" days" color="#f59e0b" icon={<FireIcon />} />
        <StatCard label="Total Hours Learned" value={totalHours} suffix="h" color="#3b82f6" icon={<ClockIcon />} />
        <StatCard label="Quiz Average Score" value={quizAvg} suffix="%" color="#10b981" icon={<TargetIcon />} />
        <StatCard label="Badges Earned" value={badgeCount} color="#a855f7" icon={<TrophyIcon />} />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Area Chart: Learning Activity */}
        <ChartCard title="Learning Activity Over Time">
          {hasAnyData ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#818cf8" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fill: '#ffffff50', fontSize: 10 }} axisLine={false} tickLine={false} interval={6} />
                <YAxis tick={{ fill: '#ffffff50', fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
                <Tooltip content={<CustomTooltip suffix=" min" />} cursor={{ stroke: '#ffffff20' }} />
                <Area type="monotone" dataKey="minutes" stroke="#818cf8" strokeWidth={2.5} fill="url(#areaGradient)" animationDuration={1400} animationEasing="ease-out" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState />
          )}
        </ChartCard>

        {/* Bar Chart: Track Completion */}
        <ChartCard title="Track Completion">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trackCompletion} barSize={32}>
              <XAxis dataKey="name" tick={{ fill: '#ffffff50', fontSize: 9 }} axisLine={false} tickLine={false} interval={0} />
              <YAxis tick={{ fill: '#ffffff50', fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} width={30} />
              <Tooltip content={<CustomTooltip suffix="%" />} cursor={{ fill: '#ffffff08' }} />
              <Bar dataKey="completed" radius={[8, 8, 0, 0]} animationDuration={1200} animationEasing="ease-out">
                {trackCompletion.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Radar Chart: Skills */}
        <ChartCard title="Skills Radar">
          {hasAnyData ? (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillsData}>
                <PolarGrid stroke="#ffffff12" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: '#ffffff60', fontSize: 10 }} />
                <Radar name="Proficiency" dataKey="proficiency" stroke="#818cf8" strokeWidth={2} fill="#818cf8" fillOpacity={0.2} animationDuration={1400} animationEasing="ease-out" />
                <Tooltip content={<CustomTooltip suffix="/100" />} />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState />
          )}
        </ChartCard>

        {/* Pie Chart: Content Distribution */}
        <ChartCard title="Content Distribution">
          {contentDist.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={contentDist} cx="50%" cy="50%" innerRadius="50%" outerRadius="75%" dataKey="value" stroke="none" animationDuration={1200} animationEasing="ease-out" paddingAngle={3}>
                  {contentDist.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip suffix=" modules" />} />
                <Legend verticalAlign="bottom" iconType="circle" iconSize={8} formatter={(value: string) => <span className="text-xs text-white/60">{value}</span>} />
                <text x="50%" y="47%" textAnchor="middle" dominantBaseline="central" className="fill-white text-2xl font-extrabold">{totalCompletedModules}</text>
                <text x="50%" y="57%" textAnchor="middle" dominantBaseline="central" className="fill-white/40 text-[10px]">completed</text>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState />
          )}
        </ChartCard>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Inline SVG Icons
// ---------------------------------------------------------------------------

function FireIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}
