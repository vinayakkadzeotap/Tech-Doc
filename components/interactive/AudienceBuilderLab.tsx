'use client';

import { useState, useMemo, useCallback } from 'react';

/* ------------------------------------------------------------------ */
/*  Types & Constants                                                  */
/* ------------------------------------------------------------------ */

type CampaignType = 'acquisition' | 'retention' | 'upsell' | 'reactivation' | 'seasonal';

interface SchemaField {
  name: string;
  category: 'demographic' | 'behavioral' | 'transactional' | 'engagement';
  type: 'numeric' | 'categorical' | 'boolean';
  fillRate: number;
  distinctValues: number;
  percentiles?: { p25: number; p50: number; p75: number; p90: number };
  sampleValues?: string[];
}

interface SegmentCriteria {
  field: string;
  operator: string;
  value: string;
  value2?: string;
}

interface AudienceResult {
  name: string;
  criteria: SegmentCriteria[];
  estimatedSize: number;
  percentOfBase: number;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  channels: string[];
  avgSpend: number;
}

const TOTAL_BASE = 2_500_000;

const CAMPAIGN_INFO: Record<CampaignType, { label: string; question: string; metric: string; icon: string }> = {
  acquisition: { label: 'Acquisition', question: 'What types of people should we acquire?', metric: 'Customer similarity to best segments', icon: '🎯' },
  retention: { label: 'Retention', question: 'Who do we want to keep engaged?', metric: 'Engagement level, lifetime value', icon: '🛡️' },
  upsell: { label: 'Upsell / Cross-sell', question: "Who's ready to buy more?", metric: 'Product affinity, purchase frequency', icon: '📈' },
  reactivation: { label: 'Reactivation', question: 'Who did we lose?', metric: 'Time since last interaction', icon: '🔄' },
  seasonal: { label: 'Seasonal', question: 'Who buys in specific periods?', metric: 'Purchase timing patterns', icon: '📅' },
};

const SCHEMA_FIELDS: SchemaField[] = [
  { name: 'age', category: 'demographic', type: 'numeric', fillRate: 94, distinctValues: 72, percentiles: { p25: 24, p50: 34, p75: 48, p90: 62 } },
  { name: 'gender', category: 'demographic', type: 'categorical', fillRate: 91, distinctValues: 3, sampleValues: ['Male', 'Female', 'Other'] },
  { name: 'country', category: 'demographic', type: 'categorical', fillRate: 99, distinctValues: 48, sampleValues: ['US', 'UK', 'DE', 'IN', 'BR', 'JP'] },
  { name: 'income_bracket', category: 'demographic', type: 'categorical', fillRate: 67, distinctValues: 5, sampleValues: ['<30k', '30-60k', '60-100k', '100-200k', '200k+'] },
  { name: 'purchase_frequency', category: 'transactional', type: 'numeric', fillRate: 98, distinctValues: 156, percentiles: { p25: 2, p50: 5, p75: 12, p90: 24 } },
  { name: 'avg_order_value', category: 'transactional', type: 'numeric', fillRate: 98, distinctValues: 892, percentiles: { p25: 35, p50: 85, p75: 195, p90: 420 } },
  { name: 'total_lifetime_value', category: 'transactional', type: 'numeric', fillRate: 97, distinctValues: 2400, percentiles: { p25: 120, p50: 480, p75: 1500, p90: 4200 } },
  { name: 'days_since_purchase', category: 'behavioral', type: 'numeric', fillRate: 96, distinctValues: 365, percentiles: { p25: 7, p50: 28, p75: 90, p90: 180 } },
  { name: 'email_open_rate', category: 'engagement', type: 'numeric', fillRate: 88, distinctValues: 100, percentiles: { p25: 12, p50: 28, p75: 45, p90: 68 } },
  { name: 'login_frequency', category: 'engagement', type: 'numeric', fillRate: 95, distinctValues: 60, percentiles: { p25: 1, p50: 4, p75: 12, p90: 25 } },
  { name: 'category_affinity', category: 'behavioral', type: 'categorical', fillRate: 85, distinctValues: 12, sampleValues: ['Electronics', 'Fashion', 'Home', 'Beauty', 'Sports', 'Food'] },
  { name: 'membership_tier', category: 'behavioral', type: 'categorical', fillRate: 78, distinctValues: 4, sampleValues: ['Bronze', 'Silver', 'Gold', 'Platinum'] },
  { name: 'churn_risk_score', category: 'behavioral', type: 'numeric', fillRate: 92, distinctValues: 100, percentiles: { p25: 8, p50: 22, p75: 48, p90: 72 } },
  { name: 'support_tickets_30d', category: 'engagement', type: 'numeric', fillRate: 99, distinctValues: 15, percentiles: { p25: 0, p50: 0, p75: 1, p90: 3 } },
  { name: 'is_subscribed', category: 'engagement', type: 'boolean', fillRate: 100, distinctValues: 2, sampleValues: ['true', 'false'] },
];

