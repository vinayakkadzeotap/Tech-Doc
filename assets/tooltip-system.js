/* ═══════════════════════════════════════════════════════════════════
   ZEOTAP CDP — TOOLTIP SYSTEM (COMPAT)
   ═══════════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';

  function getEls() {
    var root = document.getElementById('graph-tooltip');
    if (!root) return null;

    return {
      root: root,
      title: root.querySelector('.kg-tip-title') || root.querySelector('.ds-tt-title'),
      cat: root.querySelector('.kg-tip-badge') || root.querySelector('.ds-tt-cat'),
      desc: root.querySelector('.kg-tip-desc') || root.querySelector('.ds-tt-desc'),
      tech: root.querySelector('.kg-tip-tech') || root.querySelector('.ds-tt-tech'),
    };
  }

  function getCategoryColor(category) {
    var colors = {
      Ingestion: '#06b6d4',
      Core: '#3b82f6',
      Storage: '#8b5cf6',
      Activation: '#f59e0b',
      Intelligence: '#10b981',
      Analytics: '#ec4899',
      Compliance: '#f97316',
      Security: '#ef4444',
      Platform: '#64748b',
    };
    return colors[category] || '#94a3b8';
  }

  var TooltipSystem = {
    init: function () {
      var els = getEls();
      if (!els) return;
      els.root.classList.add('tooltip-enhanced');

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') TooltipSystem.hide();
      });
    },

    show: function (title, category, description, tech, position) {
      var els = getEls();
      if (!els) return;

      if (els.title) els.title.textContent = title || '';
      if (els.desc) els.desc.textContent = description || '';
      if (els.tech) els.tech.textContent = Array.isArray(tech) ? tech.join(' · ') : String(tech || '');

      if (els.cat) {
        var color = getCategoryColor(category || '');
        els.cat.textContent = category || '';
        els.cat.style.background = color + '22';
        els.cat.style.color = color;
      }

      if (position) {
        var maxX = Math.max(8, window.innerWidth - 320);
        var maxY = Math.max(8, window.innerHeight - 180);
        var x = Math.min(Math.max(8, position.x), maxX);
        var y = Math.min(Math.max(8, position.y), maxY);
        els.root.style.left = x + 'px';
        els.root.style.top = y + 'px';
      }

      els.root.classList.add('visible');
    },

    hide: function () {
      var els = getEls();
      if (!els) return;
      els.root.classList.remove('visible');
    },

    getCategoryColor: getCategoryColor,
  };

  global.TooltipSystem = TooltipSystem;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      TooltipSystem.init();
    });
  } else {
    TooltipSystem.init();
  }
})(window);
