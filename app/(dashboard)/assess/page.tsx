'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import QuizEngine, { type QuizData } from '@/components/learning/QuizEngine';
import ScenarioQuiz, { type ScenarioQuizData } from '@/components/learning/ScenarioQuiz';

const SCENARIO_QUIZZES: ScenarioQuizData[] = [
  {
    id: 'data-pipeline-scenario',
    title: 'Data Pipeline — Scenario Challenge',
    description: 'Real-world scenarios about data flow, ingestion, and troubleshooting',
    passScore: 70,
    icon: '🔄',
    color: '#6366f1',
    questions: [
      {
        type: 'scenario',
        id: 'dp1',
        scenario: 'A retail customer reports that purchase events from their mobile app are appearing in the Unity dashboard with a 45-minute delay. The web SDK events are arriving in real-time. The mobile SDK is configured correctly and events show up in the app logs immediately after purchase.',
        question: 'What is the most likely cause of the delay?',
        options: [
          'The mobile SDK batch interval is set too high',
          'Kafka consumer lag on the mobile events topic',
          'BigQuery is throttling the writes',
          'The customer\'s mobile app has a bug',
        ],
        correct: 1,
        explanation: 'When web events work fine but mobile events are delayed, and the SDK sends immediately, the bottleneck is likely Kafka consumer lag on the specific topic handling mobile events. Check consumer group metrics.',
        hint: 'Think about where in the pipeline the delay could occur if the SDK sends correctly.',
      },
      {
        type: 'ordering',
        id: 'dp2',
        text: 'Put the data pipeline stages in the correct order from event capture to activation:',
        items: ['Profile Store Update', 'SDK Event Capture', 'Kafka Ingestion', 'ETL Processing', 'Identity Resolution', 'Audience Evaluation', 'Destination Sync'],
        correctOrder: ['SDK Event Capture', 'Kafka Ingestion', 'ETL Processing', 'Identity Resolution', 'Profile Store Update', 'Audience Evaluation', 'Destination Sync'],
        explanation: 'Events flow: SDK capture → Kafka → ETL (cleaning/transformation) → Identity Resolution (UCID matching) → Profile Store → Audience evaluation → Destination sync.',
      },
      {
        type: 'scenario',
        id: 'dp3',
        scenario: 'An engineer notices that identity resolution is creating duplicate UCIDs for the same customer. The customer logs in with email on desktop and phone number on mobile. Both identifiers exist in the system but are not being linked.',
        question: 'What is the most likely issue?',
        options: [
          'The customer needs to use the same login method everywhere',
          'The deterministic matching rules don\'t include a cross-reference between email and phone',
          'BigQuery is out of storage',
          'Kafka is dropping events',
        ],
        correct: 1,
        explanation: 'Identity resolution requires explicit linking rules. If email-to-phone cross-referencing isn\'t configured in the deterministic matching rules, these identifiers won\'t be merged into one UCID.',
      },
      {
        type: 'matching',
        id: 'dp4',
        text: 'Match each technology to its role in the Zeotap pipeline:',
        pairs: [
          { left: 'Apache Kafka', right: 'Real-time event streaming' },
          { left: 'Delta Lake', right: 'Profile storage with ACID transactions' },
          { left: 'Apache Beam', right: 'ETL data processing' },
          { left: 'Vertex AI', right: 'ML model training and serving' },
          { left: 'BigQuery', right: 'Analytics and reporting' },
        ],
        explanation: 'Each technology serves a specific role: Kafka for streaming, Delta Lake for ACID storage, Beam for ETL, Vertex AI for ML, and BigQuery for analytics.',
      },
      {
        type: 'scenario',
        id: 'dp5',
        scenario: 'A customer\'s data source is sending 50,000 events per second during a flash sale. Normally they send 5,000/sec. The ingestion pipeline starts showing increased latency and some events are being dropped.',
        question: 'What is the best immediate action?',
        options: [
          'Ask the customer to reduce their event volume',
          'Scale up Kafka partitions and consumer instances for the affected topic',
          'Switch to batch processing',
          'Restart the entire pipeline',
        ],
        correct: 1,
        explanation: 'During traffic spikes, horizontal scaling of Kafka partitions and consumers is the right approach. This handles the 10x load increase without data loss.',
        hint: 'Think about how Kafka handles parallelism.',
      },
      {
        type: 'mc',
        id: 'dp6',
        text: 'What is the benefit of using Delta Lake over plain Parquet for the profile store?',
        options: [
          'Lower storage costs',
          'ACID transactions, schema enforcement, and time-travel queries',
          'Faster read speeds',
          'Better compression ratios',
        ],
        correct: 1,
        explanation: 'Delta Lake provides ACID transactions (concurrent read/write safety), schema enforcement (prevents bad data), and time-travel (query historical states).',
      },
    ],
  },
  {
    id: 'customer-success-scenario',
    title: 'Customer Success — Scenario Challenge',
    description: 'Handle real customer situations: troubleshooting, escalation, and growth',
    passScore: 70,
    icon: '🤝',
    color: '#10b981',
    questions: [
      {
        type: 'scenario',
        id: 'cs1',
        scenario: 'A key enterprise customer (annual contract: €500K) calls in frustrated. Their Facebook Ads destination has been failing for 3 days. They have a major campaign launching tomorrow. The error logs show "Authentication token expired." The customer\'s marketing team is threatening to escalate to their VP.',
        question: 'What should be your immediate response?',
        options: [
          'Tell them to re-authenticate the Facebook connection and close the ticket',
          'Acknowledge urgency, re-authenticate immediately with them on the call, verify data sync, escalate internally to ensure monitoring, and follow up in 2 hours',
          'Create a Jira ticket and assign it to engineering',
          'Ask them to wait until next week when the engineering team is available',
        ],
        correct: 1,
        explanation: 'High-value customers with time-sensitive campaigns need immediate action + proactive follow-up. Fix the immediate issue (re-auth), verify it works, set up monitoring, and provide a timeline for follow-up.',
        hint: 'Consider the customer\'s contract value and the urgency of their campaign.',
      },
      {
        type: 'ordering',
        id: 'cs2',
        text: 'Put the customer escalation steps in the correct order:',
        items: ['Notify account manager', 'Reproduce the issue', 'Document resolution and update knowledge base', 'Acknowledge the issue to the customer within 1 hour', 'Implement fix and verify', 'Engage engineering if needed'],
        correctOrder: ['Acknowledge the issue to the customer within 1 hour', 'Reproduce the issue', 'Engage engineering if needed', 'Notify account manager', 'Implement fix and verify', 'Document resolution and update knowledge base'],
        explanation: 'Always acknowledge first (builds trust), then diagnose, engage help if needed, keep stakeholders informed, fix, and finally document for future reference.',
      },
      {
        type: 'scenario',
        id: 'cs3',
        scenario: 'During a quarterly business review, a customer mentions they\'re only using Zeotap for basic audience segmentation. They\'re unaware of Journey Canvas, Ada AI, and the ML-based lookalike features. Their contract renewal is in 3 months.',
        question: 'How should you approach this?',
        options: [
          'Focus on renewing the current contract at the same price',
          'Propose a product deep-dive session showcasing unused features, create a value roadmap, and position for expansion',
          'Send them documentation links',
          'Wait until they ask about more features',
        ],
        correct: 1,
        explanation: 'Low feature adoption is a churn risk. Proactively demonstrating value through unused features increases stickiness and creates expansion opportunities before renewal.',
      },
      {
        type: 'matching',
        id: 'cs4',
        text: 'Match each customer health indicator to its risk level:',
        pairs: [
          { left: 'Daily active users declining 30%', right: 'Critical — Immediate action needed' },
          { left: 'Support tickets increased 2x', right: 'Warning — Monitor closely' },
          { left: 'Feature adoption rate increasing', right: 'Healthy — Continue nurturing' },
          { left: 'No login in 30 days', right: 'Critical — Immediate action needed' },
        ],
        explanation: 'DAU decline and no logins are critical churn signals. Increased support tickets are a warning. Growing feature adoption is positive.',
      },
    ],
  },
];

