-- Feedback workflow: add status tracking and admin response fields
ALTER TABLE public.feedback ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'open';
ALTER TABLE public.feedback ADD COLUMN IF NOT EXISTS addressed_by UUID REFERENCES public.profiles(id);
ALTER TABLE public.feedback ADD COLUMN IF NOT EXISTS addressed_at TIMESTAMPTZ;
ALTER TABLE public.feedback ADD COLUMN IF NOT EXISTS admin_response TEXT DEFAULT '';

CREATE INDEX IF NOT EXISTS idx_feedback_status ON public.feedback(status);

-- Allow admins to update feedback status
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

-- Allow admins to read all feedback
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Admins can read all feedback'
  ) THEN
    CREATE POLICY "Admins can read all feedback" ON public.feedback
      FOR SELECT USING (
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
