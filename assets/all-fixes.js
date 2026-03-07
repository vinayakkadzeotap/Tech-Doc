/* ═══════════════════════════════════════════════════════════════════
   ZEOTAP CDP — All-Fixes Runtime Module  v1.0
   Applies across hub page + all chapter pages.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  function initCopyButtons() {
    var blocks = document.querySelectorAll('.code-block, pre');
    blocks.forEach(function (block) {
      if (block.querySelector('.zdp-copy-btn')) return;
      var codeEl = block.tagName === 'PRE'
        ? block.querySelector('code') || block
        : block.querySelector('pre code') || block.querySelector('pre');
      if (!codeEl) return;
      var lang = '';
      var header = block.querySelector('.code-header .code-lang, .code-header');
      if (header) {
        lang = header.textContent.trim().split(' ')[0].split('\u2014')[0].trim();
      } else {
        var cls = (codeEl.className || '').match(/language-(\w+)/);
        if (cls) lang = cls[1];
      }
      var btn = document.createElement('button');
      btn.className = 'zdp-copy-btn';
      btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy';
      if (lang) btn.innerHTML += '<span class="zdp-copy-lang">' + lang + '</span>';
      btn.addEventListener('click', function () {
        var text = codeEl.innerText || codeEl.textContent || '';
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(function () {
            btn.innerHTML = '\u2713 Copied!';
            btn.classList.add('copied');
            setTimeout(function () {
              btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy' + (lang ? '<span class="zdp-copy-lang">' + lang + '</span>' : '');
              btn.classList.remove('copied');
            }, 2000);
          });
        }
      });
      if (block.style.position !== 'absolute') block.style.position = 'relative';
      block.appendChild(btn);
    });
  }

  var copyCSS = document.createElement('style');
  copyCSS.textContent = '.zdp-copy-btn{position:absolute;top:10px;right:10px;display:flex;align-items:center;gap:5px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:6px;padding:4px 10px;font-size:11px;font-weight:600;color:rgba(255,255,255,0.45);cursor:pointer;font-family:Inter,sans-serif;transition:all .15s;z-index:10;white-space:nowrap}.zdp-copy-btn:hover{background:rgba(59,130,246,0.15);border-color:rgba(59,130,246,0.3);color:#93c5fd}.zdp-copy-btn.copied{background:rgba(16,185,129,0.12);border-color:rgba(16,185,129,0.3);color:#34d399}.zdp-copy-lang{background:rgba(255,255,255,0.06);border-radius:3px;padding:1px 5px;font-size:10px;color:rgba(255,255,255,0.25);margin-left:4px}';
  document.head.appendChild(copyCSS);

  function injectEditLink() {
    var page = location.pathname.split('/').pop() || 'index.html';
    if (!page || page === '' || page === '/') page = 'index.html';
    var ghBase = 'https://github.com/vinayakkadzeotap/Tech-Doc/edit/main/';
    var editUrl = ghBase + page;
    var actions = document.querySelector('.topbar-actions, .ds-topbar-right, .topbar-right');
    if (!actions || document.querySelector('.zdp-edit-link')) return;
    var link = document.createElement('a');
    link.href = editUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.className = 'zdp-edit-link';
    link.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> Edit';
    actions.insertBefore(link, actions.firstChild);
  }

  var editCSS = document.createElement('style');
  editCSS.textContent = '.zdp-edit-link{display:flex;align-items:center;gap:5px;font-size:12px;font-weight:600;color:rgba(255,255,255,0.35);text-decoration:none;padding:5px 10px;border:1px solid rgba(255,255,255,0.07);border-radius:6px;transition:all .15s;font-family:Inter,sans-serif}.zdp-edit-link:hover{color:#93c5fd;border-color:rgba(59,130,246,0.3);background:rgba(59,130,246,0.06)}';
  document.head.appendChild(editCSS);

  function fixGraphCanvas() {
    var container = document.getElementById('knowledge-graph');
    if (!container) return;
    function resizeCanvas() {
      var canvas = container.querySelector('canvas');
      if (!canvas) return;
      var w = container.clientWidth;
      if (w > 100 && canvas.width !== w) {
        canvas.width = w;
        canvas.style.width = '100%';
        if (window.KG && typeof window.KG.reheat === 'function') window.KG.reheat();
      }
    }
    if (typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(function () { resizeCanvas(); }).observe(container);
    }
    setTimeout(resizeCanvas, 500);
    setTimeout(resizeCanvas, 1500);
  }

  function run() {
    if (window.ZEOTAP_SEARCH_INDEX && !window.SEARCH_INDEX) window.SEARCH_INDEX = window.ZEOTAP_SEARCH_INDEX;
    initCopyButtons();
    injectEditLink();
    fixGraphCanvas();
    new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        m.addedNodes.forEach(function (node) {
          if (node.nodeType === 1 && node.querySelectorAll) {
            if (node.querySelectorAll('pre, .code-block').length) initCopyButtons();
          }
        });
      });
    }).observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
  setTimeout(function () {
    if (window.ZEOTAP_SEARCH_INDEX && !window.SEARCH_INDEX) window.SEARCH_INDEX = window.ZEOTAP_SEARCH_INDEX;
    initCopyButtons();
  }, 800);
}());
