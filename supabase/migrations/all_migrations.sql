-- ============================================================
-- ZEOTAP LEARNING PLATFORM — COMPLETE DATABASE SCHEMA
-- Run this entire file in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ============================================================

-- ============================================================
-- 001_schema.sql — Core tables
-- ============================================================

-- 1. User profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'engineering',
  team TEXT DEFAULT '',
  department TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  is_admin BOOLEAN DEFAULT FALSE,
  is_manager BOOLEAN DEFAULT FALSE,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Module progress
CREATE TABLE IF NOT EXISTS public.progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  track_id TEXT NOT NULL,
  module_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'not_started',
  scroll_pct INTEGER DEFAULT 0,
  time_spent_seconds INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, track_id, module_id)
);

-- 3. Quiz attempts
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  quiz_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  percentage INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  answers JSONB NOT NULL DEFAULT '{}',
  time_taken_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Badges
CREATE TABLE IF NOT EXISTS public.badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  badge_id TEXT NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- 5. Certifications
CREATE TABLE IF NOT EXISTS public.certifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  cert_id TEXT NOT NULL,
  level TEXT NOT NULL DEFAULT 'associate',
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  UNIQUE(user_id, cert_id, level)
);

-- 6. Assignments (manager assigns track to user)
CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  assigned_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  track_id TEXT NOT NULL,
  due_date TIMESTAMPTZ,
  status TEXT DEFAULT 'assigned',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Content feedback
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content_type TEXT NOT NULL,
  content_id TEXT NOT NULL,
  rating INTEGER DEFAULT 0,
  comment TEXT DEFAULT '',
  issue_type TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Bookmarks
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content_type TEXT NOT NULL,
  content_id TEXT NOT NULL,
  note TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, content_type, content_id)
);

-- 9. User notes
CREATE TABLE IF NOT EXISTS public.notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  module_id TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Analytics events
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Row Level Security ────────────────────────────────────────────

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read all profiles, update only their own
DO $$ BEGIN
CREATE POLICY "Profiles are viewable by all authenticated users" ON public.profiles
  FOR SELECT USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Progress: users can manage their own progress, admins can read all
DO $$ BEGIN
CREATE POLICY "Users can manage own progress" ON public.progress
  FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
CREATE POLICY "Admins can read all progress" ON public.progress
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Quiz attempts: same pattern
DO $$ BEGIN
CREATE POLICY "Users can manage own quiz attempts" ON public.quiz_attempts
  FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
CREATE POLICY "Admins can read all quiz attempts" ON public.quiz_attempts
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Badges: same pattern
DO $$ BEGIN
CREATE POLICY "Users can manage own badges" ON public.badges
  FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
CREATE POLICY "Admins can read all badges" ON public.badges
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Certifications: same
DO $$ BEGIN
CREATE POLICY "Users can view own certifications" ON public.certifications
  FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
CREATE POLICY "Admins can manage all certifications" ON public.certifications
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Assignments: users can see their own, admins/managers can manage
DO $$ BEGIN
CREATE POLICY "Users can view own assignments" ON public.assignments
  FOR SELECT USING (auth.uid() = assigned_to);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
CREATE POLICY "Admins and managers can manage assignments" ON public.assignments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (is_admin = TRUE OR is_manager = TRUE))
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Feedback: users can create, admins can read all
DO $$ BEGIN
CREATE POLICY "Users can create feedback" ON public.feedback
  FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
CREATE POLICY "Users can view own feedback" ON public.feedback
  FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
CREATE POLICY "Admins can read all feedback" ON public.feedback
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Bookmarks: users manage their own
DO $$ BEGIN
CREATE POLICY "Users can manage own bookmarks" ON public.bookmarks
  FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Notes: users manage their own
DO $$ BEGIN
CREATE POLICY "Users can manage own notes" ON public.notes
  FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Analytics: insert only, admins can read
DO $$ BEGIN
CREATE POLICY "Authenticated users can insert analytics" ON public.analytics_events
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
CREATE POLICY "Admins can read analytics" ON public.analytics_events
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ── Trigger: Auto-create profile on signup ──────────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── Indexes ──────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_progress_user ON public.progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_track ON public.progress(track_id);
CREATE INDEX IF NOT EXISTS idx_quiz_user ON public.quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_badges_user ON public.badges(user_id);
CREATE INDEX IF NOT EXISTS idx_assignments_to ON public.assignments(assigned_to);
CREATE INDEX IF NOT EXISTS idx_analytics_type ON public.analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_user ON public.analytics_events(user_id);


-- ============================================================
-- 002_add_progress_unique_constraint.sql
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'progress_user_id_track_id_module_id_key'
  ) THEN
    DELETE FROM public.progress a
    USING public.progress b
    WHERE a.user_id = b.user_id
      AND a.track_id = b.track_id
      AND a.module_id = b.module_id
      AND a.created_at < b.created_at;

    ALTER TABLE public.progress
      ADD CONSTRAINT progress_user_id_track_id_module_id_key
      UNIQUE (user_id, track_id, module_id);
  END IF;
END $$;


