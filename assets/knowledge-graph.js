/* ═══════════════════════════════════════════════════════════════
   ZEOTAP CDP — CANONICAL KNOWLEDGE GRAPH ENGINE
   D3 v7 Force-Directed Platform Architecture Map
   ═══════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';

  var NODES = [
    { id: 'collect', label: 'Data Collection', layer: 'collection', category: 'ingestion', url: '02-data-collection.html',
      desc: 'analytics-sdk (JS/TS), ZeotapCollect (iOS/Swift), Android SDK, SmartPixel, GTM templates. Tracks events from web, mobile, CRM, and server-side sources.',
      tech: ['JS/TS', 'Swift', 'Kotlin', 'GTM'] },
    { id: 'ingest', label: 'Data Ingestion', layer: 'ingestion', category: 'ingestion', url: '03-data-ingestion.html',
      desc: 'daap pipelines — real-time Pub/Sub streams + batch GCS→BigQuery ETL via Apache Beam, CDAP, and Spark on GKE.',
      tech: ['Java', 'Scala', 'Beam', 'CDAP'] },
    { id: 'identity', label: 'Identity Graph', layer: 'identity', category: 'core', url: '03-identity-resolution.html',
      desc: 'id-graph-lib-v2-go in Go 1.24. Resolves cookies, device IDs, emails, phones → UCID. Stored in BigTable + Redis with PGP-encrypted PII.',
      tech: ['Go 1.24', 'BigTable', 'Redis'] },
    { id: 'profiles', label: 'Profile Store', layer: 'profile', category: 'storage', url: '05-profile-store.html',
      desc: 'Delta Lake on GCS. ACID transactions, schema evolution, time-travel queries. Petabyte-scale unified profiles.',
      tech: ['Scala', 'Delta Lake', 'GCS'] },
    { id: 'audiences', label: 'Audiences', layer: 'processing', category: 'activation', url: '06-audience-management.html',
      desc: 'Real-time segment evaluation engine. Boolean + SQL rule builder. Streaming membership updates via Pub/Sub. Supports 18K+ active segments.',
      tech: ['Scala', 'BigQuery', 'Pub/Sub'] },
    { id: 'journeys', label: 'Customer Journeys', layer: 'activation', category: 'activation', url: '07-customer-journeys.html',
      desc: 'Multi-step orchestration with event triggers, time delays, A/B splits, and frequency caps. Journey state persisted in Redis + BigTable.',
      tech: ['Java', 'Kafka', 'Redis'] },
    { id: 'activation', label: 'Data Activation', layer: 'activation', category: 'activation', url: '08-data-activation.html',
      desc: '100+ destination connectors — DSPs, CRMs, email, push, webhooks. Batched export + real-time streaming. Consent-enforced at dispatch.',
      tech: ['Java', 'REST', 'gRPC'] },
    { id: 'ai', label: 'AI / Zoe', layer: 'processing', category: 'intelligence', url: '04-genai-zoe.html',
      desc: 'GenAI layer using Google Gemini. Natural-language segmentation, autonomous journey building, MCP protocol integration, vector search.',
      tech: ['Python', 'Gemini', 'FastAPI'] },
    { id: 'ml', label: 'ML Platform', layer: 'processing', category: 'intelligence', url: '10-ml-platform.html',
      desc: 'Vertex AI training pipelines. Feature engineering on BigQuery. Churn/LTV/propensity models. Real-time prediction serving via REST.',
      tech: ['Python', 'Vertex AI', 'TFX'] },
    { id: 'reporting', label: 'Reporting & BI', layer: 'analytics', category: 'analytics', url: '11-reporting-bi.html',
      desc: 'BigQuery OLAP engine, Druid for real-time metrics, Redshift for ad-hoc. Powers Unity Dashboard and third-party BI tool connectors.',
      tech: ['BigQuery', 'Druid', 'Redshift'] },
    { id: 'unity', label: 'Unity Dashboard', layer: 'analytics', category: 'analytics', url: '12-unity-dashboard.html',
      desc: 'React + TypeScript SPA. Unified UI for segment building, journey design, destination management. GraphQL + REST API layer.',
      tech: ['React', 'TypeScript', 'GraphQL'] },
    { id: 'privacy', label: 'Privacy & GDPR', layer: 'compliance', category: 'compliance', url: '13-privacy-gdpr.html',
      desc: 'Consent management system, GDPR Art.17 erasure pipelines (7-10 day SLA), data residency controls, CCPA compliance enforcement.',
      tech: ['Java', 'Postgres', 'Delta Lake'] },
    { id: 'auth', label: 'Auth & IAM', layer: 'compliance', category: 'security', url: '14-auth-iam.html',
      desc: 'OAuth 2.0 + PKCE, SAML SSO (Okta/Azure AD), RBAC with org hierarchy, JWT token lifecycle, API key rotation and revocation.',
      tech: ['Keycloak', 'JWT', 'SAML'] },
    { id: 'infra', label: 'Infrastructure', layer: 'compliance', category: 'platform', url: '15-infrastructure.html',
      desc: 'GKE multi-tenant clusters, Terraform IaC, Helm 3 charts, Cloudflare WAF, multi-region GCP primary + AWS failover.',
      tech: ['GKE', 'Terraform', 'Helm 3'] },
    { id: 'observe', label: 'Observability', layer: 'compliance', category: 'platform', url: '16-observability.html',
      desc: 'Prometheus + Grafana, Cloud Trace, OpenTelemetry collector, Alertmanager PagerDuty routing. SLO dashboards per service.',
      tech: ['Prometheus', 'Grafana', 'OTel'] },
    { id: 'cicd', label: 'CI/CD', layer: 'compliance', category: 'platform', url: '17-cicd.html',
      desc: 'Harness pipelines, GitHub Actions for PR validation, progressive blue/green deploys, automated rollback on SLO breach.',
      tech: ['Harness', 'GitHub', 'Docker'] },
    { id: 'testing', label: 'Testing & QA', layer: 'compliance', category: 'platform', url: '18-testing.html',
      desc: 'JUnit/Mockito unit tests, WireMock contract tests, Playwright E2E, k6 load testing, chaos engineering via Chaos Monkey.',
      tech: ['JUnit', 'k6', 'Playwright'] }
  ];

  var LINKS = [
    { source: 'collect', target: 'ingest', label: 'raw events', strength: 0.5 },
    { source: 'ingest', target: 'identity', label: 'IDs', strength: 0.5 },
    { source: 'ingest', target: 'profiles', label: 'attributes', strength: 0.5 },
    { source: 'identity', target: 'profiles', label: 'UCID', strength: 0.6 },
    { source: 'profiles', target: 'audiences', label: 'traits', strength: 0.5 },
    { source: 'profiles', target: 'ai', label: 'context', strength: 0.4 },
    { source: 'profiles', target: 'ml', label: 'features', strength: 0.4 },
    { source: 'profiles', target: 'reporting', label: 'analytics', strength: 0.3 },
    { source: 'audiences', target: 'journeys', label: 'membership', strength: 0.5 },
    { source: 'audiences', target: 'activation', label: 'cohorts', strength: 0.5 },
    { source: 'audiences', target: 'reporting', label: 'metrics', strength: 0.3 },
    { source: 'journeys', target: 'activation', label: 'triggers', strength: 0.5 },
    { source: 'ml', target: 'profiles', label: 'scores', strength: 0.4 },
    { source: 'ai', target: 'audiences', label: 'NL query', strength: 0.4 },
    { source: 'reporting', target: 'unity', label: 'metrics', strength: 0.4 },
    { source: 'privacy', target: 'identity', label: 'consent', strength: 0.35 },
    { source: 'privacy', target: 'activation', label: 'enforcement', strength: 0.35 },
    { source: 'auth', target: 'unity', label: 'access', strength: 0.35 },
    { source: 'infra', target: 'observe', label: 'telemetry', strength: 0.3 },
    { source: 'observe', target: 'infra', label: 'alerts', strength: 0.3 }
  ];

  var CATEGORY = {
    ingestion: { color: '#06b6d4', glow: 'rgba(6,182,212,0.35)', label: 'Ingestion' },
    core: { color: '#3b82f6', glow: 'rgba(59,130,246,0.35)', label: 'Core' },
    storage: { color: '#8b5cf6', glow: 'rgba(139,92,246,0.35)', label: 'Storage' },
    activation: { color: '#f59e0b', glow: 'rgba(245,158,11,0.35)', label: 'Activation' },
    intelligence: { color: '#10b981', glow: 'rgba(16,185,129,0.35)', label: 'Intelligence' },
    analytics: { color: '#ec4899', glow: 'rgba(236,72,153,0.35)', label: 'Analytics' },
    compliance: { color: '#f97316', glow: 'rgba(249,115,22,0.35)', label: 'Compliance' },
    security: { color: '#ef4444', glow: 'rgba(239,68,68,0.35)', label: 'Security' },
    platform: { color: '#64748b', glow: 'rgba(100,116,139,0.35)', label: 'Platform' }
  };

  var NODE_DETAILS = {
    collect: { owner: 'Sources & SDK Team', inputs: 'Web/Mobile/Server events', outputs: 'Validated raw events' },
    ingest: { owner: 'Data Infrastructure Team', inputs: 'Raw event streams', outputs: 'Canonical enriched events' },
    identity: { owner: 'Identity Platform Team', inputs: 'Device + CRM identifiers', outputs: 'Unified customer ID graph' },
    profiles: { owner: 'Unify Data Team', inputs: 'Identity graph + events', outputs: 'Unified customer profile' },
    audiences: { owner: 'Audience Engine Team', inputs: 'Profile traits', outputs: 'Segment membership updates' },
    journeys: { owner: 'Orchestrate Team', inputs: 'Audience triggers', outputs: 'Journey execution tasks' },
    activation: { owner: 'Destinations Team', inputs: 'Journey payloads', outputs: 'Partner destination sync' },
    ai: { owner: 'AI Platform Team', inputs: 'Profile context', outputs: 'NL segmentation and recommendations' },
    ml: { owner: 'ML Platform Team', inputs: 'Feature vectors', outputs: 'Predictive model scores' },
    reporting: { owner: 'Analytics Platform Team', inputs: 'Operational and audience data', outputs: 'Dashboards and BI datasets' },
    unity: { owner: 'Frontend Platform Team', inputs: 'Aggregated APIs', outputs: 'Operator workflows and controls' },
    privacy: { owner: 'Privacy Engineering', inputs: 'Consent + legal policies', outputs: 'Enforced compliance decisions' },
    auth: { owner: 'Security Engineering', inputs: 'User identities', outputs: 'Access and session controls' },
    infra: { owner: 'Cloud Infrastructure Team', inputs: 'Service deployment specs', outputs: 'Runtime compute/storage fabric' },
    observe: { owner: 'SRE & Reliability Team', inputs: 'Metrics and traces', outputs: 'Alerts and reliability actions' },
    cicd: { owner: 'Developer Productivity Team', inputs: 'Source changes', outputs: 'Validated deployments' },
    testing: { owner: 'Quality Engineering Team', inputs: 'Change candidates', outputs: 'Release confidence signals' }
  };

  var FLOW_PATH = ['collect', 'ingest', 'identity', 'profiles', 'audiences', 'journeys', 'activation'];

  var state = {
    container: null,
    width: 0,
    height: 0,
    svg: null,
    simulation: null,
    node: null,
    link: null,
    linkLabel: null,
    nodesData: [],
    linksData: [],
    nodesById: Object.create(null),
    edgeMap: Object.create(null),
    focusNodeId: null,
    flowTimers: [],
    resizeTimeout: null,
    tooltip: null
  };

  function toLinkId(sourceId, targetId) {
    return sourceId + '->' + targetId;
  }

  function normalizeLink(l) {
    return {
      source: typeof l.source === 'object' ? l.source.id : l.source,
      target: typeof l.target === 'object' ? l.target.id : l.target
    };
  }

  function getTooltipEls() {
    var root = document.getElementById('graph-tooltip');
    if (!root) return null;
    return {
      root: root,
      title: root.querySelector('.ds-tt-title') || root.querySelector('.kg-tip-title'),
      desc: root.querySelector('.ds-tt-desc') || root.querySelector('.kg-tip-desc'),
      cat: root.querySelector('.ds-tt-cat') || root.querySelector('.kg-tip-badge'),
      tech: root.querySelector('.ds-tt-tech') || root.querySelector('.kg-tip-tech'),
      deps: root.querySelector('.ds-tt-deps')
    };
  }

  function positionTooltip(event) {
    var els = state.tooltip;
    if (!els || !state.container) return;

    var bounds = state.container.getBoundingClientRect();
    var tipRect = els.root.getBoundingClientRect();
    var x = event.clientX - bounds.left + 18;
    var y = event.clientY - bounds.top - 30;

    var maxX = Math.max(8, state.width - tipRect.width - 8);
    var maxY = Math.max(8, state.height - tipRect.height - 8);

    els.root.style.left = Math.min(Math.max(8, x), maxX) + 'px';
    els.root.style.top = Math.min(Math.max(8, y), maxY) + 'px';
  }

  function setTooltipContent(d) {
    if (!state.tooltip || !d) return;
    var cfg = CATEGORY[d.category] || { color: '#94a3b8', label: 'Service' };
    var deps = getDependencies(d.id);

    if (state.tooltip.title) state.tooltip.title.textContent = d.label;
    if (state.tooltip.desc) state.tooltip.desc.textContent = d.desc;
    if (state.tooltip.tech) state.tooltip.tech.textContent = (d.tech || []).join(' · ');
    if (state.tooltip.cat) {
      state.tooltip.cat.textContent = cfg.label;
      state.tooltip.cat.style.background = cfg.color + '22';
      state.tooltip.cat.style.color = cfg.color;
    }
    if (state.tooltip.deps) {
      state.tooltip.deps.textContent = 'Upstream: ' + deps.upstream.length + ' · Downstream: ' + deps.downstream.length;
    }
  }

  function showTooltip(event, d) {
    if (!state.tooltip) return;
    setTooltipContent(d);
    positionTooltip(event);
    state.tooltip.root.classList.add('visible');
  }

  function hideTooltip() {
    if (!state.tooltip) return;
    state.tooltip.root.classList.remove('visible');
  }

  function clearFlowTimers() {
    while (state.flowTimers.length) {
      clearTimeout(state.flowTimers.pop());
    }
  }

  function clearVisualState(options) {
    var opts = options || {};

    if (state.node) {
      state.node
        .classed('dimmed', false)
        .classed('highlighted', false)
        .classed('is-active', false)
        .classed('is-upstream', false)
        .classed('is-downstream', false)
        .classed('is-dimmed', false)
        .classed('is-soft-active', false);
    }

    if (state.link) {
      state.link
        .classed('dimmed', false)
        .classed('highlighted', false);
    }

    if (state.linkLabel) {
      state.linkLabel.attr('fill', 'rgba(107,136,170,0.3)');
    }

    if (!opts.keepFlow && state.link) {
      state.link.classed('flow-active', false);
    }
  }

  function getDependencies(id) {
    if (!id || !state.nodesById[id]) {
      return { upstream: [], downstream: [] };
    }

    var upstream = new Set();
    var downstream = new Set();

    var upQueue = [id];
    while (upQueue.length) {
      var upCurrent = upQueue.shift();
      state.linksData.forEach(function (l) {
        var n = normalizeLink(l);
        if (n.target === upCurrent && n.source !== id && !upstream.has(n.source)) {
          upstream.add(n.source);
          upQueue.push(n.source);
        }
      });
    }

    var downQueue = [id];
    while (downQueue.length) {
      var downCurrent = downQueue.shift();
      state.linksData.forEach(function (l) {
        var n = normalizeLink(l);
        if (n.source === downCurrent && n.target !== id && !downstream.has(n.target)) {
          downstream.add(n.target);
          downQueue.push(n.target);
        }
      });
    }

    return {
      upstream: Array.from(upstream),
      downstream: Array.from(downstream)
    };
  }

  function highlight(ids, options) {
    if (!state.node || !state.link || !Array.isArray(ids)) return;

    var opts = options || {};
    var idSet = new Set(ids.filter(Boolean));

    document.documentElement.classList.remove('focus-mode-active');
    state.focusNodeId = null;
    removeSidePanel();

    if (!idSet.size) {
      reset({ keepFlow: !!opts.keepFlow });
      return;
    }

    clearVisualState({ keepFlow: !!opts.keepFlow });

    state.node
      .classed('highlighted', function (d) { return idSet.has(d.id); })
      .classed('is-soft-active', function (d) { return !!opts.softTrail && idSet.has(d.id); })
      .classed('is-dimmed', function (d) { return !idSet.has(d.id); })
      .classed('dimmed', function (d) { return !idSet.has(d.id); });

    state.link
      .classed('dimmed', function (l) {
        var n = normalizeLink(l);
        return !(idSet.has(n.source) || idSet.has(n.target));
      })
      .classed('highlighted', function (l) {
        var n = normalizeLink(l);
        return idSet.has(n.source) && idSet.has(n.target);
      });

    state.linkLabel.attr('fill', function (l) {
      var n = normalizeLink(l);
      return (idSet.has(n.source) || idSet.has(n.target)) ? 'rgba(148,163,184,0.78)' : 'rgba(107,136,170,0.08)';
    });
  }

  function applyHoverState(id) {
    if (!state.node || !state.link || state.focusNodeId) return;

    var connected = new Set([id]);
    state.linksData.forEach(function (l) {
      var n = normalizeLink(l);
      if (n.source === id) connected.add(n.target);
      if (n.target === id) connected.add(n.source);
    });

    state.node
      .classed('is-dimmed', function (d) { return !connected.has(d.id); })
      .classed('dimmed', function (d) { return !connected.has(d.id); })
      .classed('highlighted', function (d) { return connected.has(d.id); });

    state.link
      .classed('dimmed', function (l) {
        var n = normalizeLink(l);
        return n.source !== id && n.target !== id;
      })
      .classed('highlighted', function (l) {
        var n = normalizeLink(l);
        return n.source === id || n.target === id;
      });

    state.linkLabel.attr('fill', function (l) {
      var n = normalizeLink(l);
      return (n.source === id || n.target === id) ? 'rgba(148,163,184,0.78)' : 'rgba(107,136,170,0.06)';
    });
  }

  function linkList(ids, dirLabel) {
    if (!ids.length) {
      return '<div class="kg-sp-io-item"><span class="kg-sp-io-dir ' + dirLabel + '">' + dirLabel.toUpperCase() + '</span><span>None</span></div>';
    }

    return ids.map(function (id) {
      var d = state.nodesById[id];
      return '<div class="kg-sp-io-item"><span class="kg-sp-io-dir ' + dirLabel + '">' + dirLabel.toUpperCase() + '</span><span>' + (d ? d.label : id) + '</span></div>';
    }).join('');
  }

  function renderSidePanel(nodeId, deps) {
    var d = state.nodesById[nodeId];
    if (!d) return;

    var panel = document.getElementById('kg-side-panel');
    if (!panel) {
      panel = document.createElement('aside');
      panel.id = 'kg-side-panel';
      panel.className = 'kg-side-panel';
      document.body.appendChild(panel);
    }

    var meta = NODE_DETAILS[nodeId] || {
      owner: 'Platform Engineering',
      inputs: 'Event or service call',
      outputs: 'Downstream processing'
    };

    panel.innerHTML =
      '<div class="kg-sp-header">' +
      '  <div>' +
      '    <div class="kg-sp-title">' + d.label + '</div>' +
      '    <div class="kg-sp-svc">Owner: ' + meta.owner + '</div>' +
      '  </div>' +
      '  <button class="kg-sp-close" type="button" aria-label="Close focus panel" onclick="window.KG && window.KG.reset()">×</button>' +
      '</div>' +
      '<div class="kg-sp-section">' +
      '  <div class="kg-sp-label">Description</div>' +
      '  <div class="kg-sp-desc">' + d.desc + '</div>' +
      '</div>' +
      '<div class="kg-sp-section">' +
      '  <div class="kg-sp-label">Direct Inputs</div>' +
      '  <div class="kg-sp-io-list">' + linkList(deps.upstream, 'in') + '</div>' +
      '</div>' +
      '<div class="kg-sp-section">' +
      '  <div class="kg-sp-label">Direct Outputs</div>' +
      '  <div class="kg-sp-io-list">' + linkList(deps.downstream, 'out') + '</div>' +
      '</div>' +
      '<div class="kg-sp-section">' +
      '  <div class="kg-sp-label">Technology Stack</div>' +
      '  <div class="kg-sp-tech">' + (d.tech || []).map(function (t) { return '<span class="focus-pill">' + t + '</span>'; }).join('') + '</div>' +
      '</div>' +
      '<button class="focus-action-btn" type="button" onclick="window.location.href=\'' + d.url + '\'">Open Documentation</button>';

    requestAnimationFrame(function () {
      panel.classList.add('open');
    });
  }

  function removeSidePanel() {
    var panel = document.getElementById('kg-side-panel');
    if (panel) panel.classList.remove('open');
  }

  function enterFocusMode(nodeId) {
    if (!state.node || !state.link || !state.nodesById[nodeId]) return;

    clearFlowTimers();
    hideTooltip();

    var deps = getDependencies(nodeId);
    var visible = new Set([nodeId]);
    deps.upstream.forEach(function (id) { visible.add(id); });
    deps.downstream.forEach(function (id) { visible.add(id); });

    state.focusNodeId = nodeId;
    document.documentElement.classList.add('focus-mode-active');

    clearVisualState();

    state.node
      .classed('is-active', function (d) { return d.id === nodeId; })
      .classed('is-upstream', function (d) { return deps.upstream.indexOf(d.id) > -1; })
      .classed('is-downstream', function (d) { return deps.downstream.indexOf(d.id) > -1; })
      .classed('highlighted', function (d) { return visible.has(d.id); })
      .classed('is-dimmed', function (d) { return !visible.has(d.id); })
      .classed('dimmed', function (d) { return !visible.has(d.id); });

    state.link
      .classed('highlighted', function (l) {
        var n = normalizeLink(l);
        return visible.has(n.source) && visible.has(n.target);
      })
      .classed('dimmed', function (l) {
        var n = normalizeLink(l);
        return !(visible.has(n.source) && visible.has(n.target));
      });

    state.linkLabel.attr('fill', function (l) {
      var n = normalizeLink(l);
      return (visible.has(n.source) && visible.has(n.target)) ? 'rgba(148,163,184,0.76)' : 'rgba(107,136,170,0.06)';
    });

    renderSidePanel(nodeId, deps);
  }

  function activateEdge(sourceId, targetId, options) {
    if (!state.link) return false;
    var opts = options || {};
    var edgeId = toLinkId(sourceId, targetId);
    var found = !!state.edgeMap[edgeId];

    if (!opts.append) {
      state.link.classed('flow-active', false);
    }

    if (!found) return false;

    state.link.each(function (l) {
      var n = normalizeLink(l);
      if (toLinkId(n.source, n.target) === edgeId) {
        this.classList.add('flow-active');
      }
    });

    return true;
  }

  function runEventFlowSimulation() {
    if (!state.node || !state.link) return;

    clearFlowTimers();
    reset();

    var visited = [];

    FLOW_PATH.forEach(function (id, idx) {
      var timer = setTimeout(function () {
        visited.push(id);
        highlight(visited, { softTrail: true, keepFlow: true });

        if (idx > 0) {
          activateEdge(FLOW_PATH[idx - 1], id, { append: true });
        }

        if (idx === FLOW_PATH.length - 1) {
          var doneTimer = setTimeout(function () {
            state.link.classed('flow-active', false);
          }, 950);
          state.flowTimers.push(doneTimer);
        }
      }, idx * 700);

      state.flowTimers.push(timer);
    });
  }

  function reset(options) {
    var opts = options || {};
    clearFlowTimers();
    hideTooltip();

    state.focusNodeId = null;
    document.documentElement.classList.remove('focus-mode-active');
    removeSidePanel();

    clearVisualState({ keepFlow: !!opts.keepFlow });
  }

  function handleResize() {
    if (!state.container || !state.svg || !state.simulation) return;

    state.width = Math.max(320, state.container.clientWidth || state.width || 320);
    state.height = Math.max(420, state.container.clientHeight || state.height || 420);

    state.svg.attr('viewBox', '0 0 ' + state.width + ' ' + state.height);

    state.simulation
      .force('center', d3.forceCenter(state.width / 2, state.height / 2))
      .force('x', d3.forceX(state.width / 2).strength(0.03))
      .force('y', d3.forceY(state.height / 2).strength(0.03));

    state.simulation.alpha(0.12).restart();
  }

  function buildLegend(containerId) {
    var el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = '';
    Object.keys(CATEGORY).forEach(function (cat) {
      var item = document.createElement('div');
      item.className = 'ds-legend-item';
      item.innerHTML =
        '<div class="ds-legend-dot" style="background:' + CATEGORY[cat].color + ';box-shadow:0 0 6px ' + CATEGORY[cat].glow + '"></div>' +
        CATEGORY[cat].label;
      el.appendChild(item);
    });
  }

  function init(containerId) {
    state.container = document.getElementById(containerId);
    if (!state.container || typeof d3 === 'undefined') {
      console.warn('[KG] graph container or d3 not found');
      return;
    }

    state.container.innerHTML = '';
    state.tooltip = getTooltipEls();

    state.width = Math.max(320, state.container.clientWidth || 320);
    state.height = Math.max(420, state.container.clientHeight || 540);

    state.nodesData = NODES.map(function (d) { return Object.assign({}, d); });
    state.linksData = LINKS.map(function (d) { return Object.assign({}, d); });
    state.nodesById = Object.create(null);
    state.edgeMap = Object.create(null);

    state.nodesData.forEach(function (d) {
      state.nodesById[d.id] = d;
    });

    state.linksData.forEach(function (l) {
      state.edgeMap[toLinkId(l.source, l.target)] = true;
    });

    var svg = d3.select(state.container)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', '0 0 ' + state.width + ' ' + state.height)
      .attr('role', 'img')
      .attr('aria-label', 'Interactive architecture dependency graph')
      .style('cursor', 'grab');

    state.svg = svg;

    var defs = svg.append('defs');

    defs.append('marker')
      .attr('id', 'kg-arrow')
      .attr('viewBox', '0 -4 8 8')
      .attr('refX', 30)
      .attr('refY', 0)
      .attr('markerWidth', 5)
      .attr('markerHeight', 5)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-4L8,0L0,4')
      .attr('fill', 'rgba(148,163,184,0.35)');

    Object.keys(CATEGORY).forEach(function (cat) {
      var f = defs.append('filter')
        .attr('id', 'kg-glow-' + cat)
        .attr('x', '-60%')
        .attr('y', '-60%')
        .attr('width', '220%')
        .attr('height', '220%');

      f.append('feGaussianBlur')
        .attr('in', 'SourceGraphic')
        .attr('stdDeviation', '5')
        .attr('result', 'blur');

      var m = f.append('feMerge');
      m.append('feMergeNode').attr('in', 'blur');
      m.append('feMergeNode').attr('in', 'SourceGraphic');
    });

    var grid = svg.append('g').attr('class', 'kg-grid');
    var step = 40;
    for (var x = 0; x < state.width; x += step) {
      grid.append('line')
        .attr('x1', x)
        .attr('y1', 0)
        .attr('x2', x)
        .attr('y2', state.height)
        .attr('stroke', 'rgba(255,255,255,0.02)')
        .attr('stroke-width', 1);
    }
    for (var y = 0; y < state.height; y += step) {
      grid.append('line')
        .attr('x1', 0)
        .attr('y1', y)
        .attr('x2', state.width)
        .attr('y2', y)
        .attr('stroke', 'rgba(255,255,255,0.02)')
        .attr('stroke-width', 1);
    }

    var sim = d3.forceSimulation(state.nodesData)
      .force('link', d3.forceLink(state.linksData).id(function (d) { return d.id; }).distance(145).strength(0.4))
      .force('charge', d3.forceManyBody().strength(-640))
      .force('center', d3.forceCenter(state.width / 2, state.height / 2))
      .force('collide', d3.forceCollide().radius(52).strength(0.9))
      .force('x', d3.forceX(state.width / 2).strength(0.03))
      .force('y', d3.forceY(state.height / 2).strength(0.03));

    state.simulation = sim;

    var linkG = svg.append('g').attr('class', 'kg-links');
    var link = linkG.selectAll('line').data(state.linksData).enter()
      .append('line')
      .attr('class', 'kg-link')
      .attr('stroke', 'rgba(148,163,184,0.14)')
      .attr('stroke-width', 1)
      .attr('marker-end', 'url(#kg-arrow)')
      .attr('data-source', function (d) { return d.source; })
      .attr('data-target', function (d) { return d.target; });

    state.link = link;

    var labelG = svg.append('g').attr('class', 'kg-labels');
    var linkLabel = labelG.selectAll('text').data(state.linksData).enter()
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('font-size', '9px')
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('fill', 'rgba(107,136,170,0.3)')
      .attr('pointer-events', 'none')
      .text(function (d) { return d.label; });

    state.linkLabel = linkLabel;

    var nodeG = svg.append('g').attr('class', 'kg-nodes');
    var node = nodeG.selectAll('g').data(state.nodesData).enter()
      .append('g')
      .attr('class', 'kg-node')
      .attr('data-id', function (d) { return d.id; })
      .call(d3.drag()
        .on('start', function (event, d) {
          if (!event.active) sim.alphaTarget(0.2).restart();
          d.fx = d.x;
          d.fy = d.y;
          svg.style('cursor', 'grabbing');
        })
        .on('drag', function (event, d) {
          d.fx = Math.max(42, Math.min(state.width - 42, event.x));
          d.fy = Math.max(42, Math.min(state.height - 42, event.y));
        })
        .on('end', function (event, d) {
          if (!event.active) sim.alphaTarget(0);
          d.fx = null;
          d.fy = null;
          svg.style('cursor', 'grab');
        }));

    state.node = node;

    node.append('circle')
      .attr('r', 28)
      .attr('fill', 'none')
      .attr('stroke', function (d) { return CATEGORY[d.category].color; })
      .attr('stroke-width', 0.6)
      .attr('stroke-dasharray', '3 4')
      .attr('opacity', 0.35);

    node.append('circle')
      .attr('r', 20)
      .attr('class', 'kg-node-circle')
      .attr('fill', function (d) { return CATEGORY[d.category].color + '1a'; })
      .attr('stroke', function (d) { return CATEGORY[d.category].color; })
      .attr('stroke-width', 1.6)
      .style('filter', function (d) { return 'url(#kg-glow-' + d.category + ')'; });

    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('font-size', '8px')
      .attr('font-weight', '700')
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('fill', function (d) { return CATEGORY[d.category].color; })
      .attr('letter-spacing', '0.5px')
      .attr('pointer-events', 'none')
      .text(function (d) { return d.id.substring(0, 3).toUpperCase(); });

    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('y', 36)
      .attr('font-size', '10.5px')
      .attr('font-weight', '500')
      .attr('font-family', 'Inter, sans-serif')
      .attr('fill', 'rgba(220,232,255,0.65)')
      .attr('pointer-events', 'none')
      .text(function (d) { return d.label; });

    node
      .on('mouseenter', function (event, d) {
        applyHoverState(d.id);
        showTooltip(event, d);
      })
      .on('mousemove', function (event) {
        positionTooltip(event);
      })
      .on('mouseleave', function () {
        if (!state.focusNodeId) {
          clearVisualState();
        }
        hideTooltip();
      })
      .on('click', function (event, d) {
        event.preventDefault();
        event.stopPropagation();
        if (state.focusNodeId === d.id) {
          reset();
          return;
        }
        enterFocusMode(d.id);
      })
      .on('dblclick', function (event, d) {
        event.preventDefault();
        event.stopPropagation();
        window.location.href = d.url;
      });

    svg.on('click', function (event) {
      var target = event.target;
      var isBackground = target === this || target.tagName.toLowerCase() === 'svg' || target.classList.contains('kg-grid');
      if (isBackground && state.focusNodeId) {
        reset();
      }
    });

    sim.on('tick', function () {
      var pad = 40;

      state.nodesData.forEach(function (d) {
        d.x = Math.max(pad, Math.min(state.width - pad, d.x));
        d.y = Math.max(pad, Math.min(state.height - pad, d.y));
      });

      link
        .attr('x1', function (d) { return d.source.x; })
        .attr('y1', function (d) { return d.source.y; })
        .attr('x2', function (d) { return d.target.x; })
        .attr('y2', function (d) { return d.target.y; });

      linkLabel
        .attr('x', function (d) { return (d.source.x + d.target.x) / 2; })
        .attr('y', function (d) { return (d.source.y + d.target.y) / 2; });

      node.attr('transform', function (d) {
        return 'translate(' + d.x + ',' + d.y + ')';
      });
    });

    if (typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(function () {
        clearTimeout(state.resizeTimeout);
        state.resizeTimeout = setTimeout(handleResize, 120);
      }).observe(state.container);
    }

    global.KG = {
      highlight: highlight,
      reset: reset,
      focusNode: function (id) {
        if (!id || !state.nodesById[id]) return;
        enterFocusMode(id);
      },
      activateEdge: activateEdge,
      getNodeData: function (id) {
        if (!id || !state.nodesById[id]) return null;
        var nodeData = state.nodesById[id];
        var deps = getDependencies(id);
        return {
          id: nodeData.id,
          label: nodeData.label,
          category: nodeData.category,
          url: nodeData.url,
          desc: nodeData.desc,
          tech: (nodeData.tech || []).slice(),
          owner: (NODE_DETAILS[id] && NODE_DETAILS[id].owner) || 'Platform Engineering',
          dependencies: deps
        };
      },
      getDependencies: getDependencies,
      simulateEventFlow: runEventFlowSimulation,
      reheat: function () {
        if (!state.simulation) return;
        state.simulation.alpha(0.28).restart();
      }
    };

    var resetBtn = document.getElementById('btn-reset-graph');
    if (resetBtn && !resetBtn.dataset.kgBound) {
      resetBtn.dataset.kgBound = 'true';
      resetBtn.addEventListener('click', function (event) {
        event.preventDefault();
        reset();
      });
    }

    window.dispatchEvent(new CustomEvent('kg:ready'));
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('knowledge-graph')) init('knowledge-graph');
    if (document.getElementById('graph-legend')) buildLegend('graph-legend');
  });

})(window);
