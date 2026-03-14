'use client';

import { useEffect, useState } from 'react';

// ---------------------------------------------------------------------------
// Singleton: load and initialize mermaid exactly once
// ---------------------------------------------------------------------------

let mermaid: typeof import('mermaid').default | null = null;
let loading: Promise<void> | null = null;

function ensureMermaid(): Promise<void> {
  if (mermaid) return Promise.resolve();
  if (!loading) {
    loading = import('mermaid').then((mod) => {
      mermaid = mod.default;
      mermaid.initialize({
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
    });
  }
  return loading;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

let idCounter = 0;

interface MermaidDiagramProps {
  chart: string;
  title?: string;
  caption?: string;
}

export default function MermaidDiagram({ chart, title, caption }: MermaidDiagramProps) {
  const [svg, setSvg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!chart) return;

    let cancelled = false;
    const id = `m${++idCounter}${Date.now()}`;

    // Timeout: abort after 8 seconds
    const timer = setTimeout(() => {
      if (!cancelled && !svg) {
        setError('Diagram took too long to render');
      }
    }, 8000);

    ensureMermaid()
      .then(() => {
        if (cancelled) return;
        // Create an offscreen container for mermaid to render into
        const container = document.createElement('div');
        container.id = id;
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        document.body.appendChild(container);

        return mermaid!.render(id, chart.trim()).finally(() => {
          // Always clean up the container
          container.remove();
          const leftover = document.getElementById(id);
          if (leftover) leftover.remove();
        });
      })
      .then((result) => {
        if (!cancelled && result) {
          setSvg(result.svg);
          clearTimeout(timer);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to render diagram');
          clearTimeout(timer);
        }
      });

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [chart]); // eslint-disable-line react-hooks/exhaustive-deps

  if (error) {
    return (
      <div className="my-6 bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
        <p className="text-xs text-red-400 font-mono">Diagram error: {error}</p>
        <pre className="text-xs text-text-muted mt-2 overflow-x-auto whitespace-pre-wrap">{chart}</pre>
      </div>
    );
  }

  if (!svg) {
    return (
      <div className="my-6 bg-bg-surface/50 border border-border rounded-2xl overflow-hidden">
        {title && (
          <div className="px-5 pt-4 pb-0">
            <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider">{title}</h4>
          </div>
        )}
        <div className="p-8 flex flex-col items-center justify-center gap-3">
          <div className="w-6 h-6 border-2 border-brand-blue/30 border-t-brand-blue rounded-full animate-spin" />
          <p className="text-xs text-text-muted">Rendering diagram...</p>
        </div>
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
      <div
        className="p-4 overflow-x-auto flex justify-center [&_svg]:max-w-full"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      {caption && (
        <div className="px-5 pb-4 pt-0">
          <p className="text-[11px] text-text-muted italic text-center">{caption}</p>
        </div>
      )}
    </div>
  );
}