-- ============================================================
-- 003_extended_profile.sql
-- ============================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS designation TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS phone TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS linkedin TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS location TEXT DEFAULT '';

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

DO $$ BEGIN
CREATE POLICY "Users can upload own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
CREATE POLICY "Avatars are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
CREATE POLICY "Users can update own avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
CREATE POLICY "Users can delete own avatar" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;


-- ============================================================
-- 004_cdp_assistant.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL DEFAULT 'New conversation',
  skill_ids TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  matched_skills TEXT[] DEFAULT '{}',
  tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
CREATE POLICY "Users can manage own sessions" ON public.chat_sessions
  FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
CREATE POLICY "Admins can read all sessions" ON public.chat_sessions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
CREATE POLICY "Users can manage own messages" ON public.chat_messages
  FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
CREATE POLICY "Admins can read all messages" ON public.chat_messages
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS idx_chat_sessions_user ON public.chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON public.chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user ON public.chat_messages(user_id);


-- ============================================================
-- 005_simulator_data.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS sim_schema_fields (
  id              serial PRIMARY KEY,
  name            text NOT NULL,
  category        text NOT NULL,
  type            text NOT NULL,
  fill_rate       int  NOT NULL,
  distinct_values int  NOT NULL,
  percentiles     jsonb,
  sample_values   jsonb
);

CREATE TABLE IF NOT EXISTS sim_campaign_presets (
  id              serial PRIMARY KEY,
  campaign_type   text NOT NULL,
  name            text NOT NULL,
  description     text,
  criteria        jsonb
);

CREATE TABLE IF NOT EXISTS sim_verticals (
  id       serial PRIMARY KEY,
  name     text NOT NULL UNIQUE,
  label    text NOT NULL,
  icon     text,
  signals  jsonb,
  metrics  jsonb
);

