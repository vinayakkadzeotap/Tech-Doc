'use client';

import { useState, useEffect, useCallback } from 'react';

/* ------------------------------------------------------------------ */
/*  Types & Constants                                                  */
/* ------------------------------------------------------------------ */

type ServiceStatus = 'healthy' | 'degraded' | 'down';
type Phase = 'idle' | 'checking' | 'done';

interface Service {
  name: string;
  status: ServiceStatus;
  lastActivity: string;
  eventsToday: number;
  description: string;
}

interface DestinationHealth {
  name: string;
  successful: number;
  failed: number;
  successRate: number;
  lastError?: string;
  lastErrorTime?: string;
}

interface HealthReport {
  globalStatus: 'OPERATIONAL' | 'DEGRADED' | 'OUTAGE';
  orgName: string;
  orgId: string;
  services: Service[];
  destinations: DestinationHealth[];
  recentDates: string[];
  overallSuccessRate: number;
  totalUploads: number;
  totalFailures: number;
}

const STATUS_STYLES: Record<ServiceStatus, { label: string; dot: string; bg: string }> = {
  healthy: { label: 'ACTIVE', dot: 'bg-green-400', bg: 'bg-green-500/10' },
  degraded: { label: 'DEGRADED', dot: 'bg-yellow-400', bg: 'bg-yellow-500/10' },
  down: { label: 'DOWN', dot: 'bg-red-400', bg: 'bg-red-500/10' },
};

const GLOBAL_STYLES: Record<string, { color: string; icon: string }> = {
  OPERATIONAL: { color: 'text-green-400', icon: '✅' },
  DEGRADED: { color: 'text-yellow-400', icon: '🟡' },
  OUTAGE: { color: 'text-red-400', icon: '🔴' },
};

