'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type IdentityType = 'email' | 'cookie' | 'device' | 'phone';
type ScenarioKey = 'simple' | 'cross-device' | 'household';
type AnimPhase = 'idle' | 'connecting' | 'merging' | 'merged';

interface IdentityNode {
  id: string;
  label: string;
  type: IdentityType;
  /** Normalised 0-1 positions inside the canvas */
  x: number;
  y: number;
  group: number; // which unified profile this node belongs to
}

interface Connection {
  from: string;
  to: string;
  matchType: 'deterministic' | 'probabilistic';
  confidence: number;
}

interface Scenario {
  key: ScenarioKey;
  title: string;
  description: string;
  nodes: IdentityNode[];
  connections: Connection[];
  /** How many distinct profiles exist after resolution */
  profileCount: number;
  mergedCenter: { x: number; y: number }[];
  steps: string[];
}

/* ------------------------------------------------------------------ */
/*  Palette                                                            */
/* ------------------------------------------------------------------ */

const TYPE_COLORS: Record<IdentityType, string> = {
  email: '#6366f1',   // indigo
  cookie: '#f59e0b',  // amber
  device: '#22c55e',  // green
  phone: '#a855f7',   // purple
};

const TYPE_LABELS: Record<IdentityType, string> = {
  email: 'Email',
  cookie: 'Cookie ID',
  device: 'Device ID',
  phone: 'Phone',
};

const GOLD = '#eab308';

/* ------------------------------------------------------------------ */
/*  Scenario data                                                      */
/* ------------------------------------------------------------------ */

