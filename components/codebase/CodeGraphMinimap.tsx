'use client';

import { useRef, useEffect, useCallback, type Dispatch, type SetStateAction } from 'react';
import type { CodeGraph, NodeType, Transform } from '@/lib/utils/codebase/graph-types';

interface Props {
  graph: CodeGraph;
  transform: Transform;
  setTransform: Dispatch<SetStateAction<Transform>>;
  hiddenNodeTypes: Set<NodeType>;
  containerWidth: number;
  containerHeight: number;
}

const MAP_W = 160;
const MAP_H = 100;

export default function CodeGraphMinimap({
  graph,
  transform,
  setTransform,
  hiddenNodeTypes,
  containerWidth,
  containerHeight,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDragging = useRef(false);

  // Compute world bounds from nodes
  const visible = graph.nodes.filter((n) => !hiddenNodeTypes.has(n.type));
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  visible.forEach((n) => {
    if (n.x < minX) minX = n.x;
    if (n.x > maxX) maxX = n.x;
    if (n.y < minY) minY = n.y;
    if (n.y > maxY) maxY = n.y;
  });
  const pad = 100;
  minX -= pad; minY -= pad; maxX += pad; maxY += pad;
  const worldW = Math.max(maxX - minX, 100);
  const worldH = Math.max(maxY - minY, 100);

  const scaleX = MAP_W / worldW;
  const scaleY = MAP_H / worldH;

  const vpX = (-transform.x / transform.scale - minX) * scaleX;
  const vpY = (-transform.y / transform.scale - minY) * scaleY;
  const vpW = (containerWidth / transform.scale) * scaleX;
  const vpH = (containerHeight / transform.scale) * scaleY;

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      const rect = canvasRef.current!.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const mx = (e.clientX - rect.left);
      const my = (e.clientY - rect.top);
      const worldX = mx / scaleX + minX;
      const worldY = my / scaleY + minY;
      setTransform((prev) => ({
        ...prev,
        x: -worldX * prev.scale + containerWidth / 2,
        y: -worldY * prev.scale + containerHeight / 2,
      }));
    },
    [scaleX, scaleY, minX, minY, containerWidth, containerHeight, setTransform]
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

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, MAP_W, MAP_H);

    // Edges
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 0.5;
    graph.edges.forEach((e) => {
      const from = graph.nodes.find((n) => n.id === e.source);
      const to = graph.nodes.find((n) => n.id === e.target);
      if (!from || !to) return;
      if (hiddenNodeTypes.has(from.type) || hiddenNodeTypes.has(to.type)) return;
      ctx.beginPath();
      ctx.moveTo((from.x - minX) * scaleX, (from.y - minY) * scaleY);
      ctx.lineTo((to.x - minX) * scaleX, (to.y - minY) * scaleY);
      ctx.stroke();
    });

    // Nodes
    visible.forEach((n) => {
      ctx.fillStyle = n.color;
      ctx.beginPath();
      ctx.arc(
        (n.x - minX) * scaleX,
        (n.y - minY) * scaleY,
        Math.max(1.5, n.radius * scaleX * 0.4),
        0,
        Math.PI * 2
      );
      ctx.fill();
    });

    // Viewport
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 1;
    ctx.strokeRect(vpX, vpY, vpW, vpH);
  }, [graph, transform, hiddenNodeTypes, scaleX, scaleY, minX, minY, vpX, vpY, vpW, vpH, visible]);

  if (visible.length === 0) return null;

  return (
    <div className="absolute bottom-16 right-4 z-20">
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        onMouseDown={() => { isDragging.current = true; }}
        onMouseUp={() => { isDragging.current = false; }}
        onMouseMove={(e) => { if (isDragging.current) handleClick(e); }}
        className="rounded-lg border border-border/50 cursor-pointer opacity-70 hover:opacity-100 transition-opacity shadow-lg"
      />
    </div>
  );
}
