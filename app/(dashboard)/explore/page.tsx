'use client';

import { useState } from 'react';
import ArchitectureGraph from '@/components/learning/ArchitectureGraph';
import DataPipelineSimulator from '@/components/interactive/DataPipelineSimulator';
import SegmentBuilderSandbox from '@/components/interactive/SegmentBuilderSandbox';
import IdentityResolutionViz from '@/components/interactive/IdentityResolutionViz';
import JourneyBuilderDemo from '@/components/interactive/JourneyBuilderDemo';
import Leaderboard from '@/components/interactive/Leaderboard';

const TABS = [
  { id: 'pipeline', label: 'Data Pipeline', icon: '🔄', description: 'Watch data flow through the CDP in real-time' },
  { id: 'architecture', label: 'Architecture', icon: '🗺️', description: 'Interactive CDP component map' },
  { id: 'identity', label: 'Identity Resolution', icon: '🔗', description: 'See how profiles merge across devices' },
  { id: 'segments', label: 'Segment Builder', icon: '🎯', description: 'Practice building audience segments' },
  { id: 'journeys', label: 'Journey Builder', icon: '🗺️', description: 'Build customer journeys visually' },
  { id: 'leaderboard', label: 'Leaderboard', icon: '🏆', description: 'See top learners in the org' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState<TabId>('pipeline');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold">Interactive Explorer</h1>
        <p className="text-text-secondary text-sm mt-1">
          Hands-on simulators and visualizations. Learn by doing — see how things work live.
        </p>
      </div>

      {/* Tab navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
              ${activeTab === tab.id
                ? 'bg-brand-blue/15 text-brand-blue border border-brand-blue/30'
                : 'bg-bg-surface/50 text-text-secondary border border-border hover:border-border-strong hover:text-text-primary'
              }
            `}
          >
            <span>{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Active tab description */}
      <p className="text-xs text-text-muted mb-6">
        {TABS.find(t => t.id === activeTab)?.description}
      </p>

      {/* Tab content */}
      <div>
        {activeTab === 'pipeline' && <DataPipelineSimulator />}
        {activeTab === 'architecture' && <ArchitectureGraph />}
        {activeTab === 'identity' && <IdentityResolutionViz />}
        {activeTab === 'segments' && <SegmentBuilderSandbox />}
        {activeTab === 'journeys' && <JourneyBuilderDemo />}
        {activeTab === 'leaderboard' && <Leaderboard />}
      </div>
    </div>
  );
}
