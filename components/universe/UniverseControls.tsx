'use client';

import { useState } from 'react';
import {
  Search,
  RotateCcw,
  Play,
  Pause,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Gauge,
} from 'lucide-react';
import {
  CATEGORIES,
  FLOW_PATHS,
  type CategoryId,
} from '@/lib/utils/universe-data';

interface Props {
  hiddenCategories: Set<CategoryId>;
  toggleCategory: (id: CategoryId) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeFlowId: string | null;
  onFlowChange: (id: string | null) => void;
  flowSpeed: number;
  onFlowSpeedChange: (s: number) => void;
  onResetView: () => void;
}

export default function UniverseControls({
  hiddenCategories,
  toggleCategory,
  searchQuery,
  onSearchChange,
  activeFlowId,
  onFlowChange,
  flowSpeed,
  onFlowSpeedChange,
  onResetView,
}: Props) {
  const [layersOpen, setLayersOpen] = useState(false);

  return (
    <>
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none">
        <div className="flex items-start justify-between gap-4 p-4">
          {/* Left: title + instructions */}
          <div className="pointer-events-auto">
            <h1 className="text-sm font-extrabold tracking-wider bg-gradient-to-r from-brand-blue via-brand-purple to-brand-rose bg-clip-text text-transparent">
              ZEOTAP UNIVERSE
            </h1>
            <p className="text-[10px] text-text-muted mt-0.5 hidden sm:block">
              Drag to pan &middot; Scroll to zoom &middot; Click nodes to explore
            </p>
          </div>

          {/* Center: legend */}
          <div className="hidden md:flex items-center gap-3 pointer-events-auto flex-wrap justify-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                className={`flex items-center gap-1.5 text-[11px] font-medium transition-opacity ${
                  hiddenCategories.has(cat.id) ? 'opacity-30 line-through' : 'opacity-100'
                }`}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ background: cat.color }}
                />
                {cat.label}
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

      {/* Mobile layers toggle */}
      <div className="absolute top-16 left-4 z-20 md:hidden">
        <button
          onClick={() => setLayersOpen(!layersOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-bg-elevated/90 backdrop-blur border border-border rounded-lg text-text-secondary"
        >
          Layers {layersOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
        {layersOpen && (
          <div className="mt-2 p-3 bg-bg-elevated/95 backdrop-blur border border-border rounded-xl space-y-2 animate-fade-in">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                className="flex items-center gap-2 w-full text-left text-xs"
              >
                {hiddenCategories.has(cat.id) ? (
                  <EyeOff size={12} className="text-text-muted" />
                ) : (
                  <Eye size={12} className="text-text-primary" />
                )}
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: cat.color, opacity: hiddenCategories.has(cat.id) ? 0.3 : 1 }}
                />
                <span className={hiddenCategories.has(cat.id) ? 'text-text-muted line-through' : 'text-text-primary'}>
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bottom bar: flow simulation controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-bg-elevated/90 backdrop-blur border border-border rounded-2xl shadow-modal">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider mr-1 hidden sm:inline">
            Simulate
          </span>

          {FLOW_PATHS.map((path) => (
            <button
              key={path.id}
              onClick={() =>
                onFlowChange(activeFlowId === path.id ? null : path.id)
              }
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                activeFlowId === path.id
                  ? 'text-white shadow-lg'
                  : 'text-text-secondary hover:text-text-primary bg-white/[0.04] hover:bg-white/[0.08]'
              }`}
              style={
                activeFlowId === path.id
                  ? {
                      background: `${path.color}30`,
                      border: `1px solid ${path.color}60`,
                      boxShadow: `0 0 16px ${path.color}30`,
                    }
                  : {}
              }
            >
              {activeFlowId === path.id ? (
                <Pause size={11} />
              ) : (
                <Play size={11} />
              )}
              <span className="hidden sm:inline">{path.label}</span>
            </button>
          ))}

          {/* Speed control */}
          {activeFlowId && (
            <div className="flex items-center gap-1 ml-2 pl-2 border-l border-border-subtle">
              <Gauge size={12} className="text-text-muted" />
              {[0.5, 1, 2].map((s) => (
                <button
                  key={s}
                  onClick={() => onFlowSpeedChange(s)}
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    flowSpeed === s
                      ? 'bg-white/10 text-text-primary'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
