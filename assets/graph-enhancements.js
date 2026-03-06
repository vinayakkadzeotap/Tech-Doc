/* ═══════════════════════════════════════════════════════════════
   ZEOTAP CDP — GRAPH ENHANCEMENTS CONTROLLER
   Depends on window.KG (canonical graph engine)
   ═══════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';

  var TRACE_PATH = ['collect', 'ingest', 'identity', 'profiles', 'audiences', 'journeys', 'activation'];
  var initialized = false;
  var flowTimers = [];
  var flowRunning = false;

  function hasKG() {
    return !!global.KG;
  }

  function clearFlowTimers() {
    while (flowTimers.length) {
      clearTimeout(flowTimers.pop());
    }
  }

  function findEl(ids) {
    for (var i = 0; i < ids.length; i++) {
      var el = document.getElementById(ids[i]);
      if (el) return el;
    }
    return null;
  }

  function setFlowButtonState(active) {
    var btn = findEl(['btn-simulate-flow', 'btn-simulate']);
    if (!btn) return;

    btn.classList.toggle('active', !!active);
    btn.setAttribute('aria-busy', active ? 'true' : 'false');
  }

  function updateIndicator(stepIndex) {
    var indicator = document.getElementById('sim-indicator');
    if (!indicator) return;

    if (typeof stepIndex !== 'number') {
      indicator.style.display = 'none';
      indicator.textContent = '';
      return;
    }

    indicator.style.display = 'block';
    indicator.textContent = 'Step ' + (stepIndex + 1) + ' / ' + TRACE_PATH.length + ' — ' + TRACE_PATH[stepIndex];
  }

  function resetGraph() {
    flowRunning = false;
    clearFlowTimers();
    setFlowButtonState(false);
    updateIndicator();

    if (!hasKG()) return;
    global.KG.reset();
  }

  function runFallbackFlowSimulation() {
    if (!hasKG()) return;

    resetGraph();
    flowRunning = true;
    setFlowButtonState(true);

    var visited = [];

    TRACE_PATH.forEach(function (nodeId, idx) {
      var timer = setTimeout(function () {
        if (!flowRunning || !hasKG()) return;

        visited.push(nodeId);
        global.KG.highlight(visited, { softTrail: true, keepFlow: true });

        if (idx > 0 && global.KG.activateEdge) {
          global.KG.activateEdge(TRACE_PATH[idx - 1], TRACE_PATH[idx], { append: true });
        }

        updateIndicator(idx);

        if (idx === TRACE_PATH.length - 1) {
          var doneTimer = setTimeout(function () {
            flowRunning = false;
            setFlowButtonState(false);
            updateIndicator();
          }, 900);
          flowTimers.push(doneTimer);
        }
      }, idx * 700);

      flowTimers.push(timer);
    });
  }

  function simulateFlow() {
    if (!hasKG()) return;

    if (flowRunning) {
      resetGraph();
      return;
    }

    if (typeof global.KG.simulateEventFlow === 'function') {
      flowRunning = true;
      setFlowButtonState(true);
      updateIndicator(0);

      global.KG.simulateEventFlow();

      TRACE_PATH.forEach(function (_nodeId, idx) {
        var timer = setTimeout(function () {
          if (!flowRunning) return;
          updateIndicator(idx);

          if (idx === TRACE_PATH.length - 1) {
            var doneTimer = setTimeout(function () {
              flowRunning = false;
              setFlowButtonState(false);
              updateIndicator();
            }, 900);
            flowTimers.push(doneTimer);
          }
        }, idx * 700);

        flowTimers.push(timer);
      });

      return;
    }

    runFallbackFlowSimulation();
  }

  function bindToolbarActions() {
    var simBtn = findEl(['btn-simulate-flow', 'btn-simulate']);
    var resetBtn = findEl(['btn-reset-graph', 'btn-reset']);

    if (simBtn) {
      simBtn.addEventListener('click', function (event) {
        event.preventDefault();
        simulateFlow();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', function (event) {
        event.preventDefault();
        resetGraph();
      });
    }
  }

  function bindCardGraphSync() {
    var cards = document.querySelectorAll('.ds-mod-card[data-node]');
    if (!cards.length) return;

    cards.forEach(function (card) {
      card.addEventListener('mouseenter', function () {
        if (!hasKG() || flowRunning) return;
        var nodeId = card.getAttribute('data-node');
        if (nodeId) global.KG.highlight([nodeId]);
      });

      card.addEventListener('mouseleave', function () {
        if (!hasKG() || flowRunning) return;
        global.KG.reset();
      });

      card.addEventListener('focus', function () {
        if (!hasKG() || flowRunning) return;
        var nodeId = card.getAttribute('data-node');
        if (nodeId) global.KG.highlight([nodeId]);
      });

      card.addEventListener('blur', function () {
        if (!hasKG() || flowRunning) return;
        global.KG.reset();
      });
    });
  }

  function bindBackgroundReset() {
    /* 3D graph handles background click internally via onBackgroundClick */
  }

  function init() {
    if (initialized) return;
    if (!hasKG()) return;

    initialized = true;
    bindToolbarActions();
    bindCardGraphSync();
    bindBackgroundReset();
  }

  function waitForKG(retries) {
    if (hasKG()) {
      init();
      return;
    }

    if (retries <= 0) {
      /* WebGL or graph engine unavailable — install a silent no-op stub
         so any subsequent hasKG() calls return true and stop retrying,
         and any KG.highlight() / KG.reset() calls become silent no-ops. */
      var noop = function () {};
      global.KG = {
        highlight: noop, reset: noop, reheat: noop,
        animateFlow: noop, simulateEventFlow: noop,
        activateEdge: noop, enterFocusMode: noop,
        _fallback: true
      };
      return;
    }

    setTimeout(function () {
      waitForKG(retries - 1);
    }, 100);
  }

  document.addEventListener('kg:ready', init);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      waitForKG(80);
    });
  } else {
    waitForKG(80);
  }
})(window);
