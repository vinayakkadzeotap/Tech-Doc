/* ═══════════════════════════════════════════════════════════════
   ZEOTAP CDP — INTERACTIVE ARCHITECTURE EXPLORER
   Graph Enhancement Engine v2.0
   ═══════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    // State Management
    let isDebugMode = false;
    let isSimulating = false;
    let simTimer = null;
    let currentFocusNode = null;

    const TRACE_PATH = ['collect', 'ingest', 'identity', 'profiles', 'audiences', 'journeys', 'activation'];
    const TRACE_LABELS = [
        'Event Collected',
        'Data Ingested',
        'Identity Resolution',
        'Profile Updated',
        'Segment Recomputed',
        'Journey Triggered',
        'Data Activated'
    ];

    const FAILURE_INDICATORS = {
        'ingest': 'Schema mismatch detected',
        'identity': 'Identifier collision: unstable graph',
        'audiences': 'Rule builder: processing timeout',
        'activation': 'Destination API 500 rejection'
    };

    /**
     * INIT — Wait for Graph Engine
     */
    function init() {
        if (!window.KG) {
            setTimeout(init, 100);
            return;
        }

        injectToolbar();
        bindNodeEvents();
        console.log('[Explorer] Interactive engine active.');
    }

    /**
     * UI — Inject Single Toolbar Row
     */
    function injectToolbar() {
        const wrap = document.querySelector('.kg-shell-wrap');
        if (!wrap) return;

        // Remove any old toolbars
        const oldToolbar = document.querySelector('.kg-trace-bar') || document.querySelector('.kg-filter-bar');
        if (oldToolbar) oldToolbar.remove();

        // Create main interactive toolbar
        const toolbar = document.createElement('div');
        toolbar.className = 'graph-toolbar';
        toolbar.innerHTML = `
            <button id="btn-simulate" class="graph-btn">
                <span style="font-size:14px">▶</span> Simulate Flow
            </button>
            <button id="btn-reset" class="graph-btn">
                <span style="font-size:14px">↺</span> Reset Graph
            </button>
            <div style="width:1px; height:16px; background:var(--border-primary); margin:0 4px"></div>
            <button id="btn-debug" class="graph-btn">
                <span style="font-size:14px">🐞</span> Debug Mode
            </button>
        `;

        // Create Step Indicator
        const indicator = document.createElement('div');
        indicator.id = 'sim-indicator';
        indicator.className = 'graph-indicator';

        wrap.appendChild(toolbar);
        wrap.appendChild(indicator);

        // Bind Events
        document.getElementById('btn-simulate').onclick = startSimulation;
        document.getElementById('btn-reset').onclick = resetGraph;
        document.getElementById('btn-debug').onclick = toggleDebugMode;
    }

    /**
     * FEATURE 1 — Event Flow Simulation
     */
    function startSimulation() {
        if (isSimulating) return;
        resetGraph();
        isSimulating = true;

        const btn = document.getElementById('btn-simulate');
        const indicator = document.getElementById('sim-indicator');
        btn.classList.add('active');
        indicator.style.display = 'block';

        let visited = [];

        TRACE_PATH.forEach((nodeId, idx) => {
            setTimeout(() => {
                if (!isSimulating) return;

                visited.push(nodeId);
                window.KG.highlight(visited);

                // Update indicator
                indicator.textContent = `Step ${idx + 1} / 7 — ${TRACE_LABELS[idx]}`;

                // Final Step Handling
                if (idx === TRACE_PATH.length - 1) {
                    setTimeout(() => {
                        isSimulating = false;
                        btn.classList.remove('active');
                    }, 1500);
                }
            }, idx * 700);
        });
    }

    /**
     * FEATURE 2 — Dependency Trace & Floating Panel
     */
    function bindNodeEvents() {
        const svg = document.getElementById('knowledge-graph');
        if (!svg) return;

        // Custom click handling for nodes
        svg.addEventListener('click', (e) => {
            const nodeEl = e.target.closest('g.kg-node');
            if (!nodeEl) return;

            // Extract Node ID (abbrev mapping)
            const abbrev = nodeEl.querySelector('text').textContent.toLowerCase();
            const nodeId = mapAbbrevToId(abbrev);

            if (nodeId) {
                e.preventDefault();
                e.stopPropagation();
                handleNodeInteraction(nodeId, nodeEl);
            }
        }, true);

        // Canvas click to reset
        svg.addEventListener('click', (e) => {
            if (e.target.id === 'knowledge-graph' || e.target.tagName === 'svg') {
                resetFocus();
            }
        });
    }

    function handleNodeInteraction(nodeId, element) {
        // Single click logic
        showDependencyTrace(nodeId);
        showFloatingPanel(nodeId, element);
    }

    function mapAbbrevToId(abbrev) {
        const map = {
            'col': 'collect', 'ing': 'ingest', 'ide': 'identity', 'pro': 'profiles',
            'aud': 'audiences', 'jou': 'journeys', 'act': 'activation', 'ai/': 'ai',
            'ml ': 'ml', 'rep': 'reporting', 'uni': 'unity', 'pri': 'privacy',
            'aut': 'auth', 'inf': 'infra', 'obs': 'observe', 'cic': 'cicd', 'tes': 'testing'
        };
        return map[abbrev] || null;
    }

    function showDependencyTrace(nodeId) {
        // Need to identify connections. Since KG doesn't expose full graph,
        // we use a static mapping based on knowledge-graph.js LINKS.
        const dependencies = {
            'collect': ['ingest'],
            'ingest': ['collect', 'identity', 'profiles'],
            'identity': ['ingest', 'profiles', 'privacy'],
            'profiles': ['ingest', 'identity', 'audiences', 'ai', 'ml', 'reporting'],
            'audiences': ['profiles', 'journeys', 'activation', 'reporting', 'ai'],
            'journeys': ['audiences', 'activation'],
            'activation': ['audiences', 'journeys', 'privacy'],
            'ai': ['profiles', 'audiences'],
            'ml': ['profiles']
        };

        const related = [nodeId, ...(dependencies[nodeId] || [])];
        window.KG.highlight(related);

        // Add visual indicator of focus
        document.querySelectorAll('.kg-node').forEach(el => {
            const ab = el.querySelector('text').textContent.toLowerCase();
            const id = mapAbbrevToId(ab);
            if (id === nodeId) {
                el.style.filter = 'drop-shadow(0 0 12px var(--accent-primary))';
            } else {
                el.style.filter = '';
            }
        });
    }

    function showFloatingPanel(nodeId, element) {
        let panel = document.getElementById('floating-node-panel');
        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'floating-node-panel';
            panel.style.cssText = `
                position: fixed; background: var(--bg-surface); border: 1px solid var(--border-primary);
                padding: 16px; border-radius: 12px; z-index: 1000; width: 220px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.6); pointer-events: auto;
            `;
            document.body.appendChild(panel);
        }

        const rect = element.getBoundingClientRect();
        panel.style.left = (rect.right + 20) + 'px';
        panel.style.top = (rect.top) + 'px';
        panel.style.display = 'block';

        // Mock data
        panel.innerHTML = `
            <div style="font-weight:800; color:var(--accent-primary); margin-bottom:4px; text-transform:uppercase; font-size:11px">${nodeId}</div>
            <div style="font-size:12px; color:var(--text-secondary); margin-bottom:12px">Service Architecture Detail</div>
            
            <div style="font-size:10px; color:var(--text-muted); text-transform:uppercase; margin-bottom:4px">Connections</div>
            <div style="font-size:11px; margin-bottom:12px">
                Up/Downstream dependencies highlighted in graph.
            </div>

            <a href="01-platform-overview.html" style="display:block; text-align:center; padding:8px; background:var(--border-primary); border-radius:6px; color:var(--text-primary); font-size:11px; text-decoration:none">View Full Chapter</a>
        `;
    }

    /**
     * FEATURE 3 — Debug Mode
     */
    function toggleDebugMode() {
        isDebugMode = !isDebugMode;
        const btn = document.getElementById('btn-debug');
        btn.classList.toggle('active', isDebugMode);

        const svg = document.getElementById('knowledge-graph');
        if (!svg) return;

        // Visual highlights for nodes with issues
        document.querySelectorAll('.kg-node').forEach(el => {
            const ab = el.querySelector('text').textContent.toLowerCase();
            const id = mapAbbrevToId(ab);

            if (isDebugMode && FAILURE_INDICATORS[id]) {
                injectFailureBadge(el, id);
            } else {
                removeFailureBadge(el);
            }
        });
    }

    function injectFailureBadge(element, nodeId) {
        if (element.querySelector('.debug-badge')) return;
        const ns = "http://www.w3.org/2000/svg";
        const badge = document.createElementNS(ns, 'circle');
        badge.setAttribute('class', 'debug-badge');
        badge.setAttribute('cx', '18');
        badge.setAttribute('cy', '-18');
        badge.setAttribute('r', '5');
        badge.setAttribute('fill', 'var(--danger)');
        badge.style.filter = 'drop-shadow(0 0 4px var(--danger))';

        const title = document.createElementNS(ns, 'title');
        title.textContent = `CRITICAL: ${FAILURE_INDICATORS[nodeId]}\nTroubleshooting: Check SLO dashboard in Grafana.`;
        badge.appendChild(title);

        element.appendChild(badge);
    }

    function removeFailureBadge(el) {
        const b = el.querySelector('.debug-badge');
        if (b) b.remove();
    }

    /**
     * RESET
     */
    function resetGraph() {
        isSimulating = false;
        if (simTimer) clearTimeout(simTimer);
        window.KG.reset();
        resetFocus();

        const indicator = document.getElementById('sim-indicator');
        if (indicator) indicator.style.display = 'none';

        const simBtn = document.getElementById('btn-simulate');
        if (simBtn) simBtn.classList.remove('active');
    }

    function resetFocus() {
        const panel = document.getElementById('floating-node-panel');
        if (panel) panel.style.display = 'none';

        document.querySelectorAll('.kg-node').forEach(el => {
            el.style.filter = '';
        });

        if (window.KG) window.KG.reset();
    }

    // Run
    document.addEventListener('DOMContentLoaded', init);

})();
