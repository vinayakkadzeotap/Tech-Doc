'use client';

import { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Card from '@/components/ui/Card';
import DataSourceIndicator from '@/components/ui/DataSourceIndicator';

interface AnalyticsData {
  dailyActiveUsers: Array<{ date: string; count: number }>;
  moduleCompletions: Array<{ date: string; count: number }>;
  topSearches: Array<{ term: string; count: number }>;
  summary: {
    wau: number;
    mau: number;
    totalEvents: number;
    assistantQueries: number;
  };
}

// Sample data for demo mode
const SAMPLE_DATA: AnalyticsData = {
  dailyActiveUsers: Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 13 + i);
    return {
      date: d.toISOString().slice(0, 10),
      count: Math.floor(15 + Math.random() * 25 + i * 1.5),
    };
  }),
  moduleCompletions: Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 13 + i);
    return {
      date: d.toISOString().slice(0, 10),
      count: Math.floor(3 + Math.random() * 12),
    };
  }),
  topSearches: [
    { term: 'kafka', count: 24 },
    { term: 'identity resolution', count: 18 },
    { term: 'audience builder', count: 15 },
    { term: 'data pipeline', count: 12 },
    { term: 'UCID', count: 10 },
    { term: 'journey canvas', count: 8 },
    { term: 'BigQuery', count: 7 },
    { term: 'GDPR', count: 5 },
  ],
  summary: { wau: 38, mau: 47, totalEvents: 1842, assistantQueries: 156 },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function AnalyticsCharts() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics')
      .then((r) => r.json())
      .then((d) => {
        // Use sample data if real data is too sparse
        if (d.dailyActiveUsers?.length < 3) {
          setData(SAMPLE_DATA);
        } else {
          setData(d);
        }
      })
      .catch(() => setData(SAMPLE_DATA))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <div className="h-48 bg-bg-elevated/50 rounded-xl animate-pulse" />
          </Card>
        ))}
      </div>
    );
  }

  if (!data) return null;

  const isLive = data !== SAMPLE_DATA;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <DataSourceIndicator isLive={isLive} />
        {!isLive && (
          <p className="text-[10px] text-amber-400">
            Connect live data sources to see real metrics
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Weekly Active', value: data.summary.wau, color: '#3b82f6' },
          { label: 'Monthly Active', value: data.summary.mau, color: '#10b981' },
          { label: 'Total Events', value: data.summary.totalEvents.toLocaleString(), color: '#a855f7' },
          { label: 'AI Queries', value: data.summary.assistantQueries, color: '#f59e0b' },
        ].map((s) => (
          <div key={s.label} className="p-3 rounded-xl bg-bg-surface/50 border border-border">
            <div className="text-lg font-extrabold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-[10px] text-text-muted">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* DAU Chart */}
        <Card>
          <h3 className="text-sm font-bold text-text-primary mb-4">Daily Active Users</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={data.dailyActiveUsers}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={{ fontSize: 10, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }}
                labelFormatter={formatDate}
              />
              <Area type="monotone" dataKey="count" stroke="#3b82f6" fill="#3b82f620" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Module Completions Chart */}
        <Card>
          <h3 className="text-sm font-bold text-text-primary mb-4">Module Completions</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={data.moduleCompletions}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={{ fontSize: 10, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }}
                labelFormatter={formatDate}
              />
              <Bar dataKey="count" fill="#a855f7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Top Searches */}
        <Card>
          <h3 className="text-sm font-bold text-text-primary mb-4">Top Search Terms</h3>
          <div className="space-y-2">
            {data.topSearches.slice(0, 8).map((s, i) => (
              <div key={s.term} className="flex items-center gap-3">
                <span className="text-[10px] text-text-muted w-4 text-right">{i + 1}</span>
                <span className="text-xs font-medium text-text-primary flex-1 truncate">{s.term}</span>
                <div className="w-20 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-brand-blue"
                    style={{ width: `${(s.count / (data.topSearches[0]?.count || 1)) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-text-muted w-6 text-right">{s.count}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* AI Assistant Usage */}
        <Card>
          <h3 className="text-sm font-bold text-text-primary mb-4">Engagement Summary</h3>
          <div className="space-y-3">
            {[
              { label: 'Page Views', value: data.summary.totalEvents, max: data.summary.totalEvents, color: '#3b82f6' },
              { label: 'AI Assistant Queries', value: data.summary.assistantQueries, max: data.summary.totalEvents, color: '#f59e0b' },
              { label: 'Weekly Active Users', value: data.summary.wau, max: data.summary.mau, color: '#10b981' },
              { label: 'Monthly Active Users', value: data.summary.mau, max: data.summary.mau, color: '#a855f7' },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-text-secondary">{item.label}</span>
                  <span className="text-xs font-bold" style={{ color: item.color }}>{item.value}</span>
                </div>
                <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.max(5, (item.value / item.max) * 100)}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