CREATE TABLE IF NOT EXISTS sim_customers (
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

CREATE TABLE IF NOT EXISTS sim_health_scenarios (
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

CREATE TABLE IF NOT EXISTS sim_user_results (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         uuid NOT NULL REFERENCES auth.users(id),
  simulator_type  text NOT NULL,
  result_data     jsonb,
  created_at      timestamptz DEFAULT now()
);

ALTER TABLE sim_schema_fields    ENABLE ROW LEVEL SECURITY;
ALTER TABLE sim_campaign_presets  ENABLE ROW LEVEL SECURITY;
ALTER TABLE sim_verticals         ENABLE ROW LEVEL SECURITY;
ALTER TABLE sim_customers         ENABLE ROW LEVEL SECURITY;
ALTER TABLE sim_health_scenarios  ENABLE ROW LEVEL SECURITY;
ALTER TABLE sim_user_results      ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
CREATE POLICY "Authenticated users can read sim_schema_fields"
  ON sim_schema_fields FOR SELECT TO authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
CREATE POLICY "Authenticated users can read sim_campaign_presets"
  ON sim_campaign_presets FOR SELECT TO authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
CREATE POLICY "Authenticated users can read sim_verticals"
  ON sim_verticals FOR SELECT TO authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
CREATE POLICY "Authenticated users can read sim_customers"
  ON sim_customers FOR SELECT TO authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
CREATE POLICY "Authenticated users can read sim_health_scenarios"
  ON sim_health_scenarios FOR SELECT TO authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
CREATE POLICY "Users can insert own sim_user_results"
  ON sim_user_results FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
CREATE POLICY "Users can select own sim_user_results"
  ON sim_user_results FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
CREATE POLICY "Users can delete own sim_user_results"
  ON sim_user_results FOR DELETE TO authenticated
  USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;


-- ============================================================
-- 006_simulator_seed.sql
-- ============================================================

INSERT INTO sim_schema_fields (name, category, type, fill_rate, distinct_values, percentiles, sample_values) VALUES
  ('age',                  'Demographics',  'integer',  98, 80,
   '{"p25": 24, "p50": 34, "p75": 48, "p90": 62}',
   '[18, 25, 34, 45, 67]'),
  ('gender',               'Demographics',  'string',   96, 3,
   NULL,
   '["male", "female", "non-binary"]'),
  ('country',              'Demographics',  'string',   99, 195,
   NULL,
   '["US", "UK", "IN", "DE", "BR"]'),
  ('income_bracket',       'Demographics',  'string',   72, 5,
   NULL,
   '["<25k", "25-50k", "50-100k", "100-200k", ">200k"]'),
  ('purchase_frequency',   'Behavioral',    'integer',  88, 50,
   '{"p25": 1, "p50": 3, "p75": 7, "p90": 14}',
   '[0, 2, 5, 10, 22]'),
  ('avg_order_value',      'Transactional', 'decimal',  85, 500,
   '{"p25": 18.50, "p50": 42.00, "p75": 89.99, "p90": 175.00}',
   '[9.99, 29.99, 55.00, 120.00, 350.00]'),
  ('total_lifetime_value', 'Transactional', 'decimal',  90, 2000,
   '{"p25": 85, "p50": 320, "p75": 950, "p90": 2800}',
   '[15, 150, 500, 1400, 5200]'),
  ('days_since_purchase',  'Behavioral',    'integer',  91, 365,
   '{"p25": 3, "p50": 14, "p75": 45, "p90": 120}',
   '[0, 7, 30, 90, 270]'),
  ('email_open_rate',      'Engagement',    'decimal',  80, 100,
   '{"p25": 8.5, "p50": 18.2, "p75": 32.0, "p90": 48.5}',
   '[2.1, 12.0, 22.5, 38.0, 55.0]'),
  ('login_frequency',      'Engagement',    'integer',  93, 60,
   '{"p25": 1, "p50": 4, "p75": 12, "p90": 25}',
   '[0, 2, 6, 15, 30]'),
  ('category_affinity',    'Behavioral',    'string',   78, 25,
   NULL,
   '["electronics", "fashion", "home", "grocery", "sports"]'),
  ('membership_tier',      'Account',       'string',   95, 4,
   NULL,
   '["free", "silver", "gold", "platinum"]'),
  ('churn_risk_score',     'Predictive',    'integer',  70, 100,
   '{"p25": 12, "p50": 35, "p75": 62, "p90": 85}',
   '[5, 22, 45, 70, 93]'),
  ('support_tickets_30d',  'Support',       'integer',  82, 20,
   '{"p25": 0, "p50": 1, "p75": 3, "p90": 6}',
   '[0, 0, 1, 4, 9]'),
  ('is_subscribed',        'Account',       'boolean',  99, 2,
   NULL,
   '[true, false]')
ON CONFLICT DO NOTHING;

INSERT INTO sim_campaign_presets (campaign_type, name, description, criteria) VALUES
  ('acquisition', 'New User Welcome', 'Onboard first-time visitors with a personalised welcome series.',
   '{"age_range": [18, 45], "days_since_signup": {"lte": 7}, "has_purchased": false, "channels": ["email", "push"]}'),
  ('retention', 'Loyalty Re-Engage', 'Win back loyal customers showing early signs of churn.',
   '{"membership_tier": ["gold", "platinum"], "days_since_purchase": {"gte": 30, "lte": 90}, "churn_risk_score": {"gte": 40}, "channels": ["email", "sms"]}'),
  ('upsell', 'Premium Upgrade', 'Encourage silver-tier members to upgrade to gold.',
   '{"membership_tier": ["silver"], "avg_order_value": {"gte": 50}, "purchase_frequency": {"gte": 3}, "channels": ["in_app", "email"]}'),
  ('reactivation', 'Win-Back Dormant', 'Re-engage users who have been inactive for 90+ days.',
   '{"days_since_purchase": {"gte": 90}, "email_open_rate": {"gte": 5}, "is_subscribed": true, "channels": ["email", "paid_social"]}'),
  ('seasonal', 'Summer Sale Blitz', 'Drive revenue during the summer clearance window.',
   '{"category_affinity": ["fashion", "sports"], "country": ["US", "UK", "DE"], "age_range": [18, 55], "channels": ["email", "push", "paid_social"]}')
ON CONFLICT DO NOTHING;

INSERT INTO sim_verticals (name, label, icon, signals, metrics) VALUES
  ('retail', 'Retail & E-Commerce', 'ShoppingCart',
   '["purchase_frequency_drop", "cart_abandonment_spike", "support_ticket_increase", "browse_without_buy", "coupon_dependency"]',
   '{"avg_retention_rate": 74, "avg_churn_rate": 26, "avg_ltv": 420, "avg_cac": 38}'),
  ('telecom', 'Telecommunications', 'Phone',
   '["data_usage_decline", "complaint_escalation", "plan_downgrade", "competitor_inquiry", "late_payment"]',
   '{"avg_retention_rate": 82, "avg_churn_rate": 18, "avg_ltv": 1850, "avg_cac": 210}'),
  ('gaming', 'Gaming & Entertainment', 'Gamepad2',
   '["session_length_drop", "in_app_purchase_decline", "social_feature_disengagement", "tutorial_skip", "uninstall_signal"]',
   '{"avg_retention_rate": 55, "avg_churn_rate": 45, "avg_ltv": 95, "avg_cac": 12}'),
  ('media', 'Media & Streaming', 'Play',
   '["watch_time_decline", "content_completion_drop", "sharing_decrease", "multi_profile_inactivity", "downgrade_attempt"]',
   '{"avg_retention_rate": 68, "avg_churn_rate": 32, "avg_ltv": 240, "avg_cac": 45}'),
  ('bfsi', 'Banking & Financial Services', 'Landmark',
   '["balance_decrease", "transaction_frequency_drop", "product_closure", "digital_login_decline", "complaint_filed"]',
   '{"avg_retention_rate": 90, "avg_churn_rate": 10, "avg_ltv": 3200, "avg_cac": 350}'),
  ('saas', 'SaaS & B2B', 'Cloud',
   '["feature_adoption_stall", "seat_reduction", "support_ticket_surge", "api_call_decline", "billing_dispute"]',
   '{"avg_retention_rate": 86, "avg_churn_rate": 14, "avg_ltv": 18500, "avg_cac": 1200}')
ON CONFLICT (name) DO NOTHING;

-- Generate 90 customers (15 per vertical)
DO $$
DECLARE
  v_rec       RECORD;
  x           BIGINT := 42;
  i           INT;
  cust_name   TEXT;
  seg         TEXT;
  tier        TEXT;
  risk        INT;
  ltv_val     INT;
  days_c      TEXT;

  first_names TEXT[] := ARRAY[
    'Aisha','Ben','Carla','David','Elena',
    'Feng','Grace','Hassan','Irene','Javier',
    'Keiko','Liam','Mira','Noah','Olivia',
    'Priya','Quinn','Raj','Sofia','Tomas',
    'Uma','Viktor','Wendy','Xander','Yuki',
    'Zara','Amit','Bianca','Carlos','Diana'
  ];
  last_names TEXT[] := ARRAY[
    'Patel','Nguyen','Garcia','Mueller','Silva',
    'Chen','Smith','Kim','Ali','Johansson',
    'Tanaka','Brown','Ivanov','Lopez','Dubois',
    'Okafor','Wright','Suzuki','Costa','Berg',
    'Sato','Wells','Park','Ramos','Fischer',
    'Das','Reed','Zhao','Torres','Lund'
  ];
  segments TEXT[] := ARRAY['high_value','mid_value','at_risk','new','dormant'];
  tiers    TEXT[] := ARRAY['platinum','gold','silver','free'];
BEGIN
  FOR v_rec IN SELECT name FROM sim_verticals ORDER BY id LOOP
    FOR i IN 1..15 LOOP
      x := (x * 16807) % 2147483647;
      cust_name := first_names[1 + (x % 30)::INT] || ' ' || last_names[1 + ((x / 30) % 30)::INT];

      x := (x * 16807) % 2147483647;
      seg := segments[1 + (x % 5)::INT];

      x := (x * 16807) % 2147483647;
      risk := (x % 100)::INT;

      x := (x * 16807) % 2147483647;
      tier := tiers[1 + (x % 4)::INT];

      x := (x * 16807) % 2147483647;
      ltv_val := 50 + (x % 9950)::INT;

      x := (x * 16807) % 2147483647;
      days_c := (1 + (x % 365))::TEXT || ' days';

      INSERT INTO sim_customers (vertical_name, name, segment, metrics, risk_score, tier, days_to_churn, ltv)
      VALUES (
        v_rec.name,
        cust_name,
        seg,
        jsonb_build_object(
          'monthly_spend',    10 + (risk * 5),
          'sessions_per_week', 1 + (risk % 12),
          'nps_score',         CASE WHEN risk < 30 THEN 9
                                    WHEN risk < 60 THEN 6
                                    ELSE 3 END,
          'tickets_open',      risk / 25
        ),
        risk,
        tier,
        days_c,
        ltv_val
      );
    END LOOP;
  END LOOP;
END;
$$;

INSERT INTO sim_health_scenarios (name, label, description, global_status, org_name, org_id, services, destinations, diagnostics, recent_dates, overall_success_rate, total_uploads, total_failures) VALUES
  (
    'healthy', 'All Systems Operational',
    'All data pipelines, connectors, and destinations are functioning normally with zero errors in the past 24 hours.',
    'healthy',
    'Acme Corp', 'org_acme_001',
    '[
      {"name": "Event Collector",  "status": "healthy", "uptime": 99.99, "latency_ms": 12,  "throughput_rps": 4500},
      {"name": "Identity Resolver","status": "healthy", "uptime": 99.97, "latency_ms": 45,  "throughput_rps": 2200},
      {"name": "Profile API",      "status": "healthy", "uptime": 99.98, "latency_ms": 28,  "throughput_rps": 3100},
      {"name": "Segment Builder",   "status": "healthy", "uptime": 99.95, "latency_ms": 320, "throughput_rps": 850}
    ]',
    '[
      {"name": "BigQuery",       "type": "warehouse",   "status": "healthy", "last_sync": "2 min ago",  "records_synced": 1450000, "error_rate": 0.0},
      {"name": "Braze",          "type": "marketing",   "status": "healthy", "last_sync": "5 min ago",  "records_synced": 820000,  "error_rate": 0.01},
      {"name": "Salesforce",     "type": "crm",         "status": "healthy", "last_sync": "8 min ago",  "records_synced": 340000,  "error_rate": 0.0},
      {"name": "Amplitude",      "type": "analytics",   "status": "healthy", "last_sync": "1 min ago",  "records_synced": 2100000, "error_rate": 0.0}
    ]',
    '[
      {"check": "Schema validation",    "status": "pass", "detail": "All 42 event schemas valid"},
      {"check": "Identity stitching",   "status": "pass", "detail": "99.6% match rate across sources"},
      {"check": "Consent compliance",   "status": "pass", "detail": "GDPR & CCPA flags enforced"},
      {"check": "Rate-limit headroom",  "status": "pass", "detail": "Peak usage at 34% of quota"}
    ]',
    '["2026-03-12","2026-03-11","2026-03-10","2026-03-09","2026-03-08","2026-03-07","2026-03-06"]',
    99.97, 14500000, 435
  ),
  (
    'degraded', 'Partial Degradation',
    'One warehouse destination is experiencing elevated error rates and a connector is reporting increased latency.',
    'degraded',
    'Globex Industries', 'org_globex_042',
    '[
      {"name": "Event Collector",  "status": "healthy",  "uptime": 99.90, "latency_ms": 18,   "throughput_rps": 3800},
      {"name": "Identity Resolver","status": "degraded", "uptime": 98.40, "latency_ms": 580,  "throughput_rps": 900},
      {"name": "Profile API",      "status": "healthy",  "uptime": 99.85, "latency_ms": 35,   "throughput_rps": 2800},
      {"name": "Segment Builder",   "status": "healthy",  "uptime": 99.70, "latency_ms": 410,  "throughput_rps": 750}
    ]',
    '[
      {"name": "Snowflake",      "type": "warehouse",   "status": "degraded", "last_sync": "47 min ago", "records_synced": 980000,  "error_rate": 4.2},
      {"name": "HubSpot",        "type": "crm",         "status": "healthy",  "last_sync": "3 min ago",  "records_synced": 210000,  "error_rate": 0.05},
      {"name": "Iterable",       "type": "marketing",   "status": "healthy",  "last_sync": "6 min ago",  "records_synced": 560000,  "error_rate": 0.1},
      {"name": "Mixpanel",       "type": "analytics",   "status": "healthy",  "last_sync": "2 min ago",  "records_synced": 1400000, "error_rate": 0.02}
    ]',
    '[
      {"check": "Schema validation",    "status": "pass",    "detail": "All 38 event schemas valid"},
      {"check": "Identity stitching",   "status": "warning", "detail": "Match rate dropped to 91.2%"},
      {"check": "Consent compliance",   "status": "pass",    "detail": "GDPR & CCPA flags enforced"},
      {"check": "Rate-limit headroom",  "status": "warning", "detail": "Peak usage at 78% of quota"}
    ]',
    '["2026-03-12","2026-03-11","2026-03-10","2026-03-09","2026-03-08","2026-03-07","2026-03-06"]',
    95.80, 11200000, 470400
  ),
  (
    'outage', 'Critical Outage',
    'The event collector is down and multiple destinations are failing. Immediate attention is required.',
    'critical',
    'Initech LLC', 'org_initech_099',
    '[
      {"name": "Event Collector",  "status": "critical", "uptime": 0.00,  "latency_ms": null, "throughput_rps": 0},
      {"name": "Identity Resolver","status": "critical", "uptime": 12.50, "latency_ms": 9800, "throughput_rps": 15},
      {"name": "Profile API",      "status": "degraded", "uptime": 88.30, "latency_ms": 1200, "throughput_rps": 420},
      {"name": "Segment Builder",   "status": "degraded", "uptime": 76.10, "latency_ms": 4500, "throughput_rps": 80}
    ]',
    '[
      {"name": "Redshift",       "type": "warehouse",   "status": "critical", "last_sync": "6 hrs ago",  "records_synced": 120000,  "error_rate": 82.5},
      {"name": "Marketo",        "type": "marketing",   "status": "critical", "last_sync": "4 hrs ago",  "records_synced": 45000,   "error_rate": 67.3},
      {"name": "Zendesk",        "type": "support",     "status": "degraded", "last_sync": "58 min ago", "records_synced": 89000,   "error_rate": 12.1},
      {"name": "Looker",         "type": "analytics",   "status": "critical", "last_sync": "5 hrs ago",  "records_synced": 62000,   "error_rate": 71.8}
    ]',
    '[
      {"check": "Schema validation",    "status": "fail",    "detail": "Unable to reach schema registry"},
      {"check": "Identity stitching",   "status": "fail",    "detail": "Service unavailable — 0% match rate"},
      {"check": "Consent compliance",   "status": "warning", "detail": "Consent checks delayed by 45 min"},
      {"check": "Rate-limit headroom",  "status": "fail",    "detail": "Quota exceeded — requests rejected"}
    ]',
    '["2026-03-12","2026-03-11","2026-03-10","2026-03-09","2026-03-08","2026-03-07","2026-03-06"]',
    17.30, 3200000, 2646400
  )
