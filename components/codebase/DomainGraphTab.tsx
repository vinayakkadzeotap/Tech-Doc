'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { DOMAINS } from '@/lib/utils/codebase';
import type { DomainId } from '@/lib/utils/codebase/types';
import { buildCodeGraph } from '@/lib/utils/codebase/graph-builder';
import type { NodeType, EdgeType, Transform } from '@/lib/utils/codebase/graph-types';
import CodeGraphCanvas from './CodeGraphCanvas';
import CodeGraphControls from './CodeGraphControls';
import CodeGraphDetailPanel from './CodeGraphDetailPanel';
import CodeGraphMinimap from './CodeGraphMinimap';

interface Props {
  domainId: DomainId;
}

const DEFAULT_TRANSFORM: Transform = { x: 200, y: 100, scale: 0.7 };

export default function DomainGraphTab({ domainId }: Props) {
  const graph = useMemo(
    () => buildCodeGraph(DOMAINS, { domainFilter: [domainId], includeModules: true, includeDependencies: true }),
    [domainId]
  );

  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hiddenNodeTypes, setHiddenNodeTypes] = useState<Set<NodeType>>(new Set());
  const [hiddenEdgeTypes, setHiddenEdgeTypes] = useState<Set<EdgeType>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [transform, setTransform] = useState<Transform>(DEFAULT_TRANSFORM);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ w: 900, h: 600 });

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

  const searchHighlight = searchQuery.length >= 2 ? searchQuery : null;
  const visibleNodes = graph.nodes.filter((n) => !hiddenNodeTypes.has(n.type)).length;
  const visibleEdges = graph.edges.filter((e) => !hiddenEdgeTypes.has(e.type)).length;

  return (
    <div ref={containerRef} className="relative w-full rounded-xl overflow-hidden border border-border" style={{ height: '600px' }}>
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
