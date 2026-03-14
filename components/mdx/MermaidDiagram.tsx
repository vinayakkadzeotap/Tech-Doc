'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// ---------------------------------------------------------------------------
// Load mermaid from CDN to avoid Next.js bundling issues
// ---------------------------------------------------------------------------

interface MermaidAPI {
  initialize: (config: Record<string, unknown>) => void;
  render: (id: string, text: string) => Promise<{ svg: string }>;
}

let mermaidReady: Promise<MermaidAPI> | null = null;

function loadMermaidFromCDN(): Promise<MermaidAPI> {
  if (mermaidReady) return mermaidReady;

  mermaidReady = new Promise((resolve, reject) => {
    // Check if already loaded
    if ((window as unknown as Record<string, unknown>).mermaid) {
      resolve((window as unknown as Record<string, MermaidAPI>).mermaid);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js';
    script.onload = () => {
      const m = (window as unknown as Record<string, MermaidAPI>).mermaid;
      if (!m) {
        reject(new Error('Mermaid failed to load'));
        return;
      }
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
      resolve(m);
    };
    script.onerror = () => reject(new Error('Failed to load mermaid script'));
    document.head.appendChild(script);
  });

  return mermaidReady;
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
  const mountedRef = useRef(true);

  const renderDiagram = useCallback(async () => {
    if (!chart) return;

    try {
      const m = await loadMermaidFromCDN();
      if (!mountedRef.current) return;

      const id = `mmd-${++idCounter}-${Date.now()}`;
      const result = await m.render(id, chart.trim());

      if (mountedRef.current) {
        setSvg(result.svg);
      }

      // Clean up temp element
      const el = document.getElementById(id);
      if (el) el.remove();
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'Failed to render diagram');
      }
    }
  }, [chart]);

  useEffect(() => {
    mountedRef.current = true;
    renderDiagram();
    return () => { mountedRef.current = false; };
  }, [renderDiagram]);

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
