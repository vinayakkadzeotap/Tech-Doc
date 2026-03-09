// ─── Zeotap Universe: Node & Edge Data ─────────────────────────────
// Hand-tuned positions form a constellation layout on a 2000×1400 canvas

export interface UniverseNode {
  id: string;
  label: string;
  description: string;
  category: CategoryId;
  x: number;
  y: number;
  radius: number;
  techStack: string[];
  relatedModules: { trackId: string; moduleId: string; title: string }[];
}

export interface UniverseEdge {
  from: string;
  to: string;
  animated: boolean;
}

export type CategoryId =
  | 'collect'
  | 'ingest'
  | 'store'
  | 'intelligence'
  | 'activate'
  | 'platform';

export interface Category {
  id: CategoryId;
  label: string;
  color: string;
}

export const CATEGORIES: Category[] = [
  { id: 'collect', label: 'Collect', color: '#38bdf8' },
  { id: 'ingest', label: 'Ingest & Process', color: '#8b5cf6' },
  { id: 'store', label: 'Store & Unify', color: '#a855f7' },
  { id: 'intelligence', label: 'Intelligence', color: '#ec4899' },
  { id: 'activate', label: 'Activate', color: '#f59e0b' },
  { id: 'platform', label: 'Platform Services', color: '#10b981' },
];

export const CATEGORY_MAP: Record<CategoryId, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c])
) as Record<CategoryId, Category>;

// ─── Nodes ─────────────────────────────────────────────────────────

