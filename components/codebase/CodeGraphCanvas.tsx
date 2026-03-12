'use client';

import {
  useRef,
  useEffect,
  useState,
  useCallback,
  type Dispatch,
  type SetStateAction,
} from 'react';
import type { CodeGraph, GraphNode, GraphEdge, NodeType, EdgeType, Transform } from '@/lib/utils/codebase/graph-types';

// ─── Types ──────────────────────────────────────────────────────────

interface Particle {
  edgeIdx: number;
  t: number;
  speed: number;
}

interface Props {
  graph: CodeGraph;
  selectedNode: string | null;
  onSelectNode: (id: string | null) => void;
  hoveredNode: string | null;
  onHoverNode: (id: string | null) => void;
  hiddenNodeTypes: Set<NodeType>;
  hiddenEdgeTypes: Set<EdgeType>;
  searchHighlight: string | null;
  transform: Transform;
  setTransform: Dispatch<SetStateAction<Transform>>;
}

// ─── Constants ──────────────────────────────────────────────────────

const MIN_SCALE = 0.15;
const MAX_SCALE = 4;
const PARTICLE_COUNT = 40;

// Force simulation constants
const REPULSION = 5000;
const SPRING_STRENGTH = 0.003;
const CENTERING = 0.0005;
const DAMPING = 0.92;
const REST_LENGTHS: Record<string, number> = {
  'contains': 100,
  'has-module': 45,
  'depends-on': 120,
  'inter-repo': 180,
  'calls': 60,
  'imports': 80,
};

// Edge colors
const EDGE_COLORS: Record<string, string> = {
  'contains': 'rgba(148, 163, 184, 0.25)',
  'has-module': 'rgba(148, 163, 184, 0.12)',
  'depends-on': 'rgba(96, 165, 250, 0.35)',
  'inter-repo': 'rgba(251, 191, 36, 0.45)',
  'calls': 'rgba(236, 72, 153, 0.3)',
  'imports': 'rgba(139, 92, 246, 0.3)',
};

const EDGE_HIGHLIGHT_COLORS: Record<string, string> = {
  'contains': 'rgba(148, 163, 184, 0.6)',
  'has-module': 'rgba(148, 163, 184, 0.4)',
  'depends-on': 'rgba(96, 165, 250, 0.7)',
  'inter-repo': 'rgba(251, 191, 36, 0.8)',
  'calls': 'rgba(236, 72, 153, 0.7)',
  'imports': 'rgba(139, 92, 246, 0.7)',
};

// ─── Helpers ────────────────────────────────────────────────────────

function edgeControlPoint(ax: number, ay: number, bx: number, by: number): [number, number] {
  const mx = (ax + bx) / 2;
  const my = (ay + by) / 2;
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const off = len * 0.12;
  return [mx + (dy / len) * off, my - (dx / len) * off];
}

function bezierPoint(
  ax: number, ay: number, cx: number, cy: number, bx: number, by: number, t: number
): [number, number] {
  const u = 1 - t;
  return [u * u * ax + 2 * u * t * cx + t * t * bx, u * u * ay + 2 * u * t * cy + t * t * by];
}

// ─── Component ──────────────────────────────────────────────────────

