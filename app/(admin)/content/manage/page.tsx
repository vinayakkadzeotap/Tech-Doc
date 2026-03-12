'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { ChevronDown, ChevronRight, Pencil, Trash2, Plus, Save, X } from 'lucide-react';

interface DBTrack {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  estimated_hours: number;
  target_roles: string[];
  mandatory: boolean;
  sort_order: number;
}

interface DBModule {
  track_id: string;
  id: string;
  title: string;
  description: string;
  icon: string;
  estimated_minutes: number;
  content_type: string;
  sort_order: number;
}

export default function ContentManagePage() {
  const [tracks, setTracks] = useState<DBTrack[]>([]);
  const [modules, setModules] = useState<DBModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedTrack, setExpandedTrack] = useState<string | null>(null);
  const [editingTrack, setEditingTrack] = useState<string | null>(null);
  const [editingModule, setEditingModule] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Record<string, string>>({});
  const { show } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const res = await fetch('/api/admin/content');
    if (res.ok) {
      const data = await res.json();
      setTracks(data.tracks || []);
      setModules(data.modules || []);
    }
    setLoading(false);
  }

  async function saveTrackEdit(trackId: string) {
    const res = await fetch('/api/admin/content', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'track',
        id: trackId,
        updates: {
          title: editForm.title,
          subtitle: editForm.subtitle,
          icon: editForm.icon,
        },
      }),
    });
    if (res.ok) {
      show({ message: 'Track updated!', icon: '✅', color: '#10b981' });
      setEditingTrack(null);
      loadData();
    } else {
      show({ message: 'Failed to save', icon: '❌', color: '#ef4444' });
    }
  }

  async function saveModuleEdit(trackId: string, moduleId: string) {
    const res = await fetch('/api/admin/content', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'module',
        id: moduleId,
        trackId,
        updates: {
          title: editForm.title,
          description: editForm.description,
          icon: editForm.icon,
          estimated_minutes: parseInt(editForm.estimated_minutes || '15'),
        },
      }),
    });
    if (res.ok) {
      show({ message: 'Module updated!', icon: '✅', color: '#10b981' });
      setEditingModule(null);
      loadData();
    } else {
      show({ message: 'Failed to save', icon: '❌', color: '#ef4444' });
    }
  }

  async function deleteModule(trackId: string, moduleId: string) {
    if (!confirm('Delete this module? This cannot be undone.')) return;
    const res = await fetch(`/api/admin/content?type=module&id=${moduleId}&trackId=${trackId}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      show({ message: 'Module deleted', icon: '✅', color: '#10b981' });
      loadData();
    }
  }

  function startTrackEdit(track: DBTrack) {
    setEditingTrack(track.id);
    setEditForm({ title: track.title, subtitle: track.subtitle, icon: track.icon });
  }

  function startModuleEdit(mod: DBModule) {
    setEditingModule(`${mod.track_id}:${mod.id}`);
    setEditForm({
      title: mod.title,
      description: mod.description,
      icon: mod.icon,
      estimated_minutes: String(mod.estimated_minutes),
    });
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-bg-surface rounded-xl w-48" />
          <div className="h-64 bg-bg-surface rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Content Management</h1>
        <p className="text-text-secondary text-sm mt-1">
          Edit tracks and modules. Changes reflect immediately across the platform.
        </p>
      </div>

      {tracks.length === 0 ? (
        <Card className="!p-8 text-center">
          <p className="text-text-muted">No tracks in database yet. Run migration 013 to seed content.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {tracks.map((track) => {
            const trackModules = modules
              .filter((m) => m.track_id === track.id)
              .sort((a, b) => a.sort_order - b.sort_order);
            const isExpanded = expandedTrack === track.id;
            const isEditing = editingTrack === track.id;

            return (
              <Card key={track.id} className="!p-0 overflow-hidden">
                {/* Track header */}
                <div className="flex items-center gap-3 p-4">
                  <button
                    onClick={() => setExpandedTrack(isExpanded ? null : track.id)}
                    className="flex-1 flex items-center gap-3 text-left"
                  >
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    <span className="text-xl">{track.icon}</span>
                    {isEditing ? (
                      <div className="flex-1 flex items-center gap-2">
                        <input
                          value={editForm.icon || ''}
                          onChange={(e) => setEditForm({ ...editForm, icon: e.target.value })}
                          className="w-10 bg-bg-surface border border-border rounded px-1 py-0.5 text-center"
                        />
                        <input
                          value={editForm.title || ''}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                          className="flex-1 bg-bg-surface border border-border rounded px-2 py-0.5 text-sm"
                        />
                      </div>
                    ) : (
                      <div>
                        <h3 className="font-bold text-sm">{track.title}</h3>
                        <p className="text-xs text-text-muted">{track.subtitle}</p>
                      </div>
                    )}
                  </button>
                  <span className="text-xs text-text-muted">{trackModules.length} modules</span>
                  {isEditing ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => saveTrackEdit(track.id)}
                        className="p-1.5 rounded-lg hover:bg-green-500/10 text-green-400"
                      >
                        <Save size={14} />
                      </button>
                      <button
                        onClick={() => setEditingTrack(null)}
                        className="p-1.5 rounded-lg hover:bg-bg-surface text-text-muted"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startTrackEdit(track)}
                      className="p-1.5 rounded-lg hover:bg-bg-surface text-text-muted hover:text-text-primary"
                    >
                      <Pencil size={14} />
                    </button>
                  )}
                </div>

                {/* Modules */}
                {isExpanded && (
                  <div className="border-t border-border">
                    {trackModules.map((mod) => {
                      const modKey = `${mod.track_id}:${mod.id}`;
                      const isModEditing = editingModule === modKey;

                      return (
                        <div
                          key={mod.id}
                          className="flex items-center gap-3 px-4 py-3 border-b border-border/30 last:border-b-0 hover:bg-bg-primary/20"
                        >
                          <span className="text-sm w-5 text-center">{mod.icon}</span>
                          {isModEditing ? (
                            <div className="flex-1 grid grid-cols-2 gap-2">
                              <input
                                value={editForm.title || ''}
                                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                className="bg-bg-surface border border-border rounded px-2 py-1 text-sm"
                                placeholder="Title"
                              />
                              <input
                                value={editForm.description || ''}
                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                className="bg-bg-surface border border-border rounded px-2 py-1 text-sm"
                                placeholder="Description"
                              />
                            </div>
                          ) : (
                            <div className="flex-1">
                              <span className="text-sm font-medium">{mod.title}</span>
                              <span className="text-xs text-text-muted ml-2">{mod.description}</span>
                            </div>
                          )}
                          <span className="text-xs text-text-muted">{mod.estimated_minutes}m</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-bg-surface text-text-muted">
                            {mod.content_type}
                          </span>
                          {isModEditing ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => saveModuleEdit(mod.track_id, mod.id)}
                                className="p-1 rounded hover:bg-green-500/10 text-green-400"
                              >
                                <Save size={12} />
                              </button>
                              <button
                                onClick={() => setEditingModule(null)}
                                className="p-1 rounded hover:bg-bg-surface text-text-muted"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => startModuleEdit(mod)}
                                className="p-1 rounded hover:bg-bg-surface text-text-muted hover:text-text-primary"
                              >
                                <Pencil size={12} />
                              </button>
                              <button
                                onClick={() => deleteModule(mod.track_id, mod.id)}
                                className="p-1 rounded hover:bg-red-500/10 text-text-muted hover:text-red-400"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
