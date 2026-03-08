/* ═══════════════════════════════════════════════════════════════
   ZEOTAP CDP — KNOWLEDGE GRAPH  v4.0  (Canvas 2D + Physics)
   Revamped 3D force-directed graph — cinematic dark theme.
   Star field · Orbit rings · Particle trails · Depth grid.
   ═══════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';

  /* ── DATA ────────────────────────────────────────────────────── */
  var NODES = [
    { id: 'collect',   label: 'Data Collection',   layer: 'collection', category: 'ingestion',
      url: '02-data-collection.html',
      desc: 'analytics-sdk (JS/TS), ZeotapCollect (iOS/Swift), Android SDK, SmartPixel, GTM templates. Tracks events from web, mobile, CRM, and server-side sources.',
      tech: ['JS/TS', 'Swift', 'Kotlin', 'GTM'], inputs: 'Web/Mobile/Server events', outputs: 'Validated raw events', owner: 'Sources & SDK Team' },
    { id: 'ingest',    label: 'Data Ingestion',    layer: 'ingestion',  category: 'ingestion',
      url: '03-data-ingestion.html',
      desc: 'daap pipelines — real-time Pub/Sub streams + batch GCS→BigQuery ETL via Apache Beam, CDAP, and Spark on GKE.',
      tech: ['Java', 'Scala', 'Beam', 'CDAP'], inputs: 'Raw event streams', outputs: 'Canonical enriched events', owner: 'Data Infrastructure Team' },
    { id: 'identity',  label: 'Identity Graph',    layer: 'identity',   category: 'core',
      url: '03-identity-resolution.html',
      desc: 'id-graph-lib-v2-go in Go 1.24. Resolves cookies, device IDs, emails, phones → UCID. Stored in BigTable + Redis with PGP-encrypted PII.',
      tech: ['Go 1.24', 'BigTable', 'Redis'], inputs: 'Device + CRM identifiers', outputs: 'Unified customer ID graph', owner: 'Identity Platform Team' },
    { id: 'profiles',  label: 'Profile Store',     layer: 'profile',    category: 'storage',
      url: '05-profile-store.html',
      desc: 'Delta Lake on GCS. ACID transactions, schema evolution, time-travel queries. Petabyte-scale unified profiles.',
      tech: ['Scala', 'Delta Lake', 'GCS'], inputs: 'Identity graph + events', outputs: 'Unified customer profile', owner: 'Unify Data Team' },
    { id: 'audiences', label: 'Audiences',          layer: 'processing', category: 'activation',
      url: '06-audience-management.html',
      desc: 'Real-time segment evaluation engine. Boolean + SQL rule builder. Streaming membership updates via Pub/Sub. Supports 18K+ active segments.',
      tech: ['Scala', 'BigQuery', 'Pub/Sub'], inputs: 'Profile traits', outputs: 'Segment membership updates', owner: 'Audience Engine Team' },
    { id: 'journeys',  label: 'Customer Journeys', layer: 'activation', category: 'activation',
      url: '07-customer-journeys.html',
      desc: 'Multi-step orchestration with event triggers, time delays, A/B splits, and frequency caps. Journey state persisted in Redis + BigTable.',
      tech: ['Java', 'Kafka', 'Redis'], inputs: 'Audience triggers', outputs: 'Journey execution tasks', owner: 'Orchestrate Team' },
    { id: 'activation',label: 'Data Activation',   layer: 'activation', category: 'activation',
      url: '08-data-activation.html',
      desc: '100+ destination connectors — DSPs, CRMs, email, push, webhooks. Batched export + real-time streaming. Consent-enforced at dispatch.',
      tech: ['Java', 'REST', 'gRPC'], inputs: 'Journey payloads', outputs: 'Partner destination sync', owner: 'Destinations Team' },
    { id: 'ai',        label: 'AI / Zoe',          layer: 'processing', category: 'intelligence',
      url: '04-genai-zoe.html',
      desc: 'GenAI layer using Google Gemini. Natural-language segmentation, autonomous journey building, MCP protocol integration, vector search.',
      tech: ['Python', 'Gemini', 'FastAPI'], inputs: 'Profile context', outputs: 'NL segmentation and recommendations', owner: 'AI Platform Team' },
    { id: 'ml',        label: 'ML Platform',       layer: 'processing', category: 'intelligence',
      url: '10-ml-platform.html',
      desc: 'Vertex AI training pipelines. Feature engineering on BigQuery. Churn/LTV/propensity models. Real-time prediction serving via REST.',
      tech: ['Python', 'Vertex AI', 'TFX'], inputs: 'Feature vectors', outputs: 'Predictive model scores', owner: 'ML Platform Team' },
    { id: 'reporting', label: 'Reporting & BI',    layer: 'analytics',  category: 'analytics',
      url: '11-reporting-bi.html',
      desc: 'BigQuery OLAP engine, Druid for real-time metrics, Redshift for ad-hoc. Powers Unity Dashboard and third-party BI tool connectors.',
      tech: ['BigQuery', 'Druid', 'Redshift'], inputs: 'Operational and audience data', outputs: 'Dashboards and BI datasets', owner: 'Analytics Platform Team' },
    { id: 'unity',     label: 'Unity Dashboard',   layer: 'analytics',  category: 'analytics',
      url: '12-unity-dashboard.html',
      desc: 'React + TypeScript SPA. Unified UI for segment building, journey design, destination management. GraphQL + REST API layer.',
      tech: ['React', 'TypeScript', 'GraphQL'], inputs: 'Aggregated APIs', outputs: 'Operator workflows and controls', owner: 'Frontend Platform Team' },
    { id: 'privacy',   label: 'Privacy & GDPR',    layer: 'compliance', category: 'compliance',
      url: '13-privacy-gdpr.html',
      desc: 'Consent management system, GDPR Art.17 erasure pipelines (7-10 day SLA), data residency controls, CCPA compliance enforcement.',
      tech: ['Java', 'Postgres', 'Delta Lake'], inputs: 'Consent + legal policies', outputs: 'Enforced compliance decisions', owner: 'Privacy Engineering' },
    { id: 'auth',      label: 'Auth & IAM',        layer: 'compliance', category: 'security',
      url: '14-auth-iam.html',
      desc: 'OAuth 2.0 + PKCE, SAML SSO (Okta/Azure AD), RBAC with org hierarchy, JWT token lifecycle, API key rotation and revocation.',
      tech: ['Keycloak', 'JWT', 'SAML'], inputs: 'User identities', outputs: 'Access and session controls', owner: 'Security Engineering' },
    { id: 'infra',     label: 'Infrastructure',    layer: 'compliance', category: 'platform',
      url: '15-infrastructure.html',
      desc: 'GKE multi-tenant clusters, Terraform IaC, Helm 3 charts, Cloudflare WAF, multi-region GCP primary + AWS failover.',
      tech: ['GKE', 'Terraform', 'Helm 3'], inputs: 'Service deployment specs', outputs: 'Runtime compute/storage fabric', owner: 'Cloud Infrastructure Team' },
    { id: 'observe',   label: 'Observability',     layer: 'compliance', category: 'platform',
      url: '16-observability.html',
      desc: 'Prometheus + Grafana, Cloud Trace, OpenTelemetry collector, Alertmanager PagerDuty routing. SLO dashboards per service.',
      tech: ['Prometheus', 'Grafana', 'OTel'], inputs: 'Metrics and traces', outputs: 'Alerts and reliability actions', owner: 'SRE & Reliability Team' },
    { id: 'cicd',      label: 'CI/CD',             layer: 'compliance', category: 'platform',
      url: '17-cicd.html',
      desc: 'Harness pipelines, GitHub Actions for PR validation, progressive blue/green deploys, automated rollback on SLO breach.',
      tech: ['Harness', 'GitHub', 'Docker'], inputs: 'Source changes', outputs: 'Validated deployments', owner: 'Developer Productivity Team' },
    { id: 'testing',   label: 'Testing & QA',      layer: 'compliance', category: 'platform',
      url: '18-testing.html',
      desc: 'JUnit/Mockito unit tests, WireMock contract tests, Playwright E2E, k6 load testing, chaos engineering via Chaos Monkey.',
      tech: ['JUnit', 'k6', 'Playwright'], inputs: 'Change candidates', outputs: 'Release confidence signals', owner: 'Quality Engineering Team' }
  ];

  var LINKS = [
    { source: 'collect',   target: 'ingest',     label: 'raw events' },
    { source: 'ingest',    target: 'identity',   label: 'IDs' },
    { source: 'ingest',    target: 'profiles',   label: 'attributes' },
    { source: 'identity',  target: 'profiles',   label: 'UCID' },
    { source: 'profiles',  target: 'audiences',  label: 'traits' },
    { source: 'profiles',  target: 'ai',         label: 'context' },
    { source: 'profiles',  target: 'ml',         label: 'features' },
    { source: 'profiles',  target: 'reporting',  label: 'analytics' },
    { source: 'audiences', target: 'journeys',   label: 'membership' },
    { source: 'audiences', target: 'activation', label: 'cohorts' },
    { source: 'audiences', target: 'reporting',  label: 'metrics' },
    { source: 'journeys',  target: 'activation', label: 'triggers' },
    { source: 'ml',        target: 'profiles',   label: 'scores' },
    { source: 'ai',        target: 'audiences',  label: 'NL query' },
    { source: 'reporting', target: 'unity',      label: 'metrics' },
    { source: 'privacy',   target: 'identity',   label: 'consent' },
    { source: 'privacy',   target: 'activation', label: 'enforcement' },
    { source: 'auth',      target: 'unity',      label: 'access' },
    { source: 'infra',     target: 'observe',    label: 'telemetry' },
    { source: 'observe',   target: 'infra',      label: 'alerts' }
  ];

  var CATEGORY = {
    ingestion:   { color: '#06b6d4', label: 'Ingestion'    },
    core:        { color: '#3b82f6', label: 'Core'         },
    storage:     { color: '#8b5cf6', label: 'Storage'      },
    activation:  { color: '#f59e0b', label: 'Activation'   },
    intelligence:{ color: '#10b981', label: 'Intelligence' },
    analytics:   { color: '#ec4899', label: 'Analytics'    },
    compliance:  { color: '#f97316', label: 'Compliance'   },
    security:    { color: '#ef4444', label: 'Security'     },
    platform:    { color: '#64748b', label: 'Platform'     }
  };

  /* Nodes that get a decorative orbit ring (high-importance) */
  var ORBIT_NODES = new Set(['profiles', 'identity', 'audiences', 'collect', 'activation', 'ai']);

  /* Category angle on the sphere (degrees around Y axis) */
  var CAT_ANGLE = {
    ingestion: 0, core: 35, storage: 75, activation: 125,
    intelligence: 170, analytics: 210, compliance: 255, security: 295, platform: 330
  };

  /* Vertical layer height */
  var LAYER_H = {
    collection: -260, ingestion: -170, identity: -88,
    profile: -8, processing: 72, activation: 148, analytics: 218, compliance: 275
  };

  var FLOW_PATH = ['collect', 'ingest', 'identity', 'profiles', 'audiences', 'journeys', 'activation'];

  /* ── STATE ──────────────────────────────────────────────────── */
  var canvas, ctx, container;
  var W = 0, H = 0, CX = 0, CY = 0;
  var rafId = null;
  var simTick = 0;
  var WARM = 220;
  var fadeIn = 0;
  var clock = 0;         /* global frame counter for animations */

  /* Camera */
  var rotY = 0;
  var rotX = -0.22;      /* more dramatic top-down tilt */
  var zoom = 0.88;
  var panX = 0, panY = 0;
  var autoRotate = true;
  var autoRotateSpd = 0.0028;   /* slower = more majestic */
  var autoTimer = null;

  /* Focus / highlight */
  var focusedId = null;
  var visibleSet = new Set();
  var flowRunning = false;
  var flowTimers = [];

  /* Interaction */
  var hoveredNode = null;
  var dragNode = null;
  var dragBase = null;
  var isPanning = false;
  var panAnchor = null;
  var lastMouse = { x: 0, y: 0 };
  var tooltip = null;

  /* Physics nodes & links */
  var SN = [];
  var SL = [];

  /* Particles */
  var PTCL_PER_LINK = 8;
  var ptcl = [];   /* {li, t, spd, trailLen} */

  /* Star field */
  var STARS = [];
  var NUM_STARS = 280;

  /* ── HELPERS ──────────────────────────────────────────────── */
  function nodeById(id) { return NODES.find(function (n) { return n.id === id; }); }

  function getDeps(id) {
    var up = new Set(), dn = new Set();
    var q = [id];
    while (q.length) {
      var c = q.shift();
      LINKS.forEach(function (l) {
        if (l.target === c && l.source !== id && !up.has(l.source)) { up.add(l.source); q.push(l.source); }
      });
    }
    q = [id];
    while (q.length) {
      var c2 = q.shift();
      LINKS.forEach(function (l) {
        if (l.source === c2 && l.target !== id && !dn.has(l.target)) { dn.add(l.target); q.push(l.target); }
      });
    }
    return { upstream: Array.from(up), downstream: Array.from(dn) };
  }

  function hexToRgb(hex) {
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(3, 5), 16);
    var b = parseInt(hex.slice(5, 7), 16);
    return { r: r, g: g, b: b };
  }

  function colorAlpha(hex, a) {
    var c = hexToRgb(hex);
    return 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + a + ')';
  }

  function lightenColor(hex, amt) {
    var c = hexToRgb(hex);
    return 'rgb(' +
      Math.min(255, Math.round(c.r + (255 - c.r) * amt)) + ',' +
      Math.min(255, Math.round(c.g + (255 - c.g) * amt)) + ',' +
      Math.min(255, Math.round(c.b + (255 - c.b) * amt)) + ')';
  }

  function lerpColor(hex1, hex2, t) {
    var a = hexToRgb(hex1), b = hexToRgb(hex2);
    return 'rgb(' +
      Math.round(a.r + (b.r - a.r) * t) + ',' +
      Math.round(a.g + (b.g - a.g) * t) + ',' +
      Math.round(a.b + (b.b - a.b) * t) + ')';
  }

  /* lightenColor + alpha in one step — avoids passing rgb() into colorAlpha() */
  function colorAlphaLighten(hex, amt, a) {
    var c = hexToRgb(hex);
    var r = Math.min(255, Math.round(c.r + (255 - c.r) * amt));
    var g = Math.min(255, Math.round(c.g + (255 - c.g) * amt));
    var b = Math.min(255, Math.round(c.b + (255 - c.b) * amt));
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
  }

  /* ── STAR FIELD INIT ──────────────────────────────────────── */
  function initStars() {
    STARS = [];
    for (var i = 0; i < NUM_STARS; i++) {
      STARS.push({
        x: Math.random(),         /* 0-1 normalized */
        y: Math.random(),
        r: Math.random() * 1.2 + 0.2,
        a: Math.random() * 0.6 + 0.1,
        twinkleSpd: Math.random() * 0.02 + 0.005,
        twinkleOff: Math.random() * Math.PI * 2
      });
    }
  }

  /* ── PHYSICS ─────────────────────────────────────────────── */
  function initSim() {
    var R = 340;   /* wider layout radius */
    SN = NODES.map(function (n) {
      var a = ((CAT_ANGLE[n.category] || 0) + (Math.random() - 0.5) * 22) * Math.PI / 180;
      return {
        id: n.id, nd: n,
        x: R * Math.sin(a) + (Math.random() - 0.5) * 32,
        y: (LAYER_H[n.layer] || 0) + (Math.random() - 0.5) * 28,
        z: R * Math.cos(a) + (Math.random() - 0.5) * 32,
        vx: 0, vy: 0, vz: 0, pinned: false
      };
    });

    SL = LINKS.map(function (l) {
      var si = NODES.findIndex(function (n) { return n.id === l.source; });
      var ti = NODES.findIndex(function (n) { return n.id === l.target; });
      return { si: si, ti: ti, label: l.label };
    }).filter(function (l) { return l.si >= 0 && l.ti >= 0; });

    SL.forEach(function (l, li) {
      for (var p = 0; p < PTCL_PER_LINK; p++) {
        ptcl.push({
          li: li,
          t: p / PTCL_PER_LINK,
          spd: 0.003 + Math.random() * 0.0025,
          trail: []   /* trail history [{x,y}] */
        });
      }
    });

    for (var i = 0; i < WARM; i++) tickPhysics(1.0);
  }

  function tickPhysics(alpha) {
    alpha = (alpha === undefined) ? 0.3 : alpha;
    var REP = 26000, SLEN = 220, SK2 = 0.04, DAMP = 0.86, CK = 0.004;

    SN.forEach(function (n) {
      if (n.pinned) return;
      n.vx -= n.x * CK * alpha;
      n.vy -= n.y * CK * 0.55 * alpha;
      n.vz -= n.z * CK * alpha;
    });

    for (var i = 0; i < SN.length; i++) {
      for (var j = i + 1; j < SN.length; j++) {
        var a = SN[i], b = SN[j];
        var dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z;
        var d2 = dx * dx + dy * dy + dz * dz + 1;
        var d = Math.sqrt(d2);
        var f = REP / d2 * alpha;
        var fx = f * dx / d, fy = f * dy / d, fz = f * dz / d;
        if (!a.pinned) { a.vx += fx; a.vy += fy; a.vz += fz; }
        if (!b.pinned) { b.vx -= fx; b.vy -= fy; b.vz -= fz; }
      }
    }

    SL.forEach(function (l) {
      var a = SN[l.si], b = SN[l.ti];
      if (!a || !b) return;
      var dx = b.x - a.x, dy = b.y - a.y, dz = b.z - a.z;
      var d = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
      var stretch = (d - SLEN) * SK2 * alpha;
      var fx = stretch * dx / d, fy = stretch * dy / d, fz = stretch * dz / d;
      if (!a.pinned) { a.vx += fx; a.vy += fy; a.vz += fz; }
      if (!b.pinned) { b.vx -= fx; b.vy -= fy; b.vz -= fz; }
    });

    SN.forEach(function (n) {
      if (n.pinned) return;
      n.vx *= DAMP; n.vy *= DAMP; n.vz *= DAMP;
      n.x += n.vx; n.y += n.vy; n.z += n.vz;
    });
  }

  /* ── PROJECTION ──────────────────────────────────────────── */
  function project(x, y, z) {
    var cosY = Math.cos(rotY), sinY = Math.sin(rotY);
    var rx = x * cosY - z * sinY;
    var ry1 = y;
    var rz = x * sinY + z * cosY;

    var cosX = Math.cos(rotX), sinX = Math.sin(rotX);
    var ry = ry1 * cosX - rz * sinX;
    var rz2 = ry1 * sinX + rz * cosX;

    var FOCAL = 520;
    var d = FOCAL / (FOCAL + rz2 + 60);

    return {
      sx: CX + panX + rx * zoom * d,
      sy: CY + panY + ry * zoom * d,
      rz: rz2,
      depth: d
    };
  }

  function buildProjected() {
    return SN.map(function (n, i) {
      var p = project(n.x, n.y, n.z);
      return { i: i, n: n, sx: p.sx, sy: p.sy, rz: p.rz, depth: p.depth };
    });
  }

  /* ── NODE VISUAL PROPERTIES ──────────────────────────────── */
  function nodeR(nd, depth) {
    var base = focusedId
      ? (nd.id === focusedId ? 26 : visibleSet.has(nd.id) ? 18 : 9)
      : 16;
    /* Orbit nodes get a slight size bonus */
    if (!focusedId && ORBIT_NODES.has(nd.id)) base += 4;
    return base * depth;
  }

  function nodeAlpha(nd) {
    if (!focusedId) return 1;
    if (nd.id === focusedId) return 1;
    return visibleSet.has(nd.id) ? 0.95 : 0.12;
  }

  function linkAlpha(si, ti) {
    if (!focusedId) return 0.55;
    return (visibleSet.has(SN[si].id) && visibleSet.has(SN[ti].id)) ? 0.95 : 0.04;
  }

  /* ── RENDER ──────────────────────────────────────────────── */
  function render() {
    if (autoRotate) rotY += autoRotateSpd;
    clock++;

    fadeIn = Math.min(1, fadeIn + 0.018);

    if (simTick < WARM + 400 || dragNode) tickPhysics(simTick < WARM + 100 ? 0.8 : 0.25);
    else if (simTick % 4 === 0) tickPhysics(0.15);
    simTick++;

    /* Advance particles & capture trail */
    ptcl.forEach(function (p) {
      var l = SL[p.li];
      if (!l) return;
      var active = !focusedId || (visibleSet.has(SN[l.si].id) && visibleSet.has(SN[l.ti].id));
      if (!active) { p.trail = []; return; }

      var ap = buildBezierPoint(p.li, p.t);
      p.trail.push({ x: ap.x, y: ap.y });
      if (p.trail.length > 12) p.trail.shift();

      p.t = (p.t + p.spd) % 1;
    });

    /* ── DRAW BACKGROUND ──── */
    ctx.clearRect(0, 0, W, H);

    /* Deep space base */
    var bg = ctx.createRadialGradient(CX, CY * 0.85, 0, CX, CY, Math.max(W, H) * 0.75);
    bg.addColorStop(0, '#0c1829');
    bg.addColorStop(0.45, '#07101f');
    bg.addColorStop(1, '#020a14');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    /* Nebula glow — large soft corona behind node cluster */
    ctx.save();
    var nebR = Math.min(W, H) * 0.42;
    var neb = ctx.createRadialGradient(CX + panX, CY + panY - 20, 0, CX + panX, CY + panY - 20, nebR);
    neb.addColorStop(0, 'rgba(56,130,246,0.055)');
    neb.addColorStop(0.4, 'rgba(56,100,200,0.03)');
    neb.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = neb;
    ctx.beginPath();
    ctx.arc(CX + panX, CY + panY - 20, nebR, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();

    /* Star field */
    ctx.save();
    STARS.forEach(function (s) {
      var twinkle = 0.5 + 0.5 * Math.sin(clock * s.twinkleSpd + s.twinkleOff);
      var alpha = s.a * twinkle * fadeIn;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#e8f0ff';
      ctx.beginPath();
      ctx.arc(s.x * W, s.y * H, s.r, 0, 2 * Math.PI);
      ctx.fill();
    });
    ctx.restore();

    ctx.globalAlpha = fadeIn;

    var proj = buildProjected();
    var sorted = proj.slice().sort(function (a, b) { return b.rz - a.rz; });

    /* ── DRAW DEPTH GRID ──── */
    drawDepthGrid();

    /* ── DRAW EDGES ──── */
    SL.forEach(function (l, li) {
      var ap = proj[l.si], bp = proj[l.ti];
      var a = linkAlpha(l.si, l.ti);
      if (a < 0.02) return;

      var srcCat = CATEGORY[SN[l.si].nd.category] || { color: '#64748b' };
      var tgtCat = CATEGORY[SN[l.ti].nd.category] || { color: '#64748b' };
      var srcColor = srcCat.color;
      var tgtColor = tgtCat.color;

      var mx = (ap.sx + bp.sx) / 2;
      var my = (ap.sy + bp.sy) / 2;
      var edx = bp.sx - ap.sx, edy = bp.sy - ap.sy;
      var cpx = mx - edy * 0.16, cpy = my + edx * 0.16;

      ctx.save();
      ctx.globalAlpha = a * fadeIn;

      /* Glow layer — wide, soft */
      if (a > 0.35) {
        ctx.strokeStyle = colorAlpha(srcColor, a * 0.35);
        ctx.lineWidth = a > 0.7 ? 7 : 4;
        ctx.shadowColor = srcColor;
        ctx.shadowBlur = a > 0.7 ? 22 : 10;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(ap.sx, ap.sy);
        ctx.quadraticCurveTo(cpx, cpy, bp.sx, bp.sy);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      /* Core line — gradient from src to tgt color */
      var lineGrd = ctx.createLinearGradient(ap.sx, ap.sy, bp.sx, bp.sy);
      lineGrd.addColorStop(0, colorAlpha(srcColor, a));
      lineGrd.addColorStop(1, colorAlpha(tgtColor, a * 0.85));
      ctx.strokeStyle = lineGrd;
      ctx.lineWidth = a > 0.7 ? 2.2 : 1.4;
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.moveTo(ap.sx, ap.sy);
      ctx.quadraticCurveTo(cpx, cpy, bp.sx, bp.sy);
      ctx.stroke();

      /* Arrowhead at target */
      if (a > 0.2) {
        var t2 = 0.93;
        var ax2 = (1-t2)*(1-t2)*ap.sx + 2*(1-t2)*t2*cpx + t2*t2*bp.sx;
        var ay2 = (1-t2)*(1-t2)*ap.sy + 2*(1-t2)*t2*cpy + t2*t2*bp.sy;
        var tdx = ax2 - bp.sx, tdy = ay2 - bp.sy;
        var tl = Math.sqrt(tdx*tdx + tdy*tdy) || 1;
        tdx /= tl; tdy /= tl;
        var as = a > 0.7 ? 9 : 6;
        ctx.fillStyle = colorAlpha(tgtColor, a * 0.95);
        ctx.shadowColor = tgtColor;
        ctx.shadowBlur = a > 0.5 ? 10 : 2;
        ctx.beginPath();
        ctx.moveTo(bp.sx, bp.sy);
        ctx.lineTo(bp.sx + tdx*as - tdy*as*0.45, bp.sy + tdy*as + tdx*as*0.45);
        ctx.lineTo(bp.sx + tdx*as + tdy*as*0.45, bp.sy + tdy*as - tdx*as*0.45);
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();
    });

    /* ── DRAW PARTICLE TRAILS ──── */
    ptcl.forEach(function (p) {
      var l = SL[p.li];
      if (!l || !p.trail || p.trail.length < 2) return;
      var a = linkAlpha(l.si, l.ti);
      if (a < 0.08) return;

      var color = (CATEGORY[SN[l.si].nd.category] || { color: '#60a5fa' }).color;
      var ap2 = proj[l.si], bp2 = proj[l.ti];
      var depth = (ap2.depth + bp2.depth) / 2;
      var pr = Math.max(2.5, 4.5 * depth);

      ctx.save();
      /* Draw trail */
      for (var i = 0; i < p.trail.length - 1; i++) {
        var trailAlpha = (i / p.trail.length) * a * 0.6 * fadeIn;
        var trailR = pr * (i / p.trail.length) * 0.8;
        ctx.globalAlpha = trailAlpha;
        ctx.fillStyle = colorAlpha(color, 0.7);
        ctx.shadowColor = color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.trail[i].x, p.trail[i].y, Math.max(0.8, trailR), 0, 2 * Math.PI);
        ctx.fill();
      }
      /* Head particle */
      var head = p.trail[p.trail.length - 1];
      ctx.globalAlpha = a * 0.98 * fadeIn;
      ctx.shadowColor = color;
      ctx.shadowBlur = 18;
      ctx.fillStyle = lightenColor(color, 0.5);
      ctx.beginPath();
      ctx.arc(head.x, head.y, pr, 0, 2 * Math.PI);
      ctx.fill();
      /* Bright core */
      ctx.globalAlpha = a * fadeIn;
      ctx.shadowBlur = 6;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(head.x, head.y, pr * 0.38, 0, 2 * Math.PI);
      ctx.fill();

      ctx.restore();
    });

    /* ── DRAW NODES (back to front) ──── */
    sorted.forEach(function (p) {
      var nd = p.n.nd;
      var cat = CATEGORY[nd.category] || { color: '#64748b' };
      var color = cat.color;
      var alpha = nodeAlpha(nd);
      var r = nodeR(nd, p.depth);
      var isHov = hoveredNode && hoveredNode.id === nd.id;
      var isFoc = focusedId === nd.id;
      var pulse = 1 + 0.06 * Math.sin(clock * 0.035 + nd.id.length * 1.3);

      var fog = 0.55 + 0.45 * p.depth;
      var finalAlpha = alpha * fog * fadeIn;
      if (finalAlpha < 0.01) return;

      ctx.save();
      ctx.globalAlpha = finalAlpha;

      /* Orbit ring for important nodes */
      if (ORBIT_NODES.has(nd.id) && !focusedId || isFoc) {
        var orbitR = r * 2.0 * pulse;
        ctx.save();
        ctx.globalAlpha = finalAlpha * (isFoc ? 0.55 : 0.28);
        ctx.strokeStyle = colorAlpha(color, 0.7);
        ctx.lineWidth = isFoc ? 1.8 : 1.0;
        ctx.shadowColor = color;
        ctx.shadowBlur = isFoc ? 18 : 8;
        ctx.setLineDash([4, 6]);
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, orbitR, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      }

      /* Outer halo corona */
      var coronaR = r * (isHov || isFoc ? 3.2 : 2.2) * (isFoc ? pulse : 1);
      var coronaGrd = ctx.createRadialGradient(p.sx, p.sy, r * 0.6, p.sx, p.sy, coronaR);
      coronaGrd.addColorStop(0, colorAlpha(color, isHov || isFoc ? 0.28 : 0.12));
      coronaGrd.addColorStop(0.5, colorAlpha(color, isHov || isFoc ? 0.08 : 0.03));
      coronaGrd.addColorStop(1, colorAlpha(color, 0));
      ctx.fillStyle = coronaGrd;
      ctx.beginPath();
      ctx.arc(p.sx, p.sy, coronaR, 0, 2 * Math.PI);
      ctx.fill();

      /* Canvas shadow glow */
      ctx.shadowColor = color;
      ctx.shadowBlur = isHov || isFoc ? 38 : (focusedId ? 10 : 22);

      /* Main sphere — radial gradient for 3D shiny look */
      var grd = ctx.createRadialGradient(
        p.sx - r * 0.38, p.sy - r * 0.38, r * 0.04,
        p.sx, p.sy, r
      );
      grd.addColorStop(0, lightenColor(color, 0.65));
      grd.addColorStop(0.38, color);
      grd.addColorStop(0.72, colorAlpha(color, 0.82));
      grd.addColorStop(1, colorAlpha(color, 0.45));
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(p.sx, p.sy, r * (isFoc ? pulse : 1), 0, 2 * Math.PI);
      ctx.fill();

      /* Primary specular highlight — top-left */
      var specGrd = ctx.createRadialGradient(
        p.sx - r * 0.32, p.sy - r * 0.32, 0,
        p.sx - r * 0.32, p.sy - r * 0.32, r * 0.52
      );
      specGrd.addColorStop(0, 'rgba(255,255,255,0.58)');
      specGrd.addColorStop(0.6, 'rgba(255,255,255,0.12)');
      specGrd.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.shadowBlur = 0;
      ctx.fillStyle = specGrd;
      ctx.beginPath();
      ctx.arc(p.sx, p.sy, r, 0, 2 * Math.PI);
      ctx.fill();

      /* Secondary specular — bottom-right rim light */
      var rimGrd = ctx.createRadialGradient(
        p.sx + r * 0.4, p.sy + r * 0.38, 0,
        p.sx + r * 0.4, p.sy + r * 0.38, r * 0.46
      );
      rimGrd.addColorStop(0, colorAlphaLighten(color, 0.7, 0.3));
      rimGrd.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = rimGrd;
      ctx.beginPath();
      ctx.arc(p.sx, p.sy, r, 0, 2 * Math.PI);
      ctx.fill();

      /* Hover / focus ring */
      if (isHov || isFoc) {
        ctx.shadowColor = color;
        ctx.shadowBlur = 28;
        ctx.strokeStyle = lightenColor(color, 0.45);
        ctx.lineWidth = isFoc ? 2.5 : 2.0;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, r + 4, 0, 2 * Math.PI);
        ctx.stroke();
        /* Second outer ring for focused */
        if (isFoc) {
          ctx.globalAlpha = finalAlpha * 0.4;
          ctx.strokeStyle = colorAlpha(color, 0.6);
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, r + 10, 0, 2 * Math.PI);
          ctx.stroke();
        }
      }

      ctx.restore();

      /* ── LABEL ──── */
      drawNodeLabel(nd, p, r, isHov, isFoc, fog);
    });

    ctx.globalAlpha = 1;
    rafId = requestAnimationFrame(render);
  }

  /* ── BEZIER POINT HELPER (for particle trails) ────────────── */
  function buildBezierPoint(li, t) {
    var l = SL[li];
    if (!l) return { x: 0, y: 0 };
    var proj = SN.map(function (n) {
      var p = project(n.x, n.y, n.z);
      return { sx: p.sx, sy: p.sy };
    });
    var ap = proj[l.si], bp = proj[l.ti];
    var mx = (ap.sx + bp.sx) / 2;
    var my = (ap.sy + bp.sy) / 2;
    var edx = bp.sx - ap.sx, edy = bp.sy - ap.sy;
    var cpx = mx - edy * 0.16, cpy = my + edx * 0.16;
    return {
      x: (1-t)*(1-t)*ap.sx + 2*(1-t)*t*cpx + t*t*bp.sx,
      y: (1-t)*(1-t)*ap.sy + 2*(1-t)*t*cpy + t*t*bp.sy
    };
  }

  /* ── DEPTH GRID ───────────────────────────────────────────── */
  function drawDepthGrid() {
    /* Subtle perspective reference plane slightly below node cluster */
    ctx.save();
    ctx.globalAlpha = 0.06 * fadeIn;

    var gridY = CY + panY + 140 * zoom;
    var gridW = W * 0.8;
    var gridH = H * 0.25;
    var cols = 10, rows = 5;

    /* Perspective vanishing point */
    var vpX = CX + panX;
    var vpY = CY + panY - 40;

    ctx.strokeStyle = 'rgba(56,130,246,0.6)';
    ctx.lineWidth = 0.7;

    for (var c = 0; c <= cols; c++) {
      var rx = (CX + panX - gridW / 2) + (c / cols) * gridW;
      ctx.beginPath();
      ctx.moveTo(vpX + (rx - vpX) * 0.15, vpY + (gridY - vpY) * 0.15);
      ctx.lineTo(rx, gridY + gridH * 0.8);
      ctx.stroke();
    }
    for (var r2 = 0; r2 <= rows; r2++) {
      var ry = gridY + (r2 / rows) * gridH * 0.8;
      var spread = 0.15 + (r2 / rows) * 0.85;
      var x1 = vpX - (gridW / 2) * spread;
      var x2 = vpX + (gridW / 2) * spread;
      ctx.beginPath();
      ctx.moveTo(x1, ry);
      ctx.lineTo(x2, ry);
      ctx.stroke();
    }

    ctx.restore();
  }

  /* ── NODE LABEL ──────────────────────────────────────────── */
  function drawNodeLabel(nd, p, r, isHov, isFoc, fog) {
    var cat = CATEGORY[nd.category] || { color: '#64748b' };
    var color = cat.color;

    /* Alpha: always visible, brighter when focused/hovered */
    var lblAlpha;
    if (!focusedId) {
      /* Depth-based but never hidden — min 0.5 */
      var depthFactor = Math.max(0.5, Math.min(1, (p.depth - 0.70) / 0.35));
      lblAlpha = isHov ? 1.0 : depthFactor * 0.88;
    } else {
      lblAlpha = nd.id === focusedId ? 1.0
        : visibleSet.has(nd.id) ? (isHov ? 1.0 : 0.9)
        : 0.12;
    }
    lblAlpha *= fog * fadeIn;
    if (lblAlpha < 0.03) return;

    var fontSize = Math.max(10, Math.min(14, 12 * p.depth));
    var labelY = p.sy + r + fontSize + 5;
    var text = nd.label;

    ctx.save();
    ctx.globalAlpha = lblAlpha;
    ctx.font = (isFoc || isHov ? '700 ' : '600 ') + fontSize + 'px Inter,sans-serif';
    ctx.textAlign = 'center';

    /* Pill background */
    var tw = ctx.measureText(text).width;
    var pillW = tw + 14, pillH = fontSize + 8;
    var pillX = p.sx - pillW / 2, pillY = labelY - fontSize - 2;

    ctx.fillStyle = 'rgba(5,12,25,0.72)';
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(pillX, pillY, pillW, pillH, 4);
    } else {
      ctx.rect(pillX, pillY, pillW, pillH);
    }
    ctx.fill();

    /* Category dot */
    if (isFoc || isHov) {
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(p.sx - tw / 2 - 3, labelY - fontSize / 2 + 1, 2.5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    /* Label text */
    ctx.shadowColor = 'rgba(0,0,0,0.9)';
    ctx.shadowBlur = 4;
    ctx.fillStyle = isFoc || isHov ? '#ffffff' : (focusedId && !visibleSet.has(nd.id) ? '#475569' : '#c8d6e8');
    ctx.fillText(text, p.sx, labelY);

    ctx.restore();
  }

  /* ── TOOLTIP ─────────────────────────────────────────────── */
  function showTooltip(nd, x, y) {
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.style.cssText =
        'position:fixed;z-index:99999;pointer-events:none;' +
        'background:rgba(7,14,28,0.97);' +
        'border:1px solid rgba(255,255,255,0.12);' +
        'border-radius:12px;padding:12px 16px;font-family:Inter,sans-serif;' +
        'font-size:12px;color:#e2e8f0;max-width:240px;' +
        'box-shadow:0 8px 40px rgba(0,0,0,0.65),0 0 0 1px rgba(255,255,255,0.04);' +
        'line-height:1.45;transition:opacity 0.15s;backdrop-filter:blur(12px);';
      document.body.appendChild(tooltip);
    }
    var cat = CATEGORY[nd.category] || { color: '#64748b', label: '' };
    tooltip.innerHTML =
      '<div style="font-weight:800;font-size:14px;color:#fff;margin-bottom:5px;letter-spacing:-0.01em">' + nd.label + '</div>' +
      '<div style="font-size:10px;color:' + cat.color + ';margin-bottom:8px;text-transform:uppercase;letter-spacing:.06em;font-weight:700">' + cat.label + '</div>' +
      '<div style="color:#7d90a8;font-size:11.5px;font-weight:500">' + (nd.tech || []).slice(0, 3).join('  ·  ') + '</div>' +
      '<div style="margin-top:8px;font-size:10px;color:#3d5066;border-top:1px solid rgba(255,255,255,0.06);padding-top:7px">Click to explore  ·  Right-click for docs</div>';
    var rect = container.getBoundingClientRect();
    var tx = rect.left + x + 18;
    var ty = rect.top + y - 24;
    if (tx + 250 > window.innerWidth) tx = rect.left + x - 258;
    tooltip.style.left = tx + 'px';
    tooltip.style.top = ty + 'px';
    tooltip.style.opacity = '1';
    tooltip.style.display = 'block';
  }

  function hideTooltip() {
    if (tooltip) { tooltip.style.opacity = '0'; setTimeout(function () { if (tooltip) tooltip.style.display = 'none'; }, 150); }
  }

  /* ── INTERACTION ─────────────────────────────────────────── */
  function getCanvasPos(e) {
    var r = canvas.getBoundingClientRect();
    var clientX = e.touches ? e.touches[0].clientX : e.clientX;
    var clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - r.left, y: clientY - r.top };
  }

  function hitTest(mx, my) {
    var proj = SN.map(function (n) {
      var p = project(n.x, n.y, n.z);
      return { n: n, sx: p.sx, sy: p.sy, depth: p.depth };
    });
    var best = null, bestD = Infinity;
    proj.forEach(function (p) {
      var dx = mx - p.sx, dy = my - p.sy;
      var d = Math.sqrt(dx * dx + dy * dy);
      var r = nodeR(p.n.nd, p.depth) + 12;
      if (d < r && d < bestD) { bestD = d; best = p; }
    });
    return best || null;
  }

  function stopAutoRotate() {
    autoRotate = false;
    if (autoTimer) clearTimeout(autoTimer);
  }

  function resumeAutoRotate(delay) {
    if (autoTimer) clearTimeout(autoTimer);
    autoTimer = setTimeout(function () {
      if (!focusedId && !dragNode) autoRotate = true;
    }, delay || 4000);
  }

  function onMouseMove(e) {
    var pos = getCanvasPos(e);
    lastMouse = pos;

    if (dragNode) {
      var dx = pos.x - dragBase.x;
      var dy = pos.y - dragBase.y;
      dragBase = pos;
      var cosY2 = Math.cos(-rotY), sinY2 = Math.sin(-rotY);
      var worldDX = dx / (zoom * dragNode.depth);
      var worldDZ = -worldDX * sinY2;
      worldDX = worldDX * cosY2;
      dragNode.n.x += worldDX;
      dragNode.n.y += dy / (zoom * dragNode.depth);
      dragNode.n.z += worldDZ;
      dragNode.n.vx = 0; dragNode.n.vy = 0; dragNode.n.vz = 0;
      canvas.style.cursor = 'grabbing';
      return;
    }

    if (isPanning) {
      panX = panAnchor.px + (pos.x - panAnchor.x);
      panY = panAnchor.py + (pos.y - panAnchor.y);
      canvas.style.cursor = 'grabbing';
      return;
    }

    var hit = hitTest(pos.x, pos.y);
    if (hit) {
      hoveredNode = hit.n.nd;
      canvas.style.cursor = 'pointer';
      showTooltip(hit.n.nd, pos.x, pos.y);
    } else {
      hoveredNode = null;
      canvas.style.cursor = 'grab';
      hideTooltip();
    }
  }

  function onMouseDown(e) {
    e.preventDefault();
    var pos = getCanvasPos(e);
    stopAutoRotate();
    var hit = hitTest(pos.x, pos.y);
    if (hit) {
      dragNode = hit;
      dragBase = pos;
      hit.n.pinned = true;
      canvas.style.cursor = 'grabbing';
    } else {
      isPanning = true;
      panAnchor = { x: pos.x, y: pos.y, px: panX, py: panY };
      canvas.style.cursor = 'grabbing';
    }
  }

  function onMouseUp(e) {
    if (dragNode) { dragNode.n.pinned = false; dragNode = null; }
    isPanning = false;
    panAnchor = null;
    canvas.style.cursor = hoveredNode ? 'pointer' : 'grab';
    resumeAutoRotate(4000);
  }

  function onClick(e) {
    var pos = getCanvasPos(e);
    var moved = Math.abs(pos.x - lastMouse.x) + Math.abs(pos.y - lastMouse.y);
    if (moved > 5) return;
    var hit = hitTest(pos.x, pos.y);
    if (hit) {
      enterFocusMode(hit.n.nd.id);
    } else {
      reset();
    }
  }

  function onRightClick(e) {
    var pos = getCanvasPos(e);
    var hit = hitTest(pos.x, pos.y);
    if (hit && hit.n.nd.url) {
      e.preventDefault();
      window.location.href = hit.n.nd.url;
    }
  }

  function onWheel(e) {
    e.preventDefault();
    var delta = e.deltaY > 0 ? 0.9 : 1.1;
    zoom = Math.max(0.3, Math.min(4, zoom * delta));
    stopAutoRotate();
    resumeAutoRotate(2000);
  }

  function onResize() {
    W = container.clientWidth;
    H = container.clientHeight;
    canvas.width = W;
    canvas.height = H;
    CX = W / 2;
    CY = H / 2;
  }

  /* ── SIDE PANEL ──────────────────────────────────────────── */
  function ensurePanel() {
    var p = document.getElementById('kg-side-panel');
    if (p) return p;
    p = document.createElement('div');
    p.id = 'kg-side-panel';
    p.className = 'kg-side-panel';
    p.innerHTML = '<button class="kg-sp-close" id="kg-sp-close" aria-label="Close panel">✕</button><div class="kg-sp-body"></div>';
    document.body.appendChild(p);
    document.getElementById('kg-sp-close').addEventListener('click', removePanel);
    return p;
  }

  function removePanel() {
    var p = document.getElementById('kg-side-panel');
    if (p) p.classList.remove('open');
  }

  function renderPanel(nodeId, deps) {
    var d = nodeById(nodeId);
    if (!d) return;
    var panel = ensurePanel();
    var cat = CATEGORY[d.category] || { color: '#64748b', label: 'Service' };

    var upHtml = deps.upstream.map(function (id) {
      var n = nodeById(id);
      return n ? '<span class="kg-dep-pill kg-dep-up">' + n.label + '</span>' : '';
    }).join('');

    var dnHtml = deps.downstream.map(function (id) {
      var n = nodeById(id);
      return n ? '<span class="kg-dep-pill kg-dep-down">' + n.label + '</span>' : '';
    }).join('');

    panel.querySelector('.kg-sp-body').innerHTML =
      '<div class="kg-sp-badge" style="background:' + cat.color + '22;color:' + cat.color + ';border:1px solid ' + cat.color + '44">' + cat.label + '</div>' +
      '<div class="kg-sp-title">' + d.label + '</div>' +
      '<div class="kg-sp-desc">' + d.desc + '</div>' +
      '<div class="kg-sp-section"><div class="kg-sp-label">Team</div><div class="kg-sp-val">' + (d.owner || '—') + '</div></div>' +
      '<div class="kg-sp-section"><div class="kg-sp-label">Inputs → Outputs</div><div class="kg-sp-val">' + (d.inputs || '—') + ' <span style="opacity:.5">→</span> ' + (d.outputs || '—') + '</div></div>' +
      (d.tech && d.tech.length ? '<div class="kg-sp-section"><div class="kg-sp-label">Tech Stack</div><div class="kg-sp-tech">' + d.tech.map(function (t) { return '<span class="focus-pill">' + t + '</span>'; }).join('') + '</div></div>' : '') +
      (upHtml ? '<div class="kg-sp-section"><div class="kg-sp-label">Upstream Dependencies</div><div class="kg-sp-deps">' + upHtml + '</div></div>' : '') +
      (dnHtml ? '<div class="kg-sp-section"><div class="kg-sp-label">Downstream Services</div><div class="kg-sp-deps">' + dnHtml + '</div></div>' : '') +
      '<a class="kg-sp-cta" href="' + (d.url || '#') + '">Open Documentation →</a>';

    requestAnimationFrame(function () { panel.classList.add('open'); });
  }

  /* ── PUBLIC API ──────────────────────────────────────────── */
  function highlight(ids) {
    if (!Array.isArray(ids)) ids = [ids];
    ids = ids.filter(Boolean);
    if (!ids.length) { reset(); return; }
    focusedId = '_highlight_';
    visibleSet = new Set(ids);
  }

  function enterFocusMode(nodeId) {
    if (!nodeById(nodeId)) return;
    var deps = getDeps(nodeId);
    focusedId = nodeId;
    visibleSet = new Set([nodeId].concat(deps.upstream).concat(deps.downstream));
    renderPanel(nodeId, deps);
    stopAutoRotate();

    var sn = SN.find(function (n) { return n.id === nodeId; });
    if (sn) {
      var targetAngle = Math.atan2(sn.x, sn.z);
      var diff = targetAngle - rotY;
      while (diff > Math.PI) diff -= 2 * Math.PI;
      while (diff < -Math.PI) diff += 2 * Math.PI;
      var startAngle = rotY;
      var steps = 45;
      var step = 0;
      function animateCamera() {
        step++;
        var ease = 1 - Math.pow(1 - step / steps, 3);
        rotY = startAngle + diff * ease;
        if (step < steps) requestAnimationFrame(animateCamera);
      }
      animateCamera();
    }
  }

  function reset() {
    focusedId = null;
    visibleSet = new Set();
    flowRunning = false;
    flowTimers.forEach(clearTimeout);
    flowTimers = [];
    removePanel();
    resumeAutoRotate(1500);
  }

  function simulateEventFlow() {
    reset();
    flowRunning = true;
    var visited = [];

    FLOW_PATH.forEach(function (id, idx) {
      var t = setTimeout(function () {
        if (!flowRunning) return;
        visited.push(id);
        focusedId = '_flow_';
        visibleSet = new Set(visited);

        var sn = SN.find(function (n) { return n.id === id; });
        if (sn) {
          var target = Math.atan2(sn.x, sn.z);
          var d2 = target - rotY;
          while (d2 > Math.PI) d2 -= 2 * Math.PI;
          while (d2 < -Math.PI) d2 += 2 * Math.PI;
          var start2 = rotY, s2 = 0, steps2 = 32;
          function animCam() {
            s2++;
            var ease = 1 - Math.pow(1 - s2 / steps2, 3);
            rotY = start2 + d2 * ease;
            if (s2 < steps2) requestAnimationFrame(animCam);
          }
          animCam();
        }
      }, idx * 900);
      flowTimers.push(t);
    });

    var done = setTimeout(function () { flowRunning = false; reset(); }, FLOW_PATH.length * 900 + 1500);
    flowTimers.push(done);
  }

  function reheat() {
    for (var i = 0; i < 50; i++) tickPhysics(0.8);
  }

  /* ── LEGEND ──────────────────────────────────────────────── */
  function buildLegend(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = '';
    Object.keys(CATEGORY).forEach(function (cat) {
      var item = document.createElement('div');
      item.className = 'kg-legend-item';
      item.innerHTML =
        '<div class="kg-legend-dot" style="background:' + CATEGORY[cat].color +
        ';box-shadow:0 0 8px ' + CATEGORY[cat].color + 'aa,0 0 2px ' + CATEGORY[cat].color + '"></div>' +
        CATEGORY[cat].label;
      item.style.cursor = 'pointer';
      item.addEventListener('click', function () {
        var catNodes = NODES.filter(function (n) { return n.category === cat; }).map(function (n) { return n.id; });
        highlight(catNodes);
      });
      el.appendChild(item);
    });
  }

  /* ── INIT ────────────────────────────────────────────────── */
  function init(containerId) {
    container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    canvas = document.createElement('canvas');
    canvas.style.cssText = 'display:block;width:100%;height:100%;cursor:grab;';
    container.appendChild(canvas);

    W = container.clientWidth;
    H = container.clientHeight || 820;
    canvas.width = W;
    canvas.height = H;
    CX = W / 2;
    CY = H / 2;

    ctx = canvas.getContext('2d');
    if (!ctx) {
      container.innerHTML = '<div style="color:#64748b;text-align:center;padding:40px">Canvas unavailable</div>';
      return;
    }

    initStars();
    initSim();

    canvas.addEventListener('mousemove', onMouseMove, { passive: true });
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('click', onClick);
    canvas.addEventListener('contextmenu', onRightClick);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('mouseleave', function () { hoveredNode = null; hideTooltip(); });
    window.addEventListener('resize', onResize, { passive: true });

    buildLegend('graph-legend');

    global.KG = {
      highlight: highlight,
      reset: reset,
      reheat: reheat,
      animateFlow: simulateEventFlow,
      simulateEventFlow: simulateEventFlow,
      activateEdge: function () {},
      enterFocusMode: enterFocusMode
    };

    document.dispatchEvent(new CustomEvent('kg:ready'));
    console.info('[KG] Canvas 3D knowledge graph v4.0 — ' + NODES.length + ' nodes / ' + LINKS.length + ' links');

    if (rafId) cancelAnimationFrame(rafId);
    render();
  }

  /* ── BOOT ────────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { init('knowledge-graph'); });
  } else {
    init('knowledge-graph');
  }

})(window);
