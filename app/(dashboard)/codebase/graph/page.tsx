'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { DOMAINS } from '@/lib/utils/codebase';
import { buildCodeGraph } from '@/lib/utils/codebase/graph-builder';
import type { NodeType, EdgeType, Transform } from '@/lib/utils/codebase/graph-types';
import CodeGraphCanvas from '@/components/codebase/CodeGraphCanvas';
import CodeGraphControls from '@/components/codebase/CodeGraphControls';
import CodeGraphDetailPanel from '@/components/codebase/CodeGraphDetailPanel';
import CodeGraphMinimap from '@/components/codebase/CodeGraphMinimap';

const DEFAULT_TRANSFORM: Transform = { x: 100, y: 50, scale: 0.6 };

export default function CodeGraphPage() {
  const graph = useMemo(
    () => buildCodeGraph(DOMAINS, { includeModules: true, includeDependencies: true }),
    []
  );

  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hiddenNodeTypes, setHiddenNodeTypes] = useState<Set<NodeType>>(new Set());
  const [hiddenEdgeTypes, setHiddenEdgeTypes] = useState<Set<EdgeType>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [transform, setTransform] = useState<Transform>(DEFAULT_TRANSFORM);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ w: 1200, h: 800 });

  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setContainerSize({ w: containerRef.current.clientWidth, h: containerRef.current.clientHeight });
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const toggleNodeType = useCallback((t: NodeType) => {
    setHiddenNodeTypes((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
  }, []);

  const toggleEdgeType = useCallback((t: EdgeType) => {
    setHiddenEdgeTypes((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
  }, []);

  const resetView = useCallback(() => {
    setTransform(DEFAULT_TRANSFORM);
    setSearchQuery('');
    setSelectedNode(null);
  }, []);

  const navigateToNode = useCallback(
    (nodeId: string) => {
      const node = graph.nodes.find((n) => n.id === nodeId);
      if (!node) return;
      setSelectedNode(nodeId);
      setTransform({
        scale: 1.2,
        x: -node.x * 1.2 + containerSize.w / 2,
        y: -node.y * 1.2 + containerSize.h / 2,
      });
    },
    [graph, containerSize]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === 'r' || e.key === 'R') resetView();
      if (e.key === 'Escape') setSelectedNode(null);
      if (e.key === '+' || e.key === '=') {
        setTransform((t) => ({ ...t, scale: Math.min(4, t.scale * 1.2) }));
      }
      if (e.key === '-') {
        setTransform((t) => ({ ...t, scale: Math.max(0.15, t.scale / 1.2) }));
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [resetView]);

  const searchHighlight = searchQuery.length >= 2 ? searchQuery : null;

  const visibleNodes = graph.nodes.filter((n) => !hiddenNodeTypes.has(n.type)).length;
  const visibleEdges = graph.edges.filter((e) => !hiddenEdgeTypes.has(e.type)).length;

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-bg-primary overflow-hidden"
      style={{ height: 'calc(100vh - 64px)' }}
    >
      {/* Back link */}
      <div className="absolute top-4 left-4 z-30">
        <Link
          href="/codebase"
          className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-brand-blue transition-colors bg-bg-elevated/80 backdrop-blur px-3 py-1.5 rounded-lg border border-border"
        >
          <ChevronLeft size={14} />
          Codebase
        </Link>
      </div>

      <CodeGraphCanvas
        graph={graph}
        selectedNode={selectedNode}
        onSelectNode={setSelectedNode}
        hoveredNode={hoveredNode}
        onHoverNode={setHoveredNode}
        hiddenNodeTypes={hiddenNodeTypes}
        hiddenEdgeTypes={hiddenEdgeTypes}
        searchHighlight={searchHighlight}
        transform={transform}
        setTransform={setTransform}
      />

      <CodeGraphControls
        hiddenNodeTypes={hiddenNodeTypes}
        toggleNodeType={toggleNodeType}
        hiddenEdgeTypes={hiddenEdgeTypes}
        toggleEdgeType={toggleEdgeType}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onResetView={resetView}
        setTransform={setTransform}
        nodeCount={visibleNodes}
        edgeCount={visibleEdges}
      />

      <CodeGraphMinimap
        graph={graph}
        transform={transform}
        setTransform={setTransform}
        hiddenNodeTypes={hiddenNodeTypes}
        containerWidth={containerSize.w}
        containerHeight={containerSize.h}
      />

      {selectedNode && (
        <CodeGraphDetailPanel
          nodeId={selectedNode}
          graph={graph}
          onClose={() => setSelectedNode(null)}
          onNavigateToNode={navigateToNode}
        />
      )}
    </div>
  );
}
