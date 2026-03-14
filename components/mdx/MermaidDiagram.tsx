'use client';

import { useEffect, useRef, useState } from 'react';

// ---------------------------------------------------------------------------
// Module-level singleton: initialize mermaid once, serialize all renders
// ---------------------------------------------------------------------------

let mermaidInstance: typeof import('mermaid').default | null = null;
let initPromise: Promise<void> | null = null;
let renderCounter = 0;

// Promise chain ensures renders happen one at a time (mermaid uses global state)
let renderChain: Promise<void> = Promise.resolve();

async function getMermaid() {
  if (mermaidInstance) return mermaidInstance;
  if (!initPromise) {
    initPromise = (async () => {
      const m = (await import('mermaid')).default;
      m.initialize({
        startOnLoad: false,
        theme: 'dark',
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
          actorTextColor: '#e2e8f0',
          actorBorder: '#3b82f6',
          actorBkg: '#1e293b',
          signalColor: '#64748b',
          labelBoxBkgColor: '#1e293b',
          labelBoxBorderColor: '#334155',
          labelTextColor: '#e2e8f0',
          loopTextColor: '#94a3b8',
          noteBkgColor: '#1e293b',
          noteBorderColor: '#3b82f6',
          noteTextColor: '#e2e8f0',
          sectionBkgColor: '#1e293b',
          sectionBkgColor2: '#0f172a',
          altSectionBkgColor: '#0f172a',
          taskBkgColor: '#2563eb',
          taskTextColor: '#e2e8f0',
          taskBorderColor: '#3b82f6',
          doneTaskBkgColor: '#10b981',
          activeTaskBkgColor: '#f59e0b',
          gridColor: '#334155',
          todayLineColor: '#f59e0b',
        },
        flowchart: { curve: 'basis', padding: 15 },
        sequence: { useMaxWidth: true },
        fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif',
        fontSize: 13,
        securityLevel: 'loose',
      });
      mermaidInstance = m;
    })();
  }
  await initPromise;
  return mermaidInstance!;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface MermaidDiagramProps {
  chart: string;
  title?: string;
  caption?: string;
}

export default function MermaidDiagram({ chart, title, caption }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (!chart) return;

    let cancelled = false;
    const uniqueId = `mermaid-${++renderCounter}-${Date.now()}`;

    // Timeout: if render takes >10s, show fallback
    const timer = setTimeout(() => {
      if (!cancelled) setTimedOut(true);
    }, 10000);

    // Chain this render after any in-progress render
    renderChain = renderChain
      .then(async () => {
        if (cancelled) return;
        const mermaid = await getMermaid();
        const { svg: rendered } = await mermaid.render(uniqueId, chart.trim());
        if (!cancelled) {
          setSvg(rendered);
          setError('');
          clearTimeout(timer);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to render diagram');
          clearTimeout(timer);
        }
      })
      .finally(() => {
        // Clean up temp element mermaid may leave behind
        const tempEl = document.getElementById(uniqueId);
        if (tempEl) tempEl.remove();
      });

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [chart]);

  if (error) {
    return (
      <div className="my-6 bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
        <p className="text-xs text-red-400 font-mono">Diagram error: {error}</p>
        <pre className="text-xs text-text-muted mt-2 overflow-x-auto whitespace-pre-wrap">{chart}</pre>
      </div>
    );
  }

  if (timedOut && !svg) {
    return (
      <div className="my-6 bg-bg-surface/50 border border-border rounded-2xl overflow-hidden">
        {title && (
          <div className="px-5 pt-4 pb-2">
            <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider">{title}</h4>
          </div>
        )}
        <pre className="px-5 pb-4 text-xs text-text-muted overflow-x-auto whitespace-pre-wrap">{chart.trim()}</pre>
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
        ref={containerRef}
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
