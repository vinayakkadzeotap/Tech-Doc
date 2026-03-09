'use client';

import { useRef, useEffect, useCallback, type Dispatch, type SetStateAction } from 'react';
import {
  UNIVERSE_NODES,
  UNIVERSE_EDGES,
  CATEGORY_MAP,
  type CategoryId,
} from '@/lib/utils/universe-data';

interface Transform {
  x: number;
  y: number;
  scale: number;
}

interface Props {
  transform: Transform;
  setTransform: Dispatch<SetStateAction<Transform>>;
  hiddenCategories: Set<CategoryId>;
  containerWidth: number;
  containerHeight: number;
}

const MAP_W = 160;
const MAP_H = 90;
const WORLD_W = 2000;
const WORLD_H = 1000;

export default function UniverseMinimap({
  transform,
  setTransform,
  hiddenCategories,
  containerWidth,
  containerHeight,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDragging = useRef(false);

  const scaleX = MAP_W / WORLD_W;
  const scaleY = MAP_H / WORLD_H;

  // Viewport rect in minimap coords
  const vpX = (-transform.x / transform.scale) * scaleX;
  const vpY = (-transform.y / transform.scale) * scaleY;
  const vpW = (containerWidth / transform.scale) * scaleX;
  const vpH = (containerHeight / transform.scale) * scaleY;

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      const rect = canvasRef.current!.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const dpr = window.devicePixelRatio || 1;
      // Convert minimap click to world coords
      const worldX = (mx / dpr) / scaleX;
      const worldY = (my / dpr) / scaleY;
      // Center viewport on that point
      setTransform((prev) => ({
        ...prev,
        x: -worldX * prev.scale + containerWidth / 2,
        y: -worldY * prev.scale + containerHeight / 2,
      }));
    },
    [scaleX, scaleY, containerWidth, containerHeight, setTransform]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = MAP_W * dpr;
    canvas.height = MAP_H * dpr;
    canvas.style.width = `${MAP_W}px`;
    canvas.style.height = `${MAP_H}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, MAP_W, MAP_H);

    // Edges
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 0.5;
    UNIVERSE_EDGES.forEach((e) => {
      const from = UNIVERSE_NODES.find((n) => n.id === e.from);
      const to = UNIVERSE_NODES.find((n) => n.id === e.to);
      if (!from || !to) return;
      if (hiddenCategories.has(from.category) || hiddenCategories.has(to.category)) return;
      ctx.beginPath();
      ctx.moveTo(from.x * scaleX, from.y * scaleY);
      ctx.lineTo(to.x * scaleX, to.y * scaleY);
      ctx.stroke();
    });

    // Nodes
    UNIVERSE_NODES.forEach((n) => {
      if (hiddenCategories.has(n.category)) return;
      ctx.fillStyle = CATEGORY_MAP[n.category].color;
      ctx.beginPath();
      ctx.arc(n.x * scaleX, n.y * scaleY, Math.max(1.5, n.radius * scaleX * 0.5), 0, Math.PI * 2);
      ctx.fill();
    });

    // Viewport rectangle
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 1;
    ctx.strokeRect(vpX, vpY, vpW, vpH);
  }, [transform, hiddenCategories, scaleX, scaleY, vpX, vpY, vpW, vpH]);

  return (
    <div className="absolute bottom-16 right-4 z-20">
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        onMouseDown={() => { isDragging.current = true; }}
        onMouseUp={() => { isDragging.current = false; }}
        onMouseMove={(e) => {
          if (isDragging.current) handleClick(e);
        }}
        className="rounded-lg border border-border/50 cursor-pointer opacity-70 hover:opacity-100 transition-opacity shadow-lg"
      />
    </div>
  );
}