const PRESET_AUDIENCES: Record<CampaignType, { name: string; criteria: SegmentCriteria[]; desc: string }[]> = {
  acquisition: [
    { name: 'High-Value Lookalike Seed', criteria: [{ field: 'total_lifetime_value', operator: '>', value: '1500' }, { field: 'purchase_frequency', operator: '>', value: '12' }], desc: 'Top 25% LTV + frequent buyers' },
    { name: 'Engaged Non-Buyers', criteria: [{ field: 'login_frequency', operator: '>', value: '12' }, { field: 'purchase_frequency', operator: '<', value: '2' }], desc: 'Active users who barely buy' },
  ],
  retention: [
    { name: 'At-Risk High-Value', criteria: [{ field: 'total_lifetime_value', operator: '>', value: '1500' }, { field: 'churn_risk_score', operator: '>', value: '48' }], desc: 'High LTV + elevated churn risk' },
    { name: 'Declining Engagement', criteria: [{ field: 'login_frequency', operator: '<', value: '4' }, { field: 'days_since_purchase', operator: '>', value: '90' }], desc: 'Low logins + long purchase gap' },
  ],
  upsell: [
    { name: 'Ready to Upgrade', criteria: [{ field: 'membership_tier', operator: '=', value: 'Silver' }, { field: 'avg_order_value', operator: '>', value: '195' }], desc: 'Silver members with high AOV' },
    { name: 'Cross-Sell Candidates', criteria: [{ field: 'purchase_frequency', operator: '>', value: '5' }, { field: 'avg_order_value', operator: '<', value: '85' }], desc: 'Frequent low-spend buyers' },
  ],
  reactivation: [
    { name: 'Recently Lapsed', criteria: [{ field: 'days_since_purchase', operator: '>', value: '90' }, { field: 'total_lifetime_value', operator: '>', value: '480' }], desc: 'Lapsed 90d+ with decent LTV' },
    { name: 'Win-Back Priority', criteria: [{ field: 'days_since_purchase', operator: '>', value: '180' }, { field: 'email_open_rate', operator: '>', value: '28' }], desc: 'Lapsed but still reading emails' },
  ],
  seasonal: [
    { name: 'Holiday Shoppers', criteria: [{ field: 'purchase_frequency', operator: '>', value: '5' }, { field: 'category_affinity', operator: '=', value: 'Electronics' }], desc: 'Frequent electronics buyers' },
    { name: 'High-Spend Seasonal', criteria: [{ field: 'avg_order_value', operator: '>', value: '195' }, { field: 'is_subscribed', operator: '=', value: 'true' }], desc: 'Subscribed high-AOV customers' },
  ],
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function estimateSize(criteria: SegmentCriteria[]): number {
  if (criteria.length === 0) return TOTAL_BASE;
  let fraction = 1;
  for (const c of criteria) {
    const field = SCHEMA_FIELDS.find((f) => f.name === c.field);
    if (!field) { fraction *= 0.5; continue; }
    const val = parseFloat(c.value);
    if (field.type === 'numeric' && field.percentiles && !isNaN(val)) {
      const { p25, p50, p75, p90 } = field.percentiles;
      if (c.operator === '>') {
        if (val >= p90) fraction *= 0.10;
        else if (val >= p75) fraction *= 0.25;
        else if (val >= p50) fraction *= 0.50;
        else if (val >= p25) fraction *= 0.75;
        else fraction *= 0.90;
      } else if (c.operator === '<') {
        if (val <= p25) fraction *= 0.25;
        else if (val <= p50) fraction *= 0.50;
        else if (val <= p75) fraction *= 0.75;
        else fraction *= 0.90;
      }
    } else if (field.type === 'categorical') {
      fraction *= 1 / Math.max(field.distinctValues, 1);
    } else if (field.type === 'boolean') {
      fraction *= 0.5;
    } else {
      fraction *= 0.3;
    }
  }
  return Math.max(50, Math.round(fraction * TOTAL_BASE * (field_fill_avg(criteria) / 100)));
}

function field_fill_avg(criteria: SegmentCriteria[]): number {
  const rates = criteria.map((c) => SCHEMA_FIELDS.find((f) => f.name === c.field)?.fillRate || 80);
  return rates.reduce((a, b) => a + b, 0) / rates.length;
}

function getConfidence(criteria: SegmentCriteria[]): 'HIGH' | 'MEDIUM' | 'LOW' {
  const avgFill = field_fill_avg(criteria);
  if (avgFill > 90) return 'HIGH';
  if (avgFill > 75) return 'MEDIUM';
  return 'LOW';
}

function getChannels(campaign: CampaignType): string[] {
  switch (campaign) {
    case 'acquisition': return ['Paid Social', 'Lookalike Ads', 'Display'];
    case 'retention': return ['Email', 'SMS', 'In-App'];
    case 'upsell': return ['Email', 'Push Notification', 'In-App'];
    case 'reactivation': return ['Win-Back Email', 'Direct Mail', 'SMS'];
    case 'seasonal': return ['Email', 'Social Ads', 'Retargeting'];
  }
}

function fmt(n: number): string {
  return n.toLocaleString('en-US');
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function AudienceBuilderLab() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [campaign, setCampaign] = useState<CampaignType | null>(null);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [criteria, setCriteria] = useState<SegmentCriteria[]>([]);
  const [result, setResult] = useState<AudienceResult | null>(null);

  const fieldsByCategory = useMemo(() => {
    const groups: Record<string, SchemaField[]> = {};
    for (const f of SCHEMA_FIELDS) {
      if (!groups[f.category]) groups[f.category] = [];
      groups[f.category].push(f);
    }
    return groups;
  }, []);

  const handleCampaignSelect = useCallback((type: CampaignType) => {
    setCampaign(type);
    setStep(2);
    setSelectedFields([]);
    setCriteria([]);
    setResult(null);
  }, []);

  const handleFieldToggle = useCallback((name: string) => {
    setSelectedFields((prev) =>
      prev.includes(name) ? prev.filter((f) => f !== name) : [...prev, name]
    );
  }, []);

  const handleProceedToSegment = useCallback(() => {
    setCriteria(selectedFields.map((f) => ({ field: f, operator: '>', value: '' })));
    setStep(3);
  }, [selectedFields]);

  const handleCriteriaChange = useCallback((index: number, patch: Partial<SegmentCriteria>) => {
    setCriteria((prev) => prev.map((c, i) => (i === index ? { ...c, ...patch } : c)));
  }, []);

  const handlePreset = useCallback((preset: { name: string; criteria: SegmentCriteria[] }) => {
    setCriteria(preset.criteria);
    setSelectedFields(preset.criteria.map((c) => c.field));
    setStep(3);
  }, []);

  const handleEstimate = useCallback(() => {
    if (!campaign) return;
    const size = estimateSize(criteria);
    setResult({
      name: `${CAMPAIGN_INFO[campaign].label} Audience`,
      criteria,
      estimatedSize: size,
      percentOfBase: parseFloat(((size / TOTAL_BASE) * 100).toFixed(2)),
      confidence: getConfidence(criteria),
      channels: getChannels(campaign),
      avgSpend: Math.round(120 + Math.random() * 380),
    });
    setStep(4);
  }, [campaign, criteria]);

  const handleReset = useCallback(() => {
    setStep(1);
    setCampaign(null);
    setSelectedFields([]);
    setCriteria([]);
    setResult(null);
  }, []);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/25 text-lg">
              🎯
            </span>
            Audience Builder Lab
          </h2>
          <p className="text-sm text-text-muted mt-1">
            Follow the CDP audience-finder workflow: Campaign Intent → Schema Discovery → Segmentation → Estimation
          </p>
        </div>
        <button onClick={handleReset} className="self-start px-4 py-2 text-sm rounded-lg border border-border text-text-secondary hover:border-border-strong hover:text-text-primary transition-colors">
          Reset
        </button>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= s ? 'bg-brand-blue text-white' : 'bg-bg-elevated text-text-muted border border-border'}`}>
              {s}
            </div>
            <span className={`text-xs font-medium hidden sm:inline ${step >= s ? 'text-text-primary' : 'text-text-muted'}`}>
              {s === 1 ? 'Intent' : s === 2 ? 'Discovery' : s === 3 ? 'Segment' : 'Result'}
            </span>
            {s < 4 && <div className={`w-8 h-0.5 ${step > s ? 'bg-brand-blue' : 'bg-border'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Campaign Intent */}
      {step === 1 && (
        <div className="space-y-4 animate-fade-in">
          <h3 className="text-sm font-semibold text-text-secondary">Step 1: What&apos;s your campaign objective?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {(Object.entries(CAMPAIGN_INFO) as [CampaignType, typeof CAMPAIGN_INFO[CampaignType]][]).map(([type, info]) => (
              <button
                key={type}
                onClick={() => handleCampaignSelect(type)}
                className="group p-4 rounded-xl border border-border bg-bg-surface/50 hover:border-brand-blue/40 hover:bg-brand-blue/5 text-left transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{info.icon}</span>
                  <span className="text-sm font-semibold text-text-primary group-hover:text-brand-blue transition-colors">{info.label}</span>
                </div>
                <p className="text-xs text-text-muted">{info.question}</p>
                <p className="text-[10px] text-text-muted mt-1 opacity-60">Metric: {info.metric}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Schema Discovery */}
      {step === 2 && campaign && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text-secondary">Step 2: Discover relevant attributes</h3>
            <span className="text-xs text-brand-blue font-medium">{CAMPAIGN_INFO[campaign].icon} {CAMPAIGN_INFO[campaign].label}</span>
          </div>

          {/* Quick presets */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Quick Presets</p>
            <div className="flex flex-wrap gap-2">
              {PRESET_AUDIENCES[campaign].map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handlePreset(preset)}
                  className="group px-4 py-2.5 rounded-xl border border-border bg-bg-surface/50 hover:border-blue-500/40 hover:bg-blue-500/5 transition-all text-left"
                >
                  <p className="text-sm font-medium text-text-primary group-hover:text-brand-blue transition-colors">{preset.name}</p>
                  <p className="text-xs text-text-muted mt-0.5">{preset.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Schema fields by category */}
          <div className="rounded-2xl border border-border bg-bg-surface/50 p-5 space-y-4">
            <p className="text-xs text-text-muted">Select attributes to use in your segment definition. Higher fill rates = more reliable segments.</p>
            {Object.entries(fieldsByCategory).map(([cat, fields]) => (
              <div key={cat}>
                <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2 capitalize">{cat}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {fields.map((field) => {
                    const selected = selectedFields.includes(field.name);
                    return (
                      <button
                        key={field.name}
                        onClick={() => handleFieldToggle(field.name)}
                        className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${selected ? 'border-brand-blue/50 bg-brand-blue/10' : 'border-border bg-bg-elevated/40 hover:border-border-strong'}`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] ${selected ? 'bg-brand-blue border-brand-blue text-white' : 'border-border'}`}>
                            {selected && '✓'}
                          </div>
                          <div>
                            <span className="text-sm font-medium text-text-primary">{field.name}</span>
                            <span className="text-xs text-text-muted ml-2">{field.type}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-xs font-medium ${field.fillRate > 90 ? 'text-green-400' : field.fillRate > 75 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {field.fillRate}% fill
                          </div>
                          <div className="text-[10px] text-text-muted">{field.distinctValues} distinct</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            <button
              onClick={handleProceedToSegment}
              disabled={selectedFields.length === 0}
              className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${selectedFields.length > 0 ? 'bg-gradient-to-r from-brand-blue to-brand-indigo text-white hover:shadow-glow' : 'bg-bg-elevated text-text-muted cursor-not-allowed'}`}
            >
              Define Segment with {selectedFields.length} attribute{selectedFields.length !== 1 ? 's' : ''}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Define Segment */}
      {step === 3 && campaign && (
        <div className="space-y-4 animate-fade-in">
          <h3 className="text-sm font-semibold text-text-secondary">Step 3: Define segment criteria</h3>
          <div className="rounded-2xl border border-border bg-bg-surface/50 p-5 space-y-3">
            {criteria.map((c, idx) => {
              const field = SCHEMA_FIELDS.find((f) => f.name === c.field);
              return (
                <div key={idx} className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-bg-elevated/60 border border-border">
                  <span className="text-sm font-medium text-brand-blue min-w-[140px]">{c.field}</span>
                  <select
                    value={c.operator}
                    onChange={(e) => handleCriteriaChange(idx, { operator: e.target.value })}
                    className="bg-bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-brand-blue/50"
                  >
                    {field?.type === 'numeric' && <><option value=">">greater than</option><option value="<">less than</option><option value="=">equals</option></>}
                    {field?.type === 'categorical' && <><option value="=">equals</option><option value="!=">not equals</option></>}
                    {field?.type === 'boolean' && <option value="=">equals</option>}
                  </select>
                  {field?.type === 'categorical' || field?.type === 'boolean' ? (
                    <select
                      value={c.value}
                      onChange={(e) => handleCriteriaChange(idx, { value: e.target.value })}
                      className="bg-bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-brand-blue/50"
                    >
                      <option value="">Select...</option>
                      {field.sampleValues?.map((v) => <option key={v} value={v}>{v}</option>)}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={c.value}
                      onChange={(e) => handleCriteriaChange(idx, { value: e.target.value })}
                      placeholder={field?.percentiles ? `p50: ${field.percentiles.p50}` : 'value'}
                      className="bg-bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-blue/50 w-28"
                    />
                  )}
                  {field?.percentiles && (
                    <span className="text-[10px] text-text-muted">
                      p25:{field.percentiles.p25} p50:{field.percentiles.p50} p75:{field.percentiles.p75} p90:{field.percentiles.p90}
                    </span>
                  )}
                </div>
              );
            })}

            <button
              onClick={handleEstimate}
              disabled={criteria.some((c) => !c.value)}
              className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${criteria.every((c) => c.value) ? 'bg-gradient-to-r from-brand-blue to-brand-indigo text-white hover:shadow-glow' : 'bg-bg-elevated text-text-muted cursor-not-allowed'}`}
            >
              Estimate Audience Size
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Result */}
      {step === 4 && result && campaign && (
        <div className="space-y-4 animate-fade-in">
          <h3 className="text-sm font-semibold text-text-secondary">Step 4: Audience definition report</h3>
          <div className="rounded-2xl border border-border bg-bg-surface/50 p-6 space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-lg font-bold text-text-primary">{result.name}</h4>
                <p className="text-xs text-text-muted mt-0.5">{CAMPAIGN_INFO[campaign].label} campaign</p>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-lg ${result.confidence === 'HIGH' ? 'bg-green-500/15 text-green-400' : result.confidence === 'MEDIUM' ? 'bg-yellow-500/15 text-yellow-400' : 'bg-red-500/15 text-red-400'}`}>
                {result.confidence} confidence
              </span>
            </div>

            {/* Size estimate */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-bg-elevated/60 border border-border text-center">
                <div className="text-2xl font-extrabold text-brand-blue">{fmt(result.estimatedSize)}</div>
                <div className="text-xs text-text-muted mt-1">Estimated Size</div>
              </div>
              <div className="p-4 rounded-xl bg-bg-elevated/60 border border-border text-center">
                <div className="text-2xl font-extrabold text-brand-purple">{result.percentOfBase}%</div>
                <div className="text-xs text-text-muted mt-1">of {fmt(TOTAL_BASE)} base</div>
              </div>
              <div className="p-4 rounded-xl bg-bg-elevated/60 border border-border text-center">
                <div className="text-2xl font-extrabold text-brand-green">${fmt(result.avgSpend)}</div>
                <div className="text-xs text-text-muted mt-1">Avg Annual Spend</div>
              </div>
            </div>

            {/* Criteria */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Segment Criteria</p>
              <div className="space-y-1">
                {result.criteria.map((c, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="text-text-muted">├─</span>
                    <span className="font-medium text-text-primary">{c.field}</span>
                    <span className="text-text-muted">{c.operator}</span>
                    <span className="text-brand-blue font-medium">{c.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Channels */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Recommended Channels</p>
              <div className="flex flex-wrap gap-2">
                {result.channels.map((ch) => (
                  <span key={ch} className="text-xs px-3 py-1.5 rounded-lg bg-brand-blue/10 text-brand-blue border border-brand-blue/20 font-medium">{ch}</span>
                ))}
              </div>
            </div>

            {/* Progress bar */}
            <div>
              <div className="flex items-center justify-between text-xs text-text-muted mb-1">
                <span>Audience reach</span>
                <span>{result.percentOfBase}% of base</span>
              </div>
              <div className="relative h-3 rounded-full bg-bg-elevated overflow-hidden">
                <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-brand-blue to-brand-indigo transition-all duration-700" style={{ width: `${Math.max(result.percentOfBase, 0.5)}%` }} />
              </div>
            </div>
          </div>
        </div>
      )}

      <p className="text-xs text-text-muted text-center">
        This lab simulates the cdp-audience-finder workflow. All data is illustrative.
      </p>
    </div>
  );
}