ON CONFLICT DO NOTHING;


-- ============================================================
-- 007_notifications.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'info',
  title TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  link TEXT,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, read, created_at DESC);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
CREATE POLICY "Users can read own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
CREATE POLICY "Service can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;


-- ============================================================
-- 008_manager_teams.sql
-- ============================================================

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS manager_id UUID REFERENCES auth.users(id);

CREATE INDEX IF NOT EXISTS idx_profiles_manager ON profiles(manager_id);

DO $$ BEGIN
CREATE POLICY "Managers can read reports profiles"
  ON profiles FOR SELECT
  USING (
    auth.uid() = manager_id
    OR auth.uid() = id
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;


-- ============================================================
-- 009_content_reviews.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS content_reviews (
  module_id TEXT PRIMARY KEY,
  last_reviewed TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_by UUID REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'current',
  notes TEXT DEFAULT ''
);

ALTER TABLE content_reviews ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
CREATE POLICY "Admins can manage content reviews"
  ON content_reviews FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
CREATE POLICY "All users can read content reviews"
  ON content_reviews FOR SELECT
  USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;


-- ============================================================
-- 010_glossary_overrides.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS glossary_overrides (
  term TEXT PRIMARY KEY,
  definition TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE glossary_overrides ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
CREATE POLICY "Admins can manage glossary overrides"
  ON glossary_overrides FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
CREATE POLICY "All users can read glossary overrides"
  ON glossary_overrides FOR SELECT
  USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;


-- ============================================================
-- 011_platform_settings.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS platform_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
CREATE POLICY "Admins can manage platform settings"
  ON platform_settings FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
CREATE POLICY "All users can read platform settings"
  ON platform_settings FOR SELECT
  USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;


-- ============================================================
-- 012_feedback_workflow.sql
-- ============================================================

ALTER TABLE public.feedback ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'open';
ALTER TABLE public.feedback ADD COLUMN IF NOT EXISTS addressed_by UUID REFERENCES public.profiles(id);
ALTER TABLE public.feedback ADD COLUMN IF NOT EXISTS addressed_at TIMESTAMPTZ;
ALTER TABLE public.feedback ADD COLUMN IF NOT EXISTS admin_response TEXT DEFAULT '';

CREATE INDEX IF NOT EXISTS idx_feedback_status ON public.feedback(status);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Admins can update feedback'
  ) THEN
    CREATE POLICY "Admins can update feedback" ON public.feedback
      FOR UPDATE USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
      );
  END IF;
