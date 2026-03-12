'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import DataSourceBanner from '@/components/ui/DataSourceBanner';
import UniverseCanvas from '@/components/universe/UniverseCanvas';
import UniverseControls from '@/components/universe/UniverseControls';
import UniverseDetailPanel from '@/components/universe/UniverseDetailPanel';
import UniverseMinimap from '@/components/universe/UniverseMinimap';
import { UNIVERSE_NODES, type CategoryId } from '@/lib/utils/universe-data';

interface Transform {
  x: number;
  y: number;
  scale: number;
}

const DEFAULT_TRANSFORM: Transform = { x: -200, y: -50, scale: 0.75 };

export default function UniversePage() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hiddenCategories, setHiddenCategories] = useState<Set<CategoryId>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFlowId, setActiveFlowId] = useState<string | null>(null);
  const [flowSpeed, setFlowSpeed] = useState(1);
  const [transform, setTransform] = useState<Transform>(DEFAULT_TRANSFORM);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ w: 1200, h: 800 });

  // Measure container
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setContainerSize({
          w: containerRef.current.clientWidth,
          h: containerRef.current.clientHeight,
        });
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const toggleCategory = useCallback((id: CategoryId) => {
    setHiddenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const resetView = useCallback(() => {
    setTransform(DEFAULT_TRANSFORM);
    setSearchQuery('');
    setActiveFlowId(null);
    setSelectedNode(null);
  }, []);

  // Navigate to node: select it and center the view
  const navigateToNode = useCallback(
    (nodeId: string) => {
      const node = UNIVERSE_NODES.find((n) => n.id === nodeId);
      if (!node) return;
      setSelectedNode(nodeId);
      setTransform({
        scale: 1.2,
        x: -node.x * 1.2 + containerSize.w / 2,
        y: -node.y * 1.2 + containerSize.h / 2,
      });
    },
    [containerSize]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === 'r' || e.key === 'R') resetView();
      if (e.key === 'Escape') setSelectedNode(null);
      if (e.key === '+' || e.key === '=') {
        setTransform((t) => ({
          ...t,
          scale: Math.min(3, t.scale * 1.2),
        }));
      }
      if (e.key === '-') {
        setTransform((t) => ({
          ...t,
          scale: Math.max(0.25, t.scale / 1.2),
        }));
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [resetView]);

  const searchHighlight = searchQuery.length >= 2 ? searchQuery : null;

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-bg-primary overflow-hidden"
      style={{ height: 'calc(100vh - 64px)' }}
    >
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 w-full max-w-lg px-4">
        <DataSourceBanner />
      </div>
      <UniverseCanvas
        selectedNode={selectedNode}
        onSelectNode={setSelectedNode}
        hoveredNode={hoveredNode}
        onHoverNode={setHoveredNode}
        hiddenCategories={hiddenCategories}
        searchHighlight={searchHighlight}
        activeFlowId={activeFlowId}
        flowSpeed={flowSpeed}
        transform={transform}
        setTransform={setTransform}
      />

      <UniverseControls
        hiddenCategories={hiddenCategories}
        toggleCategory={toggleCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFlowId={activeFlowId}
        onFlowChange={setActiveFlowId}
        flowSpeed={flowSpeed}
        onFlowSpeedChange={setFlowSpeed}
        onResetView={resetView}
      />

      <UniverseMinimap
        transform={transform}
        setTransform={setTransform}
        hiddenCategories={hiddenCategories}
        containerWidth={containerSize.w}
        containerHeight={containerSize.h}
      />

      {/* Detail panel */}
      {selectedNode && (
        <UniverseDetailPanel
          nodeId={selectedNode}
          onClose={() => setSelectedNode(null)}
          onSimulateFlow={(flowId) => {
            setActiveFlowId(flowId);
            setSelectedNode(null);
          }}
          onNavigateToNode={navigateToNode}
        />
      )}
    </div>
  );
}
