'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import { Target, Plus, Trash2, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { TRACKS } from '@/lib/utils/roles';

interface AdoptionTarget {
  id: string;
  team: string | null;
  role: string | null;
  track_id: string;
  trackTitle: string;
  target_pct: number;
  deadline: string;
  currentPct: number;
  totalUsers: number;
  usersCompleted: number;
}

function getStatusColor(current: number, target: number, deadline: string) {
  const daysLeft = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);
  if (current >= target) return { color: 'text-green-400', bg: 'bg-green-500', label: 'On Track' };
  if (daysLeft < 0) return { color: 'text-red-400', bg: 'bg-red-500', label: 'Overdue' };
  const pctOfTime = daysLeft > 0 ? current / target : 0;
  if (pctOfTime < 0.5) return { color: 'text-red-400', bg: 'bg-red-500', label: 'Behind' };
  if (pctOfTime < 0.8) return { color: 'text-yellow-400', bg: 'bg-yellow-500', label: 'At Risk' };
  return { color: 'text-green-400', bg: 'bg-green-500', label: 'On Track' };
}

export default function AdoptionTargets() {
  const [targets, setTargets] = useState<AdoptionTarget[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ team: '', role: '', track_id: TRACKS[0]?.id || '', target_pct: 80, deadline: '' });

  const fetchTargets = () => {
    fetch('/api/admin/targets')
      .then((r) => r.ok ? r.json() : [])
      .then((data) => { setTargets(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchTargets(); }, []);

  const handleCreate = async () => {
    if (!form.track_id || !form.deadline) return;
    await fetch('/api/admin/targets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setShowForm(false);
    setForm({ team: '', role: '', track_id: TRACKS[0]?.id || '', target_pct: 80, deadline: '' });
    fetchTargets();
  };

  const handleDelete = async (id: string) => {
    await fetch('/api/admin/targets', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchTargets();
  };

  if (loading) {
    return <Card><div className="animate-pulse h-24 bg-bg-surface rounded" /></Card>;
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target size={18} className="text-brand-blue" />
          <h2 className="font-bold">Adoption Targets</h2>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-brand-blue/10 text-brand-blue rounded-lg hover:bg-brand-blue/20 transition-colors"
        >
          <Plus size={12} /> Add Target
        </button>
      </div>

      {showForm && (
        <div className="p-4 mb-4 rounded-xl bg-bg-primary/50 border border-border space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-text-muted block mb-1">Track</label>
              <select
                value={form.track_id}
                onChange={(e) => setForm({ ...form, track_id: e.target.value })}
                className="w-full px-3 py-2 bg-bg-surface border border-border rounded-lg text-sm"
              >
                {TRACKS.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-text-muted block mb-1">Target %</label>
              <input
                type="number"
                min={10}
                max={100}
                value={form.target_pct}
                onChange={(e) => setForm({ ...form, target_pct: parseInt(e.target.value) || 80 })}
                className="w-full px-3 py-2 bg-bg-surface border border-border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-text-muted block mb-1">Team (optional)</label>
              <input
                type="text"
                value={form.team}
                onChange={(e) => setForm({ ...form, team: e.target.value })}
                placeholder="e.g., EMEA Sales"
                className="w-full px-3 py-2 bg-bg-surface border border-border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-text-muted block mb-1">Deadline</label>
              <input
                type="date"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                className="w-full px-3 py-2 bg-bg-surface border border-border rounded-lg text-sm"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowForm(false)} className="px-3 py-1.5 text-xs text-text-muted hover:text-text-primary">Cancel</button>
            <button onClick={handleCreate} className="px-4 py-1.5 text-xs font-medium bg-brand-blue text-white rounded-lg hover:bg-brand-blue/90">Create</button>
          </div>
        </div>
      )}

      {targets.length === 0 ? (
        <p className="text-sm text-text-muted text-center py-6">No adoption targets set. Create one to track team progress against goals.</p>
      ) : (
        <div className="space-y-3">
          {targets.map((target) => {
            const status = getStatusColor(target.currentPct, target.target_pct, target.deadline);
            const daysLeft = Math.ceil((new Date(target.deadline).getTime() - Date.now()) / 86400000);
            const progressWidth = Math.min((target.currentPct / target.target_pct) * 100, 100);

            return (
              <div key={target.id} className="p-4 rounded-xl bg-bg-primary/30 border border-border">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-sm font-semibold">{target.trackTitle}</h3>
                    <p className="text-xs text-text-muted">
                      {target.team && `Team: ${target.team}`}
                      {target.team && target.role && ' · '}
                      {target.role && `Role: ${target.role}`}
                      {!target.team && !target.role && 'All users'}
                      {' · '}{target.totalUsers} users
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${status.color} ${status.bg}/10`}>
                      {target.currentPct >= target.target_pct ? <CheckCircle size={10} /> :
                       daysLeft < 0 ? <AlertCircle size={10} /> : <Clock size={10} />}
                      {status.label}
                    </span>
                    <button onClick={() => handleDelete(target.id)} className="text-text-muted hover:text-red-400 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="relative h-3 bg-bg-surface rounded-full overflow-hidden mb-2">
                  <div
                    className={`absolute inset-y-0 left-0 rounded-full ${status.bg} transition-all duration-500`}
                    style={{ width: `${progressWidth}%` }}
                  />
                  {/* Target marker */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-white/50"
                    style={{ left: '100%' }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-text-muted">
                  <span>{target.currentPct}% / {target.target_pct}% target ({target.usersCompleted}/{target.totalUsers} users)</span>
                  <span>{daysLeft > 0 ? `${daysLeft} days left` : daysLeft === 0 ? 'Due today' : `${Math.abs(daysLeft)} days overdue`}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
