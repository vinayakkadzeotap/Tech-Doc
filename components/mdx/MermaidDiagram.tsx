'use client';

import { useEffect, useRef, useState } from 'react';

// ---------------------------------------------------------------------------
// Module-level singleton: initialize mermaid exactly once
// ---------------------------------------------------------------------------

let initDone = false;
let initPromise: Promise<typeof import('mermaid').default> | null = null;

function loadMermaid() {
  if (!initPromise) {
    initPromise = import('mermaid').then((mod) => {
      const m = mod.default;
      if (!initDone) {
        m.initialize({
          startOnLoad: false,
          theme: 'dark',
          securityLevel: 'loose',
          themeVariables: {
            primaryColor: '#2563eb',
            primaryTextColor: '#e2e8f0',
            primaryBorderColor: '#3b82f6',
            lineColor: '#64748b',
            secondaryColor: '#1e293b',
            tertiaryColor: '#0f172a',
            background: '#0f172a',
            mainBkg: '#1e293b',
            nodeBorder: '#3b82f6',
            clusterBkg: '#1e293b',
            clusterBorder: '#334155',
            titleColor: '#e2e8f0',
            edgeLabelBackground: '#1e293b',
            nodeTextColor: '#e2e8f0',
          },
          flowchart: { curve: 'basis', padding: 15 },
          sequence: { useMaxWidth: true },
          fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif',
          fontSize: 13,
        });
        initDone = true;
      }
      return m;
    });
  }
  return initPromise;
}

// ---------------------------------------------------------------------------
// Component — uses mermaid.run() with a real DOM node
// ---------------------------------------------------------------------------

interface MermaidDiagramProps {
  chart: string;
  title?: string;
  caption?: string;
}

export default function MermaidDiagram({ chart, title, caption }: MermaidDiagramProps) {
  const codeRef = useRef<HTMLPreElement>(null);
  const [rendered, setRendered] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!chart || !codeRef.current) return;

    let cancelled = false;
    const node = codeRef.current;

    // Reset: put the raw chart text back in the node
    node.textContent = chart.trim();
    node.removeAttribute('data-processed');
    setRendered(false);
    setError('');

    loadMermaid()
      .then((mermaid) => {
        if (cancelled || !node.isConnected) return;
        // mermaid.run() transforms the DOM node in-place: replaces text with SVG
        return mermaid.run({ nodes: [node] });
      })
      .then(() => {
        if (!cancelled) setRendered(true);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Diagram render failed');
        }
      });

    return () => { cancelled = true; };
  }, [chart]);

  if (error) {
    return (
      <div className="my-6 bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
        <p className="text-xs text-red-400 font-mono">Diagram error: {error}</p>
        <pre className="text-xs text-text-muted mt-2 overflow-x-auto whitespace-pre-wrap">{chart}</pre>
      </div>
    );
  }

  return (
    <div className="my-6 bg-bg-surface/50 border border-border rounded-2xl overflow-hidden">
      {title && (
        <div className="px-5 pt-4 pb-0">
          <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider">{title}</h4>
        </div>
      )}
      <div className="p-4 overflow-x-auto flex justify-center [&_svg]:max-w-full">
        <pre
          ref={codeRef}
          className="mermaid"
          style={{ visibility: rendered ? 'visible' : 'hidden', position: rendered ? 'relative' : 'absolute' }}
        >
          {chart.trim()}
        </pre>
        {!rendered && !error && (
          <div className="flex flex-col items-center justify-center gap-3 py-4">
            <div className="w-6 h-6 border-2 border-brand-blue/30 border-t-brand-blue rounded-full animate-spin" />
            <p className="text-xs text-text-muted">Rendering diagram...</p>
          </div>
        )}
      </div>
      {caption && rendered && (
        <div className="px-5 pb-4 pt-0">
          <p className="text-[11px] text-text-muted italic text-center">{caption}</p>
        </div>
      )}
    </div>
  );
}
