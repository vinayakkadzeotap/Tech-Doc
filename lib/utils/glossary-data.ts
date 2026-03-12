export type GlossaryCategory =
  | 'identity'
  | 'data'
  | 'ai-ml'
  | 'infrastructure'
  | 'privacy'
  | 'activation'
  | 'general';

export interface GlossaryTerm {
  term: string;
  definition: string;
  category: GlossaryCategory;
  relatedTerms?: string[];
}

export const GLOSSARY_CATEGORIES: Record<GlossaryCategory, { label: string; color: string }> = {
  identity: { label: 'Identity', color: '#8b5cf6' },
  data: { label: 'Data', color: '#3b82f6' },
  'ai-ml': { label: 'AI & ML', color: '#10b981' },
  infrastructure: { label: 'Infrastructure', color: '#f59e0b' },
  privacy: { label: 'Privacy', color: '#ef4444' },
  activation: { label: 'Activation', color: '#ec4899' },
  general: { label: 'General', color: '#6b7280' },
};

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  { term: 'Ada', definition: "Zeotap's official AI copilot, embedded across the platform (Audience Builder, Data Catalogue, Journey Canvas). Uses RAG + Vertex AI LLMs for natural language segmentation and contextual AI assistance.", category: 'ai-ml', relatedTerms: ['RAG', 'Vertex AI', 'MCP'] },
  { term: 'UCID', definition: "Unified Customer Identity — Zeotap's core identity concept. A single persistent ID that unifies all cross-device, cross-channel identifiers for one person.", category: 'identity', relatedTerms: ['ID+', 'Identity Graph', 'Customer 360'] },
  { term: 'ID+', definition: "Zeotap's universal identity solution powered by ~50 billion deterministic IDs. Enables cross-device and cross-channel identity resolution at scale using Aerospike and Scylla.", category: 'identity', relatedTerms: ['UCID', 'Identity Graph', 'MAID', 'Aerospike', 'Scylla'] },
  { term: 'CDP', definition: 'Customer Data Platform — A system that creates a persistent, unified customer database accessible to other systems for marketing, analytics, and operations.', category: 'general', relatedTerms: ['DMP', 'Customer 360', 'Integr8'] },
  { term: 'Integr8', definition: "Zeotap's connector builder for setting up data sources and destinations. Provides 150+ pre-built integrations across advertising, CRM, email, and analytics platforms.", category: 'data' },
  { term: 'Zeotap Fuel', definition: 'Third-party data enrichment service that fills gaps in first-party customer profiles using NCE (non-customer entity) data to enhance targeting and personalization.', category: 'data' },
  { term: 'NCE Data', definition: 'Non-Customer Entity data — Third-party data used by Zeotap Fuel to enrich customer profiles with additional attributes beyond first-party data.', category: 'data' },
  { term: 'Calculated Attributes', definition: 'Derived fields computed from raw data in the Unify module. Allows creation of new profile attributes from existing data (e.g., total spend, days since last purchase).', category: 'data' },
  { term: 'Champion Segments', definition: '2,500+ pre-built audience templates available in the Segment module. Provide starting points for common segmentation use cases across verticals.', category: 'activation' },
  { term: 'Customer 360', definition: 'A complete, unified view of a customer within the Protect module. Shows identity, attributes, events, audiences, and consent status in one place.', category: 'identity', relatedTerms: ['UCID', 'CDP', 'Calculated Attributes'] },
  { term: 'SmartPixel', definition: "Zeotap's real-time web personalization engine. A JavaScript tag that fetches segment membership from edge cache for <50ms client-side personalization.", category: 'activation' },
  { term: 'Delta Lake', definition: 'An open-source storage layer on top of data lakes that provides ACID transactions, schema enforcement, and time-travel. Used by Zeotap for the Profile Store with 7 Maven modules.', category: 'infrastructure', relatedTerms: ['ACID', 'BigQuery'] },
  { term: 'Apache Kafka', definition: "A distributed event streaming platform used as Zeotap's backbone for real-time data ingestion and event processing.", category: 'infrastructure' },
  { term: 'CDAP', definition: 'Cloud Data Application Platform — Used for building and orchestrating data integration pipelines with low-code configuration.', category: 'infrastructure' },
  { term: 'Apache Beam', definition: "A unified programming model for batch and streaming data processing pipelines. Used in Zeotap's ingestion layer.", category: 'infrastructure' },
  { term: 'Identity Graph', definition: 'A data structure that maps and links multiple identifiers (email, phone, device ID, cookie) belonging to the same person.', category: 'identity', relatedTerms: ['UCID', 'ID+', 'MAID'] },
  { term: 'MAID', definition: 'Mobile Advertising ID — A device-level identifier (IDFA on iOS, GAID on Android) used for mobile user identification and ad targeting.', category: 'identity', relatedTerms: ['ID+', 'Identity Graph'] },
  { term: 'GKE', definition: "Google Kubernetes Engine — The managed Kubernetes service on GCP that orchestrates all Zeotap microservices.", category: 'infrastructure' },
  { term: 'Vertex AI', definition: "Google Cloud's ML platform used by Zeotap for training and serving models including propensity scoring and Ada AI.", category: 'ai-ml', relatedTerms: ['Ada', 'Propensity Score', 'Lookalike Modeling'] },
  { term: 'RAG', definition: 'Retrieval-Augmented Generation — An AI architecture where relevant context is retrieved from a knowledge base before generating a response. Powers Ada.', category: 'ai-ml', relatedTerms: ['Ada', 'MCP', 'Vertex AI'] },
  { term: 'MCP', definition: "Model Context Protocol — A protocol used by Zeotap's agentic server for tool integration, enabling Ada to interact with platform services.", category: 'ai-ml' },
  { term: 'S2S API', definition: "Server-to-Server API — Zeotap's primary endpoint for receiving events directly from backend systems.", category: 'data' },
  { term: 'TCF 2.2', definition: "Transparency and Consent Framework v2.2 — IAB standard for consent management that Zeotap's SDK integrates with for GDPR-compliant data collection.", category: 'privacy' },
  { term: 'Segment / Audience', definition: 'A group of customer profiles that match a set of rules or conditions, used for targeted marketing activation.', category: 'activation' },
  { term: 'Journey Canvas', definition: "Zeotap's visual tool for building multi-step automated customer campaigns with triggers, conditions, and actions.", category: 'activation', relatedTerms: ['Segment / Audience', 'Champion Segments', 'SmartPixel'] },
  { term: 'ArgoCD', definition: 'A GitOps-based continuous delivery tool for Kubernetes. Zeotap uses it for automated, safe production deployments.', category: 'infrastructure' },
  { term: 'Terraform', definition: "An Infrastructure-as-Code tool used to provision and manage Zeotap's cloud infrastructure on GCP.", category: 'infrastructure' },
  { term: 'Prometheus', definition: "An open-source monitoring system for collecting and querying metrics. Core part of Zeotap's observability stack.", category: 'infrastructure' },
  { term: 'OpenTelemetry', definition: 'A vendor-neutral standard for instrumenting, generating, collecting, and exporting telemetry data (traces, metrics, logs).', category: 'infrastructure' },
  { term: 'GDPR', definition: "General Data Protection Regulation — EU regulation governing data privacy and protection that fundamentally shapes Zeotap's architecture.", category: 'privacy', relatedTerms: ['TCF 2.2', 'ISO 27701', 'ISO 27018', 'RBAC'] },
  { term: 'ISO 27018', definition: 'International standard for protecting personally identifiable information (PII) in public cloud services. Zeotap is ISO 27018 certified.', category: 'privacy' },
  { term: 'ISO 27701', definition: 'International standard for privacy information management. Extends ISO 27001/27002 for privacy. Zeotap is ISO 27701 certified.', category: 'privacy' },
  { term: 'SOC 2', definition: 'Service Organization Control 2 — An auditing standard for service organizations. Zeotap is SOC 2 Type II compliant.', category: 'privacy' },
  { term: 'Propensity Score', definition: 'An ML-generated probability that a customer will take a specific action (purchase, churn, etc.). Used for predictive targeting.', category: 'ai-ml' },
  { term: 'DMP', definition: 'Data Management Platform — An older technology that relied on third-party cookies. CDPs like Zeotap are the modern replacement.', category: 'general', relatedTerms: ['CDP'] },
  { term: 'Lookalike Modeling', definition: 'An ML technique that finds new users who share characteristics with an existing "seed" audience of known valuable customers.', category: 'ai-ml' },
  { term: 'ACID', definition: 'Atomicity, Consistency, Isolation, Durability — Properties guaranteed by Delta Lake for profile store updates.', category: 'data' },
  { term: 'SSO', definition: 'Single Sign-On — Allows enterprise users to authenticate with their corporate credentials via SAML 2.0 or OIDC through Auth0.', category: 'privacy' },
  { term: 'RBAC', definition: 'Role-Based Access Control — Permission system that restricts system access based on user roles (admin, editor, viewer).', category: 'privacy' },
  { term: 'BigQuery', definition: "Google Cloud's serverless data warehouse used by Zeotap for analytics workloads, ML model training, and ad-hoc querying.", category: 'infrastructure' },
  { term: 'Aerospike', definition: 'A high-performance NoSQL database used by Zeotap for real-time identity resolution and profile lookups at sub-millisecond latency.', category: 'infrastructure' },
  { term: 'Scylla', definition: 'A high-throughput NoSQL database compatible with Cassandra. Used alongside Aerospike for identity graph storage.', category: 'infrastructure' },
  { term: 'OIDC', definition: 'OpenID Connect — An identity layer on top of OAuth 2.0 used for authentication. Supported by Zeotap for enterprise SSO.', category: 'privacy' },
];
