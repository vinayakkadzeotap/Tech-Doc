/* ═══════════════════════════════════════════════════════════════════
   ZEOTAP CDP — Event Flow Grid Interactive Controller
   Adds click-to-expand, data snapshots, and autoplay to the
   static .evf-grid on index.html.
   Depends on window.KG (optional) for graph node sync.
   ═══════════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';

  /* ── Data snapshots: one entry per stage (0-indexed) ────────────── */
  var EVF_SNAPSHOTS = {
    0: {
      input:  '{\n  "event": "purchase",\n  "value": 49.99,\n  "currency": "USD",\n  "cookie_id": "c_8f2a9b3d",\n  "page": "/checkout/confirm",\n  "ts": 1741343100000\n}',
      output: '{\n  "event": "purchase",\n  "value": 49.99,\n  "cookie_id": "c_8f2a9b3d",\n  "queued": true,\n  "dispatch_ts": 1741343100048\n}',
      note:   'JS SDK intercepts the DOM event, stamps a monotonic timestamp, and buffers in IndexedDB before HTTPS dispatch.'
    },
    1: {
      input:  '{\n  "event": "purchase",\n  "cookie_id": "c_8f2a9b3d",\n  "dispatch_ts": 1741343100048\n}',
      output: '{\n  "event": "purchase",\n  "schema_version": "2.4",\n  "validated": true,\n  "api_ts": 1741343100061\n}',
      note:   'Collection endpoint (Go) authenticates the write key, validates against Avro schema registry, and stamps an API receipt timestamp.'
    },
    2: {
      input:  '{\n  "event": "purchase",\n  "cookie_id": "c_8f2a9b3d",\n  "validated": true\n}',
      output: '{\n  "topic": "cdp.events.raw",\n  "partition": 7,\n  "offset": 10482947,\n  "key": "c_8f2a9b3d"\n}',
      note:   'Kafka MSK publishes the event. Partition key = cookie_id ensures per-user ordering. At-least-once delivery guaranteed.'
    },
    3: {
      input:  '{\n  "topic": "cdp.events.raw",\n  "event": "purchase",\n  "cookie_id": "c_8f2a9b3d"\n}',
      output: '{\n  "event": "purchase",\n  "geo": { "country": "DE", "city": "Berlin" },\n  "consent_status": "granted",\n  "pipeline_id": "daap-rt-prod-007"\n}',
      note:   'Flink 1.18 consumer geo-enriches the IP, checks consent status, and routes invalid payloads to the DLQ topic.'
    },
    4: {
      input:  '{\n  "cookie_id": "c_8f2a9b3d",\n  "geo": { "country": "DE" }\n}',
      output: '{\n  "ucid": "u_4f8a2c91b3d7e056",\n  "resolved_ids": ["c_8f2a9b3d", "email_hash:a4f2..."],\n  "match_type": "deterministic",\n  "confidence": 1.0\n}',
      note:   'id-graph-lib-v2 (Go) performs deterministic lookup in BigTable. Redis cache hit returns the UCID in < 3ms.'
    },
    5: {
      input:  '{\n  "ucid": "u_4f8a2c91b3d7e056",\n  "event": "purchase",\n  "value": 49.99\n}',
      output: '{\n  "ucid": "u_4f8a2c91b3d7e056",\n  "lifetime_value": 412.88,\n  "purchase_count": 7,\n  "last_purchase_ts": 1741343100099\n}',
      note:   'Scylla upsert p99 < 8ms. The unified profile is updated atomically. BigQuery twin is updated async within ~2 seconds.'
    },
    6: {
      input:  '{\n  "ucid": "u_4f8a2c91b3d7e056",\n  "lifetime_value": 412.88,\n  "purchase_count": 7\n}',
      output: '{\n  "ucid": "u_4f8a2c91b3d7e056",\n  "segments_entered": ["seg_high_value_eu"],\n  "segments_exited": [],\n  "changelog_ts": 1741343100298\n}',
      note:   'Rust rule engine re-evaluates 18K+ segment trees. LTV > 400 threshold crossed — customer enters seg_high_value_eu in < 100ms.'
    },
    7: {
      input:  '{\n  "ucid": "u_4f8a2c91b3d7e056",\n  "segments_entered": ["seg_high_value_eu"]\n}',
      output: '{\n  "ucid": "u_4f8a2c91b3d7e056",\n  "journey_id": "jrn_highvalue_eu_reeng_v3",\n  "step_enqueued": "send_email_personalised",\n  "wait_until": 1741346700000\n}',
      note:   'Kafka consumer detects the segment entry event. Journey "Re-engagement: High Value EU" trigger fires. Step 1 enqueued in Redis DAG.'
    },
    8: {
      input:  '{\n  "ucid": "u_4f8a2c91b3d7e056",\n  "journey_id": "jrn_highvalue_eu_reeng_v3",\n  "step": "send_email_personalised"\n}',
      output: '{\n  "destination": "Braze",\n  "external_id": "u_4f8a2c91b3d7e056",\n  "email_hash": "a4f2c8...",\n  "status": "queued",\n  "consent_checked": true\n}',
      note:   'connector-hub (Scala) maps the UCID to Braze external_id. OAuth token refreshed. Consent verified. Delivery receipt logged to Cloud Trace.'
    },
    9: {
      input:  '{\n  "email_hash": "a4f2c8...",\n  "gaid": "b9c1...",\n  "segment": "seg_high_value_eu"\n}',
      output: '{\n  "delivered_to": [\n    { "platform": "Meta CAPI", "status": "delivered" },\n    { "platform": "Google DV360", "status": "delivered" }\n  ],\n  "delivery_ts": 1741343102150\n}',
      note:   'Data arrives at partner platforms. SHA-256 hashed email sent to Meta CAPI. GAID sent to DV360. Delivery receipts logged for SLO tracking.'
    }
  };

  var state = {
    activeIdx: null,
    autoplayTimer: null,
    autoplayRunning: false,
    steps: []
  };

  /* ── Log ticker data & helpers ───────────────────────────────────── */
  var EVF_LOG_LINES = [
    { svc: 'sdk.js      ', msg: '→ queued purchase event to IndexedDB buffer', ok: false },
    { svc: 'collection  ', msg: '→ validated schema v2.4 — api_ts stamped', ok: true },
    { svc: 'kafka-msk   ', msg: '→ published to cdp.events.raw (partition 7, offset 10482947)', ok: true },
    { svc: 'flink-rt    ', msg: '→ geo-enriched (DE/Berlin) + consent OK → routed downstream', ok: true },
    { svc: 'id-graph    ', msg: '→ deterministic match → ucid u_4f8a2c91 (cache hit, 3ms)', ok: true },
    { svc: 'scylla      ', msg: '→ profile upsert done — lifetime_value now 412.88 (p99 6ms)', ok: true },
    { svc: 'segment-eng ', msg: '→ entered seg_high_value_eu (18,432 segment trees evaluated)', ok: true },
    { svc: 'journey-eng ', msg: '→ step enqueued in Redis DAG: jrn_highvalue_eu_reeng_v3', ok: true },
    { svc: 'connector   ', msg: '→ Braze consent OK, mapped ucid → external_id, queued', ok: true },
    { svc: 'destinations', msg: '→ Meta CAPI ✓  Google DV360 ✓  (delivery_ts +2.1s)', ok: true }
  ];

  function appendLog(idx) {
    var ticker = document.getElementById('evf-log-ticker');
    if (!ticker) return;
    var entry = EVF_LOG_LINES[idx];
    if (!entry) return;

    /* Generate a fake but plausible timestamp */
    var now = new Date();
    var ts = [
      String(now.getHours()).padStart(2, '0'),
      String(now.getMinutes()).padStart(2, '0'),
      String(now.getSeconds()).padStart(2, '0') + '.' + String(now.getMilliseconds()).padStart(3, '0').slice(0, 3)
    ].join(':');

    var line = document.createElement('div');
    line.className = 'evf-log-line';
    line.innerHTML =
      '<span class="log-ts">[' + ts + ']</span> ' +
      '<span class="log-svc">' + entry.svc + '</span> ' +
      '<span class="' + (entry.ok ? 'log-ok' : 'log-msg') + '">' + entry.msg + '</span>';
    ticker.appendChild(line);
    /* Auto-scroll to bottom */
    ticker.scrollTop = ticker.scrollHeight;
  }

  /* ── Helpers ─────────────────────────────────────────────────────── */
  function hasKG() {
    return !!(global.KG && typeof global.KG.highlight === 'function');
  }

  /* ── Build the snapshot panel (injected once after .evf-grid) ────── */
  function buildSnapshotPanel() {
    var grid = document.querySelector('.evf-grid');
    if (!grid || document.getElementById('evf-snapshot')) return;

    var panel = document.createElement('div');
    panel.id = 'evf-snapshot';
    panel.className = 'evf-snapshot-panel';
    panel.innerHTML =
      '<div class="evf-snap-header">' +
        '<span class="evf-snap-title" id="evf-snap-title">Stage Data Snapshot</span>' +
        '<button class="evf-snap-close" id="evf-snap-close" title="Close">✕</button>' +
      '</div>' +
      '<div class="evf-snap-cols">' +
        '<div>' +
          '<div class="evf-snap-label">Input Payload</div>' +
          '<pre class="evf-snap-json" id="evf-snap-input"></pre>' +
        '</div>' +
        '<div>' +
          '<div class="evf-snap-label">Output Payload</div>' +
          '<pre class="evf-snap-json" id="evf-snap-output"></pre>' +
        '</div>' +
      '</div>' +
      '<div class="evf-snap-note" id="evf-snap-note"></div>';

    grid.insertAdjacentElement('afterend', panel);

    var closeBtn = document.getElementById('evf-snap-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        stopAutoplay();
        deactivateAll();
      });
    }
  }

  /* ── Show / hide snapshot ────────────────────────────────────────── */
  function showSnapshot(idx) {
    var snap = EVF_SNAPSHOTS[idx];
    var panel = document.getElementById('evf-snapshot');
    if (!panel || !snap) return;

    var stepEl = state.steps[idx];
    var nameEl = stepEl ? stepEl.querySelector('.evf-step-name') : null;
    var title = (nameEl ? nameEl.textContent : 'Stage ' + (idx + 1)) + ' — Data Snapshot';

    document.getElementById('evf-snap-title').textContent = title;
    document.getElementById('evf-snap-input').textContent = snap.input;
    document.getElementById('evf-snap-output').textContent = snap.output;
    document.getElementById('evf-snap-note').textContent = snap.note;
    panel.classList.add('evf-snapshot-visible');

    /* Scroll panel into view smoothly */
    setTimeout(function () {
      panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 80);
  }

  function hideSnapshot() {
    var panel = document.getElementById('evf-snapshot');
    if (panel) panel.classList.remove('evf-snapshot-visible');
  }

  /* ── Arrow pulse ─────────────────────────────────────────────────── */
  function pulseArrows(activeIdx) {
    state.steps.forEach(function (step, i) {
      var arrow = step.querySelector('.evf-arrow');
      if (!arrow) return;
      if (i === activeIdx || i === activeIdx - 1) {
        arrow.classList.add('evf-arrow-pulse');
      } else {
        arrow.classList.remove('evf-arrow-pulse');
      }
    });
  }

  function clearArrowPulse() {
    state.steps.forEach(function (step) {
      var arrow = step.querySelector('.evf-arrow');
      if (arrow) arrow.classList.remove('evf-arrow-pulse');
    });
  }

  /* ── Activate / deactivate ───────────────────────────────────────── */
  function activateStep(idx) {
    /* Toggle off when clicking the same active step */
    if (state.activeIdx === idx && !state.autoplayRunning) {
      deactivateAll();
      return;
    }

    state.activeIdx = idx;

    state.steps.forEach(function (step, i) {
      step.classList.toggle('evf-active', i === idx);
      step.classList.toggle('evf-dimmed', i !== idx);
    });

    pulseArrows(idx);
    showSnapshot(idx);

    var nodeId = state.steps[idx] ? state.steps[idx].getAttribute('data-node') : null;
    if (hasKG() && nodeId) {
      global.KG.highlight([nodeId]);
    }
  }

  function deactivateAll() {
    state.activeIdx = null;
    state.steps.forEach(function (step) {
      step.classList.remove('evf-active', 'evf-dimmed');
    });
    clearArrowPulse();
    hideSnapshot();
    if (hasKG()) global.KG.reset();
  }

  /* ── Autoplay ────────────────────────────────────────────────────── */
  function updateAutoplayBtn(running) {
    var btn = document.getElementById('evf-autoplay-btn');
    if (!btn) return;
    btn.textContent = running ? '⏹ Stop' : '▶ Auto-play Flow';
  }

  function startAutoplay() {
    if (state.autoplayRunning) return;
    state.autoplayRunning = true;
    updateAutoplayBtn(true);

    /* Clear the log ticker for a fresh run */
    var ticker = document.getElementById('evf-log-ticker');
    if (ticker) ticker.innerHTML = '';

    var idx = 0;
    activateStep(idx);
    appendLog(idx);

    state.autoplayTimer = setInterval(function () {
      idx++;
      if (idx >= state.steps.length) {
        stopAutoplay();
        /* Brief pause then reset so the last stage stays visible */
        setTimeout(deactivateAll, 1800);
        return;
      }
      activateStep(idx);
      appendLog(idx);
    }, 1200);
  }

  function stopAutoplay() {
    state.autoplayRunning = false;
    if (state.autoplayTimer) {
      clearInterval(state.autoplayTimer);
      state.autoplayTimer = null;
    }
    updateAutoplayBtn(false);
  }

  function toggleAutoplay() {
    if (state.autoplayRunning) {
      stopAutoplay();
      deactivateAll();
    } else {
      startAutoplay();
    }
  }

  /* ── Init ────────────────────────────────────────────────────────── */
  function init() {
    /* Cache the step elements */
    state.steps = Array.prototype.slice.call(
      document.querySelectorAll('.evf-step[data-stage-idx]')
    );
    if (!state.steps.length) return;

    /* Bind click on each step card */
    state.steps.forEach(function (step) {
      step.addEventListener('click', function (e) {
        /* Don't intercept clicks on Chapter links */
        if (e.target && e.target.classList.contains('evf-step-link')) return;
        var idx = parseInt(step.getAttribute('data-stage-idx'), 10);
        if (!state.autoplayRunning) activateStep(idx);
      });
    });

    /* Bind autoplay button */
    var btn = document.getElementById('evf-autoplay-btn');
    if (btn) btn.addEventListener('click', toggleAutoplay);

    /* Build the snapshot panel */
    buildSnapshotPanel();
  }

  /* Boot — wait for DOM */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* Expose minimal API for external use */
  global.EVFController = {
    activate: activateStep,
    deactivate: deactivateAll,
    play: startAutoplay,
    stop: stopAutoplay
  };

})(window);
