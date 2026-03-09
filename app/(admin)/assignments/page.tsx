'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { TRACKS } from '@/lib/utils/roles';

interface Assignment {
  id: string;
  assigned_to: string;
  track_id: string;
  due_date: string | null;
  status: string;
  notes: string;
  created_at: string;
  assigned_to_profile?: { full_name: string; email: string };
  assigned_by_profile?: { full_name: string };
}

interface User {
  id: string;
  full_name: string;
  email: string;
  role: string;
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedTrack, setSelectedTrack] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const { show } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const supabase = createClient();

    const { data: assignmentData } = await supabase
      .from('assignments')
      .select('*')
      .order('created_at', { ascending: false });

    const { data: userData } = await supabase
      .from('profiles')
      .select('id, full_name, email, role')
      .order('full_name');

    setAssignments(assignmentData || []);
    setUsers(userData || []);
    setLoading(false);
  }

  async function createAssignment() {
    if (!selectedUser || !selectedTrack) return;
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from('assignments').insert({
      assigned_by: user?.id,
      assigned_to: selectedUser,
      track_id: selectedTrack,
      due_date: dueDate || null,
      notes,
      status: 'assigned',
    });

    if (!error) {
      show({ message: 'Assignment created!', icon: '✅', color: '#10b981' });
      setShowForm(false);
      setSelectedUser('');
      setSelectedTrack('');
      setDueDate('');
      setNotes('');
      loadData();
    }
    setSaving(false);
  }

  const statusColors: Record<string, string> = {
    assigned: '#3b82f6',
    in_progress: '#f59e0b',
    completed: '#10b981',
    overdue: '#ef4444',
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-bg-surface rounded-xl w-48" />
          <div className="h-64 bg-bg-surface rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Assignments</h1>
          <p className="text-text-secondary text-sm mt-1">
            Assign learning tracks to team members
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Assign Track'}
        </Button>
      </div>

      {/* Create form */}
      {showForm && (
        <Card className="space-y-4 animate-fade-in">
          <h3 className="font-bold">New Assignment</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-secondary">User</label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full bg-bg-surface/50 border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-blue"
              >
                <option value="">Select user...</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.full_name || u.email} ({u.role})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-secondary">Track</label>
              <select
                value={selectedTrack}
                onChange={(e) => setSelectedTrack(e.target.value)}
                className="w-full bg-bg-surface/50 border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-blue"
              >
                <option value="">Select track...</option>
                {TRACKS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.icon} {t.title} ({t.totalModules} modules)
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-secondary">Due Date (optional)</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-bg-surface/50 border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-secondary">Notes (optional)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Priority for Q1 onboarding"
                className="w-full bg-bg-surface/50 border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
          </div>
          <Button onClick={createAssignment} loading={saving} disabled={!selectedUser || !selectedTrack}>
            Create Assignment
          </Button>
        </Card>
      )}

      {/* Assignments list */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 text-text-muted font-medium">User</th>
                <th className="text-left py-3 px-2 text-text-muted font-medium">Track</th>
                <th className="text-left py-3 px-2 text-text-muted font-medium">Status</th>
                <th className="text-left py-3 px-2 text-text-muted font-medium">Due</th>
                <th className="text-left py-3 px-2 text-text-muted font-medium">Assigned</th>
              </tr>
            </thead>
            <tbody>
              {assignments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-text-muted">
                    No assignments yet. Create one above.
                  </td>
                </tr>
              ) : (
                assignments.map((a) => {
                  const track = TRACKS.find((t) => t.id === a.track_id);
                  const assignedUser = users.find((u) => u.id === a.assigned_to);
                  return (
                    <tr key={a.id} className="border-b border-border-subtle hover:bg-bg-hover">
                      <td className="py-3 px-2">
                        <div className="font-medium">{assignedUser?.full_name || '—'}</div>
                        <div className="text-[11px] text-text-muted">{assignedUser?.email}</div>
                      </td>
                      <td className="py-3 px-2">
                        <span className="mr-1">{track?.icon}</span>
                        {track?.title || a.track_id}
                      </td>
                      <td className="py-3 px-2">
                        <Badge color={statusColors[a.status] || '#94a3b8'}>
                          {a.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-text-muted">
                        {a.due_date ? new Date(a.due_date).toLocaleDateString() : '—'}
                      </td>
                      <td className="py-3 px-2 text-text-muted">
                        {new Date(a.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
