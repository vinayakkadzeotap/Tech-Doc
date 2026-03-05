/* ═══════════════════════════════════════════════════════════════════
   ZEOTAP CDP — MISSION MODE LEARNING SYSTEM
   Interactive Platform Learning Through Guided Missions
   ═══════════════════════════════════════════════════════════════════ */
(function(global) {
  'use strict';

  const MISSIONS = {
    trace_event: {
      id: 'trace_event',
      title: 'Trace a User Event',
      icon: '🔍',
      steps: [
        {
          title: 'Start: Data Collection',
          description: 'Every user interaction begins here. When a customer opens your app or website, analytics SDKs fire events.',
          highlights: ['collect'],
          instruction: 'See the cyan node at top? That\'s where events are collected.',
        },
        {
          title: 'Transform: Data Ingestion',
          description: 'Raw events flow into data ingestion pipelines. Apache Beam, Spark, and CDAP processes terabytes of data in real-time.',
          highlights: ['ingest'],
          instruction: 'Events are normalized and enriched here.',
        },
        {
          title: 'Resolve: Identity Graph',
          description: 'Multiple IDs (cookies, device IDs, emails) are unified into a single customer ID (UCID).',
          highlights: ['identity'],
          instruction: 'Identity resolution connects all touchpoints.',
        },
        {
          title: 'Store: Profile Store',
          description: 'Customer profiles are stored in Delta Lake with full ACID support. Unified data sits here.',
          highlights: ['profiles'],
          instruction: 'This is your single source of truth for customer data.',
        },
        {
          title: 'Activate: Real-time Action',
          description: 'Segments evaluate in real-time, triggeys journeys, and activate customers across 100+ channels.',
          highlights: ['audiences', 'journeys', 'activation'],
          instruction: 'The event completes its journey to action.',
        },
      ],
    },
    identity_resolution: {
      id: 'identity_resolution',
      title: 'Understand Identity Resolution',
      icon: '🔗',
      steps: [
        {
          title: 'The Challenge',
          description: 'Same customer, different devices, multiple IDs. Your CDP must unify them.',
          highlights: ['collect', 'identity'],
          instruction: 'Watch how fragmented IDs become one customer.',
        },
        {
          title: 'Cookie-based Tracking',
          description: 'Web analytics drop first-party cookies. SmartPixel tracks cross-domain behavior.',
          highlights: ['collect'],
          instruction: 'Step 1: Collect all available identifiers.',
        },
        {
          title: 'Deterministic Matching',
          description: 'CRM email, phone, and explicit user logins create rock-solid matches.',
          highlights: ['identity'],
          instruction: 'Known IDs are the most reliable. 99.8% accuracy.',
        },
        {
          title: 'Probabilistic Matching',
          description: 'ML models predict device ownership based on behavior (IP, location, device type).',
          highlights: ['ml', 'identity'],
          instruction: '88% accuracy. Fast. Scales to billions.',
        },
        {
          title: 'Graph Database',
          description: 'BigTable stores the complete identity graph. Real-time lookups in <5ms.',
          highlights: ['identity', 'profiles'],
          instruction: 'One UCID. One customer. 360-degree view.',
        },
      ],
    },
    build_segment: {
      id: 'build_segment',
      title: 'Build a Segment',
      icon: '🎯',
      steps: [
        {
          title: 'Create SQL Rule',
          description: 'Use BigQuery to write rules: "customers who spent >$1000 in 30 days".',
          highlights: ['profiles', 'audiences'],
          instruction: 'All customer data is queryable in BigQuery.',
        },
        {
          title: 'Real-time Evaluation',
          description: 'Pub/Sub streams profile updates. Segment engine evaluates <100ms latency.',
          highlights: ['audiences'],
          instruction: 'Segments update in real-time as new data arrives.',
        },
        {
          title: 'Scale to 18K+ Segments',
          description: 'Presto and Druid handle 18,000 active segments across billions of profiles.',
          highlights: ['audiences', 'reporting'],
          instruction: 'Performance stays fast even at massive scale.',
        },
        {
          title: 'Activation Trigger',
          description: 'Segments feed into journeys. When customers enter a segment, journeys fire.',
          highlights: ['audiences', 'journeys'],
          instruction: 'Segments are the fuel for journey orchestration.',
        },
        {
          title: 'Analytics Dashboard',
          description: 'See real-time segment size, composition, and trend in Unity Dashboard.',
          highlights: ['reporting', 'unity'],
          instruction: 'Full transparency on your audience data.',
        },
      ],
    },
    trigger_journey: {
      id: 'trigger_journey',
      title: 'Trigger a Customer Journey',
      icon: '🚀',
      steps: [
        {
          title: 'Journey Trigger',
          description: 'Event-driven: "Customer enters high-value segment" or time-based: "1 week after signup".',
          highlights: ['journeys'],
          instruction: 'Journeys start from segment entry or explicit events.',
        },
        {
          title: 'Multi-step Orchestration',
          description: 'Send email → wait 3 days → A/B test SMS → 5% frequency cap → conditional branching.',
          highlights: ['journeys'],
          instruction: 'Complex logic with no-code builder.',
        },
        {
          title: 'State Persistence',
          description: 'Redis stores journey state. Customers resume exactly where they left off.',
          highlights: ['journeys'],
          instruction: 'Resilient. No lost progress.',
        },
        {
          title: 'Consent Enforcement',
          description: 'Privacy engine checks consent before every step. GDPR-compliant by design.',
          highlights: ['journeys', 'privacy'],
          instruction: 'Consent is checked at dispatch.',
        },
        {
          title: 'Data Activation',
          description: 'Journey triggers data to 100+ destinations: email, SMS, push, DSPs, webhooks.',
          highlights: ['activation'],
          instruction: 'Your message reaches customers wherever they are.',
        },
      ],
    },
    activate_audience: {
      id: 'activate_audience',
      title: 'Activate an Audience',
      icon: '📤',
      steps: [
        {
          title: 'Audience Ready',
          description: 'You have a segment. 500K high-value customers. Now activate them.',
          highlights: ['audiences'],
          instruction: 'Start with a well-defined audience.',
        },
        {
          title: 'Choose Destination',
          description: 'Google Ads, Meta, Klaviyo, Salesforce, Segment — 100+ integrations.',
          highlights: ['activation'],
          instruction: 'Pick where your audience goes.',
        },
        {
          title: 'Map Fields',
          description: 'Customer ID → Hashed Email. Profile attributes → Audience tags.',
          highlights: ['activation'],
          instruction: 'Field mapping is flexible. Supports any schema.',
        },
        {
          title: 'Real-time Sync',
          description: 'As customers enter/exit segments, destinations are updated instantly.',
          highlights: ['audiences', 'activation'],
          instruction: 'Streaming mode keeps data in sync.',
        },
        {
          title: 'Batch Export',
          description: 'Or export daily snapshots to SFTP, S3, Google Drive for analytics teams.',
          highlights: ['activation'],
          instruction: 'Flexible delivery: real-time streaming OR batch.',
        },
      ],
    },
  };

  let currentMission = null;
  let currentStep = 0;

  function renderMissionPanel() {
    const mission = MISSIONS[currentMission];
    if (!mission) return;

    const container = document.getElementById('kg-mission-container');
    if (!container) {
      const div = document.createElement('div');
      div.id = 'kg-mission-container';
      div.className = 'mission-mode-container';
      document.body.appendChild(div);
    }

    const panel = document.getElementById('kg-mission-container');
    const step = mission.steps[currentStep];
    const totalSteps = mission.steps.length;

    let html = `
      <div class="mission-header">
        <span class="mission-icon">${mission.icon}</span>
        <h3 class="mission-title">${mission.title}</h3>
      </div>
      
      <div class="mission-progress">
    `;

    for (let i = 0; i < totalSteps; i++) {
      let stepClass = 'mission-step';
      if (i < currentStep) stepClass += ' completed';
      if (i === currentStep) stepClass += ' active';
      html += `<div class="${stepClass}"></div>`;
    }

    html += `
      </div>
      
      <div class="mission-content">
        <h4 class="mission-step-title">Step ${currentStep + 1} of ${totalSteps}: ${step.title}</h4>
        <p class="mission-step-desc">${step.description}</p>
        <div class="mission-highlight">
          <strong>💡 Insight:</strong> ${step.instruction}
        </div>
      </div>
      
      <div class="mission-actions">
        ${currentStep > 0 ? `<button class="mission-btn secondary" onclick="MissionMode.prevStep()">← Back</button>` : ''}
        ${currentStep < totalSteps - 1 ? `<button class="mission-btn primary" onclick="MissionMode.nextStep()">Next →</button>` : `<button class="mission-btn primary" onclick="MissionMode.completeMission()">Complete ✓</button>`}
      </div>
    `;

    panel.innerHTML = html;

    // Highlight nodes
    KG.highlight(step.highlights);
  }

  global.MissionMode = {
    startMission(missionId) {
      if (!MISSIONS[missionId]) {
        console.error('Mission not found:', missionId);
        return;
      }
      currentMission = missionId;
      currentStep = 0;
      renderMissionPanel();
    },

    nextStep() {
      const mission = MISSIONS[currentMission];
      if (currentStep < mission.steps.length - 1) {
        currentStep++;
        renderMissionPanel();
      }
    },

    prevStep() {
      if (currentStep > 0) {
        currentStep--;
        renderMissionPanel();
      }
    },

    completeMission() {
      const container = document.getElementById('kg-mission-container');
      if (container) container.remove();
      KG.reset();
      currentMission = null;
      currentStep = 0;
    },

    exitMission() {
      this.completeMission();
    },
  };

})(window);
