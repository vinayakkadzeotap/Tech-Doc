'use client';

import { useState } from 'react';
import { Network, FileText } from 'lucide-react';
import type { DomainId } from '@/lib/utils/codebase/types';
import DomainGraphTab from './DomainGraphTab';

interface Props {
  domainId: DomainId;
  children: React.ReactNode;
}

export default function DomainTabs({ domainId, children }: Props) {
  const [tab, setTab] = useState<'overview' | 'graph'>('overview');

  return (
    <div>
      {/* Tab switcher */}
      <div className="flex gap-1 p-1 mb-6 rounded-lg bg-bg-surface border border-border w-fit">
        <button
          onClick={() => setTab('overview')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-medium transition-all ${
            tab === 'overview'
              ? 'bg-bg-elevated text-text-primary shadow-sm'
              : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          <FileText size={13} />
          Overview
        </button>
        <button
          onClick={() => setTab('graph')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-medium transition-all ${
            tab === 'graph'
              ? 'bg-bg-elevated text-text-primary shadow-sm'
              : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          <Network size={13} />
          Dependency Graph
        </button>
      </div>

      {/* Content */}
      {tab === 'overview' ? children : <DomainGraphTab domainId={domainId} />}
    </div>
  );
}
