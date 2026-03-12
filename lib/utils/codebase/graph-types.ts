// ─── Codebase Graph: Types ─────────────────────────────────────────

export type NodeType = 'domain' | 'repo' | 'module' | 'dependency'
  | 'repository' | 'directory' | 'file' | 'class' | 'function';
export type EdgeType = 'contains' | 'has-module' | 'depends-on' | 'inter-repo'
  | 'calls' | 'imports';

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  color: string;
  radius: number;
  description: string;
  metadata: Record<string, unknown>;
  // Force simulation mutable state
  x: number;
  y: number;
  vx: number;
  vy: number;
  fx?: number;
  fy?: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: EdgeType;
  label?: string;
}

export interface CodeGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface Transform {
  x: number;
  y: number;
  scale: number;
}
