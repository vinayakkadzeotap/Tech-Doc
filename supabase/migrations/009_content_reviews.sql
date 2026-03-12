-- Content review tracking
CREATE TABLE IF NOT EXISTS content_reviews (
  module_id TEXT PRIMARY KEY,
  last_reviewed TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_by UUID REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'current', -- 'current', 'needs-review', 'stale'
  notes TEXT DEFAULT ''
);

ALTER TABLE content_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage content reviews"
  ON content_reviews FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "All users can read content reviews"
  ON content_reviews FOR SELECT
  USING (true);
