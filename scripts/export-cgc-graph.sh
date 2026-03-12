#!/bin/bash
# Export CodeGraphContext graph data as JSON for the ZeoAI code graph visualization
# Usage: ./scripts/export-cgc-graph.sh [output_file]

export PATH="$HOME/.local/bin:$PATH"
OUTPUT="${1:-public/data/cgc-graph.json}"

echo "Exporting CodeGraphContext graph data..."

# Query all nodes with their properties
NODES=$(cgc query "
MATCH (n)
WHERE n:Repository OR n:File OR n:Class OR n:Function OR n:Module OR n:Directory
RETURN
  id(n) AS id,
  labels(n)[0] AS type,
  COALESCE(n.name, n.file_path, 'unknown') AS name,
  COALESCE(n.file_path, '') AS path,
  COALESCE(n.repository, '') AS repo,
  COALESCE(n.start_line, 0) AS line
" 2>&1 | grep -v "^No config\|^Using database\|^Initializing\|^Services")

# Query all edges
EDGES=$(cgc query "
MATCH (a)-[r]->(b)
WHERE (a:Repository OR a:File OR a:Class OR a:Function OR a:Module OR a:Directory)
  AND (b:Repository OR b:File OR b:Class OR b:Function OR b:Module OR b:Directory)
RETURN
  id(a) AS source,
  id(b) AS target,
  type(r) AS type
" 2>&1 | grep -v "^No config\|^Using database\|^Initializing\|^Services")

# Combine into single JSON
mkdir -p "$(dirname "$OUTPUT")"
cat > "$OUTPUT" <<JSONEOF
{
  "nodes": $NODES,
  "edges": $EDGES,
  "exportedAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
JSONEOF

echo "Exported to $OUTPUT"
echo "Stats:"
echo "  Nodes: $(echo "$NODES" | python3 -c 'import json,sys; print(len(json.load(sys.stdin)))' 2>/dev/null || echo 'N/A')"
echo "  Edges: $(echo "$EDGES" | python3 -c 'import json,sys; print(len(json.load(sys.stdin)))' 2>/dev/null || echo 'N/A')"
