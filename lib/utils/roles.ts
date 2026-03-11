export type UserRole =
  | 'engineering'
  | 'sales'
  | 'cs'
  | 'product'
  | 'marketing'
  | 'leadership'
  | 'hr';

export const ROLES: Record<UserRole, { label: string; icon: string; description: string; color: string }> = {
  engineering: {
    label: 'Engineering',
    icon: '⚙️',
    description: 'Software engineers, data engineers, SRE, QA',
    color: '#3b82f6',
  },
  sales: {
    label: 'Sales & BD',
    icon: '💼',
    description: 'Account executives, SDRs, business development',
    color: '#f59e0b',
  },
  cs: {
    label: 'Customer Success',
    icon: '🤝',
    description: 'CSMs, solutions engineers, support',
    color: '#10b981',
  },
  product: {
    label: 'Product',
    icon: '📐',
    description: 'Product managers, designers, analysts',
    color: '#a855f7',
  },
  marketing: {
    label: 'Marketing',
    icon: '📣',
    description: 'Marketing managers, content, growth',
    color: '#ec4899',
  },
  leadership: {
    label: 'Leadership',
    icon: '🎯',
    description: 'Directors, VPs, C-suite',
    color: '#6366f1',
  },
  hr: {
    label: 'People & HR',
    icon: '👥',
    description: 'HR, talent acquisition, people ops',
    color: '#14b8a6',
  },
};

export type TrackId =
  | 'business-essentials'
  | 'product-mastery'
  | 'sales-enablement'
  | 'cs-playbook'
  | 'tam-playbook'
  | 'engineering';

export interface Track {
  id: TrackId;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  totalModules: number;
  estimatedHours: number;
  targetRoles: UserRole[];
  mandatory: boolean;
  modules: TrackModule[];
}

export interface TrackModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  estimatedMinutes: number;
  contentType: 'concept' | 'tutorial' | 'reference' | 'deep-dive';
}

