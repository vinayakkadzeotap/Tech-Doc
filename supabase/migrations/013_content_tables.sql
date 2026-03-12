-- Content tables: tracks and modules for admin-managed content
-- Replaces hardcoded TRACKS array from roles.ts with database-driven content

CREATE TABLE IF NOT EXISTS tracks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT '📚',
  color TEXT NOT NULL DEFAULT '#3b82f6',
  estimated_hours NUMERIC NOT NULL DEFAULT 1,
  target_roles TEXT[] NOT NULL DEFAULT '{}',
  mandatory BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS modules (
  track_id TEXT NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
  id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT '📄',
  estimated_minutes INTEGER NOT NULL DEFAULT 15,
  content_type TEXT NOT NULL DEFAULT 'concept',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (track_id, id)
);

-- RLS
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read
CREATE POLICY "tracks_read" ON tracks FOR SELECT TO authenticated USING (true);
CREATE POLICY "modules_read" ON modules FOR SELECT TO authenticated USING (true);

-- Only admins can write
CREATE POLICY "tracks_admin_insert" ON tracks FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));
CREATE POLICY "tracks_admin_update" ON tracks FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));
CREATE POLICY "tracks_admin_delete" ON tracks FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "modules_admin_insert" ON modules FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));
CREATE POLICY "modules_admin_update" ON modules FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));
CREATE POLICY "modules_admin_delete" ON modules FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- Seed data from existing hardcoded tracks
INSERT INTO tracks (id, title, subtitle, icon, color, estimated_hours, target_roles, mandatory, sort_order) VALUES
  ('business-essentials', 'Business Essentials', 'Understand Zeotap, the CDP market, and how we create value', '🏢', '#3b82f6', 3, ARRAY['engineering','sales','cs','product','marketing','leadership','hr'], true, 0),
  ('product-mastery', 'Product Mastery', 'Learn to use the Unity Dashboard and every product feature', '🎨', '#a855f7', 4, ARRAY['product','cs','sales','marketing','leadership'], false, 1),
  ('sales-enablement', 'Sales Enablement', 'Pitch, demo, handle objections, and close deals', '💼', '#f59e0b', 5.5, ARRAY['sales','leadership'], false, 2),
  ('cs-playbook', 'Customer Success Playbook', 'Onboard, support, and grow customer accounts', '🤝', '#10b981', 5.5, ARRAY['cs','product','leadership'], false, 3),
  ('tam-playbook', 'Technical Account Management', 'Strategic account planning, technical onboarding, and value engineering', '🔧', '#06b6d4', 3, ARRAY['cs','engineering','product','leadership'], false, 4),
  ('engineering', 'Engineering Deep Dive', 'Master the full technical architecture of Zeotap CDP', '⚙️', '#6366f1', 10, ARRAY['engineering'], false, 5)
ON CONFLICT (id) DO NOTHING;

-- Seed modules (Business Essentials)
INSERT INTO modules (track_id, id, title, description, icon, estimated_minutes, content_type, sort_order) VALUES
  ('business-essentials', 'what-is-zeotap', 'What is Zeotap?', 'Company mission, history, and the market we serve', '🏢', 20, 'concept', 0),
  ('business-essentials', 'what-is-cdp', 'What is a CDP?', 'CDPs explained simply — no jargon, no code', '📊', 25, 'concept', 1),
  ('business-essentials', 'our-customers', 'Our Customers', 'Key verticals, use cases, and success stories', '🎯', 20, 'concept', 2),
  ('business-essentials', 'how-zeotap-works', 'How Zeotap Works', 'Product walkthrough from the UI perspective', '🖥️', 30, 'tutorial', 3),
  ('business-essentials', 'competitive-landscape', 'Competitive Landscape', 'Where we fit in the market and how we win', '⚔️', 25, 'concept', 4),
  ('business-essentials', 'business-model', 'Our Business Model', 'How we make money and grow', '💰', 20, 'concept', 5)
ON CONFLICT (track_id, id) DO NOTHING;

