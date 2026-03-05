/* ═══════════════════════════════════════════════════════════════════
   ZEOTAP CDP — ENHANCED TOOLTIP SYSTEM
   Rich Information Display for Graph Nodes
   ═══════════════════════════════════════════════════════════════════ */
(function(global) {
  'use strict';

  const TooltipSystem = {
    init() {
      // Tooltip is already created by index.html
      // We enhance its styling and behavior
      const tooltip = document.getElementById('graph-tooltip');
      if (!tooltip) {
        console.warn('[TooltipSystem] graph-tooltip element not found');
        return;
      }

      // Improve tooltip visibility
      tooltip.classList.add('tooltip-enhanced');
      
      // Add escape key to close tooltip
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          tooltip.classList.remove('visible');
        }
      });
    },

    show(title, category, description, tech, position) {
      const tooltip = document.getElementById('graph-tooltip');
      if (!tooltip) return;

      // Update content
      tooltip.querySelector('.ds-tt-title').textContent = title;
      tooltip.querySelector('.ds-tt-cat').textContent = category;
      tooltip.querySelector('.ds-tt-cat').style.background = `${this.getCategoryColor(category)}22`;
      tooltip.querySelector('.ds-tt-cat').style.color = this.getCategoryColor(category);
      tooltip.querySelector('.ds-tt-desc').textContent = description;
      tooltip.querySelector('.ds-tt-tech').textContent = tech.join(' · ');

      // Position tooltip
      if (position) {
        tooltip.style.left = position.x + 'px';
        tooltip.style.top = position.y + 'px';
      }

      // Show with animation
      tooltip.classList.add('visible');
    },

    hide() {
      const tooltip = document.getElementById('graph-tooltip');
      if (!tooltip) return;
      tooltip.classList.remove('visible');
    },

    getCategoryColor(category) {
      const colors = {
        'Ingestion': '#06b6d4',
        'Core': '#3b82f6',
        'Storage': '#8b5cf6',
        'Activation': '#f59e0b',
        'Intelligence': '#10b981',
        'Analytics': '#ec4899',
        'Compliance': '#f97316',
        'Security': '#ef4444',
        'Platform': '#64748b',
      };
      return colors[category] || '#94a3b8';
    },

    // Advanced tooltip with dependency info
    showAdvanced(nodeData, dependencies) {
      const tooltip = document.getElementById('graph-tooltip');
      if (!tooltip) return;

      let html = `
        <div class="tooltip-header">
          <div>
            <div class="tooltip-title">${nodeData.label}</div>
            <div class="tooltip-category" style="background:${this.getCategoryColor(nodeData.category)}22;color:${this.getCategoryColor(nodeData.category)}">${nodeData.category}</div>
          </div>
        </div>
        <div class="tooltip-desc">${nodeData.desc}</div>
        <div class="tooltip-tech">
      `;

      if (nodeData.tech && nodeData.tech.length > 0) {
        nodeData.tech.forEach(t => {
          html += `<span class="tooltip-tech-tag">${t}</span>`;
        });
      }

      html += '</div>';

      if (dependencies && (dependencies.upstream.length > 0 || dependencies.downstream.length > 0)) {
        html += `
          <div class="tooltip-meta">
            <div>
              <strong>Dependencies</strong> ${dependencies.upstream.length + dependencies.downstream.length}
            </div>
          </div>
        `;
      }

      tooltip.innerHTML = html;
      tooltip.classList.add('visible');
    },
  };

  global.TooltipSystem = TooltipSystem;

  // Auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      TooltipSystem.init();
    });
  } else {
    TooltipSystem.init();
  }

})(window);