export default function CodeGraphCanvas({
  graph,
  selectedNode,
  onSelectNode,
  hoveredNode,
  onHoverNode,
  hiddenNodeTypes,
  hiddenEdgeTypes,
  searchHighlight,
  transform,
  setTransform,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  // Interaction state
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const lastPinchDist = useRef(0);
  const draggedNode = useRef<GraphNode | null>(null);

  // Animation
  const particles = useRef<Particle[]>([]);
  const time = useRef(0);
  const simTick = useRef(0);
  const isSimulating = useRef(true);

  // Node map for fast lookup
  const nodeMapRef = useRef<Map<string, GraphNode>>(new Map());

  // Build node map
  useEffect(() => {
    const map = new Map<string, GraphNode>();
    graph.nodes.forEach((n) => map.set(n.id, n));
    nodeMapRef.current = map;
  }, [graph]);

  // Initialize particles on inter-repo edges
  useEffect(() => {
    const interEdges = graph.edges
      .map((e, i) => ({ ...e, idx: i }))
      .filter((e) => e.type === 'inter-repo');
    const ps: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      if (interEdges.length === 0) break;
      const edge = interEdges[i % interEdges.length];
      ps.push({ edgeIdx: edge.idx, t: Math.random(), speed: 0.003 + Math.random() * 0.004 });
    }
    particles.current = ps;
    simTick.current = 0;
    isSimulating.current = true;
  }, [graph]);

  // ── Screen ↔ World ────────────────────────────────────────────────
  const screenToWorld = useCallback(
    (sx: number, sy: number): [number, number] => {
      return [(sx - transform.x) / transform.scale, (sy - transform.y) / transform.scale];
    },
    [transform]
  );

  // ── Hit test ──────────────────────────────────────────────────────
  const hitTest = useCallback(
    (sx: number, sy: number): GraphNode | null => {
      const [wx, wy] = screenToWorld(sx, sy);
      for (let i = graph.nodes.length - 1; i >= 0; i--) {
        const n = graph.nodes[i];
        if (hiddenNodeTypes.has(n.type)) continue;
        const dx = wx - n.x;
        const dy = wy - n.y;
        const hitR = n.radius + 8;
        if (dx * dx + dy * dy < hitR * hitR) return n;
      }
      return null;
    },
    [screenToWorld, hiddenNodeTypes, graph.nodes]
  );

  // ── Mouse handlers ────────────────────────────────────────────────
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;
      const hit = hitTest(sx, sy);

      if (hit) {
        draggedNode.current = hit;
        hit.fx = hit.x;
        hit.fy = hit.y;
        isSimulating.current = true;
      }

      isDragging.current = true;
      dragStart.current = { x: e.clientX - transform.x, y: e.clientY - transform.y };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [transform, hitTest]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;

      if (isDragging.current && draggedNode.current) {
        const [wx, wy] = screenToWorld(sx, sy);
        draggedNode.current.fx = wx;
        draggedNode.current.fy = wy;
        draggedNode.current.x = wx;
        draggedNode.current.y = wy;
        return;
      }

      if (isDragging.current) {
        setTransform((prev) => ({
          ...prev,
          x: e.clientX - dragStart.current.x,
          y: e.clientY - dragStart.current.y,
        }));
        return;
      }

      const hit = hitTest(sx, sy);
      if (hit) {
        onHoverNode(hit.id);
        canvas.style.cursor = 'pointer';
      } else {
        onHoverNode(null);
        canvas.style.cursor = 'grab';
      }
    },
    [hitTest, onHoverNode, setTransform, screenToWorld]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (draggedNode.current) {
        draggedNode.current.fx = undefined;
        draggedNode.current.fy = undefined;
        draggedNode.current = null;
      }

      if (!isDragging.current) return;
      isDragging.current = false;

      const dx = e.clientX - (dragStart.current.x + transform.x);
      const dy = e.clientY - (dragStart.current.y + transform.y);
      if (Math.abs(dx) < 4 && Math.abs(dy) < 4) {
        const rect = canvasRef.current!.getBoundingClientRect();
        const hit = hitTest(e.clientX - rect.left, e.clientY - rect.top);
        onSelectNode(hit ? hit.id : null);
      }
    },
    [hitTest, onSelectNode, transform]
  );

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const rect = canvasRef.current!.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setTransform((prev) => {
        const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev.scale * delta));
        const ratio = newScale / prev.scale;
        return { scale: newScale, x: mx - (mx - prev.x) * ratio, y: my - (my - prev.y) * ratio };
      });
    },
    [setTransform]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (lastPinchDist.current > 0) {
          const delta = dist / lastPinchDist.current;
          const rect = canvasRef.current!.getBoundingClientRect();
          const mx = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left;
          const my = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top;
          setTransform((prev) => {
            const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev.scale * delta));
            const ratio = newScale / prev.scale;
            return { scale: newScale, x: mx - (mx - prev.x) * ratio, y: my - (my - prev.y) * ratio };
          });
        }
        lastPinchDist.current = dist;
      }
    },
    [setTransform]
  );

  const handleTouchEnd = useCallback(() => {
    lastPinchDist.current = 0;
  }, []);

  // ── Force simulation + Render loop ────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d')!;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    };
    resize();
    window.addEventListener('resize', resize);

    const nodeMap = nodeMapRef.current;

    const draw = () => {
      time.current += 1;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      // ── Force simulation tick ─────────────────────────────────────
      if (isSimulating.current) {
        simTick.current += 1;
        const nodes = graph.nodes;
        const edges = graph.edges;
        const isLargeGraph = nodes.length > 500;

        // Center of mass
        let cmx = 0, cmy = 0;
        nodes.forEach((n) => { cmx += n.x; cmy += n.y; });
        cmx /= nodes.length || 1;
        cmy /= nodes.length || 1;

        // Repulsion: grid-based spatial hash for large graphs, O(n²) for small
        if (isLargeGraph) {
          // Grid-based repulsion: only compute forces between nearby nodes
          const cellSize = 150;
          const grid = new Map<string, GraphNode[]>();
          nodes.forEach((n) => {
            const key = `${Math.floor(n.x / cellSize)},${Math.floor(n.y / cellSize)}`;
            if (!grid.has(key)) grid.set(key, []);
            grid.get(key)!.push(n);
          });
          // For each node, repel against nodes in same + adjacent cells
          nodes.forEach((a) => {
            const cx = Math.floor(a.x / cellSize);
            const cy = Math.floor(a.y / cellSize);
            for (let gx = cx - 1; gx <= cx + 1; gx++) {
              for (let gy = cy - 1; gy <= cy + 1; gy++) {
                const cell = grid.get(`${gx},${gy}`);
                if (!cell) continue;
                for (const b of cell) {
                  if (a === b) continue;
                  const dx = b.x - a.x;
                  const dy = b.y - a.y;
                  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                  if (dist > cellSize * 2) continue;
                  const force = REPULSION / (dist * dist);
                  if (a.fx === undefined) a.vx -= (dx / dist) * force;
                  if (a.fy === undefined) a.vy -= (dy / dist) * force;
                }
              }
            }
          });
        } else {
          // Small graph: exact O(n²) repulsion
          for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
              const a = nodes[i];
              const b = nodes[j];
              const dx = b.x - a.x;
              const dy = b.y - a.y;
              const dist = Math.sqrt(dx * dx + dy * dy) || 1;
              const minDist = a.radius + b.radius + 10;
              const effectiveDist = Math.max(dist, minDist);
              const force = REPULSION / (effectiveDist * effectiveDist);
              const fx = (dx / dist) * force;
              const fy = (dy / dist) * force;
              if (a.fx === undefined) a.vx -= fx;
              if (a.fy === undefined) a.vy -= fy;
              if (b.fx === undefined) b.vx += fx;
              if (b.fy === undefined) b.vy += fy;
            }
          }
        }

        // Edge springs
        const springStrength = isLargeGraph ? 0.005 : SPRING_STRENGTH;
        edges.forEach((e) => {
          const a = nodeMap.get(e.source);
          const b = nodeMap.get(e.target);
          if (!a || !b) return;
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const rest = REST_LENGTHS[e.type] || 80;
          const displacement = dist - rest;
          const force = springStrength * displacement;
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          if (a.fx === undefined) a.vx += fx;
          if (a.fy === undefined) a.vy += fy;
          if (b.fx === undefined) b.vx -= fx;
          if (b.fy === undefined) b.vy -= fy;
        });

        // Centering + velocity verlet + damping
        let totalKE = 0;
        const damp = isLargeGraph ? 0.85 : DAMPING;
        nodes.forEach((n) => {
          if (n.fx !== undefined) { n.x = n.fx; n.vx = 0; }
          else {
            n.vx -= (n.x - cmx) * CENTERING;
            n.vx *= damp;
            n.x += n.vx;
          }
          if (n.fy !== undefined) { n.y = n.fy; n.vy = 0; }
          else {
            n.vy -= (n.y - cmy) * CENTERING;
            n.vy *= damp;
            n.y += n.vy;
          }
          totalKE += n.vx * n.vx + n.vy * n.vy;
        });

        // Stop simulation when settled (earlier for large graphs)
        if (simTick.current > 300 && totalKE < 0.01) {
          isSimulating.current = false;
        }
      }

      // ── Render ────────────────────────────────────────────────────
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, w, h);

      // Subtle grid
      ctx.save();
      ctx.translate(transform.x, transform.y);
      ctx.scale(transform.scale, transform.scale);

      if (transform.scale > 0.3) {
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.03)';
        ctx.lineWidth = 1;
        const gridSize = 100;
        const startX = Math.floor(-transform.x / transform.scale / gridSize) * gridSize - gridSize;
        const startY = Math.floor(-transform.y / transform.scale / gridSize) * gridSize - gridSize;
        const endX = startX + (w / transform.scale) + gridSize * 2;
        const endY = startY + (h / transform.scale) + gridSize * 2;
        for (let x = startX; x < endX; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, startY);
          ctx.lineTo(x, endY);
          ctx.stroke();
        }
        for (let y = startY; y < endY; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(startX, y);
          ctx.lineTo(endX, y);
          ctx.stroke();
        }
      }

      // ── Edges ─────────────────────────────────────────────────────
      graph.edges.forEach((edge) => {
        if (hiddenEdgeTypes.has(edge.type)) return;
        const fromNode = nodeMap.get(edge.source);
        const toNode = nodeMap.get(edge.target);
        if (!fromNode || !toNode) return;
        if (hiddenNodeTypes.has(fromNode.type) || hiddenNodeTypes.has(toNode.type)) return;

        const isHighlighted =
          hoveredNode === edge.source || hoveredNode === edge.target ||
          selectedNode === edge.source || selectedNode === edge.target;

        const [cx, cy] = edgeControlPoint(fromNode.x, fromNode.y, toNode.x, toNode.y);

        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.quadraticCurveTo(cx, cy, toNode.x, toNode.y);
        ctx.strokeStyle = isHighlighted
          ? (EDGE_HIGHLIGHT_COLORS[edge.type] || 'rgba(148, 163, 184, 0.6)')
          : (EDGE_COLORS[edge.type] || 'rgba(148, 163, 184, 0.15)');
        ctx.lineWidth = isHighlighted ? 2.5 : (edge.type === 'has-module' || edge.type === 'calls' ? 0.5 : 1);

        if (edge.type === 'has-module' || edge.type === 'calls') {
          ctx.setLineDash([2, 4]);
        } else if (edge.type === 'depends-on' || edge.type === 'imports') {
          ctx.setLineDash([4, 3]);
        } else {
          ctx.setLineDash([]);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // ── Edge particles (inter-repo only) ──────────────────────────
      particles.current.forEach((p) => {
        const edge = graph.edges[p.edgeIdx];
        if (!edge || edge.type !== 'inter-repo') return;
        if (hiddenEdgeTypes.has('inter-repo')) return;
        const fromNode = nodeMap.get(edge.source);
        const toNode = nodeMap.get(edge.target);
        if (!fromNode || !toNode) return;
        if (hiddenNodeTypes.has(fromNode.type) || hiddenNodeTypes.has(toNode.type)) return;

        p.t += p.speed;
        if (p.t > 1) p.t = 0;

        const [cpx, cpy] = edgeControlPoint(fromNode.x, fromNode.y, toNode.x, toNode.y);
        const [px, py] = bezierPoint(fromNode.x, fromNode.y, cpx, cpy, toNode.x, toNode.y, p.t);

        const alpha = Math.sin(p.t * Math.PI) * 0.8;
        const grad = ctx.createRadialGradient(px, py, 0, px, py, 6);
        grad.addColorStop(0, `rgba(251, 191, 36, ${alpha})`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
        ctx.beginPath();
        ctx.arc(px, py, 1.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // ── Nodes ─────────────────────────────────────────────────────
      graph.nodes.forEach((n) => {
        if (hiddenNodeTypes.has(n.type)) return;

        const isHovered = hoveredNode === n.id;
        const isSelected = selectedNode === n.id;
        const isSearchMatch = searchHighlight &&
          n.label.toLowerCase().includes(searchHighlight.toLowerCase());
        const isDimmed = searchHighlight &&
          !n.label.toLowerCase().includes(searchHighlight.toLowerCase());

        const r = n.radius * (isHovered ? 1.2 : 1);
        ctx.globalAlpha = isDimmed ? 0.15 : 1;

        // Outer glow
        const pulse = Math.sin(time.current * 0.025 + n.x * 0.01) * 0.3 + 0.7;
        const glowR = r * 2.2 * (isHovered || isSelected ? 1.3 : 1);
        const glow = ctx.createRadialGradient(n.x, n.y, r * 0.3, n.x, n.y, glowR);
        glow.addColorStop(0, `${n.color}${Math.round(pulse * 40).toString(16).padStart(2, '0')}`);
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(n.x, n.y, glowR, 0, Math.PI * 2);
        ctx.fill();

        // Node body
        if (n.type === 'dependency') {
          // Diamond shape for dependencies
          ctx.beginPath();
          ctx.moveTo(n.x, n.y - r);
          ctx.lineTo(n.x + r, n.y);
          ctx.lineTo(n.x, n.y + r);
          ctx.lineTo(n.x - r, n.y);
          ctx.closePath();
          const bodyGrad = ctx.createRadialGradient(n.x - r * 0.2, n.y - r * 0.2, r * 0.1, n.x, n.y, r);
          bodyGrad.addColorStop(0, '#ffffff');
          bodyGrad.addColorStop(0.35, n.color);
          bodyGrad.addColorStop(1, `${n.color}50`);
          ctx.fillStyle = bodyGrad;
          ctx.fill();
        } else {
          // Circle for all other types
          const bodyGrad = ctx.createRadialGradient(n.x - r * 0.3, n.y - r * 0.3, r * 0.1, n.x, n.y, r);
          bodyGrad.addColorStop(0, '#ffffff');
          bodyGrad.addColorStop(0.35, n.color);
          bodyGrad.addColorStop(1, `${n.color}50`);
          ctx.fillStyle = bodyGrad;
          ctx.beginPath();
          ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
          ctx.fill();
        }

        // Domain ring
        if (n.type === 'domain') {
          ctx.strokeStyle = `${n.color}80`;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(n.x, n.y, r + 4, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Selection ring
        if (isSelected || isSearchMatch) {
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(n.x, n.y, r + 6, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Label
        const showLabel = transform.scale > 0.4 || isHovered || isSelected || n.type === 'domain';
        if (showLabel) {
          ctx.fillStyle = isDimmed
            ? 'rgba(255,255,255,0.1)'
            : isHovered || isSelected
              ? '#ffffff'
              : 'rgba(226, 232, 240, 0.85)';
          const fontSize = n.type === 'domain' ? 13 : n.type === 'repo' ? 11 : 9;
          ctx.font = `${isHovered || isSelected ? 'bold ' : ''}${fontSize}px -apple-system, system-ui, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';

          // Text background for readability
          const text = n.label;
          const metrics = ctx.measureText(text);
          const textY = n.y + r + 6;
          if (!isDimmed && (n.type === 'domain' || n.type === 'repo')) {
            ctx.fillStyle = 'rgba(2, 6, 23, 0.7)';
            ctx.fillRect(n.x - metrics.width / 2 - 3, textY - 1, metrics.width + 6, fontSize + 4);
          }

          ctx.fillStyle = isDimmed
            ? 'rgba(255,255,255,0.1)'
            : isHovered || isSelected
              ? '#ffffff'
              : 'rgba(226, 232, 240, 0.85)';
          ctx.fillText(text, n.x, textY);
        }

        ctx.globalAlpha = 1;
      });

      ctx.restore();

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [
    graph,
    transform,
    hoveredNode,
    selectedNode,
    hiddenNodeTypes,
    hiddenEdgeTypes,
    searchHighlight,
  ]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="block cursor-grab active:cursor-grabbing touch-none"
      />
    </div>
  );
}
