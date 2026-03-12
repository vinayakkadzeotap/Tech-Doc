'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  X,
  ExternalLink,
  Link2,
  Database,
  Box,
  GitBranch,
  Layers,
  FolderTree,
  FileCode,
  Braces,
  FunctionSquare,
} from 'lucide-react';
import type { NodeType } from '@/lib/utils/codebase/graph-types';
import type { CodeGraph, GraphNode } from '@/lib/utils/codebase/graph-types';

interface Props {
  nodeId: string;
  graph: CodeGraph;
  onClose: () => void;
  onNavigateToNode: (nodeId: string) => void;
}

function getConnected(nodeId: string, graph: CodeGraph): GraphNode[] {
  const ids = new Set<string>();
  graph.edges.forEach((e) => {
    if (e.source === nodeId) ids.add(e.target);
    if (e.target === nodeId) ids.add(e.source);
  });
  return graph.nodes.filter((n) => ids.has(n.id));
}

const TYPE_ICONS: Record<NodeType, typeof Layers> = {
  domain: Layers,
  repo: GitBranch,
  module: Box,
  dependency: Database,
  repository: GitBranch,
  directory: FolderTree,
  file: FileCode,
  class: Braces,
  function: FunctionSquare,
};

export default function CodeGraphDetailPanel({
  nodeId,
  graph,
  onClose,
  onNavigateToNode,
}: Props) {
  const node = graph.nodes.find((n) => n.id === nodeId);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  useEffect(() => {
    panelRef.current?.focus();
  }, [nodeId]);

  if (!node) return null;

  const connected = getConnected(node.id, graph);
  const Icon = TYPE_ICONS[node.type];

  return (
    <div
      ref={panelRef}
      tabIndex={-1}
      className="absolute top-0 right-0 bottom-0 z-30 w-full sm:w-[380px] bg-bg-elevated/95 backdrop-blur-xl border-l border-border overflow-y-auto outline-none"
      style={{ animation: 'slideInPanel 0.3s ease-out' }}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-bg-elevated/90 backdrop-blur-xl border-b border-border px-6 py-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `${node.color}20` }}
            >
              <Icon size={18} style={{ color: node.color }} />
            </div>
            <div>
              <h2 className="text-base font-bold text-text-primary">{node.label}</h2>
              <span
                className="text-[10px] font-bold uppercase tracking-wider"
                style={{ color: node.color }}
              >
                {node.type}
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
        <p className="text-sm text-text-secondary leading-relaxed">{node.description}</p>

        {/* Metadata */}
        {node.type === 'repo' && (() => {
          const lang = node.metadata.language as string | undefined;
          const size = node.metadata.size as string | undefined;
          const langs = node.metadata.languages as { name: string; pct: number }[] | undefined;
          return (
            <div>
              <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">
                Details
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {lang && (
                  <span className="text-xs px-2.5 py-1 rounded-lg font-medium" style={{ background: `${node.color}15`, color: node.color, border: `1px solid ${node.color}25` }}>
                    {lang}
                  </span>
                )}
                {size && (
                  <span className="text-xs px-2.5 py-1 rounded-lg font-medium bg-white/[0.06] text-text-secondary">
                    {size}
                  </span>
                )}
              </div>
              {langs && langs.length > 0 && (
                <div className="mt-3">
                  <div className="flex h-2 rounded-full overflow-hidden bg-white/[0.06]">
                    {langs.map((l, i) => (
                      <div
                        key={l.name}
                        className="h-full"
                        style={{ width: `${l.pct}%`, background: `${node.color}${(80 - i * 20).toString(16)}` }}
                        title={`${l.name}: ${l.pct}%`}
                      />
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    {langs.map((l) => (
                      <span key={l.name} className="text-[10px] text-text-muted">
                        {l.name} {l.pct}%
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {node.type === 'dependency' && Boolean(node.metadata.depType) && (
          <div>
            <span className="text-xs px-2.5 py-1 rounded-lg font-medium" style={{ background: `${node.color}15`, color: node.color, border: `1px solid ${node.color}25` }}>
              {String(node.metadata.depType)}
            </span>
          </div>
        )}

        {node.type === 'module' && Boolean(node.metadata.path) && (
          <div>
            <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Path</h3>
            <code className="text-xs text-text-secondary bg-white/[0.04] px-2 py-1 rounded font-mono">
              {String(node.metadata.path)}
            </code>
          </div>
        )}

        {/* Domain link */}
        {node.type === 'domain' && Boolean(node.metadata.domainId) && (
          <Link
            href={`/codebase/${String(node.metadata.domainId)}`}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-white/[0.04] transition-colors group"
            style={{ color: node.color }}
          >
            View Domain Detail
            <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        )}

        {node.type === 'repo' && Boolean(node.metadata.domainId) && (
          <Link
            href={`/codebase/${String(node.metadata.domainId)}`}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-text-secondary hover:bg-white/[0.04] transition-colors group"
          >
            View in Domain
            <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        )}

        {/* Connected nodes */}
        {connected.length > 0 && (
          <div>
            <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">
              <Link2 size={10} className="inline mr-1 -mt-0.5" />
              Connected ({connected.length})
            </h3>
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {connected.map((cn) => {
                const CnIcon = TYPE_ICONS[cn.type];
                return (
                  <button
                    key={cn.id}
                    onClick={() => onNavigateToNode(cn.id)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left hover:bg-white/[0.04] transition-colors group"
                  >
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cn.color }} />
                    <span className="text-sm text-text-primary group-hover:text-white truncate">
                      {cn.label}
                    </span>
                    <span className="text-[9px] text-text-muted ml-auto">{cn.type}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
