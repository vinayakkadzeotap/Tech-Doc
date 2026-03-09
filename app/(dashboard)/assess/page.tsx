'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import QuizEngine, { type QuizData } from '@/components/learning/QuizEngine';

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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold">Assessments</h1>
        <p className="text-text-secondary text-sm mt-1">
          Test your knowledge across all learning tracks. Score 70%+ to pass.
        </p>
      </div>

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

      {/* Quiz modal */}
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
    </div>
  );
}
