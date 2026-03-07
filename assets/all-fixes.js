/* ═══════════════════════════════════════════════════════════════════
   ZEOTAP CDP — All-Fixes Runtime Module  v2.0
   Fixes: copy buttons, search alias, edit links, graph resize, page transitions
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  function initCopyButtons() {
    document.querySelectorAll('.code-block, pre').forEach(function (block) {
      if (block.querySelector('.zdp-copy-btn')) return;
      var codeEl = block.tagName === 'PRE' ? (block.querySelector('code') || block) : (block.querySelector('pre code') || block.querySelector('pre'));
      if (!codeEl) return;
      var lang = '';
      var hdr = block.querySelector('.code-header .code-lang, .code-header');
      if (hdr) lang = hdr.textContent.trim().split(' ')[0].split('—')[0].trim();
      else { var m = (codeEl.className || '').match(/language-(\w+)/); if (m) lang = m[1]; }
      var btn = document.createElement('button');
      btn.className = 'zdp-copy-btn';
      btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy' + (lang ? '<span class="zdp-copy-lang">' + lang + '</span>' : '');
      btn.addEventListener('click', function () {
        navigator.clipboard && navigator.clipboard.writeText(codeEl.innerText || codeEl.textContent || '').then(function () {
          btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Copied!';
          btn.classList.add('copied');
          setTimeout(function () { btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy' + (lang ? '<span class="zdp-copy-lang">' + lang + '</span>' : ''); btn.classList.remove('copied'); }, 2000);
        });
      });
      if (block.style.position !== 'absolute' && block.style.position !== 'fixed') block.style.position = 'relative';
      block.appendChild(btn);
    });
  }

  var s1 = document.createElement('style');
  s1.textContent = '.zdp-copy-btn{position:absolute;top:10px;right:10px;display:flex;align-items:center;gap:5px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:6px;padding:4px 10px;font-size:11px;font-weight:600;color:rgba(255,255,255,0.45);cursor:pointer;font-family:Inter,sans-serif;transition:all 0.15s;z-index:10;white-space:nowrap}.zdp-copy-btn:hover{background:rgba(59,130,246,0.15);border-color:rgba(59,130,246,0.3);color:#93c5fd}.zdp-copy-btn.copied{background:rgba(16,185,129,0.12);border-color:rgba(16,185,129,0.3);color:#34d399}.zdp-copy-lang{background:rgba(255,255,255,0.06);border-radius:3px;padding:1px 5px;font-size:10px;color:rgba(255,255,255,0.25);margin-left:4px}';
  document.head.appendChild(s1);

  if (window.ZEOTAP_SEARCH_INDEX && !window.SEARCH_INDEX) window.SEARCH_INDEX = window.ZEOTAP_SEARCH_INDEX;

  function injectEditLink() {
    var page = location.pathname.split('/').pop() || 'index.html';
    var actions = document.querySelector('.topbar-actions,.ds-topbar-right,.topbar-right');
    if (!actions || document.querySelector('.zdp-edit-link')) return;
    var a = document.createElement('a');
    a.href = 'https://github.com/vinayakkadzeotap/Tech-Doc/edit/main/' + page;
    a.target = '_blank'; a.rel = 'noopener noreferrer'; a.className = 'zdp-edit-link';
    a.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> Edit';
    actions.insertBefore(a, actions.firstChild);
  }
  var s2 = document.createElement('style');
  s2.textContent = '.zdp-edit-link{display:flex;align-items:center;gap:5px;font-size:12px;font-weight:600;color:rgba(255,255,255,0.35);text-decoration:none;padding:5px 10px;border:1px solid rgba(255,255,255,0.07);border-radius:6px;transition:all 0.15s;font-family:Inter,sans-serif}.zdp-edit-link:hover{color:#93c5fd;border-color:rgba(59,130,246,0.3);background:rgba(59,130,246,0.06)}';
  document.head.appendChild(s2);

  function fixGraphCanvas() {
    var c = document.getElementById('knowledge-graph');
    if (!c) return;
    function go() { var cv = c.querySelector('canvas'); if (!cv) return; var w = c.clientWidth; if (w > 100 && cv.width !== w) { cv.width = w; cv.style.width = '100%'; if (window.KG && window.KG.reheat) window.KG.reheat(); } }
    if (typeof ResizeObserver !== 'undefined') new ResizeObserver(go).observe(c);
    setTimeout(go, 500); setTimeout(go, 1500);
  }

  function initTransitions() {
    document.body.classList.add('page-enter');
    setTimeout(function () { document.body.classList.remove('page-enter'); }, 300);
    document.addEventListener('click', function (e) {
      var l = e.target.closest('a[href]'); if (!l) return;
      var h = l.getAttribute('href');
      if (!h || h.startsWith('#') || h.startsWith('javascript') || h.startsWith('http') || h.startsWith('mailto') || l.target === '_blank') return;
      e.preventDefault();
      Object.assign(document.body.style, { opacity: '0', transform: 'translateY(-6px)', transition: 'opacity 150ms ease, transform 150ms ease' });
      setTimeout(function () { window.location.href = h; }, 150);
    });
  }

  function run() {
    if (window.ZEOTAP_SEARCH_INDEX && !window.SEARCH_INDEX) window.SEARCH_INDEX = window.ZEOTAP_SEARCH_INDEX;
    initCopyButtons(); injectEditLink(); fixGraphCanvas(); initTransitions();
    new MutationObserver(function (muts) { muts.forEach(function (m) { m.addedNodes.forEach(function (n) { if (n.nodeType === 1 && n.querySelectorAll && n.querySelectorAll('pre,.code-block').length) initCopyButtons(); }); }); }).observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
  setTimeout(function () { if (window.ZEOTAP_SEARCH_INDEX && !window.SEARCH_INDEX) window.SEARCH_INDEX = window.ZEOTAP_SEARCH_INDEX; initCopyButtons(); }, 800);
}());
