'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Card from '@/components/ui/Card';
import { downloadCSV } from '@/lib/utils/csv-export';
import { TrendingUp, Users, Award, Clock, Download, BarChart3, Table2 } from 'lucide-react';
import DataSourceIndicator from '@/components/ui/DataSourceIndicator';

interface ROIData {
  medianTimeToFirstCompletion?: number;
  firstCompletionCount?: number;
  summary: {
    adoptionRate: number;
    avgTimeToCompetency: number;
    certificationRate: number;
    avgCompletionPct: number;
    totalUsers: number;
    activeUsers: number;
    certifiedUsers: number;
    avgQuizScore: number;
  };
  roleCompletion: { role: string; total: number; active: number; rate: number }[];
  teamCompletion: { team: string; members: number; active: number; activeRate: number; mandatoryComplete: number; mandatoryRate: number }[];
  timeToCompetency: { role: string; avgDays: number; medianDays: number; fastest: number; slowest: number; count: number }[];
  certifiedComparison: {
    certified: { count: number; avgModules: number };
    nonCertified: { count: number; avgModules: number };
  };
}

const ROLE_COLORS: Record<string, string> = {
  engineering: '#6366f1',
  sales: '#f59e0b',
  cs: '#10b981',
  product: '#a855f7',
  marketing: '#ec4899',
  leadership: '#3b82f6',
  hr: '#14b8a6',
};

// Demo data for when real data is sparse
const DEMO_DATA: ROIData = {
  summary: { adoptionRate: 72, avgTimeToCompetency: 14, certificationRate: 35, avgCompletionPct: 58, totalUsers: 50, activeUsers: 36, certifiedUsers: 18, avgQuizScore: 82 },
  roleCompletion: [
    { role: 'engineering', total: 18, active: 15, rate: 83 },
    { role: 'sales', total: 9, active: 7, rate: 78 },
    { role: 'cs', total: 8, active: 6, rate: 75 },
    { role: 'product', total: 6, active: 4, rate: 67 },
    { role: 'marketing', total: 4, active: 2, rate: 50 },
    { role: 'leadership', total: 3, active: 2, rate: 67 },
    { role: 'hr', total: 2, active: 0, rate: 0 },
  ],
  teamCompletion: [
    { team: 'Platform', members: 12, active: 10, activeRate: 83, mandatoryComplete: 8, mandatoryRate: 67 },
    { team: 'Sales EMEA', members: 5, active: 4, activeRate: 80, mandatoryComplete: 3, mandatoryRate: 60 },
    { team: 'Sales US', members: 4, active: 3, activeRate: 75, mandatoryComplete: 2, mandatoryRate: 50 },
    { team: 'CS', members: 8, active: 6, activeRate: 75, mandatoryComplete: 5, mandatoryRate: 63 },
    { team: 'Product', members: 6, active: 4, activeRate: 67, mandatoryComplete: 3, mandatoryRate: 50 },
    { team: 'Data Engineering', members: 6, active: 5, activeRate: 83, mandatoryComplete: 4, mandatoryRate: 67 },
  ],
  timeToCompetency: [
    { role: 'engineering', avgDays: 12, medianDays: 10, fastest: 5, slowest: 25, count: 15 },
    { role: 'sales', avgDays: 18, medianDays: 16, fastest: 8, slowest: 30, count: 7 },
    { role: 'cs', avgDays: 15, medianDays: 14, fastest: 7, slowest: 28, count: 6 },
    { role: 'product', avgDays: 14, medianDays: 12, fastest: 6, slowest: 22, count: 4 },
  ],
  certifiedComparison: {
    certified: { count: 18, avgModules: 32 },
    nonCertified: { count: 32, avgModules: 8 },
  },
};

