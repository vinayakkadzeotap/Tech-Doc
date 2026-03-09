'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type EventType = 'page_view' | 'purchase' | 'signup';

interface PipelineStage {
  id: string;
  label: string;
  icon: string;
  description: string;
  color: string;
  processingMs: number; // simulated latency at this stage
}

interface DataPacket {
  id: string;
  eventType: EventType;
  currentStageIdx: number;
  progress: number; // 0-1 within the current transition
  state: 'traveling' | 'processing' | 'done';
  processingTimer: number;
  color: string;
}

interface LogEntry {
  id: string;
  timestamp: Date;
  message: string;
  color: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STAGES: PipelineStage[] = [
  {
    id: 'source',
    label: 'SDK / Source',
    icon: '📡',
    description: 'Web & Mobile SDKs capture raw events and send them downstream.',
    color: '#3b82f6',
    processingMs: 300,
  },
  {
    id: 'kafka',
    label: 'Kafka Ingestion',
    icon: '📨',
    description: 'Apache Kafka streams events with exactly-once delivery guarantees.',
    color: '#8b5cf6',
    processingMs: 200,
  },
  {
    id: 'etl',
    label: 'ETL Processing',
    icon: '⚙️',
    description: 'Apache Beam normalizes, validates and enriches event payloads.',
    color: '#6366f1',
    processingMs: 500,
  },
  {
    id: 'identity',
    label: 'Identity Resolution',
    icon: '🔗',
    description: 'Deterministic + probabilistic matching resolves a Unified Customer ID.',
    color: '#a855f7',
    processingMs: 400,
  },
  {
    id: 'profile',
    label: 'Profile Store',
    icon: '💾',
    description: 'Delta Lake merges event attributes into the golden customer profile.',
    color: '#10b981',
    processingMs: 350,
  },
  {
    id: 'activation',
    label: 'Activation',
    icon: '🚀',
    description: 'Segments & audiences sync to 100+ destination channels in real-time.',
    color: '#f59e0b',
    processingMs: 250,
  },
];

const EVENT_CONFIG: Record<EventType, { label: string; color: string; logMessages: string[] }> = {
  page_view: {
    label: 'Page View',
    color: '#3b82f6',
    logMessages: [
      'Page view event captured by SDK',
      'Event published to Kafka topic "page-views"',
      'ETL: Schema validated, enriched with geo-IP',
      'Identity: Cookie matched → UCID-48291',
      'Profile: Last-seen timestamp updated',
      'Activation: Audience "Active Visitors" refreshed',
    ],
  },
  purchase: {
    label: 'Purchase Event',
    color: '#10b981',
    logMessages: [
      'Purchase event captured — $149.99',
      'Event published to Kafka topic "transactions"',
      'ETL: Revenue normalized to USD, fraud score = 0.02',
      'Identity: Email hash matched → UCID-73012',
      'Profile: LTV incremented, purchase_count += 1',
      'Activation: Segment "High-Value Buyers" updated → pushed to Google Ads',
    ],
  },
  signup: {
    label: 'User Signup',
    color: '#a855f7',
    logMessages: [
      'Signup event received — new user registration',
      'Event published to Kafka topic "registrations"',
      'ETL: PII hashed, consent flags parsed (TCF 2.2)',
      'Identity: New UCID-91537 created, cookie graph linked',
      'Profile: New golden record initialised with 12 attributes',
      'Activation: Welcome journey triggered → Email + Push',
    ],
  },
};

const SPEED_OPTIONS = [1, 2, 5] as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

let packetCounter = 0;
let logCounter = 0;

function makePacketId() {
  return `pkt-${++packetCounter}`;
}

function makeLogId() {
  return `log-${++logCounter}`;
}

function formatTime(d: Date) {
  return d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function DataPipelineSimulator() {
  // State
  const [packets, setPackets] = useState<DataPacket[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventType>('page_view');
  const [speed, setSpeed] = useState<(typeof SPEED_OPTIONS)[number]>(1);
  const [stats, setStats] = useState({ eventsProcessed: 0, profilesUpdated: 0, totalLatency: 0, latencyCount: 0 });
  const [activeStages, setActiveStages] = useState<Set<string>>(new Set());
  const [isPaused, setIsPaused] = useState(false);

  // Refs
  const animFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const packetsRef = useRef(packets);
  const speedRef = useRef(speed);
  const isPausedRef = useRef(isPaused);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Keep refs in sync
  packetsRef.current = packets;
  speedRef.current = speed;
  isPausedRef.current = isPaused;

  // Append a log entry
  const appendLog = useCallback((message: string, color: string) => {
    setLogs((prev) => {
      const next = [...prev, { id: makeLogId(), timestamp: new Date(), message, color }];
      return next.slice(-80); // keep last 80 entries
    });
  }, []);

  // Send event handler
  const sendEvent = useCallback(() => {
    const evtCfg = EVENT_CONFIG[selectedEvent];
    const newPacket: DataPacket = {
      id: makePacketId(),
      eventType: selectedEvent,
      currentStageIdx: 0,
      progress: 0,
      state: 'processing',
      processingTimer: STAGES[0].processingMs,
      color: evtCfg.color,
    };
    setPackets((prev) => [...prev, newPacket]);
    appendLog(evtCfg.logMessages[0], evtCfg.color);
    setActiveStages((prev) => new Set(prev).add(STAGES[0].id));
  }, [selectedEvent, appendLog]);

  // Main animation loop
  useEffect(() => {
    const tick = (now: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = now;
      const rawDelta = now - lastTimeRef.current;
      lastTimeRef.current = now;

      if (isPausedRef.current) {
        animFrameRef.current = requestAnimationFrame(tick);
        return;
      }

      const delta = rawDelta * speedRef.current;

      setPackets((prev) => {
        const nextPackets: DataPacket[] = [];
        const newActiveStages = new Set<string>();
        let didChange = false;

        for (const pkt of prev) {
          if (pkt.state === 'done') {
            // keep done packets briefly then drop
            nextPackets.push(pkt);
            continue;
          }

          const newPkt = { ...pkt };

          if (newPkt.state === 'processing') {
            newPkt.processingTimer -= delta;
            newActiveStages.add(STAGES[newPkt.currentStageIdx].id);

            if (newPkt.processingTimer <= 0) {
              // Move to traveling to next stage or finish
              if (newPkt.currentStageIdx >= STAGES.length - 1) {
                newPkt.state = 'done';
                didChange = true;
              } else {
                newPkt.state = 'traveling';
                newPkt.progress = 0;
                didChange = true;
              }
            } else {
              didChange = true;
            }
          } else if (newPkt.state === 'traveling') {
            // Travel between stages (500ms base at 1x)
            const travelDuration = 500;
            newPkt.progress += delta / travelDuration;

            if (newPkt.progress >= 1) {
              newPkt.currentStageIdx += 1;
              newPkt.state = 'processing';
              newPkt.processingTimer = STAGES[newPkt.currentStageIdx].processingMs;
              newPkt.progress = 0;
              newActiveStages.add(STAGES[newPkt.currentStageIdx].id);

              // Log for this stage
              const cfg = EVENT_CONFIG[newPkt.eventType];
              if (cfg.logMessages[newPkt.currentStageIdx]) {
                // We need to schedule this outside the setState
                setTimeout(() => {
                  appendLog(cfg.logMessages[newPkt.currentStageIdx], cfg.color);
                }, 0);
              }

              didChange = true;
            } else {
              didChange = true;
            }
          }

          nextPackets.push(newPkt);
        }

        // Update active stages
        setActiveStages(newActiveStages);

        // Update stats for completed packets
        const completed = nextPackets.filter((p) => p.state === 'done');
        if (completed.length > 0) {
          const totalStageTime = STAGES.reduce((sum, s) => sum + s.processingMs, 0) + (STAGES.length - 1) * 500;
          setStats((s) => ({
            eventsProcessed: s.eventsProcessed + completed.length,
            profilesUpdated: s.profilesUpdated + completed.length,
            totalLatency: s.totalLatency + completed.length * totalStageTime,
            latencyCount: s.latencyCount + completed.length,
          }));
        }

        // Remove done packets
        const alive = nextPackets.filter((p) => p.state !== 'done');

        if (!didChange && alive.length === prev.length) return prev;
        return alive;
      });

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [appendLog]);

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Avg latency display
  const avgLatency = stats.latencyCount > 0 ? Math.round(stats.totalLatency / stats.latencyCount) : 0;

  return (
    <div ref={containerRef} className="space-y-6">
      {/* Inline keyframes */}
      <style>{`
        @keyframes dpsPulseRing {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes dpsPacketTravel {
          0% { offset-distance: 0%; }
          100% { offset-distance: 100%; }
        }
        @keyframes dpsProcSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes dpsGlowPulse {
          0%, 100% { box-shadow: 0 0 8px var(--glow-color, #3b82f6); }
          50% { box-shadow: 0 0 24px var(--glow-color, #3b82f6), 0 0 48px color-mix(in srgb, var(--glow-color, #3b82f6) 40%, transparent); }
        }
        @keyframes dpsFadeInUp {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes dpsShimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .dps-stage-active {
          animation: dpsGlowPulse 1s ease-in-out infinite;
        }
        .dps-log-entry {
          animation: dpsFadeInUp 0.25s ease forwards;
        }
        .dps-proc-spinner {
          animation: dpsProcSpin 0.8s linear infinite;
        }
        .dps-pulse-ring {
          animation: dpsPulseRing 1s ease-out infinite;
        }
      `}</style>

      {/* ---- Header / Controls ---- */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Data Pipeline Flow Simulator
          </h2>
          <p className="text-xs text-text-muted mt-0.5">Watch events flow through the Zeotap CDP in real-time</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Event type selector */}
          {(Object.entries(EVENT_CONFIG) as [EventType, typeof EVENT_CONFIG[EventType]][]).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => setSelectedEvent(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                selectedEvent === key
                  ? 'text-white border-opacity-50'
                  : 'bg-bg-surface/50 text-text-muted border-border hover:border-border-strong'
              }`}
              style={
                selectedEvent === key
                  ? { backgroundColor: `${cfg.color}20`, borderColor: `${cfg.color}50`, color: cfg.color }
                  : {}
              }
            >
              {cfg.label}
            </button>
          ))}
        </div>
      </div>

      {/* ---- Speed + Send ---- */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={sendEvent}
          className="px-4 py-2 rounded-xl text-sm font-bold text-white transition-all active:scale-95"
          style={{
            background: `linear-gradient(135deg, ${EVENT_CONFIG[selectedEvent].color}, ${EVENT_CONFIG[selectedEvent].color}cc)`,
            boxShadow: `0 0 20px ${EVENT_CONFIG[selectedEvent].color}30`,
          }}
        >
          Send Event
        </button>

        {/* Burst: 5 events */}
        <button
          onClick={() => {
            for (let i = 0; i < 5; i++) setTimeout(() => sendEvent(), i * 120);
          }}
          className="px-3 py-2 rounded-xl text-xs font-semibold bg-bg-surface/50 border border-border text-text-secondary hover:border-border-strong transition-all active:scale-95"
        >
          Burst x5
        </button>

        {/* Pause */}
        <button
          onClick={() => setIsPaused((p) => !p)}
          className="px-3 py-2 rounded-xl text-xs font-semibold bg-bg-surface/50 border border-border text-text-secondary hover:border-border-strong transition-all"
        >
          {isPaused ? '▶ Resume' : '⏸ Pause'}
        </button>

        {/* Speed control */}
        <div className="flex items-center gap-1 ml-auto">
          <span className="text-[11px] text-text-muted mr-1">Speed</span>
          {SPEED_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`w-9 h-8 rounded-lg text-xs font-bold transition-all ${
                speed === s
                  ? 'bg-brand-indigo/20 text-brand-indigo border border-brand-indigo/40'
                  : 'bg-bg-surface/50 text-text-muted border border-border hover:border-border-strong'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* ---- Pipeline Visualization ---- */}
      <div className="relative">
        {/* Stage cards in a responsive grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {STAGES.map((stage, idx) => {
            const isActive = activeStages.has(stage.id);
            const stagePackets = packets.filter(
              (p) => p.currentStageIdx === idx && p.state === 'processing'
            );
            return (
              <div
                key={stage.id}
                className={`relative rounded-2xl border p-4 transition-all duration-300 ${
                  isActive ? 'dps-stage-active -translate-y-1' : ''
                }`}
                style={{
                  backgroundColor: isActive ? `${stage.color}12` : 'rgba(255,255,255,0.02)',
                  borderColor: isActive ? `${stage.color}50` : 'rgba(255,255,255,0.08)',
                  // @ts-expect-error CSS custom property
                  '--glow-color': stage.color,
                }}
              >
                {/* Step number */}
                <div
                  className="absolute -top-2 -left-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ backgroundColor: stage.color }}
                >
                  {idx + 1}
                </div>

                {/* Processing indicator */}
                {isActive && (
                  <div className="absolute top-2 right-2">
                    <div
                      className="w-3 h-3 rounded-full border-2 border-t-transparent dps-proc-spinner"
                      style={{ borderColor: `${stage.color} ${stage.color} ${stage.color} transparent` }}
                    />
                  </div>
                )}

                <span className="text-2xl block mb-2">{stage.icon}</span>
                <div className="text-xs font-bold text-text-primary truncate">{stage.label}</div>
                <div className="text-[10px] text-text-muted mt-1 line-clamp-2 leading-tight">{stage.description}</div>

                {/* Active packet dots */}
                {stagePackets.length > 0 && (
                  <div className="flex gap-1 mt-2">
                    {stagePackets.map((p) => (
                      <div key={p.id} className="relative">
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: p.color }}
                        />
                        <div
                          className="absolute inset-0 w-2.5 h-2.5 rounded-full dps-pulse-ring"
                          style={{ backgroundColor: p.color }}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Arrow to next stage */}
                {idx < STAGES.length - 1 && (
                  <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 items-center">
                    <svg width="12" height="12" viewBox="0 0 12 12" className="text-text-muted opacity-40">
                      <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Traveling packets overlay (large screens) */}
        <div className="hidden lg:block absolute inset-0 pointer-events-none" aria-hidden="true">
          {packets
            .filter((p) => p.state === 'traveling')
            .map((pkt) => {
              // Calculate position: interpolate between stage cards
              const fromIdx = pkt.currentStageIdx;
              const toIdx = fromIdx + 1;
              if (toIdx >= STAGES.length) return null;

              // Each card is ~1/6 of container width, positioned in the grid
              const fromX = (fromIdx + 0.5) / STAGES.length;
              const toX = (toIdx + 0.5) / STAGES.length;
              const x = fromX + (toX - fromX) * pkt.progress;

              return (
                <div
                  key={pkt.id}
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    left: `${x * 100}%`,
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: pkt.color,
                    boxShadow: `0 0 10px ${pkt.color}, 0 0 20px ${pkt.color}60`,
                    transition: 'left 0.05s linear',
                  }}
                >
                  <div
                    className="absolute inset-0 rounded-full dps-pulse-ring"
                    style={{ backgroundColor: pkt.color }}
                  />
                </div>
              );
            })}
        </div>

        {/* Traveling packets (small screens — show below as a flow bar) */}
        <div className="lg:hidden mt-3">
          {packets.filter((p) => p.state === 'traveling').length > 0 && (
            <div className="relative h-2 bg-bg-elevated rounded-full overflow-hidden">
              {packets
                .filter((p) => p.state === 'traveling')
                .map((pkt) => {
                  const fromIdx = pkt.currentStageIdx;
                  const totalSegments = STAGES.length - 1;
                  const overallProgress = (fromIdx + pkt.progress) / totalSegments;

                  return (
                    <div
                      key={pkt.id}
                      className="absolute top-0 w-4 h-2 rounded-full"
                      style={{
                        left: `${overallProgress * 100}%`,
                        backgroundColor: pkt.color,
                        boxShadow: `0 0 8px ${pkt.color}`,
                        transform: 'translateX(-50%)',
                      }}
                    />
                  );
                })}
            </div>
          )}
        </div>
      </div>

      {/* ---- Stats Bar ---- */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Events Processed', value: stats.eventsProcessed.toLocaleString(), color: '#3b82f6' },
          { label: 'Profiles Updated', value: stats.profilesUpdated.toLocaleString(), color: '#10b981' },
          { label: 'Avg Latency', value: avgLatency > 0 ? `${avgLatency}ms` : '—', color: '#a855f7' },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-bg-surface/50 border border-border rounded-xl p-3 text-center"
          >
            <div className="text-lg font-bold font-mono" style={{ color: s.color }}>
              {s.value}
            </div>
            <div className="text-[10px] text-text-muted mt-0.5 uppercase tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ---- Log Panel ---- */}
      <div className="bg-bg-surface/50 border border-border rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-text-secondary tracking-wide uppercase">Event Log</span>
            <span className="text-[10px] text-text-muted">({logs.length} entries)</span>
          </div>
          <button
            onClick={() => setLogs([])}
            className="text-[10px] text-text-muted hover:text-text-secondary transition-colors"
          >
            Clear
          </button>
        </div>
        <div className="h-48 overflow-y-auto px-4 py-2 font-mono text-xs space-y-0.5 scrollbar-thin">
          {logs.length === 0 && (
            <div className="text-text-muted text-center py-8">
              Click &quot;Send Event&quot; to start the simulation...
            </div>
          )}
          {logs.map((entry) => (
            <div key={entry.id} className="dps-log-entry flex gap-2 py-0.5">
              <span className="text-text-muted shrink-0 tabular-nums">{formatTime(entry.timestamp)}</span>
              <span className="shrink-0">→</span>
              <span style={{ color: entry.color }}>{entry.message}</span>
            </div>
          ))}
          <div ref={logsEndRef} />
        </div>
      </div>

      {/* ---- Footer hint ---- */}
      <div className="flex items-center gap-4 text-[11px] text-text-muted">
        <span>{STAGES.length} pipeline stages</span>
        <span className="hidden sm:inline">·</span>
        <span className="hidden sm:inline">{packets.length} packets in-flight</span>
        <span className="hidden sm:inline">·</span>
        <span className="hidden sm:inline">Speed: {speed}x</span>
      </div>
    </div>
  );
}
