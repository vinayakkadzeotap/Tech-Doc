'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import DataSourceIndicator from '@/components/ui/DataSourceIndicator';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Learner {
  id: string;
  name: string;
  role: string;
  team: string;
  xp: number;
  badges: number;
  streak: number;
  modulesCompleted: number;
  isCurrentUser?: boolean;
}

type TimePeriod = 'week' | 'month' | 'all';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const GOLD = '#f59e0b';
const SILVER = '#94a3b8';
const BRONZE = '#cd7c2f';

const ROLE_COLORS: Record<string, string> = {
  Engineer: '#3b82f6',
  'Data Scientist': '#a855f7',
  'Product Manager': '#10b981',
  Designer: '#ec4899',
  'Solutions Architect': '#6366f1',
  'Account Executive': '#f59e0b',
  Marketing: '#f43f5e',
  'Support Lead': '#14b8a6',
  Analyst: '#8b5cf6',
  'Team Lead': '#38bdf8',
};

const TEAMS = [
  'All Teams',
  'Engineering',
  'Data Science',
  'Product',
  'Sales',
  'Marketing',
  'Design',
  'Support',
];

const AVATAR_COLORS = [
  '#3b82f6', '#a855f7', '#10b981', '#f59e0b', '#ec4899',
  '#6366f1', '#f43f5e', '#14b8a6', '#8b5cf6', '#38bdf8',
  '#ef4444', '#22c55e', '#eab308', '#06b6d4', '#d946ef',
  '#f97316', '#84cc16', '#0ea5e9',
];

// ---------------------------------------------------------------------------
// Demo Data
// ---------------------------------------------------------------------------

const DEMO_LEARNERS: Learner[] = [
  { id: '1',  name: 'Priya Sharma',      role: 'Engineer',            team: 'Engineering',  xp: 2850, badges: 14, streak: 32, modulesCompleted: 28 },
  { id: '2',  name: 'Alex Chen',          role: 'Data Scientist',      team: 'Data Science', xp: 2720, badges: 12, streak: 28, modulesCompleted: 25 },
  { id: '3',  name: 'Sarah Mitchell',     role: 'Solutions Architect', team: 'Engineering',  xp: 2580, badges: 11, streak: 21, modulesCompleted: 24 },
  { id: '4',  name: 'James Okoro',        role: 'Product Manager',     team: 'Product',      xp: 2340, badges: 10, streak: 18, modulesCompleted: 22 },
  { id: '5',  name: 'Maria Garcia',       role: 'Engineer',            team: 'Engineering',  xp: 2210, badges: 9,  streak: 15, modulesCompleted: 20 },
  { id: '6',  name: 'David Kim',          role: 'Designer',            team: 'Design',       xp: 2050, badges: 8,  streak: 12, modulesCompleted: 19, isCurrentUser: true },
  { id: '7',  name: 'Emma Wilson',        role: 'Account Executive',   team: 'Sales',        xp: 1920, badges: 8,  streak: 24, modulesCompleted: 17 },
  { id: '8',  name: 'Raj Patel',          role: 'Engineer',            team: 'Engineering',  xp: 1870, badges: 7,  streak: 10, modulesCompleted: 16 },
  { id: '9',  name: 'Chloe Dubois',       role: 'Marketing',           team: 'Marketing',    xp: 1780, badges: 7,  streak: 14, modulesCompleted: 15 },
  { id: '10', name: 'Marcus Johnson',     role: 'Analyst',             team: 'Data Science', xp: 1650, badges: 6,  streak: 9,  modulesCompleted: 14 },
  { id: '11', name: 'Anika Desai',        role: 'Team Lead',           team: 'Engineering',  xp: 1540, badges: 6,  streak: 7,  modulesCompleted: 13 },
  { id: '12', name: 'Liam O\'Brien',      role: 'Support Lead',        team: 'Support',      xp: 1430, badges: 5,  streak: 11, modulesCompleted: 12 },
  { id: '13', name: 'Yuki Tanaka',        role: 'Data Scientist',      team: 'Data Science', xp: 1320, badges: 5,  streak: 6,  modulesCompleted: 11 },
  { id: '14', name: 'Fatima Al-Hassan',   role: 'Product Manager',     team: 'Product',      xp: 1210, badges: 4,  streak: 8,  modulesCompleted: 10 },
  { id: '15', name: 'Carlos Rivera',      role: 'Engineer',            team: 'Engineering',  xp: 1100, badges: 4,  streak: 5,  modulesCompleted: 9 },
  { id: '16', name: 'Sophie Martin',      role: 'Designer',            team: 'Design',       xp: 980,  badges: 3,  streak: 4,  modulesCompleted: 8 },
  { id: '17', name: 'Noah Andersen',      role: 'Account Executive',   team: 'Sales',        xp: 870,  badges: 3,  streak: 3,  modulesCompleted: 7 },
  { id: '18', name: 'Zara Khan',          role: 'Analyst',             team: 'Data Science', xp: 740,  badges: 2,  streak: 2,  modulesCompleted: 5 },
];

