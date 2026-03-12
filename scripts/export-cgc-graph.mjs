#!/usr/bin/env node
/**
 * Export CodeGraphContext graph data as JSON for ZeoAI code graph visualization.
 * Runs cgc Cypher queries and transforms results into our GraphNode/GraphEdge format.
 *
 * Usage: node scripts/export-cgc-graph.mjs [output_path]
 */

import { execSync } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';

const CGC = '/Users/vinayakkad/.local/bin/cgc';
const OUTPUT = process.argv[2] || 'public/data/cgc-graph.json';

function query(cypher) {
  // Use single quotes in shell to avoid escaping issues
  const escaped = cypher.replace(/'/g, "'\\''").replace(/\n/g, ' ');
  const raw = execSync(`${CGC} query '${escaped}'`, {
    encoding: 'utf-8',
    timeout: 120000,
    maxBuffer: 100 * 1024 * 1024,
  });
  // Find the JSON array in the output (skip log lines)
  const idx = raw.indexOf('[');
  if (idx === -1) throw new Error('No JSON array in query output: ' + raw.slice(0, 500));
  let jsonStr = raw.slice(idx);
  // cgc pretty-prints and may line-wrap long string values, inserting literal newlines
  // inside JSON strings. Fix: strip ALL control chars then parse as single-line JSON.
  jsonStr = jsonStr.replace(/[\x00-\x1f]/g, '');
  return JSON.parse(jsonStr);
}

console.log('Querying CodeGraphContext database...');

// 1. Get all repos
const repos = query(`
  MATCH (r:Repository)
  RETURN id(r) AS id, r.name AS name
`);
console.log(`  Repos: ${repos.length}`);

// 2. Get files (limited properties)
const files = query(`
  MATCH (f:File)
  RETURN id(f) AS id, f.name AS name, f.relative_path AS path
`);
console.log(`  Files: ${files.length}`);

// 3. Get classes
const classes = query(`
  MATCH (c:Class)
  RETURN id(c) AS id, c.name AS name, c.file_path AS path
`);
console.log(`  Classes: ${classes.length}`);

// 4. Get functions (name only — file_path may contain source code in some backends)
const functions = query(`
  MATCH (fn:Function)
  RETURN id(fn) AS id, fn.name AS name
`);
console.log(`  Functions: ${functions.length}`);

// 5. Get modules
const modules = query(`
  MATCH (m:Module)
  RETURN id(m) AS id, m.name AS name, m.file_path AS path
`);
console.log(`  Modules: ${modules.length}`);

// 6. Get directories
const dirs = query(`
  MATCH (d:Directory)
  RETURN id(d) AS id, d.name AS name, d.relative_path AS path
`);
console.log(`  Directories: ${dirs.length}`);

// 7. Get all relationships
const edges = query(`
  MATCH (a)-[r]->(b)
  RETURN id(a) AS source, id(b) AS target, type(r) AS type
`);
console.log(`  Edges: ${edges.length}`);

// Build combined node list
const NODE_COLORS = {
  Repository: '#f59e0b',
  Directory: '#6366f1',
  File: '#3b82f6',
  Module: '#8b5cf6',
  Class: '#10b981',
  Function: '#ec4899',
};

const NODE_RADIUS = {
  Repository: 30,
  Directory: 12,
  File: 8,
  Module: 10,
  Class: 14,
  Function: 6,
};

const allNodes = [];
const addNodes = (list, type) => {
  list.forEach((n) => {
    allNodes.push({
      id: String(n.id),
      label: n.name || 'unknown',
      type: type.toLowerCase(),
      color: NODE_COLORS[type],
      radius: NODE_RADIUS[type],
      description: n.path || '',
      metadata: { path: n.path || '' },
    });
  });
};

addNodes(repos, 'Repository');
addNodes(dirs, 'Directory');
addNodes(files, 'File');
addNodes(modules, 'Module');
addNodes(classes, 'Class');
addNodes(functions, 'Function');

const nodeIds = new Set(allNodes.map((n) => n.id));

// Filter edges to only include nodes we have
const allEdges = edges
  .filter((e) => nodeIds.has(String(e.source)) && nodeIds.has(String(e.target)))
  .map((e, i) => ({
    id: `e-${i}`,
    source: String(e.source),
    target: String(e.target),
    type: e.type.toLowerCase(), // CONTAINS -> contains, CALLS -> calls, IMPORTS -> imports
  }));

const result = {
  nodes: allNodes,
  edges: allEdges,
  meta: {
    exportedAt: new Date().toISOString(),
    stats: {
      repos: repos.length,
      files: files.length,
      classes: classes.length,
      functions: functions.length,
      modules: modules.length,
      directories: dirs.length,
      edges: allEdges.length,
    },
  },
};

mkdirSync(dirname(OUTPUT), { recursive: true });
writeFileSync(OUTPUT, JSON.stringify(result, null, 2));
console.log(`\nExported to ${OUTPUT}`);
console.log(`Total: ${allNodes.length} nodes, ${allEdges.length} edges`);
