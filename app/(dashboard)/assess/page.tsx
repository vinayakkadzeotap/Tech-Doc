'use client';

import { useState } from 'react';
import {
  Workflow,
  Handshake,
  ClipboardCheck,
  Target,
  Shield,
  BookOpen,
  Wrench,
} from 'lucide-react';
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
  {
    id: 'sales-enablement-scenario',
    title: 'Sales Enablement — Scenario Challenge',
    description: 'Navigate real sales situations: objection handling, demos, and deal strategy',
    passScore: 70,
    icon: '🎯',
    color: '#f97316',
    questions: [
      {
        type: 'scenario',
        id: 'se1',
        scenario: 'You\'re in a meeting with a VP of Engineering at a mid-size e-commerce company. They say: "We have a strong data team. We\'re evaluating building our own CDP on top of Snowflake vs. buying Zeotap. Why should we buy instead of build?"',
        question: 'What is the strongest response?',
        options: [
          'Building a CDP is impossible — only vendors can do it properly',
          'Acknowledge their capability, then highlight the hidden costs: identity resolution R&D, 100+ pre-built connectors, ongoing maintenance, compliance certifications, and the 12-18 month time-to-value gap vs. weeks with Zeotap',
          'Offer a 50% discount to undercut the build option',
          'Tell them Snowflake can\'t handle CDP workloads',
        ],
        correct: 1,
        explanation: 'The build-vs-buy objection requires empathy first, then reframing around total cost of ownership. Strong engineering teams CAN build a CDP, but the hidden costs (identity resolution alone is years of R&D, 100+ connectors to maintain, compliance certifications) make buying far more efficient. Focus on time-to-value.',
        hint: 'Think about total cost of ownership, not just upfront cost.',
      },
      {
        type: 'ordering',
        id: 'se2',
        text: 'Put the steps of an effective Zeotap product demo in the correct order:',
        items: ['Activation & Destination Sync', 'Set the Stage — recap customer pain points', 'Identity Resolution & Profile Unification', 'Next Steps & Mutual Action Plan', 'Data Ingestion — show SDK + file upload', 'Segmentation & Audience Builder', 'Profile Explorer — show unified profile'],
        correctOrder: ['Set the Stage — recap customer pain points', 'Data Ingestion — show SDK + file upload', 'Identity Resolution & Profile Unification', 'Profile Explorer — show unified profile', 'Segmentation & Audience Builder', 'Activation & Destination Sync', 'Next Steps & Mutual Action Plan'],
        explanation: 'An effective demo follows the customer\'s data journey: start with their pain, show data coming in, unify it, explore the result, build audiences, activate, then close with concrete next steps. Never start with features — start with context.',
      },
      {
        type: 'matching',
        id: 'se3',
        text: 'Match each Zeotap capability to the buyer persona who cares most about it:',
        pairs: [
          { left: 'Campaign ROI attribution', right: 'CMO / VP Marketing' },
          { left: 'Architecture & GDPR compliance', right: 'CTO / VP Engineering' },
          { left: 'Customer health scoring', right: 'VP Customer Success' },
          { left: 'Audience monetization', right: 'Chief Revenue Officer' },
          { left: 'Data quality & governance', right: 'Chief Data Officer' },
        ],
        explanation: 'Different stakeholders care about different value dimensions. CMOs want ROI, CTOs want architecture and compliance, CS leaders want health visibility, CROs want revenue, and CDOs want data quality. Always tailor your pitch to the persona.',
      },
      {
        type: 'scenario',
        id: 'se4',
        scenario: 'During a discovery call with a large media company, the Head of Ad Tech says: "We already have a DMP — BlueKai. We don\'t need another data platform. What does Zeotap do that our DMP can\'t?"',
        question: 'What is the best response?',
        options: [
          'DMPs are dead — they should switch immediately',
          'Explain that DMPs and CDPs solve different problems: DMPs rely on third-party cookies (which are deprecated), while CDPs build persistent first-party profiles. Zeotap can actually enhance their DMP by feeding it richer, consented first-party segments',
          'Suggest they keep BlueKai and don\'t need Zeotap',
          'Focus on pricing differences between DMPs and CDPs',
        ],
        correct: 1,
        explanation: 'Never trash a customer\'s existing investment. Instead, position Zeotap as complementary: CDPs solve the first-party data challenge that DMPs can\'t, especially post-cookie. Zeotap can feed richer segments INTO their DMP, making both more valuable.',
      },
      {
        type: 'mc',
        id: 'se5',
        text: 'What is Zeotap\'s core differentiator vs. Segment (Twilio)?',
        options: [
          'More programming language SDKs',
          'Identity resolution with deterministic + probabilistic matching, EU-first privacy architecture, and enterprise-grade data governance',
          'Lower pricing across all tiers',
          'Better documentation',
        ],
        correct: 1,
        explanation: 'While Segment excels at event collection, Zeotap differentiates with deep identity resolution (UCID with deterministic + probabilistic matching), EU-first GDPR compliance architecture, and enterprise data governance — critical for regulated industries.',
      },
      {
        type: 'scenario',
        id: 'se6',
        scenario: 'You\'re in the final stages of a deal with a major German bank. During the security review, their CISO asks: "Where does our customer data reside? Can you guarantee it stays within the EU? What about sub-processors?"',
        question: 'What is the best response?',
        options: [
          'Tell them data is stored globally for performance reasons',
          'Confirm EU data residency on GCP Frankfurt/Netherlands, explain Zeotap\'s EU-first architecture, provide the sub-processor list, and offer to walk through the DPIA together',
          'Say you\'ll need to check with engineering and get back to them',
          'Redirect the conversation back to product features',
        ],
        correct: 1,
        explanation: 'For regulated EU customers, data residency is a deal-breaker. Zeotap\'s EU-first architecture means data stays in EU GCP regions. Always be ready with: data residency details, sub-processor list, DPIA documentation, and certification details (ISO 27001, SOC2).',
        hint: 'German banks are among the most privacy-conscious customers in the world.',
      },
      {
        type: 'ordering',
        id: 'se7',
        text: 'Put the steps for building a compelling business case in the correct order:',
        items: ['Calculate projected ROI with customer\'s own metrics', 'Present mutual action plan with timeline', 'Quantify the cost of the current problem', 'Identify the customer\'s top 3 business pain points', 'Map Zeotap capabilities to each pain point', 'Gather benchmark data from similar customer case studies'],
        correctOrder: ['Identify the customer\'s top 3 business pain points', 'Quantify the cost of the current problem', 'Map Zeotap capabilities to each pain point', 'Gather benchmark data from similar customer case studies', 'Calculate projected ROI with customer\'s own metrics', 'Present mutual action plan with timeline'],
        explanation: 'A strong business case starts with the customer\'s pain (not your product), quantifies what it costs them, maps solutions, backs it up with proof points, projects ROI in their terms, and closes with a clear path forward.',
      },
      {
        type: 'matching',
        id: 'se8',
        text: 'Match each industry vertical to the lead case study metric that resonates most:',
        pairs: [
          { left: 'Retail / E-commerce', right: '35% increase in repeat purchase rate' },
          { left: 'Financial Services', right: '60% reduction in customer acquisition cost' },
          { left: 'Telecommunications', right: '25% decrease in churn rate' },
          { left: 'Media & Publishing', right: '40% uplift in ad revenue per user' },
        ],
        explanation: 'Each vertical has different KPIs. Retail cares about repeat purchases, finance about CAC, telco about churn, and media about ARPU. Always lead with the metric that matches the prospect\'s industry.',
      },
    ],
  },
  {
    id: 'identity-data-architecture-scenario',
    title: 'Identity & Data Architecture — Scenario Challenge',
    description: 'Deep technical scenarios: identity resolution, system design, and troubleshooting',
    passScore: 70,
    icon: '🛡️',
    color: '#8b5cf6',
    questions: [
      {
        type: 'scenario',
        id: 'ida1',
        scenario: 'A customer\'s identity graph has developed a "super cluster" — a single UCID that has merged over 50,000 individual profiles. Investigation shows that a shared corporate email domain (company@shared-inbox.com) was used as a deterministic matching key, causing massive false merges.',
        question: 'What is the correct diagnosis and fix?',
        options: [
          'Delete the entire identity graph and start over',
          'Increase server memory to handle the large cluster',
          'Add the shared email to a blocklist, implement cardinality checks that flag identifiers linking more than N profiles, and run a graph re-computation to split the super cluster',
          'Tell the customer to stop using shared email addresses',
        ],
        correct: 2,
        explanation: 'Super clusters occur when a single identifier (often a shared/generic email) creates false links. The fix involves: 1) blocklisting the offending identifier, 2) adding cardinality thresholds (e.g., any email linking >100 profiles is suspicious), and 3) re-computing the graph. Prevention > cure — always validate identifier quality.',
        hint: 'Think about what caused the problem and how to prevent it from recurring.',
      },
      {
        type: 'ordering',
        id: 'ida2',
        text: 'Put the identity resolution pipeline steps in the correct order:',
        items: ['Probabilistic matching (ML-based similarity)', 'UCID assignment & graph update', 'Raw identifier ingestion', 'Graph consistency validation', 'Identifier normalization (lowercase, trim, hash)', 'Deterministic matching (exact match on hashed email/phone)', 'Transitive closure computation'],
        correctOrder: ['Raw identifier ingestion', 'Identifier normalization (lowercase, trim, hash)', 'Deterministic matching (exact match on hashed email/phone)', 'Probabilistic matching (ML-based similarity)', 'Transitive closure computation', 'UCID assignment & graph update', 'Graph consistency validation'],
        explanation: 'Identity resolution follows: ingest raw IDs → normalize (consistent format) → deterministic match (exact) → probabilistic match (ML) → transitive closure (if A=B and B=C then A=C) → assign UCID → validate graph integrity.',
      },
      {
        type: 'matching',
        id: 'ida3',
        text: 'Match each storage technology to its primary use case in Zeotap\'s architecture:',
        pairs: [
          { left: 'Cloud Bigtable', right: 'Real-time profile lookups (low-latency key-value)' },
          { left: 'BigQuery', right: 'Analytics, reporting, and ad-hoc queries' },
          { left: 'Delta Lake on GCS', right: 'Profile store with ACID transactions' },
          { left: 'Cloud Memorystore (Redis)', right: 'Session caching and rate limiting' },
          { left: 'Apache Kafka', right: 'Real-time event streaming between services' },
        ],
        explanation: 'Each storage layer is optimized for different access patterns: Bigtable for millisecond key-value lookups, BigQuery for analytical queries, Delta Lake for transactional profile storage, Redis for caching, and Kafka for event streaming.',
      },
      {
        type: 'mc',
        id: 'ida4',
        text: 'What is the Kappa architecture, and why is it relevant to Zeotap\'s design?',
        options: [
          'A security framework for encrypting data at rest',
          'A data architecture that uses a single stream-processing layer for both real-time and batch workloads, simplifying the pipeline compared to Lambda architecture',
          'A database indexing strategy for faster queries',
          'A microservices deployment pattern using Kubernetes',
        ],
        correct: 1,
        explanation: 'Kappa architecture simplifies data processing by treating everything as a stream. Unlike Lambda (separate batch + stream layers), Kappa uses one stream layer for both. Zeotap leverages stream-first design with Kafka at its core, reducing complexity.',
      },
      {
        type: 'scenario',
        id: 'ida5',
        scenario: 'A prospective customer currently runs identity resolution on a JanusGraph-based system. They\'re experiencing slow query times (>500ms for profile lookups), difficulty scaling beyond 100M profiles, and high operational overhead. They want to migrate to Zeotap.',
        question: 'What migration approach should you recommend?',
        options: [
          'Do a big-bang migration — shut down JanusGraph and import everything at once',
          'Propose a parallel-run migration: ingest new data into Zeotap while keeping JanusGraph active, validate identity match rates are equal or better, then gradually cut over with a rollback plan',
          'Tell them to keep JanusGraph and just use Zeotap for activation',
          'Suggest they upgrade their JanusGraph cluster instead',
        ],
        correct: 1,
        explanation: 'Identity system migrations are high-risk. A parallel-run approach lets you: 1) validate Zeotap\'s match rates against JanusGraph, 2) catch edge cases before cutover, 3) maintain a rollback path. Never do big-bang migrations for identity systems — the blast radius is too large.',
        hint: 'What happens if the migration has problems? How do you minimize risk?',
      },
      {
        type: 'mc',
        id: 'ida6',
        text: 'What does UCID stand for, and what makes it architecturally unique?',
        options: [
          'Universal Customer ID — it\'s a random UUID assigned to each event',
          'Unified Customer Identity — a persistent, cross-device identifier that merges deterministic and probabilistic signals into one graph node per real person',
          'User Channel Identification — it tracks which channel a user came from',
          'Unique Campaign Identifier — it links campaigns to conversions',
        ],
        correct: 1,
        explanation: 'UCID (Unified Customer Identity) is the cornerstone of Zeotap\'s identity system. Unlike simple UUIDs, a UCID represents a real person by merging all their identifiers (emails, phones, device IDs, cookies) using both deterministic and probabilistic matching into a single persistent graph node.',
      },
      {
        type: 'matching',
        id: 'ida7',
        text: 'Match each Zeotap service to the primary programming language it\'s built with:',
        pairs: [
          { left: 'Data ingestion pipelines (CDAP)', right: 'Java' },
          { left: 'ML model training (Vertex AI)', right: 'Python' },
          { left: 'Real-time APIs & microservices', right: 'Go / Kotlin' },
          { left: 'Web SDK', right: 'TypeScript' },
          { left: 'Internal tooling & dashboards', right: 'TypeScript (React)' },
        ],
        explanation: 'Zeotap uses the right language for each job: Java for heavy data processing (CDAP/Beam), Python for ML, Go/Kotlin for high-performance APIs, and TypeScript for SDKs and internal tooling.',
      },
      {
        type: 'scenario',
        id: 'ida8',
        scenario: 'A batch ingestion job for a telecom customer (processing 50M daily records) has been failing silently for the past 3 days. No alerts fired. The customer noticed because their audience sizes stopped growing. Investigation reveals the CDAP pipeline is running but writing 0 records to the output.',
        question: 'What are the correct troubleshooting steps?',
        options: [
          'Restart the CDAP pipeline and hope it fixes itself',
          'Check pipeline logs for schema changes or data quality issues in the source, verify the source file format hasn\'t changed, review the CDAP pipeline\'s error-handling config (it may be swallowing errors), fix the alerting gap, and reprocess the 3 days of missed data',
          'Delete the pipeline and recreate it from scratch',
          'Ask the customer to resend all their data',
        ],
        correct: 1,
        explanation: 'Silent failures are the most dangerous. The systematic approach: 1) Check logs for schema drift or source format changes (most common cause), 2) Review error-handling config (pipelines that swallow errors are a common anti-pattern), 3) Fix the alerting gap (zero-output should always trigger an alert), 4) Reprocess missed data. Prevention: add output-volume alerts.',
        hint: 'The pipeline is running but producing 0 records — what kind of error would cause that?',
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
      { id: 'be7', text: 'What is "identity resolution" in the context of a CDP?', options: ['Verifying a user\'s government ID', 'The process of linking multiple identifiers (email, phone, device ID, cookies) to a single person across channels and devices', 'Resetting forgotten passwords', 'Encrypting user data for compliance'], correct: 1, explanation: 'Identity resolution connects all of a person\'s identifiers into one unified profile — so the "you" who browses on your phone, buys on your laptop, and visits a store is recognized as one person.' },
      { id: 'be8', text: 'Why is first-party data becoming more important?', options: ['It\'s cheaper to collect', 'Third-party cookies are being deprecated by browsers, making first-party data (collected directly from your customers) the most reliable and privacy-compliant foundation for marketing', 'First-party data is less accurate', 'Regulators require only first-party data'], correct: 1, explanation: 'With Chrome, Safari, and Firefox phasing out third-party cookies, businesses can no longer rely on borrowed data. First-party data — collected directly with consent — is more accurate, privacy-safe, and sustainable.' },
      { id: 'be9', text: 'What does "activation" mean in the Zeotap context?', options: ['Turning on a new account', 'Sending unified audience segments to downstream destinations like ad platforms, email tools, and CRMs for marketing execution', 'Activating a software license', 'Starting a data pipeline'], correct: 1, explanation: 'Activation is the "last mile" — taking the audiences you\'ve built from unified profiles and pushing them to the platforms where marketing happens (Google Ads, Facebook, Salesforce, etc.).' },
      { id: 'be10', text: 'What is the "composable CDP" trend and how does Zeotap relate to it?', options: ['A CDP built from LEGO blocks', 'An architecture where CDP capabilities run on top of the customer\'s existing data warehouse (Snowflake/BigQuery), and Zeotap supports this through flexible integration patterns', 'A CDP that only works with one cloud provider', 'A cheaper version of a traditional CDP'], correct: 1, explanation: 'Composable CDPs let customers keep data in their own warehouse while adding CDP capabilities on top. Zeotap supports both traditional (data comes to Zeotap) and composable (Zeotap goes to the data) approaches.' },
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
      { id: 'q1_9', text: 'What is the role of GKE (Google Kubernetes Engine) in Zeotap\'s infrastructure?', options: ['It stores customer profiles', 'It orchestrates containerized microservices, handles auto-scaling, and manages deployments across Zeotap\'s services', 'It runs SQL queries', 'It manages user authentication'], correct: 1, explanation: 'GKE runs Zeotap\'s microservices in containers, providing auto-scaling during traffic spikes, rolling deployments for zero-downtime updates, and resource isolation between services.' },
      { id: 'q1_10', text: 'What is the difference between deterministic and probabilistic identity matching?', options: ['Deterministic is faster; probabilistic is slower', 'Deterministic uses exact matches on known identifiers (hashed email/phone); probabilistic uses ML models to find likely matches based on behavioral and contextual signals', 'They are the same thing with different names', 'Deterministic only works offline; probabilistic only works online'], correct: 1, explanation: 'Deterministic matching is high-precision (exact match on hashed email, phone, login ID). Probabilistic matching uses ML to link identifiers that are likely the same person based on behavior, device, timing, and other signals — higher recall but lower precision.' },
      { id: 'q1_11', text: 'What role does Apache Beam play in Zeotap\'s data processing?', options: ['It handles user authentication', 'It provides a unified programming model for both batch and streaming ETL pipelines, running on Google Cloud Dataflow', 'It stores data in the profile store', 'It serves the web dashboard'], correct: 1, explanation: 'Apache Beam provides a unified API for writing both batch and streaming data pipelines. Zeotap runs Beam pipelines on Cloud Dataflow for ETL tasks like data cleaning, transformation, and enrichment.' },
      { id: 'q1_12', text: 'Why does Zeotap use event-driven architecture (EDA)?', options: ['It\'s cheaper than other architectures', 'It enables real-time processing, loose coupling between services, and natural scalability — events trigger downstream actions without tight service dependencies', 'It\'s required by GDPR', 'It only works for small data volumes'], correct: 1, explanation: 'Event-driven architecture means services communicate through events (via Kafka). This provides: real-time processing (react to events as they happen), loose coupling (services don\'t depend directly on each other), and natural scalability (add consumers as load grows).' },
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
      { id: 'q2_7', text: 'How does Zeotap\'s consent management work with GDPR requirements?', options: ['Consent is optional and not enforced', 'Consent signals are captured at the event level, stored as profile attributes, and enforced at activation — only consented profiles are sent to destinations', 'Consent is managed entirely by the customer outside Zeotap', 'GDPR only applies to email marketing'], correct: 1, explanation: 'Zeotap captures consent at the event level (e.g., opted-in for marketing), stores it on profiles, and enforces it during activation. This means audiences sent to ad platforms only include users who consented — GDPR compliance is built into the data flow, not bolted on.' },
      { id: 'q2_8', text: 'What is the purpose of Zeotap\'s "Profile Explorer"?', options: ['A tool for browsing social media profiles', 'A UI that lets users search for and inspect individual unified profiles, showing all linked identifiers, attributes, events, and segment memberships', 'A reporting dashboard', 'A data export tool'], correct: 1, explanation: 'Profile Explorer is a diagnostic and visualization tool: search by email/phone/UCID, see all linked identifiers, browse attributes and event history, and verify segment membership. Essential for debugging and demonstrating identity resolution quality.' },
      { id: 'q2_9', text: 'What triggers can be used to start a customer journey in Journey Canvas?', options: ['Only manual triggers', 'Segment entry/exit events, real-time behavioral events, time-based schedules, API triggers, or combinations of multiple trigger types', 'Only daily batch schedules', 'Only when a user creates an account'], correct: 2, explanation: 'Journey Canvas supports flexible triggers: segment-based (user joins "high-value" segment), event-based (user abandons cart), time-based (every Monday at 9am), API-triggered (external system call), or compound triggers combining multiple conditions.' },
      { id: 'q2_10', text: 'How does Zeotap handle real-time vs. batch audience evaluation?', options: ['Only batch — audiences update once daily', 'Real-time evaluation for streaming events (immediate segment membership updates) and batch re-computation for historical backfills and complex aggregate conditions', 'Only real-time — no batch processing exists', 'Customers must choose one mode and cannot use both'], correct: 1, explanation: 'Zeotap uses a hybrid approach: streaming events trigger immediate segment re-evaluation (user buys → instantly joins "purchasers" segment), while batch jobs handle historical backfills and complex aggregations (users with >5 purchases in the last 90 days).' },
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
  {
    id: 'sales-competitive-quiz',
    title: 'Sales & Competitive Knowledge — Knowledge Check',
    description: 'Test your sales readiness: positioning, objection handling, and competitive awareness',
    passScore: 70,
    questions: [
      { id: 'sc1', text: 'What is the key difference between a CDP and a DMP?', options: ['CDPs are more expensive than DMPs', 'CDPs build persistent first-party profiles; DMPs historically relied on third-party cookies for temporary audience segments', 'DMPs support more integrations than CDPs', 'There is no meaningful difference — they solve the same problem'], correct: 1, explanation: 'CDPs collect and unify first-party data into persistent profiles. DMPs were designed for third-party cookie-based audience targeting — a model becoming obsolete with cookie deprecation.' },
      { id: 'sc2', text: 'How does a CDP differ from a CRM?', options: ['A CRM replaces a CDP entirely', 'CRMs manage known-customer relationships and sales pipelines; CDPs unify all customer data (known + anonymous) for marketing activation', 'CDPs are just CRMs with better dashboards', 'CRMs handle more data volume than CDPs'], correct: 1, explanation: 'CRMs (like Salesforce) manage known customer relationships. CDPs unify ALL customer data — including anonymous visitors, behavioral events, and offline data — into unified profiles for activation.' },
      { id: 'sc3', text: 'When positioning Zeotap against Segment, which advantage should you lead with for a European bank?', options: ['Zeotap has more SDKs', 'EU-first architecture with data residency guarantees, GDPR-native consent management, and enterprise identity resolution', 'Zeotap is cheaper', 'Zeotap has a better UI'], correct: 1, explanation: 'For regulated EU customers, lead with what matters most: EU data residency (GCP Frankfurt), GDPR-native architecture (not retrofitted), and enterprise-grade identity resolution. These are table-stakes requirements that differentiate Zeotap from US-first competitors.' },
      { id: 'sc4', text: 'What is Zeotap\'s primary value proposition for the retail vertical?', options: ['Cheapest CDP for small retailers', 'Unified customer profiles across online/offline channels enabling personalized campaigns, with proven 35%+ repeat purchase uplift', 'Only works for fashion retailers', 'Primarily a loyalty program platform'], correct: 1, explanation: 'Retail customers care about unifying online and offline customer data to drive personalization and repeat purchases. Lead with proven metrics from case studies.' },
      { id: 'sc5', text: 'A prospect asks about ROI. Which metric matters most for a telecommunications customer?', options: ['Website traffic increase', 'Churn reduction — typically 20-25% decrease in voluntary churn through predictive modeling and targeted retention campaigns', 'Number of data sources connected', 'Dashboard load time improvement'], correct: 1, explanation: 'Telco companies lose billions to churn. A 20-25% churn reduction translates directly to revenue retention. Always quantify ROI in the customer\'s core business metric.' },
      { id: 'sc6', text: 'What is the best first question in a CDP discovery call?', options: ['"What\'s your budget?"', '"What customer data challenges are preventing you from hitting your business goals?"', '"How many users do you have?"', '"Which CDP vendors have you evaluated?"'], correct: 1, explanation: 'Great discovery starts with pain, not product. Understanding what business goals are blocked by data challenges lets you position Zeotap as the solution to their specific problems.' },
      { id: 'sc7', text: 'During a demo, when should you show the Audience Builder?', options: ['First — it\'s the most impressive feature', 'After showing data ingestion, identity resolution, and the unified profile — so the audience understands the data foundation', 'Never — it\'s too complex for demos', 'Only if the customer specifically asks'], correct: 1, explanation: 'The Audience Builder is powerful but meaningless without context. Show the data journey first (ingestion → identity → profiles) so the audience understands WHY the segments are accurate.' },
      { id: 'sc8', text: 'A prospect says: "We tried a CDP before and it failed." What is the best response?', options: ['Say Zeotap is different and move on', 'Acknowledge their experience, ask what went wrong specifically, then explain how Zeotap\'s approach addresses those failure points with concrete examples', 'Blame their previous vendor', 'Offer a free trial to prove it works'], correct: 1, explanation: 'Past CDP failure is a common objection. Listen first — most failures come from poor implementation, lack of use cases, or data quality issues. Then show how Zeotap\'s guided onboarding, pre-built use cases, and data quality tools prevent those same failures.' },
      { id: 'sc9', text: 'Which case study metric should you lead with for a media & publishing prospect?', options: ['Cost savings on infrastructure', '40% uplift in ad revenue per user through better audience segmentation and addressability', 'Faster data loading times', 'Reduced headcount in the data team'], correct: 1, explanation: 'Media companies monetize through advertising. A 40% ARPU uplift through better segmentation and addressability directly ties to their revenue model.' },
      { id: 'sc10', text: 'How should you position Zeotap\'s pricing model?', options: ['Always lead with the cheapest option', 'Position as value-based: tie pricing to expected ROI, emphasize total cost of ownership vs. build alternatives, and offer modular packaging that scales with usage', 'Avoid discussing pricing until the contract stage', 'Match whatever the competitor quoted'], correct: 1, explanation: 'Value-based positioning means connecting price to expected business outcomes. A €200K annual contract that delivers €2M in churn reduction is a 10x ROI. Frame pricing in terms of value delivered, not cost incurred.' },
    ],
  },
  {
    id: 'customer-success-knowledge-quiz',
    title: 'Customer Success Knowledge — Knowledge Check',
    description: 'Test your CS readiness: health scores, escalation, renewal, and expansion',
    passScore: 70,
    questions: [
      { id: 'csk1', text: 'What are the key components of a customer health score?', options: ['Only NPS survey results', 'Product usage (DAU/MAU), support ticket volume and severity, feature adoption breadth, executive engagement, and contract growth trajectory', 'Only login frequency', 'Only revenue size'], correct: 1, explanation: 'A robust health score combines multiple signals: usage metrics (are they active?), support patterns (are they struggling?), feature adoption (are they getting value?), executive engagement (do champions exist?), and growth trajectory (are they expanding?).' },
      { id: 'csk2', text: 'What defines a P1 (Severity 1) escalation?', options: ['Any customer complaint', 'Complete production outage affecting the customer\'s live campaigns or data ingestion, with no workaround available — requires response within 1 hour', 'A feature request from a large customer', 'A billing dispute'], correct: 1, explanation: 'P1 = production down, no workaround. Response within 1 hour, all-hands until resolved. P2 = major feature broken with workaround. P3 = minor issue. P4 = cosmetic or enhancement request.' },
      { id: 'csk3', text: 'How should a Quarterly Business Review (QBR) be structured?', options: ['Just show product usage dashboards', 'Review outcomes vs. goals, showcase ROI achieved, present usage insights, align on next quarter\'s strategic priorities, and identify expansion opportunities', 'Only discuss open support tickets', 'Ask the customer what they want to talk about with no preparation'], correct: 1, explanation: 'Effective QBRs are strategic, not tactical. Review what was accomplished, prove ROI, show insights they haven\'t seen, align on what\'s next, and plant seeds for expansion. Always send a pre-read and follow up with action items.' },
      { id: 'csk4', text: 'When should renewal conversations begin relative to the contract end date?', options: ['1 week before expiry', '120 days before expiry — allowing time for procurement, legal review, and negotiation', 'The day the contract expires', 'Only when the customer asks about renewal'], correct: 1, explanation: 'Enterprise renewals take 60-120 days through procurement and legal. Starting at T-120 days gives time for: value review, pricing negotiation, legal redlines, and internal approvals. Late starts risk gaps in service.' },
      { id: 'csk5', text: 'Which of these is the strongest signal for an expansion opportunity?', options: ['The customer complains about missing features', 'The customer has saturated their current use case, is asking about additional modules (e.g., Journey Canvas), and new stakeholders from other departments are joining meetings', 'The customer\'s contract is about to expire', 'The customer submitted a support ticket'], correct: 1, explanation: 'Expansion signals include: use case saturation (they\'ve mastered what they have), curiosity about additional modules, new stakeholders appearing (cross-departmental interest), and increasing data volume. These indicate the customer is ready to grow.' },
      { id: 'csk6', text: 'What is the earliest warning sign of potential churn?', options: ['The customer cancels their contract', 'Declining login frequency, reduced event volumes, champion leaves the company, or the customer stops attending scheduled check-ins', 'The customer asks for a discount', 'The customer files a support ticket'], correct: 1, explanation: 'Churn rarely happens suddenly. Early warnings: usage drops (fewer logins, lower event volumes), champion departure, ghosting on meetings, and reduced feature adoption. Act on these signals 90+ days before renewal.' },
      { id: 'csk7', text: 'A customer\'s Facebook Ads integration shows "OAuth token expired." What should you do?', options: ['Create a Jira ticket and wait for engineering', 'Guide the customer to re-authenticate the connection in the Destinations page, verify the sync resumes, then set up a monitoring alert for future OAuth expirations', 'Tell the customer it\'s Facebook\'s fault', 'Suggest they switch to a different ad platform'], correct: 1, explanation: 'OAuth token expiry is a common, quick-fix issue. Re-authenticate immediately, verify data flows, and set up proactive monitoring. Don\'t let simple issues become escalations by waiting for engineering.' },
      { id: 'csk8', text: 'What are the key milestones in customer onboarding?', options: ['Just send them the documentation', 'Kickoff call → data source connection (Week 1-2) → first unified profiles (Week 3-4) → first audience built (Week 4-6) → first activation sent (Week 6-8) → value realization review (Week 10-12)', 'Wait for the customer to figure it out', 'Only the contract signing matters'], correct: 1, explanation: 'Structured onboarding with clear milestones ensures time-to-value. Each milestone builds on the last, and tracking progress helps identify blockers early. The goal is first value realization within 90 days.' },
      { id: 'csk9', text: 'Your champion at a key account just left the company. What should you do?', options: ['Wait for the new person to reach out', 'Immediately reach out to remaining contacts, request an introduction to the successor, offer a re-onboarding session, and escalate internally to ensure executive alignment', 'Remove the account from your portfolio', 'Do nothing — the contract is still active'], correct: 1, explanation: 'Champion loss is a critical churn risk. Act immediately: leverage existing relationships to connect with the successor, offer to re-demonstrate value, and engage your executive sponsor for a leadership-level touchpoint. Don\'t wait — the first 30 days after champion loss are crucial.' },
      { id: 'csk10', text: 'What is Net Dollar Retention (NDR) and what target should a healthy CS team aim for?', options: ['NDR measures new logo acquisition — target is 50%', 'NDR measures revenue retention + expansion from existing customers. A target of 110-120%+ means existing customers are growing faster than any churn', 'NDR is the same as gross revenue — target is 100%', 'NDR only measures churn — lower is better'], correct: 1, explanation: 'NDR = (starting revenue + expansions + upsells - churn - contractions) / starting revenue. NDR >100% means your existing customer base is growing. Top SaaS companies target 110-130%. It\'s the single most important CS metric.' },
    ],
  },
  {
    id: 'tam-technical-operations-quiz',
    title: 'TAM & Technical Operations — Knowledge Check',
    description: 'Test your technical account management knowledge: architecture, data quality, and advanced use cases',
    passScore: 70,
    questions: [
      { id: 'tam1', text: 'What are the key dimensions of data quality that a TAM should monitor?', options: ['Only data volume', 'Completeness (missing fields), accuracy (correct values), consistency (no conflicts), timeliness (freshness), and uniqueness (no duplicates)', 'Only whether data loads without errors', 'Only the number of data sources connected'], correct: 1, explanation: 'Data quality has five key dimensions: completeness (are required fields populated?), accuracy (are values correct?), consistency (do records agree across sources?), timeliness (is data fresh?), and uniqueness (are duplicates managed?). TAMs should proactively monitor all five.' },
      { id: 'tam2', text: 'When should a TAM recommend a "warehouse-first" architecture vs. a "CDP-first" approach?', options: ['Always recommend CDP-first', 'Warehouse-first when the customer has a mature Snowflake/BigQuery setup with strong data engineering; CDP-first when they need faster time-to-value and lack data infrastructure', 'Always recommend warehouse-first', 'The architecture doesn\'t matter'], correct: 1, explanation: 'Warehouse-first (Composable CDP) works when customers have mature data infrastructure and want to keep data in their warehouse. CDP-first works when speed-to-value matters and the customer lacks data engineering maturity. TAMs must assess the customer\'s technical maturity to recommend the right approach.' },
      { id: 'tam3', text: 'What is the correct methodology for a value engineering engagement?', options: ['Just show product features and hope they see value', 'Baseline current metrics → identify improvement opportunities → model projected impact → implement and measure → iterate and optimize', 'Only measure ROI after the contract is signed', 'Let the customer define their own success metrics without guidance'], correct: 1, explanation: 'Value engineering follows a disciplined methodology: establish baselines (what are current numbers?), identify gaps (where can Zeotap help?), model impact (what\'s the projected improvement?), implement (execute the plan), and measure (prove the value). This creates a continuous improvement loop.' },
      { id: 'tam4', text: 'What are the phases of a technical onboarding?', options: ['Just hand over API keys and documentation', 'Discovery & architecture review → data source mapping & integration → identity configuration & validation → use case implementation → testing & QA → production rollout & monitoring', 'Only the SDK installation matters', 'Start with activation and work backwards'], correct: 1, explanation: 'Technical onboarding must be methodical: understand their architecture first, then map and connect data, configure identity resolution, implement specific use cases, thoroughly test, and finally go live with monitoring. Skipping steps leads to production issues.' },
      { id: 'tam5', text: 'How should accounts be tiered for TAM engagement?', options: ['All accounts get the same level of attention', 'Tier based on ARR, strategic value, and growth potential: Tier 1 (strategic) gets dedicated TAM with weekly touchpoints, Tier 2 (growth) gets bi-weekly, Tier 3 (standard) gets monthly and scaled programs', 'Only engage with accounts that file support tickets', 'Tier only by company size'], correct: 1, explanation: 'Account tiering ensures the right level of investment. Tier 1 accounts (high ARR + strategic) get white-glove service. Tier 2 (growth potential) get regular engagement. Tier 3 get efficient, scaled programs. Tiering should consider ARR, logo value, expansion potential, and strategic importance.' },
      { id: 'tam6', text: 'What is a "data clean room" and why is it relevant to Zeotap customers?', options: ['A physical room where servers are stored', 'A privacy-preserving environment where multiple parties can match and analyze combined datasets without either party seeing the other\'s raw data — critical for post-cookie advertising collaboration', 'A data backup strategy', 'A dashboard for monitoring data quality'], correct: 1, explanation: 'Data clean rooms enable privacy-safe collaboration: a retailer and a media company can match audiences and measure campaign impact without sharing raw PII. As cookies deprecate, clean rooms are becoming essential for advertising measurement and audience enrichment.' },
      { id: 'tam7', text: 'What is the purpose of Zeotap\'s SignalSmith tool?', options: ['A general-purpose database query tool', 'A signal processing and feature engineering tool that helps create derived attributes, behavioral scores, and predictive features from raw event data', 'An email marketing automation tool', 'A project management dashboard'], correct: 1, explanation: 'SignalSmith transforms raw events into actionable signals: behavioral scores (engagement level), derived attributes (customer lifetime value), and predictive features (churn probability). It bridges the gap between raw data and actionable intelligence.' },
      { id: 'tam8', text: 'What are Ada AI\'s key capabilities beyond natural language segmentation?', options: ['Ada only does segment creation', 'Natural language segmentation, campaign performance insights, anomaly detection and alerting, data quality recommendations, and predictive audience suggestions', 'Ada is only a chatbot for support tickets', 'Ada only generates reports'], correct: 1, explanation: 'Ada is more than a segment builder. It provides: NL-to-segment translation, performance insights (why did this campaign work?), anomaly detection (usage dropped 30% — here\'s why), data quality suggestions (these fields have low fill rates), and predictive recommendations (audiences likely to convert).' },
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
          {SCENARIO_QUIZZES.map((quiz) => {
            const IconComponent = quiz.icon === '🔄' ? Workflow : quiz.icon === '🎯' ? Target : quiz.icon === '🛡️' ? Shield : Handshake;
            return (
              <Card key={quiz.id} hover>
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${quiz.color}15` }}
                  >
                    <IconComponent size={22} style={{ color: quiz.color }} strokeWidth={2} />
                  </div>
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
            );
          })}
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
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-brand-blue/10">
                  <ClipboardCheck size={22} className="text-brand-blue" strokeWidth={2} />
                </div>
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