export const UNIVERSE_NODES: UniverseNode[] = [
  // ── Collect (top center) ──────────────────────────────────────────
  {
    id: 'web-sdk',
    label: 'Web SDK',
    description: 'JavaScript tag for web event capture with consent management',
    category: 'collect',
    x: 880,
    y: 120,
    radius: 20,
    techStack: ['JavaScript', 'TCF 2.2'],
    relatedModules: [
      { trackId: 'engineering', moduleId: 'data-collection', title: 'Data Collection & SDKs' },
    ],
  },
  {
    id: 'mobile-sdk',
    label: 'Mobile SDK',
    description: 'Native iOS and Android SDKs for in-app event tracking',
    category: 'collect',
    x: 1050,
    y: 80,
    radius: 20,
    techStack: ['Swift', 'Kotlin'],
    relatedModules: [
      { trackId: 'engineering', moduleId: 'data-collection', title: 'Data Collection & SDKs' },
    ],
  },
  {
    id: 's2s-api',
    label: 'Server-to-Server API',
    description: 'REST & gRPC API for server-side event ingestion',
    category: 'collect',
    x: 1200,
    y: 160,
    radius: 18,
    techStack: ['REST', 'gRPC'],
    relatedModules: [
      { trackId: 'engineering', moduleId: 'data-collection', title: 'Data Collection & SDKs' },
    ],
  },
  {
    id: 'integr8',
    label: 'Integr8',
    description: '150+ pre-built connectors for batch data import',
    category: 'collect',
    x: 720,
    y: 180,
    radius: 22,
    techStack: ['CDAP', 'Batch'],
    relatedModules: [
      { trackId: 'product-mastery', moduleId: 'data-collection-ui', title: 'Setting Up Data Collection' },
    ],
  },

  // ── Ingest & Process (upper-left) ────────────────────────────────
  {
    id: 'kafka',
    label: 'Apache Kafka',
    description: 'Real-time event streaming backbone with exactly-once delivery',
    category: 'ingest',
    x: 620,
    y: 360,
    radius: 28,
    techStack: ['Apache Kafka', 'Avro', 'Schema Registry'],
    relatedModules: [
      { trackId: 'engineering', moduleId: 'data-ingestion', title: 'Data Ingestion Pipelines' },
    ],
  },
  {
    id: 'beam',
    label: 'Apache Beam',
    description: 'Unified batch & stream processing for data transformation',
    category: 'ingest',
    x: 440,
    y: 310,
    radius: 22,
    techStack: ['Beam', 'Dataflow'],
    relatedModules: [
      { trackId: 'engineering', moduleId: 'data-ingestion', title: 'Data Ingestion Pipelines' },
    ],
  },
  {
    id: 'spark',
    label: 'Apache Spark',
    description: 'Large-scale distributed data processing engine',
    category: 'ingest',
    x: 380,
    y: 450,
    radius: 24,
    techStack: ['Apache Spark', 'PySpark'],
    relatedModules: [
      { trackId: 'engineering', moduleId: 'data-ingestion', title: 'Data Ingestion Pipelines' },
    ],
  },
  {
    id: 'cdap',
    label: 'CDAP',
    description: 'Pipeline orchestration and workflow management',
    category: 'ingest',
    x: 500,
    y: 500,
    radius: 18,
    techStack: ['CDAP', 'Airflow'],
    relatedModules: [
      { trackId: 'engineering', moduleId: 'data-ingestion', title: 'Data Ingestion Pipelines' },
    ],
  },

  // ── Store & Unify (center) ────────────────────────────────────────
  {
    id: 'identity',
    label: 'Identity Graph',
    description: 'UCID resolution — deterministic & probabilistic cross-device matching',
    category: 'store',
    x: 850,
    y: 520,
    radius: 32,
    techStack: ['Aerospike', 'Scylla', 'Graph DB'],
    relatedModules: [
      { trackId: 'engineering', moduleId: 'identity-resolution', title: 'Identity Resolution' },
    ],
  },
  {
    id: 'delta-lake',
    label: 'Profile Store',
    description: 'Delta Lake — ACID-compliant golden customer profile repository',
    category: 'store',
    x: 1020,
    y: 480,
    radius: 30,
    techStack: ['Delta Lake', 'GCS', 'Parquet'],
    relatedModules: [
      { trackId: 'engineering', moduleId: 'profile-store', title: 'Profile Store' },
    ],
  },
  {
    id: 'bigquery',
    label: 'BigQuery',
    description: 'Analytics data warehouse for aggregations and reporting queries',
    category: 'store',
    x: 1150,
    y: 560,
    radius: 24,
    techStack: ['BigQuery', 'SQL'],
    relatedModules: [
      { trackId: 'engineering', moduleId: 'reporting-bi', title: 'Reporting & BI' },
    ],
  },

  // ── Intelligence (center-right) ──────────────────────────────────
  {
    id: 'audience',
    label: 'Audience Engine',
    description: 'Real-time segmentation engine — rule-based and AI-powered',
    category: 'intelligence',
    x: 1280,
    y: 420,
    radius: 28,
    techStack: ['Rules Engine', 'Streaming'],
    relatedModules: [
      { trackId: 'engineering', moduleId: 'audience-management', title: 'Audience Management' },
      { trackId: 'product-mastery', moduleId: 'audience-builder', title: 'Audience Builder' },
    ],
  },
  {
    id: 'ada',
    label: 'Ada / Zoe AI',
    description: 'AI copilot — natural language queries, RAG-powered insights',
    category: 'intelligence',
    x: 1420,
    y: 340,
    radius: 26,
    techStack: ['Vertex AI', 'RAG', 'LLM'],
    relatedModules: [
      { trackId: 'engineering', moduleId: 'genai-zoe', title: 'GenAI & Zoe Assistant' },
    ],
  },
  {
    id: 'ml',
    label: 'ML Platform',
    description: 'Propensity scoring, lookalike models, and feature store',
    category: 'intelligence',
    x: 1500,
    y: 240,
    radius: 30,
    techStack: ['Vertex AI', 'TensorFlow', 'Feature Store'],
    relatedModules: [
      { trackId: 'engineering', moduleId: 'ml-platform', title: 'ML Platform' },
    ],
  },
  {
    id: 'journeys',
    label: 'Journey Engine',
    description: 'Multi-step customer journey orchestration with real-time triggers',
    category: 'intelligence',
    x: 1350,
    y: 560,
    radius: 26,
    techStack: ['State Machine', 'Kafka'],
    relatedModules: [
      { trackId: 'engineering', moduleId: 'customer-journeys', title: 'Customer Journeys' },
      { trackId: 'product-mastery', moduleId: 'journey-canvas', title: 'Journey Canvas' },
    ],
  },

  // ── Activate (lower-right) ───────────────────────────────────────
  {
    id: 'destinations',
    label: 'Destinations',
    description: '100+ activation channels — ad platforms, email, CRM, data warehouses',
    category: 'activate',
    x: 1480,
    y: 680,
    radius: 28,
    techStack: ['APIs', 'SFTP', 'Webhooks'],
    relatedModules: [
      { trackId: 'engineering', moduleId: 'data-activation', title: 'Data Activation' },
      { trackId: 'product-mastery', moduleId: 'activating-data', title: 'Activating Data' },
    ],
  },
  {
    id: 'smartpixel',
    label: 'SmartPixel',
    description: 'Real-time web personalization engine with <50ms latency',
    category: 'activate',
    x: 1600,
    y: 580,
    radius: 20,
    techStack: ['Edge Cache', '<50ms'],
    relatedModules: [
      { trackId: 'engineering', moduleId: 'data-activation', title: 'Data Activation' },
    ],
  },

  // ── Platform Services (bottom) ───────────────────────────────────
  {
    id: 'gke',
    label: 'GKE / Kubernetes',
    description: 'Container orchestration — multi-region GKE clusters with Istio mesh',
    category: 'platform',
    x: 600,
    y: 780,
    radius: 24,
    techStack: ['GKE', 'Istio', 'Kubernetes'],
    relatedModules: [
      { trackId: 'engineering', moduleId: 'infrastructure', title: 'Infrastructure' },
    ],
  },
  {
    id: 'terraform',
    label: 'Terraform / IaC',
    description: 'Infrastructure as code for reproducible GCP deployments',
    category: 'platform',
    x: 760,
    y: 850,
    radius: 20,
    techStack: ['Terraform', 'GCP'],
    relatedModules: [
      { trackId: 'engineering', moduleId: 'infrastructure', title: 'Infrastructure' },
    ],
  },
  {
    id: 'observability',
    label: 'Observability',
    description: 'Monitoring, alerting, and distributed tracing across all services',
    category: 'platform',
    x: 920,
    y: 800,
    radius: 22,
    techStack: ['Prometheus', 'Grafana', 'OpenTelemetry'],
    relatedModules: [
      { trackId: 'engineering', moduleId: 'observability', title: 'Observability' },
    ],
  },
  {
    id: 'cicd',
    label: 'CI/CD',
    description: 'GitOps pipeline — automated build, test, and deployment',
    category: 'platform',
    x: 1080,
    y: 780,
    radius: 20,
    techStack: ['CloudBuild', 'ArgoCD', 'GitOps'],
    relatedModules: [
      { trackId: 'engineering', moduleId: 'cicd', title: 'CI/CD Pipelines' },
    ],
  },
  {
    id: 'privacy',
    label: 'Privacy & GDPR',
    description: 'Consent management, right to erasure, data residency controls',
    category: 'platform',
    x: 1200,
    y: 860,
    radius: 22,
    techStack: ['Consent Vault', 'TCF 2.2', 'GDPR'],
    relatedModules: [
      { trackId: 'engineering', moduleId: 'privacy-gdpr', title: 'Privacy & GDPR' },
    ],
  },
  {
    id: 'auth',
    label: 'Auth & IAM',
    description: 'OAuth 2.0, SAML SSO, and role-based access control',
    category: 'platform',
    x: 1360,
    y: 820,
    radius: 20,
    techStack: ['OAuth 2.0', 'SAML', 'Auth0', 'RBAC'],
    relatedModules: [
      { trackId: 'engineering', moduleId: 'auth-iam', title: 'Auth & IAM' },
    ],
  },
];