-- Seed modules (Product Mastery)
INSERT INTO modules (track_id, id, title, description, icon, estimated_minutes, content_type, sort_order) VALUES
  ('product-mastery', 'unity-dashboard', 'Unity Dashboard', 'Navigate the dashboard, manage settings and users', '🖥️', 30, 'tutorial', 0),
  ('product-mastery', 'data-collection-ui', 'Setting Up Data Collection', 'Configure sources and verify data flow', '📡', 35, 'tutorial', 1),
  ('product-mastery', 'audience-builder', 'Audience Builder', 'Create segments with rules and natural language', '🎯', 40, 'tutorial', 2),
  ('product-mastery', 'journey-canvas', 'Journey Canvas', 'Build multi-step customer journeys', '🗺️', 40, 'tutorial', 3),
  ('product-mastery', 'activating-data', 'Activating Data', 'Set up destinations and sync data', '🚀', 35, 'tutorial', 4),
  ('product-mastery', 'reports-dashboards', 'Reports & Dashboards', 'Read analytics and measure performance', '📈', 30, 'tutorial', 5)
ON CONFLICT (track_id, id) DO NOTHING;

-- Seed modules (Sales Enablement)
INSERT INTO modules (track_id, id, title, description, icon, estimated_minutes, content_type, sort_order) VALUES
  ('sales-enablement', 'zeotap-pitch', 'The Zeotap Pitch', 'Value propositions by persona', '🎤', 25, 'concept', 0),
  ('sales-enablement', 'discovery-questions', 'Discovery Questions', 'Qualification framework and key questions', '❓', 30, 'reference', 1),
  ('sales-enablement', 'demo-playbook', 'Demo Playbook', 'How to run an effective product demo', '🎬', 35, 'tutorial', 2),
  ('sales-enablement', 'objection-handling', 'Objection Handling', 'Common objections and how to respond', '🛡️', 25, 'reference', 3),
  ('sales-enablement', 'case-studies', 'Case Studies', 'Customer success stories by vertical', '📋', 20, 'concept', 4),
  ('sales-enablement', 'battle-cards', 'Competitive Battle Cards', 'Head-to-head comparisons', '⚔️', 30, 'reference', 5),
  ('sales-enablement', 'vertical-retail', 'Vertical: Retail & E-Commerce', 'Retail-specific use cases, demo flows, and KPIs', '🛍️', 30, 'reference', 6),
  ('sales-enablement', 'vertical-finance', 'Vertical: Banking & Financial Services', 'BFSI regulatory landscape, compliance-first selling', '🏦', 30, 'reference', 7),
  ('sales-enablement', 'vertical-telco', 'Vertical: Telecommunications', 'Telco data landscape, churn prediction, ARPU optimization', '📡', 30, 'reference', 8),
  ('sales-enablement', 'roi-calculator', 'ROI & Business Case Builder', 'Build compelling business cases for CFOs', '💰', 25, 'reference', 9)
ON CONFLICT (track_id, id) DO NOTHING;

-- Seed modules (CS Playbook)
INSERT INTO modules (track_id, id, title, description, icon, estimated_minutes, content_type, sort_order) VALUES
  ('cs-playbook', 'onboarding-checklist', 'Onboarding Checklist', '30-60-90 day plan for new customers', '✅', 30, 'tutorial', 0),
  ('cs-playbook', 'health-score', 'Health Score Guide', 'Key metrics and risk indicators', '💚', 25, 'concept', 1),
  ('cs-playbook', 'troubleshooting', 'Troubleshooting', 'Common issues and diagnostic flows', '🔧', 40, 'reference', 2),
  ('cs-playbook', 'escalation-path', 'Escalation Path', 'When and how to escalate issues', '📢', 20, 'reference', 3),
  ('cs-playbook', 'renewal-expansion', 'Renewal & Expansion', 'Growing accounts and preventing churn', '📈', 30, 'concept', 4),
  ('cs-playbook', 'integration-guides', 'Integration Guides', 'Step-by-step setup for top destinations', '🔌', 35, 'tutorial', 5),
  ('cs-playbook', 'health-score-deep-dive', 'Health Score Deep Dive', 'Weighted scoring methodology and intervention playbooks', '📊', 30, 'reference', 6),
  ('cs-playbook', 'expansion-playbook', 'Expansion & Upsell Playbook', 'Signals, frameworks, and plays for growing accounts', '📈', 35, 'tutorial', 7),
  ('cs-playbook', 'vertical-success-guides', 'Vertical Success Guides', 'Industry-specific success criteria and onboarding priorities', '🏭', 35, 'reference', 8),
  ('cs-playbook', 'qbr-template', 'QBR & Executive Review Template', 'Complete QBR structure and data preparation guide', '📋', 25, 'tutorial', 9)
ON CONFLICT (track_id, id) DO NOTHING;

