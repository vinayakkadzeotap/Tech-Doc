/* ═══════════════════════════════════════════════════════════════════
   ZEOTAP CDP — Journey of a Click Pipeline Simulator
   Controller for pipeline-sim.html
   ═══════════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';

  /* ── 7 pipeline stages ────────────────────────────────────────────── */
  var PIPELINE_STAGES = [
    {
      id: 0,
      node: 'collect',
      num: 'Stage 01 / 07',
      name: 'Event Source',
      services: ['JS SDK v4.2', 'IndexedDB Buffer'],
      sla: '< 5ms queue',
      what: 'The user clicks "Buy Now" on the product page. The Zeotap JS SDK (loaded via GTM) intercepts the DOM event, attaches a first-party cookie identifier, enriches with page context (URL, referrer, viewport), and queues the payload in IndexedDB for guaranteed delivery — even if the network drops mid-flight. Batched every 200ms or flushed immediately for purchase-class events.',
      input: {
        "event_type": "purchase",
        "product_id": "SHOE-AJ1-BLK-42",
        "value": 89.99,
        "currency": "EUR",
        "timestamp": "2026-03-07T14:18:20.048Z",
        "page_url": "https://shop.example.de/shoes"
      },
      output: {
        "event_type": "purchase",
        "product_id": "SHOE-AJ1-BLK-42",
        "value": 89.99,
        "currency": "EUR",
        "timestamp": "2026-03-07T14:18:20.048Z",
        "cookie_id": "c_8f2a9b3d",
        "session_id": "s_7e3d9f12",
        "sdk_version": "4.2.1",
        "dispatch_ts": 1741343100253
      }
    },
    {
      id: 1,
      node: 'collect',
      num: 'Stage 02 / 07',
      name: 'Data Collection & Validation',
      services: ['Collection API (Go)', 'Schema Registry', 'Avro Validator'],
      sla: '< 12ms p99',
      what: 'The Collection API (Go 1.24, 200-node k8s deployment) receives the HTTP/2 request. It authenticates the write key, validates the payload against the Avro schema in Confluent Schema Registry, appends geo-enrichment from MaxMind GeoIP2 (city, country, lat/lng), and strips any PII fields not included in the active consent profile. Valid events are forwarded to Kafka MSK; malformed events route to the Dead Letter Queue.',
      input: {
        "event_type": "purchase",
        "cookie_id": "c_8f2a9b3d",
        "value": 89.99,
        "currency": "EUR",
        "dispatch_ts": 1741343100253
      },
      output: {
        "event_type": "purchase",
        "cookie_id": "c_8f2a9b3d",
        "value": 89.99,
        "currency": "EUR",
        "geo": {
          "country": "DE",
          "city": "Berlin",
          "lat": 52.52,
          "lon": 13.405
        },
        "consent_granted": true,
        "schema_version": "3.1.7",
        "kafka_topic": "cdp-events-prod-eu",
        "kafka_offset": 9182734
      }
    },
    {
      id: 2,
      node: 'identity',
      num: 'Stage 03 / 07',
      name: 'Identity Resolution',
      services: ['id-graph-lib-v2 (Go)', 'BigTable', 'Redis L1 Cache'],
      sla: '< 3ms (cache hit)',
      what: 'The Identity Resolution service (id-graph-lib-v2, written in Go) looks up the incoming cookie_id against the BigTable identity graph. It attempts deterministic matching first (exact ID match on known identifiers: cookie, email hash, IDFA, GAID). If found, the Unified Customer ID (UCID) is returned from Redis L1 cache in < 3ms. On a cache miss, BigTable lookup completes in < 15ms. The resulting UCID ties all cross-device identifiers to a single canonical customer record.',
      input: {
        "cookie_id": "c_8f2a9b3d",
        "geo": { "country": "DE", "city": "Berlin" },
        "consent_granted": true
      },
      output: {
        "ucid": "u_4f8a2c91b3d7e056",
        "cookie_id": "c_8f2a9b3d",
        "match_type": "deterministic",
        "confidence": 1.0,
        "linked_ids": {
          "email_hash": "sha256:a3f2b1...",
          "gaid": "b7c8d9e0-1f23-4a56"
        },
        "resolution_latency_ms": 2.7
      }
    },
    {
      id: 3,
      node: 'profiles',
      num: 'Stage 04 / 07',
      name: 'Profile Store Update',
      services: ['profile-writer (Go)', 'Scylla DB', 'BigQuery Twin', 'GCS Delta'],
      sla: '< 8ms write (Scylla)',
      what: 'The resolved UCID triggers a profile merge in profile-writer-service. The new purchase event is appended to the event log and aggregated traits are recomputed: lifetime_value increments by €89.99, purchase_count increments by 1, last_purchase_at is updated. The hot path writes to Scylla (< 8ms p99). An async BigQuery write syncs the analytics twin within ~2s. A Delta Lake snapshot is written to GCS for batch downstream jobs.',
      input: {
        "ucid": "u_4f8a2c91b3d7e056",
        "event_type": "purchase",
        "value": 89.99,
        "currency": "EUR",
        "timestamp": "2026-03-07T14:18:20.048Z"
      },
      output: {
        "ucid": "u_4f8a2c91b3d7e056",
        "lifetime_value": 502.87,
        "purchase_count": 8,
        "last_purchase_at": "2026-03-07T14:18:20Z",
        "top_category": "footwear",
        "country": "DE",
        "profile_updated_at": "2026-03-07T14:18:20.056Z",
        "delta_path": "gs://cdp-profiles-eu/ucid=u_4f8a..."
      }
    },
    {
      id: 4,
      node: 'audiences',
      num: 'Stage 05 / 07',
      name: 'Segment Re-evaluation',
      services: ['segment-evaluator (Rust)', 'BigQuery', 'Flink 1.18'],
      sla: '< 100ms streaming eval',
      what: 'Every profile write triggers the streaming segment evaluator (Rust, compiled to native binary). It evaluates the updated profile against all 800+ active segment rules in parallel. The user crosses the threshold for the "high_value_eu_footwear" segment: lifetime_value > 400 AND purchase_count >= 8 AND country IN ["DE","AT","CH"]. A segment membership changelog event is emitted to the cdp-segment-changelog Kafka topic, notifying downstream journey and activation services within 200ms.',
      input: {
        "ucid": "u_4f8a2c91b3d7e056",
        "lifetime_value": 502.87,
        "purchase_count": 8,
        "top_category": "footwear",
        "country": "DE"
      },
      output: {
        "ucid": "u_4f8a2c91b3d7e056",
        "segments_entered": [
          "seg_high_value_eu_footwear"
        ],
        "segments_exited": [],
        "eval_rules_checked": 847,
        "eval_latency_ms": 87,
        "changelog_topic": "cdp-segment-changelog",
        "membership_ts": "2026-03-07T14:18:20.143Z"
      }
    },
    {
      id: 5,
      node: 'journeys',
      num: 'Stage 06 / 07',
      name: 'Journey Trigger',
      services: ['journey-executor (Python)', 'Airflow DAG', 'Pub/Sub', 'Braze API'],
      sla: '< 50ms enqueue',
      what: 'The Journey Executor (Python 3.12 microservice, event-driven via Pub/Sub) receives the segment changelog and checks for matching journey triggers. The "EU High Value Re-engagement v3" journey has a trigger: onSegmentEntry("seg_high_value_eu_footwear"). The user has not been in this journey before, so a new instance is created. Step 1 is enqueued: send a personalised email via Braze with product recommendations. A 1-hour wait node follows. The DAG is persisted in Postgres and monitored by Airflow.',
      input: {
        "ucid": "u_4f8a2c91b3d7e056",
        "segment_entered": "seg_high_value_eu_footwear",
        "membership_ts": "2026-03-07T14:18:20.143Z"
      },
      output: {
        "journey_id": "jrn_eu_highval_reeng_v3",
        "journey_instance_id": "ji_9c3f2a81",
        "step_enqueued": "send_email_personalised",
        "channel": "braze",
        "wait_next_step": "PT1H",
        "consent_checked": true,
        "enqueue_latency_ms": 34
      }
    },
    {
      id: 6,
      node: 'activation',
      num: 'Stage 07 / 07',
      name: 'Destination Activation',
      services: ['connector-hub (Scala)', 'Meta CAPI', 'DV360', 'Cloud Trace'],
      sla: '< 200ms delivery',
      what: 'Simultaneously, the Activation Layer (connector-hub, Scala) sees the segment entry and processes pending sync jobs. For the "Meta CAPI Lookalike" and "DV360 Retargeting" destinations, the user\'s hashed email (SHA-256) and GAID are mapped to the destination\'s expected identifier format. OAuth tokens are refreshed automatically; rate-limit queues manage burst. Delivery receipts are written back to BigQuery for the Observability SLO dashboard. The entire journey — click to destination delivery — completes in under 500ms.',
      input: {
        "ucid": "u_4f8a2c91b3d7e056",
        "segment": "seg_high_value_eu_footwear",
        "email_hash": "sha256:a3f2b1...",
        "gaid": "b7c8d9e0-1f23-4a56"
      },
      output: {
        "destinations_activated": [
          {
            "id": "meta_capi_lookalike",
            "identifier": "email_sha256",
            "status": "delivered",
            "latency_ms": 148
          },
          {
            "id": "dv360_retargeting",
            "identifier": "gaid",
            "status": "delivered",
            "latency_ms": 183
          }
        ],
        "consent_checked": true,
        "total_pipeline_ms": 487,
        "trace_id": "proj/cdp-prod/traces/4fa9..."
      }
    }
  ];

  /* ── State ────────────────────────────────────────────────────────── */
  var state = {
    current: 0,
    autoTimer: null,
    autoRunning: false
  };

  /* ── JSON syntax highlighter ──────────────────────────────────────── */
  function formatJSON(obj) {
    var raw = JSON.stringify(obj, null, 2);
    return raw.replace(/("(\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      var cls = 'jn'; // number default
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'jk'; // key
        } else {
          cls = 'js'; // string value
        }
      } else if (/true|false|null/.test(match)) {
        cls = 'jb'; // boolean/null
      }
      return '<span class="' + cls + '">' + match + '</span>';
    });
  }

  /* ── Dot navigation ───────────────────────────────────────────────── */
  function renderDots() {
    var container = document.getElementById('psim-dots');
    if (!container) return;
    container.innerHTML = '';
    PIPELINE_STAGES.forEach(function (stage, i) {
      var btn = document.createElement('button');
      btn.className = 'psim-dot';
      if (i === state.current) btn.className += ' active';
      else if (i < state.current) btn.className += ' completed';
      btn.title = stage.name;
      btn.setAttribute('aria-label', 'Go to stage ' + (i + 1));
      btn.addEventListener('click', function () { goToStage(i); });
      container.appendChild(btn);
    });
  }

  /* ── Render stage card ────────────────────────────────────────────── */
  function renderStage(idx) {
    var stage = PIPELINE_STAGES[idx];
    var card = document.getElementById('psim-stage-card');
    if (!card) return;

    card.classList.add('psim-fading');

    setTimeout(function () {
      /* build services badges */
      var serviceBadges = stage.services.map(function (s) {
        return '<span class="psim-badge-service">' + s + '</span>';
      }).join('');

      card.innerHTML = [
        '<div class="psim-stage-header">',
        '  <div class="psim-stage-num">' + stage.num + '</div>',
        '  <div class="psim-stage-meta">',
        '    <div class="psim-stage-name">' + stage.name + '</div>',
        '    <div class="psim-badges">' + serviceBadges + '<span class="psim-badge-sla">' + stage.sla + '</span></div>',
        '  </div>',
        '</div>',
        '<div class="psim-what-label">What happens</div>',
        '<div class="psim-what-text">' + stage.what + '</div>',
        '<div class="psim-payloads">',
        '  <div class="psim-payload-block">',
        '    <div class="psim-payload-label in">▶ INPUT PAYLOAD</div>',
        '    <pre class="psim-payload-pre">' + formatJSON(stage.input) + '</pre>',
        '  </div>',
        '  <div class="psim-payload-block">',
        '    <div class="psim-payload-label out">◀ OUTPUT PAYLOAD</div>',
        '    <pre class="psim-payload-pre">' + formatJSON(stage.output) + '</pre>',
        '  </div>',
        '</div>'
      ].join('\n');

      card.classList.remove('psim-fading');
    }, 220);

    /* update dots */
    renderDots();

    /* update nav buttons */
    var prevBtn = document.getElementById('psim-prev-btn');
    var nextBtn = document.getElementById('psim-next-btn');
    if (prevBtn) prevBtn.disabled = (idx === 0);
    if (nextBtn) nextBtn.disabled = (idx === PIPELINE_STAGES.length - 1);

    /* update progress label */
    var prog = document.getElementById('psim-progress-text');
    if (prog) prog.textContent = (idx + 1) + ' / ' + PIPELINE_STAGES.length;

    /* update KG highlight */
    if (global.KG && typeof global.KG.highlight === 'function') {
      global.KG.highlight([stage.node]);
    }
  }

  /* ── Navigate to stage ────────────────────────────────────────────── */
  function goToStage(idx) {
    if (idx < 0 || idx >= PIPELINE_STAGES.length) return;
    state.current = idx;
    renderStage(idx);
  }

  /* ── Autoplay ─────────────────────────────────────────────────────── */
  function startAutoplay() {
    if (state.autoRunning) return;
    state.autoRunning = true;
    var playBtn = document.getElementById('psim-play-btn');
    if (playBtn) { playBtn.textContent = '⏹ Stop'; playBtn.classList.add('autoplay-active'); }

    /* if already on last stage, wrap to start */
    if (state.current >= PIPELINE_STAGES.length - 1) {
      state.current = 0;
      renderStage(0);
    }

    state.autoTimer = setInterval(function () {
      if (state.current >= PIPELINE_STAGES.length - 1) {
        stopAutoplay();
        return;
      }
      state.current++;
      renderStage(state.current);
    }, 3000);
  }

  function stopAutoplay() {
    clearInterval(state.autoTimer);
    state.autoTimer = null;
    state.autoRunning = false;
    var playBtn = document.getElementById('psim-play-btn');
    if (playBtn) { playBtn.textContent = '▶ Auto-play'; playBtn.classList.remove('autoplay-active'); }
  }

  /* ── Init ─────────────────────────────────────────────────────────── */
  function init() {
    /* Wire Previous button */
    var prevBtn = document.getElementById('psim-prev-btn');
    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        stopAutoplay();
        goToStage(state.current - 1);
      });
    }

    /* Wire Next button */
    var nextBtn = document.getElementById('psim-next-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        stopAutoplay();
        goToStage(state.current + 1);
      });
    }

    /* Wire Play button */
    var playBtn = document.getElementById('psim-play-btn');
    if (playBtn) {
      playBtn.addEventListener('click', function () {
        if (state.autoRunning) { stopAutoplay(); } else { startAutoplay(); }
      });
    }

    /* Render first stage */
    renderStage(0);
  }

  /* ── KG-ready bootstrap (same pattern as graph-enhancements.js) ─────── */
  function hasKG() {
    return !!(global.KG && typeof global.KG.highlight === 'function');
  }

  function waitForKG(retries) {
    if (hasKG()) { init(); return; }
    if (retries <= 0) {
      /* Install silent no-op stub so KG calls don't throw */
      var noop = function () {};
      global.KG = { highlight: noop, reset: noop, reheat: noop, _fallback: true };
      init();
      return;
    }
    setTimeout(function () { waitForKG(retries - 1); }, 100);
  }

  document.addEventListener('kg:ready', function () {
    if (!hasKG()) waitForKG(40);
    else init();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { waitForKG(80); });
  } else {
    waitForKG(80);
  }

  /* Public API */
  global.PipelineSim = {
    go: goToStage,
    play: startAutoplay,
    stop: stopAutoplay
  };

})(window);