// Multipliers per time period to simulate different rankings
const PERIOD_MULTIPLIERS: Record<TimePeriod, (l: Learner, i: number) => number> = {
  week: (l, i) => Math.round(l.xp * (0.08 + Math.sin(i * 1.7) * 0.03)),
  month: (l, i) => Math.round(l.xp * (0.35 + Math.cos(i * 1.3) * 0.05)),
  all: (l) => l.xp,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function avatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function medalFor(rank: number): { icon: string; color: string } | null {
  if (rank === 1) return { icon: '\uD83E\uDD47', color: GOLD };
  if (rank === 2) return { icon: '\uD83E\uDD48', color: SILVER };
  if (rank === 3) return { icon: '\uD83E\uDD49', color: BRONZE };
  return null;
}

function formatXP(xp: number): string {
  return xp >= 1000 ? `${(xp / 1000).toFixed(1)}k` : String(xp);
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  const bg = avatarColor(name);
  const fontSize = size * 0.38;
  return (
    <div
      className="flex items-center justify-center rounded-full font-bold shrink-0 select-none"
      style={{ width: size, height: size, backgroundColor: `${bg}25`, color: bg, fontSize, border: `2px solid ${bg}40` }}
    >
      {getInitials(name)}
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const color = ROLE_COLORS[role] ?? '#94a3b8';
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded-full border whitespace-nowrap"
      style={{ backgroundColor: `${color}15`, color, borderColor: `${color}30` }}
    >
      {role}
    </span>
  );
}

function Tooltip({ children, text }: { children: React.ReactNode; text: string }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-flex" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <span className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 text-xs text-text-primary bg-bg-elevated border border-border rounded-lg shadow-card whitespace-pre-line w-56 text-center pointer-events-none animate-fade-in">
          {text}
        </span>
      )}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Podium Card
// ---------------------------------------------------------------------------

