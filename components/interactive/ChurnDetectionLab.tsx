'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';

/* ------------------------------------------------------------------ */
/*  Types & Constants                                                  */
/* ------------------------------------------------------------------ */

type Vertical = 'retail' | 'telecom' | 'gaming' | 'media' | 'bfsi' | 'saas';

interface CustomerProfile {
  id: string;
  name: string;
  segment: string;
  baselinePurchases: number;
  recentPurchases: number;
  baselineSpend: number;
  recentSpend: number;
  baselineLogins: number;
  recentLogins: number;
  supportTickets: number;
  riskScore: number;
  tier: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'STABLE';
  daysToChurn: string;
  ltv: number;
}

interface VerticalInfo {
  label: string;
  icon: string;
  signals: { name: string; weight: number; desc: string }[];
  metrics: string[];
}

const VERTICALS: Record<Vertical, VerticalInfo> = {
  retail: {
    label: 'Retail / E-commerce',
    icon: '🛒',
    signals: [
      { name: 'Purchase Frequency Decline', weight: 0.35, desc: 'Buys less often than baseline' },
      { name: 'AOV Decline', weight: 0.35, desc: 'Average order value dropping' },
      { name: 'Category Abandonment', weight: 0.15, desc: 'Stops buying from favorite categories' },
      { name: 'Return Rate Spike', weight: 0.15, desc: 'Product returns increasing' },
    ],
    metrics: ['purchase_frequency', 'avg_order_value', 'category_count', 'return_rate'],
  },
  telecom: {
    label: 'Telecom',
    icon: '📱',
    signals: [
      { name: 'ARPU Decline', weight: 0.30, desc: 'Monthly revenue dropping >20%' },
      { name: 'Data Usage Drop', weight: 0.30, desc: 'Usage < 50% of historical' },
      { name: 'Support Escalation', weight: 0.20, desc: 'Complaint volume spikes' },
      { name: 'Contract Non-Renewal', weight: 0.20, desc: 'Not renewing annual contract' },
    ],
    metrics: ['arpu', 'data_usage_gb', 'support_tickets', 'contract_status'],
  },
  gaming: {
    label: 'Gaming',
    icon: '🎮',
    signals: [
      { name: 'Session Length Drop', weight: 0.25, desc: 'Average session < 50% of baseline' },
      { name: 'IAP Spend Stop', weight: 0.30, desc: '$0 spend for 30+ days' },
      { name: 'DAU Collapse', weight: 0.25, desc: 'Daily active to occasional' },
      { name: 'Level Stagnation', weight: 0.20, desc: 'No progression for 60+ days' },
    ],
    metrics: ['session_minutes', 'iap_spend', 'daily_active_days', 'level_progress'],
  },
  media: {
    label: 'Media / Streaming',
    icon: '🎬',
    signals: [
      { name: 'Viewing Hours Decline', weight: 0.35, desc: 'Monthly hours < 50% of baseline' },
      { name: 'Content Diversity Drop', weight: 0.25, desc: 'Watching fewer genres' },
      { name: 'Series Completion Drop', weight: 0.20, desc: 'Fewer complete shows watched' },
      { name: 'Tier Downgrade', weight: 0.20, desc: 'Premium to basic migration' },
    ],
    metrics: ['monthly_hours', 'genre_count', 'completion_rate', 'subscription_tier'],
  },
  bfsi: {
    label: 'Banking / Financial',
    icon: '🏦',
    signals: [
      { name: 'Balance Reduction', weight: 0.30, desc: 'Total balance declining >30%' },
      { name: 'Transaction Decline', weight: 0.30, desc: 'Monthly transactions < 50%' },
      { name: 'Product Closure', weight: 0.25, desc: 'Closing accounts/policies' },
      { name: 'Payment Issues', weight: 0.15, desc: 'Late or missed payments' },
    ],
    metrics: ['account_balance', 'transaction_count', 'product_count', 'payment_status'],
  },
  saas: {
    label: 'SaaS / Subscription',
    icon: '💻',
    signals: [
      { name: 'Usage Decline', weight: 0.35, desc: 'API calls / features < 50%' },
      { name: 'Login Frequency Drop', weight: 0.30, desc: 'Sessions < baseline' },
      { name: 'Support Escalation', weight: 0.20, desc: 'Ticket volume up 3x' },
      { name: 'Payment Failures', weight: 0.15, desc: 'Failed billing attempts' },
    ],
    metrics: ['api_calls', 'login_frequency', 'support_tickets', 'payment_status'],
  },
};

