'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import type { GraphNode, GraphEdge, NodeType, EdgeType, Transform, CodeGraph } from '@/lib/utils/codebase/graph-types';
import CodeGraphCanvas from '@/components/codebase/CodeGraphCanvas';
import CodeGraphControls from '@/components/codebase/CodeGraphControls';
import CodeGraphDetailPanel from '@/components/codebase/CodeGraphDetailPanel';
import CodeGraphMinimap from '@/components/codebase/CodeGraphMinimap';

const DEFAULT_TRANSFORM: Transform = { x: 100, y: 50, scale: 0.4 };

interface CgcNode {
  id: string;
  label: string;
  type: string;
  color: string;
  radius: number;
  description: string;
  metadata: Record<string, unknown>;
}

interface CgcData {
  nodes: CgcNode[];
  edges: { id: string; source: string; target: string; type: string }[];
  meta: { stats: Record<string, number>; exportedAt: string };
}

function buildGraphFromCgc(data: CgcData): CodeGraph {
  // Assign random initial positions, force sim will settle them
  const nodes: GraphNode[] = data.nodes.map((n, i) => ({
    ...n,
    type: n.type as NodeType,
    x: 800 + (Math.random() - 0.5) * 2000,
    y: 500 + (Math.random() - 0.5) * 1500,
    vx: 0,
    vy: 0,
  }));
  const edges: GraphEdge[] = data.edges.map((e) => ({
    ...e,
    type: e.type as EdgeType,
  }));
  return { nodes, edges };
}

export default function DeepGraphPage() {
  const [data, setData] = useState<CgcData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/data/cgc-graph.json')
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load graph data: ${r.status}`);
        return r.json();
      })
      .then((d) => { setData(d); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, []);

  const graph = useMemo(() => data ? buildGraphFromCgc(data) : null, [data]);

  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hiddenNodeTypes, setHiddenNodeTypes] = useState<Set<NodeType>>(new Set<NodeType>(['function']));
  const [hiddenEdgeTypes, setHiddenEdgeTypes] = useState<Set<EdgeType>>(new Set<EdgeType>(['calls']));
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
      if (next.has(t)) next.delete(t); else next.add(t);
      return next;
    });
  }, []);

  const toggleEdgeType = useCallback((t: EdgeType) => {
    setHiddenEdgeTypes((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t); else next.add(t);
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
      if (!graph) return;
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

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === 'r' || e.key === 'R') resetView();
      if (e.key === 'Escape') setSelectedNode(null);
      if (e.key === '+' || e.key === '=') setTransform((t) => ({ ...t, scale: Math.min(4, t.scale * 1.2) }));
      if (e.key === '-') setTransform((t) => ({ ...t, scale: Math.max(0.15, t.scale / 1.2) }));
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [resetView]);

  const searchHighlight = searchQuery.length >= 2 ? searchQuery : null;

  // Compute active types from data
  const activeNodeTypes = useMemo(() => {
    if (!graph) return new Set<NodeType>();
    return new Set(graph.nodes.map((n) => n.type));
  }, [graph]);

  const activeEdgeTypes = useMemo(() => {
    if (!graph) return new Set<EdgeType>();
    return new Set(graph.edges.map((e) => e.type));
  }, [graph]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-bg-primary">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-brand-blue border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-text-muted">Loading code graph data...</p>
        </div>
      </div>
    );
  }

  if (error || !graph) {
    return (
      <div className="flex items-center justify-center h-screen bg-bg-primary">
        <div className="text-center max-w-md p-8">
          <p className="text-sm text-red-400 mb-2">Failed to load graph</p>
          <p className="text-xs text-text-muted">{error || 'No data available'}</p>
          <p className="text-xs text-text-muted mt-4">
            Run <code className="bg-bg-elevated px-2 py-0.5 rounded">node scripts/export-cgc-graph.mjs</code> to generate the data.
          </p>
        </div>
      </div>
    );
  }

  const visibleNodes = graph.nodes.filter((n) => !hiddenNodeTypes.has(n.type)).length;
  const visibleEdges = graph.edges.filter((e) => !hiddenEdgeTypes.has(e.type)).length;

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-bg-primary overflow-hidden"
      style={{ height: 'calc(100vh - 64px)' }}
    >
      <div className="absolute top-4 left-4 z-30">
        <Link
          href="/codebase"
          className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-brand-blue transition-colors bg-bg-elevated/80 backdrop-blur px-3 py-1.5 rounded-lg border border-border"
        >
          <ChevronLeft size={14} />
          Codebase
        </Link>
      </div>

      {data?.meta?.stats && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30">
          <div className="flex items-center gap-3 px-4 py-2 bg-bg-elevated/80 backdrop-blur border border-border rounded-xl text-[10px] text-text-muted">
            <span><strong className="text-text-primary">{data.meta.stats.repos}</strong> repos</span>
            <span><strong className="text-text-primary">{data.meta.stats.files}</strong> files</span>
            <span><strong className="text-text-primary">{data.meta.stats.classes}</strong> classes</span>
            <span><strong className="text-text-primary">{data.meta.stats.functions}</strong> functions</span>
            <span className="text-text-muted">via CodeGraphContext</span>
          </div>
        </div>
      )}

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
        activeNodeTypes={activeNodeTypes}
        activeEdgeTypes={activeEdgeTypes}
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
