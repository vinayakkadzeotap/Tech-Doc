/* ═══════════════════════════════════════════════════════════════
   ZEOTAP CDP — KNOWLEDGE GRAPH ENHANCED (COMPAT SHIM)
   Canonical engine now lives in assets/knowledge-graph.js
   ═══════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';

  if (global.KG) {
    console.info('[KG] Canonical graph engine is active (assets/knowledge-graph.js).');
    return;
  }

  console.warn('[KG] assets/knowledge-graph-enhanced.js is deprecated. Load assets/knowledge-graph.js before graph modules.');
})(window);
