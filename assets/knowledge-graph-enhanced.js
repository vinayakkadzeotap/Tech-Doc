/* ═══════════════════════════════════════════════════════════════════
   ZEOTAP CDP — ENHANCED KNOWLEDGE GRAPH ENGINE v2026.2
   D3 v7 Force-Directed Platform Architecture Map
   
   Features:
   • Architecture Layer Visualization
   • Focus Mode with Dependency Highlighting
   • Data Flow Animation System
   • Optimized Performance (50+ nodes)
   • Enhanced Tooltips
   • Mission Mode Integration
   ═══════════════════════════════════════════════════════════════════ */
(function(global) {
  'use strict';

  /* ── ARCHITECTURE LAYERS & NODE DATA ───────────────────────── */
  var LAYERS = {
    collection: { order: 1, label: 'Data Collection', color: '#06b6d4', y: 0.1 },
    ingestion: { order: 2, label: 'Ingestion & Processing', color: '#06b6d4', y: 0.2 },
    identity: { order: 3, label: 'Identity & Resolution', color: '#3b82f6', y: 0.3 },
    profile: { order: 4, label: 'Profile & Storage', color: '#8b5cf6', y: 0.4 },
    processing: { order: 5, label: 'Intelligence & Processing', color: '#10b981', y: 0.5 },
    activation: { order: 6, label: 'Activation & Journey', color: '#f59e0b', y: 0.6 },
    analytics: { order: 7, label: 'Analytics & Reporting', color: '#ec4899', y: 0.7 },
    compliance: { order: 8, label: 'Governance & Compliance', color: '#f97316', y: 0.8 },
  };

  var NODES = [
    { id:'collect',   label:'Data Collection',   layer:'collection',   category:'ingestion',   url:'02-data-collection.html',
      desc:'analytics-sdk (JS/TS), ZeotapCollect (iOS/Swift), Android SDK, SmartPixel, GTM templates. Tracks events from web, mobile, CRM, and server-side sources.',
      tech:['JS/TS','Swift','Kotlin','GTM'] },
    { id:'ingest',    label:'Data Ingestion',     layer:'ingestion',   category:'ingestion',   url:'03-data-ingestion.html',
      desc:'daap pipelines — real-time Pub/Sub streams + batch GCS→BigQuery ETL via Apache Beam, CDAP, and Spark on GKE.',
      tech:['Java','Scala','Beam','CDAP'] },
    { id:'identity',  label:'Identity Graph',     layer:'identity',   category:'core',        url:'03-identity-resolution.html',
      desc:'id-graph-lib-v2-go in Go 1.24. Resolves cookies, device IDs, emails, phones → UCID. Stored in BigTable + Redis with PGP-encrypted PII.',
      tech:['Go 1.24','BigTable','Redis'] },
    { id:'profiles',  label:'Profile Store',      layer:'profile',   category:'storage',     url:'05-profile-store.html',
      desc:'Delta Lake on GCS. ACID transactions, schema evolution, time-travel queries. 7-module Maven project (Scala/Java). Petabyte-scale unified profiles.',
      tech:['Scala','Delta Lake','GCS'] },
    { id:'audiences', label:'Audiences',          layer:'processing',   category:'activation',  url:'06-audience-management.html',
      desc:'Real-time segment evaluation engine. Boolean + SQL rule builder. Streaming membership updates via Pub/Sub. Supports 18K+ active segments.',
      tech:['Scala','BigQuery','Pub/Sub'] },
    { id:'journeys',  label:'Customer Journeys',  layer:'activation',   category:'activation',  url:'07-customer-journeys.html',
      desc:'Multi-step orchestration with event triggers, time delays, A/B splits, and frequency caps. Journey state persisted in Redis + BigTable.',
      tech:['Java','Kafka','Redis'] },
    { id:'activation',label:'Data Activation',    layer:'activation',   category:'activation',  url:'08-data-activation.html',
      desc:'100+ destination connectors — DSPs, CRMs, email, push, webhooks. Batched export + real-time streaming. Consent-enforced at dispatch.',
      tech:['Java','REST','gRPC'] },
    { id:'ai',        label:'AI / Zoe',           layer:'processing',   category:'intelligence',url:'04-genai-zoe.html',
      desc:'GenAI layer using Google Gemini. Natural-language segmentation, autonomous journey building, MCP protocol integration, vector search.',
      tech:['Python','Gemini','FastAPI'] },
    { id:'ml',        label:'ML Platform',        layer:'processing',   category:'intelligence',url:'10-ml-platform.html',
      desc:'Vertex AI training pipelines. Feature engineering on BigQuery. Churn/LTV/propensity models. Real-time prediction serving via REST.',
      tech:['Python','Vertex AI','TFX'] },
    { id:'reporting', label:'Reporting & BI',     layer:'analytics',   category:'analytics',   url:'11-reporting-bi.html',
      desc:'BigQuery OLAP engine, Druid for real-time metrics, Redshift for ad-hoc. Powers Unity Dashboard and third-party BI tool connectors.',
      tech:['BigQuery','Druid','Redshift'] },
    { id:'unity',     label:'Unity Dashboard',    layer:'analytics',   category:'analytics',   url:'12-unity-dashboard.html',
      desc:'React + TypeScript SPA. Unified UI for segment building, journey design, destination management. GraphQL + REST API layer.',
      tech:['React','TypeScript','GraphQL'] },
    { id:'privacy',   label:'Privacy & GDPR',     layer:'compliance',   category:'compliance',  url:'13-privacy-gdpr.html',
      desc:'Consent management system, GDPR Art.17 erasure pipelines (7-10 day SLA), data residency controls, CCPA compliance enforcement.',
      tech:['Java','Postgres','Delta Lake'] },
    { id:'auth',      label:'Auth & IAM',         layer:'compliance',   category:'security',    url:'14-auth-iam.html',
      desc:'OAuth 2.0 + PKCE, SAML SSO (Okta/Azure AD), RBAC with org hierarchy, JWT token lifecycle, API key rotation and revocation.',
      tech:['Keycloak','JWT','SAML'] },
    { id:'infra',     label:'Infrastructure',     layer:'compliance',   category:'platform',    url:'15-infrastructure.html',
      desc:'GKE multi-tenant clusters, Terraform IaC, Helm 3 charts, Cloudflare WAF, multi-region GCP primary + AWS failover. 497 microservice repos.',
      tech:['GKE','Terraform','Helm 3'] },
    { id:'observe',   label:'Observability',      layer:'compliance',   category:'platform',    url:'16-observability.html',
      desc:'Prometheus + Grafana, Cloud Trace, OpenTelemetry collector, Alertmanager PagerDuty routing. SLO dashboards per service.',
      tech:['Prometheus','Grafana','OTel'] },
    { id:'cicd',      label:'CI/CD',              layer:'compliance',   category:'platform',    url:'17-cicd.html',
      desc:'Harness pipelines, GitHub Actions for PR validation, progressive blue/green deploys, automated rollback on SLO breach.',
      tech:['Harness','GitHub','Docker'] },
    { id:'testing',   label:'Testing & QA',       layer:'compliance',   category:'platform',    url:'18-testing.html',
      desc:'JUnit/Mockito unit tests, WireMock contract tests, Playwright E2E, k6 load testing, chaos engineering via Chaos Monkey.',
      tech:['JUnit','k6','Playwright'] },
  ];

  var LINKS = [
    { source:'collect',   target:'ingest',    label:'raw events',      strength:0.5 },
    { source:'ingest',    target:'identity',  label:'IDs',             strength:0.5 },
    { source:'ingest',    target:'profiles',  label:'attributes',      strength:0.5 },
    { source:'identity',  target:'profiles',  label:'UCID',            strength:0.6 },
    { source:'profiles',  target:'audiences', label:'traits',          strength:0.5 },
    { source:'profiles',  target:'ai',        label:'context',         strength:0.4 },
    { source:'profiles',  target:'ml',        label:'features',        strength:0.4 },
    { source:'profiles',  target:'reporting', label:'analytics',       strength:0.3 },
    { source:'audiences', target:'journeys',  label:'membership',      strength:0.5 },
    { source:'audiences', target:'activation',label:'cohorts',         strength:0.5 },
    { source:'audiences', target:'reporting', label:'metrics',         strength:0.3 },
    { source:'journeys',  target:'activation',label:'triggers',        strength:0.5 },
    { source:'ml',        target:'profiles',  label:'scores',          strength:0.4 },
    { source:'ai',        target:'audiences', label:'NL query',        strength:0.4 },
    { source:'reporting', target:'unity',     label:'metrics',         strength:0.4 },
    { source:'privacy',   target:'identity',  label:'consent',         strength:0.35 },
    { source:'privacy',   target:'activation',label:'enforcement',     strength:0.35 },
    { source:'auth',      target:'unity',     label:'access',          strength:0.35 },
    { source:'infra',     target:'observe',   label:'telemetry',       strength:0.3 },
    { source:'observe',   target:'infra',     label:'alerts',          strength:0.3 },
  ];

  var CATEGORY = {
    ingestion:    { color:'#06b6d4', glow:'rgba(6,182,212,0.35)',   label:'Ingestion' },
    core:         { color:'#3b82f6', glow:'rgba(59,130,246,0.35)',  label:'Core' },
    storage:      { color:'#8b5cf6', glow:'rgba(139,92,246,0.35)', label:'Storage' },
    activation:   { color:'#f59e0b', glow:'rgba(245,158,11,0.35)', label:'Activation' },
    intelligence: { color:'#10b981', glow:'rgba(16,185,129,0.35)', label:'Intelligence' },
    analytics:    { color:'#ec4899', glow:'rgba(236,72,153,0.35)', label:'Analytics' },
    compliance:   { color:'#f97316', glow:'rgba(249,115,22,0.35)', label:'Compliance' },
    security:     { color:'#ef4444', glow:'rgba(239,68,68,0.35)',  label:'Security' },
    platform:     { color:'#64748b', glow:'rgba(100,116,139,0.35)',label:'Platform' },
  };

  /* ── STATE MANAGEMENT ──────────────────────────────────────– */
  var state = {
    focusMode: false,
    focusNode: null,
    flowAnimation: false,
    selectedLayer: null,
    highlightedIds: new Set(),
    missionMode: false,
    currentMission: null,
  };

  var svg, simulation, nodes, links, node, link, linkLabel;

  /* ── INIT ───────────────────────────────────────────────── */
  function init(containerId) {
    var container = document.getElementById(containerId);
    if (!container || typeof d3 === 'undefined') {
      console.warn('[KG] container or d3 not found'); return;
    }

    var tooltip = document.getElementById('graph-tooltip');
    var W = container.clientWidth;
    var H = container.clientHeight || 540;

    /* SVG Setup */
    svg = d3.select(container)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', '0 0 ' + W + ' ' + H)
      .style('cursor', 'grab')
      .attr('class', 'kg-svg');

    var defs = svg.append('defs');

    /* Gradients */
    ['collection', 'ingestion', 'identity', 'profile', 'processing', 'activation', 'analytics', 'compliance'].forEach(function(layer) {
      var gradient = defs.append('linearGradient')
        .attr('id', 'kg-gradient-' + layer)
        .attr('x1', '0%').attr('y1', '0%')
        .attr('x2', '0%').attr('y2', '100%');
      gradient.append('stop').attr('offset', '0%').attr('stop-color', LAYERS[layer].color).attr('stop-opacity', 0.3);
      gradient.append('stop').attr('offset', '100%').attr('stop-color', LAYERS[layer].color).attr('stop-opacity', 0.05);
    });

    /* Arrow marker */
    defs.append('marker')
      .attr('id', 'kg-arrow')
      .attr('viewBox', '0 -4 8 8').attr('refX', 28).attr('refY', 0)
      .attr('markerWidth', 5).attr('markerHeight', 5).attr('orient', 'auto')
      .append('path').attr('d', 'M0,-4L8,0L0,4')
      .attr('fill', 'rgba(148,163,184,0.25)');

    /* Glow filters */
    Object.keys(CATEGORY).forEach(function(cat) {
      var f = defs.append('filter')
        .attr('id', 'kg-glow-' + cat)
        .attr('x', '-60%').attr('y', '-60%')
        .attr('width', '220%').attr('height', '220%');
      f.append('feGaussianBlur').attr('in', 'SourceGraphic').attr('stdDeviation', '5').attr('result', 'blur');
      var m = f.append('feMerge');
      m.append('feMergeNode').attr('in', 'blur');
      m.append('feMergeNode').attr('in', 'SourceGraphic');
    });

    /* Subtle grid */
    var grid = svg.append('g').attr('class', 'kg-grid');
    var step = 50;
    for (var x = 0; x < W; x += step) {
      grid.append('line')
        .attr('x1', x).attr('y1', 0).attr('x2', x).attr('y2', H)
        .attr('stroke', 'rgba(255,255,255,0.015)').attr('stroke-width', 1);
    }
    for (var y = 0; y < H; y += step) {
      grid.append('line')
        .attr('x1', 0).attr('y1', y).attr('x2', W).attr('y2', y)
        .attr('stroke', 'rgba(255,255,255,0.015)').attr('stroke-width', 1);
    }

    /* Clone data */
    var nodesData = NODES.map(function(d) { return Object.assign({}, d); });
    var linksData = LINKS.map(function(d) { return Object.assign({}, d); });

    /* Simulation with layer-aware positioning */
    simulation = d3.forceSimulation(nodesData)
      .force('link',    d3.forceLink(linksData).id(function(d) { return d.id; }).distance(140).strength(0.4))
      .force('charge',  d3.forceManyBody().strength(-700))
      .force('center',  d3.forceCenter(W / 2, H / 2))
      .force('collide', d3.forceCollide().radius(54).strength(0.8))
      .force('y-layer', d3.forceY(function(d) { return LAYERS[d.layer].y * H; }).strength(0.08))
      .force('x',       d3.forceX(W / 2).strength(0.02))
      .force('y',       d3.forceY(H / 2).strength(0.02));

    /* Links */
    var linkG = svg.append('g').attr('class', 'kg-links');
    link = linkG.selectAll('line').data(linksData).enter()
      .append('line')
      .attr('class', 'kg-link')
      .attr('stroke', 'rgba(148,163,184,0.12)')
      .attr('stroke-width', 1.5)
      .attr('marker-end', 'url(#kg-arrow)')
      .attr('data-source', function(d) { return typeof d.source === 'object' ? d.source.id : d.source; })
      .attr('data-target', function(d) { return typeof d.target === 'object' ? d.target.id : d.target; });

    /* Link labels */
    var labelG = svg.append('g').attr('class', 'kg-labels');
    linkLabel = labelG.selectAll('text').data(linksData).enter()
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('font-size', '9px')
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('fill', 'rgba(107,136,170,0.25)')
      .attr('pointer-events', 'none')
      .text(function(d) { return d.label; });

    /* Nodes */
    var nodeG = svg.append('g').attr('class', 'kg-nodes');
    node = nodeG.selectAll('g').data(nodesData).enter()
      .append('g').attr('class', 'kg-node')
      .attr('data-id', function(d) { return d.id; })
      .attr('data-layer', function(d) { return d.layer; })
      .call(d3.drag()
        .on('start', function(e, d) { if (!e.active) simulation.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; svg.style('cursor','grabbing'); })
        .on('drag',  function(e, d) { d.fx = e.x; d.fy = e.y; })
        .on('end',   function(e, d) { if (!e.active) simulation.alphaTarget(0); d.fx = null; d.fy = null; svg.style('cursor','grab'); })
      );

    /* Outer ring */
    node.append('circle')
      .attr('r', 26)
      .attr('fill', 'none')
      .attr('stroke', function(d) { return CATEGORY[d.category].color; })
      .attr('stroke-width', 0.5)
      .attr('stroke-dasharray', '2 4')
      .attr('opacity', 0.3);

    /* Inner circle */
    node.append('circle')
      .attr('r', 20)
      .attr('class', 'kg-node-circle')
      .attr('fill', function(d) { return CATEGORY[d.category].color + '1a'; })
      .attr('stroke', function(d) { return CATEGORY[d.category].color; })
      .attr('stroke-width', 1.5)
      .style('filter', function(d) { return 'url(#kg-glow-' + d.category + ')'; });

    /* Abbrev inside */
    node.append('text')
      .attr('text-anchor', 'middle').attr('dy', '0.35em')
      .attr('font-size', '8px').attr('font-weight', '700')
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('fill', function(d) { return CATEGORY[d.category].color; })
      .attr('letter-spacing', '0.5px').attr('pointer-events', 'none')
      .text(function(d) { return d.id.substring(0, 3).toUpperCase(); });

    /* Label below */
    node.append('text')
      .attr('text-anchor', 'middle').attr('y', 35)
      .attr('font-size', '10px').attr('font-weight', '500')
      .attr('font-family', 'Inter, sans-serif')
      .attr('fill', 'rgba(220,232,255,0.65)')
      .attr('pointer-events', 'none')
      .text(function(d) { return d.label; });

    /* ── INTERACTIONS ──────────────────────────────────────– */
    node
      .on('mouseenter', function(event, d) {
        var connected = new Set([d.id]);
        linksData.forEach(function(l) {
          var s = typeof l.source === 'object' ? l.source.id : l.source;
          var t = typeof l.target === 'object' ? l.target.id : l.target;
          if (s === d.id) connected.add(t);
          if (t === d.id) connected.add(s);
        });

        node.classed('dimmed', function(n) { return !connected.has(n.id); });
        link.classed('dimmed', function(l) {
          var s = typeof l.source === 'object' ? l.source.id : l.source;
          var t = typeof l.target === 'object' ? l.target.id : l.target;
          return s !== d.id && t !== d.id;
        });
        linkLabel.attr('fill', function(l) {
          var s = typeof l.source === 'object' ? l.source.id : l.source;
          var t = typeof l.target === 'object' ? l.target.id : l.target;
          return (s === d.id || t === d.id) ? 'rgba(148,163,184,0.75)' : 'rgba(107,136,170,0.08)';
        });

        d3.select(this).select('.kg-node-circle')
          .transition().duration(150)
          .attr('r', 24).attr('stroke-width', 2.5)
          .attr('fill', function(n) { return CATEGORY[n.category].color + '45'; });

        if (tooltip) {
          var cfg = CATEGORY[d.category];
          tooltip.querySelector('.ds-tt-title').textContent = d.label;
          tooltip.querySelector('.ds-tt-desc').textContent  = d.desc;
          tooltip.querySelector('.ds-tt-cat').textContent   = cfg.label;
          tooltip.querySelector('.ds-tt-cat').style.background = cfg.color + '22';
          tooltip.querySelector('.ds-tt-cat').style.color      = cfg.color;
          tooltip.querySelector('.ds-tt-tech').textContent  = d.tech.join(' · ');

          var rect = container.getBoundingClientRect();
          var ex = event.clientX - rect.left;
          var ey = event.clientY - rect.top;
          tooltip.style.left = Math.min(ex + 18, W - 270) + 'px';
          tooltip.style.top  = Math.max(ey - 60, 8) + 'px';
          tooltip.classList.add('visible');
        }
      })
      .on('mousemove', function(event) {
        if (tooltip) {
          var rect = container.getBoundingClientRect();
          var ex = event.clientX - rect.left;
          var ey = event.clientY - rect.top;
          tooltip.style.left = Math.min(ex + 18, W - 270) + 'px';
          tooltip.style.top  = Math.max(ey - 60, 8) + 'px';
        }
      })
      .on('mouseleave', function() {
        if (!state.focusMode) {
          node.classed('dimmed', false);
          link.classed('dimmed', false);
          linkLabel.attr('fill', 'rgba(107,136,170,0.25)');
        }
        d3.select(this).select('.kg-node-circle')
          .transition().duration(150)
          .attr('r', 20).attr('stroke-width', 1.5)
          .attr('fill', function(n) { return CATEGORY[n.category].color + '1a'; });
        if (tooltip) tooltip.classList.remove('visible');
      })
      .on('click', function(event, d) {
        if (event.shiftKey) {
          event.preventDefault();
          enterFocusMode(d);
        }
      })
      .on('dblclick', function(event, d) {
        event.preventDefault();
        window.location.href = d.url;
      });

    /* ── TICK ───────────────────────────────────────────────– */
    simulation.on('tick', function() {
      nodesData.forEach(function(d) {
        d.x = Math.max(40, Math.min(W - 40, d.x));
        d.y = Math.max(40, Math.min(H - 40, d.y));
      });
      link
        .attr('x1', function(d) { return d.source.x; })
        .attr('y1', function(d) { return d.source.y; })
        .attr('x2', function(d) { return d.target.x; })
        .attr('y2', function(d) { return d.target.y; });
      linkLabel
        .attr('x', function(d) { return (d.source.x + d.target.x) / 2; })
        .attr('y', function(d) { return (d.source.y + d.target.y) / 2; });
      node.attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });
    });

    /* ── PUBLIC API ──────────────────────────────────────────– */
    global.KG = {
      highlight: function(ids) {
        var idSet = new Set(ids);
        node.classed('dimmed', function(d) { return !idSet.has(d.id); });
        link.classed('dimmed', function(l) {
          var s = typeof l.source === 'object' ? l.source.id : l.source;
          var t = typeof l.target === 'object' ? l.target.id : l.target;
          return !idSet.has(s) && !idSet.has(t);
        });
        linkLabel.attr('fill', function(l) {
          var s = typeof l.source === 'object' ? l.source.id : l.source;
          var t = typeof l.target === 'object' ? l.target.id : l.target;
          return (idSet.has(s) || idSet.has(t)) ? 'rgba(148,163,184,0.75)' : 'rgba(107,136,170,0.04)';
        });
      },
      reset: function() {
        state.focusMode = false;
        node.classed('dimmed', false);
        link.classed('dimmed', false);
        linkLabel.attr('fill', 'rgba(107,136,170,0.25)');
        removeFocusPanel();
      },
      reheat: function() { 
        simulation.alpha(0.4).restart(); 
      },
      animateFlow: function() {
        animateDataFlow();
      },
      enterMissionMode: function(missionId) {
        showMissionPanel(missionId);
      },
    };

    /* ── FOCUS MODE ──────────────────────────────────────────– */
    function enterFocusMode(nodeData) {
      state.focusMode = true;
      state.focusNode = nodeData;
      
      var connected = new Set([nodeData.id]);
      var upstream = new Set([nodeData.id]);
      var downstream = new Set([nodeData.id]);

      linksData.forEach(function(l) {
        var s = typeof l.source === 'object' ? l.source.id : l.source;
        var t = typeof l.target === 'object' ? l.target.id : l.target;
        
        if (s === nodeData.id) { connected.add(t); downstream.add(t); }
        if (t === nodeData.id) { connected.add(s); upstream.add(s); }
      });

      node.classed('dimmed', function(d) { return !connected.has(d.id); });
      link.classed('dimmed', function(l) {
        var s = typeof l.source === 'object' ? l.source.id : l.source;
        var t = typeof l.target === 'object' ? l.target.id : l.target;
        return s !== nodeData.id && t !== nodeData.id && !connected.has(s) && !connected.has(t);
      });

      showFocusPanel(nodeData);
    }

    function showFocusPanel(nodeData) {
      var panel = document.createElement('div');
      panel.className = 'focus-panel';
      panel.id = 'kg-focus-panel';
      
      var html = '<div class="focus-panel-header">' +
        '<h3 class="focus-panel-title">' + nodeData.label + '</h3>' +
        '<button class="focus-panel-close" onclick="KG.reset()">×</button>' +
        '</div>' +
        '<div class="focus-section">' +
        '<label class="focus-label">Category</label>' +
        '<div class="focus-value">' + CATEGORY[nodeData.category].label + '</div>' +
        '</div>' +
        '<div class="focus-section">' +
        '<label class="focus-label">Description</label>' +
        '<div class="focus-value" style="font-size:12px;font-weight:400;">' + nodeData.desc + '</div>' +
        '</div>' +
        '<div class="focus-section">' +
        '<label class="focus-label">Technology Stack</label>' +
        '<div class="focus-inputs">' +
        nodeData.tech.map(function(t) { return '<span class="focus-pill">' + t + '</span>'; }).join('') +
        '</div>' +
        '</div>' +
        '<button class="focus-action-btn" onclick="window.location.href=\'' + nodeData.url + '\'">View Documentation</button>';
      
      panel.innerHTML = html;
      document.body.appendChild(panel);
    }

    function removeFocusPanel() {
      var panel = document.getElementById('kg-focus-panel');
      if (panel) panel.remove();
    }

    /* ── DATA FLOW ANIMATION ─────────────────────────────────– */
    function animateDataFlow() {
      state.flowAnimation = !state.flowAnimation;
      
      if (state.flowAnimation) {
        link.classed('animated-edge', true)
          .attr('stroke-dasharray', '8, 8')
          .style('animation', 'flow-animation 0.7s linear infinite');
      } else {
        link.classed('animated-edge', false)
          .attr('stroke-dasharray', null)
          .style('animation', 'none');
      }
    }

    function showMissionPanel(missionId) {
      state.missionMode = true;
      state.currentMission = missionId;
      // Mission logic will be integrated with main UI
    }

    /* Resize */
    if (typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(function() {
        W = container.clientWidth; H = container.clientHeight;
        svg.attr('viewBox', '0 0 ' + W + ' ' + H);
        simulation.force('center', d3.forceCenter(W / 2, H / 2)).alpha(0.2).restart();
      }).observe(container);
    }

    nodes = nodesData;
  }

  /* ── LEGEND BUILD ───────────────────────────────────────– */
  function buildLegend(containerId) {
    var el = document.getElementById(containerId);
    if (!el) return;
    Object.keys(CATEGORY).forEach(function(cat) {
      var item = document.createElement('div');
      item.className = 'ds-legend-item';
      item.innerHTML =
        '<div class="ds-legend-dot" style="background:' + CATEGORY[cat].color + ';box-shadow:0 0 6px ' + CATEGORY[cat].glow + '"></div>' +
        CATEGORY[cat].label;
      el.appendChild(item);
    });
  }

  /* ── AUTO-INIT ──────────────────────────────────────────– */
  document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('knowledge-graph')) init('knowledge-graph');
    if (document.getElementById('graph-legend'))    buildLegend('graph-legend');
  });

})(window);