export const TRACKS: Track[] = [
  {
    id: 'business-essentials',
    title: 'Business Essentials',
    subtitle: 'Understand Zeotap, the CDP market, and how we create value',
    icon: '🏢',
    color: '#3b82f6',
    totalModules: 6,
    estimatedHours: 3,
    targetRoles: ['engineering', 'sales', 'cs', 'product', 'marketing', 'leadership', 'hr'],
    mandatory: true,
    modules: [
      { id: 'what-is-zeotap', title: 'What is Zeotap?', description: 'Company mission, history, and the market we serve', icon: '🏢', estimatedMinutes: 20, contentType: 'concept' },
      { id: 'what-is-cdp', title: 'What is a CDP?', description: 'CDPs explained simply — no jargon, no code', icon: '📊', estimatedMinutes: 25, contentType: 'concept' },
      { id: 'our-customers', title: 'Our Customers', description: 'Key verticals, use cases, and success stories', icon: '🎯', estimatedMinutes: 20, contentType: 'concept' },
      { id: 'how-zeotap-works', title: 'How Zeotap Works', description: 'Product walkthrough from the UI perspective', icon: '🖥️', estimatedMinutes: 30, contentType: 'tutorial' },
      { id: 'competitive-landscape', title: 'Competitive Landscape', description: 'Where we fit in the market and how we win', icon: '⚔️', estimatedMinutes: 25, contentType: 'concept' },
      { id: 'business-model', title: 'Our Business Model', description: 'How we make money and grow', icon: '💰', estimatedMinutes: 20, contentType: 'concept' },
    ],
  },
  {
    id: 'product-mastery',
    title: 'Product Mastery',
    subtitle: 'Learn to use the Unity Dashboard and every product feature',
    icon: '🎨',
    color: '#a855f7',
    totalModules: 6,
    estimatedHours: 4,
    targetRoles: ['product', 'cs', 'sales', 'marketing', 'leadership'],
    mandatory: false,
    modules: [
      { id: 'unity-dashboard', title: 'Unity Dashboard', description: 'Navigate the dashboard, manage settings and users', icon: '🖥️', estimatedMinutes: 30, contentType: 'tutorial' },
      { id: 'data-collection-ui', title: 'Setting Up Data Collection', description: 'Configure sources and verify data flow', icon: '📡', estimatedMinutes: 35, contentType: 'tutorial' },
      { id: 'audience-builder', title: 'Audience Builder', description: 'Create segments with rules and natural language', icon: '🎯', estimatedMinutes: 40, contentType: 'tutorial' },
      { id: 'journey-canvas', title: 'Journey Canvas', description: 'Build multi-step customer journeys', icon: '🗺️', estimatedMinutes: 40, contentType: 'tutorial' },
      { id: 'activating-data', title: 'Activating Data', description: 'Set up destinations and sync data', icon: '🚀', estimatedMinutes: 35, contentType: 'tutorial' },
      { id: 'reports-dashboards', title: 'Reports & Dashboards', description: 'Read analytics and measure performance', icon: '📈', estimatedMinutes: 30, contentType: 'tutorial' },
    ],
  },
  {
    id: 'sales-enablement',
    title: 'Sales Enablement',
    subtitle: 'Pitch, demo, handle objections, and close deals',
    icon: '💼',
    color: '#f59e0b',
    totalModules: 10,
    estimatedHours: 5.5,
    targetRoles: ['sales', 'leadership'],
    mandatory: false,
    modules: [
      { id: 'zeotap-pitch', title: 'The Zeotap Pitch', description: 'Value propositions by persona', icon: '🎤', estimatedMinutes: 25, contentType: 'concept' },
      { id: 'discovery-questions', title: 'Discovery Questions', description: 'Qualification framework and key questions', icon: '❓', estimatedMinutes: 30, contentType: 'reference' },
      { id: 'demo-playbook', title: 'Demo Playbook', description: 'How to run an effective product demo', icon: '🎬', estimatedMinutes: 35, contentType: 'tutorial' },
      { id: 'objection-handling', title: 'Objection Handling', description: 'Common objections and how to respond', icon: '🛡️', estimatedMinutes: 25, contentType: 'reference' },
      { id: 'case-studies', title: 'Case Studies', description: 'Customer success stories by vertical', icon: '📋', estimatedMinutes: 20, contentType: 'concept' },
      { id: 'battle-cards', title: 'Competitive Battle Cards', description: 'Head-to-head comparisons', icon: '⚔️', estimatedMinutes: 30, contentType: 'reference' },
      { id: 'vertical-retail', title: 'Vertical: Retail & E-Commerce', description: 'Retail-specific use cases, demo flows, and KPIs', icon: '🛍️', estimatedMinutes: 30, contentType: 'reference' },
      { id: 'vertical-finance', title: 'Vertical: Banking & Financial Services', description: 'BFSI regulatory landscape, compliance-first selling', icon: '🏦', estimatedMinutes: 30, contentType: 'reference' },
      { id: 'vertical-telco', title: 'Vertical: Telecommunications', description: 'Telco data landscape, churn prediction, ARPU optimization', icon: '📡', estimatedMinutes: 30, contentType: 'reference' },
      { id: 'roi-calculator', title: 'ROI & Business Case Builder', description: 'Build compelling business cases for CFOs', icon: '💰', estimatedMinutes: 25, contentType: 'reference' },
    ],
  },
  {
    id: 'cs-playbook',
    title: 'Customer Success Playbook',
    subtitle: 'Onboard, support, and grow customer accounts',
    icon: '🤝',
    color: '#10b981',
    totalModules: 10,
    estimatedHours: 5.5,
    targetRoles: ['cs', 'product', 'leadership'],
    mandatory: false,
    modules: [
      { id: 'onboarding-checklist', title: 'Onboarding Checklist', description: '30-60-90 day plan for new customers', icon: '✅', estimatedMinutes: 30, contentType: 'tutorial' },
      { id: 'health-score', title: 'Health Score Guide', description: 'Key metrics and risk indicators', icon: '💚', estimatedMinutes: 25, contentType: 'concept' },
      { id: 'troubleshooting', title: 'Troubleshooting', description: 'Common issues and diagnostic flows', icon: '🔧', estimatedMinutes: 40, contentType: 'reference' },
      { id: 'escalation-path', title: 'Escalation Path', description: 'When and how to escalate issues', icon: '📢', estimatedMinutes: 20, contentType: 'reference' },
      { id: 'renewal-expansion', title: 'Renewal & Expansion', description: 'Growing accounts and preventing churn', icon: '📈', estimatedMinutes: 30, contentType: 'concept' },
      { id: 'integration-guides', title: 'Integration Guides', description: 'Step-by-step setup for top destinations', icon: '🔌', estimatedMinutes: 35, contentType: 'tutorial' },
      { id: 'health-score-deep-dive', title: 'Health Score Deep Dive', description: 'Weighted scoring methodology and intervention playbooks', icon: '📊', estimatedMinutes: 30, contentType: 'reference' },
      { id: 'expansion-playbook', title: 'Expansion & Upsell Playbook', description: 'Signals, frameworks, and plays for growing accounts', icon: '📈', estimatedMinutes: 35, contentType: 'tutorial' },
      { id: 'vertical-success-guides', title: 'Vertical Success Guides', description: 'Industry-specific success criteria and onboarding priorities', icon: '🏭', estimatedMinutes: 35, contentType: 'reference' },
      { id: 'qbr-template', title: 'QBR & Executive Review Template', description: 'Complete QBR structure and data preparation guide', icon: '📋', estimatedMinutes: 25, contentType: 'tutorial' },
    ],
  },
  {
    id: 'tam-playbook',
    title: 'Technical Account Management',
    subtitle: 'Strategic account planning, technical onboarding, and value engineering',
    icon: '🔧',
    color: '#06b6d4',
    totalModules: 6,
    estimatedHours: 3,
    targetRoles: ['cs', 'engineering', 'product', 'leadership'],
    mandatory: false,
    modules: [
      { id: 'account-planning', title: 'Strategic Account Planning', description: 'Tier classification, stakeholder mapping, adoption roadmaps', icon: '🎯', estimatedMinutes: 30, contentType: 'tutorial' },
      { id: 'technical-onboarding', title: 'Technical Onboarding Mastery', description: '8-week implementation from SDK to activation', icon: '🔧', estimatedMinutes: 35, contentType: 'tutorial' },
      { id: 'architecture-review', title: 'Customer Architecture Reviews', description: 'Data architecture patterns and integration approaches', icon: '🏗️', estimatedMinutes: 30, contentType: 'reference' },
      { id: 'data-quality-ops', title: 'Data Quality Operations', description: 'Monitoring, diagnostics, and proactive quality management', icon: '🔍', estimatedMinutes: 25, contentType: 'reference' },
      { id: 'value-engineering', title: 'Value Engineering & ROI Tracking', description: 'Quantify and present value delivered to customers', icon: '💎', estimatedMinutes: 30, contentType: 'concept' },
      { id: 'advanced-use-cases', title: 'Advanced Use Case Library', description: '12+ advanced identity, audience, journey, and activation use cases', icon: '🚀', estimatedMinutes: 35, contentType: 'reference' },
    ],
  },
  {
    id: 'engineering',
    title: 'Engineering Deep Dive',
    subtitle: 'Master the full technical architecture of Zeotap CDP',
    icon: '⚙️',
    color: '#6366f1',
    totalModules: 18,
    estimatedHours: 10,
    targetRoles: ['engineering'],
    mandatory: false,
    modules: [
      { id: 'platform-overview', title: 'Platform Overview', description: 'Architecture pillars: Collect, Unify, Activate', icon: '🏗️', estimatedMinutes: 15, contentType: 'concept' },
      { id: 'data-collection', title: 'Data Collection & SDKs', description: 'Web, Mobile, and Server-side SDKs', icon: '📡', estimatedMinutes: 20, contentType: 'deep-dive' },
      { id: 'data-ingestion', title: 'Data Ingestion Pipelines', description: 'Kafka, Beam, Spark, CDAP', icon: '⚙️', estimatedMinutes: 25, contentType: 'deep-dive' },
      { id: 'identity-resolution', title: 'Identity Resolution', description: 'UCID, deterministic & probabilistic matching', icon: '🔗', estimatedMinutes: 20, contentType: 'deep-dive' },
      { id: 'profile-store', title: 'Profile Store', description: 'Delta Lake, ACID transactions, BigQuery', icon: '👤', estimatedMinutes: 20, contentType: 'deep-dive' },
      { id: 'audience-management', title: 'Audience Management', description: 'Real-time segmentation engine', icon: '🎯', estimatedMinutes: 25, contentType: 'deep-dive' },
      { id: 'customer-journeys', title: 'Customer Journeys', description: 'Multi-step orchestration engine', icon: '🗺️', estimatedMinutes: 20, contentType: 'deep-dive' },
      { id: 'data-activation', title: 'Data Activation', description: '100+ destination connectors', icon: '🚀', estimatedMinutes: 20, contentType: 'deep-dive' },
      { id: 'genai-zoe', title: 'GenAI & Zoe Assistant', description: 'Vertex AI, RAG, natural language queries', icon: '🤖', estimatedMinutes: 20, contentType: 'deep-dive' },
      { id: 'ml-platform', title: 'ML Platform', description: 'Vertex AI, propensity scoring, feature store', icon: '🧠', estimatedMinutes: 25, contentType: 'deep-dive' },
      { id: 'reporting-bi', title: 'Reporting & BI', description: 'BigQuery, Druid, Redshift analytics', icon: '📊', estimatedMinutes: 20, contentType: 'deep-dive' },
      { id: 'unity-dashboard-tech', title: 'Unity Dashboard (Tech)', description: 'React SPA, micro-frontends, API gateway', icon: '🖥️', estimatedMinutes: 20, contentType: 'deep-dive' },
      { id: 'privacy-gdpr', title: 'Privacy & GDPR', description: 'Consent management, right to erasure', icon: '🔒', estimatedMinutes: 25, contentType: 'deep-dive' },
      { id: 'auth-iam', title: 'Auth & IAM', description: 'OAuth 2.0, SAML, RBAC via Auth0', icon: '🛡️', estimatedMinutes: 20, contentType: 'deep-dive' },
      { id: 'infrastructure', title: 'Infrastructure', description: 'GKE, Terraform, multi-region', icon: '🏗️', estimatedMinutes: 30, contentType: 'deep-dive' },
      { id: 'observability', title: 'Observability', description: 'Prometheus, Grafana, OpenTelemetry', icon: '📊', estimatedMinutes: 20, contentType: 'deep-dive' },
      { id: 'cicd', title: 'CI/CD Pipelines', description: 'CloudBuild, ArgoCD, GitOps', icon: '🔄', estimatedMinutes: 20, contentType: 'deep-dive' },
      { id: 'testing', title: 'Testing & QA', description: 'Contract testing, chaos engineering, E2E', icon: '🧪', estimatedMinutes: 20, contentType: 'deep-dive' },
    ],
  },
];

export function getTracksForRole(role: UserRole): Track[] {
  return TRACKS.filter(
    (t) => t.targetRoles.includes(role) || t.id === 'business-essentials'
  );
}

export function getMandatoryTracks(role: UserRole): Track[] {
  return getTracksForRole(role).filter((t) => t.mandatory);
}
