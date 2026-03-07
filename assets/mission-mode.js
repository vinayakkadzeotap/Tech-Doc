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
      title: 'Build a High-Value Segment',
      icon: '🎯',
      steps: [
        {
          title: 'Step 1: Explore Profile Attributes',
          description: 'Open the Attribute Explorer in Unity Dashboard. Every trait on a customer profile — lifetime_value, purchase_count, last_seen_ts, predicted_churn_score — is sourced from Delta Lake on GCS and fully queryable via BigQuery.',
          highlights: ['profiles', 'unity'],
          instruction: 'The "Profile Store" node is the source of truth. All segment rules pull attributes from here in real time.',
        },
        {
          title: 'Step 2: Define a Boolean Rule',
          description: 'Add the first condition: lifetime_value > 400 AND purchase_count >= 5. The visual rule builder compiles this to a BigQuery SQL expression. The Rust segment engine then evaluates it against every incoming profile-change event.',
          highlights: ['profiles', 'audiences'],
          instruction: 'The "Audiences" node runs the Rust engine. It evaluates this condition at < 100ms per profile update — even across 18,000+ active segments simultaneously.',
        },
        {
          title: 'Step 3: Combine with OR Logic',
          description: 'Add a second branch with OR: top_category = "electronics". The builder serializes this to a DAG of conditions. Nested AND/OR groups are supported up to 10 levels deep. All 18,000+ active segments run concurrently with no query contention.',
          highlights: ['audiences'],
          instruction: 'Complex Boolean logic is native to the Rust engine. Even deeply nested trees evaluate in under 100ms at billion-profile scale.',
        },
        {
          title: 'Step 4: Preview Audience Size',
          description: 'Click "Preview" — the engine runs a BigQuery batch scan and returns an estimated count within 30 seconds. For the LTV + electronics rule, expect ~47K qualifying profiles. This is a non-binding estimate from a point-in-time snapshot.',
          highlights: ['audiences', 'reporting'],
          instruction: 'The "Reporting" node powers this preview query. Real-time streaming membership may differ slightly from the preview count.',
        },
        {
          title: 'Step 5: Save — Go Streaming',
          description: 'Saving registers the segment in the segment registry. Every subsequent profile write event triggers incremental evaluation via Pub/Sub. Membership updates propagate in < 200ms. The segment is immediately available in Journeys and Activation.',
          highlights: ['audiences', 'journeys', 'activation'],
          instruction: 'Watch "Audiences" connect to both "Journeys" and "Activation" — a saved, live segment is the fuel for both orchestration and direct activation paths.',
        },
      ],
    },
    trigger_journey: {
      id: 'trigger_journey',
      title: 'Trigger a Customer Journey',
      icon: '🚀',
      steps: [
        {
          title: 'Step 1: Define the Entry Event',
          description: 'In Journey Builder (Unity Dashboard), set the trigger: "Customer enters seg_high_value_eu." The journey-executor (Java + Kafka) consumes segment changelog events from a Pub/Sub topic. The first matching profile fires the journey in < 50ms of segment entry.',
          highlights: ['audiences', 'journeys'],
          instruction: 'The "Audiences" → "Journeys" edge is this trigger path. Every segment membership change emits a Pub/Sub changelog message consumed by the journey executor.',
        },
        {
          title: 'Step 2: Configure the Step Sequence',
          description: 'Add: Step 1 — personalised email via Braze connector. Step 2 — Wait node (3 days). Step 3 — Conditional branch: if email_opened then SMS, else push notification. The full sequence serializes to a DAG persisted atomically in Redis.',
          highlights: ['journeys'],
          instruction: 'Journey state lives in Redis keyed by ucid + journey_id. Each step enqueue is atomic — no lost state if a worker crashes mid-execution.',
        },
        {
          title: 'Step 3: Set Wait Conditions',
          description: 'Wait nodes accept ISO 8601 durations (PT72H for 3 days) or calendar windows (NEXT_MONDAY_9AM in the customer\'s own timezone). Airflow checks Redis for ready-to-advance journey states every 30 seconds.',
          highlights: ['journeys'],
          instruction: 'Redis stores the wait_until timestamp per customer. Airflow polls and enqueues the next step when the condition passes — accurate to within 30 seconds.',
        },
        {
          title: 'Step 4: Assign Channels + Enforce Consent',
          description: 'Map email step → Braze (ucid → external_id). SMS step → Twilio. Push → Firebase FCM. At every dispatch, the Privacy Engine retrieves consent status. A revoked consent silently skips that step without breaking the journey for that customer.',
          highlights: ['journeys', 'activation', 'privacy'],
          instruction: 'The "Privacy" node intercepts every dispatch. Consent is checked at activation time, not journey creation — so late revocations are always honoured in real time.',
        },
        {
          title: 'Step 5: Activate the Journey',
          description: 'Click "Activate." The journey moves from DRAFT to LIVE in the journey registry. connector-hub begins listening on the activation-tasks Kafka topic. The first qualifying customer starts their journey within < 50ms. Monitoring metrics appear immediately.',
          highlights: ['journeys', 'activation'],
          instruction: 'Watch the "Journeys" → "Activation" edge light up — this is the live execution path from orchestration logic to real destination delivery.',
        },
      ],
    },
    activate_audience: {
      id: 'activate_audience',
      title: 'Activate an Audience',
      icon: '📤',
      steps: [
        {
          title: 'Step 1: Select Your Segment',
          description: 'In the Destinations UI, choose "seg_high_value_eu" (~47K profiles). This segment is streaming-live — any new profile that enters will sync to the destination automatically within 2 seconds of membership change via the Pub/Sub segment changelog.',
          highlights: ['audiences'],
          instruction: 'The "Audiences" node holds the live membership list. Segment size updates continuously as profiles qualify or dis-qualify from the rule conditions.',
        },
        {
          title: 'Step 2: Choose a Destination',
          description: 'Select "Meta CAPI" from the 100+ connector catalogue. connector-hub (Scala) manages the Meta Conversions API v16 protocol, OAuth 2.0 token refresh, and rate-limit management (up to 2,000 events/s per pixel ID).',
          highlights: ['activation'],
          instruction: 'The "Activation" node is connector-hub. Each of the 100+ connectors has protocol-specific retry logic, exponential backoff, and SLA monitoring built in.',
        },
        {
          title: 'Step 3: Configure Field Mapping',
          description: 'Map: ucid → em (SHA-256 hashed email, Privacy Engine applies the hash). mobile_ad_id → madid (raw GAID). Add enrichment from the profile: geo.country, top_category. Mapping specs apply at export time using live profile values — not a snapshot.',
          highlights: ['activation', 'profiles'],
          instruction: 'Field mapping pulls from the live "Profile Store" at export time. Activations always use the freshest data, not a stale cache.',
        },
        {
          title: 'Step 4: Set Sync Frequency',
          description: 'Choose "Real-time streaming" — as profiles enter or exit the segment, connector-hub pushes incremental updates to Meta CAPI within 2 seconds. Or "Daily batch" stages a GCS file export to gs://zeotap-exports-eu/batch/meta/ at 02:00 UTC.',
          highlights: ['activation', 'audiences'],
          instruction: 'Real-time mode is powered by the Pub/Sub segment changelog. Batch mode uses a Cloud Scheduler trigger to Dataflow export job — both paths maintain full consent enforcement.',
        },
        {
          title: 'Step 5: Push and Monitor',
          description: 'Click "Save and Push." connector-hub dispatches the initial ~47K batch using 3 parallel workers. Every delivery receipt logs a Cloud Trace span. The Observability dashboard shows match rates, p99 delivery latency, and error rates per destination in real time.',
          highlights: ['activation', 'observe'],
          instruction: 'Watch the "Observability" node — every delivery receipt is a trace span. SLO alerts fire automatically if p99 delivery exceeds 5 seconds, triggering PagerDuty escalation.',
        },
      ],
    },
  };

  let currentMission = null;
  let currentStep = 0;

  function hasKG() {
    return !!global.KG;
  }

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

    // Inject close button
    var closeBtn = document.createElement('button');
    closeBtn.className = 'mission-close-btn';
    closeBtn.innerHTML = '✕';
    closeBtn.title = 'Exit mission';
    closeBtn.addEventListener('click', function () { global.MissionMode.exitMission(); });
    panel.appendChild(closeBtn);

    // Highlight nodes
    if (hasKG()) {
      global.KG.highlight(step.highlights);
    }
  }

  global.MissionMode = {
    startMission(missionId) {
      if (!MISSIONS[missionId]) {
        console.error('Mission not found:', missionId);
        return;
      }
      if (!hasKG()) return;
      currentMission = missionId;
      currentStep = 0;
      renderMissionPanel();
      var graphEl = document.getElementById('knowledge-graph');
      if (graphEl) graphEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
      if (hasKG()) {
        global.KG.reset();
      }
      currentMission = null;
      currentStep = 0;
    },

    exitMission() {
      this.completeMission();
    },
  };

})(window);