const QUIZZES: QuizData[] = [
  {
    id: 'business-essentials-quiz',
    title: 'Business Essentials — Knowledge Check',
    description: 'Test your understanding of Zeotap, CDPs, and our market',
    passScore: 70,
    questions: [
      { id: 'be1', text: 'What does CDP stand for?', options: ['Customer Data Platform', 'Central Data Pipeline', 'Cloud Data Processing', 'Customer Digital Profile'], correct: 0, explanation: 'CDP stands for Customer Data Platform — a system that creates a persistent, unified customer database accessible to other systems.' },
      { id: 'be2', text: 'What is Zeotap\'s core differentiator in the CDP market?', options: ['Cheapest pricing', 'Identity resolution and EU-first privacy compliance', 'Most integrations', 'Fastest dashboard'], correct: 1, explanation: 'Zeotap differentiates through best-in-class identity resolution (UCID) and being built EU-first with GDPR compliance at its core.' },
      { id: 'be3', text: 'What is a UCID in Zeotap?', options: ['A database table', 'Unified Customer Identity — a single ID for each person', 'A billing code', 'A deployment region'], correct: 1, explanation: 'UCID (Unified Customer Identity) unifies all cross-device and cross-channel identifiers into a single persistent ID per person.' },
      { id: 'be4', text: 'How does a CDP differ from a DMP?', options: ['CDPs are cheaper', 'CDPs use first-party data with persistent profiles; DMPs use third-party cookies with temporary segments', 'DMPs are newer technology', 'There is no difference'], correct: 1, explanation: 'CDPs build persistent first-party profiles. DMPs traditionally relied on third-party cookies and temporary audience segments — a model that is dying with cookie deprecation.' },
      { id: 'be5', text: 'Which of these is NOT one of Zeotap\'s three pillars?', options: ['Collect', 'Unify', 'Activate', 'Monetize'], correct: 3, explanation: 'Zeotap\'s three core pillars are Collect (data ingestion), Unify (identity resolution + profiles), and Activate (audience delivery to destinations).' },
      { id: 'be6', text: 'Which verticals are Zeotap\'s primary customers?', options: ['Only healthcare', 'Retail, finance, telco, and media', 'Only government agencies', 'Only startups'], correct: 1, explanation: 'Zeotap serves enterprise customers primarily in retail, financial services, telecommunications, and media verticals.' },
    ],
  },
  {
    id: 'engineering-week1-quiz',
    title: 'Engineering Week 1 — Platform Basics',
    description: 'Test your understanding of Zeotap\'s core architecture',
    passScore: 70,
    questions: [
      { id: 'q1_1', text: 'What does UCID stand for in Zeotap\'s identity system?', options: ['Universal Customer Identity Document', 'Unified Customer Identity', 'User-Centric ID', 'Unique Customer Identifier'], correct: 1, explanation: 'UCID (Unified Customer Identity) is Zeotap\'s core concept — a single persistent ID unifying all cross-device, cross-channel identifiers for one person.' },
      { id: 'q1_2', text: 'Which Apache technology powers Zeotap\'s real-time streaming ingestion?', options: ['Apache Flink', 'Apache Kafka', 'Apache Airflow', 'Apache Cassandra'], correct: 1, explanation: 'Apache Kafka is the backbone of real-time event streaming. Events from SDKs flow through Kafka topics before processing.' },
      { id: 'q1_3', text: 'What is the primary storage format for customer profiles in Zeotap?', options: ['Parquet on GCS', 'Delta Lake on GCS', 'BigQuery tables', 'Bigtable rows'], correct: 1, explanation: 'Delta Lake on GCS provides ACID transactions and time-travel for Zeotap\'s profile store.' },
      { id: 'q1_4', text: 'Which approach does Zeotap use for cross-device identity matching?', options: ['IP matching only', 'Fingerprinting only', 'Both deterministic (email/phone) and probabilistic matching', 'Only server-side IDs'], correct: 2, explanation: 'Zeotap uses both deterministic linking (hashed email/phone) and probabilistic models.' },
      { id: 'q1_5', text: 'The Zeotap Web SDK primarily communicates data using:', options: ['WebSockets only', 'HTTP POST to S2S API', 'GraphQL subscriptions', 'gRPC streams'], correct: 1, explanation: 'The Web SDK batches and sends events via HTTP POST to the S2S Collect API.' },
      { id: 'q1_6', text: 'What is CDAP in Zeotap\'s data ingestion stack?', options: ['A cloud database', 'A data integration platform for building and running pipelines', 'An authentication system', 'A monitoring tool'], correct: 1, explanation: 'CDAP (Cloud Data Application Platform) is used for building and orchestrating data integration pipelines.' },
      { id: 'q1_7', text: 'Which cloud provider does Zeotap primarily run on?', options: ['AWS', 'Azure', 'Google Cloud Platform (GCP)', 'On-premise'], correct: 2, explanation: 'Zeotap runs on GCP, using GKE for containers, BigQuery for analytics, GCS for storage, and Vertex AI for ML.' },
      { id: 'q1_8', text: 'What does Delta Lake provide that standard Parquet doesn\'t?', options: ['Faster reads', 'ACID transactions and time-travel', 'Better compression', 'SQL querying'], correct: 1, explanation: 'Delta Lake adds ACID transactions, time-travel (query historical data), and schema enforcement on top of Parquet.' },
    ],
  },
  {
    id: 'engineering-week2-quiz',
    title: 'Engineering Week 2 — Data Intelligence',
    description: 'Test your understanding of audiences, journeys, and AI',
    passScore: 70,
    questions: [
      { id: 'q2_1', text: 'How does Zeotap\'s Audience Builder evaluate segment membership in real-time?', options: ['Batch jobs that run nightly', 'Event-driven evaluation as new events arrive', 'Manual re-computation', 'API polling every hour'], correct: 1, explanation: 'Zeotap evaluates segment rules in real-time as events flow through the system.' },
      { id: 'q2_2', text: 'What does Ada (Zeotap\'s AI copilot) use to generate segments from natural language?', options: ['Rule templates only', 'RAG (Retrieval-Augmented Generation) + Vertex AI LLMs', 'Simple keyword matching', 'Pre-defined patterns'], correct: 1, explanation: 'Ada uses RAG — retrieves schema context, then uses Vertex AI LLMs to translate natural language into segment rules.' },
      { id: 'q2_3', text: 'Customer Journey triggers can be based on:', options: ['Only time-based schedules', 'Only segment entries', 'Segment entry/exit, events, or schedule combinations', 'Only API calls'], correct: 2, explanation: 'Journey triggers are flexible: segment join/leave, event, schedule, or any combination.' },
      { id: 'q2_4', text: 'What technology does Zeotap use for ML model serving?', options: ['AWS SageMaker', 'Google Vertex AI', 'Azure ML', 'Self-hosted TensorFlow'], correct: 1, explanation: 'Zeotap uses Vertex AI for training and serving ML models.' },
      { id: 'q2_5', text: 'How many activation destinations does Zeotap support?', options: ['~20', '~50', '100+', '~10'], correct: 2, explanation: 'Zeotap supports 100+ activation destinations spanning ad platforms, CRMs, DMPs, and custom webhooks.' },
      { id: 'q2_6', text: 'What is a "lookalike" audience in Zeotap?', options: ['A copy of an existing audience', 'An ML-generated audience of users similar to a seed audience', 'An audience from another platform', 'A test audience'], correct: 1, explanation: 'Lookalike modeling uses ML to find users who share characteristics with a "seed" audience of known high-value users.' },
    ],
  },
  {
    id: 'product-mastery-quiz',
    title: 'Product Mastery — Knowledge Check',
    description: 'Test your ability to use Zeotap\'s product features',
    passScore: 70,
    questions: [
      { id: 'pm1', text: 'To create a new audience segment in Zeotap, you would use:', options: ['The Settings page', 'The Audience Builder', 'The API Console', 'The Data Sources page'], correct: 1, explanation: 'The Audience Builder is the primary tool for creating segments using rules, conditions, or natural language via Ada.' },
      { id: 'pm2', text: 'What does the Journey Canvas allow you to do?', options: ['Write custom code', 'Build multi-step automated customer campaigns', 'Manage user permissions', 'Configure server infrastructure'], correct: 1, explanation: 'The Journey Canvas is a visual tool for building multi-step customer journeys with triggers, conditions, and actions.' },
      { id: 'pm3', text: 'When setting up a new destination, what is "field mapping"?', options: ['Drawing a map of data centers', 'Connecting Zeotap profile fields to the destination\'s expected fields', 'Creating a new database', 'Backing up data'], correct: 1, explanation: 'Field mapping connects your Zeotap profile attributes to the corresponding fields expected by the destination platform.' },
      { id: 'pm4', text: 'You can verify data is flowing correctly from an SDK by checking:', options: ['The CEO dashboard', 'The Data Sources page showing incoming events', 'The billing page', 'The glossary'], correct: 1, explanation: 'The Data Sources page shows real-time event counts, last event timestamps, and data quality indicators for each source.' },
      { id: 'pm5', text: 'Natural language segmentation in Zeotap is powered by:', options: ['Manual rule templates', 'Ada AI copilot', 'External SQL queries', 'Spreadsheet imports'], correct: 1, explanation: 'Ada uses AI to convert natural language queries like "Users who bought in the last 7 days" into structured segment rules.' },
    ],
  },
];

