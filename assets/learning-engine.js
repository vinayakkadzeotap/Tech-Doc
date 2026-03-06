/* ═══════════════════════════════════════════════════════════════════
   ZEOTAP CDP — INTERACTIVE LEARNING ENGINE
   Onboarding Paths · Quizzes · Progress Tracking · Achievements
   ═══════════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';

  /* ── Storage Keys ── */
  const SK = {
    progress: 'zt_learn_progress',
    quiz:     'zt_quiz_scores',
    badges:   'zt_badges',
  };

  /* ── Learning Path Definition ─────────────────────────────────── */
  const LEARNING_PATHS = {
    new_employee: {
      id: 'new_employee',
      title: 'New Employee Bootcamp',
      subtitle: 'Go from zero to hero in Zeotap\'s platform in 3 weeks',
      icon: '🚀',
      color: '#3b82f6',
      phases: [
        {
          id: 'week1',
          title: 'Week 1 — The Big Picture',
          color: '#3b82f6',
          modules: [
            { id: 'overview', title: 'What is Zeotap CDP?', page: '01-platform-overview.html', icon: '🏢', time: '15 min', key_concepts: ['CDP', 'UCID', 'Unity Dashboard', 'Modular Architecture'] },
            { id: 'data_collection', title: 'Data Collection Layer', page: '02-data-collection.html', icon: '📡', time: '20 min', key_concepts: ['Web SDK', 'Mobile SDK', 'S2S API', 'Batch Import', 'CDAP'] },
            { id: 'data_ingestion', title: 'Data Ingestion Pipelines', page: '03-data-ingestion.html', icon: '⚙️', time: '25 min', key_concepts: ['Apache Beam', 'Apache Spark', 'Kafka', 'GCS', 'BigQuery'] },
            { id: 'identity', title: 'Identity Resolution', page: '03-identity-resolution.html', icon: '🔗', time: '20 min', key_concepts: ['UCID', 'Identity Graph', 'Cookie Bridge', 'Deterministic', 'Probabilistic'] },
          ],
          quiz_id: 'week1_quiz'
        },
        {
          id: 'week2',
          title: 'Week 2 — Data Intelligence',
          color: '#10b981',
          modules: [
            { id: 'profiles', title: 'Profile Store', page: '05-profile-store.html', icon: '👤', time: '20 min', key_concepts: ['Delta Lake', 'ACID', 'Attribute Resolution', 'Profile API'] },
            { id: 'audiences', title: 'Audience Management', page: '06-audience-management.html', icon: '🎯', time: '25 min', key_concepts: ['Segment Builder', 'Real-time Evaluation', 'Lookalike', 'CPM'] },
            { id: 'ai_zoe', title: 'GenAI & Zoe Assistant', page: '04-genai-zoe.html', icon: '🤖', time: '20 min', key_concepts: ['Vertex AI', 'RAG', 'Natural Language Segmentation', 'Embeddings'] },
            { id: 'journeys', title: 'Customer Journeys', page: '07-customer-journeys.html', icon: '🗺️', time: '20 min', key_concepts: ['Journey Canvas', 'Triggers', 'A/B Testing', 'Multi-step Campaigns'] },
          ],
          quiz_id: 'week2_quiz'
        },
        {
          id: 'week3',
          title: 'Week 3 — Platform & Engineering',
          color: '#f59e0b',
          modules: [
            { id: 'activation', title: 'Data Activation', page: '08-data-activation.html', icon: '🚀', time: '20 min', key_concepts: ['Destinations', 'Real-time Sync', 'Batch Export', '100+ Connectors'] },
            { id: 'ml_platform', title: 'ML Platform', page: '10-ml-platform.html', icon: '🧠', time: '25 min', key_concepts: ['Vertex AI', 'Feature Store', 'Propensity Models', 'Churn Prediction'] },
            { id: 'infra', title: 'Infrastructure', page: '15-infrastructure.html', icon: '🏗️', time: '30 min', key_concepts: ['GKE', 'Terraform', 'Multi-region', 'GCS', 'Pub/Sub'] },
            { id: 'observability', title: 'Observability & Reliability', page: '16-observability.html', icon: '📊', time: '20 min', key_concepts: ['Prometheus', 'Grafana', 'OpenTelemetry', 'PagerDuty', 'SLOs'] },
          ],
          quiz_id: 'week3_quiz'
        }
      ]
    },
    deep_dive: {
      id: 'deep_dive',
      title: 'Engineering Deep Dive',
      subtitle: 'Advanced architecture, security, and platform internals',
      icon: '🔬',
      color: '#8b5cf6',
      phases: [
        {
          id: 'advanced',
          title: 'Advanced Topics',
          color: '#8b5cf6',
          modules: [
            { id: 'privacy', title: 'Privacy & GDPR', page: '13-privacy-gdpr.html', icon: '🔒', time: '25 min', key_concepts: ['GDPR', 'CCPA', 'Consent Management', 'Right to Erasure'] },
            { id: 'auth', title: 'Auth & IAM', page: '14-auth-iam.html', icon: '🛡️', time: '20 min', key_concepts: ['Auth0', 'RBAC', 'SSO', 'SCIM', 'OAuth 2.0'] },
            { id: 'cicd', title: 'CI/CD Pipelines', page: '17-cicd.html', icon: '🔄', time: '20 min', key_concepts: ['CloudBuild', 'ArgoCD', 'GitOps', 'Canary Deploy', 'Blue/Green'] },
            { id: 'testing', title: 'Testing Strategy', page: '18-testing.html', icon: '🧪', time: '20 min', key_concepts: ['Contract Testing', 'Chaos Engineering', 'Load Testing', 'E2E Tests'] },
          ],
          quiz_id: 'advanced_quiz'
        }
      ]
    }
  };

  /* ── Quiz Bank ────────────────────────────────────────────────── */
  const QUIZZES = {
    week1_quiz: {
      title: 'Week 1 — Knowledge Check',
      description: 'Test your understanding of Zeotap platform basics',
      pass_score: 70,
      questions: [
        { id: 'q1_1', text: 'What does UCID stand for in Zeotap\'s identity system?', options: ['Universal Customer Identity Document', 'Unified Customer Identity', 'User-Centric ID', 'Unique Customer Identifier'], correct: 1, explanation: 'UCID (Unified Customer Identity) is Zeotap\'s core concept — a single persistent ID unifying all cross-device, cross-channel identifiers for one person.' },
        { id: 'q1_2', text: 'Which Apache technology powers Zeotap\'s real-time streaming ingestion?', options: ['Apache Flink', 'Apache Kafka', 'Apache Airflow', 'Apache Cassandra'], correct: 1, explanation: 'Apache Kafka is the backbone of real-time event streaming. Events from SDKs flow through Kafka topics before processing.' },
        { id: 'q1_3', text: 'What is the primary storage format for customer profiles in Zeotap?', options: ['Parquet on GCS', 'Delta Lake on GCS', 'BigQuery tables', 'Bigtable rows'], correct: 1, explanation: 'Delta Lake on GCS provides ACID transactions and time-travel for Zeotap\'s profile store — critical for GDPR compliance and consistent reads.' },
        { id: 'q1_4', text: 'Which approach does Zeotap use for cross-device identity matching without cookies?', options: ['IP matching only', 'Fingerprinting only', 'Both deterministic (email/phone) and probabilistic matching', 'Only server-side IDs'], correct: 2, explanation: 'Zeotap uses both deterministic linking (hashed email/phone across devices) and probabilistic models — high accuracy even in cookieless environments.' },
        { id: 'q1_5', text: 'The Zeotap Web SDK primarily communicates data using:', options: ['WebSockets only', 'HTTP POST to S2S API', 'GraphQL subscriptions', 'gRPC streams'], correct: 1, explanation: 'The Web SDK batches and sends events via HTTP POST to the S2S Collect API, which feeds into the Kafka ingestion pipeline.' },
        { id: 'q1_6', text: 'What is CDAP in Zeotap\'s data ingestion stack?', options: ['A cloud database', 'A data integration platform for building and running pipelines', 'An authentication system', 'A monitoring tool'], correct: 1, explanation: 'CDAP (Cloud Data Application Platform) is used for building and orchestrating data integration pipelines, enabling low-code data flow configuration.' }
      ]
    },
    week2_quiz: {
      title: 'Week 2 — Knowledge Check',
      description: 'Test your understanding of data intelligence and segmentation',
      pass_score: 70,
      questions: [
        { id: 'q2_1', text: 'How does Zeotap\'s Audience Builder evaluate segment membership in real-time?', options: ['Batch jobs that run nightly', 'Event-driven evaluation as new events arrive', 'Manual re-computation triggered by users', 'Periodic API polling every hour'], correct: 1, explanation: 'Zeotap evaluates segment rules in real-time as events flow through the system. When a profile update arrives, all relevant audience rules are re-evaluated immediately.' },
        { id: 'q2_2', text: 'What does Zoe (Zeotap\'s AI assistant) use to generate segments from natural language?', options: ['Rule templates only', 'RAG (Retrieval-Augmented Generation) + Vertex AI LLMs', 'Simple keyword matching', 'Pre-defined query patterns'], correct: 1, explanation: 'Zoe uses RAG architecture — retrieves relevant schema context from the vector store, then uses Vertex AI LLMs to translate natural language into structured segment rules.' },
        { id: 'q2_3', text: 'Customer Journey "triggers" in Zeotap can be based on:', options: ['Only time-based schedules', 'Only segment entries', 'Segment entry/exit, events, or schedule combinations', 'Only user API calls'], correct: 2, explanation: 'Journey triggers are flexible: a customer can enter when they join/leave a segment, perform an event, at a scheduled time — or any combination.' },
        { id: 'q2_4', text: 'Delta Lake ACID compliance in the Profile Store means:', options: ['Data is encrypted with strong ciphers', 'Write operations are Atomic, Consistent, Isolated, and Durable', 'Data is automatically deleted after expiry', 'Data is backed up to multiple regions'], correct: 1, explanation: 'ACID guarantees that profile updates either fully succeed or fully fail — preventing partial updates and data corruption.' },
        { id: 'q2_5', text: 'What technology does Zeotap use for ML model serving in propensity scoring?', options: ['AWS SageMaker', 'Google Vertex AI', 'Azure ML', 'Self-hosted TensorFlow Serving'], correct: 1, explanation: 'Zeotap runs on GCP and uses Vertex AI for training and serving ML models including churn prediction, purchase propensity, and lookalike modeling.' }
      ]
    },
    week3_quiz: {
      title: 'Week 3 — Knowledge Check',
      description: 'Test your understanding of platform engineering and infrastructure',
      pass_score: 70,
      questions: [
        { id: 'q3_1', text: 'What Kubernetes platform does Zeotap use for container orchestration?', options: ['EKS (Amazon)', 'AKS (Azure)', 'GKE (Google)', 'Self-managed K8s'], correct: 2, explanation: 'Zeotap runs on Google Cloud Platform and uses GKE (Google Kubernetes Engine) for container orchestration across all microservices.' },
        { id: 'q3_2', text: 'Zeotap\'s CI/CD pipeline uses which approach for safe production deployments?', options: ['All-at-once big bang deploys', 'Canary deployments and Blue/Green switching via ArgoCD', 'Manual SSH deployments', 'Only scheduled maintenance windows'], correct: 1, explanation: 'Zeotap uses ArgoCD for GitOps-driven deployments with canary releases (5% traffic first) and blue/green strategies for zero-downtime updates.' },
        { id: 'q3_3', text: 'For observability, Zeotap primarily uses:', options: ['Jaeger only', 'DataDog only', 'OpenTelemetry + Prometheus + Grafana stack', 'New Relic exclusively'], correct: 2, explanation: 'Zeotap uses the modern observability stack: OpenTelemetry for instrumentation, Prometheus for metrics collection, and Grafana for dashboards and alerting.' },
        { id: 'q3_4', text: 'How many activation destinations does Zeotap support?', options: ['~20 destinations', '~50 destinations', '100+ destinations', '~10 major platforms only'], correct: 2, explanation: 'Zeotap supports 100+ activation destinations spanning ad platforms (Google, Meta, TTD), CRMs (Salesforce, HubSpot), DMPs, and custom webhooks.' },
        { id: 'q3_5', text: 'Infrastructure as Code at Zeotap is primarily managed via:', options: ['Ansible playbooks', 'AWS CloudFormation', 'Terraform + Helm charts', 'Manual GCP Console configuration'], correct: 2, explanation: 'Zeotap uses Terraform for GCP infrastructure provisioning and Helm charts for Kubernetes workload configuration — enabling reproducible, version-controlled infrastructure.' }
      ]
    },
    advanced_quiz: {
      title: 'Advanced Engineering — Knowledge Check',
      description: 'Test your deep understanding of security, privacy, and platform internals',
      pass_score: 75,
      questions: [
        { id: 'qa_1', text: 'Under GDPR, when a user requests data erasure, what must happen?', options: ['Archive data in cold storage', 'Delete data only from the profile store', 'Propagate erasure across ALL systems including archives and downstream activations', 'Mark data as inactive but retain it'], correct: 2, explanation: 'GDPR Right to Erasure requires complete deletion across all systems — profile store, identity graph, data lake, backups, and notification to downstream systems.' },
        { id: 'qa_2', text: 'Which protocol does Zeotap use for federated identity across enterprise customers?', options: ['Basic auth with API keys', 'SAML 2.0 and OIDC via Auth0', 'Username/password only', 'Certificate-based auth only'], correct: 1, explanation: 'Zeotap uses Auth0 as the identity provider, supporting SAML 2.0 for enterprise SSO and OIDC for modern OAuth 2.0 flows.' },
        { id: 'qa_3', text: 'Contract testing in Zeotap\'s microservices is used to:', options: ['Test legal agreements', 'Verify service API contracts aren\'t broken during independent deployments', 'Monitor SLA compliance', 'Test payment flows'], correct: 1, explanation: 'Contract testing ensures that when Service A calls Service B, the expected request/response format hasn\'t changed — catching integration bugs before production.' }
      ]
    }
  };

  /* ── Badges ───────────────────────────────────────────────────── */
  const BADGES = {
    first_module:    { id: 'first_module',    icon: '🌱', title: 'First Steps',       desc: 'Completed your first learning module',             color: '#10b981' },
    week1_complete:  { id: 'week1_complete',  icon: '📘', title: 'Week 1 Graduate',   desc: 'Mastered Zeotap platform fundamentals',            color: '#3b82f6' },
    week2_complete:  { id: 'week2_complete',  icon: '📗', title: 'Week 2 Graduate',   desc: 'Mastered data intelligence and segmentation',      color: '#10b981' },
    week3_complete:  { id: 'week3_complete',  icon: '📙', title: 'Week 3 Graduate',   desc: 'Mastered platform engineering and infrastructure', color: '#f59e0b' },
    quiz_ace:        { id: 'quiz_ace',        icon: '🎯', title: 'Quiz Ace',          desc: 'Scored 100% on any quiz',                          color: '#f59e0b' },
    fast_learner:    { id: 'fast_learner',    icon: '⚡', title: 'Fast Learner',      desc: 'Completed 5 modules in one session',               color: '#a78bfa' },
    bootcamp_grad:   { id: 'bootcamp_grad',   icon: '🎓', title: 'Bootcamp Graduate', desc: 'Completed the full New Employee Bootcamp',         color: '#f43f5e' },
    deep_diver:      { id: 'deep_diver',      icon: '🔬', title: 'Deep Diver',        desc: 'Completed the Engineering Deep Dive path',         color: '#8b5cf6' },
    identity_expert: { id: 'identity_expert', icon: '🔗', title: 'Identity Expert',   desc: 'Mastered identity resolution concepts',            color: '#06b6d4' },
    data_whisperer:  { id: 'data_whisperer',  icon: '📊', title: 'Data Whisperer',    desc: 'Completed all data intelligence modules',          color: '#10b981' },
  };

  /* ── Progress Manager ── */
  const Progress = {
    get() { try { return JSON.parse(localStorage.getItem(SK.progress) || '{}'); } catch(e) { return {}; } },
    save(d) { try { localStorage.setItem(SK.progress, JSON.stringify(d)); } catch(e) {} },
    markComplete(id) {
      const p = this.get();
      if (!p[id]) { p[id] = { completed: true, completedAt: Date.now() }; this.save(p); checkBadges(); }
    },
    isComplete(id) { return !!this.get()[id]; },
    getCount() { return Object.keys(this.get()).length; }
  };

  /* ── Quiz Scores ── */
  const QuizScores = {
    get() { try { return JSON.parse(localStorage.getItem(SK.quiz) || '{}'); } catch(e) { return {}; } },
    save(qId, score, total) {
      const s = this.get();
      const pct = Math.round((score / total) * 100);
      if (!s[qId] || pct > s[qId].pct) { s[qId] = { score, total, pct, date: Date.now() }; try { localStorage.setItem(SK.quiz, JSON.stringify(s)); } catch(e) {} }
      return pct;
    },
    getBest(qId) { return this.get()[qId] || null; }
  };

  /* ── Badge Manager ── */
  const BadgeManager = {
    get() { try { return JSON.parse(localStorage.getItem(SK.badges) || '[]'); } catch(e) { return []; } },
    award(id) {
      const e = this.get();
      if (!e.includes(id)) { e.push(id); try { localStorage.setItem(SK.badges, JSON.stringify(e)); } catch(e2) {} showBadgeToast(BADGES[id]); return true; }
      return false;
    },
    has(id) { return this.get().includes(id); }
  };

  function checkBadges() {
    const c = Progress.get();
    const n = Object.keys(c).length;
    if (n >= 1) BadgeManager.award('first_module');
    if (n >= 5) BadgeManager.award('fast_learner');
    const w1 = LEARNING_PATHS.new_employee.phases[0].modules;
    const w2 = LEARNING_PATHS.new_employee.phases[1].modules;
    const w3 = LEARNING_PATHS.new_employee.phases[2].modules;
    if (w1.every(m => c[m.id])) BadgeManager.award('week1_complete');
    if (w2.every(m => c[m.id])) BadgeManager.award('week2_complete');
    if (w3.every(m => c[m.id])) BadgeManager.award('week3_complete');
    if ([...w1,...w2,...w3].every(m => c[m.id])) BadgeManager.award('bootcamp_grad');
    if (c['identity']) BadgeManager.award('identity_expert');
    if (c['profiles'] && c['audiences'] && c['ai_zoe']) BadgeManager.award('data_whisperer');
    const adv = LEARNING_PATHS.deep_dive.phases[0].modules;
    if (adv.every(m => c[m.id])) BadgeManager.award('deep_diver');
  }

  function showBadgeToast(badge) {
    if (!badge) return;
    document.head.insertAdjacentHTML('beforeend','<style>@keyframes zt-tin{from{transform:translateX(120%);opacity:0}to{transform:translateX(0);opacity:1}}@keyframes zt-tout{from{transform:translateX(0);opacity:1}to{transform:translateX(120%);opacity:0}}.zt-btst-icon{font-size:2.2rem}.zt-btst-t{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px}.zt-btst-n{color:#f0f6ff;font-size:14px;font-weight:700;margin-top:2px}.zt-btst-d{color:#94a3b8;font-size:12px;margin-top:2px}</style>');
    const t = document.createElement('div');
    t.style.cssText='position:fixed;bottom:24px;right:24px;z-index:99999;background:linear-gradient(135deg,#0f172a,#1e293b);border:2px solid '+badge.color+';border-radius:16px;padding:16px 20px;display:flex;align-items:center;gap:14px;box-shadow:0 8px 32px rgba(0,0,0,0.4),0 0 20px '+badge.color+'40;animation:zt-tin 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards;max-width:300px;cursor:pointer;font-family:Inter,sans-serif;';
    t.innerHTML='<span class="zt-btst-icon">'+badge.icon+'</span><div><div class="zt-btst-t" style="color:'+badge.color+'">🏆 Achievement Unlocked!</div><div class="zt-btst-n">'+badge.title+'</div><div class="zt-btst-d">'+badge.desc+'</div></div>';
    document.body.appendChild(t);
    t.addEventListener('click',()=>{t.style.animation='zt-tout 0.4s ease forwards';setTimeout(()=>t.remove(),400);});
    setTimeout(()=>{if(t.parentNode){t.style.animation='zt-tout 0.4s ease forwards';setTimeout(()=>t.remove(),400);}},5000);
  }

  /* ── Quiz Engine ── */
  function startQuiz(quizId, container) {
    const quiz = QUIZZES[quizId];
    if (!quiz) return;
    let currentQ = 0, answers = {};

    function render() {
      const q = quiz.questions[currentQ];
      const isLast = currentQ === quiz.questions.length - 1;
      const answered = answers[q.id] !== undefined;
      container.innerHTML = `
        <div class="zt-quiz-header">
          <div class="zt-quiz-title">${quiz.title}</div>
          <div class="zt-quiz-progress-bar"><div class="zt-quiz-progress-fill" style="width:${(currentQ/quiz.questions.length*100)}%"></div></div>
          <div class="zt-quiz-counter">Question ${currentQ+1} of ${quiz.questions.length}</div>
        </div>
        <div class="zt-quiz-question">${q.text}</div>
        <div class="zt-quiz-options">
          ${q.options.map((opt,i)=>`
            <button class="zt-quiz-option ${answered?(i===q.correct?'correct':(answers[q.id]===i?'wrong':'')):''}">
              <span class="zt-option-letter">${String.fromCharCode(65+i)}</span>
              <span class="zt-option-text">${opt}</span>
              ${answered&&i===q.correct?'<span class="zt-option-check">✓</span>':''}
              ${answered&&answers[q.id]===i&&i!==q.correct?'<span class="zt-option-x">✗</span>':''}
            </button>
          `).join('')}
        </div>
        ${answered?`<div class="zt-quiz-explanation"><strong>💡 Explanation:</strong> ${q.explanation}</div>`:''}
        <div class="zt-quiz-nav">
          ${currentQ>0?`<button class="zt-quiz-nav-btn" id="zt-prev">← Previous</button>`:'<div></div>'}
          ${answered?(isLast?`<button class="zt-quiz-nav-btn primary" id="zt-submit">Submit Quiz →</button>`:`<button class="zt-quiz-nav-btn primary" id="zt-next">Next →</button>`):''}
        </div>
      `;
      // Wire up clicks after render (event delegation avoids onclick= eval)
      container.querySelectorAll('.zt-quiz-option').forEach((btn, i) => {
        if (!answered) btn.addEventListener('click', () => { answers[q.id] = i; render(); });
      });
      container.querySelector('#zt-next')?.addEventListener('click', () => { currentQ++; render(); });
      container.querySelector('#zt-prev')?.addEventListener('click', () => { currentQ--; render(); });
      container.querySelector('#zt-submit')?.addEventListener('click', showResults);
    }

    function showResults() {
      const correct = quiz.questions.filter(q => answers[q.id] === q.correct).length;
      const pct = QuizScores.save(quizId, correct, quiz.questions.length);
      const passed = pct >= quiz.pass_score;
      if (pct === 100) BadgeManager.award('quiz_ace');
      container.innerHTML = `
        <div class="zt-quiz-result ${passed?'pass':'fail'}">
          <div class="zt-result-icon">${passed?'🎉':'📚'}</div>
          <div class="zt-result-score">${pct}%</div>
          <div class="zt-result-label">${passed?'Passed!':'Keep Learning!'}</div>
          <div class="zt-result-detail">${correct} of ${quiz.questions.length} correct · Pass mark: ${quiz.pass_score}%</div>
          <div class="zt-result-msg">${passed?'Great work! You\'ve demonstrated solid understanding.':'Review the module and try again — retake anytime.'}</div>
          <div class="zt-result-actions">
            <button class="zt-quiz-nav-btn" id="zt-retake">Retake Quiz</button>
            ${passed?`<button class="zt-quiz-nav-btn primary" id="zt-close-quiz">Continue →</button>`:''}
          </div>
          <div class="zt-result-breakdown">
            ${quiz.questions.map((q,i)=>`<div class="zt-breakdown-item ${answers[q.id]===q.correct?'correct':'wrong'}"><span>${answers[q.id]===q.correct?'✓':'✗'}</span><span>Q${i+1}: ${q.text.substring(0,60)}${q.text.length>60?'...':''}</span></div>`).join('')}
          </div>
        </div>
      `;
      container.querySelector('#zt-retake')?.addEventListener('click', () => { answers={}; currentQ=0; render(); });
      container.querySelector('#zt-close-quiz')?.addEventListener('click', () => { if(window.ZTLearn._closeQuiz) window.ZTLearn._closeQuiz(); });
      if (window.ZTLearnPage?.refresh) setTimeout(() => window.ZTLearnPage.refresh(), 1500);
    }

    render();
  }

  /* ── Public API ── */
  const LearningEngine = {
    PATHS: LEARNING_PATHS, QUIZZES, BADGES,
    Progress, QuizScores, BadgeManager,
    startQuiz, checkBadges, showBadgeToast,
    getOverallProgress() {
      const all = [...LEARNING_PATHS.new_employee.phases.flatMap(p=>p.modules),...LEARNING_PATHS.deep_dive.phases.flatMap(p=>p.modules)];
      const done = Progress.getCount();
      return { completed: done, total: all.length, pct: Math.round((done/all.length)*100) };
    }
  };

  global.ZTLearn = global.ZTLearn || {};
  Object.assign(global.ZTLearn, LearningEngine);

}(window));
