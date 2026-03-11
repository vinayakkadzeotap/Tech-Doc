-- 006_simulator_seed.sql
-- Seed data for ZeoAI simulator tables

-- ============================================================
-- 1. Schema Fields (15 rows)
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
   '[true, false]');

-- ============================================================
-- 2. Campaign Presets (5 rows)
-- ============================================================
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
   '{"category_affinity": ["fashion", "sports"], "country": ["US", "UK", "DE"], "age_range": [18, 55], "channels": ["email", "push", "paid_social"]}');

-- ============================================================
-- 3. Verticals (6 rows)
-- ============================================================
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
   '{"avg_retention_rate": 86, "avg_churn_rate": 14, "avg_ltv": 18500, "avg_cac": 1200}');

-- ============================================================
-- 4. Customers — 15 per vertical (90 total) via deterministic LCG
-- ============================================================
DO $$
DECLARE
  v_rec       RECORD;
  x           BIGINT := 42;          -- LCG seed
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
      -- advance LCG
      x := (x * 16807) % 2147483647;

      -- derive fields from x
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

-- ============================================================
-- 5. Health Scenarios (3 rows)
-- ============================================================
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
  );
