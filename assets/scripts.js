/* ============================================================
   ZEOTAP TECHNICAL DOCUMENTATION — SHARED SCRIPTS  v4
   Handles TWO page templates:
     Template A: body > div.main > header.topbar + div.content
                 sidebar uses .sidebar-section / .sidebar-nav / sub-nav
                 headings have IDs directly: <h2 id="...">
     Template B: body > div.layout > aside + main.content
                 topbar is div.topbar inside main.content (no .topbar-actions)
                 sidebar uses nav.sidebar-nav > div.nav-section + a.nav-item
                 headings inside sections: <section id="..."><h2>

   Features:
     1.  Auto-wrap tables
     2.  Mobile sidebar toggle
     3.  Tab switching
     4.  Scrollspy (both templates)
     5.  Code copy buttons
     6.  Keyboard chapter navigation (Alt+←/→)
     7.  Smooth anchor scroll with offset
     8.  Reading progress bar
     9.  Heading anchor links (both templates)
     10. Sidebar section collapse (both templates)
     11. Back-to-top button
     12. Search ⌘K / / (both templates)
   ============================================================ */

const Theme = {
  init() {
    const saved = localStorage.getItem("theme");
    // Default to dark for the "Product" identity
    const theme = saved || "dark";
    document.documentElement.setAttribute("data-theme", theme);
    this.updateToggleIcon();
  },

  toggle() {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    this.updateToggleIcon();
  },

  updateToggleIcon() {
    const btn = document.querySelector(".theme-toggle");
    if (!btn) return;
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    btn.innerHTML = isDark ? '🌙' : '☀️';
    btn.title = isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';
  },

  injectToggle(parent) {
    if (document.querySelector('.theme-toggle')) return;
    const btn = document.createElement('button');
    btn.className = 'theme-toggle';
    btn.style.cssText = 'background:none; border:1px solid var(--border); border-radius:8px; width:36px; height:36px; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:18px; color:var(--text-primary); margin-left:10px; transition:all 0.2s;';
    btn.setAttribute('aria-label', 'Toggle theme');
    parent.appendChild(btn);
    btn.addEventListener('click', () => this.toggle());
    this.updateToggleIcon();
  }
};

