/* ═══════════════════════════════════════════════════════════════════
   ZEOTAP CDP — MISSION MODE LEARNING SYSTEM
   Interactive Platform Learning Through Guided Missions
   ═══════════════════════════════════════════════════════════════════ */
(function(global) {
  'use strict';

  const MISSIONS = {
    trace_event: {
      id: 'trace_event', title: 'Trace a User Event', icon: '🔍',
      steps: [
        { title: 'Start: Data Collection', description: 'Every user interaction begins here. When a customer opens your app or website, analytics SDKs fire events.', highlights: ['collect'], instruction: 'See the cyan node at top? That\'s where events are collected.' },
        { title: 'Transform: Data Ingestion', description: 'Raw events flow into data ingestion pipelines. Apache Beam, Spark, and CDAP processes terabytes of data in real-time.', highlights: ['ingest'], instruction: 'Events are normalized and enriched here.' },
        { title: 'Resolve: Identity Graph', description: 'Multiple IDs (cookies, device IDs, emails) are unified into a single customer ID (UCID).', highlights: ['identity'], instruction: 'Identity resolution connects all touchpoints.' },
        { title: 'Store: Profile Store', description: 'Customer profiles are stored in Delta Lake with full ACID support. Unified data sits here.', highlights: ['profiles'], instruction: 'This is your single source of truth for customer data.' },
        { title: 'Activate: Real-time Action', description: 'Segments evaluate in real-time, triggers journeys, and activate customers across 100+ channels.', highlights: ['audiences','journeys','activation'], instruction: 'The event completes its journey to action.' }
      ]
    },
    identity_resolution: {
      id: 'identity_resolution', title: 'Understand Identity Resolution', icon: '🔗',
      steps: [
        { title: 'The Challenge', description: 'Same customer, different devices, multiple IDs. Your CDP must unify them.', highlights: ['collect','identity'], instruction: 'Watch how fragmented IDs become one customer.' },
        { title: 'Cookie-based Tracking', description: 'Web analytics drop first-party cookies. SmartPixel tracks cross-domain behavior.', highlights: ['collect'], instruction: 'Step 1: Collect all available identifiers.' },
        { title: 'Deterministic Matching', description: 'CRM email, phone, and explicit user logins create rock-solid matches.', highlights: ['identity'], instruction: 'Known IDs are the most reliable. 99.8% accuracy.' },
        { title: 'Probabilistic Matching', description: 'ML models predict device ownership based on behavior (IP, location, device type).', highlights: ['ml','identity'], instruction: '88% accuracy. Fast. Scales to billions.' },
        { title: 'Graph Database', description: 'BigTable stores the complete identity graph. Real-time lookups in <5ms.', highlights: ['identity','profiles'], instruction: 'One UCID. One customer. 360-degree view.' }
      ]
    },
    build_segment: {
      id: 'build_segment', title: 'Build a High-Value Segment', icon: '🎯',
      steps: [
        { title: 'Step 1: Explore Profile Attributes', description: 'Open the Attribute Explorer in Unity Dashboard. Every trait on a customer profile is sourced from Delta Lake and fully queryable via BigQuery.', highlights: ['profiles','unity'], instruction: 'The Profile Store node is the source of truth.' },
        { title: 'Step 2: Define a Boolean Rule', description: 'Add the first condition: lifetime_value > 400 AND purchase_count >= 5. The rule builder compiles this to BigQuery SQL. The Rust segment engine evaluates it in <100ms.', highlights: ['profiles','audiences'], instruction: 'The Audiences node runs the Rust engine at billion-profile scale.' },
        { title: 'Step 3: Combine with OR Logic', description: 'Add a second branch: top_category = "electronics". The builder serializes this to a DAG. Nested AND/OR up to 10 levels deep, 18,000+ active segments simultaneously.', highlights: ['audiences'], instruction: 'Complex Boolean logic is native to the Rust engine.' },
        { title: 'Step 4: Preview Audience Size', description: 'Click Preview — the engine runs a BigQuery batch scan and returns an estimated count within 30 seconds. For LTV + electronics: ~47K profiles.', highlights: ['audiences','reporting'], instruction: 'The Reporting node powers this preview query.' },
        { title: 'Step 5: Save — Go Streaming', description: 'Saving registers the segment in the segment registry. Every profile write triggers incremental evaluation via Pub/Sub. Membership updates in <200ms.', highlights: ['audiences','journeys','activation'], instruction: 'Watch Audiences connect to Journeys and Activation.' }
      ]
    },
    trigger_journey: {
      id: 'trigger_journey', title: 'Trigger a Customer Journey', icon: '🚀',
      steps: [
        { title: 'Step 1: Define the Entry Event', description: 'In Journey Builder, set the trigger: Customer enters seg_high_value_eu. The journey-executor (Java + Kafka) consumes segment changelog events from Pub/Sub. First match fires in <50ms.', highlights: ['audiences','journeys'], instruction: 'The Audiences → Journeys edge is this trigger path.' },
        { title: 'Step 2: Configure the Step Sequence', description: 'Add: Step 1 — personalised email via Braze. Step 2 — Wait node (3 days). Step 3 — Conditional branch: if email_opened then SMS, else push. Full sequence serializes to a DAG in Redis.', highlights: ['journeys'], instruction: 'Journey state lives in Redis keyed by ucid + journey_id.' },
        { title: 'Step 3: Set Wait Conditions', description: 'Wait nodes accept ISO 8601 durations (PT72H for 3 days) or calendar windows (NEXT_MONDAY_9AM in customer timezone). Airflow polls Redis every 30 seconds.', highlights: ['journeys'], instruction: 'Redis stores the wait_until timestamp per customer.' },
        { title: 'Step 4: Assign Channels + Enforce Consent', description: 'Map email → Braze, SMS → Twilio, Push → Firebase FCM. At every dispatch, the Privacy Engine retrieves consent status. Revoked consent silently skips that step.', highlights: ['journeys','activation','privacy'], instruction: 'The Privacy node intercepts every dispatch at activation time.' },
        { title: 'Step 5: Activate the Journey', description: 'Click Activate. The journey moves from DRAFT to LIVE. connector-hub listens on activation-tasks Kafka topic. First qualifying customer starts in <50ms.', highlights: ['journeys','activation'], instruction: 'Watch the Journeys → Activation edge light up.' }
      ]
    },
    activate_audience: {
      id: 'activate_audience', title: 'Activate an Audience', icon: '📤',
      steps: [
        { title: 'Step 1: Select Your Segment', description: 'In Destinations UI, choose seg_high_value_eu (~47K profiles). This segment is streaming-live — new profiles sync within 2 seconds via Pub/Sub segment changelog.', highlights: ['audiences'], instruction: 'The Audiences node holds the live membership list.' },
        { title: 'Step 2: Choose a Destination', description: 'Select Meta CAPI from 100+ connectors. connector-hub (Scala) manages Meta Conversions API v16 protocol, OAuth 2.0 token refresh, and rate-limit management (2,000 events/s per pixel ID).', highlights: ['activation'], instruction: 'The Activation node is connector-hub with protocol-specific retry logic.' },
        { title: 'Step 3: Configure Field Mapping', description: 'Map: ucid → em (SHA-256 hashed email). mobile_ad_id → madid. Enrichment from profile: geo.country, top_category. Mapping applies at export time using live profile values.', highlights: ['activation','profiles'], instruction: 'Field mapping pulls from the live Profile Store at export time.' },
        { title: 'Step 4: Set Sync Frequency', description: 'Choose Real-time streaming — profiles enter/exit segment, connector-hub pushes incremental updates to Meta CAPI within 2 seconds. Or Daily batch to GCS at 02:00 UTC.', highlights: ['activation','audiences'], instruction: 'Real-time uses Pub/Sub changelog. Batch uses Cloud Scheduler → Dataflow.' },
        { title: 'Step 5: Push and Monitor', description: 'Click Save and Push. connector-hub dispatches the initial ~47K batch using 3 parallel workers. Every delivery receipt logs a Cloud Trace span. Observability dashboard shows match rates in real time.', highlights: ['activation','observe'], instruction: 'Watch the Observability node — every delivery receipt is a trace span.' }
      ]
    }
  };

  let currentMission = null;
  let currentStep = 0;

  function hasKG() { return !!global.KG; }

  function renderMissionPanel() {
    const mission = MISSIONS[currentMission];
    if (!mission) return;

    let container = document.getElementById('kg-mission-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'kg-mission-container';
      container.className = 'mission-mode-container';
      document.body.appendChild(container);
    }

    const step = mission.steps[currentStep];
    const totalSteps = mission.steps.length;

    let html = `<div class="mission-header"><span class="mission-icon">${mission.icon}</span><h3 class="mission-title">${mission.title}</h3></div><div class="mission-progress">`;
    for (let i = 0; i < totalSteps; i++) {
      let sc = 'mission-step';
      if (i < currentStep) sc += ' completed';
      if (i === currentStep) sc += ' active';
      html += `<div class="${sc}"></div>`;
    }
    html += `</div><div class="mission-content"><h4 class="mission-step-title">Step ${currentStep + 1} of ${totalSteps}: ${step.title}</h4><p class="mission-step-desc">${step.description}</p><div class="mission-highlight"><strong>💡 Insight:</strong> ${step.instruction}</div></div><div class="mission-actions">`;
    if (currentStep > 0) html += `<button class="mission-btn secondary" onclick="MissionMode.prevStep()">← Back</button>`;
    if (currentStep < totalSteps - 1) html += `<button class="mission-btn primary" onclick="MissionMode.nextStep()">Next →</button>`;
    else html += `<button class="mission-btn primary" onclick="MissionMode.completeMission()">Complete ✓</button>`;
    html += '</div>';

    container.innerHTML = html;

    var closeBtn = document.createElement('button');
    closeBtn.className = 'mission-close-btn';
    closeBtn.innerHTML = '✕';
    closeBtn.title = 'Exit mission';
    closeBtn.addEventListener('click', function () { global.MissionMode.exitMission(); });
    container.appendChild(closeBtn);

    if (hasKG()) global.KG.highlight(step.highlights);
  }

  global.MissionMode = {
    startMission(missionId) {
      if (!MISSIONS[missionId]) { console.error('Mission not found:', missionId); return; }
      currentMission = missionId;
      currentStep = 0;
      renderMissionPanel();
      var graphEl = document.getElementById('knowledge-graph');
      if (graphEl) graphEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    },
    nextStep() {
      const mission = MISSIONS[currentMission];
      if (currentStep < mission.steps.length - 1) { currentStep++; renderMissionPanel(); }
    },
    prevStep() {
      if (currentStep > 0) { currentStep--; renderMissionPanel(); }
    },
    completeMission() {
      const container = document.getElementById('kg-mission-container');
      if (container) container.remove();
      if (hasKG()) global.KG.reset();
      currentMission = null; currentStep = 0;
    },
    exitMission() { this.completeMission(); }
  };

})(window);