export default function ROICharts() {
  const [data, setData] = useState<ROIData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/roi')
      .then((res) => res.json())
      .then((d) => {
        // Use demo data if real data is too sparse
        if (d.summary && d.summary.totalUsers < 5) {
          setData(DEMO_DATA);
        } else {
          setData(d);
        }
      })
      .catch(() => setData(DEMO_DATA))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 rounded-2xl bg-bg-surface/50 border border-border animate-pulse" />
        ))}
      </div>
    );
  }

  const isLive = data !== DEMO_DATA;
  const { summary, roleCompletion, teamCompletion, timeToCompetency, certifiedComparison } = data;

  const medianFirst = data.medianTimeToFirstCompletion ?? 0;
  const firstCount = data.firstCompletionCount ?? 0;

  const statCards = [
    { label: 'Adoption Rate', value: `${summary.adoptionRate}%`, sub: `${summary.activeUsers}/${summary.totalUsers} users`, color: '#3b82f6', icon: Users },
    { label: 'Avg Time-to-Competency', value: `${summary.avgTimeToCompetency}d`, sub: 'days to mandatory completion', color: '#10b981', icon: Clock },
    { label: 'Certification Rate', value: `${summary.certificationRate}%`, sub: `${summary.certifiedUsers} certified`, color: '#a855f7', icon: Award },
    { label: 'Avg Completion', value: `${summary.avgCompletionPct}%`, sub: `Avg quiz score: ${summary.avgQuizScore}%`, color: '#f59e0b', icon: TrendingUp },
    { label: 'Time to First Module', value: `${medianFirst}d`, sub: `median across ${firstCount} users`, color: '#ec4899', icon: Clock },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <DataSourceIndicator isLive={isLive} />
        {!isLive && (
          <p className="text-[10px] text-amber-400">
            ROI metrics use sample data until enough users are onboarded
          </p>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="relative overflow-hidden rounded-2xl border border-border bg-bg-surface/50 p-5">
            <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-[0.07] blur-2xl -translate-y-6 translate-x-6" style={{ background: stat.color }} />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <stat.icon size={16} style={{ color: stat.color }} />
                <span className="text-xs text-text-muted font-medium">{stat.label}</span>
              </div>
              <div className="text-3xl font-extrabold" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-xs text-text-muted mt-1">{stat.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Completion by Role */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 size={18} className="text-brand-blue" />
            <h3 className="font-bold">Adoption by Role</h3>
          </div>
          <button
            onClick={() => downloadCSV(
              ['Role', 'Total Users', 'Active Users', 'Adoption Rate %'],
              roleCompletion.map((r) => [r.role, String(r.total), String(r.active), String(r.rate)]),
              'adoption_by_role'
            )}
            className="flex items-center gap-1 text-xs text-text-muted hover:text-brand-blue transition-colors"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={roleCompletion} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="role" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ background: '#1e1e2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                labelStyle={{ color: 'white' }}
              />
              <Bar dataKey="rate" name="Adoption %" radius={[6, 6, 0, 0]}>
                {roleCompletion.map((entry) => (
                  <Cell key={entry.role} fill={ROLE_COLORS[entry.role] || '#6366f1'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Team Completion Table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Table2 size={18} className="text-brand-green" />
            <h3 className="font-bold">Completion by Team</h3>
          </div>
          <button
            onClick={() => downloadCSV(
              ['Team', 'Members', 'Active', 'Active %', 'Mandatory Complete', 'Mandatory %'],
              teamCompletion.map((t) => [t.team, String(t.members), String(t.active), String(t.activeRate), String(t.mandatoryComplete), String(t.mandatoryRate)]),
              'completion_by_team'
            )}
            className="flex items-center gap-1 text-xs text-text-muted hover:text-brand-blue transition-colors"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 text-text-muted font-medium">Team</th>
                <th className="text-center py-3 px-2 text-text-muted font-medium">Members</th>
                <th className="text-center py-3 px-2 text-text-muted font-medium">Active</th>
                <th className="text-center py-3 px-2 text-text-muted font-medium">Active %</th>
                <th className="text-center py-3 px-2 text-text-muted font-medium">Mandatory %</th>
              </tr>
            </thead>
            <tbody>
              {teamCompletion.map((team) => (
                <tr key={team.team} className="border-b border-border/50 hover:bg-bg-primary/30">
                  <td className="py-3 px-2 font-medium">{team.team}</td>
                  <td className="text-center py-3 px-2">{team.members}</td>
                  <td className="text-center py-3 px-2">{team.active}</td>
                  <td className="text-center py-3 px-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      team.activeRate >= 75 ? 'bg-green-500/10 text-green-400' :
                      team.activeRate >= 50 ? 'bg-amber-500/10 text-amber-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>
                      {team.activeRate}%
                    </span>
                  </td>
                  <td className="text-center py-3 px-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      team.mandatoryRate >= 75 ? 'bg-green-500/10 text-green-400' :
                      team.mandatoryRate >= 50 ? 'bg-amber-500/10 text-amber-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>
                      {team.mandatoryRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Time-to-Competency Table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-brand-purple" />
            <h3 className="font-bold">Time-to-Competency by Role</h3>
          </div>
          <button
            onClick={() => downloadCSV(
              ['Role', 'Users', 'Avg Days', 'Median Days', 'Fastest', 'Slowest'],
              timeToCompetency.map((t) => [t.role, String(t.count), String(t.avgDays), String(t.medianDays), String(t.fastest), String(t.slowest)]),
              'time_to_competency'
            )}
            className="flex items-center gap-1 text-xs text-text-muted hover:text-brand-blue transition-colors"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
        {timeToCompetency.length === 0 ? (
          <p className="text-sm text-text-muted py-4">No users have completed mandatory training yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 text-text-muted font-medium">Role</th>
                  <th className="text-center py-3 px-2 text-text-muted font-medium">Users</th>
                  <th className="text-center py-3 px-2 text-text-muted font-medium">Avg Days</th>
                  <th className="text-center py-3 px-2 text-text-muted font-medium">Median</th>
                  <th className="text-center py-3 px-2 text-text-muted font-medium">Fastest</th>
                  <th className="text-center py-3 px-2 text-text-muted font-medium">Slowest</th>
                </tr>
              </thead>
              <tbody>
                {timeToCompetency.map((row) => (
                  <tr key={row.role} className="border-b border-border/50 hover:bg-bg-primary/30">
                    <td className="py-3 px-2 font-medium capitalize">{row.role}</td>
                    <td className="text-center py-3 px-2">{row.count}</td>
                    <td className="text-center py-3 px-2 font-bold" style={{ color: ROLE_COLORS[row.role] || '#6366f1' }}>{row.avgDays}d</td>
                    <td className="text-center py-3 px-2">{row.medianDays}d</td>
                    <td className="text-center py-3 px-2 text-green-400">{row.fastest}d</td>
                    <td className="text-center py-3 px-2 text-red-400">{row.slowest}d</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Certified vs Non-Certified */}
      <Card>
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Award size={18} className="text-brand-amber" />
          Certified vs Non-Certified
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4">
            <div className="text-sm text-green-400 font-medium mb-1">Certified Users</div>
            <div className="text-2xl font-extrabold text-green-400">{certifiedComparison.certified.count}</div>
            <div className="text-xs text-text-muted mt-1">Avg {certifiedComparison.certified.avgModules} modules completed</div>
          </div>
          <div className="rounded-xl border border-border bg-bg-primary/30 p-4">
            <div className="text-sm text-text-muted font-medium mb-1">Non-Certified Users</div>
            <div className="text-2xl font-extrabold text-text-primary">{certifiedComparison.nonCertified.count}</div>
            <div className="text-xs text-text-muted mt-1">Avg {certifiedComparison.nonCertified.avgModules} modules completed</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