END
$$;

-- Update handle_new_user trigger to pull Google OAuth metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    COALESCE(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(NULLIF(profiles.full_name, ''), EXCLUDED.full_name),
    avatar_url = COALESCE(NULLIF(profiles.avatar_url, ''), EXCLUDED.avatar_url);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================================
-- 013_content_tables.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS tracks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT '',
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
  icon TEXT NOT NULL DEFAULT '',
  estimated_minutes INTEGER NOT NULL DEFAULT 15,
  content_type TEXT NOT NULL DEFAULT 'concept',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (track_id, id)
);

ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
CREATE POLICY "tracks_read" ON tracks FOR SELECT TO authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
CREATE POLICY "modules_read" ON modules FOR SELECT TO authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
CREATE POLICY "tracks_admin_insert" ON tracks FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
CREATE POLICY "tracks_admin_update" ON tracks FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
CREATE POLICY "tracks_admin_delete" ON tracks FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
CREATE POLICY "modules_admin_insert" ON modules FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
CREATE POLICY "modules_admin_update" ON modules FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
CREATE POLICY "modules_admin_delete" ON modules FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Seed tracks
INSERT INTO tracks (id, title, subtitle, icon, color, estimated_hours, target_roles, mandatory, sort_order) VALUES
  ('business-essentials', 'Business Essentials', 'Understand Zeotap, the CDP market, and how we create value', '', '#3b82f6', 3, ARRAY['engineering','sales','cs','product','marketing','leadership','hr'], true, 0),
  ('product-mastery', 'Product Mastery', 'Learn to use the Unity Dashboard and every product feature', '', '#a855f7', 4, ARRAY['product','cs','sales','marketing','leadership'], false, 1),
  ('sales-enablement', 'Sales Enablement', 'Pitch, demo, handle objections, and close deals', '', '#f59e0b', 5.5, ARRAY['sales','leadership'], false, 2),
  ('cs-playbook', 'Customer Success Playbook', 'Onboard, support, and grow customer accounts', '', '#10b981', 5.5, ARRAY['cs','product','leadership'], false, 3),
  ('tam-playbook', 'Technical Account Management', 'Strategic account planning, technical onboarding, and value engineering', '', '#06b6d4', 3, ARRAY['cs','engineering','product','leadership'], false, 4),
  ('engineering', 'Engineering Deep Dive', 'Master the full technical architecture of Zeotap CDP', '', '#6366f1', 10, ARRAY['engineering'], false, 5)
