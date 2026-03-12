'use client';

import { useState, useEffect, useCallback } from 'react';
import { TRACKS } from '@/lib/utils/roles';
import { downloadCSV } from '@/lib/utils/csv-export';
import Card from '@/components/ui/Card';
import { Grid3X3, Download, CheckCircle, Clock, Minus } from 'lucide-react';

interface MatrixModule {
  moduleId: string;
  moduleTitle: string;
  status: string;
}

interface MatrixMember {
  id: string;
  name: string;
  role: string;
  team: string;
  modules: MatrixModule[];
  completedCount: number;
  completionPct: number;
}

interface MatrixData {
  track: { id: string; title: string; color: string; moduleCount: number } | null;
  members: MatrixMember[];
}

const STATUS_ICONS: Record<string, { icon: typeof CheckCircle; color: string; bg: string }> = {
  completed: { icon: CheckCircle, color: '#10b981', bg: 'bg-green-500/15' },
  in_progress: { icon: Clock, color: '#f59e0b', bg: 'bg-amber-500/15' },
  not_started: { icon: Minus, color: 'rgba(255,255,255,0.15)', bg: 'bg-white/[0.03]' },
};

// Demo data for sparse teams
const DEMO_MEMBERS: MatrixMember[] = [
  { id: '1', name: 'Priya Sharma', role: 'cs', team: 'CS', modules: [], completedCount: 5, completionPct: 83 },
  { id: '2', name: 'Raj Patel', role: 'cs', team: 'CS', modules: [], completedCount: 4, completionPct: 67 },
  { id: '3', name: 'Anna Weber', role: 'cs', team: 'CS', modules: [], completedCount: 3, completionPct: 50 },
  { id: '4', name: 'Tom Chen', role: 'cs', team: 'CS', modules: [], completedCount: 2, completionPct: 33 },
  { id: '5', name: 'Sara Ali', role: 'cs', team: 'CS', modules: [], completedCount: 1, completionPct: 17 },
];

export default function SkillMatrix() {
  const [trackId, setTrackId] = useState<string>(TRACKS[0]?.id || '');
  const [data, setData] = useState<MatrixData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  const fetchMatrix = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/team/skill-matrix?track_id=${trackId}`);
      const json = await res.json();

      // Use demo data if team is too small
      if (!json.members || json.members.length < 2) {
        const track = TRACKS.find((t) => t.id === trackId);
        if (track) {
          const demoData: MatrixData = {
            track: { id: track.id, title: track.title, color: track.color, moduleCount: track.modules.length },
            members: DEMO_MEMBERS.map((m) => ({
              ...m,
              modules: track.modules.map((mod, i) => ({
                moduleId: mod.id,
                moduleTitle: mod.title,
                status: i < m.completedCount ? 'completed' : i === m.completedCount ? 'in_progress' : 'not_started',
              })),
            })),
          };
          setData(demoData);
        }
      } else {
        setData(json);
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, [trackId]);

  useEffect(() => { fetchMatrix(); }, [fetchMatrix]);

  const handleExport = () => {
    if (!data?.track || !data?.members.length) return;
    const headers = ['Name', 'Role', 'Team', ...data.members[0].modules.map((m) => m.moduleTitle), 'Completion %'];
    const rows = data.members.map((m) => [
      m.name, m.role, m.team,
      ...m.modules.map((mod) => mod.status === 'completed' ? 'Done' : mod.status === 'in_progress' ? 'In Progress' : '-'),
      String(m.completionPct),
    ]);
    downloadCSV(headers, rows, `skill_matrix_${trackId}`);
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Grid3X3 size={18} className="text-brand-purple" />
          <h3 className="font-bold">Skill Matrix</h3>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={trackId}
            onChange={(e) => setTrackId(e.target.value)}
            className="bg-bg-primary border border-border rounded-lg px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
          >
            {TRACKS.map((t) => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </select>
          <button
            onClick={handleExport}
            className="flex items-center gap-1 text-xs text-text-muted hover:text-brand-blue transition-colors"
          >
            <Download size={14} /> CSV
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4 text-xs text-text-muted">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-500/30" /> Completed</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-500/30" /> In Progress</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-white/[0.05]" /> Not Started</span>
      </div>

      {loading ? (
        <div className="h-48 rounded-xl bg-bg-primary animate-pulse" />
      ) : !data?.members.length ? (
        <p className="text-sm text-text-muted py-8 text-center">No team members found.</p>
      ) : (
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="text-left py-2 px-2 text-text-muted font-medium sticky left-0 bg-bg-surface z-10 min-w-[140px]">Member</th>
                {data.members[0]?.modules.map((mod) => (
                  <th key={mod.moduleId} className="text-center py-2 px-1 text-text-muted font-medium min-w-[36px]">
                    <div className="w-full truncate" title={mod.moduleTitle}>
                      {mod.moduleTitle.split(' ').map((w) => w[0]).join('').slice(0, 3)}
                    </div>
                  </th>
                ))}
                <th className="text-center py-2 px-2 text-text-muted font-medium min-w-[50px]">%</th>
              </tr>
            </thead>
            <tbody>
              {data.members.map((member) => (
                <tr key={member.id} className="border-t border-border/30 hover:bg-bg-primary/30">
                  <td className="py-2 px-2 sticky left-0 bg-bg-surface z-10">
                    <div className="font-medium text-text-primary truncate">{member.name}</div>
                    <div className="text-text-muted capitalize">{member.role}</div>
                  </td>
                  {member.modules.map((mod) => {
                    const config = STATUS_ICONS[mod.status] || STATUS_ICONS.not_started;
                    const cellKey = `${member.id}-${mod.moduleId}`;
                    return (
                      <td
                        key={mod.moduleId}
                        className="text-center py-2 px-1 relative"
                        onMouseEnter={() => setHoveredCell(cellKey)}
                        onMouseLeave={() => setHoveredCell(null)}
                      >
                        <div className={`w-7 h-7 mx-auto rounded-md flex items-center justify-center ${config.bg}`}>
                          <config.icon size={14} style={{ color: config.color }} />
                        </div>
                        {hoveredCell === cellKey && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 rounded bg-bg-elevated border border-border text-[10px] text-text-primary whitespace-nowrap z-20 shadow-lg">
                            {mod.moduleTitle}: {mod.status.replace('_', ' ')}
                          </div>
                        )}
                      </td>
                    );
                  })}
                  <td className="text-center py-2 px-2">
                    <span className={`font-bold ${
                      member.completionPct >= 75 ? 'text-green-400' :
                      member.completionPct >= 50 ? 'text-amber-400' : 'text-text-muted'
                    }`}>
                      {member.completionPct}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