(function () {
  'use strict';

  Theme.init();

  /* ── detect template ── */
  var isTemplateB = !!document.querySelector('div.layout');
  var topbar = document.querySelector('.topbar, .ds-topbar');

  /* ──────────────────────────────────────────────
     1. AUTO-WRAP TABLES
  ────────────────────────────────────────────── */
  document.querySelectorAll('table').forEach(function (t) {
    if (!t.closest('.table-wrapper')) {
      var w = document.createElement('div');
      w.className = 'table-wrapper';
      t.parentNode.insertBefore(w, t);
      w.appendChild(t);
    }
  });

  /* ──────────────────────────────────────────────
     2. MOBILE SIDEBAR TOGGLE
  ────────────────────────────────────────────── */
  var sidebar = document.querySelector('.sidebar');

  if (topbar && sidebar) {
    var menuBtn = document.createElement('button');
    menuBtn.className = 'menu-toggle';
    menuBtn.setAttribute('aria-label', 'Toggle navigation');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.innerHTML = '&#9776;';
    topbar.insertBefore(menuBtn, topbar.firstChild);

    var sideOverlay = document.createElement('div');
    sideOverlay.className = 'sidebar-overlay';
    document.body.insertBefore(sideOverlay, document.body.firstChild);

    function openSidebar() {
      sidebar.classList.add('open');
      sideOverlay.classList.add('show');
      menuBtn.setAttribute('aria-expanded', 'true');
      menuBtn.innerHTML = '&#10005;';
      document.body.style.overflow = 'hidden';
    }
    function closeSidebar() {
      sidebar.classList.remove('open');
      sideOverlay.classList.remove('show');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.innerHTML = '&#9776;';
      document.body.style.overflow = '';
    }
    menuBtn.addEventListener('click', function () {
      sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
    });
    sideOverlay.addEventListener('click', closeSidebar);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && sidebar.classList.contains('open')) closeSidebar();
    });
    sidebar.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth <= 900) closeSidebar();
      });
    });
  }

  /* ──────────────────────────────────────────────
     3. TAB SWITCHING
  ────────────────────────────────────────────── */
  document.querySelectorAll('.tab-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var tabs = btn.closest('.tabs');
      if (!tabs) return;
      var target = btn.getAttribute('data-tab');
      tabs.querySelectorAll('.tab-btn').forEach(function (b) {
        b.classList.toggle('active', b === btn);
      });
      tabs.querySelectorAll('.tab-content').forEach(function (p) {
        p.classList.toggle('active', p.getAttribute('data-tab') === target);
      });
    });
  });

  /* ──────────────────────────────────────────────
     4. SCROLLSPY — works for both templates
  ────────────────────────────────────────────── */
  // Template A: h2[id], h3[id]  |  Template B: section[id]
  var spyTargets = Array.from(
    isTemplateB
      ? document.querySelectorAll('section[id]')
      : document.querySelectorAll('.content h2[id], .content h3[id], main.content h2[id], main.content h3[id]')
  );

  // Template A: sub-nav links   |  Template B: .nav-item[href^="#"]
  var spyLinks = document.querySelectorAll(
    isTemplateB
      ? '.sidebar-nav a.nav-item[href^="#"]'
      : '.sidebar-nav .sub-nav a[href^="#"]'
  );

  if (spyTargets.length && spyLinks.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = '#' + entry.target.id;
          spyLinks.forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('href') === id);
          });
        }
      });
    }, { rootMargin: '-15% 0px -70% 0px', threshold: 0 });
    spyTargets.forEach(function (el) { spy.observe(el); });
  }

  /* ──────────────────────────────────────────────
     5. CODE COPY BUTTONS
  ────────────────────────────────────────────── */
  document.querySelectorAll('.code-copy').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var block = btn.closest('.code-block');
      if (!block) return;
      var code = block.querySelector('pre code, pre');
      if (!code) return;
      navigator.clipboard.writeText(code.innerText || code.textContent || '').then(function () {
        var orig = btn.textContent;
        btn.textContent = '✓ Copied!';
        btn.style.color = '#4ade80';
        setTimeout(function () { btn.textContent = orig; btn.style.color = ''; }, 2000);
      });
    });
  });

  /* ──────────────────────────────────────────────
     6. KEYBOARD CHAPTER NAVIGATION (Alt+← →)
  ────────────────────────────────────────────── */
  var prevLink = document.querySelector('.chapter-nav a:first-child, a[aria-label="Previous chapter"]');
  var nextLink = document.querySelector('.chapter-nav a:last-child,  a[aria-label="Next chapter"]');
  document.addEventListener('keydown', function (e) {
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
    var so = document.getElementById('search-overlay');
    if (so && so.classList.contains('open')) return;
    if (e.altKey && e.key === 'ArrowLeft' && prevLink) prevLink.click();
    if (e.altKey && e.key === 'ArrowRight' && nextLink) nextLink.click();
  });

  /* ──────────────────────────────────────────────
     7. SMOOTH ANCHOR SCROLL WITH TOPBAR OFFSET
  ────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var hash = a.getAttribute('href');
      if (hash === '#') return;
      var target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      var th = topbar ? topbar.offsetHeight : 0;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - th - 20, behavior: 'smooth' });
      history.pushState(null, '', hash);
    });
  });

  /* ──────────────────────────────────────────────
     8. READING PROGRESS BAR
  ────────────────────────────────────────────── */
  var prog = document.createElement('div');
  prog.className = 'reading-progress';
  document.body.insertBefore(prog, document.body.firstChild);

  window.addEventListener('scroll', function () {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    prog.style.width = (h > 0 ? Math.min(100, (window.scrollY / h) * 100) : 0) + '%';
  }, { passive: true });

  /* ──────────────────────────────────────────────
     9. HEADING ANCHOR LINKS (#)
     Template A: h2[id], h3[id]
     Template B: section[id] > h2 / h3  (link to section id)
  ────────────────────────────────────────────── */
  var anchorHeadings;
  if (isTemplateB) {
    // Collect h2/h3 that are direct children of section[id]
    anchorHeadings = Array.from(document.querySelectorAll('section[id] > h2, section[id] > h3'));
  } else {
    anchorHeadings = Array.from(document.querySelectorAll(
      '.content h2[id], .content h3[id], main.content h2[id], main.content h3[id]'
    ));
  }

  anchorHeadings.forEach(function (h) {
    var id = isTemplateB ? h.closest('section').id : h.id;
    if (!id) return;
    var a = document.createElement('a');
    a.className = 'anchor-link';
    a.href = '#' + id;
    a.textContent = '#';
    a.setAttribute('aria-hidden', 'true');
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var targetEl = document.getElementById(id);
      if (!targetEl) return;
      var th = topbar ? topbar.offsetHeight : 0;
      window.scrollTo({ top: targetEl.getBoundingClientRect().top + window.scrollY - th - 20, behavior: 'smooth' });
      history.pushState(null, '', '#' + id);
      navigator.clipboard && navigator.clipboard.writeText(window.location.href);
    });
    h.appendChild(a);
  });

  /* ──────────────────────────────────────────────
     10. SIDEBAR SECTION COLLAPSE
     Template A: .sidebar-section with .sidebar-section-title + .sidebar-nav
     Template B: nav.sidebar-nav > div.nav-section (grouped items follow until next)
  ────────────────────────────────────────────── */
  if (!isTemplateB) {
    /* Template A */
    document.querySelectorAll('.sidebar-section').forEach(function (sec) {
      var title = sec.querySelector('.sidebar-section-title');
      var nav = sec.querySelector('.sidebar-nav');
      if (!title || !nav) return;

      var hdr = document.createElement('div');
      hdr.className = 'sidebar-section-header';
      var arrow = document.createElement('span');
      arrow.className = 'sidebar-collapse-arrow';
      arrow.innerHTML = '▼';
      title.parentNode.insertBefore(hdr, title);
      hdr.appendChild(title);
      hdr.appendChild(arrow);
      hdr.addEventListener('click', function () { sec.classList.toggle('collapsed'); });
    });
  } else {
    /* Template B — make each .nav-section div a collapsible group header */
    var navSections = document.querySelectorAll('.sidebar-nav .nav-section');
    navSections.forEach(function (ns) {
      ns.classList.add('nav-section-header');
      var arrow = document.createElement('span');
      arrow.className = 'sidebar-collapse-arrow';
      arrow.innerHTML = '▼';
      ns.appendChild(arrow);

      // Gather siblings until next .nav-section
      function getGroupItems() {
        var items = [];
        var el = ns.nextElementSibling;
        while (el && !el.classList.contains('nav-section')) {
          items.push(el);
          el = el.nextElementSibling;
        }
        return items;
      }

      ns.addEventListener('click', function () {
        var collapsed = ns.classList.toggle('nav-section-collapsed');
        getGroupItems().forEach(function (item) {
          item.style.display = collapsed ? 'none' : '';
        });
        arrow.style.transform = collapsed ? 'rotate(-90deg)' : '';
      });
    });
  }

  /* ──────────────────────────────────────────────
     11. BACK-TO-TOP BUTTON
  ────────────────────────────────────────────── */
  var btt = document.createElement('button');
  btt.className = 'back-to-top';
  btt.innerHTML = '↑';
  btt.title = 'Back to top';
  document.body.appendChild(btt);
  window.addEventListener('scroll', function () {
    btt.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btt.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* ──────────────────────────────────────────────
     12. SEARCH SYSTEM
  ────────────────────────────────────────────── */
  var searchIndex = window.ZEOTAP_SEARCH_INDEX || [];

  /* Inject search trigger button into topbar — works for BOTH templates */
  if (topbar) {
    var searchTrigger = document.createElement('button');
    searchTrigger.className = 'search-trigger';
    searchTrigger.id = 'search-trigger';
    searchTrigger.setAttribute('aria-label', 'Search documentation');
    searchTrigger.innerHTML =
      '<span class="search-trigger-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>' +
      '<span class="search-trigger-text">Search docs…</span>' +
      '<kbd class="search-trigger-kbd">⌘K</kbd>';

    var topbarActions = topbar.querySelector('.topbar-actions');
    if (topbarActions) {
      /* Template A — has .topbar-actions */
      var divider = document.createElement('div');
      divider.className = 'topbar-divider';
      topbarActions.insertBefore(divider, topbarActions.firstChild);
      topbarActions.insertBefore(searchTrigger, topbarActions.firstChild);
    } else {
      /* Template B — no .topbar-actions, create one and append to topbar */
      var actionsWrap = document.createElement('div');
      actionsWrap.className = 'topbar-actions';
      actionsWrap.appendChild(searchTrigger);
      topbar.appendChild(actionsWrap);
    }

    /* Inject Theme Toggle */
    var topbarActions = topbar.querySelector('.topbar-actions, .ds-topbar-right');
    if (topbarActions) {
      Theme.injectToggle(topbarActions);
    }
  }

  /* Build search modal */
  var searchModal = document.createElement('div');
  searchModal.className = 'search-overlay';
  searchModal.id = 'search-overlay';
  searchModal.innerHTML =
    '<div class="search-modal" id="search-modal">' +
    '<div class="search-input-row">' +
    '<span class="search-input-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>' +
    '<input type="text" id="search-input" placeholder="Search chapters, APIs, concepts…" autocomplete="off" spellcheck="false" />' +
    '<button class="search-clear" id="search-clear" title="Clear">✕</button>' +
    '</div>' +
    '<div class="search-results" id="search-results">' +
    '<div class="search-hint" id="search-hint">' +
    '<span class="search-hint-label">Quick jump</span>' +
    '<span class="search-hint-chip" data-query="API reference">API Reference</span>' +
    '<span class="search-hint-chip" data-query="identity resolution">Identity</span>' +
    '<span class="search-hint-chip" data-query="profile store">Profile Store</span>' +
    '<span class="search-hint-chip" data-query="audience segment">Audiences</span>' +
    '<span class="search-hint-chip" data-query="GDPR privacy">Privacy</span>' +
    '<span class="search-hint-chip" data-query="SDK collect">SDK</span>' +
    '<span class="search-hint-chip" data-query="GenAI Zoe">Zoe AI</span>' +
    '<span class="search-hint-chip" data-query="CI/CD pipeline">CI/CD</span>' +
    '</div>' +
    '</div>' +
    '<div class="search-footer">' +
    '<span class="search-footer-hint"><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>' +
    '<span class="search-footer-hint"><kbd>↵</kbd> Open</span>' +
    '<span class="search-footer-hint"><kbd>ESC</kbd> Close</span>' +
    '<span class="search-footer-right search-footer-hint"><kbd>/</kbd> or <kbd>⌘K</kbd></span>' +
    '</div>' +
    '</div>';
  document.body.appendChild(searchModal);

  var sInput = document.getElementById('search-input');
  var sResults = document.getElementById('search-results');
  var sHint = document.getElementById('search-hint');
  var sClear = document.getElementById('search-clear');
  var selIdx = -1;

  function openSearch(q) {
    searchModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(function () {
      sInput.focus();
      if (q) { sInput.value = q; sClear.classList.add('visible'); runSearch(q); }
    }, 40);
  }

  function closeSearch() {
    searchModal.classList.remove('open');
    document.body.style.overflow = '';
    sInput.value = '';
    sClear.classList.remove('visible');
    selIdx = -1;
    showHints();
  }

  function showHints() {
    sResults.innerHTML = '';
    sResults.appendChild(sHint);
  }

  /* Scoring */
  function scoreMatch(text, q) {
    if (!text) return 0;
    var t = text.toLowerCase(), lq = q.toLowerCase();
    if (t === lq) return 100;
    if (t.startsWith(lq)) return 80;
    if (t.includes(lq)) return 60;
    var words = lq.split(/\s+/).filter(function (w) { return w.length > 1; });
    var m = words.filter(function (w) { return t.includes(w); }).length;
    return m > 0 ? (m / words.length) * 40 : 0;
  }

  function highlight(text, q) {
    if (!q) return text;
    var parts = q.trim().split(/\s+/).filter(Boolean).map(function (p) {
      return p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    });
    if (!parts.length) return text;
    return text.replace(new RegExp('(' + parts.join('|') + ')', 'gi'), '<mark>$1</mark>');
  }

  function escHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function runSearch(q) {
    q = q.trim();
    if (!q) { showHints(); return; }

    var res = [];
    searchIndex.forEach(function (pg) {
      var ps = Math.max(
        scoreMatch(pg.title, q), scoreMatch(pg.subtitle, q), scoreMatch(pg.chapter, q),
        (pg.tags || []).reduce(function (m, t) { return Math.max(m, scoreMatch(t, q)); }, 0)
      );
      if (ps > 0) res.push({ type: 'page', icon: pg.icon, title: pg.title, sub: pg.chapter, url: pg.url, s: ps });

      (pg.sections || []).forEach(function (sec) {
        var ss = Math.max(scoreMatch(sec.title, q), scoreMatch(sec.keywords || '', q));
        if (ss > 0) res.push({ type: 'section', icon: '§', title: sec.title, sub: pg.title, url: pg.url + '#' + sec.id, s: ss });
      });
    });

    res.sort(function (a, b) {
      if (b.s !== a.s) return b.s - a.s;
      return a.type === 'page' ? -1 : 1;
    });
    res = res.slice(0, 24);
    selIdx = -1;
    renderResults(res, q);
  }

  function renderResults(res, q) {
    sResults.innerHTML = '';
    if (!res.length) {
      sResults.innerHTML =
        '<div class="search-empty"><span class="search-empty-icon">&#9072;</span>' +
        'No results for "' + escHtml(q) + '"' +
        '<br><small style="margin-top:8px;display:block;color:var(--text-muted)">Try different keywords or browse the sidebar</small></div>';
      return;
    }

    function renderGroup(label, items) {
      if (!items.length) return;
      var gl = document.createElement('div');
      gl.className = 'search-group-label';
      gl.textContent = label + ' (' + items.length + ')';
      sResults.appendChild(gl);
      items.forEach(function (item) {
        var a = document.createElement('a');
        a.className = 'search-item';
        a.href = item.url;
        a.innerHTML =
          '<span class="search-item-icon">' + item.icon + '</span>' +
          '<span class="search-item-body">' +
          '<div class="search-item-title">' + highlight(escHtml(item.title), q) + '</div>' +
          '<div class="search-item-subtitle">' + escHtml(item.sub) + '</div>' +
          '</span>' +
          '<span class="search-item-type search-type-' + item.type + '">' +
          (item.type === 'page' ? 'Page' : 'Section') +
          '</span>';
        a.addEventListener('click', closeSearch);
        sResults.appendChild(a);
      });
    }
    renderGroup('Pages', res.filter(function (r) { return r.type === 'page'; }));
    renderGroup('Sections', res.filter(function (r) { return r.type === 'section'; }));
  }

  function moveSel(dir) {
    var items = sResults.querySelectorAll('.search-item');
    if (!items.length) return;
    items[selIdx] && items[selIdx].classList.remove('selected');
    selIdx = Math.max(0, Math.min(items.length - 1, selIdx + dir));
    items[selIdx].classList.add('selected');
    items[selIdx].scrollIntoView({ block: 'nearest' });
  }

  /* Events */
  var trigEl = document.getElementById('search-trigger');
  if (trigEl) trigEl.addEventListener('click', function () { openSearch(); });

  var heroBtn = document.getElementById('hero-search-btn');
  if (heroBtn) heroBtn.addEventListener('click', function () { openSearch(); });

  sHint.addEventListener('click', function (e) {
    var chip = e.target.closest('.search-hint-chip');
    if (!chip) return;
    var q = chip.getAttribute('data-query');
    sInput.value = q;
    sClear.classList.add('visible');
    runSearch(q);
    sInput.focus();
  });

  sInput.addEventListener('input', function () {
    sClear.classList.toggle('visible', sInput.value.length > 0);
    runSearch(sInput.value);
  });

  sClear.addEventListener('click', function () {
    sInput.value = '';
    sClear.classList.remove('visible');
    showHints();
    sInput.focus();
  });

  sInput.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); moveSel(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); moveSel(-1); }
    else if (e.key === 'Enter') {
      var items = sResults.querySelectorAll('.search-item');
      var t = selIdx >= 0 ? items[selIdx] : items[0];
      if (t) { closeSearch(); window.location.href = t.getAttribute('href'); }
    }
    else if (e.key === 'Escape') closeSearch();
  });

  searchModal.addEventListener('click', function (e) {
    if (!document.getElementById('search-modal').contains(e.target)) closeSearch();
  });

  document.addEventListener('keydown', function (e) {
    var active = document.activeElement;
    var inInput = active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable;
    if (searchModal.classList.contains('open')) return;
    if ((e.key === '/' && !inInput) || ((e.metaKey || e.ctrlKey) && e.key === 'k')) {
      e.preventDefault();
      openSearch();
    }
  });

  showHints();

})();