ON CONFLICT (id) DO NOTHING;

-- Seed modules (Business Essentials)
INSERT INTO modules (track_id, id, title, description, icon, estimated_minutes, content_type, sort_order) VALUES
  ('business-essentials', 'what-is-zeotap', 'What is Zeotap?', 'Company mission, history, and the market we serve', '', 20, 'concept', 0),
  ('business-essentials', 'what-is-cdp', 'What is a CDP?', 'CDPs explained simply — no jargon, no code', '', 25, 'concept', 1),
  ('business-essentials', 'our-customers', 'Our Customers', 'Key verticals, use cases, and success stories', '', 20, 'concept', 2),
  ('business-essentials', 'how-zeotap-works', 'How Zeotap Works', 'Product walkthrough from the UI perspective', '', 30, 'tutorial', 3),
  ('business-essentials', 'competitive-landscape', 'Competitive Landscape', 'Where we fit in the market and how we win', '', 25, 'concept', 4),
  ('business-essentials', 'business-model', 'Our Business Model', 'How we make money and grow', '', 20, 'concept', 5)
ON CONFLICT (track_id, id) DO NOTHING;

-- Seed modules (Product Mastery)
INSERT INTO modules (track_id, id, title, description, icon, estimated_minutes, content_type, sort_order) VALUES
  ('product-mastery', 'unity-dashboard', 'Unity Dashboard', 'Navigate the dashboard, manage settings and users', '', 30, 'tutorial', 0),
  ('product-mastery', 'data-collection-ui', 'Setting Up Data Collection', 'Configure sources and verify data flow', '', 35, 'tutorial', 1),
  ('product-mastery', 'audience-builder', 'Audience Builder', 'Create segments with rules and natural language', '', 40, 'tutorial', 2),
  ('product-mastery', 'journey-canvas', 'Journey Canvas', 'Build multi-step customer journeys', '', 40, 'tutorial', 3),
  ('product-mastery', 'activating-data', 'Activating Data', 'Set up destinations and sync data', '', 35, 'tutorial', 4),
  ('product-mastery', 'reports-dashboards', 'Reports & Dashboards', 'Read analytics and measure performance', '', 30, 'tutorial', 5)
