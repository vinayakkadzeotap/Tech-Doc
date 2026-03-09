'use client';

import {
  useRef,
  useEffect,
  useState,
  useCallback,
  type Dispatch,
  type SetStateAction,
} from 'react';
import {
  UNIVERSE_NODES,
  UNIVERSE_EDGES,
  CATEGORY_MAP,
  FLOW_PATHS,
  generateStars,
  type UniverseNode,
  type CategoryId,
} from '@/lib/utils/universe-data';

// ─── Types ──────────────────────────────────────────────────────────

interface Particle {
  edgeIdx: number;
  t: number; // 0→1 progress along edge
  speed: number;
}

interface FlowParticle {
  pathIdx: number;
  segIdx: number; // which segment of the path
  t: number;
  color: string;
}

interface Transform {
  x: number;
  y: number;
  scale: number;
}

interface Props {
  selectedNode: string | null;
  onSelectNode: (id: string | null) => void;
  hoveredNode: string | null;
  onHoverNode: (id: string | null) => void;
  hiddenCategories: Set<CategoryId>;
  searchHighlight: string | null;
  activeFlowId: string | null;
  flowSpeed: number;
  transform: Transform;
  setTransform: Dispatch<SetStateAction<Transform>>;
}

// ─── Constants ──────────────────────────────────────────────────────

const WORLD_W = 2000;
const WORLD_H = 1000;
const MIN_SCALE = 0.25;
const MAX_SCALE = 3;
const PARTICLE_COUNT = 80;

// ─── Helpers ────────────────────────────────────────────────────────

function nodeById(id: string): UniverseNode | undefined {
  return UNIVERSE_NODES.find((n) => n.id === id);
}

/** Quadratic bezier control point for a curved edge */
function edgeControlPoint(
  ax: number,
  ay: number,
  bx: number,
  by: number
): [number, number] {
  const mx = (ax + bx) / 2;
  const my = (ay + by) / 2;
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.sqrt(dx * dx + dy * dy);
  const off = len * 0.15;
  return [mx + (dy / len) * off, my - (dx / len) * off];
}

/** Point on a quadratic bezier at t */
function bezierPoint(
  ax: number,
  ay: number,
  cx: number,
  cy: number,
  bx: number,
  by: number,
  t: number
): [number, number] {
  const u = 1 - t;
  return [
    u * u * ax + 2 * u * t * cx + t * t * bx,
    u * u * ay + 2 * u * t * cy + t * t * by,
  ];
}

// ─── Component ──────────────────────────────────────────────────────

