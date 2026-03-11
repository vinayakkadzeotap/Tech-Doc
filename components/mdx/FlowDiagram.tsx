'use client';

interface FlowNode {
  id: string;
  label: string;
  detail?: string;
  icon?: string;
  type?: 'start' | 'process' | 'decision' | 'end' | 'data' | 'integration';
}

interface FlowConnection {
  from: string;
  to: string;
  label?: string;
}

interface FlowDiagramProps {
  title?: string;
  caption?: string;
  nodes: FlowNode[];
  connections?: FlowConnection[];
  layout?: 'horizontal' | 'vertical' | 'grid';
  columns?: number;
}

const typeStyles: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  start:       { bg: 'bg-emerald-500/15', border: 'border-emerald-500/40', text: 'text-emerald-400', glow: 'shadow-emerald-500/10' },
  process:     { bg: 'bg-blue-500/15',    border: 'border-blue-500/40',    text: 'text-blue-400',    glow: 'shadow-blue-500/10' },
  decision:    { bg: 'bg-amber-500/15',   border: 'border-amber-500/40',   text: 'text-amber-400',   glow: 'shadow-amber-500/10' },
  end:         { bg: 'bg-purple-500/15',   border: 'border-purple-500/40',  text: 'text-purple-400',  glow: 'shadow-purple-500/10' },
  data:        { bg: 'bg-cyan-500/15',    border: 'border-cyan-500/40',    text: 'text-cyan-400',    glow: 'shadow-cyan-500/10' },
  integration: { bg: 'bg-pink-500/15',    border: 'border-pink-500/40',    text: 'text-pink-400',    glow: 'shadow-pink-500/10' },
};

function NodeCard({ node }: { node: FlowNode }) {
  const style = typeStyles[node.type || 'process'];
  return (
    <div className={`flex flex-col items-center text-center p-3 rounded-xl border ${style.bg} ${style.border} shadow-lg ${style.glow} min-w-[110px] max-w-[160px]`}>
      {node.icon && <span className="text-xl mb-1.5">{node.icon}</span>}
      <span className={`text-xs font-bold ${style.text}`}>{node.label}</span>
      {node.detail && (
        <span className="text-[10px] text-text-muted mt-1 leading-tight">{node.detail}</span>
      )}
    </div>
  );
}

function Arrow({ direction = 'right', label }: { direction?: 'right' | 'down'; label?: string }) {
  return (
    <div className={`flex ${direction === 'down' ? 'flex-col items-center py-1' : 'flex-row items-center px-1'}`}>
      {label && (
        <span className="text-[9px] text-text-muted font-medium bg-bg-surface/80 px-1.5 py-0.5 rounded mb-0.5">{label}</span>
      )}
      <span className="text-text-muted text-sm">
        {direction === 'down' ? '↓' : '→'}
      </span>
    </div>
  );
}

export default function FlowDiagram({ title, caption, nodes, connections, layout = 'horizontal', columns = 4 }: FlowDiagramProps) {
  if (!nodes || !Array.isArray(nodes) || nodes.length === 0) return null;

  // For simple layouts without explicit connections, render in sequence
  if (!connections || connections.length === 0) {
    if (layout === 'grid') {
      return (
        <div className="my-6 bg-bg-surface/50 border border-border rounded-2xl p-5 overflow-x-auto">
          {title && <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">{title}</h4>}
          <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
            {nodes.map((node) => (
              <NodeCard key={node.id} node={node} />
            ))}
          </div>
          {caption && <p className="text-[11px] text-text-muted italic text-center mt-3">{caption}</p>}
        </div>
      );
    }

    const isVertical = layout === 'vertical';
    return (
      <div className="my-6 bg-bg-surface/50 border border-border rounded-2xl p-5 overflow-x-auto">
        {title && <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">{title}</h4>}
        <div className={`flex ${isVertical ? 'flex-col items-center' : 'flex-row items-center justify-center flex-wrap'} gap-0`}>
          {nodes.map((node, i) => (
            <div key={node.id} className={`flex ${isVertical ? 'flex-col' : 'flex-row'} items-center`}>
              <NodeCard node={node} />
              {i < nodes.length - 1 && <Arrow direction={isVertical ? 'down' : 'right'} />}
            </div>
          ))}
        </div>
        {caption && <p className="text-[11px] text-text-muted italic text-center mt-3">{caption}</p>}
      </div>
    );
  }

  // With explicit connections - render nodes in sequence with labeled arrows
  const connectionMap = new Map<string, string>();
  connections.forEach((c) => connectionMap.set(`${c.from}-${c.to}`, c.label || ''));

  return (
    <div className="my-6 bg-bg-surface/50 border border-border rounded-2xl p-5 overflow-x-auto">
      {title && <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">{title}</h4>}
      <div className={`flex ${layout === 'vertical' ? 'flex-col items-center' : 'flex-row items-center justify-center flex-wrap'} gap-0`}>
        {nodes.map((node, i) => {
          const nextNode = nodes[i + 1];
          const connLabel = nextNode ? connectionMap.get(`${node.id}-${nextNode.id}`) : undefined;
          return (
            <div key={node.id} className={`flex ${layout === 'vertical' ? 'flex-col' : 'flex-row'} items-center`}>
              <NodeCard node={node} />
              {i < nodes.length - 1 && (
                <Arrow direction={layout === 'vertical' ? 'down' : 'right'} label={connLabel} />
              )}
            </div>
          );
        })}
      </div>
      {caption && <p className="text-[11px] text-text-muted italic text-center mt-3">{caption}</p>}
    </div>
  );
}