const SCENARIOS: Scenario[] = [
  {
    key: 'simple',
    title: 'Simple Match',
    description: 'An email login links to an existing cookie, merging two identifiers into one profile.',
    nodes: [
      { id: 'e1', label: 'john@gmail.com', type: 'email', x: 0.3, y: 0.35, group: 0 },
      { id: 'c1', label: 'ck_abc123', type: 'cookie', x: 0.7, y: 0.35, group: 0 },
    ],
    connections: [{ from: 'e1', to: 'c1', matchType: 'deterministic', confidence: 99 }],
    profileCount: 1,
    mergedCenter: [{ x: 0.5, y: 0.35 }],
    steps: [
      'User visits site — cookie ck_abc123 is set.',
      'User logs in with john@gmail.com — deterministic match detected.',
      'Identity graph links cookie to email with 99% confidence.',
      'Both identifiers now resolve to a single Unified Customer ID.',
    ],
  },
  {
    key: 'cross-device',
    title: 'Cross-Device',
    description: 'A user across mobile, desktop, email and phone gets unified into one golden profile.',
    nodes: [
      { id: 'e1', label: 'john@gmail.com', type: 'email', x: 0.2, y: 0.2, group: 0 },
      { id: 'c1', label: 'ck_abc123', type: 'cookie', x: 0.8, y: 0.2, group: 0 },
      { id: 'd1', label: 'mobile_xyz', type: 'device', x: 0.2, y: 0.55, group: 0 },
      { id: 'd2', label: 'desktop_789', type: 'device', x: 0.8, y: 0.55, group: 0 },
      { id: 'p1', label: '555-0123', type: 'phone', x: 0.5, y: 0.65, group: 0 },
    ],
    connections: [
      { from: 'e1', to: 'c1', matchType: 'deterministic', confidence: 99 },
      { from: 'e1', to: 'd1', matchType: 'deterministic', confidence: 99 },
      { from: 'd1', to: 'p1', matchType: 'deterministic', confidence: 99 },
      { from: 'c1', to: 'd2', matchType: 'probabilistic', confidence: 85 },
      { from: 'd2', to: 'p1', matchType: 'probabilistic', confidence: 87 },
    ],
    profileCount: 1,
    mergedCenter: [{ x: 0.5, y: 0.4 }],
    steps: [
      'Email john@gmail.com detected on mobile app — links to device mobile_xyz.',
      'Phone 555-0123 provided during checkout — deterministic match to mobile.',
      'Cookie ck_abc123 set on desktop browser — same email login links them.',
      'Desktop_789 probabilistically matched via IP + user-agent fingerprint.',
      'All 5 identifiers collapse into one Unified Customer ID.',
    ],
  },
  {
    key: 'household',
    title: 'Household',
    description: 'Two people at the same address share a device but maintain separate profiles.',
    nodes: [
      { id: 'e1', label: 'john@gmail.com', type: 'email', x: 0.2, y: 0.25, group: 0 },
      { id: 'c1', label: 'ck_abc123', type: 'cookie', x: 0.35, y: 0.55, group: 0 },
      { id: 'e2', label: 'j.doe@work.com', type: 'email', x: 0.8, y: 0.25, group: 1 },
      { id: 'c2', label: 'ck_def456', type: 'cookie', x: 0.65, y: 0.55, group: 1 },
      { id: 'd1', label: 'desktop_789', type: 'device', x: 0.5, y: 0.7, group: -1 },
    ],
    connections: [
      { from: 'e1', to: 'c1', matchType: 'deterministic', confidence: 99 },
      { from: 'e2', to: 'c2', matchType: 'deterministic', confidence: 99 },
      // shared device — deliberately NOT merged
    ],
    profileCount: 2,
    mergedCenter: [
      { x: 0.28, y: 0.38 },
      { x: 0.72, y: 0.38 },
    ],
    steps: [
      'John logs in on shared desktop — cookie ck_abc123 deterministically linked.',
      'Jane logs in on same desktop — new cookie ck_def456 created for her session.',
      'Shared device desktop_789 is flagged as a household device.',
      'Identity engine keeps John and Jane as SEPARATE profiles — no false merge.',
      'Result: 2 distinct Unified Customer IDs sharing a household device.',
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Helper: generate a UCID                                            */
/* ------------------------------------------------------------------ */

function ucid(index: number) {
  return `UCID-${(7392 + index * 1117).toString(16).toUpperCase()}`;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function IdentityResolutionViz() {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [phase, setPhase] = useState<AnimPhase>('idle');
  const [stepIdx, setStepIdx] = useState(-1);
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number }>>({});
  const [visibleConnections, setVisibleConnections] = useState<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scenario = SCENARIOS[scenarioIdx];

  /* Reset positions when scenario changes */
  const resetPositions = useCallback((s: Scenario) => {
    const pos: Record<string, { x: number; y: number }> = {};
    s.nodes.forEach((n) => {
      pos[n.id] = { x: n.x, y: n.y };
    });
    setNodePositions(pos);
    setPhase('idle');
    setStepIdx(-1);
    setVisibleConnections(0);
  }, []);

  useEffect(() => {
    resetPositions(scenario);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [scenario, resetPositions]);

  /* ---- Run the animation sequence ---- */
  const resolve = useCallback(() => {
    if (phase !== 'idle') return;
    const s = scenario;
    setPhase('connecting');
    setStepIdx(0);

    let connIdx = 0;
    const connInterval = setInterval(() => {
      connIdx += 1;
      setVisibleConnections(connIdx);
      if (connIdx < s.steps.length - 1) {
        setStepIdx(connIdx);
      }
      if (connIdx >= s.connections.length) {
        clearInterval(connInterval);

        // Move to merging phase
        setTimeout(() => {
          setPhase('merging');
          setStepIdx(s.steps.length - 2);

          // Animate nodes towards their group center
          const merged: Record<string, { x: number; y: number }> = {};
          s.nodes.forEach((n) => {
            if (n.group >= 0 && s.mergedCenter[n.group]) {
              merged[n.id] = { ...s.mergedCenter[n.group] };
            } else {
              // stays in place (e.g. shared device in household)
              merged[n.id] = { x: n.x, y: n.y };
            }
          });
          setNodePositions(merged);

          setTimeout(() => {
            setPhase('merged');
            setStepIdx(s.steps.length - 1);
          }, 900);
        }, 600);
      }
    }, 800);

    return () => clearInterval(connInterval);
  }, [phase, scenario]);

  /* ---- Reset ---- */
  const reset = useCallback(() => {
    resetPositions(scenario);
  }, [scenario, resetPositions]);

  /* ---- Select scenario ---- */
  const selectScenario = useCallback(
    (idx: number) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setScenarioIdx(idx);
    },
    [],
  );

  /* ---- Render helpers ---- */
  const canvasW = 640;
  const canvasH = 380;

  function toPixel(nx: number, ny: number) {
    const pad = 60;
    return {
      px: pad + nx * (canvasW - pad * 2),
      py: pad + ny * (canvasH - pad * 2),
    };
  }

  return (
    <div className="space-y-5">
      {/* ---- Header ---- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-text-primary">Identity Resolution Visualizer</h3>
          <p className="text-sm text-text-muted mt-0.5">See how scattered identifiers merge into unified customer profiles</p>
        </div>
        <div className="flex items-center gap-2">
          {phase === 'idle' ? (
            <button
              onClick={resolve}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all
                         bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20
                         active:scale-95"
            >
              Resolve Identities
            </button>
          ) : (
            <button
              onClick={reset}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all
                         bg-bg-surface border border-border hover:border-border-strong text-text-secondary
                         active:scale-95"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* ---- Scenario selector ---- */}
      <div className="flex flex-wrap gap-2">
        {SCENARIOS.map((s, i) => (
          <button
            key={s.key}
            onClick={() => selectScenario(i)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              scenarioIdx === i
                ? 'bg-indigo-600/15 text-indigo-400 border-indigo-500/40'
                : 'bg-bg-surface/50 text-text-muted border-border hover:border-border-strong'
            }`}
          >
            {s.title}
          </button>
        ))}
      </div>

      <p className="text-sm text-text-secondary">{scenario.description}</p>

      {/* ---- Canvas ---- */}
      <div
        className="relative w-full border border-border rounded-2xl bg-bg-surface/50 overflow-hidden"
        style={{ maxWidth: canvasW, height: canvasH }}
      >
        {/* SVG connections layer */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox={`0 0 ${canvasW} ${canvasH}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <style>{`
              @keyframes dashMove {
                to { stroke-dashoffset: -20; }
              }
              .conn-line {
                stroke-dasharray: 6 4;
                animation: dashMove 0.8s linear infinite;
              }
            `}</style>
          </defs>
          {scenario.connections.map((conn, i) => {
            if (i >= visibleConnections) return null;
            const fromPos = nodePositions[conn.from];
            const toPos = nodePositions[conn.to];
            if (!fromPos || !toPos) return null;
            const a = toPixel(fromPos.x, fromPos.y);
            const b = toPixel(toPos.x, toPos.y);
            const color = conn.matchType === 'deterministic' ? '#6366f1' : '#f59e0b';
            return (
              <line
                key={`${conn.from}-${conn.to}`}
                x1={a.px}
                y1={a.py}
                x2={b.px}
                y2={b.py}
                stroke={color}
                strokeWidth={2}
                strokeOpacity={0.7}
                className="conn-line"
              />
            );
          })}
        </svg>

        {/* Merged profile badge(s) */}
        {phase === 'merged' &&
          scenario.mergedCenter.map((center, gi) => {
            const { px, py } = toPixel(center.x, center.y);
            return (
              <div
                key={`profile-${gi}`}
                className="absolute flex flex-col items-center pointer-events-none"
                style={{
                  left: px,
                  top: py,
                  transform: 'translate(-50%, -50%)',
                  animation: 'fadeScaleIn 0.5s ease-out forwards',
                }}
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg"
                  style={{
                    background: `radial-gradient(circle, ${GOLD}44, ${GOLD}18)`,
                    border: `2px solid ${GOLD}88`,
                    color: GOLD,
                  }}
                >
                  <span className="text-2xl">👤</span>
                </div>
                <span
                  className="mt-1.5 text-[11px] font-bold tracking-wide px-2 py-0.5 rounded-md"
                  style={{ background: `${GOLD}20`, color: GOLD }}
                >
                  {ucid(gi)}
                </span>
              </div>
            );
          })}

        {/* Identity nodes */}
        {scenario.nodes.map((node) => {
          const pos = nodePositions[node.id];
          if (!pos) return null;
          const { px, py } = toPixel(pos.x, pos.y);
          const color = TYPE_COLORS[node.type];

          // Hide individual nodes once fully merged (except ungrouped)
          if (phase === 'merged' && node.group >= 0) return null;

          return (
            <div
              key={node.id}
              className="absolute flex flex-col items-center"
              style={{
                left: px,
                top: py,
                transform: 'translate(-50%, -50%)',
                transition: 'left 0.8s cubic-bezier(.4,0,.2,1), top 0.8s cubic-bezier(.4,0,.2,1)',
                zIndex: 10,
              }}
            >
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center shadow-md transition-shadow"
                style={{
                  background: `radial-gradient(circle, ${color}55, ${color}22)`,
                  border: `2px solid ${color}99`,
                  boxShadow: `0 0 12px ${color}30`,
                }}
              >
                <span className="text-base">
                  {node.type === 'email' ? '✉' : node.type === 'cookie' ? '🍪' : node.type === 'device' ? '📱' : '📞'}
                </span>
              </div>
              <span
                className="mt-1 text-[10px] font-semibold whitespace-nowrap px-1.5 py-0.5 rounded-md"
                style={{ background: `${color}15`, color }}
              >
                {node.label}
              </span>
            </div>
          );
        })}

        {/* Shared device indicator (household) */}
        {phase === 'merged' && scenario.key === 'household' && (() => {
          const deviceNode = scenario.nodes.find((n) => n.group === -1);
          if (!deviceNode) return null;
          const pos = nodePositions[deviceNode.id];
          if (!pos) return null;
          const { px, py } = toPixel(pos.x, pos.y);
          const color = TYPE_COLORS[deviceNode.type];
          return (
            <div
              className="absolute flex flex-col items-center"
              style={{ left: px, top: py, transform: 'translate(-50%, -50%)', zIndex: 10 }}
            >
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center shadow-md"
                style={{
                  background: `radial-gradient(circle, ${color}55, ${color}22)`,
                  border: `2px dashed ${color}99`,
                }}
              >
                <span className="text-base">📱</span>
              </div>
              <span className="mt-1 text-[10px] font-semibold text-text-muted whitespace-nowrap px-1.5 py-0.5 rounded-md bg-bg-surface/80">
                {deviceNode.label}
              </span>
              <span className="text-[9px] text-amber-400 font-semibold mt-0.5">Shared Device</span>
            </div>
          );
        })()}

        {/* Inline keyframes */}
        <style>{`
          @keyframes fadeScaleIn {
            from { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
            to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          }
        `}</style>
      </div>

      {/* ---- Legend ---- */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-text-muted">
        {(Object.keys(TYPE_COLORS) as IdentityType[]).map((t) => (
          <span key={t} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: TYPE_COLORS[t] }} />
            {TYPE_LABELS[t]}
          </span>
        ))}
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: GOLD }} />
          Unified Profile
        </span>
      </div>

      {/* ---- Match confidence ---- */}
      {(phase === 'connecting' || phase === 'merging' || phase === 'merged') && (
        <div className="flex flex-wrap gap-3 animate-fade-in">
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold"
            style={{ borderColor: '#6366f140', background: '#6366f10a', color: '#818cf8' }}
          >
            <span className="w-2 h-2 rounded-full" style={{ background: '#6366f1' }} />
            Deterministic — 99% confidence
          </div>
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold"
            style={{ borderColor: '#f59e0b40', background: '#f59e0b0a', color: '#fbbf24' }}
          >
            <span className="w-2 h-2 rounded-full" style={{ background: '#f59e0b' }} />
            Probabilistic — 85% confidence
          </div>
        </div>
      )}

      {/* ---- Step-by-step explanation ---- */}
      {stepIdx >= 0 && (
        <div className="border border-border rounded-2xl bg-bg-surface/50 p-4 space-y-2 animate-fade-in">
          <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Resolution Steps</h4>
          {scenario.steps.map((step, i) => {
            const isActive = i === stepIdx;
            const isDone = i < stepIdx;
            const isFuture = i > stepIdx;
            return (
              <div
                key={i}
                className={`flex items-start gap-2.5 text-sm transition-all duration-300 ${
                  isFuture ? 'opacity-30' : isActive ? 'opacity-100' : 'opacity-60'
                }`}
              >
                <span
                  className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 border"
                  style={{
                    borderColor: isDone ? '#22c55e88' : isActive ? '#6366f188' : '#ffffff15',
                    background: isDone ? '#22c55e20' : isActive ? '#6366f120' : 'transparent',
                    color: isDone ? '#22c55e' : isActive ? '#818cf8' : '#666',
                  }}
                >
                  {isDone ? '✓' : i + 1}
                </span>
                <span className={isActive ? 'text-text-primary font-medium' : 'text-text-muted'}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* ---- Unified Profile Card ---- */}
      {phase === 'merged' && (
        <div className="animate-fade-in space-y-3">
          {Array.from({ length: scenario.profileCount }).map((_, gi) => {
            const groupNodes = scenario.nodes.filter((n) => n.group === gi);
            return (
              <div
                key={gi}
                className="border rounded-2xl p-5 space-y-3"
                style={{
                  borderColor: `${GOLD}40`,
                  background: `${GOLD}06`,
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                    style={{ background: `${GOLD}22`, border: `2px solid ${GOLD}66` }}
                  >
                    👤
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-text-primary">Unified Customer Profile</h4>
                    <span className="text-xs font-semibold" style={{ color: GOLD }}>
                      {ucid(gi)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {groupNodes.map((n) => {
                    const color = TYPE_COLORS[n.type];
                    return (
                      <span
                        key={n.id}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border"
                        style={{ borderColor: `${color}30`, background: `${color}15`, color }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                        {n.label}
                      </span>
                    );
                  })}
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-text-muted pt-2 border-t border-border">
                  <span>Linked identifiers: <strong className="text-text-secondary">{groupNodes.length}</strong></span>
                  <span>Match quality: <strong className="text-green-400">High</strong></span>
                  <span>Last updated: <strong className="text-text-secondary">just now</strong></span>
                </div>
              </div>
            );
          })}

          {/* Household note */}
          {scenario.key === 'household' && (
            <div
              className="flex items-start gap-3 px-4 py-3 rounded-xl border text-xs"
              style={{ borderColor: '#f59e0b30', background: '#f59e0b08' }}
            >
              <span className="text-amber-400 text-base mt-0.5">⚠</span>
              <div>
                <p className="font-semibold text-amber-300 mb-0.5">Household Separation</p>
                <p className="text-text-muted">
                  Even though both profiles share <strong className="text-text-secondary">desktop_789</strong>,
                  the identity engine correctly keeps them as separate people. Shared devices are flagged
                  rather than used for merging.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---- Footer stats ---- */}
      <div className="flex items-center gap-6 text-xs text-text-muted pt-3 border-t border-border">
        <span>{scenario.nodes.length} identity nodes</span>
        <span>{scenario.connections.length} connections</span>
        <span>{scenario.profileCount} resulting profile{scenario.profileCount > 1 ? 's' : ''}</span>
        <span className="ml-auto text-text-muted/50">Click &quot;Resolve Identities&quot; to begin</span>
      </div>
    </div>
  );
}
