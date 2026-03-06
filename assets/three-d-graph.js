/* ═══════════════════════════════════════════════════════════════
   ZEOTAP CDP — 3D KNOWLEDGE GRAPH ENGINE
   Uses 3d-force-graph (Three.js / WebGL)
   Exposes window.KG — drop-in replacement for knowledge-graph.js
   ═══════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';

  /* ── DATA ────────────────────────────────────────────────────── */
  var NODES = [
    { id: 'collect',   label: 'Data Collection',    layer: 'collection', category: 'ingestion',
      url: '02-data-collection.html',
      desc: 'analytics-sdk (JS/TS), ZeotapCollect (iOS/Swift), Android SDK, SmartPixel, GTM templates. Tracks events from web, mobile, CRM, and server-side sources.',
      tech: ['JS/TS', 'Swift', 'Kotlin', 'GTM'],
      inputs: 'Web/Mobile/Server events', outputs: 'Validated raw events', owner: 'Sources & SDK Team' },

    { id: 'ingest',    label: 'Data Ingestion',     layer: 'ingestion',  category: 'ingestion',
      url: '03-data-ingestion.html',
      desc: 'daap pipelines — real-time Pub/Sub streams + batch GCS→BigQuery ETL via Apache Beam, CDAP, and Spark on GKE.',
      tech: ['Java', 'Scala', 'Beam', 'CDAP'],
      inputs: 'Raw event streams', outputs: 'Canonical enriched events', owner: 'Data Infrastructure Team' },

    { id: 'identity',  label: 'Identity Graph',     layer: 'identity',   category: 'core',
      url: '03-identity-resolution.html',
      desc: 'id-graph-lib-v2-go in Go 1.24. Resolves cookies, device IDs, emails, phones → UCID. Stored in BigTable + Redis with PGP-encrypted PII.',
      tech: ['Go 1.24', 'BigTable', 'Redis'],
      inputs: 'Device + CRM identifiers', outputs: 'Unified customer ID graph', owner: 'Identity Platform Team' },

    { id: 'profiles',  label: 'Profile Store',      layer: 'profile',    category: 'storage',
      url: '05-profile-store.html',
      desc: 'Delta Lake on GCS. ACID transactions, schema evolution, time-travel queries. Petabyte-scale unified profiles.',
      tech: ['Scala', 'Delta Lake', 'GCS'],
      inputs: 'Identity graph + events', outputs: 'Unified customer profile', owner: 'Unify Data Team' },

    { id: 'audiences', label: 'Audiences',           layer: 'processing', category: 'activation',
      url: '06-audience-management.html',
      desc: 'Real-time segment evaluation engine. Boolean + SQL rule builder. Streaming membership updates via Pub/Sub. Supports 18K+ active segments.',
      tech: ['Scala', 'BigQuery', 'Pub/Sub'],
      inputs: 'Profile traits', outputs: 'Segment membership updates', owner: 'Audience Engine Team' },

    { id: 'journeys',  label: 'Customer Journeys',  layer: 'activation', category: 'activation',
      url: '07-customer-journeys.html',
      desc: 'Multi-step orchestration with event triggers, time delays, A/B splits, and frequency caps. Journey state persisted in Redis + BigTable.',
      tech: ['Java', 'Kafka', 'Redis'],
      inputs: 'Audience triggers', outputs: 'Journey execution tasks', owner: 'Orchestrate Team' },

    { id: 'activation',label: 'Data Activation',    layer: 'activation', category: 'activation',
      url: '08-data-activation.html',
      desc: '100+ destination connectors — DSPs, CRMs, email, push, webhooks. Batched export + real-time streaming. Consent-enforced at dispatch.',
      tech: ['Java', 'REST', 'gRPC'],
      inputs: 'Journey payloads', outputs: 'Partner destination sync', owner: 'Destinations Team' },

    { id: 'ai',        label: 'AI / Zoe',           layer: 'processing', category: 'intelligence',
      url: '04-genai-zoe.html',
      desc: 'GenAI layer using Google Gemini. Natural-language segmentation, autonomous journey building, MCP protocol integration, vector search.',
      tech: ['Python', 'Gemini', 'FastAPI'],
      inputs: 'Profile context', outputs: 'NL segmentation and recommendations', owner: 'AI Platform Team' },

    { id: 'ml',        label: 'ML Platform',        layer: 'processing', category: 'intelligence',
      url: '10-ml-platform.html',
      desc: 'Vertex AI training pipelines. Feature engineering on BigQuery. Churn/LTV/propensity models. Real-time prediction serving via REST.',
      tech: ['Python', 'Vertex AI', 'TFX'],
      inputs: 'Feature vectors', outputs: 'Predictive model scores', owner: 'ML Platform Team' },

    { id: 'reporting', label: 'Reporting & BI',     layer: 'analytics',  category: 'analytics',
      url: '11-reporting-bi.html',
      desc: 'BigQuery OLAP engine, Druid for real-time metrics, Redshift for ad-hoc. Powers Unity Dashboard and third-party BI tool connectors.',
      tech: ['BigQuery', 'Druid', 'Redshift'],
      inputs: 'Operational and audience data', outputs: 'Dashboards and BI datasets', owner: 'Analytics Platform Team' },

    { id: 'unity',     label: 'Unity Dashboard',    layer: 'analytics',  category: 'analytics',
      url: '12-unity-dashboard.html',
      desc: 'React + TypeScript SPA. Unified UI for segment building, journey design, destination management. GraphQL + REST API layer.',
      tech: ['React', 'TypeScript', 'GraphQL'],
      inputs: 'Aggregated APIs', outputs: 'Operator workflows and controls', owner: 'Frontend Platform Team' },

    { id: 'privacy',   label: 'Privacy & GDPR',     layer: 'compliance', category: 'compliance',
      url: '13-privacy-gdpr.html',
      desc: 'Consent management system, GDPR Art.17 erasure pipelines (7-10 day SLA), data residency controls, CCPA compliance enforcement.',
      tech: ['Java', 'Postgres', 'Delta Lake'],
      inputs: 'Consent + legal policies', outputs: 'Enforced compliance decisions', owner: 'Privacy Engineering' },

    { id: 'auth',      label: 'Auth & IAM',         layer: 'compliance', category: 'security',
      url: '14-auth-iam.html',
      desc: 'OAuth 2.0 + PKCE, SAML SSO (Okta/Azure AD), RBAC with org hierarchy, JWT token lifecycle, API key rotation and revocation.',
      tech: ['Keycloak', 'JWT', 'SAML'],
      inputs: 'User identities', outputs: 'Access and session controls', owner: 'Security Engineering' },

    { id: 'infra',     label: 'Infrastructure',     layer: 'compliance', category: 'platform',
      url: '15-infrastructure.html',
      desc: 'GKE multi-tenant clusters, Terraform IaC, Helm 3 charts, Cloudflare WAF, multi-region GCP primary + AWS failover.',
      tech: ['GKE', 'Terraform', 'Helm 3'],
      inputs: 'Service deployment specs', outputs: 'Runtime compute/storage fabric', owner: 'Cloud Infrastructure Team' },

    { id: 'observe',   label: 'Observability',      layer: 'compliance', category: 'platform',
      url: '16-observability.html',
      desc: 'Prometheus + Grafana, Cloud Trace, OpenTelemetry collector, Alertmanager PagerDuty routing. SLO dashboards per service.',
      tech: ['Prometheus', 'Grafana', 'OTel'],
      inputs: 'Metrics and traces', outputs: 'Alerts and reliability actions', owner: 'SRE & Reliability Team' },

    { id: 'cicd',      label: 'CI/CD',              layer: 'compliance', category: 'platform',
      url: '17-cicd.html',
      desc: 'Harness pipelines, GitHub Actions for PR validation, progressive blue/green deploys, automated rollback on SLO breach.',
      tech: ['Harness', 'GitHub', 'Docker'],
      inputs: 'Source changes', outputs: 'Validated deployments', owner: 'Developer Productivity Team' },

    { id: 'testing',   label: 'Testing & QA',       layer: 'compliance', category: 'platform',
      url: '18-testing.html',
      desc: 'JUnit/Mockito unit tests, WireMock contract tests, Playwright E2E, k6 load testing, chaos engineering via Chaos Monkey.',
      tech: ['JUnit', 'k6', 'Playwright'],
      inputs: 'Change candidates', outputs: 'Release confidence signals', owner: 'Quality Engineering Team' }
  ];

  var LINKS = [
    { source: 'collect',   target: 'ingest',    label: 'raw events',   strength: 0.5 },
    { source: 'ingest',    target: 'identity',  label: 'IDs',          strength: 0.5 },
    { source: 'ingest',    target: 'profiles',  label: 'attributes',   strength: 0.5 },
    { source: 'identity',  target: 'profiles',  label: 'UCID',         strength: 0.6 },
    { source: 'profiles',  target: 'audiences', label: 'traits',       strength: 0.5 },
    { source: 'profiles',  target: 'ai',        label: 'context',      strength: 0.4 },
    { source: 'profiles',  target: 'ml',        label: 'features',     strength: 0.4 },
    { source: 'profiles',  target: 'reporting', label: 'analytics',    strength: 0.3 },
    { source: 'audiences', target: 'journeys',  label: 'membership',   strength: 0.5 },
    { source: 'audiences', target: 'activation',label: 'cohorts',      strength: 0.5 },
    { source: 'audiences', target: 'reporting', label: 'metrics',      strength: 0.3 },
    { source: 'journeys',  target: 'activation',label: 'triggers',     strength: 0.5 },
    { source: 'ml',        target: 'profiles',  label: 'scores',       strength: 0.4 },
    { source: 'ai',        target: 'audiences', label: 'NL query',     strength: 0.4 },
    { source: 'reporting', target: 'unity',     label: 'metrics',      strength: 0.4 },
    { source: 'privacy',   target: 'identity',  label: 'consent',      strength: 0.35 },
    { source: 'privacy',   target: 'activation',label: 'enforcement',  strength: 0.35 },
    { source: 'auth',      target: 'unity',     label: 'access',       strength: 0.35 },
    { source: 'infra',     target: 'observe',   label: 'telemetry',    strength: 0.3 },
    { source: 'observe',   target: 'infra',     label: 'alerts',       strength: 0.3 }
  ];

  var CATEGORY = {
    ingestion:   { color: '#06b6d4', glow: 'rgba(6,182,212,0.4)',   label: 'Ingestion'    },
    core:        { color: '#3b82f6', glow: 'rgba(59,130,246,0.4)',  label: 'Core'         },
    storage:     { color: '#8b5cf6', glow: 'rgba(139,92,246,0.4)',  label: 'Storage'      },
    activation:  { color: '#f59e0b', glow: 'rgba(245,158,11,0.4)', label: 'Activation'   },
    intelligence:{ color: '#10b981', glow: 'rgba(16,185,129,0.4)', label: 'Intelligence' },
    analytics:   { color: '#ec4899', glow: 'rgba(236,72,153,0.4)', label: 'Analytics'    },
    compliance:  { color: '#f97316', glow: 'rgba(249,115,22,0.4)', label: 'Compliance'   },
    security:    { color: '#ef4444', glow: 'rgba(239,68,68,0.4)',   label: 'Security'     },
    platform:    { color: '#64748b', glow: 'rgba(100,116,139,0.4)', label: 'Platform'     }
  };

  var FLOW_PATH = ['collect', 'ingest', 'identity', 'profiles', 'audiences', 'journeys', 'activation'];

  /* ── STATE ───────────────────────────────────────────────────── */
  var state = {
    graph: null,
    container: null,
    focusedId: null,
    visibleSet: new Set(),
    flowTimers: [],
    flowRunning: false
  };

  /* ── HELPERS ─────────────────────────────────────────────────── */
  function nodeById(id) {
    return NODES.find(function (n) { return n.id === id; });
  }

  function resolveId(x) {
    return typeof x === 'object' && x !== null ? x.id : x;
  }

  function getDependencies(id) {
    var upstream = new Set();
    var downstream = new Set();

    var q = [id];
    while (q.length) {
      var cur = q.shift();
      LINKS.forEach(function (l) {
        var s = resolveId(l.source), t = resolveId(l.target);
        if (t === cur && s !== id && !upstream.has(s)) { upstream.add(s); q.push(s); }
      });
    }
    q = [id];
    while (q.length) {
      var cur2 = q.shift();
      LINKS.forEach(function (l) {
        var s = resolveId(l.source), t = resolveId(l.target);
        if (s === cur2 && t !== id && !downstream.has(t)) { downstream.add(t); q.push(t); }
      });
    }
    return { upstream: Array.from(upstream), downstream: Array.from(downstream) };
  }

  /* ── COLOR CALLBACKS (reactive to state) ─────────────────────── */
  function nodeColor(node) {
    var cat = CATEGORY[node.category] || { color: '#64748b' };
    if (!state.focusedId) return cat.color;
    return state.visibleSet.has(node.id) ? cat.color : '#0d1827';
  }

  function nodeVal(node) {
    if (!state.focusedId) return 8;
    if (node.id === state.focusedId) return 16;
    return state.visibleSet.has(node.id) ? 10 : 4;
  }

  function linkColor(link) {
    var s = resolveId(link.source), t = resolveId(link.target);
    if (!state.focusedId) return 'rgba(100,116,139,0.35)';
    return (state.visibleSet.has(s) && state.visibleSet.has(t))
      ? 'rgba(148,163,184,0.75)' : 'rgba(30,41,59,0.12)';
  }

  function linkWidth(link) {
    var s = resolveId(link.source), t = resolveId(link.target);
    if (!state.focusedId) return 1.2;
    return (state.visibleSet.has(s) && state.visibleSet.has(t)) ? 2.2 : 0.4;
  }

  function particleColor(link) {
    var s = resolveId(link.source);
    var n = nodeById(s);
    if (n) return (CATEGORY[n.category] || {}).color || '#60a5fa';
    return '#60a5fa';
  }

  function particleCount(link) {
    var s = resolveId(link.source), t = resolveId(link.target);
    if (!state.focusedId) return 2;
    return (state.visibleSet.has(s) && state.visibleSet.has(t)) ? 4 : 0;
  }

  function refresh() {
    if (!state.graph) return;
    state.graph
      .nodeColor(nodeColor)
      .nodeVal(nodeVal)
      .linkColor(linkColor)
      .linkWidth(linkWidth)
      .linkDirectionalParticles(particleCount);
  }

  /* ── SIDE PANEL ──────────────────────────────────────────────── */
  function ensureSidePanel() {
    var p = document.getElementById('kg-side-panel');
    if (p) return p;
    p = document.createElement('div');
    p.id = 'kg-side-panel';
    p.className = 'kg-side-panel';
    p.innerHTML =
      '<button class="kg-sp-close" id="kg-sp-close" aria-label="Close panel">✕</button>' +
      '<div class="kg-sp-body"></div>';
    document.body.appendChild(p);
    document.getElementById('kg-sp-close').addEventListener('click', function () { removeSidePanel(); });
    return p;
  }

  function removeSidePanel() {
    var p = document.getElementById('kg-side-panel');
    if (p) p.classList.remove('open');
  }

  function renderSidePanel(nodeId, deps) {
    var d = nodeById(nodeId);
    if (!d) return;
    var panel = ensureSidePanel();
    var cat = CATEGORY[d.category] || { color: '#64748b', label: 'Service' };

    var upHtml = deps.upstream.map(function (id) {
      var n = nodeById(id);
      return n ? '<span class="kg-dep-pill kg-dep-up">' + n.label + '</span>' : '';
    }).join('');

    var downHtml = deps.downstream.map(function (id) {
      var n = nodeById(id);
      return n ? '<span class="kg-dep-pill kg-dep-down">' + n.label + '</span>' : '';
    }).join('');

    panel.querySelector('.kg-sp-body').innerHTML =
      '<div class="kg-sp-badge" style="background:' + cat.color + '22;color:' + cat.color + ';border:1px solid ' + cat.color + '44">' + cat.label + '</div>' +
      '<div class="kg-sp-title">' + d.label + '</div>' +
      '<div class="kg-sp-desc">' + d.desc + '</div>' +
      '<div class="kg-sp-section">' +
        '<div class="kg-sp-label">Team</div>' +
        '<div class="kg-sp-val">' + (d.owner || '—') + '</div>' +
      '</div>' +
      '<div class="kg-sp-section">' +
        '<div class="kg-sp-label">Inputs → Outputs</div>' +
        '<div class="kg-sp-val">' + (d.inputs || '—') + ' <span style="opacity:.5">→</span> ' + (d.outputs || '—') + '</div>' +
      '</div>' +
      (d.tech && d.tech.length ? '<div class="kg-sp-section"><div class="kg-sp-label">Tech Stack</div><div class="kg-sp-tech">' + d.tech.map(function (t) { return '<span class="focus-pill">' + t + '</span>'; }).join('') + '</div></div>' : '') +
      (upHtml ? '<div class="kg-sp-section"><div class="kg-sp-label">Upstream Dependencies</div><div class="kg-sp-deps">' + upHtml + '</div></div>' : '') +
      (downHtml ? '<div class="kg-sp-section"><div class="kg-sp-label">Downstream Services</div><div class="kg-sp-deps">' + downHtml + '</div></div>' : '') +
      '<a class="kg-sp-cta" href="' + (d.url || '#') + '">Open Documentation →</a>';

    requestAnimationFrame(function () { panel.classList.add('open'); });
  }

  /* ── PUBLIC API ──────────────────────────────────────────────── */
  function highlight(ids, opts) {
    if (!Array.isArray(ids)) ids = [ids];
    ids = ids.filter(Boolean);
    if (!ids.length) { reset(); return; }
    state.focusedId = '_highlight_';
    state.visibleSet = new Set(ids);
    refresh();
  }

  function enterFocusMode(nodeId) {
    if (!nodeById(nodeId)) return;
    var deps = getDependencies(nodeId);
    state.focusedId = nodeId;
    state.visibleSet = new Set([nodeId].concat(deps.upstream).concat(deps.downstream));
    refresh();
    renderSidePanel(nodeId, deps);

    if (state.graph) {
      var node = state.graph.graphData().nodes.find(function (n) { return n.id === nodeId; });
      if (node) {
        var dist = 180;
        state.graph.cameraPosition(
          { x: node.x + dist, y: node.y + dist / 2, z: node.z + dist },
          node,
          1200
        );
      }
    }
  }

  function reset(opts) {
    state.focusedId = null;
    state.visibleSet = new Set();
    state.flowRunning = false;
    state.flowTimers.forEach(clearTimeout);
    state.flowTimers = [];
    refresh();
    removeSidePanel();
  }

  function simulateEventFlow() {
    reset();
    state.flowRunning = true;
    var visited = [];

    FLOW_PATH.forEach(function (id, idx) {
      var t = setTimeout(function () {
        if (!state.flowRunning) return;
        visited.push(id);
        state.focusedId = '_flow_';
        state.visibleSet = new Set(visited);
        refresh();

        if (state.graph && idx < FLOW_PATH.length - 1) {
          var node = state.graph.graphData().nodes.find(function (n) { return n.id === id; });
          if (node) {
            state.graph.cameraPosition(
              { x: (node.x || 0) + 200, y: (node.y || 0) + 100, z: (node.z || 0) + 200 },
              node, 600
            );
          }
        }
      }, idx * 900);
      state.flowTimers.push(t);
    });

    var done = setTimeout(function () {
      state.flowRunning = false;
      reset();
    }, FLOW_PATH.length * 900 + 1200);
    state.flowTimers.push(done);
  }

  function activateEdge(src, tgt, opts) {
    /* Particles handle flow visualization — no-op */
    return true;
  }

  function reheat() {
    if (state.graph) state.graph.d3ReheatSimulation();
  }

  /* ── LEGEND ──────────────────────────────────────────────────── */
  function buildLegend(containerId) {
    var el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = '';
    Object.keys(CATEGORY).forEach(function (cat) {
      var item = document.createElement('div');
      item.className = 'kg-legend-item';
      item.innerHTML =
        '<div class="kg-legend-dot" style="background:' + CATEGORY[cat].color +
        ';box-shadow:0 0 6px ' + CATEGORY[cat].glow + '"></div>' + CATEGORY[cat].label;
      el.appendChild(item);
    });
  }

  /* ── INIT ────────────────────────────────────────────────────── */
  function init(containerId) {
    var container = document.getElementById(containerId);
    if (!container) return;

    if (typeof ForceGraph3D === 'undefined') {
      console.error('[3D-KG] ForceGraph3D not loaded — check CDN');
      return;
    }

    /* height */
    container.style.height = '680px';

    var graphData = {
      nodes: NODES.map(function (n) { return Object.assign({}, n); }),
      links: LINKS.map(function (l) { return Object.assign({}, l); })
    };

    var graph = ForceGraph3D({ controlType: 'orbit', rendererConfig: { antialias: true, alpha: true } })(container)
      .graphData(graphData)
      .backgroundColor('rgba(0,0,0,0)')
      .nodeLabel(function (n) { return '<div class="kg3d-tip"><b>' + n.label + '</b><br/><span>' + (CATEGORY[n.category] || {}).label + '</span></div>'; })
      .nodeColor(nodeColor)
      .nodeVal(nodeVal)
      .nodeRelSize(5)
      .nodeOpacity(0.95)
      .linkColor(linkColor)
      .linkWidth(linkWidth)
      .linkOpacity(0.6)
      .linkCurvature(0.12)
      .linkDirectionalArrowLength(5)
      .linkDirectionalArrowRelPos(1)
      .linkDirectionalParticles(particleCount)
      .linkDirectionalParticleColor(particleColor)
      .linkDirectionalParticleWidth(2.5)
      .linkDirectionalParticleSpeed(0.005)
      .onNodeClick(function (node) {
        enterFocusMode(node.id);
      })
      .onNodeRightClick(function (node) {
        if (node.url) window.location.href = node.url;
      })
      .onBackgroundClick(function () {
        reset();
      })
      .onNodeHover(function (node) {
        container.style.cursor = node ? 'pointer' : 'grab';
      });

    /* Auto-rotate */
    graph.controls().autoRotate = true;
    graph.controls().autoRotateSpeed = 0.4;

    /* Stop rotation on user interaction, resume after 4s */
    graph.controls().addEventListener('start', function () {
      graph.controls().autoRotate = false;
    });
    graph.controls().addEventListener('end', function () {
      setTimeout(function () {
        if (!state.focusedId) graph.controls().autoRotate = true;
      }, 4000);
    });

    state.graph = graph;
    state.container = container;

    buildLegend('graph-legend');

    /* Expose public API */
    global.KG = {
      highlight: highlight,
      reset: reset,
      reheat: reheat,
      animateFlow: simulateEventFlow,
      simulateEventFlow: simulateEventFlow,
      activateEdge: activateEdge,
      enterFocusMode: enterFocusMode
    };

    document.dispatchEvent(new CustomEvent('kg:ready'));
    console.info('[3D-KG] Knowledge graph initialized — 17 nodes / 20 links');
  }

  /* ── BOOT ────────────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { init('knowledge-graph'); });
  } else {
    init('knowledge-graph');
  }

})(window);