function PodiumCard({
  learner,
  rank,
  delay,
}: {
  learner: Learner & { periodXP: number };
  rank: number;
  delay: number;
}) {
  const medal = medalFor(rank)!;
  const heights: Record<number, string> = { 1: 'h-36', 2: 'h-28', 3: 'h-24' };
  const podiumHeight = heights[rank];
  const avatarSize = rank === 1 ? 64 : 52;
  const isFirst = rank === 1;

  return (
    <div
      className="flex flex-col items-center gap-2 opacity-0 animate-slide-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards', order: rank === 1 ? 1 : rank === 2 ? 0 : 2 }}
    >
      {/* Avatar + Crown */}
      <div className="relative">
        {isFirst && (
          <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-xl" aria-hidden="true">
            {'\uD83D\uDC51'}
          </span>
        )}
        <div
          className="rounded-full p-0.5"
          style={{
            background: `linear-gradient(135deg, ${medal.color}, ${medal.color}88)`,
            boxShadow: `0 0 20px ${medal.color}40`,
          }}
        >
          <Avatar name={learner.name} size={avatarSize} />
        </div>
      </div>

      {/* Name */}
      <span className="text-sm font-semibold text-text-primary text-center leading-tight max-w-[110px] truncate">
        {learner.name}
      </span>
      <RoleBadge role={learner.role} />

      {/* XP */}
      <span className="text-lg font-bold" style={{ color: medal.color }}>
        {formatXP(learner.periodXP)} XP
      </span>

      {/* Podium bar */}
      <div
        className={`w-24 ${podiumHeight} rounded-t-xl flex items-end justify-center pb-2`}
        style={{
          background: `linear-gradient(to top, ${medal.color}20, ${medal.color}08)`,
          border: `1px solid ${medal.color}30`,
          borderBottom: 'none',
        }}
      >
        <span className="text-2xl">{medal.icon}</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// List Row
// ---------------------------------------------------------------------------

function LeaderboardRow({
  learner,
  rank,
  delay,
}: {
  learner: Learner & { periodXP: number };
  rank: number;
  delay: number;
}) {
  const medal = medalFor(rank);
  const isUser = learner.isCurrentUser;

  return (
    <div
      className={`
        group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
        opacity-0 animate-fade-in
        ${isUser
          ? 'bg-brand-blue/10 border border-brand-blue/30 shadow-glow'
          : 'hover:bg-bg-hover border border-transparent'
        }
      `}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      {/* Rank */}
      <div className="w-8 text-center shrink-0">
        {medal ? (
          <span className="text-lg">{medal.icon}</span>
        ) : (
          <span className="text-sm font-bold text-text-muted">#{rank}</span>
        )}
      </div>

      {/* Avatar */}
      <Avatar name={learner.name} size={36} />

      {/* Name + Role */}
      <div className="flex flex-col min-w-0 flex-1">
        <span className={`text-sm font-semibold truncate ${isUser ? 'text-brand-cyan' : 'text-text-primary'}`}>
          {learner.name}
          {isUser && <span className="ml-1.5 text-[10px] text-brand-cyan/70">(You)</span>}
        </span>
        <RoleBadge role={learner.role} />
      </div>

      {/* Stats */}
      <div className="hidden sm:flex items-center gap-4 text-xs text-text-secondary shrink-0">
        {/* Streak */}
        <Tooltip text={`${learner.streak}-day learning streak`}>
          <span className="flex items-center gap-1">
            <span aria-hidden="true">{'\uD83D\uDD25'}</span>
            {learner.streak}d
          </span>
        </Tooltip>

        {/* Badges */}
        <Tooltip text={`${learner.badges} badges earned`}>
          <span className="flex items-center gap-1">
            <span aria-hidden="true">{'\u2B50'}</span>
            {learner.badges}
          </span>
        </Tooltip>

        {/* Modules */}
        <Tooltip text={`${learner.modulesCompleted} modules completed`}>
          <span className="flex items-center gap-1">
            <span aria-hidden="true">{'\uD83D\uDCDA'}</span>
            {learner.modulesCompleted}
          </span>
        </Tooltip>
      </div>

      {/* XP */}
      <div className="text-right shrink-0 min-w-[72px]">
        <span className={`text-sm font-bold ${medal ? '' : 'text-text-primary'}`} style={medal ? { color: medal.color } : undefined}>
          {formatXP(learner.periodXP)}
        </span>
        <span className="text-[10px] text-text-muted ml-0.5">XP</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function Leaderboard() {
  const [period, setPeriod] = useState<TimePeriod>('all');
  const [team, setTeam] = useState('All Teams');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [showYourRank, setShowYourRank] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [liveLearners, setLiveLearners] = useState<Learner[] | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const currentUserRef = useRef<HTMLDivElement>(null);

  // Fetch real leaderboard data from API
  useEffect(() => {
    fetch('/api/leaderboard')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length >= 5) {
          setLiveLearners(
            data.map((d: { id: string; name: string; role: string; team: string; xp: number; badges: number; modulesCompleted: number; isCurrentUser: boolean }) => ({
              id: d.id,
              name: d.name,
              role: d.role,
              team: d.team,
              xp: d.xp,
              badges: d.badges,
              streak: 0,
              modulesCompleted: d.modulesCompleted,
              isCurrentUser: d.isCurrentUser,
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  const activeLearners = liveLearners ?? DEMO_LEARNERS;

  // Compute ranked list
  const ranked = useMemo(() => {
    let filtered = team === 'All Teams' ? activeLearners : activeLearners.filter((l) => l.team === team);
    if (roleFilter !== 'All Roles') {
      filtered = filtered.filter((l) => l.role.toLowerCase().includes(roleFilter.toLowerCase()));
    }
    const withXP = filtered.map((l, i) => ({
      ...l,
      periodXP: PERIOD_MULTIPLIERS[period](l, i),
    }));
    withXP.sort((a, b) => b.periodXP - a.periodXP);
    return withXP;
  }, [period, team, roleFilter, activeLearners]);

  const top3 = ranked.slice(0, 3);
  const rest = ranked.slice(3);

  const currentUserRank = ranked.findIndex((l) => l.isCurrentUser) + 1;

  // Re-trigger animations on filter change
  useEffect(() => {
    setAnimKey((k) => k + 1);
  }, [period, team, roleFilter]);

  // "Your Rank" sticky banner visibility
  const checkVisibility = useCallback(() => {
    if (!currentUserRef.current || !listRef.current) {
      setShowYourRank(currentUserRank > 3);
      return;
    }
    const container = listRef.current.getBoundingClientRect();
    const user = currentUserRef.current.getBoundingClientRect();
    const visible = user.top < container.bottom && user.bottom > container.top;
    setShowYourRank(!visible && currentUserRank > 0);
  }, [currentUserRank]);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkVisibility, { passive: true });
    checkVisibility();
    return () => el.removeEventListener('scroll', checkVisibility);
  }, [checkVisibility, animKey]);

  // Points formula text
  const formulaText = '1 module = 10 XP\n1 quiz pass = 25 XP\n1 badge = 50 XP\nStreak bonus = days \u00D7 5 XP';

  const TAB_LABELS: { key: TimePeriod; label: string }[] = [
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
    { key: 'all', label: 'All Time' },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto bg-bg-surface border border-border rounded-2xl overflow-hidden relative">
      {/* ---- Header ---- */}
      <div className="px-5 pt-5 pb-3 flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xl" aria-hidden="true">{'\uD83C\uDFC6'}</span>
            <h2 className="text-lg font-bold text-text-primary">Leaderboard</h2>
            <DataSourceIndicator isLive={liveLearners !== null} compact />
            <Tooltip text={formulaText}>
              <button
                className="w-5 h-5 rounded-full bg-bg-elevated border border-border text-[10px] text-text-muted flex items-center justify-center hover:text-text-primary transition-colors"
                aria-label="Points formula info"
              >
                ?
              </button>
            </Tooltip>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-bg-elevated border border-border rounded-lg px-3 py-1.5 text-xs text-text-primary outline-none focus:border-brand-blue transition-colors cursor-pointer"
            >
              {['All Roles', 'Engineer', 'Sales', 'CS', 'Product', 'Marketing', 'Leadership', 'HR'].map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <select
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              className="bg-bg-elevated border border-border rounded-lg px-3 py-1.5 text-xs text-text-primary outline-none focus:border-brand-blue transition-colors cursor-pointer"
            >
              {TEAMS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Period Tabs */}
        <div className="flex bg-bg-elevated rounded-xl p-1 gap-1">
          {TAB_LABELS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setPeriod(key)}
              className={`
                flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200
                ${period === key
                  ? 'bg-brand-blue/20 text-brand-cyan shadow-sm'
                  : 'text-text-muted hover:text-text-secondary'
                }
              `}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ---- Your Rank Sticky Banner ---- */}
      {showYourRank && currentUserRank > 0 && (
        <div className="sticky top-0 z-30 mx-4 mb-2 px-4 py-2 rounded-lg bg-brand-blue/15 border border-brand-blue/30 backdrop-blur-md flex items-center justify-between animate-fade-in">
          <span className="text-xs font-semibold text-brand-cyan">
            Your Rank: #{currentUserRank}
          </span>
          <button
            onClick={() => {
              currentUserRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
            className="text-[10px] text-brand-cyan/70 hover:text-brand-cyan underline transition-colors"
          >
            Jump to position
          </button>
        </div>
      )}

      {/* ---- Podium ---- */}
      {top3.length >= 3 && (
        <div key={`podium-${animKey}`} className="flex justify-center items-end gap-3 px-5 pt-2 pb-1">
          <PodiumCard learner={top3[1]} rank={2} delay={150} />
          <PodiumCard learner={top3[0]} rank={1} delay={0} />
          <PodiumCard learner={top3[2]} rank={3} delay={300} />
        </div>
      )}

      {/* ---- Divider ---- */}
      <div className="mx-5 my-3 border-t border-border" />

      {/* ---- List ---- */}
      <div ref={listRef} className="px-3 pb-4 max-h-[420px] overflow-y-auto scrollbar-thin" key={`list-${animKey}`}>
        {/* Top 3 in list too for completeness on small podium scenarios */}
        {ranked.map((learner, i) => {
          const rank = i + 1;
          // Skip top 3 if podium is shown
          if (rank <= 3 && top3.length >= 3) return null;
          const isUser = learner.isCurrentUser;
          return (
            <div key={learner.id} ref={isUser ? currentUserRef : undefined}>
              <LeaderboardRow learner={learner} rank={rank} delay={Math.min(i * 50, 600)} />
            </div>
          );
        })}

        {rest.length === 0 && top3.length < 3 && (
          <p className="text-center text-sm text-text-muted py-8">
            No learners found for this filter.
          </p>
        )}
      </div>

      {/* ---- Footer ---- */}
      <div className="px-5 py-3 border-t border-border flex items-center justify-between">
        <span className="text-[10px] text-text-muted">
          {ranked.length} learner{ranked.length !== 1 ? 's' : ''} ranked
        </span>
        <span className="text-[10px] text-text-muted">
          Updated just now
        </span>
      </div>
    </div>
  );
}
