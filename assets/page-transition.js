/* ═══════════════════════════════════════════════════════════════════
   ZEOTAP CDP — PAGE TRANSITION SYSTEM
   Smooth Fade & Slide Transitions Between Pages
   ═══════════════════════════════════════════════════════════════════ */
(function(global) {
  'use strict';

  const PageTransition = {
    init() {
      // Add visible class to page on load for fade-in
      document.addEventListener('DOMContentLoaded', () => {
        document.body.classList.add('page-enter');
      });

      // Intercept navigation links (except external)
      document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');
        
        // Skip external links, anchors, and special protocols
        if (!href || 
            href.startsWith('http') || 
            href.startsWith('#') || 
            href.startsWith('mailto') ||
            href.startsWith('tel') ||
            link.target === '_blank') {
          return;
        }

        // Prevent default and animate transition
        e.preventDefault();
        this.transitionTo(href);
      });
    },

    transitionTo(url) {
      // Add exit animation
      document.body.classList.remove('page-enter');
      document.body.classList.add('page-exit');

      // Wait for animation, then navigate
      setTimeout(() => {
        window.location.href = url;
      }, 200);
    },

    // Public API for programmatic navigation
    navigateTo(url) {
      this.transitionTo(url);
    },
  };

  global.PageTransition = PageTransition;

  // Auto-initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      PageTransition.init();
    });
  } else {
    PageTransition.init();
  }

})(window);
