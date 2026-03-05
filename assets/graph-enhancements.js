/* ═══════════════════════════════════════════════════════════════
   ZEOTAP CDP — GRAPH ENHANCEMENTS  v1
   Additive interactivity on top of knowledge-graph.js
   Features:
     1. Category Filter Pills
     2. Trace Event Path / Reset
     3. Tooltip Fix + Tech Pills
     4. Node Click → Scroll to Module Card
     5. Module Label Clarity (service name sub-label)
   ═══════════════════════════════════════════════════════════════ */
(function () {
    'use strict';

    /* ── CATEGORY CONFIG (mirrors knowledge-graph.js CATEGORY) ── */
    var CATEGORY_META = {
        ingestion: { color: '#06b6d4', label: 'Ingestion' },
        core: { color: '#3b82f6', label: 'Core' },
        storage: { color: '#8b5cf6', label: 'Storage' },
        activation: { color: '#f59e0b', label: 'Activation' },
        intelligence: { color: '#10b981', label: 'Intelligence' },
        analytics: { color: '#ec4899', label: 'Analytics' },
        compliance: { color: '#f97316', label: 'Compliance' },
        security: { color: '#ef4444', label: 'Security' },
        platform: { color: '#64748b', label: 'Platform' },
    };

    /* ── NODE DATA (mirrors knowledge-graph.js NODES for enrichment) ── */
    var NODE_META = {
        collect: { category: 'ingestion', service: 'analytics-sdk', desc: 'Tracks events from web, mobile, CRM, and server-side sources via JS/TS SDK, iOS/Android, GTM, and SmartPixel.', tech: ['JS/TS', 'Swift', 'Kotlin', 'GTM'] },
        ingest: { category: 'ingestion', service: 'daap-pipeline', desc: 'Real-time Pub/Sub streams + batch GCS→BigQuery ETL via Apache Beam, CDAP, and Spark on GKE.', tech: ['Java', 'Scala', 'Beam', 'CDAP'] },
        identity: { category: 'core', service: 'id-graph-lib-v2', desc: 'Resolves cookies, device IDs, emails, phones → UCID. Stored in BigTable + Redis with PGP-encrypted PII.', tech: ['Go 1.24', 'BigTable', 'Redis'] },
        profiles: { category: 'storage', service: 'delta-lake', desc: 'ACID transactions, schema evolution, time-travel queries. Petabyte-scale unified customer profiles.', tech: ['Scala', 'Delta Lake', 'GCS'] },
        audiences: { category: 'activation', service: 'segment-engine', desc: 'Real-time segment evaluation engine. Boolean + SQL rule builder. Streaming membership via Pub/Sub.', tech: ['Scala', 'BigQuery', 'Pub/Sub'] },
        journeys: { category: 'activation', service: 'journey-executor', desc: 'Multi-step orchestration with event triggers, time delays, A/B splits, and frequency caps.', tech: ['Java', 'Kafka', 'Redis'] },
        activation: { category: 'activation', service: 'connector-hub', desc: '100+ destination connectors — DSPs, CRMs, email, push, webhooks. Consent-enforced at dispatch.', tech: ['Java', 'REST', 'gRPC'] },
        ai: { category: 'intelligence', service: 'zoe-inference', desc: 'GenAI layer using Google Gemini. Natural-language segmentation, autonomous journey building, MCP protocol.', tech: ['Python', 'Gemini', 'FastAPI'] },
        ml: { category: 'intelligence', service: 'vertex-ml', desc: 'Vertex AI training pipelines. Churn/LTV/propensity models. Real-time prediction serving via REST.', tech: ['Python', 'Vertex AI', 'TFX'] },
        reporting: { category: 'analytics', service: 'reporting-service', desc: 'BigQuery OLAP engine, Druid for real-time metrics. Powers Unity Dashboard and third-party BI connectors.', tech: ['BigQuery', 'Druid', 'Redshift'] },
        unity: { category: 'analytics', service: 'unity-dashboard', desc: 'React + TypeScript SPA. Unified UI for segment building, journey design, destination management.', tech: ['React', 'TypeScript', 'GraphQL'] },
        privacy: { category: 'compliance', service: 'consent-manager', desc: 'GDPR Art.17 erasure pipelines (7-10 day SLA), consent management, data residency controls.', tech: ['Java', 'Postgres', 'Delta Lake'] },
        auth: { category: 'security', service: 'auth-service', desc: 'OAuth 2.0 + PKCE, SAML SSO (Okta/Azure AD), RBAC with org hierarchy, JWT lifecycle, API key rotation.', tech: ['Keycloak', 'JWT', 'SAML'] },
        infra: { category: 'platform', service: 'gke-infra', desc: 'GKE multi-tenant clusters, Terraform IaC, Helm 3 charts, Cloudflare WAF, multi-region GCP + AWS failover.', tech: ['GKE', 'Terraform', 'Helm 3'] },
        observe: { category: 'platform', service: 'observability-stack', desc: 'Prometheus + Grafana, Cloud Trace, OpenTelemetry collector, Alertmanager PagerDuty routing.', tech: ['Prometheus', 'Grafana', 'OTel'] },
        cicd: { category: 'platform', service: 'harness-pipelines', desc: 'Harness pipelines, GitHub Actions for PR validation, progressive blue/green deploys, auto rollback on SLO breach.', tech: ['Harness', 'GitHub', 'Docker'] },
        testing: { category: 'platform', service: 'qa-platform', desc: 'JUnit/Mockito unit tests, WireMock contract tests, Playwright E2E, k6 load testing, Chaos Monkey.', tech: ['JUnit', 'k6', 'Playwright'] },
    };

    /* ── PHASE 3 FEATURES STATE ── */
    var isDebugModeActive = false;
    var isHealthModeActive = false;
    var currentFocusNode = null;
    var currentSimIdx = -1;
    var simTimer = null;

    /* ── FAILURE & HEALTH DATA ── */
    var FAILURE_SCENARIOS = {
        ingest: 'Kafka lag: 450ms partition delay',
        audiences: 'Segment timeout: Boolean rule recursion limit',
        activation: 'API rejection: upstream 503 Service Unavailable',
        identity: 'Storage bottleneck: BigQuery quota exceeded'
    };

    var HEALTH_DATA = {
        collect: { status: 'green', p99: '45ms', err: '0.01%' },
        ingest: { status: 'amber', p99: '450ms', err: '0.2%' },
        identity: { status: 'green', p99: '120ms', err: '0.02%' },
        profiles: { status: 'green', p99: '80ms', err: '0.01%' },
        audiences: { status: 'red', p99: '2400ms', err: '1.4%' },
        journeys: { status: 'green', p99: '110ms', err: '0.05%' },
        activation: { status: 'amber', p99: '850ms', err: '0.8%' }
    };

    /* Keyword mappings for Feature 4 */
    var QUERY_MAP = {
        segmentation: ['profiles', 'audiences', 'journeys'],
        identity: ['collect', 'ingest', 'identity'],
        marketing: ['audiences', 'journeys', 'activation'],
        infra: ['infra', 'observe', 'cicd', 'testing']
    };

    /* ── NODE → MODULE CARD MAPPING ─────────────────────────────
       Maps graph node id to the data-node attribute on .ds-mod-card.
       The HTML will get data-node attributes added (see index.html edit). */
    var NODE_TO_CARD = {
        collect: 'collect',
        ingest: 'collect',   /* data ingestion → data collection card */
        identity: 'identity',
        profiles: 'profiles',
        audiences: 'audiences',
        journeys: 'journeys',
        activation: 'activation',
        ai: 'ai',
        ml: 'ai',
        reporting: 'reporting',
        unity: 'unity',
        privacy: 'privacy',
        auth: 'auth',
    };

    /* ── CDP EVENT PIPELINE PATH ─────────────────────────────── */
    var TRACE_PATH = ['collect', 'ingest', 'identity', 'profiles', 'audiences', 'journeys', 'activation'];
    var TRACE_LABELS = ['Event Collection', 'Streaming Ingest', 'Identity Resolution', 'Profile Store', 'Segmentation', 'Journey Orchestrator', 'Activation'];

    var activeFilters = new Set(Object.keys(CATEGORY_META));

    /* ─────────────────────────────────────────────────────────────
       FEATURE 3 — TOOLTIP FIX
       The tooltip HTML uses id-based selectors but knowledge-graph.js
       queries by class. We rebuild the tooltip content with correct classes.
    ───────────────────────────────────────────────────────────── */
    function fixTooltip() {
        var tt = document.getElementById('graph-tooltip');
        if (!tt) return;
        /* Replace inner HTML to match what knowledge-graph.js expects */
        tt.innerHTML =
            '<div class="ds-tt-title kg-tip-title"></div>' +
            '<div class="ds-tt-cat kg-tip-badge"></div>' +
            '<div class="ds-tt-desc kg-tip-desc" style="font-size:11.5px;line-height:1.55;color:rgba(220,232,255,0.65);margin-bottom:8px;"></div>' +
            '<div class="kg-tip-health" style="margin-bottom:8px; display:none;"></div>' +
            '<div class="kg-tip-failures" style="margin-bottom:8px; border-top:1px solid rgba(255,255,255,0.1); padding-top:8px; display:none;"></div>' +
            '<div class="ds-tt-tech kg-tip-tech"></div>' +
            '<div class="kg-tip-hint">Click to focus dependencies · Dbl-click for chapter →</div>';
    }

    var originalTooltipUpdate = null;
    function patchTooltipContent() {
        var tt = document.getElementById('graph-tooltip');
        if (!tt) return;

        /* Observe changes to the tooltip title to trigger our enrichment */
        var observer = new MutationObserver(function () {
            var title = tt.querySelector('.kg-tip-title').textContent.toLowerCase().replace(/\s/g, '');
            var nodeId = null;
            Object.keys(NODE_META).forEach(id => { if (id.substring(0, 3) === title.substring(0, 3)) nodeId = id; });
            if (!nodeId) return;

            /* Health Metrics */
            var healthBox = tt.querySelector('.kg-tip-health');
            if (isHealthModeActive && HEALTH_DATA[nodeId]) {
                var h = HEALTH_DATA[nodeId];
                healthBox.style.display = 'block';
                healthBox.style.color = h.status === 'red' ? '#ef4444' : (h.status === 'amber' ? '#f59e0b' : '#10b981');
                healthBox.innerHTML = `<strong>Performance:</strong> p99 ${h.p99} | error ${h.err}`;
            } else { healthBox.style.display = 'none'; }

            /* Failures */
            var failBox = tt.querySelector('.kg-tip-failures');
            if (isDebugModeActive && FAILURE_SCENARIOS[nodeId]) {
                failBox.style.display = 'block';
                failBox.innerHTML = `<span style="color:#ef4444; font-weight:700;">⚠ Known Failure Scenarios</span><br/><span style="font-size:11px; opacity:0.8;">• ${FAILURE_SCENARIOS[nodeId]}</span>`;
            } else { failBox.style.display = 'none'; }
        });

        observer.observe(tt.querySelector('.kg-tip-title'), { childList: true });
    }

    /* ─────────────────────────────────────────────────────────────
       INJECT TOOLBAR UI (FILTERS + QUICKS + ADVANCED)
    ───────────────────────────────────────────────────────────── */
    function injectToolbarRows() {
        var shellWrap = document.querySelector('.kg-shell-wrap');
        if (!shellWrap) return;

        /* Advanced Options & Quick Views Grouped into a Dropdown for Density */
        var toolsRow = document.createElement('div');
        toolsRow.className = 'kg-trace-bar';
        toolsRow.style.paddingTop = '14px';
        toolsRow.innerHTML =
            '<div class="kg-tools-dropdown-wrap">' +
            '  <button id="kg-tools-toggle" class="kg-trace-btn" style="border-radius:20px; padding:6px 16px; background:rgba(255,255,255,0.05)">' +
            '    <span style="font-size:14px; margin-right:6px">⚙️</span> Graph Tools' +
            '  </button>' +
            '  <div id="kg-tools-dropdown" class="kg-tools-dropdown">' +
            '    <div class="kg-tool-group">' +
            '      <span class="kg-tool-group-label" style="font-size:9px; color:rgba(255,255,255,0.3); margin-bottom:4px; text-transform:uppercase; letter-spacing:0.05em">Advanced Controls</span>' +
            '      <div class="ds-mode-switcher" style="margin-bottom:8px">' +
            '        <button id="kg-layout-force" class="ds-mode-btn active">Force</button>' +
            '        <button id="kg-layout-layer" class="ds-mode-btn">Layer</button>' +
            '      </div>' +
            '      <button id="kg-flow-btn" class="kg-trace-btn" style="justify-content:flex-start">Show Data Flow</button>' +
            '      <button id="kg-debug-toggle" class="kg-trace-btn" style="justify-content:flex-start">Debug Mode</button>' +
            '      <button id="kg-health-toggle" class="kg-trace-btn" style="justify-content:flex-start">System Health</button>' +
            '    </div>' +
            '    <div style="height:1px; background:rgba(255,255,255,0.08); margin:8px 0"></div>' +
            '    <div class="kg-tool-group">' +
            '      <span class="kg-tool-group-label" style="font-size:9px; color:rgba(255,255,255,0.3); margin-bottom:4px; text-transform:uppercase; letter-spacing:0.05em">Visibility & Simulation</span>' +
            '      <button id="kg-sim-btn" class="kg-trace-btn" style="justify-content:flex-start">▶ Simulate Pipeline</button>' +
            '      <button id="kg-expand-labels" class="kg-trace-btn" style="justify-content:flex-start">🔍 Expand Full Labels</button>' +
            '    </div>' +
            '  </div>' +
            '</div>' +
            '<div style="width:1px; height:18px; background:rgba(255,255,255,0.1); margin:0 8px;"></div>' +
            '<button id="kg-trace-btn" class="kg-trace-btn" title="Highlight the typical CDP event pipeline">' +
            '  <span style="margin-right:5px;">⚡</span>Trace Path' +
            '</button>' +
            '<button id="kg-reset-graph-btn" class="kg-trace-btn kg-reset-btn-alt" title="Reset all highlights and filters">' +
            '  ↺ Reset' +
            '</button>';

        /* Filter bar */
        var filterBar = document.createElement('div');
        filterBar.className = 'kg-filter-bar';
        filterBar.id = 'kg-filter-bar';

        var allPill = document.createElement('button');
        allPill.className = 'kg-filter-pill active';
        allPill.dataset.cat = 'all';
        allPill.textContent = 'All';
        filterBar.appendChild(allPill);

        Object.keys(CATEGORY_META).forEach(function (cat) {
            var pill = document.createElement('button');
            pill.className = 'kg-filter-pill active';
            pill.dataset.cat = cat;
            pill.style.setProperty('--pill-color', CATEGORY_META[cat].color);
            pill.textContent = CATEGORY_META[cat].label;
            filterBar.appendChild(pill);
        });

        /* Insert above the SVG, after the existing toolbar */
        var toolbar = shellWrap.querySelector('.kg-toolbar');
        if (toolbar) {
            toolbar.insertAdjacentElement('afterend', toolsRow);
            toolsRow.insertAdjacentElement('afterend', filterBar);
        } else {
            shellWrap.insertBefore(filterBar, shellWrap.firstChild);
            shellWrap.insertBefore(toolsRow, shellWrap.firstChild);
        }

        /* Bind Dropdown Toggle */
        var toolsDropdown = document.getElementById('kg-tools-dropdown');
        var toolsToggle = document.getElementById('kg-tools-toggle');
        if (toolsToggle && toolsDropdown) {
            toolsToggle.addEventListener('click', function (e) {
                e.stopPropagation();
                toolsDropdown.classList.toggle('open');
            });
            document.addEventListener('click', function () {
                toolsDropdown.classList.remove('open');
            });
            toolsDropdown.addEventListener('click', function (e) { e.stopPropagation(); });
        }
    }

    /* ─────────────────────────────────────────────────────────────
       FEATURE 1 — CATEGORY FILTER LOGIC
    ───────────────────────────────────────────────────────────── */
    function bindFilterPills() {
        var bar = document.getElementById('kg-filter-bar');
        if (!bar) return;

        bar.addEventListener('click', function (e) {
            var pill = e.target.closest('.kg-filter-pill');
            if (!pill) return;

            var cat = pill.dataset.cat;

            if (cat === 'all') {
                /* Reset all filters ON */
                activeFilters = new Set(Object.keys(CATEGORY_META));
                bar.querySelectorAll('.kg-filter-pill').forEach(function (p) { p.classList.add('active'); });
            } else {
                /* Toggle this category */
                if (activeFilters.has(cat)) {
                    activeFilters.delete(cat);
                    pill.classList.remove('active');
                } else {
                    activeFilters.add(cat);
                    pill.classList.add('active');
                }
                /* Sync "All" pill state */
                var allPill = bar.querySelector('[data-cat="all"]');
                if (allPill) {
                    allPill.classList.toggle('active', activeFilters.size === Object.keys(CATEGORY_META).length);
                }
            }

            applyFilters();
        });
    }

    function applyFilters() {
        if (!window.KG) return;
        if (activeFilters.size === 0 || activeFilters.size === Object.keys(CATEGORY_META).length) {
            window.KG.reset();
            return;
        }

        /* Use KG.filterCategories if available, else call highlight with matching ids */
        var visibleIds = Object.keys(NODE_META).filter(function (id) {
            return activeFilters.has(NODE_META[id].category);
        });

        if (window.KG.filterCategories) {
            window.KG.filterCategories(activeFilters);
        } else {
            window.KG.highlight(visibleIds);
        }
    }

    /* ─────────────────────────────────────────────────────────────
       FEATURE 2 — TRACE EVENT PATH
    ───────────────────────────────────────────────────────────── */
    function bindTracePath() {
        var traceBtn = document.getElementById('kg-trace-btn');
        var resetBtn = document.getElementById('kg-reset-graph-btn');

        if (traceBtn) {
            traceBtn.addEventListener('click', function () {
                if (!window.KG) return;

                /* Step 1: highlight all path nodes immediately */
                window.KG.highlight(TRACE_PATH);

                /* Step 2: animate sequentially with a pulse on each node */
                TRACE_PATH.forEach(function (id, idx) {
                    setTimeout(function () {
                        /* Flash a brief toast label */
                        showTraceStep(TRACE_LABELS[idx], idx + 1, TRACE_PATH.length);
                        /* Pulse the node SVG circle */
                        pulseNode(id);
                    }, idx * 420);
                });

                traceBtn.classList.add('active');
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', function () {
                if (!window.KG) return;
                window.KG.reset();
                if (traceBtn) traceBtn.classList.remove('active');
                clearTraceToast();

                /* Reset Phase 3 States */
                isDebugModeActive = false;
                isHealthModeActive = false;
                resetFocusMode();
                document.getElementById('kg-debug-toggle').classList.remove('active');
                document.getElementById('kg-health-toggle').classList.remove('active');
                updateGraphStates();

                /* Re-apply any active filters */
                activeFilters = new Set(Object.keys(CATEGORY_META));
                var bar = document.getElementById('kg-filter-bar');
                if (bar) bar.querySelectorAll('.kg-filter-pill').forEach(function (p) { p.classList.add('active'); });
            });
        }
    }

    var traceToast = null;
    function showTraceStep(label, step, total) {
        if (!traceToast) {
            traceToast = document.createElement('div');
            traceToast.id = 'kg-trace-toast';
            traceToast.style.cssText = [
                'position:absolute', 'bottom:14px', 'left:50%', 'transform:translateX(-50%)',
                'background:rgba(9,15,26,0.9)', 'border:1px solid rgba(6,182,212,0.4)',
                'border-radius:10px', 'padding:8px 18px', 'color:#06b6d4',
                'font-size:12px', 'font-weight:700', 'font-family:JetBrains Mono,monospace',
                'pointer-events:none', 'z-index:100', 'transition:opacity 0.2s',
                'white-space:nowrap'
            ].join(';');
            var wrap = document.querySelector('.kg-shell-wrap');
            if (wrap) wrap.style.position = 'relative', wrap.appendChild(traceToast);
        }
        traceToast.style.opacity = '1';
        traceToast.textContent = step + ' / ' + total + '  →  ' + label;
    }
    function clearTraceToast() {
        if (traceToast) { traceToast.style.opacity = '0'; }
    }

    function pulseNode(nodeId) {
        var svg = document.getElementById('knowledge-graph');
        if (!svg) return;
        var abbrev = nodeId.substring(0, 3).toUpperCase();
        var texts = svg.querySelectorAll('g.kg-node text');
        texts.forEach(function (txt) {
            if (txt.textContent === abbrev && txt.getAttribute('dy') === '0.35em') {
                var g = txt.closest('g.kg-node');
                if (!g) return;
                var circle = g.querySelector('.kg-node-circle');
                if (!circle) return;
                var origStroke = circle.getAttribute('stroke-width');
                circle.setAttribute('stroke-width', '4');
                circle.style.transition = 'stroke-width 0.3s';
                setTimeout(function () {
                    circle.setAttribute('stroke-width', origStroke || '1.5');
                }, 600);
            }
        });
    }

    /* ─────────────────────────────────────────────────────────────
       FEATURE 4 — ARCHITECTURE DEEP DIVE PANEL
    ───────────────────────────────────────────────────────────── */
    function bindNodeClickPanel() {
        var svg = document.getElementById('knowledge-graph');
        if (!svg) return;

        svg.addEventListener('click', function (e) {
            var g = e.target.closest('g.kg-node');
            if (!g) return;

            var abbrevEl = null;
            g.querySelectorAll('text').forEach(function (t) {
                if (t.textContent.length <= 3 && t.textContent === t.textContent.toUpperCase() && t.getAttribute('dy') === '0.35em') {
                    abbrevEl = t;
                }
            });
            if (!abbrevEl) return;

            var abbrev = abbrevEl.textContent.toLowerCase();
            var nodeId = null;
            Object.keys(NODE_META).forEach(function (id) {
                if (id.substring(0, 3) === abbrev) nodeId = id;
            });
            if (!nodeId) return;

            e.stopImmediatePropagation();
            e.preventDefault();

            openNodePanel(nodeId);
            toggleDependencyFocus(nodeId);

        }, true);

        /* Handle canvas-click to reset focus */
        svg.addEventListener('click', function (e) {
            if (e.target.id === 'knowledge-graph' || e.target.tagName === 'svg') {
                resetFocusMode();
            }
        });
    }

    function toggleDependencyFocus(nodeId) {
        if (!window.KG || !window.NODES || !window.LINKS) return;
        currentFocusNode = nodeId;

        var relatedIds = new Set();
        relatedIds.add(nodeId);

        window.LINKS.forEach(function (l) {
            var src = (l.source.id || l.source);
            var tgt = (l.target.id || l.target);
            if (src === nodeId) relatedIds.add(tgt);
            if (tgt === nodeId) relatedIds.add(src);
        });

        var svg = document.getElementById('knowledge-graph');
        if (!svg) return;

        svg.querySelectorAll('g.kg-node').forEach(function (g) {
            var gId = null;
            g.querySelectorAll('text').forEach(t => {
                if (t.textContent.length <= 3 && t.textContent === t.textContent.toUpperCase() && t.getAttribute('dy') === '0.35em') {
                    var ab = t.textContent.toLowerCase();
                    Object.keys(NODE_META).forEach(id => { if (id.substring(0, 3) === ab) gId = id; });
                }
            });

            if (relatedIds.has(gId)) {
                g.classList.remove('faded');
                g.classList.add('focus-active');
            } else {
                g.classList.add('faded');
                g.classList.remove('focus-active');
            }
        });

        svg.querySelectorAll('.kg-link').forEach(function (l) {
            /* D3 links in DOM usually don't have IDs, we check if they connect two focus nodes */
            l.classList.add('faded');
        });
    }

    function resetFocusMode() {
        currentFocusNode = null;
        var svg = document.getElementById('knowledge-graph');
        if (!svg) return;
        svg.querySelectorAll('g.kg-node, .kg-link').forEach(el => {
            el.classList.remove('faded', 'focus-active');
        });
    }

    function openNodePanel(nodeId) {
        var meta = NODE_META[nodeId];
        if (!meta) return;

        var panel = document.getElementById('kg-side-panel');
        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'kg-side-panel';
            panel.className = 'kg-side-panel';
            document.body.appendChild(panel);
        }

        /* Calculate Inputs and Outputs from existing SVG link data */
        var svg = document.getElementById('knowledge-graph');
        var inputs = [];
        var outputs = [];
        if (svg) {
            svg.querySelectorAll('.kg-labels text').forEach(function (txt) {
                /* Existent SVG doesn't expose source/target explicitly in DOM 
                   We calculate from known links or simulate */
            });
            /* Instead of reverse engineering D3 DOM, use static mapping for safety context */
            /* In a real app we'd export LINKS. */
        }

        /* Simulated I/O specifically requested for demo */
        inputs = (nodeId === 'identity') ? [{ label: 'IDs', from: 'Data Ingestion' }] :
            (nodeId === 'profiles') ? [{ label: 'UCID', from: 'Identity Graph' }, { label: 'scores', from: 'ML Platform' }] :
                (nodeId === 'activation') ? [{ label: 'cohorts', from: 'Audiences' }, { label: 'triggers', from: 'Journeys' }] :
                    [{ label: 'event batch', from: 'upstream stream' }];

        outputs = (nodeId === 'identity') ? [{ label: 'UCID', to: 'Profile Store' }] :
            (nodeId === 'profiles') ? [{ label: 'traits', to: 'Audiences' }, { label: 'context', to: 'AI / Zoe' }] :
                [{ label: 'JSON payload', to: 'downstream system' }];

        /* Build HTML */
        var techHtml = meta.tech.map(t => `<span class="ds-tag">${t}</span>`).join('');

        var ioHtml = '';
        if (inputs.length) {
            ioHtml += `<div class="kg-sp-label">Inputs</div><div class="kg-sp-io-list" style="margin-bottom:12px">`;
            inputs.forEach(i => ioHtml += `<div class="kg-sp-io-item"><span class="kg-sp-io-dir in">IN</span> <span>${i.label} &larr; <span style="opacity:0.6">${i.from}</span></span></div>`);
            ioHtml += `</div>`;
        }
        if (outputs.length) {
            ioHtml += `<div class="kg-sp-label">Outputs</div><div class="kg-sp-io-list">`;
            outputs.forEach(o => ioHtml += `<div class="kg-sp-io-item"><span class="kg-sp-io-dir out">OUT</span> <span>${o.label} &rarr; <span style="opacity:0.6">${o.to}</span></span></div>`);
            ioHtml += `</div>`;
        }

        panel.innerHTML = `
            <div class="kg-sp-header">
                <div>
                    <div class="kg-sp-title">${meta.label || nodeId.toUpperCase()}</div>
                    <div class="kg-sp-svc">Service: ${meta.service}</div>
                </div>
                <button class="kg-sp-close" onclick="document.getElementById('kg-side-panel').classList.remove('open')">✕</button>
            </div>
            
            <div class="kg-sp-section">
                <div class="kg-sp-label">Description</div>
                <div class="kg-sp-desc">${meta.desc}</div>
            </div>
            
            <div class="kg-sp-section">
                <div class="kg-sp-label">Technology Stack</div>
                <div class="kg-sp-tech">${techHtml}</div>
            </div>
            
            <div class="kg-sp-section" style="margin-top:auto">
                ${ioHtml}
            </div>
        `;

        /* Small delay to allow CSS transition */
        setTimeout(() => panel.classList.add('open'), 50);
    }

    /* ─────────────────────────────────────────────────────────────
       FEATURE 5 — SERVICE NAME SUB-LABEL
       Adds a second line of text below each node label.
    ───────────────────────────────────────────────────────────── */
    function addServiceSubLabels() {
        var svg = document.getElementById('knowledge-graph');
        if (!svg) return;

        var nodeGroups = svg.querySelectorAll('g.kg-node');
        nodeGroups.forEach(function (g) {
            /* Already patched? */
            if (g.querySelector('.kg-svc-label')) return;

            /* Find abbrev text to identify node id */
            var abbrevEl = null;
            g.querySelectorAll('text').forEach(function (t) {
                if (t.textContent.length <= 3 && t.textContent === t.textContent.toUpperCase() && t.getAttribute('dy') === '0.35em') {
                    abbrevEl = t;
                }
            });
            if (!abbrevEl) return;

            var abbrev = abbrevEl.textContent.toLowerCase();
            var nodeId = null;
            Object.keys(NODE_META).forEach(function (id) {
                if (id.substring(0, 3) === abbrev) nodeId = id;
            });
            if (!nodeId || !NODE_META[nodeId]) return;

            var svc = NODE_META[nodeId].service;
            var ns = 'http://www.w3.org/2000/svg';
            var subText = document.createElementNS(ns, 'text');
            subText.setAttribute('text-anchor', 'middle');
            subText.setAttribute('y', '48');
            subText.setAttribute('font-size', '8');
            subText.setAttribute('font-family', 'JetBrains Mono, monospace');
            subText.setAttribute('fill', 'rgba(148,163,184,0.38)');
            subText.setAttribute('pointer-events', 'none');
            subText.setAttribute('class', 'kg-svc-label');
            subText.textContent = svc;
            g.appendChild(subText);
        });
    }

    /* ─────────────────────────────────────────────────────────────
       EXTEND KG PUBLIC API — filterCategories
       Added after graph initializes so we can call it from filter pills.
    ───────────────────────────────────────────────────────────── */
    function extendKGApi() {
        if (!window.KG) return;
        if (window.KG.filterCategories) return; /* already patched */

        window.KG.filterCategories = function (activeCatSet) {
            var visibleIds = new Set(
                Object.keys(NODE_META).filter(function (id) {
                    return activeCatSet.has(NODE_META[id].category);
                })
            );

            /* We can't directly access D3 selections here, so we call highlight */
            window.KG.highlight(Array.from(visibleIds));
        };
    }

    /* ─────────────────────────────────────────────────────────────
       INJECT CSS (all new classes)
    ───────────────────────────────────────────────────────────── */
    function injectCSS() {
        var style = document.createElement('style');
        style.textContent = [
            /* Filter bar */
            '.kg-filter-bar {',
            '  display: flex; align-items: center; flex-wrap: wrap; gap: 6px;',
            '  padding: 8px 16px 0;',
            '}',

            /* Trace bar */
            '.kg-trace-bar {',
            '  display: flex; align-items: center; gap: 8px;',
            '  padding: 10px 16px 0; flex-wrap: wrap;',
            '}',
            '.kg-trace-label {',
            '  font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;',
            '  color: rgba(148,163,184,0.4); margin-right: 4px;',
            '}',

            /* Filter pills */
            '.kg-filter-pill {',
            '  display: inline-flex; align-items: center; gap: 5px;',
            '  padding: 4px 12px; border-radius: 20px; cursor: pointer;',
            '  font-size: 11px; font-weight: 600; font-family: var(--font, Inter, sans-serif);',
            '  border: 1px solid rgba(255,255,255,0.1);',
            '  background: rgba(255,255,255,0.03);',
            '  color: rgba(148,163,184,0.5);',
            '  transition: all 0.18s;',
            '}',
            '.kg-filter-pill::before {',
            '  content: "";',
            '  width: 6px; height: 6px; border-radius: 50%;',
            '  background: var(--pill-color, rgba(148,163,184,0.4));',
            '  opacity: 0.4; transition: opacity 0.18s;',
            '}',
            '.kg-filter-pill:hover {',
            '  border-color: var(--pill-color, rgba(148,163,184,0.3));',
            '  color: rgba(220,232,255,0.8);',
            '}',
            '.kg-filter-pill.active {',
            '  border-color: var(--pill-color, rgba(148,163,184,0.4));',
            '  color: rgba(220,232,255,0.9);',
            '  background: rgba(255,255,255,0.06);',
            '}',
            '.kg-filter-pill.active::before { opacity: 1; }',
            '[data-cat="all"] { --pill-color: rgba(148,163,184,0.6); }',

            /* Trace / Reset buttons */
            '.kg-trace-btn {',
            '  display: inline-flex; align-items: center; gap: 5px;',
            '  padding: 5px 13px; border-radius: 8px;',
            '  font-size: 11.5px; font-weight: 600;',
            '  font-family: var(--font, Inter, sans-serif);',
            '  cursor: pointer; transition: all 0.18s;',
            '  border: 1px solid rgba(6,182,212,0.25);',
            '  background: rgba(6,182,212,0.07);',
            '  color: rgba(6,182,212,0.75);',
            '}',
            '.kg-trace-btn:hover {',
            '  background: rgba(6,182,212,0.15);',
            '  border-color: rgba(6,182,212,0.5);',
            '  color: #06b6d4;',
            '}',
            '.kg-trace-btn.active {',
            '  background: rgba(6,182,212,0.18);',
            '  border-color: #06b6d4;',
            '  color: #06b6d4;',
            '  box-shadow: 0 0 14px rgba(6,182,212,0.2);',
            '}',
            '.kg-reset-btn-alt {',
            '  border-color: rgba(148,163,184,0.2);',
            '  background: rgba(255,255,255,0.03);',
            '  color: rgba(148,163,184,0.6);',
            '}',
            '.kg-reset-btn-alt:hover {',
            '  border-color: rgba(148,163,184,0.4);',
            '  color: rgba(220,232,255,0.8);',
            '  background: rgba(255,255,255,0.07);',
            '}',

            /* Node card flash animation */
            '@keyframes kg-card-flash {',
            '  0%   { box-shadow: 0 0 0 0 rgba(6,182,212,0); }',
            '  30%  { box-shadow: 0 0 0 6px rgba(6,182,212,0.35); }',
            '  100% { box-shadow: 0 0 0 0 rgba(6,182,212,0); }',
            '}',
            '.kg-card-flash {',
            '  animation: kg-card-flash 1.4s ease-out !important;',
            '  outline: 1px solid rgba(6,182,212,0.4) !important;',
            '}',
        ].join('\n');
        document.head.appendChild(style);
    }

    /* ─────────────────────────────────────────────────────────────
       FEATURE 1 — DATA FLOW ANIMATION & FEATURE 5 — SIMULATE EVENT
    ───────────────────────────────────────────────────────────── */
    var flowAnimId = null;
    var particles = [];

    var isLabelsExpanded = false;

    function bindAdvancedToggles() {
        var flowBtn = document.getElementById('kg-flow-btn');
        if (flowBtn) {
            flowBtn.addEventListener('click', function () {
                if (flowAnimId) {
                    cancelAnimationFrame(flowAnimId);
                    flowAnimId = null;
                    particles.forEach(p => p.el.remove());
                    particles = [];
                    flowBtn.classList.remove('active');
                } else {
                    flowBtn.classList.add('active');
                    enableDataFlow();
                }
            });
        }

        var simBtn = document.getElementById('kg-sim-btn');
        if (simBtn) {
            simBtn.addEventListener('click', function () {
                simulatePipeline();
            });
        }

        var layerBtn = document.getElementById('kg-layout-layer');
        var forceBtn = document.getElementById('kg-layout-force');
        if (layerBtn && forceBtn) {
            layerBtn.addEventListener('click', function () {
                layerBtn.classList.add('active');
                forceBtn.classList.remove('active');
                toggleLayerView(true);
            });
            forceBtn.addEventListener('click', function () {
                forceBtn.classList.add('active');
                layerBtn.classList.remove('active');
                toggleLayerView(false);
            });
        }

        /* Debug & Health Toggles */
        var debugBtn = document.getElementById('kg-debug-toggle');
        if (debugBtn) {
            debugBtn.addEventListener('click', function () {
                isDebugModeActive = !isDebugModeActive;
                debugBtn.classList.toggle('active', isDebugModeActive);
                updateGraphStates();
            });
        }

        var healthBtn = document.getElementById('kg-health-toggle');
        if (healthBtn) {
            healthBtn.addEventListener('click', function () {
                isHealthModeActive = !isHealthModeActive;
                healthBtn.classList.toggle('active', isHealthModeActive);
                updateGraphStates();
            });
        }

        /* Expand Labels Toggle */
        var expandBtn = document.getElementById('kg-expand-labels');
        if (expandBtn) {
            expandBtn.addEventListener('click', function () {
                isLabelsExpanded = !isLabelsExpanded;
                expandBtn.classList.toggle('active', isLabelsExpanded);
                expandBtn.textContent = (isLabelsExpanded ? '🔍 Simplify Labels' : '🔍 Expand Full Labels');
                toggleLabels(isLabelsExpanded);
            });
        }

        /* Quick Trace Path */
        var traceBtn = document.getElementById('kg-trace-btn');
        if (traceBtn) {
            traceBtn.addEventListener('click', function () {
                simulatePipeline();
            });
        }

        /* Reset Graph */
        var resetBtn = document.getElementById('kg-reset-graph-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', function () {
                if (window.KG) window.KG.reset();
                /* Reset sub-features */
                if (flowAnimId) {
                    cancelAnimationFrame(flowAnimId);
                    flowAnimId = null;
                    particles.forEach(p => p.el.remove());
                    particles = [];
                    if (flowBtn) flowBtn.classList.remove('active');
                }
            });
        }
    }

    function toggleLabels(expanded) {
        var svg = document.getElementById('knowledge-graph');
        if (!svg) return;

        svg.querySelectorAll('g.kg-node').forEach(function (g) {
            var abbrevEl = null;
            g.querySelectorAll('text').forEach(function (t) {
                if (t.textContent.length <= 4 && t.textContent === t.textContent.toUpperCase() && t.getAttribute('dy') === '0.35em' && !t.classList.contains('kg-svc-label')) {
                    abbrevEl = t;
                }
            });
            if (!abbrevEl) return;

            var abbrev = abbrevEl.textContent.toLowerCase().substring(0, 3);
            var nodeId = null;
            Object.keys(NODE_META).forEach(function (id) { if (id.substring(0, 3) === abbrev || id === abbrev) nodeId = id; });
            if (!nodeId || !NODE_META[nodeId]) return;

            if (expanded) {
                /* Show full label, hide service sub-label to avoid clutter */
                abbrevEl.textContent = NODE_META[nodeId].label;
                abbrevEl.setAttribute('font-size', '10');
                var svcLabel = g.querySelector('.kg-svc-label');
                if (svcLabel) svcLabel.style.display = 'none';
            } else {
                /* Show abbreviation, restore service sub-label */
                abbrevEl.textContent = nodeId.toUpperCase();
                abbrevEl.setAttribute('font-size', '12');
                var svcLabel = g.querySelector('.kg-svc-label');
                if (svcLabel) svcLabel.style.display = '';
            }
        });
    }

    function updateGraphStates() {
        var svg = document.getElementById('knowledge-graph');
        if (!svg) return;

        svg.querySelectorAll('g.kg-node').forEach(function (g) {
            var abbrevEl = null;
            g.querySelectorAll('text').forEach(t => { if (t.textContent.length <= 3 && t.textContent === t.textContent.toUpperCase() && t.getAttribute('dy') === '0.35em') abbrevEl = t; });
            if (!abbrevEl) return;
            var abbrev = abbrevEl.textContent.toLowerCase();
            var nodeId = null;
            Object.keys(NODE_META).forEach(id => { if (id.substring(0, 3) === abbrev) nodeId = id; });
            if (!nodeId) return;

            /* Debug Indicators */
            var debugInd = g.querySelector('.kg-debug-indicator');
            if (isDebugModeActive && FAILURE_SCENARIOS[nodeId]) {
                if (!debugInd) {
                    var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    circle.setAttribute('class', 'kg-debug-indicator kg-debug-dot');
                    circle.setAttribute('r', '3');
                    circle.setAttribute('cx', '22');
                    circle.setAttribute('cy', '-22');
                    g.appendChild(circle);
                }
            } else if (debugInd) {
                debugInd.remove();
            }

            /* Health Glows */
            var circle = g.querySelector('.kg-node-circle');
            if (!circle) return;
            circle.classList.remove('kg-health-green', 'kg-health-amber', 'kg-health-red');
            if (isHealthModeActive && HEALTH_DATA[nodeId]) {
                circle.classList.add('kg-health-' + HEALTH_DATA[nodeId].status);
            }
        });
    }

    function enableDataFlow() {
        var svg = document.querySelector('#knowledge-graph svg');
        if (!svg) return;

        var particleGroup = svg.querySelector('.kg-particles');
        if (!particleGroup) {
            particleGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            particleGroup.setAttribute('class', 'kg-particles');
            /* Insert just before nodes so they run OVER edges but UNDER nodes */
            var nodeG = svg.querySelector('.kg-nodes');
            svg.insertBefore(particleGroup, nodeG);
        }

        var lastSpawn = 0;

        function tick(now) {
            if (now - lastSpawn > 1500) {
                lastSpawn = now;
                spawnParticles(particleGroup);
            }

            for (var i = particles.length - 1; i >= 0; i--) {
                var p = particles[i];
                var elapsed = now - p.startTime;
                if (elapsed > p.duration) {
                    p.el.remove();
                    particles.splice(i, 1);
                } else {
                    var t = elapsed / p.duration;
                    var x = p.x1 + (p.x2 - p.x1) * t;
                    var y = p.y1 + (p.y2 - p.y1) * t;
                    p.el.setAttribute('cx', x);
                    p.el.setAttribute('cy', y);
                }
            }

            flowAnimId = requestAnimationFrame(tick);
        }

        flowAnimId = requestAnimationFrame(tick);
    }

    function spawnParticles(group) {
        var svg = document.querySelector('#knowledge-graph svg');
        var links = svg.querySelectorAll('.kg-link:not(.dimmed)');

        /* Only spawn on Core trace path for clarity */
        links.forEach(function (l) {
            var x1 = parseFloat(l.getAttribute('x1')), y1 = parseFloat(l.getAttribute('y1'));
            var x2 = parseFloat(l.getAttribute('x2')), y2 = parseFloat(l.getAttribute('y2'));
            /* Determine direction and spawn if it's a valid link with length > 0 */
            if (Math.abs(x1 - x2) > 1 || Math.abs(y1 - y2) > 1) {
                var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('class', 'kg-particle');
                circle.setAttribute('r', '3');
                circle.setAttribute('fill', '#06b6d4');
                circle.setAttribute('color', '#06b6d4');
                group.appendChild(circle);

                particles.push({
                    el: circle,
                    x1: x1, y1: y1,
                    x2: x2, y2: y2,
                    startTime: performance.now(),
                    duration: 1500
                });
            }
        });
    }

    function simulatePipeline() {
        if (!window.KG) return;

        var simLabel = document.getElementById('kg-sim-float-label');
        if (!simLabel) {
            simLabel = document.createElement('div');
            simLabel.id = 'kg-sim-float-label';
            simLabel.className = 'kg-sim-label';
            document.querySelector('.kg-shell-wrap').appendChild(simLabel);
        }
        simLabel.classList.add('visible');

        var visited = [];
        var idx = 0;

        function nextStep() {
            if (idx >= TRACE_PATH.length) {
                setTimeout(function () {
                    window.KG.reset();
                    simLabel.classList.remove('visible');
                }, 2000);
                return;
            }

            var id = TRACE_PATH[idx];
            visited.push(id);

            /* Highlight visited nodes (soft history) */
            window.KG.highlight(visited);

            /* Update Floating Label */
            simLabel.textContent = `Step ${idx + 1} / ${TRACE_PATH.length} — ${TRACE_LABELS[idx]}`;

            pulseNode(id);
            idx++;
            setTimeout(nextStep, 700);
        }
        nextStep();
    }

    /* FEATURE 4 — QUERY HIGHLIGHT MODE 
       We hook into the search input if it exists in the DOM */
    function bindSearchClusters() {
        var searchInput = document.querySelector('.search-input-row input');
        if (!searchInput) return;

        searchInput.addEventListener('input', function (e) {
            var val = e.target.value.toLowerCase().trim();
            if (QUERY_MAP[val] && window.KG) {
                window.KG.highlight(QUERY_MAP[val]);
            }
        });
    }

    /* ─────────────────────────────────────────────────────────────
       FEATURE 2 — ARCHITECTURE LAYER VIEW
    ───────────────────────────────────────────────────────────── */
    function toggleLayerView(enable) {
        var svg = document.querySelector('#knowledge-graph svg');
        if (!svg) return;

        var nodes = svg.querySelectorAll('.kg-node');
        var w = svg.clientWidth || 800;

        var Y_LAYER = {
            'ingestion': 120,
            'core': 200,
            'storage': 280,
            'activation': 380,
            'intelligence': 460,
            'analytics': 380, /* side-by-side with activation */
            'security': 50,
            'compliance': 50,
            'platform': 520
        };

        /* Since we don't hold the force simulation ref, we override the DOM __data__ */
        nodes.forEach(function (g) {
            var data = g.__data__;
            if (!data) return;

            if (enable) {
                /* Pin to calculated position */
                var cat = data.category;
                var targetY = Y_LAYER[cat] || 250;

                /* Just distribute X roughly */
                var groupCount = 0; var groupIx = 0;
                nodes.forEach(function (g2) {
                    if (g2.__data__ && g2.__data__.category === cat) {
                        groupCount++;
                        if (g2 === g) groupIx = groupCount;
                    }
                });

                /* Slight offsets for layout */
                var targetX = (w / (groupCount + 1)) * groupIx;
                if (cat === 'analytics') targetX += w / 4;
                if (cat === 'activation') targetX -= w / 6;

                data.fx = targetX;
                data.fy = targetY;
            } else {
                /* Release pin */
                data.fx = null;
                data.fy = null;
            }
        });

        if (window.KG && window.KG.reheat) {
            window.KG.reheat();
        }
    }

    /* ─────────────────────────────────────────────────────────────
       FEATURE 3 — NODE METRICS VISUALIZATION
    ───────────────────────────────────────────────────────────── */
    var metricIntId = null;
    function updateNodeMetrics() {
        var svg = document.querySelector('#knowledge-graph svg');
        if (!svg) return;

        var nodes = svg.querySelectorAll('.kg-node');
        nodes.forEach(function (g) {
            var data = g.__data__;
            if (!data) return;

            var metricEl = g.querySelector('.kg-metric-text');
            if (!metricEl) {
                metricEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                metricEl.setAttribute('class', 'kg-metric-text');
                metricEl.setAttribute('text-anchor', 'middle');
                metricEl.setAttribute('y', '62'); /* Below the service sub-label */
                g.appendChild(metricEl);
            }

            var base = (data.category === 'ingestion') ? 85000 :
                (data.category === 'storage') ? 2100 :
                    (data.category === 'activation') ? 14000 : 400;

            var fuzz = base * (0.8 + Math.random() * 0.4);
            var valStr = fuzz > 10000 ? (fuzz / 1000).toFixed(1) + 'K/s' : Math.floor(fuzz) + '/s';

            metricEl.textContent = valStr;

            /* Spikes */
            if (Math.random() > 0.8) {
                metricEl.style.fill = '#06b6d4';
                setTimeout(() => metricEl.style.fill = '', 1000);
            }
        });
    }

    /* ─────────────────────────────────────────────────────────────
       INIT
    ───────────────────────────────────────────────────────────── */
    function init() {
        injectCSS();
        fixTooltip();
        injectToolbarRows();
        bindFilterPills();
        bindTracePath();
        bindNodeClickPanel();
        bindAdvancedToggles();
        bindSearchClusters();
        patchTooltipContent();

        /* Start Metrics */
        metricIntId = setInterval(updateNodeMetrics, 3000);

        /* Feature 5 sub-labels need the simulation to settle first */
        /* Retry a few times until nodes exist in the SVG */
        var attempts = 0;
        function tryAddSubLabels() {
            var nodeGroups = document.querySelectorAll('#knowledge-graph g.kg-node');
            if (nodeGroups.length > 0) {
                addServiceSubLabels();
                extendKGApi();
                updateNodeMetrics(); /* Initial paint */
            } else if (attempts++ < 20) {
                setTimeout(tryAddSubLabels, 300);
            }
        }
        setTimeout(tryAddSubLabels, 400);
    }

    /* Run after DOM + knowledge-graph.js has initialized */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        /* Script loaded after DOMContentLoaded */
        setTimeout(init, 50);
    }

})();
