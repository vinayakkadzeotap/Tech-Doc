'use client';

import { useState } from 'react';
import {
  Search,
  RotateCcw,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import type { NodeType, EdgeType, Transform } from '@/lib/utils/codebase/graph-types';
import type { Dispatch, SetStateAction } from 'react';

const ALL_NODE_TYPES: { id: NodeType; label: string; color: string }[] = [
  { id: 'domain', label: 'Domains', color: '#6366f1' },
  { id: 'repo', label: 'Repos', color: '#3b82f6' },
  { id: 'module', label: 'Modules', color: '#8b5cf6' },
  { id: 'dependency', label: 'Dependencies', color: '#10b981' },
  { id: 'repository', label: 'Repository', color: '#f59e0b' },
  { id: 'directory', label: 'Directories', color: '#6366f1' },
  { id: 'file', label: 'Files', color: '#3b82f6' },
  { id: 'class', label: 'Classes', color: '#10b981' },
  { id: 'function', label: 'Functions', color: '#ec4899' },
];

const ALL_EDGE_TYPES: { id: EdgeType; label: string; color: string }[] = [
  { id: 'contains', label: 'Contains', color: '#94a3b8' },
  { id: 'has-module', label: 'Has Module', color: '#94a3b8' },
  { id: 'depends-on', label: 'Depends On', color: '#60a5fa' },
  { id: 'inter-repo', label: 'Inter-Repo', color: '#fbbf24' },
  { id: 'calls', label: 'Calls', color: '#ec4899' },
  { id: 'imports', label: 'Imports', color: '#8b5cf6' },
];

interface Props {
  hiddenNodeTypes: Set<NodeType>;
  toggleNodeType: (t: NodeType) => void;
  hiddenEdgeTypes: Set<EdgeType>;
  toggleEdgeType: (t: EdgeType) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onResetView: () => void;
  setTransform: Dispatch<SetStateAction<Transform>>;
  nodeCount: number;
  edgeCount: number;
  activeNodeTypes?: Set<NodeType>;
  activeEdgeTypes?: Set<EdgeType>;
}

export default function CodeGraphControls({
  hiddenNodeTypes,
  toggleNodeType,
  hiddenEdgeTypes,
  toggleEdgeType,
  searchQuery,
  onSearchChange,
  onResetView,
  setTransform,
  nodeCount,
  edgeCount,
  activeNodeTypes,
  activeEdgeTypes,
}: Props) {
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Only show types that exist in the current graph
  const NODE_TYPES = activeNodeTypes
    ? ALL_NODE_TYPES.filter((nt) => activeNodeTypes.has(nt.id))
    : ALL_NODE_TYPES.filter((nt) => ['domain', 'repo', 'module', 'dependency'].includes(nt.id));
  const EDGE_TYPES = activeEdgeTypes
    ? ALL_EDGE_TYPES.filter((et) => activeEdgeTypes.has(et.id))
    : ALL_EDGE_TYPES.filter((et) => ['contains', 'has-module', 'depends-on', 'inter-repo'].includes(et.id));

  const zoom = (factor: number) => {
    setTransform((prev) => ({
      ...prev,
      scale: Math.min(4, Math.max(0.15, prev.scale * factor)),
    }));
  };

  return (
    <>
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none">
        <div className="flex items-start justify-between gap-4 p-4">
          {/* Left: title */}
          <div className="pointer-events-auto">
            <h1 className="text-sm font-extrabold tracking-wider bg-gradient-to-r from-brand-blue via-brand-purple to-emerald-400 bg-clip-text text-transparent">
              CODE GRAPH
            </h1>
            <p className="text-[10px] text-text-muted mt-0.5 hidden sm:block">
              {nodeCount} nodes &middot; {edgeCount} edges &middot; Drag to pan &middot; Scroll to zoom
            </p>
          </div>

          {/* Center: node type legend (desktop) */}
          <div className="hidden md:flex items-center gap-3 pointer-events-auto flex-wrap justify-center">
            {NODE_TYPES.map((nt) => (
              <button
                key={nt.id}
                onClick={() => toggleNodeType(nt.id)}
                className={`flex items-center gap-1.5 text-[11px] font-medium transition-opacity ${
                  hiddenNodeTypes.has(nt.id) ? 'opacity-30 line-through' : 'opacity-100'
                }`}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ background: nt.color }}
                />
                {nt.label}
              </button>
            ))}
          </div>

          {/* Right: search + reset */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Filter nodes..."
                className="w-36 sm:w-48 pl-8 pr-3 py-1.5 text-xs bg-bg-elevated/80 backdrop-blur border border-border rounded-lg text-text-primary placeholder-text-muted outline-none focus:ring-1 focus:ring-brand-blue"
              />
            </div>
            <button
              onClick={onResetView}
              className="p-2 rounded-lg bg-bg-elevated/80 backdrop-blur border border-border text-text-secondary hover:text-text-primary transition-colors"
              title="Reset view (R)"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile filter toggle */}
      <div className="absolute top-16 left-4 z-20 md:hidden">
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-bg-elevated/90 backdrop-blur border border-border rounded-lg text-text-secondary"
        >
          Filters {filtersOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
        {filtersOpen && (
          <div className="mt-2 p-3 bg-bg-elevated/95 backdrop-blur border border-border rounded-xl space-y-2 animate-fade-in">
            <p className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Nodes</p>
            {NODE_TYPES.map((nt) => (
              <button
                key={nt.id}
                onClick={() => toggleNodeType(nt.id)}
                className="flex items-center gap-2 w-full text-left text-xs"
              >
                {hiddenNodeTypes.has(nt.id) ? <EyeOff size={12} className="text-text-muted" /> : <Eye size={12} className="text-text-primary" />}
                <div className="w-2 h-2 rounded-full" style={{ background: nt.color, opacity: hiddenNodeTypes.has(nt.id) ? 0.3 : 1 }} />
                <span className={hiddenNodeTypes.has(nt.id) ? 'text-text-muted line-through' : 'text-text-primary'}>{nt.label}</span>
              </button>
            ))}
            <p className="text-[9px] font-bold text-text-muted uppercase tracking-wider mt-3">Edges</p>
            {EDGE_TYPES.map((et) => (
              <button
                key={et.id}
                onClick={() => toggleEdgeType(et.id)}
                className="flex items-center gap-2 w-full text-left text-xs"
              >
                {hiddenEdgeTypes.has(et.id) ? <EyeOff size={12} className="text-text-muted" /> : <Eye size={12} className="text-text-primary" />}
                <div className="w-4 h-0.5 rounded-full" style={{ background: et.color, opacity: hiddenEdgeTypes.has(et.id) ? 0.3 : 1 }} />
                <span className={hiddenEdgeTypes.has(et.id) ? 'text-text-muted line-through' : 'text-text-primary'}>{et.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bottom bar: zoom + edge legend */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-bg-elevated/90 backdrop-blur border border-border rounded-2xl shadow-modal">
          <button onClick={() => zoom(1.3)} className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary transition-colors" title="Zoom in">
            <ZoomIn size={16} />
          </button>
          <button onClick={() => zoom(0.7)} className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary transition-colors" title="Zoom out">
            <ZoomOut size={16} />
          </button>
          <div className="w-px h-5 bg-border mx-1" />
          {EDGE_TYPES.map((et) => (
            <button
              key={et.id}
              onClick={() => toggleEdgeType(et.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all ${
                hiddenEdgeTypes.has(et.id)
                  ? 'text-text-muted opacity-40'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <div className="w-3 h-0.5 rounded-full" style={{ background: et.color }} />
              <span className="hidden sm:inline">{et.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
