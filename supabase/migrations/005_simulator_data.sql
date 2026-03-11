-- 005_simulator_data.sql
-- Tables for the ZeoAI simulator modules

-- 1. Audience builder field definitions
CREATE TABLE sim_schema_fields (
  id              serial PRIMARY KEY,
  name            text NOT NULL,
  category        text NOT NULL,
  type            text NOT NULL,
  fill_rate       int  NOT NULL,
  distinct_values int  NOT NULL,
  percentiles     jsonb,
  sample_values   jsonb
);

-- 2. Campaign presets
CREATE TABLE sim_campaign_presets (
  id              serial PRIMARY KEY,
  campaign_type   text NOT NULL,
  name            text NOT NULL,
  description     text,
  criteria        jsonb
);

-- 3. Churn-detection verticals
CREATE TABLE sim_verticals (
  id       serial PRIMARY KEY,
  name     text NOT NULL UNIQUE,
  label    text NOT NULL,
  icon     text,
  signals  jsonb,
  metrics  jsonb
);

-- 4. Customer profiles per vertical
CREATE TABLE sim_customers (
  id             serial PRIMARY KEY,
  vertical_name  text NOT NULL REFERENCES sim_verticals(name),
  name           text NOT NULL,
  segment        text,
  metrics        jsonb,
  risk_score     int,
  tier           text,
  days_to_churn  text,
  ltv            int
);

-- 5. Health-diagnostic scenarios
CREATE TABLE sim_health_scenarios (
  id                    serial PRIMARY KEY,
  name                  text NOT NULL,
  label                 text NOT NULL,
  description           text,
  global_status         text,
  org_name              text,
  org_id                text,
  services              jsonb,
  destinations          jsonb,
  diagnostics           jsonb,
  recent_dates          jsonb,
  overall_success_rate  numeric,
  total_uploads         int,
  total_failures        int
);

-- 6. User-saved simulation results
CREATE TABLE sim_user_results (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         uuid NOT NULL REFERENCES auth.users(id),
  simulator_type  text NOT NULL,
  result_data     jsonb,
  created_at      timestamptz DEFAULT now()
);

-- ============================================================
-- Row-Level Security
-- ============================================================

ALTER TABLE sim_schema_fields    ENABLE ROW LEVEL SECURITY;
ALTER TABLE sim_campaign_presets  ENABLE ROW LEVEL SECURITY;
ALTER TABLE sim_verticals         ENABLE ROW LEVEL SECURITY;
ALTER TABLE sim_customers         ENABLE ROW LEVEL SECURITY;
ALTER TABLE sim_health_scenarios  ENABLE ROW LEVEL SECURITY;
ALTER TABLE sim_user_results      ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read reference tables
CREATE POLICY "Authenticated users can read sim_schema_fields"
  ON sim_schema_fields FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read sim_campaign_presets"
  ON sim_campaign_presets FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read sim_verticals"
  ON sim_verticals FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read sim_customers"
  ON sim_customers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read sim_health_scenarios"
  ON sim_health_scenarios FOR SELECT
  TO authenticated
  USING (true);

-- Users can manage their own simulation results
CREATE POLICY "Users can insert own sim_user_results"
  ON sim_user_results FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can select own sim_user_results"
  ON sim_user_results FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sim_user_results"
  ON sim_user_results FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
