'use client';

import { useState, useEffect, useRef } from 'react';
import {
  LineChart,
  BarChart,
  PieChart,
  RadarChart,
  AreaChart,
  Line,
  Bar,
  Pie,
  Radar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  PolarGrid,
  PolarAngleAxis,
} from 'recharts';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ProgressDashboardProps {
  userId?: string;
}

// ---------------------------------------------------------------------------
// Deterministic seeded random (consistent per day)
// ---------------------------------------------------------------------------

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function getDaySeed(): number {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

// ---------------------------------------------------------------------------
// Demo data generators
// ---------------------------------------------------------------------------

function generateActivityData(rand: () => number) {
  const data: { date: string; minutes: number }[] = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dayOfWeek = d.getDay();
    // Weekdays tend to be higher
    const base = dayOfWeek === 0 || dayOfWeek === 6 ? 15 : 35;
    const variance = Math.floor(rand() * 50);
    data.push({
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      minutes: base + variance,
    });
  }
  return data;
}

const TRACK_DATA = [
  { name: 'Business\nEssentials', color: '#3b82f6' },
  { name: 'Product\nMastery', color: '#a855f7' },
  { name: 'Sales\nEnablement', color: '#f59e0b' },
  { name: 'CS\nPlaybook', color: '#10b981' },
  { name: 'Engineering\nDeep Dive', color: '#6366f1' },
];

function generateTrackCompletion(rand: () => number) {
  return TRACK_DATA.map((t) => ({
    name: t.name,
    completed: Math.floor(rand() * 60 + 30),
    color: t.color,
  }));
}

function generateSkillsData(rand: () => number) {
  const skills = [
    'CDP Concepts',
    'Product Knowledge',
    'Technical Depth',
    'Sales Skills',
    'Customer Success',
    'Data Architecture',
  ];
  return skills.map((skill) => ({
    skill,
    proficiency: Math.floor(rand() * 45 + 45),
    fullMark: 100,
  }));
}

function generateContentDistribution(rand: () => number) {
  const types = [
    { name: 'Concepts', color: '#3b82f6' },
    { name: 'Tutorials', color: '#a855f7' },
    { name: 'References', color: '#f59e0b' },
    { name: 'Deep Dives', color: '#6366f1' },
  ];
  return types.map((t) => ({
    name: t.name,
    value: Math.floor(rand() * 15 + 5),
    color: t.color,
  }));
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
      // ease-out cubic
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
// Chart Cards
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
// Main Component
// ---------------------------------------------------------------------------

export default function ProgressDashboard({ userId }: ProgressDashboardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Deterministic random seeded by day (and userId if present)
  const seed =
    getDaySeed() +
    (userId
      ? userId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
      : 0);
  const rand = seededRandom(seed);

  // Generate data
  const activityData = generateActivityData(rand);
  const trackCompletion = generateTrackCompletion(rand);
  const skillsData = generateSkillsData(rand);
  const contentDist = generateContentDistribution(rand);
  const totalModules = contentDist.reduce((s, d) => s + d.value, 0);

  // Summary stats
  const streak = Math.floor(rand() * 20 + 5);
  const totalHours = Math.floor(rand() * 60 + 20);
  const quizAvg = Math.floor(rand() * 20 + 78);
  const badges = Math.floor(rand() * 10 + 3);

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
        <StatCard
          label="Learning Streak"
          value={streak}
          suffix=" days"
          color="#f59e0b"
          icon={<FireIcon />}
        />
        <StatCard
          label="Total Hours Learned"
          value={totalHours}
          suffix="h"
          color="#3b82f6"
          icon={<ClockIcon />}
        />
        <StatCard
          label="Quiz Average Score"
          value={quizAvg}
          suffix="%"
          color="#10b981"
          icon={<TargetIcon />}
        />
        <StatCard
          label="Badges Earned"
          value={badges}
          color="#a855f7"
          icon={<TrophyIcon />}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Area Chart: Learning Activity */}
        <ChartCard title="Learning Activity Over Time">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activityData}>
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tick={{ fill: '#ffffff50', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                interval={6}
              />
              <YAxis
                tick={{ fill: '#ffffff50', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={30}
              />
              <Tooltip
                content={<CustomTooltip suffix=" min" />}
                cursor={{ stroke: '#ffffff20' }}
              />
              <Area
                type="monotone"
                dataKey="minutes"
                stroke="#818cf8"
                strokeWidth={2.5}
                fill="url(#areaGradient)"
                animationDuration={1400}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Bar Chart: Track Completion */}
        <ChartCard title="Track Completion">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trackCompletion} barSize={32}>
              <XAxis
                dataKey="name"
                tick={{ fill: '#ffffff50', fontSize: 9 }}
                axisLine={false}
                tickLine={false}
                interval={0}
              />
              <YAxis
                tick={{ fill: '#ffffff50', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                domain={[0, 100]}
                width={30}
              />
              <Tooltip
                content={<CustomTooltip suffix="%" />}
                cursor={{ fill: '#ffffff08' }}
              />
              <Bar
                dataKey="completed"
                radius={[8, 8, 0, 0]}
                animationDuration={1200}
                animationEasing="ease-out"
              >
                {trackCompletion.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Radar Chart: Skills */}
        <ChartCard title="Skills Radar">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart
              cx="50%"
              cy="50%"
              outerRadius="70%"
              data={skillsData}
            >
              <PolarGrid stroke="#ffffff12" />
              <PolarAngleAxis
                dataKey="skill"
                tick={{ fill: '#ffffff60', fontSize: 10 }}
              />
              <Radar
                name="Proficiency"
                dataKey="proficiency"
                stroke="#818cf8"
                strokeWidth={2}
                fill="#818cf8"
                fillOpacity={0.2}
                animationDuration={1400}
                animationEasing="ease-out"
              />
              <Tooltip content={<CustomTooltip suffix="/100" />} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Pie Chart: Content Distribution */}
        <ChartCard title="Content Distribution">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={contentDist}
                cx="50%"
                cy="50%"
                innerRadius="50%"
                outerRadius="75%"
                dataKey="value"
                stroke="none"
                animationDuration={1200}
                animationEasing="ease-out"
                paddingAngle={3}
              >
                {contentDist.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip suffix=" modules" />} />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                iconSize={8}
                formatter={(value: string) => (
                  <span className="text-xs text-white/60">{value}</span>
                )}
              />
              {/* Center label rendered as custom text */}
              <text
                x="50%"
                y="47%"
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-white text-2xl font-extrabold"
              >
                {totalModules}
              </text>
              <text
                x="50%"
                y="57%"
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-white/40 text-[10px]"
              >
                modules
              </text>
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Inline SVG Icons (avoids extra dependency for 4 icons)
// ---------------------------------------------------------------------------

function FireIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}
