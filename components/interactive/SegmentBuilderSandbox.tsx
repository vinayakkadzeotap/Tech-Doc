'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type FieldName =
  | 'Age'
  | 'Country'
  | 'Purchase Amount'
  | 'Last Active'
  | 'Device Type'
  | 'Email Opened'
  | 'Page Views';

type Operator =
  | 'equals'
  | 'not equals'
  | 'greater than'
  | 'less than'
  | 'contains'
  | 'between';

type LogicGate = 'AND' | 'OR';

interface Condition {
  id: string;
  field: FieldName;
  operator: Operator;
  value: string;
  value2: string; // second value for "between"
}

interface SampleProfile {
  name: string;
  age: number;
  country: string;
  purchaseAmount: number;
  lastActiveDays: number;
  device: string;
  emailOpened: boolean;
  pageViews: number;
}

interface Template {
  label: string;
  description: string;
  conditions: Omit<Condition, 'id'>[];
  logic: LogicGate;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const FIELDS: FieldName[] = [
  'Age',
  'Country',
  'Purchase Amount',
  'Last Active',
  'Device Type',
  'Email Opened',
  'Page Views',
];

const OPERATORS: Operator[] = [
  'equals',
  'not equals',
  'greater than',
  'less than',
  'contains',
  'between',
];

const TOTAL_USERS = 1_000_000;

const TEMPLATES: Template[] = [
  {
    label: 'High-Value Customers',
    description: 'Purchase > $500 AND Last Active < 30 days',
    conditions: [
      { field: 'Purchase Amount', operator: 'greater than', value: '500', value2: '' },
      { field: 'Last Active', operator: 'less than', value: '30', value2: '' },
    ],
    logic: 'AND',
  },
  {
    label: 'At-Risk Users',
    description: 'Last Active > 90 days AND Email Opened = false',
    conditions: [
      { field: 'Last Active', operator: 'greater than', value: '90', value2: '' },
      { field: 'Email Opened', operator: 'equals', value: 'false', value2: '' },
    ],
    logic: 'AND',
  },
  {
    label: 'Mobile Shoppers',
    description: 'Device = Mobile AND Purchase > $100',
    conditions: [
      { field: 'Device Type', operator: 'equals', value: 'Mobile', value2: '' },
      { field: 'Purchase Amount', operator: 'greater than', value: '100', value2: '' },
    ],
    logic: 'AND',
  },
];

/* Fake profile pool */
const PROFILE_POOL: SampleProfile[] = [
  { name: 'Priya Sharma', age: 28, country: 'India', purchaseAmount: 720, lastActiveDays: 3, device: 'Mobile', emailOpened: true, pageViews: 54 },
  { name: 'James Walker', age: 42, country: 'USA', purchaseAmount: 1200, lastActiveDays: 1, device: 'Desktop', emailOpened: true, pageViews: 112 },
  { name: 'Maria Garcia', age: 35, country: 'Spain', purchaseAmount: 340, lastActiveDays: 14, device: 'Mobile', emailOpened: false, pageViews: 23 },
  { name: 'Liam Chen', age: 24, country: 'Singapore', purchaseAmount: 95, lastActiveDays: 120, device: 'Mobile', emailOpened: false, pageViews: 8 },
  { name: 'Aisha Obi', age: 31, country: 'Nigeria', purchaseAmount: 610, lastActiveDays: 7, device: 'Tablet', emailOpened: true, pageViews: 67 },
  { name: 'Tom Müller', age: 55, country: 'Germany', purchaseAmount: 2300, lastActiveDays: 2, device: 'Desktop', emailOpened: true, pageViews: 201 },
  { name: 'Sakura Tanaka', age: 22, country: 'Japan', purchaseAmount: 180, lastActiveDays: 45, device: 'Mobile', emailOpened: false, pageViews: 31 },
  { name: 'Elena Rossi', age: 39, country: 'Italy', purchaseAmount: 890, lastActiveDays: 10, device: 'Desktop', emailOpened: true, pageViews: 89 },
  { name: 'Raj Patel', age: 47, country: 'India', purchaseAmount: 60, lastActiveDays: 200, device: 'Mobile', emailOpened: false, pageViews: 4 },
  { name: 'Sophie Dupont', age: 33, country: 'France', purchaseAmount: 550, lastActiveDays: 25, device: 'Tablet', emailOpened: true, pageViews: 72 },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

let _idCounter = 0;
function uid(): string {
  _idCounter += 1;
  return `cond_${Date.now()}_${_idCounter}`;
}

function defaultCondition(): Condition {
  return { id: uid(), field: 'Age', operator: 'equals', value: '', value2: '' };
}

/** Deterministic audience-size estimate based on conditions. */
function estimateAudience(conditions: Condition[], logic: LogicGate): number {
  if (conditions.length === 0) return TOTAL_USERS;

  const fractions = conditions.map((c) => {
    if (!c.value && c.operator !== 'between') return 1;
    switch (c.field) {
      case 'Age': {
        const v = parseFloat(c.value);
        if (Number.isNaN(v)) return 1;
        if (c.operator === 'equals') return 0.02;
        if (c.operator === 'not equals') return 0.98;
        if (c.operator === 'greater than') return Math.max(0.01, 1 - v / 100);
        if (c.operator === 'less than') return Math.min(0.99, v / 100);
        if (c.operator === 'between') {
          const v2 = parseFloat(c.value2);
          if (Number.isNaN(v2)) return 0.5;
          return Math.min(0.99, Math.abs(v2 - v) / 100);
        }
        return 0.5;
      }
      case 'Country':
        if (!c.value) return 1;
        if (c.operator === 'equals') return 0.12;
        if (c.operator === 'not equals') return 0.88;
        if (c.operator === 'contains') return 0.18;
        return 0.5;
      case 'Purchase Amount': {
        const v = parseFloat(c.value);
        if (Number.isNaN(v)) return 1;
        if (c.operator === 'greater than') return Math.max(0.01, 1 - v / 2000);
        if (c.operator === 'less than') return Math.min(0.99, v / 2000);
        if (c.operator === 'equals') return 0.03;
        if (c.operator === 'between') {
          const v2 = parseFloat(c.value2);
          if (Number.isNaN(v2)) return 0.4;
          return Math.min(0.99, Math.abs(v2 - v) / 2000);
        }
        return 0.5;
      }
      case 'Last Active': {
        const v = parseFloat(c.value);
        if (Number.isNaN(v)) return 1;
        if (c.operator === 'less than') return Math.min(0.99, v / 365);
        if (c.operator === 'greater than') return Math.max(0.01, 1 - v / 365);
        if (c.operator === 'equals') return 0.01;
        return 0.5;
      }
      case 'Device Type':
        if (!c.value) return 1;
        if (c.operator === 'equals') return 0.35;
        if (c.operator === 'not equals') return 0.65;
        return 0.5;
      case 'Email Opened':
        if (c.value === 'true' && c.operator === 'equals') return 0.4;
        if (c.value === 'false' && c.operator === 'equals') return 0.6;
        if (c.operator === 'not equals') return c.value === 'true' ? 0.6 : 0.4;
        return 0.5;
      case 'Page Views': {
        const v = parseFloat(c.value);
        if (Number.isNaN(v)) return 1;
        if (c.operator === 'greater than') return Math.max(0.01, 1 - v / 500);
        if (c.operator === 'less than') return Math.min(0.99, v / 500);
        if (c.operator === 'equals') return 0.02;
        return 0.5;
      }
      default:
        return 0.5;
    }
  });

  let combined: number;
  if (logic === 'AND') {
    combined = fractions.reduce((a, b) => a * b, 1);
  } else {
    // OR: P(A ∪ B) ≈ 1 - Π(1 - Pi)
    combined = 1 - fractions.reduce((a, b) => a * (1 - b), 1);
  }

  return Math.max(100, Math.round(combined * TOTAL_USERS));
}

/** Check if a profile matches conditions. */
function profileMatches(p: SampleProfile, conditions: Condition[], logic: LogicGate): boolean {
  if (conditions.length === 0) return true;

  const results = conditions.map((c) => {
    const fieldValue = (() => {
      switch (c.field) {
        case 'Age': return p.age;
        case 'Country': return p.country;
        case 'Purchase Amount': return p.purchaseAmount;
        case 'Last Active': return p.lastActiveDays;
        case 'Device Type': return p.device;
        case 'Email Opened': return p.emailOpened;
        case 'Page Views': return p.pageViews;
        default: return null;
      }
    })();
    if (fieldValue === null || !c.value) return true;

    const numField = typeof fieldValue === 'number' ? fieldValue : NaN;
    const numValue = parseFloat(c.value);

    switch (c.operator) {
      case 'equals':
        if (typeof fieldValue === 'boolean') return String(fieldValue) === c.value;
        if (!Number.isNaN(numField) && !Number.isNaN(numValue)) return numField === numValue;
        return String(fieldValue).toLowerCase() === c.value.toLowerCase();
      case 'not equals':
        if (typeof fieldValue === 'boolean') return String(fieldValue) !== c.value;
        if (!Number.isNaN(numField) && !Number.isNaN(numValue)) return numField !== numValue;
        return String(fieldValue).toLowerCase() !== c.value.toLowerCase();
      case 'greater than':
        return !Number.isNaN(numField) && !Number.isNaN(numValue) && numField > numValue;
      case 'less than':
        return !Number.isNaN(numField) && !Number.isNaN(numValue) && numField < numValue;
      case 'contains':
        return String(fieldValue).toLowerCase().includes(c.value.toLowerCase());
      case 'between': {
        const numValue2 = parseFloat(c.value2);
        return !Number.isNaN(numField) && !Number.isNaN(numValue) && !Number.isNaN(numValue2) && numField >= numValue && numField <= numValue2;
      }
      default:
        return true;
    }
  });

  return logic === 'AND' ? results.every(Boolean) : results.some(Boolean);
}

function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}

/* ------------------------------------------------------------------ */
/*  Animated number hook                                               */
/* ------------------------------------------------------------------ */

function useAnimatedNumber(target: number, duration = 600): number {
  const [display, setDisplay] = useState(target);
  const rafRef = useRef<number>(0);
  const startRef = useRef({ value: target, time: 0 });

  useEffect(() => {
    const start = display;
    const startTime = performance.now();
    startRef.current = { value: start, time: startTime };

    function tick(now: number) {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const ease = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(start + (target - start) * ease));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration]);

  return display;
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function ConditionRow({
  condition,
  index,
  onChange,
  onRemove,
  canRemove,
}: {
  condition: Condition;
  index: number;
  onChange: (id: string, patch: Partial<Condition>) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}) {
  return (
    <div
      className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-bg-elevated/60 border border-border
                 animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Field */}
      <select
        aria-label="Field"
        value={condition.field}
        onChange={(e) => onChange(condition.id, { field: e.target.value as FieldName })}
        className="bg-bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary
                   focus:outline-none focus:border-emerald-500/60 transition-colors min-w-[140px]"
      >
        {FIELDS.map((f) => (
          <option key={f} value={f}>{f}</option>
        ))}
      </select>

      {/* Operator */}
      <select
        aria-label="Operator"
        value={condition.operator}
        onChange={(e) => onChange(condition.id, { operator: e.target.value as Operator })}
        className="bg-bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary
                   focus:outline-none focus:border-emerald-500/60 transition-colors min-w-[130px]"
      >
        {OPERATORS.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>

      {/* Value */}
      <input
        aria-label="Value"
        type="text"
        placeholder="value"
        value={condition.value}
        onChange={(e) => onChange(condition.id, { value: e.target.value })}
        className="bg-bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary
                   placeholder:text-text-muted focus:outline-none focus:border-emerald-500/60 transition-colors
                   w-28"
      />

      {/* Second value for between */}
      {condition.operator === 'between' && (
        <>
          <span className="text-text-muted text-sm">and</span>
          <input
            aria-label="Second value"
            type="text"
            placeholder="value"
            value={condition.value2}
            onChange={(e) => onChange(condition.id, { value2: e.target.value })}
            className="bg-bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary
                       placeholder:text-text-muted focus:outline-none focus:border-emerald-500/60 transition-colors
                       w-28"
          />
        </>
      )}

      {/* Remove button */}
      {canRemove && (
        <button
          aria-label="Remove condition"
          onClick={() => onRemove(condition.id)}
          className="ml-auto flex items-center justify-center w-8 h-8 rounded-lg text-text-muted
                     hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}

function AudienceMeter({ audience, total }: { audience: number; total: number }) {
  const animated = useAnimatedNumber(audience);
  const pct = (audience / total) * 100;

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <span className="text-text-secondary text-sm font-medium">Estimated Audience</span>
        <span className="text-xs text-text-muted">of {formatNumber(total)} total</span>
      </div>

      {/* Big number */}
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-emerald-400 tabular-nums tracking-tight">
          {formatNumber(animated)}
        </span>
        <span className="text-sm text-text-muted">users</span>
      </div>

      {/* Bar gauge */}
      <div className="relative h-3 rounded-full bg-bg-elevated overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-green transition-all duration-700 ease-out"
          style={{ width: `${Math.max(pct, 0.5)}%` }}
        />
      </div>

      {/* Percentage */}
      <p className="text-right text-sm font-medium text-emerald-400 tabular-nums">
        {pct < 0.01 ? '< 0.01' : pct.toFixed(2)}%
      </p>
    </div>
  );
}

function ProfileCard({ profile }: { profile: SampleProfile }) {
  const initials = profile.name
    .split(' ')
    .map((w) => w[0])
    .join('');

  return (
    <div className="p-3 rounded-xl bg-bg-elevated/60 border border-border space-y-2 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-xs font-semibold text-emerald-400">
          {initials}
        </div>
        <div>
          <p className="text-sm font-medium text-text-primary">{profile.name}</p>
          <p className="text-xs text-text-muted">{profile.country}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
        <span className="text-text-muted">Age</span>
        <span className="text-text-secondary text-right">{profile.age}</span>
        <span className="text-text-muted">Purchase</span>
        <span className="text-text-secondary text-right">${formatNumber(profile.purchaseAmount)}</span>
        <span className="text-text-muted">Last Active</span>
        <span className="text-text-secondary text-right">{profile.lastActiveDays}d ago</span>
        <span className="text-text-muted">Device</span>
        <span className="text-text-secondary text-right">{profile.device}</span>
        <span className="text-text-muted">Email Opened</span>
        <span className="text-text-secondary text-right">{profile.emailOpened ? 'Yes' : 'No'}</span>
        <span className="text-text-muted">Page Views</span>
        <span className="text-text-secondary text-right">{profile.pageViews}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function SegmentBuilderSandbox() {
  const [conditions, setConditions] = useState<Condition[]>([defaultCondition()]);
  const [logic, setLogic] = useState<LogicGate>('AND');

  /* Derived values */
  const audience = useMemo(
    () => estimateAudience(conditions, logic),
    [conditions, logic],
  );

  const matchingProfiles = useMemo(
    () => PROFILE_POOL.filter((p) => profileMatches(p, conditions, logic)).slice(0, 4),
    [conditions, logic],
  );

  /* Handlers */
  const handleChange = useCallback((id: string, patch: Partial<Condition>) => {
    setConditions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    );
  }, []);

  const handleRemove = useCallback((id: string) => {
    setConditions((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const handleAdd = useCallback(() => {
    setConditions((prev) => [...prev, defaultCondition()]);
  }, []);

  const handleTemplate = useCallback((tpl: Template) => {
    setConditions(
      tpl.conditions.map((c) => ({ ...c, id: uid() })),
    );
    setLogic(tpl.logic);
  }, []);

  const handleReset = useCallback(() => {
    setConditions([defaultCondition()]);
    setLogic('AND');
  }, []);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/25">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="3" stroke="#10b981" strokeWidth="2" />
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
            Segment Builder Sandbox
          </h2>
          <p className="text-sm text-text-muted mt-1">
            Build audience segments visually and watch the audience size change in real-time.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="self-start px-4 py-2 text-sm rounded-lg border border-border text-text-secondary
                     hover:border-border-strong hover:text-text-primary transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Templates */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Quick Templates</p>
        <div className="flex flex-wrap gap-2">
          {TEMPLATES.map((tpl) => (
            <button
              key={tpl.label}
              onClick={() => handleTemplate(tpl)}
              className="group px-4 py-2.5 rounded-xl border border-border bg-bg-surface/50
                         hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all text-left"
            >
              <p className="text-sm font-medium text-text-primary group-hover:text-emerald-400 transition-colors">
                {tpl.label}
              </p>
              <p className="text-xs text-text-muted mt-0.5">{tpl.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Rule builder (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-border bg-bg-surface/50 backdrop-blur-sm p-5 space-y-4">
            {/* Logic toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-text-secondary">Match</span>
              <button
                onClick={() => setLogic((l) => (l === 'AND' ? 'OR' : 'AND'))}
                className={`
                  relative flex items-center w-[88px] h-9 rounded-lg border transition-colors text-sm font-semibold
                  ${logic === 'AND'
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                    : 'border-amber-500/40 bg-amber-500/10 text-amber-400'
                  }
                `}
              >
                <span
                  className={`
                    absolute top-1 h-7 w-10 rounded-md transition-all duration-300
                    ${logic === 'AND'
                      ? 'left-1 bg-emerald-500/20'
                      : 'left-[42px] bg-amber-500/20'
                    }
                  `}
                />
                <span className="relative z-10 flex-1 text-center">AND</span>
                <span className="relative z-10 flex-1 text-center">OR</span>
              </button>
              <span className="text-sm text-text-muted">of the following conditions</span>
            </div>

            {/* Condition rows */}
            <div className="space-y-2">
              {conditions.map((c, i) => (
                <div key={c.id}>
                  {i > 0 && (
                    <div className="flex items-center gap-2 py-1 pl-4">
                      <span
                        className={`text-xs font-bold uppercase tracking-wider ${
                          logic === 'AND' ? 'text-emerald-500/70' : 'text-amber-500/70'
                        }`}
                      >
                        {logic}
                      </span>
                      <div className="flex-1 h-px bg-border" />
                    </div>
                  )}
                  <ConditionRow
                    condition={c}
                    index={i}
                    onChange={handleChange}
                    onRemove={handleRemove}
                    canRemove={conditions.length > 1}
                  />
                </div>
              ))}
            </div>

            {/* Add button */}
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2.5 text-sm rounded-xl border border-dashed border-border
                         text-text-muted hover:border-emerald-500/40 hover:text-emerald-400 hover:bg-emerald-500/5
                         transition-all w-full justify-center"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Add Condition
            </button>
          </div>

          {/* Audience Meter below rules on small screens, separate card */}
          <div className="rounded-2xl border border-border bg-bg-surface/50 backdrop-blur-sm p-5 lg:hidden">
            <AudienceMeter audience={audience} total={TOTAL_USERS} />
          </div>
        </div>

        {/* Right: Audience meter + profiles */}
        <div className="space-y-4">
          {/* Audience meter (desktop) */}
          <div className="hidden lg:block rounded-2xl border border-border bg-bg-surface/50 backdrop-blur-sm p-5">
            <AudienceMeter audience={audience} total={TOTAL_USERS} />
          </div>

          {/* Profile preview */}
          <div className="rounded-2xl border border-border bg-bg-surface/50 backdrop-blur-sm p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-text-secondary">Sample Matching Profiles</span>
              <span className="text-xs text-text-muted">{matchingProfiles.length} shown</span>
            </div>

            {matchingProfiles.length === 0 ? (
              <div className="py-8 text-center">
                <div className="text-3xl mb-2 opacity-40">
                  <svg className="mx-auto" width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="9" cy="7" r="4" stroke="#94a3b8" strokeWidth="1.5" />
                    <line x1="17" y1="8" x2="23" y2="14" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="23" y1="8" x2="17" y2="14" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <p className="text-sm text-text-muted">No sample profiles match the current conditions.</p>
                <p className="text-xs text-text-muted mt-1">Try adjusting your segment rules.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {matchingProfiles.map((p) => (
                  <ProfileCard key={p.name} profile={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer hint */}
      <p className="text-xs text-text-muted text-center pt-2">
        This is a learning sandbox. Audience sizes are simulated estimates, not real data.
      </p>
    </div>
  );
}