ON CONFLICT (track_id, id) DO NOTHING;

-- Seed modules (Sales Enablement)
INSERT INTO modules (track_id, id, title, description, icon, estimated_minutes, content_type, sort_order) VALUES
  ('sales-enablement', 'zeotap-pitch', 'The Zeotap Pitch', 'Value propositions by persona', '', 25, 'concept', 0),
  ('sales-enablement', 'discovery-questions', 'Discovery Questions', 'Qualification framework and key questions', '', 30, 'reference', 1),
  ('sales-enablement', 'demo-playbook', 'Demo Playbook', 'How to run an effective product demo', '', 35, 'tutorial', 2),
  ('sales-enablement', 'objection-handling', 'Objection Handling', 'Common objections and how to respond', '', 25, 'reference', 3),
  ('sales-enablement', 'case-studies', 'Case Studies', 'Customer success stories by vertical', '', 20, 'concept', 4),
  ('sales-enablement', 'battle-cards', 'Competitive Battle Cards', 'Head-to-head comparisons', '', 30, 'reference', 5),
  ('sales-enablement', 'vertical-retail', 'Vertical: Retail & E-Commerce', 'Retail-specific use cases, demo flows, and KPIs', '', 30, 'reference', 6),
  ('sales-enablement', 'vertical-finance', 'Vertical: Banking & Financial Services', 'BFSI regulatory landscape, compliance-first selling', '', 30, 'reference', 7),
  ('sales-enablement', 'vertical-telco', 'Vertical: Telecommunications', 'Telco data landscape, churn prediction, ARPU optimization', '', 30, 'reference', 8),
  ('sales-enablement', 'roi-calculator', 'ROI & Business Case Builder', 'Build compelling business cases for CFOs', '', 25, 'reference', 9)
ON CONFLICT (track_id, id) DO NOTHING;

-- Seed modules (CS Playbook)
INSERT INTO modules (track_id, id, title, description, icon, estimated_minutes, content_type, sort_order) VALUES
  ('cs-playbook', 'onboarding-checklist', 'Onboarding Checklist', '30-60-90 day plan for new customers', '', 30, 'tutorial', 0),
  ('cs-playbook', 'health-score', 'Health Score Guide', 'Key metrics and risk indicators', '', 25, 'concept', 1),
  ('cs-playbook', 'troubleshooting', 'Troubleshooting', 'Common issues and diagnostic flows', '', 40, 'reference', 2),
  ('cs-playbook', 'escalation-path', 'Escalation Path', 'When and how to escalate issues', '', 20, 'reference', 3),
  ('cs-playbook', 'renewal-expansion', 'Renewal & Expansion', 'Growing accounts and preventing churn', '', 30, 'concept', 4),
  ('cs-playbook', 'integration-guides', 'Integration Guides', 'Step-by-step setup for top destinations', '', 35, 'tutorial', 5),
  ('cs-playbook', 'health-score-deep-dive', 'Health Score Deep Dive', 'Weighted scoring methodology and intervention playbooks', '', 30, 'reference', 6),
  ('cs-playbook', 'expansion-playbook', 'Expansion & Upsell Playbook', 'Signals, frameworks, and plays for growing accounts', '', 35, 'tutorial', 7),
  ('cs-playbook', 'vertical-success-guides', 'Vertical Success Guides', 'Industry-specific success criteria and onboarding priorities', '', 35, 'reference', 8),
  ('cs-playbook', 'qbr-template', 'QBR & Executive Review Template', 'Complete QBR structure and data preparation guide', '', 25, 'tutorial', 9)
ON CONFLICT (track_id, id) DO NOTHING;

