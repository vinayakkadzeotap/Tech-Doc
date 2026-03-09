-- Add unique constraint on progress table if it was created without one.
-- This is required for Supabase upsert with onConflict to work.
-- Run this in Supabase SQL Editor if you see 409 errors on progress upserts.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'progress_user_id_track_id_module_id_key'
  ) THEN
    -- Remove duplicates first (keep the most recent row per user/track/module)
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