-- Seed modules (TAM Playbook)
INSERT INTO modules (track_id, id, title, description, icon, estimated_minutes, content_type, sort_order) VALUES
  ('tam-playbook', 'account-planning', 'Strategic Account Planning', 'Tier classification, stakeholder mapping, adoption roadmaps', '🎯', 30, 'tutorial', 0),
  ('tam-playbook', 'technical-onboarding', 'Technical Onboarding Mastery', '8-week implementation from SDK to activation', '🔧', 35, 'tutorial', 1),
  ('tam-playbook', 'architecture-review', 'Customer Architecture Reviews', 'Data architecture patterns and integration approaches', '🏗️', 30, 'reference', 2),
  ('tam-playbook', 'data-quality-ops', 'Data Quality Operations', 'Monitoring, diagnostics, and proactive quality management', '🔍', 25, 'reference', 3),
  ('tam-playbook', 'value-engineering', 'Value Engineering & ROI Tracking', 'Quantify and present value delivered to customers', '💎', 30, 'concept', 4),
  ('tam-playbook', 'advanced-use-cases', 'Advanced Use Case Library', '12+ advanced identity, audience, journey, and activation use cases', '🚀', 35, 'reference', 5)
ON CONFLICT (track_id, id) DO NOTHING;

-- Seed modules (Engineering Deep Dive)
INSERT INTO modules (track_id, id, title, description, icon, estimated_minutes, content_type, sort_order) VALUES
  ('engineering', 'platform-overview', 'Platform Overview', 'Architecture pillars: Collect, Unify, Activate', '🏗️', 15, 'concept', 0),
  ('engineering', 'data-collection', 'Data Collection & SDKs', 'Web, Mobile, and Server-side SDKs', '📡', 20, 'deep-dive', 1),
  ('engineering', 'data-ingestion', 'Data Ingestion Pipelines', 'Kafka, Beam, Spark, CDAP', '⚙️', 25, 'deep-dive', 2),
  ('engineering', 'identity-resolution', 'Identity Resolution', 'UCID, deterministic & probabilistic matching', '🔗', 20, 'deep-dive', 3),
  ('engineering', 'profile-store', 'Profile Store', 'Delta Lake, ACID transactions, BigQuery', '👤', 20, 'deep-dive', 4),
  ('engineering', 'audience-management', 'Audience Management', 'Real-time segmentation engine', '🎯', 25, 'deep-dive', 5),
  ('engineering', 'customer-journeys', 'Customer Journeys', 'Multi-step orchestration engine', '🗺️', 20, 'deep-dive', 6),
  ('engineering', 'data-activation', 'Data Activation', '100+ destination connectors', '🚀', 20, 'deep-dive', 7),
  ('engineering', 'genai-zoe', 'GenAI & Zoe Assistant', 'Vertex AI, RAG, natural language queries', '🤖', 20, 'deep-dive', 8),
  ('engineering', 'ml-platform', 'ML Platform', 'Vertex AI, propensity scoring, feature store', '🧠', 25, 'deep-dive', 9),
  ('engineering', 'reporting-bi', 'Reporting & BI', 'BigQuery, Druid, Redshift analytics', '📊', 20, 'deep-dive', 10),
  ('engineering', 'unity-dashboard-tech', 'Unity Dashboard (Tech)', 'React SPA, micro-frontends, API gateway', '🖥️', 20, 'deep-dive', 11),
  ('engineering', 'privacy-gdpr', 'Privacy & GDPR', 'Consent management, right to erasure', '🔒', 25, 'deep-dive', 12),
  ('engineering', 'auth-iam', 'Auth & IAM', 'OAuth 2.0, SAML, RBAC via Auth0', '🛡️', 20, 'deep-dive', 13),
  ('engineering', 'infrastructure', 'Infrastructure', 'GKE, Terraform, multi-region', '🏗️', 30, 'deep-dive', 14),
  ('engineering', 'observability', 'Observability', 'Prometheus, Grafana, OpenTelemetry', '📊', 20, 'deep-dive', 15),
  ('engineering', 'cicd', 'CI/CD Pipelines', 'CloudBuild, ArgoCD, GitOps', '🔄', 20, 'deep-dive', 16),
  ('engineering', 'testing', 'Testing & QA', 'Contract testing, chaos engineering, E2E', '🧪', 20, 'deep-dive', 17)
ON CONFLICT (track_id, id) DO NOTHING;

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tracks_updated_at BEFORE UPDATE ON tracks
  FOR EACH ROW EXECUTE FUNCTION update_content_updated_at();

CREATE TRIGGER modules_updated_at BEFORE UPDATE ON modules
  FOR EACH ROW EXECUTE FUNCTION update_content_updated_at();