export default function UniverseCanvas({
  selectedNode,
  onSelectNode,
  hoveredNode,
  onHoverNode,
  hiddenCategories,
  searchHighlight,
  activeFlowId,
  flowSpeed,
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

  // Animation state
  const particles = useRef<Particle[]>([]);
  const flowParticles = useRef<FlowParticle[]>([]);
  const time = useRef(0);
  const stars = useRef(generateStars(300, WORLD_W, WORLD_H));

  // Tooltip
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    node: UniverseNode;
  } | null>(null);

  // ── Initialize particles ──────────────────────────────────────────
  useEffect(() => {
    const ps: Particle[] = [];
    const animatedEdges = UNIVERSE_EDGES
      .map((e, i) => ({ ...e, idx: i }))
      .filter((e) => e.animated);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const edge = animatedEdges[i % animatedEdges.length];
      ps.push({
        edgeIdx: edge.idx,
        t: Math.random(),
        speed: 0.002 + Math.random() * 0.003,
      });
    }
    particles.current = ps;
  }, []);

  // ── Flow simulation particles ─────────────────────────────────────
  useEffect(() => {
    if (!activeFlowId) {
      flowParticles.current = [];
      return;
    }
    const path = FLOW_PATHS.find((p) => p.id === activeFlowId);
    if (!path) return;

    const fps: FlowParticle[] = [];
    // Stagger 5 particles along the path
    for (let i = 0; i < 5; i++) {
      fps.push({
        pathIdx: FLOW_PATHS.indexOf(path),
        segIdx: 0,
        t: -i * 0.3, // negative = delayed start
        color: path.color,
      });
    }
    flowParticles.current = fps;
  }, [activeFlowId]);

  // ── Screen ↔ World transforms ─────────────────────────────────────
  const screenToWorld = useCallback(
    (sx: number, sy: number): [number, number] => {
      return [
        (sx - transform.x) / transform.scale,
        (sy - transform.y) / transform.scale,
      ];
    },
    [transform]
  );

  // ── Hit test ──────────────────────────────────────────────────────
  const hitTest = useCallback(
    (sx: number, sy: number): UniverseNode | null => {
      const [wx, wy] = screenToWorld(sx, sy);
      // Check from top (highest z) to bottom
      for (let i = UNIVERSE_NODES.length - 1; i >= 0; i--) {
        const n = UNIVERSE_NODES[i];
        if (hiddenCategories.has(n.category)) continue;
        const dx = wx - n.x;
        const dy = wy - n.y;
        const hitR = n.radius + 8; // generous hit area
        if (dx * dx + dy * dy < hitR * hitR) return n;
      }
      return null;
    },
    [screenToWorld, hiddenCategories]
  );

  // ── Mouse handlers ────────────────────────────────────────────────
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0) return;
      isDragging.current = true;
      dragStart.current = { x: e.clientX - transform.x, y: e.clientY - transform.y };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [transform]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;

      if (isDragging.current) {
        setTransform((prev) => ({
          ...prev,
          x: e.clientX - dragStart.current.x,
          y: e.clientY - dragStart.current.y,
        }));
        setTooltip(null);
        return;
      }

      const hit = hitTest(sx, sy);
      if (hit) {
        onHoverNode(hit.id);
        canvas.style.cursor = 'pointer';
        setTooltip({ x: e.clientX, y: e.clientY, node: hit });
      } else {
        onHoverNode(null);
        canvas.style.cursor = 'grab';
        setTooltip(null);
      }
    },
    [hitTest, onHoverNode, setTransform]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return;
      isDragging.current = false;

      // If minimal movement, treat as click
      const dx = e.clientX - (dragStart.current.x + transform.x);
      const dy = e.clientY - (dragStart.current.y + transform.y);
      if (Math.abs(dx) < 4 && Math.abs(dy) < 4) {
        const rect = canvasRef.current!.getBoundingClientRect();
        const hit = hitTest(e.clientX - rect.left, e.clientY - rect.top);
        if (hit) {
          onSelectNode(hit.id);
        } else {
          onSelectNode(null);
        }
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
        return {
          scale: newScale,
          x: mx - (mx - prev.x) * ratio,
          y: my - (my - prev.y) * ratio,
        };
      });
    },
    [setTransform]
  );

  // ── Touch pinch zoom ──────────────────────────────────────────────
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
            return {
              scale: newScale,
              x: mx - (mx - prev.x) * ratio,
              y: my - (my - prev.y) * ratio,
            };
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

  // ── Render loop ───────────────────────────────────────────────────
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

    const draw = () => {
      time.current += 1;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Background
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, w, h);

      // ── Stars (parallax) ──────────────────────────────────────────
      const parallax = 0.3;
      stars.current.forEach((s) => {
        const sx = (s.x * transform.scale * parallax + transform.x * parallax) % w;
        const sy = (s.y * transform.scale * parallax + transform.y * parallax) % h;
        const twinkle = Math.sin(time.current * 0.02 + s.x * 0.1) * 0.3 + 0.7;
        ctx.fillStyle = `rgba(200, 220, 255, ${s.opacity * twinkle})`;
        ctx.beginPath();
        ctx.arc(sx < 0 ? sx + w : sx, sy < 0 ? sy + h : sy, s.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Apply world transform
      ctx.save();
      ctx.translate(transform.x, transform.y);
      ctx.scale(transform.scale, transform.scale);

      // ── Category halos (subtle region glow) ───────────────────────
      const categoryPositions: Record<string, { cx: number; cy: number; count: number }> = {};
      UNIVERSE_NODES.forEach((n) => {
        if (hiddenCategories.has(n.category)) return;
        if (!categoryPositions[n.category]) {
          categoryPositions[n.category] = { cx: 0, cy: 0, count: 0 };
        }
        categoryPositions[n.category].cx += n.x;
        categoryPositions[n.category].cy += n.y;
        categoryPositions[n.category].count += 1;
      });

      Object.entries(categoryPositions).forEach(([catId, pos]) => {
        const cat = CATEGORY_MAP[catId as CategoryId];
        if (!cat) return;
        const cx = pos.cx / pos.count;
        const cy = pos.cy / pos.count;
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 250);
        grad.addColorStop(0, `${cat.color}08`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, 250, 0, Math.PI * 2);
        ctx.fill();
      });

      // ── Edges ─────────────────────────────────────────────────────
      UNIVERSE_EDGES.forEach((edge) => {
        const fromNode = nodeById(edge.from);
        const toNode = nodeById(edge.to);
        if (!fromNode || !toNode) return;
        if (
          hiddenCategories.has(fromNode.category) ||
          hiddenCategories.has(toNode.category)
        )
          return;

        const isHighlighted =
          hoveredNode === edge.from ||
          hoveredNode === edge.to ||
          selectedNode === edge.from ||
          selectedNode === edge.to;

        const [cx, cy] = edgeControlPoint(
          fromNode.x,
          fromNode.y,
          toNode.x,
          toNode.y
        );

        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.quadraticCurveTo(cx, cy, toNode.x, toNode.y);
        ctx.strokeStyle = isHighlighted
          ? `${CATEGORY_MAP[fromNode.category].color}90`
          : 'rgba(255, 255, 255, 0.06)';
        ctx.lineWidth = isHighlighted ? 2 : 1;
        ctx.stroke();
      });

      // ── Edge particles ────────────────────────────────────────────
      particles.current.forEach((p) => {
        const edge = UNIVERSE_EDGES[p.edgeIdx];
        if (!edge) return;
        const fromNode = nodeById(edge.from);
        const toNode = nodeById(edge.to);
        if (!fromNode || !toNode) return;
        if (
          hiddenCategories.has(fromNode.category) ||
          hiddenCategories.has(toNode.category)
        )
          return;

        p.t += p.speed;
        if (p.t > 1) p.t = 0;

        const [cpx, cpy] = edgeControlPoint(
          fromNode.x,
          fromNode.y,
          toNode.x,
          toNode.y
        );
        const [px, py] = bezierPoint(
          fromNode.x,
          fromNode.y,
          cpx,
          cpy,
          toNode.x,
          toNode.y,
          p.t
        );

        const cat = CATEGORY_MAP[fromNode.category];
        const alpha = Math.sin(p.t * Math.PI) * 0.7;
        ctx.fillStyle = `${cat.color}${Math.round(alpha * 255)
          .toString(16)
          .padStart(2, '0')}`;
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // ── Flow simulation particles ─────────────────────────────────
      flowParticles.current.forEach((fp) => {
        const path = FLOW_PATHS[fp.pathIdx];
        if (!path) return;

        fp.t += 0.008 * flowSpeed;
        if (fp.t >= 1) {
          fp.segIdx += 1;
          fp.t = 0;
        }
        if (fp.segIdx >= path.nodeSequence.length - 1) {
          fp.segIdx = 0;
          fp.t = -0.5; // pause before restart
        }
        if (fp.t < 0) return;

        const fromId = path.nodeSequence[fp.segIdx];
        const toId = path.nodeSequence[fp.segIdx + 1];
        const fromN = nodeById(fromId);
        const toN = nodeById(toId);
        if (!fromN || !toN) return;

        const [cpx, cpy] = edgeControlPoint(fromN.x, fromN.y, toN.x, toN.y);
        const [px, py] = bezierPoint(
          fromN.x,
          fromN.y,
          cpx,
          cpy,
          toN.x,
          toN.y,
          fp.t
        );

        // Glowing particle
        const grad = ctx.createRadialGradient(px, py, 0, px, py, 10);
        grad.addColorStop(0, fp.color);
        grad.addColorStop(0.4, `${fp.color}80`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(px, py, 10, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // ── Nodes ─────────────────────────────────────────────────────
      UNIVERSE_NODES.forEach((n) => {
        if (hiddenCategories.has(n.category)) return;
        const cat = CATEGORY_MAP[n.category];
        const isHovered = hoveredNode === n.id;
        const isSelected = selectedNode === n.id;
        const isSearchMatch =
          searchHighlight &&
          n.label.toLowerCase().includes(searchHighlight.toLowerCase());
        const isDimmed =
          searchHighlight &&
          !n.label.toLowerCase().includes(searchHighlight.toLowerCase());

        const r = n.radius * (isHovered ? 1.25 : 1);
        const globalAlpha = isDimmed ? 0.2 : 1;

        ctx.globalAlpha = globalAlpha;

        // Outer glow
        const pulse = Math.sin(time.current * 0.03 + n.x * 0.01) * 0.3 + 0.7;
        const glowR = r * 2.5 * (isHovered || isSelected ? 1.4 : 1);
        const glow = ctx.createRadialGradient(n.x, n.y, r * 0.5, n.x, n.y, glowR);
        glow.addColorStop(0, `${cat.color}${Math.round(pulse * 50).toString(16).padStart(2, '0')}`);
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(n.x, n.y, glowR, 0, Math.PI * 2);
        ctx.fill();

        // Node body gradient (3D sphere effect)
        const bodyGrad = ctx.createRadialGradient(
          n.x - r * 0.3,
          n.y - r * 0.3,
          r * 0.1,
          n.x,
          n.y,
          r
        );
        bodyGrad.addColorStop(0, '#ffffff');
        bodyGrad.addColorStop(0.3, cat.color);
        bodyGrad.addColorStop(1, `${cat.color}60`);
        ctx.fillStyle = bodyGrad;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fill();

        // Selection ring
        if (isSelected || isSearchMatch) {
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(n.x, n.y, r + 5, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Label
        if (transform.scale > 0.45 || isHovered || isSelected) {
          ctx.fillStyle = isDimmed
            ? 'rgba(255,255,255,0.15)'
            : isHovered || isSelected
              ? '#ffffff'
              : 'rgba(226, 232, 240, 0.85)';
          ctx.font = `${isHovered || isSelected ? 'bold ' : ''}${
            n.radius > 24 ? 13 : 11
          }px -apple-system, system-ui, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.fillText(n.label, n.x, n.y + r + 8);
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
    transform,
    hoveredNode,
    selectedNode,
    hiddenCategories,
    searchHighlight,
    flowSpeed,
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

      {/* Tooltip */}
      {tooltip && !isDragging.current && (
        <div
          className="pointer-events-none fixed z-50 px-4 py-3 rounded-xl bg-bg-elevated border border-border shadow-modal max-w-xs animate-fade-in"
          style={{
            left: tooltip.x + 16,
            top: tooltip.y - 10,
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{
                background: CATEGORY_MAP[tooltip.node.category].color,
              }}
            />
            <span className="text-sm font-bold text-text-primary">
              {tooltip.node.label}
            </span>
          </div>
          <p className="text-xs text-text-muted leading-relaxed">
            {tooltip.node.description}
          </p>
          {tooltip.node.techStack.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {tooltip.node.techStack.map((t) => (
                <span
                  key={t}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] text-text-secondary"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
