'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface JourneyNode {
  id: string;
  type: 'trigger' | 'condition' | 'action' | 'destination';
  label: string;
  x: number;
  y: number;
}

interface Connection {
  from: string;
  to: string;
  label?: string;
}

interface PaletteItem {
  type: JourneyNode['type'];
  label: string;
}

interface SimToken {
  connectionIndex: number;
  progress: number;
  nodeId: string | null;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const NODE_WIDTH = 160;
const NODE_HEIGHT = 56;

const TYPE_COLORS: Record<JourneyNode['type'], { bg: string; border: string; text: string; badge: string }> = {
  trigger:     { bg: '#1e3a5f', border: '#3b82f6', text: '#93c5fd', badge: 'Trigger' },
  condition:   { bg: '#4a3f1f', border: '#eab308', text: '#fde68a', badge: 'Condition' },
  action:      { bg: '#1a3a2a', border: '#22c55e', text: '#86efac', badge: 'Action' },
  destination: { bg: '#2d1f4e', border: '#a855f7', text: '#d8b4fe', badge: 'Destination' },
};

const PALETTE_ITEMS: PaletteItem[] = [
  { type: 'trigger', label: 'User Signs Up' },
  { type: 'trigger', label: 'Cart Abandoned' },
  { type: 'trigger', label: 'Page Visited' },
  { type: 'trigger', label: 'Purchase Made' },
  { type: 'condition', label: 'If/Else Split' },
  { type: 'condition', label: 'Wait X Days' },
  { type: 'condition', label: 'Check Attribute' },
  { type: 'action', label: 'Send Email' },
  { type: 'action', label: 'Push Notification' },
  { type: 'action', label: 'Add to Segment' },
  { type: 'action', label: 'Update Profile' },
  { type: 'destination', label: 'Facebook Ads' },
  { type: 'destination', label: 'Google Ads' },
  { type: 'destination', label: 'Salesforce' },
  { type: 'destination', label: 'Slack Alert' },
];

const NODE_CONFIGS: Record<string, { fields: { label: string; type: string; options?: string[] }[] }> = {
  'User Signs Up':     { fields: [{ label: 'Source', type: 'select', options: ['Website', 'Mobile App', 'API'] }] },
  'Cart Abandoned':    { fields: [{ label: 'Cart Min Value', type: 'text' }, { label: 'Timeout (min)', type: 'text' }] },
  'Page Visited':      { fields: [{ label: 'URL Pattern', type: 'text' }] },
  'Purchase Made':     { fields: [{ label: 'Min Amount', type: 'text' }, { label: 'Category', type: 'select', options: ['Any', 'Electronics', 'Fashion', 'Home'] }] },
  'If/Else Split':     { fields: [{ label: 'Condition', type: 'select', options: ['Email Opened', 'Clicked Link', 'Purchased', 'Attribute Match'] }] },
  'Wait X Days':       { fields: [{ label: 'Duration', type: 'text' }, { label: 'Unit', type: 'select', options: ['Minutes', 'Hours', 'Days'] }] },
  'Check Attribute':   { fields: [{ label: 'Attribute', type: 'text' }, { label: 'Operator', type: 'select', options: ['equals', 'contains', 'greater than', 'less than'] }, { label: 'Value', type: 'text' }] },
  'Send Email':        { fields: [{ label: 'Template', type: 'select', options: ['Welcome', 'Offer', 'Reminder', 'Recovery', 'Custom'] }, { label: 'Subject Line', type: 'text' }] },
  'Push Notification': { fields: [{ label: 'Title', type: 'text' }, { label: 'Body', type: 'text' }] },
  'Add to Segment':    { fields: [{ label: 'Segment Name', type: 'text' }] },
  'Update Profile':    { fields: [{ label: 'Field', type: 'text' }, { label: 'Value', type: 'text' }] },
  'Facebook Ads':      { fields: [{ label: 'Audience', type: 'text' }, { label: 'Action', type: 'select', options: ['Add to Audience', 'Remove from Audience'] }] },
  'Google Ads':        { fields: [{ label: 'Customer List', type: 'text' }] },
  'Salesforce':        { fields: [{ label: 'Object', type: 'select', options: ['Contact', 'Lead', 'Account'] }, { label: 'Action', type: 'select', options: ['Create', 'Update'] }] },
  'Slack Alert':       { fields: [{ label: 'Channel', type: 'text' }, { label: 'Message', type: 'text' }] },
};

// ─── Templates ───────────────────────────────────────────────────────────────

const TEMPLATES: Record<string, { nodes: JourneyNode[]; connections: Connection[] }> = {
  'Welcome Series': {
    nodes: [
      { id: 'ws-1', type: 'trigger',    label: 'User Signs Up',     x: 80,  y: 200 },
      { id: 'ws-2', type: 'condition',   label: 'Wait X Days',       x: 300, y: 200 },
      { id: 'ws-3', type: 'action',      label: 'Send Email',        x: 520, y: 200 },
      { id: 'ws-4', type: 'condition',   label: 'Wait X Days',       x: 740, y: 200 },
      { id: 'ws-5', type: 'condition',   label: 'If/Else Split',     x: 960, y: 200 },
      { id: 'ws-6', type: 'action',      label: 'Send Email',        x: 1100, y: 80 },
      { id: 'ws-7', type: 'action',      label: 'Send Email',        x: 1100, y: 320 },
    ],
    connections: [
      { from: 'ws-1', to: 'ws-2' },
      { from: 'ws-2', to: 'ws-3', label: '1 day' },
      { from: 'ws-3', to: 'ws-4', label: 'Welcome' },
      { from: 'ws-4', to: 'ws-5', label: '3 days' },
      { from: 'ws-5', to: 'ws-6', label: 'Opened' },
      { from: 'ws-5', to: 'ws-7', label: 'Not Opened' },
    ],
  },
  'Cart Recovery': {
    nodes: [
      { id: 'cr-1', type: 'trigger',    label: 'Cart Abandoned',     x: 80,  y: 200 },
      { id: 'cr-2', type: 'condition',   label: 'Wait X Days',       x: 300, y: 200 },
      { id: 'cr-3', type: 'action',      label: 'Send Email',        x: 520, y: 200 },
      { id: 'cr-4', type: 'condition',   label: 'Wait X Days',       x: 740, y: 200 },
      { id: 'cr-5', type: 'condition',   label: 'If/Else Split',     x: 960, y: 200 },
      { id: 'cr-6', type: 'action',      label: 'Add to Segment',    x: 1100, y: 80 },
      { id: 'cr-7', type: 'action',      label: 'Push Notification', x: 1100, y: 320 },
    ],
    connections: [
      { from: 'cr-1', to: 'cr-2' },
      { from: 'cr-2', to: 'cr-3', label: '1 hour' },
      { from: 'cr-3', to: 'cr-4', label: 'Recovery' },
      { from: 'cr-4', to: 'cr-5', label: '1 day' },
      { from: 'cr-5', to: 'cr-6', label: 'Purchased' },
      { from: 'cr-5', to: 'cr-7', label: 'Not Purchased' },
    ],
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

let _idCounter = 100;
function makeId() {
  _idCounter += 1;
  return `node-${_idCounter}-${Date.now()}`;
}

function getNodeCenter(n: JourneyNode) {
  return { x: n.x + NODE_WIDTH / 2, y: n.y + NODE_HEIGHT / 2 };
}

function bezierPath(x1: number, y1: number, x2: number, y2: number) {
  const dx = x2 - x1;
  const cx = Math.min(Math.abs(dx) * 0.5, 120);
  return `M ${x1} ${y1} C ${x1 + cx} ${y1}, ${x2 - cx} ${y2}, ${x2} ${y2}`;
}

function pointOnBezier(x1: number, y1: number, x2: number, y2: number, t: number) {
  const dx = x2 - x1;
  const cx = Math.min(Math.abs(dx) * 0.5, 120);
  const cp1x = x1 + cx;
  const cp1y = y1;
  const cp2x = x2 - cx;
  const cp2y = y2;
  const u = 1 - t;
  return {
    x: u * u * u * x1 + 3 * u * u * t * cp1x + 3 * u * t * t * cp2x + t * t * t * x2,
    y: u * u * u * y1 + 3 * u * u * t * cp1y + 3 * u * t * t * cp2y + t * t * t * y2,
  };
}

function getTypeIcon(type: JourneyNode['type']) {
  switch (type) {
    case 'trigger': return '\u26A1';
    case 'condition': return '\u2B29';
    case 'action': return '\u25B6';
    case 'destination': return '\u2691';
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function JourneyBuilderDemo() {
  const [nodes, setNodes] = useState<JourneyNode[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [simulating, setSimulating] = useState(false);
  const [simToken, setSimToken] = useState<SimToken | null>(null);
  const [simLog, setSimLog] = useState<string[]>([]);
  const [paletteFilter, setPaletteFilter] = useState<string>('all');

  const canvasRef = useRef<HTMLDivElement>(null);
  const draggingNodeRef = useRef<string | null>(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const panningRef = useRef(false);
  const panStartRef = useRef({ x: 0, y: 0 });
  const panOffsetStartRef = useRef({ x: 0, y: 0 });
  const simTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Palette drag state ──
  const paletteDragRef = useRef<PaletteItem | null>(null);
  const paletteDragGhostRef = useRef<HTMLDivElement | null>(null);
  const [paletteDragging, setPaletteDragging] = useState(false);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) ?? null;

  // ── Palette drag handlers ──
  const handlePaletteDragStart = useCallback(
    (e: React.MouseEvent, item: PaletteItem) => {
      e.preventDefault();
      paletteDragRef.current = item;
      setPaletteDragging(true);

      // Create ghost element
      const ghost = document.createElement('div');
      ghost.style.position = 'fixed';
      ghost.style.pointerEvents = 'none';
      ghost.style.zIndex = '9999';
      ghost.style.padding = '8px 16px';
      ghost.style.borderRadius = '8px';
      ghost.style.fontSize = '13px';
      ghost.style.fontWeight = '600';
      ghost.style.color = TYPE_COLORS[item.type].text;
      ghost.style.background = TYPE_COLORS[item.type].bg;
      ghost.style.border = `2px solid ${TYPE_COLORS[item.type].border}`;
      ghost.style.opacity = '0.9';
      ghost.style.transform = 'translate(-50%, -50%)';
      ghost.style.left = `${e.clientX}px`;
      ghost.style.top = `${e.clientY}px`;
      ghost.textContent = `${getTypeIcon(item.type)} ${item.label}`;
      document.body.appendChild(ghost);
      paletteDragGhostRef.current = ghost;

      const handleMove = (ev: MouseEvent) => {
        if (paletteDragGhostRef.current) {
          paletteDragGhostRef.current.style.left = `${ev.clientX}px`;
          paletteDragGhostRef.current.style.top = `${ev.clientY}px`;
        }
      };

      const handleUp = (ev: MouseEvent) => {
        window.removeEventListener('mousemove', handleMove);
        window.removeEventListener('mouseup', handleUp);
        if (paletteDragGhostRef.current) {
          document.body.removeChild(paletteDragGhostRef.current);
          paletteDragGhostRef.current = null;
        }
        setPaletteDragging(false);

        // Check if dropped on canvas
        if (canvasRef.current && paletteDragRef.current) {
          const rect = canvasRef.current.getBoundingClientRect();
          if (
            ev.clientX >= rect.left &&
            ev.clientX <= rect.right &&
            ev.clientY >= rect.top &&
            ev.clientY <= rect.bottom
          ) {
            const x = (ev.clientX - rect.left - canvasOffset.x) / zoom - NODE_WIDTH / 2;
            const y = (ev.clientY - rect.top - canvasOffset.y) / zoom - NODE_HEIGHT / 2;
            const newNode: JourneyNode = {
              id: makeId(),
              type: paletteDragRef.current.type,
              label: paletteDragRef.current.label,
              x: Math.max(0, x),
              y: Math.max(0, y),
            };
            setNodes((prev) => [...prev, newNode]);
          }
        }
        paletteDragRef.current = null;
      };

      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleUp);
    },
    [zoom, canvasOffset],
  );

  // ── Canvas node drag ──
  const handleNodeMouseDown = useCallback(
    (e: React.MouseEvent, nodeId: string) => {
      e.stopPropagation();
      if (e.button !== 0) return;

      // If we're in connect mode, handle connection
      if (connectingFrom) {
        if (connectingFrom !== nodeId) {
          const exists = connections.some(
            (c) => (c.from === connectingFrom && c.to === nodeId),
          );
          if (!exists) {
            setConnections((prev) => [...prev, { from: connectingFrom, to: nodeId }]);
          }
        }
        setConnectingFrom(null);
        return;
      }

      const node = nodes.find((n) => n.id === nodeId);
      if (!node) return;

      draggingNodeRef.current = nodeId;
      dragOffsetRef.current = {
        x: e.clientX / zoom - node.x,
        y: e.clientY / zoom - node.y,
      };
      setSelectedNodeId(nodeId);
    },
    [connectingFrom, connections, nodes, zoom],
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (draggingNodeRef.current) {
        const nid = draggingNodeRef.current;
        const newX = e.clientX / zoom - dragOffsetRef.current.x;
        const newY = e.clientY / zoom - dragOffsetRef.current.y;
        setNodes((prev) =>
          prev.map((n) => (n.id === nid ? { ...n, x: Math.max(0, newX), y: Math.max(0, newY) } : n)),
        );
      }
      if (panningRef.current) {
        setCanvasOffset({
          x: panOffsetStartRef.current.x + (e.clientX - panStartRef.current.x),
          y: panOffsetStartRef.current.y + (e.clientY - panStartRef.current.y),
        });
      }
    };
    const handleMouseUp = () => {
      draggingNodeRef.current = null;
      panningRef.current = false;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [zoom]);

  // ── Canvas pan ──
  const handleCanvasMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Click on empty canvas: deselect & start panning
      if (e.target === canvasRef.current || (e.target as HTMLElement).tagName === 'svg') {
        if (connectingFrom) {
          setConnectingFrom(null);
          return;
        }
        setSelectedNodeId(null);
        panningRef.current = true;
        panStartRef.current = { x: e.clientX, y: e.clientY };
        panOffsetStartRef.current = { ...canvasOffset };
      }
    },
    [canvasOffset, connectingFrom],
  );

  // ── Zoom ──
  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.15, 2));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.15, 0.3));
  const handleFitView = useCallback(() => {
    if (nodes.length === 0) { setZoom(1); setCanvasOffset({ x: 0, y: 0 }); return; }
    const minX = Math.min(...nodes.map((n) => n.x));
    const minY = Math.min(...nodes.map((n) => n.y));
    const maxX = Math.max(...nodes.map((n) => n.x + NODE_WIDTH));
    const maxY = Math.max(...nodes.map((n) => n.y + NODE_HEIGHT));
    const contentW = maxX - minX + 80;
    const contentH = maxY - minY + 80;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const scaleX = rect.width / contentW;
    const scaleY = rect.height / contentH;
    const newZoom = Math.min(Math.max(Math.min(scaleX, scaleY), 0.3), 1.5);
    setZoom(newZoom);
    setCanvasOffset({
      x: -minX * newZoom + (rect.width - contentW * newZoom) / 2 + 40 * newZoom,
      y: -minY * newZoom + (rect.height - contentH * newZoom) / 2 + 40 * newZoom,
    });
  }, [nodes]);

  // ── Delete node ──
  const deleteNode = useCallback(
    (nodeId: string) => {
      setNodes((prev) => prev.filter((n) => n.id !== nodeId));
      setConnections((prev) => prev.filter((c) => c.from !== nodeId && c.to !== nodeId));
      if (selectedNodeId === nodeId) setSelectedNodeId(null);
      if (connectingFrom === nodeId) setConnectingFrom(null);
    },
    [selectedNodeId, connectingFrom],
  );

  // ── Load template ──
  const loadTemplate = useCallback(
    (name: string) => {
      const t = TEMPLATES[name];
      if (!t) return;
      setNodes(t.nodes.map((n) => ({ ...n })));
      setConnections(t.connections.map((c) => ({ ...c })));
      setSelectedNodeId(null);
      setConnectingFrom(null);
      setSimulating(false);
      setSimToken(null);
      setSimLog([]);
      setTimeout(() => handleFitView(), 50);
    },
    [handleFitView],
  );

  // ── Clear canvas ──
  const clearCanvas = () => {
    setNodes([]);
    setConnections([]);
    setSelectedNodeId(null);
    setConnectingFrom(null);
    setSimulating(false);
    setSimToken(null);
    setSimLog([]);
  };

  // ── Simulation ──
  const buildPath = useCallback((): string[] => {
    // Find root nodes (no incoming connections)
    const incoming = new Set(connections.map((c) => c.to));
    const roots = nodes.filter((n) => !incoming.has(n.id));
    if (roots.length === 0 && nodes.length > 0) return [nodes[0].id];
    if (roots.length === 0) return [];

    // BFS from first root
    const visited = new Set<string>();
    const path: string[] = [];
    const queue = [roots[0].id];
    while (queue.length > 0) {
      const current = queue.shift()!;
      if (visited.has(current)) continue;
      visited.add(current);
      path.push(current);
      const outgoing = connections.filter((c) => c.from === current);
      for (const conn of outgoing) {
        if (!visited.has(conn.to)) queue.push(conn.to);
      }
    }
    return path;
  }, [nodes, connections]);

  const startSimulation = useCallback(() => {
    const path = buildPath();
    if (path.length < 2) return;

    setSimulating(true);
    setSimLog([]);
    setSimToken(null);

    // Build ordered connections along the path
    const orderedConns: Connection[] = [];
    for (let i = 0; i < path.length - 1; i++) {
      const conn = connections.find((c) => c.from === path[i] && c.to === path[i + 1]);
      if (conn) orderedConns.push(conn);
    }

    let connIdx = 0;
    let progress = 0;
    const step = 0.04;

    // Log entry node
    const entryNode = nodes.find((n) => n.id === path[0]);
    if (entryNode) {
      setSimLog((prev) => [...prev, `\u25CF Entering: ${entryNode.label}`]);
    }

    const tick = () => {
      progress += step;
      if (progress >= 1) {
        // Arrived at next node
        const arrivedId = orderedConns[connIdx]?.to;
        const arrivedNode = nodes.find((n) => n.id === arrivedId);
        if (arrivedNode) {
          setSimLog((prev) => [...prev, `\u25CF ${arrivedNode.label} ${orderedConns[connIdx]?.label ? `(${orderedConns[connIdx].label})` : ''}`]);
        }

        connIdx += 1;
        progress = 0;

        if (connIdx >= orderedConns.length) {
          setSimToken(null);
          setSimulating(false);
          setSimLog((prev) => [...prev, '\u2713 Journey complete!']);
          return;
        }
      }

      setSimToken({ connectionIndex: connIdx, progress, nodeId: orderedConns[connIdx]?.from ?? null });
      simTimerRef.current = setTimeout(tick, 60);
    };

    simTimerRef.current = setTimeout(tick, 300);
  }, [buildPath, connections, nodes]);

  useEffect(() => {
    return () => {
      if (simTimerRef.current) clearTimeout(simTimerRef.current);
    };
  }, []);

  // ── Connection delete ──
  const deleteConnection = useCallback((from: string, to: string) => {
    setConnections((prev) => prev.filter((c) => !(c.from === from && c.to === to)));
  }, []);

  // ── Render ──

  const filteredPalette = paletteFilter === 'all' ? PALETTE_ITEMS : PALETTE_ITEMS.filter((p) => p.type === paletteFilter);

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '700px', background: '#0f1117', borderRadius: 12, overflow: 'hidden', border: '1px solid #23262f', fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {/* ── Top toolbar ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: '#181a20', borderBottom: '1px solid #23262f', flexWrap: 'wrap' }}>
        <span style={{ color: '#a78bfa', fontWeight: 700, fontSize: 15, marginRight: 8 }}>{getTypeIcon('trigger')} Journey Builder</span>
        <div style={{ height: 20, width: 1, background: '#23262f' }} />

        {/* Templates */}
        <button onClick={() => loadTemplate('Welcome Series')} style={toolbarBtn}>Welcome Series</button>
        <button onClick={() => loadTemplate('Cart Recovery')} style={toolbarBtn}>Cart Recovery</button>
        <div style={{ height: 20, width: 1, background: '#23262f' }} />
        <button onClick={clearCanvas} style={{ ...toolbarBtn, color: '#f87171' }}>Clear</button>
        <div style={{ height: 20, width: 1, background: '#23262f' }} />

        {/* Zoom */}
        <button onClick={handleZoomOut} style={toolbarBtn} title="Zoom out">&minus;</button>
        <span style={{ color: '#9ca3af', fontSize: 12, minWidth: 40, textAlign: 'center' }}>{Math.round(zoom * 100)}%</span>
        <button onClick={handleZoomIn} style={toolbarBtn} title="Zoom in">+</button>
        <button onClick={handleFitView} style={toolbarBtn} title="Fit to view">Fit</button>
        <div style={{ height: 20, width: 1, background: '#23262f' }} />

        {/* Simulate */}
        <button
          onClick={simulating ? () => { setSimulating(false); setSimToken(null); if (simTimerRef.current) clearTimeout(simTimerRef.current); } : startSimulation}
          disabled={connections.length === 0}
          style={{
            ...toolbarBtn,
            color: simulating ? '#f87171' : '#34d399',
            borderColor: simulating ? '#7f1d1d' : '#065f46',
            opacity: connections.length === 0 ? 0.4 : 1,
          }}
        >
          {simulating ? '\u25A0 Stop' : '\u25B6 Simulate'}
        </button>

        <div style={{ flex: 1 }} />
        <span style={{ color: '#6b7280', fontSize: 12 }}>
          {nodes.length} step{nodes.length !== 1 ? 's' : ''} &middot; {connections.length} connection{connections.length !== 1 ? 's' : ''}
        </span>
        {connectingFrom && (
          <span style={{ color: '#fbbf24', fontSize: 12, marginLeft: 8 }}>
            Click a node to connect &middot; <button onClick={() => setConnectingFrom(null)} style={{ color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12 }}>Cancel</button>
          </span>
        )}
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* ── Left palette ── */}
        <div style={{ width: 200, background: '#14161c', borderRight: '1px solid #23262f', overflowY: 'auto', flexShrink: 0 }}>
          <div style={{ padding: '10px 12px 6px', borderBottom: '1px solid #23262f' }}>
            <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Node Palette</div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {(['all', 'trigger', 'condition', 'action', 'destination'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setPaletteFilter(f)}
                  style={{
                    padding: '2px 8px',
                    fontSize: 10,
                    borderRadius: 4,
                    border: 'none',
                    cursor: 'pointer',
                    background: paletteFilter === f ? '#3b82f6' : '#23262f',
                    color: paletteFilter === f ? '#fff' : '#9ca3af',
                  }}
                >
                  {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {filteredPalette.map((item) => {
              const c = TYPE_COLORS[item.type];
              return (
                <div
                  key={item.label}
                  onMouseDown={(e) => handlePaletteDragStart(e, item)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 10px',
                    borderRadius: 8,
                    background: c.bg,
                    border: `1px solid ${c.border}44`,
                    cursor: 'grab',
                    userSelect: 'none',
                    transition: 'border-color 0.15s',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = c.border; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = `${c.border}44`; }}
                >
                  <span style={{ fontSize: 14 }}>{getTypeIcon(item.type)}</span>
                  <span style={{ fontSize: 12, color: c.text, fontWeight: 500 }}>{item.label}</span>
                </div>
              );
            })}
          </div>
          <div style={{ padding: '8px 12px', fontSize: 10, color: '#4b5563', lineHeight: 1.5 }}>
            Drag nodes onto the canvas. Click a node and choose &quot;Connect&quot; then click another node to link them.
          </div>
        </div>

        {/* ── Canvas ── */}
        <div
          ref={canvasRef}
          onMouseDown={handleCanvasMouseDown}
          style={{
            flex: 1,
            position: 'relative',
            overflow: 'hidden',
            cursor: panningRef.current ? 'grabbing' : (connectingFrom ? 'crosshair' : 'default'),
            background: `
              radial-gradient(circle at 50% 50%, #1a1c2400 0%, #0f1117 100%),
              repeating-linear-gradient(0deg, transparent, transparent 29px, #1a1c24 29px, #1a1c24 30px),
              repeating-linear-gradient(90deg, transparent, transparent 29px, #1a1c24 29px, #1a1c24 30px)
            `,
          }}
        >
          {/* Drop hint */}
          {paletteDragging && (
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: '#3b82f608', border: '2px dashed #3b82f644', borderRadius: 8, zIndex: 0, pointerEvents: 'none',
            }}>
              <span style={{ color: '#3b82f6', fontSize: 14, opacity: 0.7 }}>Drop node here</span>
            </div>
          )}

          {/* SVG connections layer */}
          <svg
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${zoom})`,
              transformOrigin: '0 0',
            }}
          >
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto" markerUnits="strokeWidth">
                <polygon points="0 0, 10 3.5, 0 7" fill="#4b5563" />
              </marker>
              <marker id="arrowhead-active" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto" markerUnits="strokeWidth">
                <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
              </marker>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {connections.map((conn, i) => {
              const fromNode = nodeMap.get(conn.from);
              const toNode = nodeMap.get(conn.to);
              if (!fromNode || !toNode) return null;
              const a = getNodeCenter(fromNode);
              const b = getNodeCenter(toNode);
              const path = bezierPath(a.x, a.y, b.x, b.y);
              const isSimActive = simToken && simToken.connectionIndex === i && simulating;

              return (
                <g key={`${conn.from}-${conn.to}`}>
                  {/* Clickable wider invisible path for deletion */}
                  <path
                    d={path}
                    fill="none"
                    stroke="transparent"
                    strokeWidth={14}
                    style={{ pointerEvents: 'stroke', cursor: 'pointer' }}
                    onClick={() => deleteConnection(conn.from, conn.to)}
                  />
                  <path
                    d={path}
                    fill="none"
                    stroke={isSimActive ? '#3b82f6' : '#4b556366'}
                    strokeWidth={isSimActive ? 2.5 : 1.5}
                    strokeDasharray={isSimActive ? '6 3' : 'none'}
                    markerEnd={isSimActive ? 'url(#arrowhead-active)' : 'url(#arrowhead)'}
                  />
                  {/* Connection label */}
                  {conn.label && (
                    <text
                      x={(a.x + b.x) / 2}
                      y={(a.y + b.y) / 2 - 10}
                      textAnchor="middle"
                      fill="#6b7280"
                      fontSize={11}
                      fontFamily="Inter, sans-serif"
                    >
                      {conn.label}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Simulation token */}
            {simToken && simulating && (() => {
              const conn = connections.filter((c) => {
                // Rebuild the path to find the right connection
                const incoming = new Set(connections.map((cc) => cc.to));
                const roots = nodes.filter((n) => !incoming.has(n.id));
                return roots.length > 0;
              })[simToken.connectionIndex];

              // Actually get connection by building path
              const incomingSet = new Set(connections.map((c) => c.to));
              const roots = nodes.filter((n) => !incomingSet.has(n.id));
              if (roots.length === 0) return null;

              const visited = new Set<string>();
              const path: string[] = [];
              const queue = [roots[0].id];
              while (queue.length > 0) {
                const current = queue.shift()!;
                if (visited.has(current)) continue;
                visited.add(current);
                path.push(current);
                const outgoing = connections.filter((c) => c.from === current);
                for (const oc of outgoing) {
                  if (!visited.has(oc.to)) queue.push(oc.to);
                }
              }

              const orderedConns: Connection[] = [];
              for (let i = 0; i < path.length - 1; i++) {
                const c = connections.find((cc) => cc.from === path[i] && cc.to === path[i + 1]);
                if (c) orderedConns.push(c);
              }

              const activeConn = orderedConns[simToken.connectionIndex];
              if (!activeConn) return null;

              const fromN = nodeMap.get(activeConn.from);
              const toN = nodeMap.get(activeConn.to);
              if (!fromN || !toN) return null;

              const a = getNodeCenter(fromN);
              const b = getNodeCenter(toN);
              const pt = pointOnBezier(a.x, a.y, b.x, b.y, simToken.progress);

              return (
                <circle cx={pt.x} cy={pt.y} r={6} fill="#3b82f6" filter="url(#glow)" opacity={0.95}>
                  <animate attributeName="r" values="5;8;5" dur="0.6s" repeatCount="indefinite" />
                </circle>
              );
            })()}
          </svg>

          {/* Nodes layer */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${zoom})`,
              transformOrigin: '0 0',
            }}
          >
            {nodes.map((node) => {
              const c = TYPE_COLORS[node.type];
              const isSelected = selectedNodeId === node.id;
              const isConnectSource = connectingFrom === node.id;
              return (
                <div
                  key={node.id}
                  onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                  style={{
                    position: 'absolute',
                    left: node.x,
                    top: node.y,
                    width: NODE_WIDTH,
                    height: NODE_HEIGHT,
                    background: c.bg,
                    border: `2px solid ${isSelected || isConnectSource ? c.border : `${c.border}66`}`,
                    borderRadius: 10,
                    cursor: connectingFrom ? 'crosshair' : 'grab',
                    userSelect: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '0 12px',
                    boxShadow: isSelected ? `0 0 16px ${c.border}44` : 'none',
                    transition: 'box-shadow 0.15s, border-color 0.15s',
                  }}
                >
                  {/* Delete button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteNode(node.id); }}
                    style={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      background: '#1e1e2e',
                      border: '1px solid #374151',
                      color: '#9ca3af',
                      fontSize: 11,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      lineHeight: 1,
                      padding: 0,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.borderColor = '#f87171'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.borderColor = '#374151'; }}
                  >
                    \u00d7
                  </button>

                  {/* Type badge */}
                  <div style={{ fontSize: 9, color: `${c.text}99`, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 2 }}>
                    {getTypeIcon(node.type)} {c.badge}
                  </div>
                  <div style={{ fontSize: 12, color: c.text, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {node.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty state */}
          {nodes.length === 0 && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
              <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.3 }}>{getTypeIcon('trigger')}</div>
              <div style={{ color: '#4b5563', fontSize: 14, marginBottom: 4 }}>Drag nodes from the palette to start building</div>
              <div style={{ color: '#374151', fontSize: 12 }}>or load a template from the toolbar</div>
            </div>
          )}
        </div>

        {/* ── Right panel ── */}
        <div style={{ width: 260, background: '#14161c', borderLeft: '1px solid #23262f', overflowY: 'auto', flexShrink: 0 }}>
          {selectedNode ? (
            <div style={{ padding: 16 }}>
              {/* Node header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <span style={{ fontSize: 20 }}>{getTypeIcon(selectedNode.type)}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: TYPE_COLORS[selectedNode.type].text }}>{selectedNode.label}</div>
                  <div style={{ fontSize: 10, color: '#6b7280', textTransform: 'uppercase' }}>{TYPE_COLORS[selectedNode.type].badge}</div>
                </div>
              </div>

              {/* Connect button */}
              <button
                onClick={() => setConnectingFrom(connectingFrom === selectedNode.id ? null : selectedNode.id)}
                style={{
                  width: '100%',
                  padding: '8px 0',
                  marginBottom: 16,
                  borderRadius: 6,
                  border: `1px solid ${connectingFrom === selectedNode.id ? '#3b82f6' : '#374151'}`,
                  background: connectingFrom === selectedNode.id ? '#1e3a5f' : '#1e1e2e',
                  color: connectingFrom === selectedNode.id ? '#93c5fd' : '#9ca3af',
                  fontSize: 12,
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                {connectingFrom === selectedNode.id ? 'Click target node...' : '\u2192 Connect to another node'}
              </button>

              {/* Config fields */}
              <div style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>Configuration</div>
              {(NODE_CONFIGS[selectedNode.label]?.fields ?? []).map((field, fi) => (
                <div key={fi} style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', fontSize: 11, color: '#9ca3af', marginBottom: 4 }}>{field.label}</label>
                  {field.type === 'select' ? (
                    <select style={inputStyle}>
                      {field.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input type="text" placeholder={`Enter ${field.label.toLowerCase()}`} style={inputStyle} />
                  )}
                </div>
              ))}

              {/* Connections list */}
              <div style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 16, marginBottom: 8 }}>Connections</div>
              {(() => {
                const outgoing = connections.filter((c) => c.from === selectedNode.id);
                const incoming = connections.filter((c) => c.to === selectedNode.id);
                if (outgoing.length === 0 && incoming.length === 0) {
                  return <div style={{ fontSize: 12, color: '#4b5563' }}>No connections yet</div>;
                }
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {incoming.map((c) => {
                      const fromNode = nodeMap.get(c.from);
                      return (
                        <div key={`in-${c.from}`} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#9ca3af' }}>
                          <span style={{ color: '#6b7280' }}>\u2190</span>
                          <span>{fromNode?.label ?? c.from}</span>
                          <button onClick={() => deleteConnection(c.from, c.to)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: 11 }}>\u00d7</button>
                        </div>
                      );
                    })}
                    {outgoing.map((c) => {
                      const toNode = nodeMap.get(c.to);
                      return (
                        <div key={`out-${c.to}`} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#9ca3af' }}>
                          <span style={{ color: '#6b7280' }}>\u2192</span>
                          <span>{toNode?.label ?? c.to}</span>
                          <button onClick={() => deleteConnection(c.from, c.to)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: 11 }}>\u00d7</button>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}

              {/* Delete node */}
              <button
                onClick={() => deleteNode(selectedNode.id)}
                style={{
                  width: '100%',
                  padding: '8px 0',
                  marginTop: 20,
                  borderRadius: 6,
                  border: '1px solid #7f1d1d',
                  background: '#1e1e2e',
                  color: '#f87171',
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                Delete Node
              </button>
            </div>
          ) : simLog.length > 0 ? (
            <div style={{ padding: 16 }}>
              <div style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12 }}>Simulation Log</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {simLog.map((msg, i) => (
                  <div key={i} style={{ fontSize: 12, color: msg.startsWith('\u2713') ? '#34d399' : '#d1d5db', padding: '4px 8px', background: '#1e1e2e', borderRadius: 4 }}>
                    {msg}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <div style={{ color: '#4b5563', fontSize: 13, textAlign: 'center', lineHeight: 1.6 }}>
                Select a node to view its configuration and connections.
              </div>
              <div style={{ marginTop: 20, fontSize: 11, color: '#374151', lineHeight: 1.6, textAlign: 'left', width: '100%' }}>
                <div style={{ fontWeight: 600, color: '#6b7280', marginBottom: 8 }}>Quick Guide:</div>
                <div style={{ marginBottom: 4 }}>1. Drag nodes from palette</div>
                <div style={{ marginBottom: 4 }}>2. Select a node, click &quot;Connect&quot;</div>
                <div style={{ marginBottom: 4 }}>3. Click the target node</div>
                <div style={{ marginBottom: 4 }}>4. Press Simulate to test</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Shared styles ───────────────────────────────────────────────────────────

const toolbarBtn: React.CSSProperties = {
  padding: '4px 12px',
  fontSize: 12,
  borderRadius: 6,
  border: '1px solid #374151',
  background: '#1e1e2e',
  color: '#d1d5db',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '6px 10px',
  borderRadius: 6,
  border: '1px solid #374151',
  background: '#1e1e2e',
  color: '#d1d5db',
  fontSize: 12,
  outline: 'none',
  boxSizing: 'border-box',
};
