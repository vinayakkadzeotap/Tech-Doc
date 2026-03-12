'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import { BarChart3 } from 'lucide-react';

interface TeamData {
  team: string;
  completionRate: number;
  memberCount: number;
}

const TIER_COLORS = {
  high: '#10b981',
  medium: '#f59e0b',
  low: '#ef4444',
};

function getTierColor(rate: number) {
  if (rate >= 60) return TIER_COLORS.high;
  if (rate >= 30) return TIER_COLORS.medium;
  return TIER_COLORS.low;
}

// Sample data for demo
const SAMPLE_TEAMS: TeamData[] = [
  { team: 'Platform', completionRate: 78, memberCount: 6 },
  { team: 'Identity', completionRate: 65, memberCount: 4 },
  { team: 'Data', completionRate: 52, memberCount: 5 },
  { team: 'Enterprise CS', completionRate: 48, memberCount: 3 },
  { team: 'EMEA Sales', completionRate: 42, memberCount: 4 },
  { team: 'Growth', completionRate: 35, memberCount: 3 },
  { team: 'Audiences', completionRate: 28, memberCount: 4 },
  { team: 'Activation', completionRate: 22, memberCount: 3 },
];

export default function TeamComparisonChart() {
  const [teams, setTeams] = useState<TeamData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/executive-report?days=365')
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.teamBreakdown?.length > 1) {
          setTeams(data.teamBreakdown.map((t: { team: string; completionRate: number; memberCount: number }) => ({
            team: t.team,
            completionRate: t.completionRate,
            memberCount: t.memberCount,
          })));
        } else {
          setTeams(SAMPLE_TEAMS);
        }
        setLoading(false);
      })
      .catch(() => { setTeams(SAMPLE_TEAMS); setLoading(false); });
  }, []);

  if (loading) {
    return <Card><div className="animate-pulse h-48 bg-bg-surface rounded" /></Card>;
  }

  const maxRate = Math.max(...teams.map((t) => t.completionRate), 1);

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 size={18} className="text-brand-blue" />
        <h2 className="font-bold">Team Completion Comparison</h2>
      </div>

      <div className="space-y-3">
        {teams.sort((a, b) => b.completionRate - a.completionRate).map((team) => {
          const color = getTierColor(team.completionRate);
          return (
            <div key={team.team} className="flex items-center gap-3">
              <span className="text-sm font-medium w-32 truncate text-text-secondary">{team.team}</span>
              <div className="flex-1 relative h-6 bg-bg-elevated rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
                  style={{
                    width: `${(team.completionRate / maxRate) * 100}%`,
                    backgroundColor: color,
                    minWidth: team.completionRate > 0 ? '2rem' : '0',
                  }}
                />
                <span className="absolute inset-y-0 left-3 flex items-center text-xs font-bold text-white drop-shadow-sm">
                  {team.completionRate}%
                </span>
              </div>
              <span className="text-xs text-text-muted w-20 text-right">{team.memberCount} members</span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border">
        {Object.entries(TIER_COLORS).map(([tier, color]) => (
          <div key={tier} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-xs text-text-muted capitalize">{tier === 'high' ? '60%+' : tier === 'medium' ? '30-59%' : '<30%'}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
