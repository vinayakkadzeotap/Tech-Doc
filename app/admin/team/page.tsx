'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import ProgressBar from '@/components/ui/ProgressBar';
import SkillMatrix from '@/components/admin/SkillMatrix';
import AtRiskLearners from '@/components/admin/AtRiskLearners';
import { Users, Award, BookOpen, TrendingUp } from 'lucide-react';
import Breadcrumb from '@/components/ui/Breadcrumb';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  team: string;
  modulesCompleted: number;
  badgesEarned: number;
  trackProgress: Array<{
    trackId: string;
    trackTitle: string;
    color: string;
    completed: number;
    total: number;
    pct: number;
  }>;
}

interface TeamData {
  summary: { total: number; avgProgress: number; topTrack: string };
  members: TeamMember[];
}

// Sample data for demo
const SAMPLE_DATA: TeamData = {
  summary: { total: 8, avgProgress: 12, topTrack: 'Business Essentials' },
  members: [
    { id: '1', name: 'Priya Sharma', email: 'priya@example.com', role: 'marketing', team: 'Growth', modulesCompleted: 18, badgesEarned: 4, trackProgress: [{ trackId: 'business-essentials', trackTitle: 'Business Essentials', color: '#3b82f6', completed: 8, total: 10, pct: 80 }] },
    { id: '2', name: 'Marco Rodriguez', email: 'marco@example.com', role: 'sales', team: 'Enterprise', modulesCompleted: 14, badgesEarned: 3, trackProgress: [{ trackId: 'sales-enablement', trackTitle: 'Sales Enablement', color: '#10b981', completed: 6, total: 12, pct: 50 }] },
    { id: '3', name: 'Sarah Kim', email: 'sarah@example.com', role: 'engineering', team: 'Platform', modulesCompleted: 22, badgesEarned: 5, trackProgress: [{ trackId: 'engineering', trackTitle: 'Engineering Deep Dive', color: '#8b5cf6', completed: 10, total: 12, pct: 83 }] },
    { id: '4', name: 'Jordan Lee', email: 'jordan@example.com', role: 'cs', team: 'CS', modulesCompleted: 9, badgesEarned: 2, trackProgress: [{ trackId: 'cs-playbook', trackTitle: 'CS Playbook', color: '#f59e0b', completed: 4, total: 10, pct: 40 }] },
  ],
};

export default function TeamPage() {
  const [data, setData] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/team')
      .then((r) => r.ok ? r.json() : null)
      .then((d) => {
        setData(d && d.summary?.total >= 2 ? d : SAMPLE_DATA);
        setLoading(false);
      })
      .catch(() => {
        setData(SAMPLE_DATA);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-bg-surface rounded" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-bg-surface rounded-xl" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;
  const isDemo = data === SAMPLE_DATA;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumb items={[
        { label: 'Admin', href: '/admin/dashboard' },
        { label: 'Team Dashboard' },
      ]} />
      <div>
        <h1 className="text-2xl font-extrabold">Team Dashboard</h1>
        <p className="text-text-secondary text-sm mt-1">
          Track your team&apos;s learning progress
        </p>
        {isDemo && (
          <p className="text-xs text-text-muted mt-2 px-3 py-1.5 bg-bg-surface rounded-lg inline-block">
            Showing sample data for demonstration
          </p>
        )}
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="!p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Users size={20} className="text-blue-500" />
            </div>
            <div>
              <div className="text-2xl font-extrabold">{data.summary.total}</div>
              <div className="text-xs text-text-muted">Team Members</div>
            </div>
          </div>
        </Card>
        <Card className="!p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <BookOpen size={20} className="text-green-500" />
            </div>
            <div>
              <div className="text-2xl font-extrabold">{data.summary.avgProgress}</div>
              <div className="text-xs text-text-muted">Avg Modules / Person</div>
            </div>
          </div>
        </Card>
        <Card className="!p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <TrendingUp size={20} className="text-purple-500" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-sm truncate">{data.summary.topTrack || 'N/A'}</div>
              <div className="text-xs text-text-muted">Most Active Track</div>
            </div>
          </div>
        </Card>
      </div>

      {/* At-Risk Learners */}
      <AtRiskLearners />

      {/* Skill Matrix */}
      <SkillMatrix />

      {/* Team members */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold">Team Members</h2>
        {data.members.map((member) => (
          <Card key={member.id} className="!p-5">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-blue to-brand-purple flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-bold">{member.name}</h3>
                  <p className="text-xs text-text-muted">{member.role} · {member.team || 'No team'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-text-muted">
                <span className="flex items-center gap-1">
                  <BookOpen size={12} /> {member.modulesCompleted} modules
                </span>
                <span className="flex items-center gap-1">
                  <Award size={12} /> {member.badgesEarned} badges
                </span>
              </div>
            </div>

            {member.trackProgress.length > 0 ? (
              <div className="space-y-2">
                {member.trackProgress.map((tp) => (
                  <div key={tp.trackId} className="flex items-center gap-3">
                    <span className="text-xs text-text-secondary w-40 truncate">{tp.trackTitle}</span>
                    <div className="flex-1">
                      <ProgressBar value={tp.pct} color={tp.color} size="sm" />
                    </div>
                    <span className="text-xs text-text-muted w-16 text-right">{tp.completed}/{tp.total}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-text-muted">No track progress yet</p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
