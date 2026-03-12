-- Glossary overrides (admin edits to default terms)
CREATE TABLE IF NOT EXISTS glossary_overrides (
  term TEXT PRIMARY KEY,
  definition TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE glossary_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage glossary overrides"
  ON glossary_overrides FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "All users can read glossary overrides"
  ON glossary_overrides FOR SELECT
  USING (true);