// ─── Edges (connections between nodes) ─────────────────────────────

export const UNIVERSE_EDGES: UniverseEdge[] = [
  // Collect → Ingest
  { from: 'web-sdk', to: 'kafka', animated: true },
  { from: 'mobile-sdk', to: 'kafka', animated: true },
  { from: 's2s-api', to: 'kafka', animated: true },
  { from: 'integr8', to: 'kafka', animated: true },
  { from: 'integr8', to: 'spark', animated: true },

  // Ingest internal
  { from: 'kafka', to: 'beam', animated: true },
  { from: 'kafka', to: 'spark', animated: false },
  { from: 'beam', to: 'cdap', animated: false },
  { from: 'spark', to: 'cdap', animated: false },

  // Ingest → Store
  { from: 'beam', to: 'identity', animated: true },
  { from: 'kafka', to: 'identity', animated: true },
  { from: 'identity', to: 'delta-lake', animated: true },
  { from: 'delta-lake', to: 'bigquery', animated: true },

  // Store → Intelligence
  { from: 'delta-lake', to: 'audience', animated: true },
  { from: 'delta-lake', to: 'ml', animated: true },
  { from: 'delta-lake', to: 'ada', animated: false },
  { from: 'bigquery', to: 'ada', animated: false },
  { from: 'audience', to: 'journeys', animated: true },
  { from: 'ml', to: 'audience', animated: false },
  { from: 'ml', to: 'ada', animated: false },

  // Intelligence → Activate
  { from: 'audience', to: 'destinations', animated: true },
  { from: 'journeys', to: 'destinations', animated: true },
  { from: 'destinations', to: 'smartpixel', animated: false },

  // Platform connections (supporting services)
  { from: 'gke', to: 'kafka', animated: false },
  { from: 'gke', to: 'terraform', animated: false },
  { from: 'gke', to: 'observability', animated: false },
  { from: 'observability', to: 'cicd', animated: false },
  { from: 'terraform', to: 'observability', animated: false },
  { from: 'cicd', to: 'gke', animated: false },
  { from: 'privacy', to: 'identity', animated: false },
  { from: 'privacy', to: 'delta-lake', animated: false },
  { from: 'auth', to: 'privacy', animated: false },
  { from: 'auth', to: 'destinations', animated: false },
];

