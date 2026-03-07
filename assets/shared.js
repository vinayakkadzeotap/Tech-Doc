/* ═══════════════════════════════════════════════════════════════════
   ZEOTAP CDP Docs — Shared Enhancement Module
   Adds reading-time badge + feedback widget to chapter pages.
   All other features (scroll-spy, copy buttons, progress bar,
   mobile nav, search) are already handled by scripts.js.

   Usage:
     <script src="assets/shared.js"></script>
     <script>
       Shared.init({
         readingTime: true,
         feedback: true,
         feedbackKey: '02-data-collection'
       });
     </script>
   ═══════════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';

  var Shared = {};

  /* ── Reading time badge ──────────────────────────────────────────── */
  /**
   * Counts words in the main content area and injects "≈ N min read"
   * into the topbar's .topbar-actions (or .topbar-right) container.
   */
  Shared.initReadingTime = function () {
    /* Find the main text container — try multiple selectors */
    var content = document.querySelector('main.content, div.content, main, article');
    if (!content) return;

    /* Word count → reading time (avg 200 WPM) */
    var text = content.innerText || content.textContent || '';
    var words = text.trim().split(/\s+/).filter(Boolean).length;
    var mins = Math.max(1, Math.round(words / 200));

    /* Build badge */
    var badge = document.createElement('span');
    badge.className = 'reading-time-badge';
    badge.title = words.toLocaleString() + ' words';
    badge.textContent = '\u2248\u00a0' + mins + '\u00a0min\u00a0read';

    /* Inject into topbar actions */
    var actions = document.querySelector('.topbar-actions, .topbar-right, .ds-topbar-right');
    if (actions) {
      actions.appendChild(badge);
    }
  };

  /* ── Feedback widget ─────────────────────────────────────────────── */
  /**
   * Injects a "Was this page helpful? 👍 👎" bar before the chapter
   * footer nav (or at the end of main content). State persisted in
   * localStorage so a repeated visit shows "Thanks for your feedback!".
   *
   * @param {string} [pageKey]  Unique key for localStorage; defaults to
   *                            the pathname without trailing slash.
   */
  Shared.initFeedback = function (pageKey) {
    var key = 'feedback_' + (pageKey || location.pathname.replace(/\/$/, ''));
    var existing = localStorage.getItem(key);

    /* Build the bar element */
    var bar = document.createElement('div');
    bar.className = 'feedback-bar';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'Page feedback');

    if (existing) {
      /* Already voted — show thank-you */
      var thanks = document.createElement('span');
      thanks.className = 'feedback-bar-label feedback-thanks';
      thanks.textContent = 'Thanks for your feedback! ' + (existing === 'yes' ? '👍' : '👎');
      bar.appendChild(thanks);
    } else {
      /* Not yet voted — show prompt + buttons */
      var label = document.createElement('span');
      label.className = 'feedback-bar-label';
      label.textContent = 'Was this page helpful?';

      var yesBtn = document.createElement('button');
      yesBtn.className = 'feedback-btn';
      yesBtn.type = 'button';
      yesBtn.innerHTML = '&#128077; Yes, helpful';

      var noBtn = document.createElement('button');
      noBtn.className = 'feedback-btn';
      noBtn.type = 'button';
      noBtn.innerHTML = '&#128078; Needs work';

      bar.appendChild(label);
      bar.appendChild(yesBtn);
      bar.appendChild(noBtn);

      function recordVote(v) {
        try { localStorage.setItem(key, v); } catch (e) { /* storage full */ }
        /* Replace bar content with thank-you */
        bar.innerHTML = '';
        var t = document.createElement('span');
        t.className = 'feedback-bar-label feedback-thanks';
        t.textContent = 'Thanks for your feedback! ' + (v === 'yes' ? '👍' : '👎');
        bar.appendChild(t);
      }

      yesBtn.addEventListener('click', function () { recordVote('yes'); });
      noBtn.addEventListener('click', function () { recordVote('no'); });
    }

    /* Insert before .chapter-nav if present, otherwise at end of main content */
    var chapterNav = document.querySelector('.chapter-nav');
    var mainContent = document.querySelector('main.content, div.content, main, article');

    if (chapterNav) {
      chapterNav.parentNode.insertBefore(bar, chapterNav);
    } else if (mainContent) {
      mainContent.appendChild(bar);
    }
  };

  /* ── init dispatcher ─────────────────────────────────────────────── */
  /**
   * @param {Object} cfg
   * @param {boolean} [cfg.readingTime=true]
   * @param {boolean} [cfg.feedback=true]
   * @param {string}  [cfg.feedbackKey]   Unique key per page for localStorage
   */
  Shared.init = function (cfg) {
    cfg = cfg || {};

    /* Run after DOM is ready */
    function run() {
      if (cfg.readingTime !== false) {
        Shared.initReadingTime();
      }
      if (cfg.feedback !== false) {
        Shared.initFeedback(cfg.feedbackKey || null);
      }
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', run);
    } else {
      run();
    }
  };

  /* ── Expose globally ─────────────────────────────────────────────── */
  global.Shared = Shared;

})(window);