const SCENARIOS: { label: string; desc: string; report: HealthReport }[] = [
  {
    label: 'Healthy System',
    desc: 'All services running, 98.7% success rate',
    report: {
      globalStatus: 'OPERATIONAL',
      orgName: 'Acme Marketing Inc',
      orgId: 'org_acme_2024',
      services: [
        { name: 'Uploader', status: 'healthy', lastActivity: '2 min ago', eventsToday: 14523, description: 'Data ingestion pipeline' },
        { name: 'Sender', status: 'healthy', lastActivity: '5 min ago', eventsToday: 8941, description: 'Destination delivery' },
        { name: 'Exporter', status: 'healthy', lastActivity: '12 min ago', eventsToday: 3201, description: 'Data export service' },
      ],
      destinations: [
        { name: 'Google Ads', successful: 2341, failed: 12, successRate: 99.5 },
        { name: 'Facebook Ads', successful: 1893, failed: 28, successRate: 98.5 },
        { name: 'Salesforce', successful: 1205, failed: 8, successRate: 99.3 },
        { name: 'HubSpot', successful: 956, failed: 15, successRate: 98.5 },
      ],
      recentDates: ['2026-03-12', '2026-03-11', '2026-03-10', '2026-03-09', '2026-03-08', '2026-03-07'],
      overallSuccessRate: 98.7,
      totalUploads: 6395,
      totalFailures: 63,
    },
  },
  {
    label: 'Auth Token Expired',
    desc: 'Facebook Ads failing — token expired',
    report: {
      globalStatus: 'DEGRADED',
      orgName: 'RetailCo Global',
      orgId: 'org_retailco_2024',
      services: [
        { name: 'Uploader', status: 'healthy', lastActivity: '1 min ago', eventsToday: 11234, description: 'Data ingestion pipeline' },
        { name: 'Sender', status: 'degraded', lastActivity: '3 min ago', eventsToday: 6782, description: 'Destination delivery' },
        { name: 'Exporter', status: 'healthy', lastActivity: '8 min ago', eventsToday: 2890, description: 'Data export service' },
      ],
      destinations: [
        { name: 'Google Ads', successful: 2100, failed: 5, successRate: 99.8 },
        { name: 'Facebook Ads', successful: 312, failed: 1456, successRate: 17.6, lastError: '401 Unauthorized - OAuth token expired. Re-authenticate connector.', lastErrorTime: '14:32 UTC' },
        { name: 'Salesforce', successful: 1102, failed: 3, successRate: 99.7 },
        { name: 'TikTok Ads', successful: 890, failed: 22, successRate: 97.6 },
      ],
      recentDates: ['2026-03-12', '2026-03-11', '2026-03-10', '2026-03-09', '2026-03-08', '2026-03-07'],
      overallSuccessRate: 74.8,
      totalUploads: 4404,
      totalFailures: 1486,
    },
  },
  {
    label: 'Pipeline Stalled',
    desc: 'Uploader down — no data ingestion for 2 days',
    report: {
      globalStatus: 'OUTAGE',
      orgName: 'TravelTech Solutions',
      orgId: 'org_traveltech_2024',
      services: [
        { name: 'Uploader', status: 'down', lastActivity: '2 days ago', eventsToday: 0, description: 'Data ingestion pipeline' },
        { name: 'Sender', status: 'degraded', lastActivity: '2 days ago', eventsToday: 0, description: 'Destination delivery' },
        { name: 'Exporter', status: 'down', lastActivity: '3 days ago', eventsToday: 0, description: 'Data export service' },
      ],
      destinations: [
        { name: 'Google Ads', successful: 0, failed: 342, successRate: 0, lastError: 'No data available for delivery. Upstream pipeline failure.', lastErrorTime: '2 days ago' },
        { name: 'Braze', successful: 0, failed: 189, successRate: 0, lastError: 'Empty payload — Uploader service inactive.', lastErrorTime: '2 days ago' },
        { name: 'Klaviyo', successful: 0, failed: 256, successRate: 0, lastError: 'Connection timeout — upstream data missing.', lastErrorTime: '2 days ago' },
      ],
      recentDates: ['2026-03-10', '2026-03-09', '2026-03-08', '2026-03-07', '2026-03-06', '2026-03-05'],
      overallSuccessRate: 0,
      totalUploads: 0,
      totalFailures: 787,
    },
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function DataHealthDashboard() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [scenario, setScenario] = useState<number | null>(null);
  const [checkStep, setCheckStep] = useState(0);
  const [expandedDest, setExpandedDest] = useState<string | null>(null);

  const report = scenario !== null ? SCENARIOS[scenario].report : null;

  const runDiagnostic = useCallback((idx: number) => {
    setScenario(idx);
    setPhase('checking');
    setCheckStep(0);
    setExpandedDest(null);
  }, []);

  // Simulate diagnostic phases
  useEffect(() => {
    if (phase !== 'checking') return;
    if (checkStep >= 5) {
      setPhase('done');
      return;
    }
    const timer = setTimeout(() => setCheckStep((s) => s + 1), 600);
    return () => clearTimeout(timer);
  }, [phase, checkStep]);

  const handleReset = useCallback(() => {
    setPhase('idle');
    setScenario(null);
    setCheckStep(0);
    setExpandedDest(null);
  }, []);

  const DIAGNOSTIC_STEPS = [
    'Running global health check...',
    'Validating organization...',
    'Scanning active services...',
    'Checking destination health...',
    'Analyzing error patterns...',
  ];

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-green-500/15 border border-green-500/25 text-lg">🏥</span>
            Data Health Dashboard
          </h2>
          <p className="text-sm text-text-muted mt-1">
            Follow the cdp-health-diagnostics workflow: Health Check → Service Scan → Destination Health → Error Drill-Down
          </p>
        </div>
        {phase !== 'idle' && (
          <button onClick={handleReset} className="self-start px-4 py-2 text-sm rounded-lg border border-border text-text-secondary hover:border-border-strong hover:text-text-primary transition-colors">
            Reset
          </button>
        )}
      </div>

      {/* Scenario selection */}
      {phase === 'idle' && (
        <div className="space-y-4 animate-fade-in">
          <h3 className="text-sm font-semibold text-text-secondary">Select a scenario to diagnose</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SCENARIOS.map((s, i) => {
              const style = GLOBAL_STYLES[s.report.globalStatus];
              return (
                <button
                  key={i}
                  onClick={() => runDiagnostic(i)}
                  className="group p-5 rounded-xl border border-border bg-bg-surface/50 hover:border-green-500/40 hover:bg-green-500/5 text-left transition-all"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span>{style.icon}</span>
                    <span className="text-sm font-semibold text-text-primary group-hover:text-green-400 transition-colors">{s.label}</span>
                  </div>
                  <p className="text-xs text-text-muted">{s.desc}</p>
                  <p className={`text-xs font-bold mt-2 ${style.color}`}>{s.report.globalStatus}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Diagnostic animation */}
      {phase === 'checking' && (
        <div className="rounded-2xl border border-border bg-bg-surface/50 p-6 space-y-4 animate-fade-in">
          <h3 className="text-sm font-semibold text-text-secondary">Running diagnostic cascade...</h3>
          <div className="space-y-3">
            {DIAGNOSTIC_STEPS.map((label, i) => (
              <div key={i} className={`flex items-center gap-3 transition-all duration-300 ${i <= checkStep ? 'opacity-100' : 'opacity-30'}`}>
                {i < checkStep ? (
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs">✓</div>
                ) : i === checkStep ? (
                  <div className="w-6 h-6 rounded-full bg-brand-blue/20 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-brand-blue animate-pulse" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-bg-elevated border border-border" />
                )}
                <span className={`text-sm ${i <= checkStep ? 'text-text-primary' : 'text-text-muted'}`}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results dashboard */}
      {phase === 'done' && report && (
        <div className="space-y-5 animate-fade-in">
          {/* Global status */}
          <div className={`rounded-2xl border ${report.globalStatus === 'OPERATIONAL' ? 'border-green-500/30' : report.globalStatus === 'DEGRADED' ? 'border-yellow-500/30' : 'border-red-500/30'} bg-bg-surface/50 p-5`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{GLOBAL_STYLES[report.globalStatus].icon}</span>
                <div>
                  <h3 className={`text-lg font-bold ${GLOBAL_STYLES[report.globalStatus].color}`}>
                    System {report.globalStatus}
                  </h3>
                  <p className="text-xs text-text-muted">{report.orgName} ({report.orgId})</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-3xl font-extrabold ${report.overallSuccessRate > 95 ? 'text-green-400' : report.overallSuccessRate > 80 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {report.overallSuccessRate}%
                </div>
                <div className="text-xs text-text-muted">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-bg-surface/50 border border-border text-center">
              <div className="text-xl font-extrabold text-green-400">{report.totalUploads.toLocaleString()}</div>
              <div className="text-xs text-text-muted mt-1">Successful</div>
            </div>
            <div className="p-4 rounded-xl bg-bg-surface/50 border border-border text-center">
              <div className="text-xl font-extrabold text-red-400">{report.totalFailures.toLocaleString()}</div>
              <div className="text-xs text-text-muted mt-1">Failed</div>
            </div>
            <div className="p-4 rounded-xl bg-bg-surface/50 border border-border text-center">
              <div className="text-xl font-extrabold text-text-primary">{report.services.filter((s) => s.status !== 'down').length}/{report.services.length}</div>
              <div className="text-xs text-text-muted mt-1">Services Active</div>
            </div>
          </div>

          {/* Service health */}
          <div className="rounded-2xl border border-border bg-bg-surface/50 p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">Service Health</h4>
            {report.services.map((svc) => {
              const style = STATUS_STYLES[svc.status];
              return (
                <div key={svc.name} className={`flex items-center gap-4 p-3 rounded-xl ${style.bg} border border-border`}>
                  <div className={`w-3 h-3 rounded-full ${style.dot} ${svc.status === 'healthy' ? '' : 'animate-pulse'}`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-text-primary">{svc.name}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${style.bg} ${svc.status === 'healthy' ? 'text-green-400' : svc.status === 'degraded' ? 'text-yellow-400' : 'text-red-400'}`}>
                        {style.label}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted">{svc.description}</p>
                  </div>
                  <div className="text-right text-xs text-text-muted">
                    <div>Last: {svc.lastActivity}</div>
                    <div>{svc.eventsToday.toLocaleString()} events today</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Destination health */}
          <div className="rounded-2xl border border-border bg-bg-surface/50 p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">Destination Delivery (Last 7 Days)</h4>
            {report.destinations.map((dest) => (
              <div key={dest.name}>
                <button
                  onClick={() => setExpandedDest(expandedDest === dest.name ? null : dest.name)}
                  className={`w-full flex items-center gap-4 p-3 rounded-xl border text-left transition-all ${dest.failed > 0 ? 'border-border hover:border-red-500/30' : 'border-border hover:border-green-500/30'}`}
                >
                  <div className={`w-3 h-3 rounded-full ${dest.successRate > 95 ? 'bg-green-400' : dest.successRate > 80 ? 'bg-yellow-400' : 'bg-red-400'}`} />
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-text-primary">{dest.name}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-green-400">{dest.successful.toLocaleString()} ok</span>
                    {dest.failed > 0 && <span className="text-red-400">{dest.failed.toLocaleString()} failed</span>}
                    <span className={`font-bold ${dest.successRate > 95 ? 'text-green-400' : dest.successRate > 80 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {dest.successRate}%
                    </span>
                    <span className="text-text-muted">{expandedDest === dest.name ? '▲' : '▼'}</span>
                  </div>
                </button>
                {expandedDest === dest.name && dest.lastError && (
                  <div className="ml-7 mt-2 p-3 rounded-xl bg-red-500/5 border border-red-500/20 animate-fade-in">
                    <p className="text-xs font-bold text-red-400 mb-1">Error Detail</p>
                    <p className="text-xs text-text-secondary font-mono">{dest.lastError}</p>
                    {dest.lastErrorTime && <p className="text-[10px] text-text-muted mt-1">Last occurrence: {dest.lastErrorTime}</p>}
                    <div className="mt-2 p-2 rounded-lg bg-bg-elevated/60 border border-border">
                      <p className="text-[10px] font-bold text-text-muted uppercase">Recommendation</p>
                      <p className="text-xs text-text-secondary mt-0.5">
                        {dest.lastError.includes('401') || dest.lastError.includes('Unauthorized')
                          ? 'Re-authenticate the connector. Navigate to Settings → Integrations → re-authorize.'
                          : dest.lastError.includes('timeout') || dest.lastError.includes('missing')
                          ? 'Check upstream pipeline. Uploader service may need restart.'
                          : dest.lastError.includes('rate limit')
                          ? 'Reduce batch size or add delay between uploads.'
                          : 'Investigate error logs. Contact engineering if persistent.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Recent data window */}
          <div className="rounded-2xl border border-border bg-bg-surface/50 p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">Recent Data Window</h4>
            <div className="flex flex-wrap gap-2">
              {report.recentDates.map((d) => (
                <span key={d} className="text-xs px-3 py-1.5 rounded-lg bg-bg-elevated border border-border text-text-secondary font-mono">{d}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      <p className="text-xs text-text-muted text-center">
        This dashboard simulates the cdp-health-diagnostics workflow. Scenarios and data are illustrative.
      </p>
    </div>
  );
}