export default function AssessPage() {
  const [activeQuiz, setActiveQuiz] = useState<QuizData | null>(null);
  const [activeScenario, setActiveScenario] = useState<ScenarioQuizData | null>(null);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold">Assessments</h1>
        <p className="text-text-secondary text-sm mt-1">
          Test your knowledge across all learning tracks. Score 70%+ to pass.
        </p>
      </div>

      {/* Scenario Challenges */}
      <div>
        <h2 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-4">
          Scenario Challenges
        </h2>
        <p className="text-xs text-text-muted mb-4">
          Real-world scenarios with ordering, matching, and situational questions.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {SCENARIO_QUIZZES.map((quiz) => (
            <Card key={quiz.id} hover>
              <div className="flex items-start gap-4">
                <div className="text-3xl">{quiz.icon}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm">{quiz.title}</h3>
                  <p className="text-xs text-text-muted mt-1">{quiz.description}</p>
                  <div className="flex items-center gap-2 flex-wrap mt-3">
                    <Badge color={quiz.color}>{quiz.questions.length} questions</Badge>
                    <Badge color="#f59e0b">Pass: {quiz.passScore}%</Badge>
                    <Badge color="#a855f7">Interactive</Badge>
                  </div>
                  <Button
                    size="sm"
                    className="mt-4"
                    onClick={() => setActiveScenario(quiz)}
                  >
                    Start Challenge
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Knowledge Check Quizzes */}
      <div>
        <h2 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-4">
          Knowledge Checks
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {QUIZZES.map((quiz) => (
            <Card key={quiz.id} hover>
              <div className="flex items-start gap-4">
                <div className="text-3xl">📝</div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm">{quiz.title}</h3>
                  <p className="text-xs text-text-muted mt-1">{quiz.description}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <Badge color="#3b82f6">{quiz.questions.length} questions</Badge>
                    <Badge color="#f59e0b">Pass: {quiz.passScore}%</Badge>
                  </div>
                  <Button
                    size="sm"
                    className="mt-4"
                    onClick={() => setActiveQuiz(quiz)}
                  >
                    Start Quiz
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Regular Quiz modal */}
      <Modal
        isOpen={!!activeQuiz}
        onClose={() => setActiveQuiz(null)}
        title={activeQuiz?.title}
        maxWidth="max-w-2xl"
      >
        {activeQuiz && (
          <QuizEngine
            quiz={activeQuiz}
            onClose={() => setActiveQuiz(null)}
          />
        )}
      </Modal>

      {/* Scenario Quiz modal */}
      <Modal
        isOpen={!!activeScenario}
        onClose={() => setActiveScenario(null)}
        title={activeScenario?.title}
        maxWidth="max-w-3xl"
      >
        {activeScenario && (
          <ScenarioQuiz
            quiz={activeScenario}
            onClose={() => setActiveScenario(null)}
          />
        )}
      </Modal>
    </div>
  );
}
