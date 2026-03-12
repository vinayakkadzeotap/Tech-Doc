'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import { AlertTriangle, Send, Clock, CheckCircle, XCircle } from 'lucide-react';
import type { LearnerHealth } from '@/lib/utils/learner-health';

const STATUS_CONFIG = {
  active: { color: 'text-green-400', bg: 'bg-green-500/10', label: 'Active', icon: CheckCircle },
  'at-risk': { color: 'text-yellow-400', bg: 'bg-yellow-500/10', label: 'At Risk', icon: AlertTriangle },
  disengaged: { color: 'text-red-400', bg: 'bg-red-500/10', label: 'Disengaged', icon: XCircle },
};

export default function AtRiskLearners() {
  const [learners, setLearners] = useState<LearnerHealth[]>([]);
  const [loading, setLoading] = useState(true);
  const [nudging, setNudging] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/team?health=true')
      .then((r) => r.ok ? r.json() : { healthData: [] })
      .then((data) => {
        setLearners(data.healthData || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const sendNudge = async (userId: string, name: string) => {
    setNudging(userId);
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          type: 'nudge',
          title: 'Time to learn!',
          message: `Hey ${name.split(' ')[0]}, your team is making progress. Jump back in and keep the momentum going!`,
          link: '/learn',
        }),
      });
    } catch { /* best-effort */ }
    setNudging(null);
  };

  const atRisk = learners.filter((l) => l.status !== 'active');

  if (loading) {
    return (
      <Card>
        <div className="animate-pulse space-y-3">
          <div className="h-6 w-40 bg-bg-surface rounded" />
          <div className="h-12 bg-bg-surface rounded" />
          <div className="h-12 bg-bg-surface rounded" />
        </div>
      </Card>
    );
  }

  if (atRisk.length === 0) return null;

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle size={18} className="text-yellow-400" />
        <h2 className="font-bold">Learners Needing Attention</h2>
        <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 font-medium">
          {atRisk.length}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 px-2 text-text-muted font-medium">Learner</th>
              <th className="text-left py-2 px-2 text-text-muted font-medium">Status</th>
              <th className="text-center py-2 px-2 text-text-muted font-medium">Last Active</th>
              <th className="text-center py-2 px-2 text-text-muted font-medium">Progress</th>
              <th className="text-center py-2 px-2 text-text-muted font-medium">Overdue</th>
              <th className="text-right py-2 px-2 text-text-muted font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {atRisk.map((learner) => {
              const config = STATUS_CONFIG[learner.status];
              const StatusIcon = config.icon;
              return (
                <tr key={learner.userId} className="border-b border-border/30 hover:bg-bg-hover/50">
                  <td className="py-3 px-2">
                    <div>
                      <span className="font-medium">{learner.name}</span>
                      <span className="text-xs text-text-muted ml-2 capitalize">{learner.role}</span>
                    </div>
                    <span className="text-xs text-text-muted">{learner.team}</span>
                  </td>
                  <td className="py-3 px-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
                      <StatusIcon size={10} />
                      {config.label}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <div className="flex items-center justify-center gap-1 text-xs">
                      <Clock size={12} className="text-text-muted" />
                      {learner.daysSinceLastActivity < 0
                        ? <span className="text-text-muted">Never</span>
                        : <span className={learner.daysSinceLastActivity > 14 ? 'text-red-400' : 'text-text-secondary'}>
                            {learner.daysSinceLastActivity}d ago
                          </span>
                      }
                    </div>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <span className="text-xs font-medium">{learner.completionPct}%</span>
                  </td>
                  <td className="py-3 px-2 text-center">
                    {learner.overdueAssignments > 0 ? (
                      <span className="text-xs font-medium text-red-400">{learner.overdueAssignments}</span>
                    ) : (
                      <span className="text-xs text-text-muted">0</span>
                    )}
                  </td>
                  <td className="py-3 px-2 text-right">
                    <button
                      onClick={() => sendNudge(learner.userId, learner.name)}
                      disabled={nudging === learner.userId}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-blue/10 text-brand-blue text-xs font-medium hover:bg-brand-blue/20 transition-colors disabled:opacity-50"
                    >
                      <Send size={10} />
                      {nudging === learner.userId ? 'Sending...' : 'Nudge'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