-- Seed modules (TAM Playbook)
INSERT INTO modules (track_id, id, title, description, icon, estimated_minutes, content_type, sort_order) VALUES
  ('tam-playbook', 'account-planning', 'Strategic Account Planning', 'Tier classification, stakeholder mapping, adoption roadmaps', '', 30, 'tutorial', 0),
  ('tam-playbook', 'technical-onboarding', 'Technical Onboarding Mastery', '8-week implementation from SDK to activation', '', 35, 'tutorial', 1),
  ('tam-playbook', 'architecture-review', 'Customer Architecture Reviews', 'Data architecture patterns and integration approaches', '', 30, 'reference', 2),
  ('tam-playbook', 'data-quality-ops', 'Data Quality Operations', 'Monitoring, diagnostics, and proactive quality management', '', 25, 'reference', 3),
  ('tam-playbook', 'value-engineering', 'Value Engineering & ROI Tracking', 'Quantify and present value delivered to customers', '', 30, 'concept', 4),
  ('tam-playbook', 'advanced-use-cases', 'Advanced Use Case Library', '12+ advanced identity, audience, journey, and activation use cases', '', 35, 'reference', 5)
ON CONFLICT (track_id, id) DO NOTHING;

-- Seed modules (Engineering Deep Dive)
INSERT INTO modules (track_id, id, title, description, icon, estimated_minutes, content_type, sort_order) VALUES
  ('engineering', 'platform-overview', 'Platform Overview', 'Architecture pillars: Collect, Unify, Activate', '', 15, 'concept', 0),
  ('engineering', 'data-collection', 'Data Collection & SDKs', 'Web, Mobile, and Server-side SDKs', '', 20, 'deep-dive', 1),
  ('engineering', 'data-ingestion', 'Data Ingestion Pipelines', 'Kafka, Beam, Spark, CDAP', '', 25, 'deep-dive', 2),
  ('engineering', 'identity-resolution', 'Identity Resolution', 'UCID, deterministic & probabilistic matching', '', 20, 'deep-dive', 3),
  ('engineering', 'profile-store', 'Profile Store', 'Delta Lake, ACID transactions, BigQuery', '', 20, 'deep-dive', 4),
  ('engineering', 'audience-management', 'Audience Management', 'Real-time segmentation engine', '', 25, 'deep-dive', 5),
  ('engineering', 'customer-journeys', 'Customer Journeys', 'Multi-step orchestration engine', '', 20, 'deep-dive', 6),
  ('engineering', 'data-activation', 'Data Activation', '100+ destination connectors', '', 20, 'deep-dive', 7),
  ('engineering', 'genai-zoe', 'GenAI & Zoe Assistant', 'Vertex AI, RAG, natural language queries', '', 20, 'deep-dive', 8),
  ('engineering', 'ml-platform', 'ML Platform', 'Vertex AI, propensity scoring, feature store', '', 25, 'deep-dive', 9),
  ('engineering', 'reporting-bi', 'Reporting & BI', 'BigQuery, Druid, Redshift analytics', '', 20, 'deep-dive', 10),
  ('engineering', 'unity-dashboard-tech', 'Unity Dashboard (Tech)', 'React SPA, micro-frontends, API gateway', '', 20, 'deep-dive', 11),
  ('engineering', 'privacy-gdpr', 'Privacy & GDPR', 'Consent management, right to erasure', '', 25, 'deep-dive', 12),
  ('engineering', 'auth-iam', 'Auth & IAM', 'OAuth 2.0, SAML, RBAC via Auth0', '', 20, 'deep-dive', 13),
  ('engineering', 'infrastructure', 'Infrastructure', 'GKE, Terraform, multi-region', '', 30, 'deep-dive', 14),
  ('engineering', 'observability', 'Observability', 'Prometheus, Grafana, OpenTelemetry', '', 20, 'deep-dive', 15),
  ('engineering', 'cicd', 'CI/CD Pipelines', 'CloudBuild, ArgoCD, GitOps', '', 20, 'deep-dive', 16),
  ('engineering', 'testing', 'Testing & QA', 'Contract testing, chaos engineering, E2E', '', 20, 'deep-dive', 17)
ON CONFLICT (track_id, id) DO NOTHING;

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tracks_updated_at ON tracks;
CREATE TRIGGER tracks_updated_at BEFORE UPDATE ON tracks
  FOR EACH ROW EXECUTE FUNCTION update_content_updated_at();

DROP TRIGGER IF EXISTS modules_updated_at ON modules;
CREATE TRIGGER modules_updated_at BEFORE UPDATE ON modules
  FOR EACH ROW EXECUTE FUNCTION update_content_updated_at();


-- ============================================================
-- 014_adoption_targets.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS adoption_targets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team TEXT,
  role TEXT,
  track_id TEXT NOT NULL,
  target_pct INTEGER NOT NULL DEFAULT 80,
  deadline TIMESTAMPTZ NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_adoption_targets_track ON adoption_targets(track_id);
CREATE INDEX IF NOT EXISTS idx_adoption_targets_deadline ON adoption_targets(deadline);

ALTER TABLE adoption_targets ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
CREATE POLICY "Admins can manage adoption targets"
  ON adoption_targets FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
CREATE POLICY "Authenticated users can view adoption targets"
  ON adoption_targets FOR SELECT
  USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;


-- ============================================================
-- 015_notification_preferences.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS notification_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  preferences JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
CREATE POLICY "Users can read own notification preferences"
  ON notification_preferences FOR SELECT
  USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
CREATE POLICY "Users can upsert own notification preferences"
  ON notification_preferences FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;


-- ============================================================
-- DONE! All 15 migrations applied.
-- ============================================================
