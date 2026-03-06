/* ═══════════════════════════════════════════════════════════════
   ZEOTAP CDP — CINEMATIC FIRST-VISIT EXPERIENCE
   Shows a guided story on first load, auto-plays with typewriter
   ═══════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';

  var STEPS = [
    {
      nodes: ['collect'],
      headline: 'A customer visits your website.',
      sub: 'The Zeotap SDK silently captures every click, scroll, and form interaction in real time — across web, mobile, CRM, and server-side sources.'
    },
    {
      nodes: ['collect', 'ingest'],
      headline: 'Every event streams into the pipeline.',
      sub: 'Raw events flow through DAAP — Pub/Sub streams and Apache Beam jobs validate, enrich, and route petabytes of data without a single dropped event.'
    },
    {
      nodes: ['ingest', 'identity'],
      headline: 'Scattered identities become one.',
      sub: 'Cookies, device IDs, hashed emails, and phone numbers resolve to a single Unified Customer ID (UCID) — even across devices and sessions.'
    },
    {
      nodes: ['identity', 'profiles'],
      headline: 'A complete customer profile is built.',
      sub: 'Every interaction enriches a petabyte-scale Delta Lake profile. Full history, real-time traits, and predictive scores — all in one place.'
    },
    {
      nodes: ['profiles', 'audiences', 'ai'],
      headline: 'Segments update the instant things change.',
      sub: '18,000+ live audience rules re-evaluate continuously. Ask Zoe AI in plain English: "High-value users who browsed sneakers in the last 7 days."'
    },
    {
      nodes: ['audiences', 'journeys', 'ml'],
      headline: 'Personalized journeys trigger automatically.',
      sub: 'Multi-step orchestration responds to segment changes. ML models predict churn, LTV, and propensity — and inject scores into every journey decision.'
    },
    {
      nodes: ['journeys', 'activation', 'privacy'],
      headline: 'The right message reaches the right person.',
      sub: '100+ destination connectors push to Facebook, Google, CRMs, email platforms, and custom webhooks. Consent enforced at every dispatch.'
    },
    {
      nodes: ['collect', 'ingest', 'identity', 'profiles', 'audiences', 'journeys', 'activation', 'ai', 'ml'],
      headline: 'This is the Zeotap CDP.',
      sub: 'From a single event to enterprise-scale activation — privacy-first, AI-powered, and built for the speed modern marketing demands.'
    }
  ];

  var state = {
    currentStep: 0,
    typewriterTimer: null,
    autoTimer: null,
    running: false,
    overlay: null
  };

  /* ── localStorage ─────────────────────────────────────────────── */
  function hasSeen() {
    try { return localStorage.getItem('zt_cin_seen') === '1'; } catch (e) { return true; }
  }

  function markSeen() {
    try { localStorage.setItem('zt_cin_seen', '1'); } catch (e) {}
  }

  /* ── Typewriter ───────────────────────────────────────────────── */
  function typewriter(el, text, speed, onDone) {
    if (state.typewriterTimer) clearInterval(state.typewriterTimer);
    el.textContent = '';
    var i = 0;
    state.typewriterTimer = setInterval(function () {
      if (i < text.length) {
        el.textContent += text[i++];
      } else {
        clearInterval(state.typewriterTimer);
        state.typewriterTimer = null;
        if (onDone) onDone();
      }
    }, speed || 28);
  }

  /* ── DOM builders ─────────────────────────────────────────────── */
  function buildOverlay() {
    if (document.getElementById('cin-overlay')) return document.getElementById('cin-overlay');

    var ov = document.createElement('div');
    ov.id = 'cin-overlay';
    ov.innerHTML =
      '<div class="cin-bg"></div>' +
      '<div class="cin-panel">' +
        '<div class="cin-logo">⬡ Zeotap CDP</div>' +
        '<div class="cin-step-track">' +
          STEPS.map(function (_, i) { return '<div class="cin-dot" data-idx="' + i + '"></div>'; }).join('') +
        '</div>' +
        '<div class="cin-headline" id="cin-headline"></div>' +
        '<div class="cin-sub" id="cin-sub"></div>' +
        '<div class="cin-progress-wrap"><div class="cin-progress-bar" id="cin-progress-bar"></div></div>' +
        '<div class="cin-actions">' +
          '<button class="cin-skip" id="cin-skip">Skip intro</button>' +
          '<div class="cin-nav">' +
            '<button class="cin-btn-sec" id="cin-prev">← Back</button>' +
            '<button class="cin-btn-primary" id="cin-next">Next →</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(ov);

    document.getElementById('cin-skip').addEventListener('click', hide);
    document.getElementById('cin-next').addEventListener('click', nextStep);
    document.getElementById('cin-prev').addEventListener('click', prevStep);

    /* Click dots */
    ov.querySelectorAll('.cin-dot').forEach(function (dot) {
      dot.addEventListener('click', function () {
        var idx = parseInt(dot.getAttribute('data-idx'), 10);
        goToStep(idx);
      });
    });

    state.overlay = ov;
    return ov;
  }

  /* ── Step rendering ───────────────────────────────────────────── */
  function goToStep(idx) {
    if (idx < 0 || idx >= STEPS.length) return;
    state.currentStep = idx;

    if (state.autoTimer) { clearTimeout(state.autoTimer); state.autoTimer = null; }

    var step = STEPS[idx];
    var headlineEl = document.getElementById('cin-headline');
    var subEl = document.getElementById('cin-sub');
    var progressBar = document.getElementById('cin-progress-bar');
    var prevBtn = document.getElementById('cin-prev');
    var nextBtn = document.getElementById('cin-next');

    /* Dots */
    state.overlay.querySelectorAll('.cin-dot').forEach(function (d, i) {
      d.className = 'cin-dot' + (i < idx ? ' passed' : '') + (i === idx ? ' active' : '');
    });

    /* Progress bar */
    var pct = ((idx + 1) / STEPS.length * 100).toFixed(1);
    progressBar.style.width = pct + '%';

    /* Prev/Next */
    prevBtn.style.display = idx === 0 ? 'none' : '';
    nextBtn.textContent = idx === STEPS.length - 1 ? 'Start Exploring →' : 'Next →';

    /* Highlight graph nodes */
    if (global.KG && typeof global.KG.highlight === 'function') {
      global.KG.highlight(step.nodes);
    }

    /* Sub text immediate */
    subEl.textContent = '';
    subEl.style.opacity = '0';

    /* Typewriter headline then fade in sub */
    typewriter(headlineEl, step.headline, 24, function () {
      subEl.textContent = step.sub;
      subEl.style.transition = 'opacity 0.5s ease';
      subEl.style.opacity = '1';

      /* Auto-advance */
      if (idx < STEPS.length - 1) {
        state.autoTimer = setTimeout(function () {
          nextStep();
        }, 4500);
      }
    });
  }

  function nextStep() {
    if (state.currentStep >= STEPS.length - 1) {
      hide();
    } else {
      goToStep(state.currentStep + 1);
    }
  }

  function prevStep() {
    if (state.currentStep > 0) goToStep(state.currentStep - 1);
  }

  /* ── Show / Hide ──────────────────────────────────────────────── */
  function show() {
    buildOverlay();
    state.currentStep = 0;
    requestAnimationFrame(function () {
      state.overlay.classList.add('visible');
      goToStep(0);
    });
  }

  function hide() {
    markSeen();
    if (state.typewriterTimer) clearInterval(state.typewriterTimer);
    if (state.autoTimer) clearTimeout(state.autoTimer);
    if (global.KG) global.KG.reset();

    if (state.overlay) {
      state.overlay.classList.remove('visible');
      state.overlay.classList.add('hiding');
      setTimeout(function () {
        if (state.overlay) {
          state.overlay.classList.remove('hiding');
          state.overlay.style.display = 'none';
        }
      }, 500);
    }
  }

  /* ── Public API ───────────────────────────────────────────────── */
  global.Cinematic = {
    show: show,
    hide: hide,
    reset: function () {
      try { localStorage.removeItem('zt_cin_seen'); } catch (e) {}
      show();
    }
  };

  /* ── Boot ─────────────────────────────────────────────────────── */
  function boot() {
    if (hasSeen()) return;
    /* Wait for graph to init before showing */
    document.addEventListener('kg:ready', function () {
      setTimeout(show, 600);
    });
    /* Fallback if KG never fires */
    setTimeout(function () {
      if (!hasSeen()) show();
    }, 3000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})(window);
