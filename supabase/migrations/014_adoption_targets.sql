-- Adoption targets for OKR tracking
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

-- Index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_adoption_targets_track ON adoption_targets(track_id);
CREATE INDEX IF NOT EXISTS idx_adoption_targets_deadline ON adoption_targets(deadline);

-- RLS
ALTER TABLE adoption_targets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage adoption targets"
  ON adoption_targets FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Authenticated users can view adoption targets"
  ON adoption_targets FOR SELECT
  USING (auth.role() = 'authenticated');
