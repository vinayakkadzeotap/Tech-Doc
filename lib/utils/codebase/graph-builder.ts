// ─── Codebase Graph: Data Transformer ──────────────────────────────

import type { Domain, DomainId } from './types';
import type { GraphNode, GraphEdge, CodeGraph } from './graph-types';

export interface GraphOptions {
  domainFilter?: DomainId[];
  includeModules: boolean;
  includeDependencies: boolean;
}

const DEP_COLORS: Record<string, string> = {
  database: '#10b981',
  queue: '#f59e0b',
  cloud: '#06b6d4',
  library: '#a855f7',
  service: '#f43f5e',
};

export function buildCodeGraph(domains: Domain[], options: GraphOptions): CodeGraph {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const nodeMap = new Map<string, GraphNode>();
  const depMap = new Map<string, GraphNode>(); // deduplicate deps by name

  const filtered = options.domainFilter
    ? domains.filter((d) => options.domainFilter!.includes(d.id))
    : domains;

  const allRepoIds = new Set<string>();
  domains.forEach((d) => d.repos.forEach((r) => {
    allRepoIds.add(r.id);
    allRepoIds.add(r.name);
  }));

  // Build a lookup of repo name/id → full repo node id
  const repoLookup = new Map<string, string>();
  domains.forEach((d) => d.repos.forEach((r) => {
    repoLookup.set(r.id, `repo-${r.id}`);
    repoLookup.set(r.name, `repo-${r.id}`);
  }));

  // Place domains in a circle
  const cx = 800;
  const cy = 500;
  const domainRadius = filtered.length > 1 ? 350 : 0;

  filtered.forEach((domain, di) => {
    const angle = (2 * Math.PI * di) / filtered.length - Math.PI / 2;
    const dx = cx + Math.cos(angle) * domainRadius;
    const dy = cy + Math.sin(angle) * domainRadius;

    const domainNode: GraphNode = {
      id: `domain-${domain.id}`,
      label: domain.title,
      type: 'domain',
      color: domain.color,
      radius: 28,
      description: domain.description,
      metadata: { repoCount: domain.repos.length, domainId: domain.id },
      x: dx,
      y: dy,
      vx: 0,
      vy: 0,
    };
    nodes.push(domainNode);
    nodeMap.set(domainNode.id, domainNode);

    // Repos around domain
    domain.repos.forEach((repo, ri) => {
      const repoAngle = angle + ((ri - domain.repos.length / 2) * 0.4);
      const spread = 80 + Math.random() * 60;
      const rx = dx + Math.cos(repoAngle) * spread;
      const ry = dy + Math.sin(repoAngle) * spread;

      const repoNode: GraphNode = {
        id: `repo-${repo.id}`,
        label: repo.displayName,
        type: 'repo',
        color: domain.color,
        radius: 16,
        description: repo.purpose,
        metadata: {
          language: repo.language,
          languages: repo.languages,
          size: repo.size,
          domainId: domain.id,
          repoId: repo.id,
        },
        x: rx,
        y: ry,
        vx: 0,
        vy: 0,
      };
      nodes.push(repoNode);
      nodeMap.set(repoNode.id, repoNode);

      edges.push({
        id: `e-domain-${domain.id}-${repo.id}`,
        source: domainNode.id,
        target: repoNode.id,
        type: 'contains',
      });

      // Modules
      if (options.includeModules) {
        repo.keyModules.forEach((mod, mi) => {
          const mAngle = repoAngle + ((mi - repo.keyModules.length / 2) * 0.3);
          const mSpread = 30 + Math.random() * 20;
          const modNode: GraphNode = {
            id: `mod-${repo.id}-${mi}`,
            label: mod.name,
            type: 'module',
            color: domain.color,
            radius: 8,
            description: mod.description,
            metadata: { path: mod.path, repoId: repo.id },
            x: rx + Math.cos(mAngle) * mSpread,
            y: ry + Math.sin(mAngle) * mSpread,
            vx: 0,
            vy: 0,
          };
          nodes.push(modNode);
          nodeMap.set(modNode.id, modNode);

          edges.push({
            id: `e-mod-${repo.id}-${mi}`,
            source: repoNode.id,
            target: modNode.id,
            type: 'has-module',
          });
        });
      }

      // Dependencies (deduplicated)
      if (options.includeDependencies) {
        repo.dependencies.forEach((dep) => {
          const depKey = dep.name.toLowerCase().replace(/\s+/g, '-');
          let depNode = depMap.get(depKey);
          if (!depNode) {
            depNode = {
              id: `dep-${depKey}`,
              label: dep.name,
              type: 'dependency',
              color: DEP_COLORS[dep.type] || '#94a3b8',
              radius: 10,
              description: dep.description,
              metadata: { depType: dep.type },
              x: cx + (Math.random() - 0.5) * 400,
              y: cy + (Math.random() - 0.5) * 400,
              vx: 0,
              vy: 0,
            };
            depMap.set(depKey, depNode);
            nodes.push(depNode);
            nodeMap.set(depNode.id, depNode);
          }

          edges.push({
            id: `e-dep-${repo.id}-${depKey}`,
            source: repoNode.id,
            target: depNode.id,
            type: 'depends-on',
          });
        });
      }
    });
  });

  // Inter-repo links
  filtered.forEach((domain) => {
    domain.repos.forEach((repo) => {
      repo.interRepoLinks.forEach((linkName) => {
        const targetNodeId = repoLookup.get(linkName);
        const sourceNodeId = `repo-${repo.id}`;
        if (targetNodeId && targetNodeId !== sourceNodeId && nodeMap.has(targetNodeId)) {
          const edgeId = `e-inter-${repo.id}-${linkName}`;
          // Avoid duplicate edges
          if (!edges.some((e) => e.id === edgeId)) {
            edges.push({
              id: edgeId,
              source: sourceNodeId,
              target: targetNodeId,
              type: 'inter-repo',
              label: 'depends on',
            });
          }
        }
      });
    });
  });

  return { nodes, edges };
}
