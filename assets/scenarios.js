/* ═══════════════════════════════════════════════════════════════
   ZEOTAP CDP — SCENARIO EXPLORATION ENGINE
   Powers the "Explore by Use-Case" section
   ═══════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';

  var SCENARIOS = [
    {
      id: 'know_customer',
      icon: '🔍',
      title: 'Know Your Customer',
      desc: 'Unify every identity signal into a single persistent profile across all touchpoints.',
      nodes: ['collect', 'ingest', 'identity', 'profiles'],
      color: '#3b82f6',
      story: 'Data flows from your apps → ingestion pipeline → identity graph → unified profile store. One customer. Complete picture.'
    },
    {
      id: 'ai_audience',
      icon: '🤖',
      title: 'AI-Powered Audiences',
      desc: 'Ask Zoe in plain English. Build segments that self-update as your data changes.',
      nodes: ['profiles', 'ai', 'audiences'],
      color: '#10b981',
      story: 'Profile traits feed Zoe AI → natural language resolves to segment rules → 18K+ audiences update in real time.'
    },
    {
      id: 'journey',
      icon: '🗺️',
      title: 'Orchestrate Journeys',
      desc: 'Trigger multi-step campaigns the moment a customer enters or exits a segment.',
      nodes: ['audiences', 'journeys', 'ml', 'activation'],
      color: '#f59e0b',
      story: 'Segment membership triggers journey engine → ML scores personalize branch logic → activation fires across 100+ destinations.'
    },
    {
      id: 'privacy',
      icon: '🔒',
      title: 'Privacy-Safe Activation',
      desc: 'Enforce consent at every data movement. GDPR, CCPA, and custom policies built in.',
      nodes: ['privacy', 'identity', 'activation', 'auth'],
      color: '#f97316',
      story: 'Consent manager intercepts all flows → identity resolution respects erasure pipelines → activation checks policies at dispatch.'
    },
    {
      id: 'platform_health',
      icon: '📡',
      title: 'Platform Reliability',
      desc: 'Observe, alert, and auto-recover — the infrastructure layer that keeps everything running.',
      nodes: ['infra', 'observe', 'cicd', 'testing'],
      color: '#64748b',
      story: 'GKE clusters emit telemetry → Prometheus/Grafana alert on SLO breach → Harness auto-rolls back bad deploys.'
    }
  ];

  var activeScenarioId = null;
  var narrationTimer = null;

  /* ── Render scenario cards ────────────────────────────────────── */
  function renderScenarios(containerId) {
    var container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';
    SCENARIOS.forEach(function (sc) {
      var card = document.createElement('div');
      card.className = 'scenario-card';
      card.setAttribute('data-id', sc.id);
      card.style.setProperty('--sc-color', sc.color);
      card.innerHTML =
        '<div class="sc-icon">' + sc.icon + '</div>' +
        '<div class="sc-title">' + sc.title + '</div>' +
        '<div class="sc-desc">' + sc.desc + '</div>' +
        '<div class="sc-nodes">' +
          sc.nodes.map(function (id) {
            return '<span class="sc-node-pill">' + labelOf(id) + '</span>';
          }).join('') +
        '</div>';

      card.addEventListener('click', function () { activateScenario(sc.id); });
      container.appendChild(card);
    });
  }

  function labelOf(nodeId) {
    var labels = {
      collect: 'Collection', ingest: 'Ingestion', identity: 'Identity Graph',
      profiles: 'Profile Store', audiences: 'Audiences', journeys: 'Journeys',
      activation: 'Activation', ai: 'Zoe AI', ml: 'ML Platform',
      reporting: 'Reporting', unity: 'Unity Dashboard', privacy: 'Privacy',
      auth: 'Auth & IAM', infra: 'Infra', observe: 'Observability',
      cicd: 'CI/CD', testing: 'Testing'
    };
    return labels[nodeId] || nodeId;
  }

  /* ── Activate a scenario ──────────────────────────────────────── */
  function activateScenario(id) {
    if (narrationTimer) clearTimeout(narrationTimer);

    var sc = SCENARIOS.find(function (s) { return s.id === id; });
    if (!sc) return;

    /* Toggle off if already active */
    if (activeScenarioId === id) {
      activeScenarioId = null;
      updateActiveCard(null);
      hideNarration();
      if (global.KG) global.KG.reset();
      return;
    }

    activeScenarioId = id;
    updateActiveCard(id);

    /* Highlight graph */
    if (global.KG && typeof global.KG.highlight === 'function') {
      global.KG.highlight(sc.nodes);
    }

    /* Show narration */
    showNarration(sc);

    /* Scroll graph into view */
    var graphEl = document.getElementById('knowledge-graph');
    if (graphEl) graphEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

    /* Auto-clear after 8s */
    narrationTimer = setTimeout(function () {
      activeScenarioId = null;
      updateActiveCard(null);
      hideNarration();
      if (global.KG) global.KG.reset();
    }, 8000);
  }

  function updateActiveCard(id) {
    document.querySelectorAll('.scenario-card').forEach(function (card) {
      card.classList.toggle('active', card.getAttribute('data-id') === id);
    });
  }

  /* ── Narration banner ─────────────────────────────────────────── */
  function ensureNarration() {
    var el = document.getElementById('sc-narration');
    if (el) return el;
    el = document.createElement('div');
    el.id = 'sc-narration';
    el.className = 'sc-narration';
    el.innerHTML = '<div class="sc-narration-text" id="sc-narration-text"></div><button class="sc-narration-close" id="sc-narration-close">✕</button>';
    document.getElementById('knowledge-graph').insertAdjacentElement('beforebegin', el);
    document.getElementById('sc-narration-close').addEventListener('click', function () {
      hideNarration();
      activeScenarioId = null;
      updateActiveCard(null);
      if (global.KG) global.KG.reset();
    });
    return el;
  }

  function showNarration(sc) {
    var el = ensureNarration();
    el.style.setProperty('--sc-color', sc.color);
    document.getElementById('sc-narration-text').textContent = sc.story;
    el.classList.add('visible');
  }

  function hideNarration() {
    var el = document.getElementById('sc-narration');
    if (el) el.classList.remove('visible');
  }

  /* ── Animated stats counters ──────────────────────────────────── */
  function initStats() {
    var stats = [
      { id: 'stat-profiles',     target: 14.2,  suffix: 'B',   label: 'Unified Profiles',   prefix: '' },
      { id: 'stat-events',       target: 2.1,   suffix: 'M/s', label: 'Events per Second',  prefix: '' },
      { id: 'stat-destinations', target: 100,   suffix: '+',   label: 'Destinations',        prefix: '' },
      { id: 'stat-segments',     target: 18,    suffix: 'K+',  label: 'Active Segments',     prefix: '' }
    ];

    var animated = false;

    function animateStat(el, target, suffix) {
      var start = 0;
      var duration = 2000;
      var startTime = null;

      function step(ts) {
        if (!startTime) startTime = ts;
        var progress = Math.min((ts - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var value = start + (target - start) * eased;
        el.textContent = (value < 10 ? value.toFixed(1) : Math.floor(value)) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    function triggerAnimation() {
      if (animated) return;
      animated = true;
      stats.forEach(function (s) {
        var el = document.getElementById(s.id);
        if (el) animateStat(el, s.target, s.suffix);
      });
    }

    /* Use IntersectionObserver */
    var statsBar = document.getElementById('stats-bar');
    if (!statsBar) return;

    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          triggerAnimation();
          obs.disconnect();
        }
      }, { threshold: 0.3 });
      obs.observe(statsBar);
    } else {
      triggerAnimation();
    }
  }

  /* ── Boot ─────────────────────────────────────────────────────── */
  function init() {
    renderScenarios('scenario-grid');
    initStats();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  global.Scenarios = { activate: activateScenario };

})(window);