// ─── Data flow paths (for simulation) ──────────────────────────────

export interface FlowPath {
  id: string;
  label: string;
  color: string;
  nodeSequence: string[];
}

export const FLOW_PATHS: FlowPath[] = [
  {
    id: 'page-view',
    label: 'Page View',
    color: '#38bdf8',
    nodeSequence: ['web-sdk', 'kafka', 'beam', 'identity', 'delta-lake', 'audience', 'destinations'],
  },
  {
    id: 'purchase',
    label: 'Purchase Event',
    color: '#10b981',
    nodeSequence: ['mobile-sdk', 'kafka', 'beam', 'identity', 'delta-lake', 'audience', 'journeys', 'destinations'],
  },
  {
    id: 'signup',
    label: 'User Signup',
    color: '#a855f7',
    nodeSequence: ['s2s-api', 'kafka', 'beam', 'identity', 'delta-lake', 'ml', 'audience', 'destinations'],
  },
  {
    id: 'batch-import',
    label: 'Batch Import',
    color: '#f59e0b',
    nodeSequence: ['integr8', 'spark', 'cdap', 'identity', 'delta-lake', 'bigquery'],
  },
];

// ─── Stars (background) ────────────────────────────────────────────

export function generateStars(count: number, width: number, height: number) {
  const stars: { x: number; y: number; size: number; opacity: number }[] = [];
  // Seeded random for consistency
  let seed = 42;
  const rand = () => {
    seed = (seed * 16807 + 0) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  for (let i = 0; i < count; i++) {
    stars.push({
      x: rand() * width,
      y: rand() * height,
      size: rand() * 1.8 + 0.3,
      opacity: rand() * 0.6 + 0.1,
    });
  }
  return stars;
}
