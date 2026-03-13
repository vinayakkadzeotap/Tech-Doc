'use client';

import { useState } from 'react';
import {
  Workflow,
  GitBranch,
  Link,
  Target,
  Map,
  Trophy,
  Users,
  AlertTriangle,
  Activity,
  type LucideIcon,
} from 'lucide-react';
import ArchitectureGraph from '@/components/learning/ArchitectureGraph';
import DataPipelineSimulator from '@/components/interactive/DataPipelineSimulator';
import SegmentBuilderSandbox from '@/components/interactive/SegmentBuilderSandbox';
import IdentityResolutionViz from '@/components/interactive/IdentityResolutionViz';
import JourneyBuilderDemo from '@/components/interactive/JourneyBuilderDemo';
import Leaderboard from '@/components/interactive/Leaderboard';
import AudienceBuilderLab from '@/components/interactive/AudienceBuilderLab';
import ChurnDetectionLab from '@/components/interactive/ChurnDetectionLab';
import DataHealthDashboard from '@/components/interactive/DataHealthDashboard';

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
  description: string;
  color: string;
}

interface TabGroup {
  label: string;
  tabs: Tab[];
}

const TAB_GROUPS: TabGroup[] = [
  {
    label: 'Data & Infrastructure',
    tabs: [
      { id: 'pipeline', label: 'Data Pipeline', icon: Workflow, description: 'Watch data flow through the CDP in real-time', color: '#6366f1' },
      { id: 'architecture', label: 'Architecture', icon: GitBranch, description: 'Interactive CDP component map', color: '#3b82f6' },
      { id: 'identity', label: 'Identity Resolution', icon: Link, description: 'See how profiles merge across devices', color: '#10b981' },
      { id: 'data-health', label: 'Data Health', icon: Activity, description: 'Monitor pipeline health, diagnose failures, and inspect destination status', color: '#14b8a6' },
    ],
  },
  {
    label: 'Audience & Journeys',
    tabs: [
      { id: 'segments', label: 'Segment Builder', icon: Target, description: 'Practice building audience segments', color: '#f59e0b' },
      { id: 'audience', label: 'Audience Builder', icon: Users, description: 'Build audience segments following CDP workflow', color: '#0ea5e9' },
      { id: 'journeys', label: 'Journey Builder', icon: Map, description: 'Build customer journeys visually', color: '#ec4899' },
      { id: 'churn', label: 'Churn Detection', icon: AlertTriangle, description: 'Identify churn signals, score customer risk, and recommend interventions', color: '#ef4444' },
    ],
  },
  {
    label: 'Community',
    tabs: [
      { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, description: 'See top learners in the org', color: '#a855f7' },
    ],
  },
];

const ALL_TABS = TAB_GROUPS.flatMap((g) => g.tabs);

type TabId = string;

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState<TabId>('pipeline');

  const activeTabData = ALL_TABS.find(t => t.id === activeTab)!;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold">Interactive Explorer</h1>
        <p className="text-text-secondary text-sm mt-1">
          Hands-on simulators and visualizations. Learn by doing — see how things work live.
        </p>
      </div>

      {/* Tab navigation - grouped with labels on desktop, scrollable on mobile */}
      <div className="space-y-3 mb-6">
        {TAB_GROUPS.map((group) => (
          <div key={group.label}>
            <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-1.5 hidden sm:block">
              {group.label}
            </h3>
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap scrollbar-hide">
              {group.tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0
                      ${isActive
                        ? 'text-white border border-transparent shadow-lg'
                        : 'bg-bg-surface/50 text-text-secondary border border-border hover:border-border-strong hover:text-text-primary'
                      }
                    `}
                    style={isActive ? { background: tab.color, boxShadow: `0 4px 20px ${tab.color}30` } : undefined}
                  >
                    <IconComponent size={16} strokeWidth={isActive ? 2.5 : 2} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Active tab description */}
      <div className="flex items-center gap-2 mb-6">
        <div
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: activeTabData.color }}
        />
        <p className="text-xs text-text-muted">
          {activeTabData.description}
        </p>
      </div>

      {/* Tab content */}
      <div>
        {activeTab === 'pipeline' && <DataPipelineSimulator />}
        {activeTab === 'architecture' && <ArchitectureGraph />}
        {activeTab === 'identity' && <IdentityResolutionViz />}
        {activeTab === 'segments' && <SegmentBuilderSandbox />}
        {activeTab === 'journeys' && <JourneyBuilderDemo />}
        {activeTab === 'leaderboard' && <Leaderboard />}
        {activeTab === 'audience' && <AudienceBuilderLab />}
        {activeTab === 'churn' && <ChurnDetectionLab />}
        {activeTab === 'data-health' && <DataHealthDashboard />}
      </div>
    </div>
  );
}
