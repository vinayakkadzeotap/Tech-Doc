'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  X,
  ExternalLink,
  Play,
  Link2,
  BookOpen,
  Cpu,
} from 'lucide-react';
import {
  UNIVERSE_NODES,
  UNIVERSE_EDGES,
  CATEGORY_MAP,
  FLOW_PATHS,
  type UniverseNode,
} from '@/lib/utils/universe-data';

interface Props {
  nodeId: string;
  onClose: () => void;
  onSimulateFlow: (flowId: string) => void;
  onNavigateToNode: (nodeId: string) => void;
}

function getConnected(nodeId: string): UniverseNode[] {
  const ids = new Set<string>();
  UNIVERSE_EDGES.forEach((e) => {
    if (e.from === nodeId) ids.add(e.to);
    if (e.to === nodeId) ids.add(e.from);
  });
  return UNIVERSE_NODES.filter((n) => ids.has(n.id));
}

function getRelevantFlows(nodeId: string) {
  return FLOW_PATHS.filter((p) => p.nodeSequence.includes(nodeId));
}

export default function UniverseDetailPanel({
  nodeId,
  onClose,
  onSimulateFlow,
  onNavigateToNode,
}: Props) {
  const node = UNIVERSE_NODES.find((n) => n.id === nodeId);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Focus trap
  useEffect(() => {
    panelRef.current?.focus();
  }, [nodeId]);

  if (!node) return null;

  const cat = CATEGORY_MAP[node.category];
  const connected = getConnected(node.id);
  const flows = getRelevantFlows(node.id);

  return (
    <div
      ref={panelRef}
      tabIndex={-1}
      className="absolute top-0 right-0 bottom-0 z-30 w-full sm:w-[400px] bg-bg-elevated/95 backdrop-blur-xl border-l border-border overflow-y-auto outline-none animate-slide-in-panel"
      style={{
        animation: 'slideInPanel 0.3s ease-out',
      }}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-bg-elevated/90 backdrop-blur-xl border-b border-border px-6 py-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `${cat.color}20` }}
            >
              <Cpu size={18} style={{ color: cat.color }} />
            </div>
            <div>
              <h2 className="text-base font-bold text-text-primary">{node.label}</h2>
              <span
                className="text-[10px] font-bold uppercase tracking-wider"
                style={{ color: cat.color }}
              >
                {cat.label}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/[0.06] transition-colors"
            aria-label="Close panel"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="px-6 py-5 space-y-6">
        {/* Description */}
        <p className="text-sm text-text-secondary leading-relaxed">
          {node.description}
        </p>

        {/* Tech stack */}
        {node.techStack.length > 0 && (
          <div>
            <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">
              Tech Stack
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {node.techStack.map((t) => (
                <span
                  key={t}
                  className="text-xs px-2.5 py-1 rounded-lg font-medium"
                  style={{
                    background: `${cat.color}15`,
                    color: cat.color,
                    border: `1px solid ${cat.color}25`,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Connected nodes */}
        {connected.length > 0 && (
          <div>
            <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">
              <Link2 size={10} className="inline mr-1 -mt-0.5" />
              Connected To ({connected.length})
            </h3>
            <div className="space-y-1">
              {connected.map((cn) => {
                const cnCat = CATEGORY_MAP[cn.category];
                return (
                  <button
                    key={cn.id}
                    onClick={() => onNavigateToNode(cn.id)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left hover:bg-white/[0.04] transition-colors group"
                  >
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: cnCat.color }}
                    />
                    <span className="text-sm text-text-primary group-hover:text-white truncate">
                      {cn.label}
                    </span>
                    <ExternalLink
                      size={10}
                      className="text-text-muted ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Data flows through this node */}
        {flows.length > 0 && (
          <div>
            <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">
              <Play size={10} className="inline mr-1 -mt-0.5" />
              Data Flows
            </h3>
            <div className="space-y-1.5">
              {flows.map((f) => {
                const nodeIdx = f.nodeSequence.indexOf(node.id);
                return (
                  <button
                    key={f.id}
                    onClick={() => onSimulateFlow(f.id)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-white/[0.04] transition-colors group"
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${f.color}20` }}
                    >
                      <Play size={12} style={{ color: f.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-text-primary">
                        {f.label}
                      </div>
                      <div className="text-[10px] text-text-muted">
                        Step {nodeIdx + 1} of {f.nodeSequence.length}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Related learning modules */}
        {node.relatedModules.length > 0 && (
          <div>
            <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">
              <BookOpen size={10} className="inline mr-1 -mt-0.5" />
              Learn More
            </h3>
            <div className="space-y-1.5">
              {node.relatedModules.map((m) => (
                <Link
                  key={`${m.trackId}/${m.moduleId}`}
                  href={`/learn/${m.trackId}/${m.moduleId}`}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-white/[0.04] transition-colors group"
                >
                  <BookOpen
                    size={14}
                    className="text-text-muted flex-shrink-0"
                  />
                  <span className="text-sm text-text-primary group-hover:text-white truncate">
                    {m.title}
                  </span>
                  <ExternalLink
                    size={10}
                    className="text-text-muted ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
