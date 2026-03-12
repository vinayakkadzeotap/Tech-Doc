-- Add manager_id to profiles for team hierarchy
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS manager_id UUID REFERENCES auth.users(id);

-- Index for fast team lookups
CREATE INDEX IF NOT EXISTS idx_profiles_manager ON profiles(manager_id);

-- Allow managers to read their reports' profiles and progress
CREATE POLICY "Managers can read reports profiles"
  ON profiles FOR SELECT
  USING (
    auth.uid() = manager_id
    OR auth.uid() = id
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
  );