const TIER_COLORS = {
  CRITICAL: { bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-500/30' },
  HIGH: { bg: 'bg-orange-500/15', text: 'text-orange-400', border: 'border-orange-500/30' },
  MEDIUM: { bg: 'bg-yellow-500/15', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  LOW: { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/30' },
  STABLE: { bg: 'bg-green-500/15', text: 'text-green-400', border: 'border-green-500/30' },
};

const TIER_INTERVENTIONS: Record<string, { action: string; channel: string; timing: string }> = {
  CRITICAL: { action: 'Immediate personal outreach + retention offer', channel: 'Phone / Email / SMS', timing: '7-14 days' },
  HIGH: { action: 'High-touch email + SMS campaign', channel: 'Email sequence + SMS', timing: '15-30 days' },
  MEDIUM: { action: 'Nurture campaign + content engagement', channel: 'Email + In-app', timing: '30-60 days' },
  LOW: { action: 'Monitor + light engagement', channel: 'Email newsletter', timing: '60-90 days' },
  STABLE: { action: 'Continue standard engagement', channel: 'Regular campaigns', timing: 'N/A' },
};

/* ------------------------------------------------------------------ */
/*  Data generation (deterministic per vertical) — fallback            */
/* ------------------------------------------------------------------ */

const NAMES = ['Alex Kim', 'Jordan Lee', 'Sam Patel', 'Taylor Chen', 'Morgan Walsh', 'Jamie Ortiz', 'Robin Das', 'Casey Nakamura', 'Avery Singh', 'Quinn Murphy', 'Drew Fischer', 'Riley Tanaka', 'Blake Torres', 'Skyler Rao', 'Sage Petrov'];

function generateFallbackCustomers(vertical: Vertical): CustomerProfile[] {
  const seed = vertical.split('').reduce((s, c) => s + c.charCodeAt(0), 0);
  let x = seed;
  const rand = () => { x = (x * 16807) % 2147483647; return (x - 1) / 2147483646; };

  return NAMES.map((name, i) => {
    const baseP = Math.floor(rand() * 20 + 5);
    const declineFactor = rand();
    const recentP = Math.max(0, Math.floor(baseP * (1 - declineFactor * 0.8)));
    const baseS = Math.floor(rand() * 2000 + 200);
    const recentS = Math.max(0, Math.floor(baseS * (1 - declineFactor * 0.7)));
    const baseL = Math.floor(rand() * 25 + 3);
    const recentL = Math.max(0, Math.floor(baseL * (1 - declineFactor * 0.6)));
    const tickets = Math.floor(rand() * 5);

    const purchaseDelta = baseP > 0 ? (baseP - recentP) / baseP : 0;
    const spendDelta = baseS > 0 ? (baseS - recentS) / baseS : 0;
    const loginDelta = baseL > 0 ? (baseL - recentL) / baseL : 0;
    const ticketFlag = tickets > 2 ? 1 : 0;

    const score = Math.min(1, Math.max(0, purchaseDelta * 0.35 + spendDelta * 0.35 + loginDelta * 0.20 + ticketFlag * 0.10));

    let tier: CustomerProfile['tier'];
    let daysToChurn: string;
    if (score >= 0.70) { tier = 'CRITICAL'; daysToChurn = '7-14 days'; }
    else if (score >= 0.50) { tier = 'HIGH'; daysToChurn = '15-30 days'; }
    else if (score >= 0.30) { tier = 'MEDIUM'; daysToChurn = '30-60 days'; }
    else if (score >= 0.10) { tier = 'LOW'; daysToChurn = '60-90 days'; }
    else { tier = 'STABLE'; daysToChurn = 'N/A'; }

    const segments = ['Premium', 'Standard', 'New', 'Enterprise', 'SMB'];

    return {
      id: `cust_${i}`,
      name,
      segment: segments[Math.floor(rand() * segments.length)],
      baselinePurchases: baseP,
      recentPurchases: recentP,
      baselineSpend: baseS,
      recentSpend: recentS,
      baselineLogins: baseL,
      recentLogins: recentL,
      supportTickets: tickets,
      riskScore: Math.round(score * 100),
      tier,
      daysToChurn,
      ltv: Math.floor(rand() * 8000 + 500),
    };
  });
}

/* ------------------------------------------------------------------ */
/*  DB mapping helper                                                  */
/* ------------------------------------------------------------------ */

function mapDbCustomer(row: Record<string, unknown>): CustomerProfile {
  const metrics = (row.metrics || {}) as Record<string, unknown>;
  const baselinePurchases = (metrics.baseline_purchases ?? metrics.baselinePurchases ?? 0) as number;
  const recentPurchases = (metrics.recent_purchases ?? metrics.recentPurchases ?? 0) as number;
  const baselineSpend = (metrics.baseline_spend ?? metrics.baselineSpend ?? 0) as number;
  const recentSpend = (metrics.recent_spend ?? metrics.recentSpend ?? 0) as number;
  const baselineLogins = (metrics.baseline_logins ?? metrics.baselineLogins ?? 0) as number;
  const recentLogins = (metrics.recent_logins ?? metrics.recentLogins ?? 0) as number;
  const supportTickets = (metrics.support_tickets ?? metrics.supportTickets ?? 0) as number;

  return {
    id: row.id as string,
    name: row.name as string,
    segment: (row.segment ?? 'Standard') as string,
    baselinePurchases,
    recentPurchases,
    baselineSpend,
    recentSpend,
    baselineLogins,
    recentLogins,
    supportTickets,
    riskScore: (row.risk_score ?? row.riskScore ?? 0) as number,
    tier: (row.tier ?? 'STABLE') as CustomerProfile['tier'],
    daysToChurn: (row.days_to_churn ?? row.daysToChurn ?? 'N/A') as string,
    ltv: (row.ltv ?? 0) as number,
  };
}

function fmt(n: number): string { return n.toLocaleString('en-US'); }

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ChurnDetectionLab() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [vertical, setVertical] = useState<Vertical | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [isLiveData, setIsLiveData] = useState(false);
  const [activeVerticalInfo, setActiveVerticalInfo] = useState<VerticalInfo | null>(null);
  const [liveCustomers, setLiveCustomers] = useState<CustomerProfile[] | null>(null);
  const [verticalsData, setVerticalsData] = useState<Record<Vertical, VerticalInfo>>(VERTICALS);

  // Fetch verticals list on mount
  useEffect(() => {
    async function fetchVerticals() {
      try {
        const res = await fetch('/api/simulators?type=churn');
        if (!res.ok) throw new Error('API returned non-OK status');
        const data = await res.json();

        if (data.verticals && typeof data.verticals === 'object') {
          setVerticalsData(data.verticals as Record<Vertical, VerticalInfo>);
          setIsLiveData(true);
        }
      } catch {
        // Fall back to hardcoded VERTICALS
        setVerticalsData(VERTICALS);
        setIsLiveData(false);
      }
    }

    fetchVerticals();
  }, []);

  // Fetch customers when vertical is selected
  const fetchCustomersForVertical = useCallback(async (v: Vertical) => {
    try {
      const res = await fetch(`/api/simulators?type=churn&vertical=${v}`);
      if (!res.ok) throw new Error('API returned non-OK status');
      const data = await res.json();

      if (data.customers && Array.isArray(data.customers) && data.customers.length > 0) {
        const mapped = data.customers.map((row: Record<string, unknown>) => mapDbCustomer(row));
        setLiveCustomers(mapped);
        setIsLiveData(true);
      } else {
        setLiveCustomers(null);
      }

      if (data.verticalInfo) {
        setActiveVerticalInfo(data.verticalInfo as VerticalInfo);
      }
    } catch {
      // Fall back to generated data
      setLiveCustomers(null);
    }
  }, []);

  const customers = useMemo(() => {
    if (liveCustomers && liveCustomers.length > 0) return liveCustomers;
    return vertical ? generateFallbackCustomers(vertical) : [];
  }, [vertical, liveCustomers]);

  const sortedCustomers = useMemo(() => [...customers].sort((a, b) => b.riskScore - a.riskScore), [customers]);

  const tierCounts = useMemo(() => {
    const counts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0, STABLE: 0 };
    for (const c of customers) counts[c.tier]++;
    return counts;
  }, [customers]);

  const totalAtRisk = tierCounts.CRITICAL + tierCounts.HIGH + tierCounts.MEDIUM;
  const atRiskLTV = useMemo(() => customers.filter((c) => c.riskScore >= 30).reduce((s, c) => s + c.ltv, 0), [customers]);

  const handleVerticalSelect = useCallback((v: Vertical) => {
    setVertical(v);
    setStep(2);
    setSelectedCustomer(null);
    setLiveCustomers(null);
    setActiveVerticalInfo(null);
    fetchCustomersForVertical(v);
  }, [fetchCustomersForVertical]);

  const handleReset = useCallback(() => {
    setStep(1);
    setVertical(null);
    setSelectedCustomer(null);
    setLiveCustomers(null);
    setActiveVerticalInfo(null);
  }, []);

  const detail = selectedCustomer ? customers.find((c) => c.id === selectedCustomer) : null;

  // Use activeVerticalInfo for signal weights display if available, otherwise fall back to VERTICALS
  const displayVerticalInfo = vertical ? (activeVerticalInfo || verticalsData[vertical]) : null;

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/15 border border-red-500/25 text-lg">⚠️</span>
            Churn Detection Lab
            <span className={`ml-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${isLiveData ? 'bg-green-500/15 text-green-400 border border-green-500/25' : 'bg-blue-500/15 text-blue-400 border border-blue-500/25'}`}>
              {isLiveData ? 'Live Data' : 'Sample Data'}
            </span>
          </h2>
          <p className="text-sm text-text-muted mt-1">
            Follow the cdp-churn-finder workflow: Baseline → Recent Behavior → Risk Scoring → Interventions
          </p>
        </div>
        <button onClick={handleReset} className="self-start px-4 py-2 text-sm rounded-lg border border-border text-text-secondary hover:border-border-strong hover:text-text-primary transition-colors">
          Reset
        </button>
      </div>

      {/* Step 1: Vertical Selection */}
      {step === 1 && (
        <div className="space-y-4 animate-fade-in">
          <h3 className="text-sm font-semibold text-text-secondary">Step 1: Select your industry to apply vertical-specific churn signals</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {(Object.entries(verticalsData) as [Vertical, VerticalInfo][]).map(([v, info]) => (
              <button
                key={v}
                onClick={() => handleVerticalSelect(v)}
                className="group p-4 rounded-xl border border-border bg-bg-surface/50 hover:border-red-500/40 hover:bg-red-500/5 text-left transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{info.icon}</span>
                  <span className="text-sm font-semibold text-text-primary group-hover:text-red-400 transition-colors">{info.label}</span>
                </div>
                <div className="space-y-1">
                  {info.signals.slice(0, 2).map((s) => (
                    <p key={s.name} className="text-[10px] text-text-muted">• {s.name}</p>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Analysis Dashboard */}
      {step >= 2 && vertical && displayVerticalInfo && (
        <div className="space-y-5 animate-fade-in">
          {/* Vertical badge */}
          <div className="flex items-center gap-2">
            <span className="text-lg">{displayVerticalInfo.icon}</span>
            <span className="text-sm font-semibold text-text-primary">{displayVerticalInfo.label}</span>
            <button onClick={() => setStep(3)} className="ml-auto text-xs text-brand-blue hover:underline">View Signal Weights →</button>
          </div>

          {/* Executive Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-bg-surface/50 border border-border text-center">
              <div className="text-2xl font-extrabold text-red-400">{totalAtRisk}</div>
              <div className="text-xs text-text-muted mt-1">At-Risk Customers</div>
            </div>
            <div className="p-4 rounded-xl bg-bg-surface/50 border border-border text-center">
              <div className="text-2xl font-extrabold text-orange-400">{tierCounts.CRITICAL}</div>
              <div className="text-xs text-text-muted mt-1">Critical Risk</div>
            </div>
            <div className="p-4 rounded-xl bg-bg-surface/50 border border-border text-center">
              <div className="text-2xl font-extrabold text-yellow-400">{tierCounts.HIGH}</div>
              <div className="text-xs text-text-muted mt-1">High Risk</div>
            </div>
            <div className="p-4 rounded-xl bg-bg-surface/50 border border-border text-center">
              <div className="text-2xl font-extrabold text-brand-purple">${fmt(atRiskLTV)}</div>
              <div className="text-xs text-text-muted mt-1">At-Risk LTV</div>
            </div>
          </div>

          {/* Customer list + detail */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Customer list */}
            <div className="lg:col-span-2 rounded-2xl border border-border bg-bg-surface/50 p-4 space-y-2 max-h-[500px] overflow-y-auto">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold uppercase tracking-wider text-text-muted">Risk-Scored Customers</p>
                <p className="text-xs text-text-muted">{customers.length} total</p>
              </div>
              {sortedCustomers.map((c) => {
                const colors = TIER_COLORS[c.tier];
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCustomer(c.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${selectedCustomer === c.id ? `${colors.border} ${colors.bg}` : 'border-border hover:border-border-strong hover:bg-bg-hover'}`}
                  >
                    <div className={`w-10 h-10 rounded-xl ${colors.bg} ${colors.border} border flex items-center justify-center text-sm font-bold ${colors.text}`}>
                      {c.riskScore}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-text-primary truncate">{c.name}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${colors.bg} ${colors.text}`}>{c.tier}</span>
                      </div>
                      <div className="text-xs text-text-muted">{c.segment} • LTV ${fmt(c.ltv)}</div>
                    </div>
                    <div className="text-right text-xs text-text-muted hidden sm:block">
                      <div>Spend: {c.baselineSpend > 0 ? `-${Math.round(((c.baselineSpend - c.recentSpend) / c.baselineSpend) * 100)}%` : '—'}</div>
                      <div>Activity: {c.baselineLogins > 0 ? `-${Math.round(((c.baselineLogins - c.recentLogins) / c.baselineLogins) * 100)}%` : '—'}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Detail panel */}
            <div className="rounded-2xl border border-border bg-bg-surface/50 p-4 space-y-4">
              {detail ? (
                <>
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl ${TIER_COLORS[detail.tier].bg} ${TIER_COLORS[detail.tier].border} border flex items-center justify-center text-lg font-bold ${TIER_COLORS[detail.tier].text}`}>
                      {detail.riskScore}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-text-primary">{detail.name}</p>
                      <p className="text-xs text-text-muted">{detail.segment} • Est. churn: {detail.daysToChurn}</p>
                    </div>
                  </div>

                  {/* Deltas */}
                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-text-muted">Behavioral Deltas</p>
                    {[
                      { label: 'Purchases', baseline: detail.baselinePurchases, recent: detail.recentPurchases },
                      { label: 'Spend ($)', baseline: detail.baselineSpend, recent: detail.recentSpend },
                      { label: 'Logins', baseline: detail.baselineLogins, recent: detail.recentLogins },
                    ].map((d) => {
                      const pct = d.baseline > 0 ? Math.round(((d.baseline - d.recent) / d.baseline) * 100) : 0;
                      return (
                        <div key={d.label} className="flex items-center gap-2">
                          <span className="text-xs text-text-muted w-20">{d.label}</span>
                          <div className="flex-1 h-2 rounded-full bg-bg-elevated overflow-hidden">
                            <div className={`h-full rounded-full transition-all ${pct > 50 ? 'bg-red-500' : pct > 25 ? 'bg-orange-500' : 'bg-yellow-500'}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                          </div>
                          <span className={`text-xs font-medium w-12 text-right ${pct > 50 ? 'text-red-400' : pct > 25 ? 'text-orange-400' : 'text-yellow-400'}`}>
                            -{pct}%
                          </span>
                        </div>
                      );
                    })}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-text-muted w-20">Tickets</span>
                      <span className={`text-xs font-medium ${detail.supportTickets > 2 ? 'text-red-400' : 'text-text-secondary'}`}>{detail.supportTickets} in last 30d</span>
                    </div>
                  </div>

                  {/* Intervention */}
                  <div className="p-3 rounded-xl bg-bg-elevated/60 border border-border space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-text-muted">Recommended Intervention</p>
                    <p className="text-sm text-text-primary font-medium">{TIER_INTERVENTIONS[detail.tier].action}</p>
                    <div className="flex items-center gap-4 text-xs text-text-muted">
                      <span>Channel: {TIER_INTERVENTIONS[detail.tier].channel}</span>
                      <span>Window: {TIER_INTERVENTIONS[detail.tier].timing}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <p className="text-sm text-text-muted">Select a customer to view churn analysis</p>
                  <p className="text-xs text-text-muted mt-1">Click any row in the list</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Signal weights modal */}
      {step === 3 && vertical && displayVerticalInfo && (
        <div className="rounded-2xl border border-border bg-bg-surface/50 p-5 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text-secondary">{displayVerticalInfo.label} Churn Signal Weights</h3>
            <button onClick={() => setStep(2)} className="text-xs text-brand-blue hover:underline">← Back to dashboard</button>
          </div>
          <div className="space-y-3">
            {displayVerticalInfo.signals.map((signal) => (
              <div key={signal.name} className="flex items-center gap-3 p-3 rounded-xl bg-bg-elevated/60 border border-border">
                <div className="w-12 text-center">
                  <div className="text-lg font-bold text-text-primary">{Math.round(signal.weight * 100)}%</div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-primary">{signal.name}</p>
                  <p className="text-xs text-text-muted">{signal.desc}</p>
                </div>
                <div className="w-24 h-2 rounded-full bg-bg-elevated overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-400" style={{ width: `${signal.weight * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 rounded-xl bg-bg-elevated/40 border border-border">
            <p className="text-xs text-text-muted">
              <strong>Risk score formula:</strong> Weighted sum of behavioral decline percentages across all signals.
              Score 0.70+ = CRITICAL (churn in 7-14 days), 0.50-0.69 = HIGH (30 days), 0.30-0.49 = MEDIUM (60 days).
            </p>
          </div>
        </div>
      )}

      <p className="text-xs text-text-muted text-center">
        This lab simulates the cdp-churn-finder workflow. Customer data is generated for learning purposes.
      </p>
    </div>
  );
}
