/* ═══════════════════════════════════════════════════════════════════
   ZEOTAP CDP — PERFORMANCE OPTIMIZATION
   Ensures smooth operation with 50+ nodes and 100+ edges
   ═══════════════════════════════════════════════════════════════════ */
(function(global) {
  'use strict';

  const PerformanceOptimizer = {
    metrics: {
      graphRenderTime: 0,
      nodeCount: 0,
      linkedCount: 0,
      fps: 60,
    },

    init() {
      this.detectPerformanceCapabilities();
      this.optimizeAnimationFramerate();
      this.setupPerformanceObserver();
    },

    detectPerformanceCapabilities() {
      // Detect device capabilities
      const memory = navigator.deviceMemory || 4;
      const connection = navigator.connection?.effectiveType || '4g';
      const hardwareConcurrency = navigator.hardwareConcurrency || 4;

      this.metrics.memory = memory;
      this.metrics.connection = connection;
      this.metrics.cpuCores = hardwareConcurrency;

      // Adjust animation quality based on device
      if (memory < 2 || connection === 'slow-2g' || connection === '2g') {
        this.setQualityLevel('low');
      } else if (memory < 4 || connection === '3g') {
        this.setQualityLevel('medium');
      } else {
        this.setQualityLevel('high');
      }

      console.log('[PerformanceOptimizer] Device: Memory=' + memory + 'GB, Connection=' + connection + ', CPU=' + hardwareConcurrency);
    },

    setQualityLevel(level) {
      const root = document.documentElement;
      root.setAttribute('data-quality', level);

      const settings = {
        low: {
          animationDuration: 400,
          blurEffect: 8,
          particleCount: 0,
          updateRate: 30,
        },
        medium: {
          animationDuration: 300,
          blurEffect: 12,
          particleCount: 5,
          updateRate: 60,
        },
        high: {
          animationDuration: 200,
          blurEffect: 16,
          particleCount: 10,
          updateRate: 60,
        },
      };

      const setting = settings[level];
      root.style.setProperty('--animation-duration', setting.animationDuration + 'ms');
      root.style.setProperty('--blur-effect', setting.blurEffect + 'px');
      root.setAttribute('data-quality', level);
    },

    optimizeAnimationFramerate() {
      // Use requestAnimationFrame for smooth animations
      let lastTime = Date.now();
      let frameCount = 0;

      const measureFramerate = () => {
        frameCount++;
        const now = Date.now();
        
        if (now - lastTime >= 1000) {
          this.metrics.fps = frameCount;
          frameCount = 0;
          lastTime = now;
        }

        requestAnimationFrame(measureFramerate);
      };

      requestAnimationFrame(measureFramerate);
    },

    setupPerformanceObserver() {
      // Monitor long tasks
      if ('PerformanceObserver' in window) {
        try {
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (entry.duration > 50) {
                console.warn('[PerformanceOptimizer] Long task detected:', entry.duration.toFixed(2) + 'ms');
              }
            }
          });

          observer.observe({ entryTypes: ['longtask'] });
        } catch (e) {
          // Long task API not supported
        }
      }

      // Monitor Large Contentful Paint
      if ('PerformanceObserver' in window) {
        try {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('[PerformanceOptimizer] LCP:', lastEntry.renderTime || lastEntry.loadTime);
          });

          observer.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
          // LCP API not supported
        }
      }
    },

    // Debounce heavy operations
    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },

    // Throttle scroll/resize events
    throttle(func, limit) {
      let inThrottle;
      return function(...args) {
        if (!inThrottle) {
          func.apply(this, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    },

    // Lazy load content
    setupLazyLoading() {
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const el = entry.target;
              if (el.dataset.src) {
                el.src = el.dataset.src;
                el.removeAttribute('data-src');
              }
              observer.unobserve(el);
            }
          });
        });

        document.querySelectorAll('[data-src]').forEach(el => {
          observer.observe(el);
        });
      }
    },

    // Monitor graph render performance
    measureGraphRenderTime(callback) {
      const start = performance.now();
      callback();
      const end = performance.now();
      
      this.metrics.graphRenderTime = end - start;
      console.log('[PerformanceOptimizer] Graph render time: ' + this.metrics.graphRenderTime.toFixed(2) + 'ms');

      return this.metrics.graphRenderTime;
    },

    // Report metrics
    getMetrics() {
      return {
        ...this.metrics,
        timestamp: new Date().toISOString(),
      };
    },

    // CSS-based animation optimization
    setupAnimationOptimization() {
      const style = document.createElement('style');
      style.textContent = `
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* Enable hardware acceleration */
        .kg-node,
        .kg-link,
        .ds-mod-card:hover,
        .animation-accelerate {
          will-change: transform;
          transform: translateZ(0);
          backface-visibility: hidden;
          perspective: 1000px;
        }

        /* Optimize filter animations */
        .animated-edge {
          will-change: stroke-dashoffset;
        }

        /* Optimize tooltip */
        #graph-tooltip {
          will-change: opacity, transform;
        }
      `;
      document.head.appendChild(style);
    },
  };

  // Initialize optimizer
  PerformanceOptimizer.init();
  PerformanceOptimizer.setupAnimationOptimization();

  global.PerformanceOptimizer = PerformanceOptimizer;

})(window);
