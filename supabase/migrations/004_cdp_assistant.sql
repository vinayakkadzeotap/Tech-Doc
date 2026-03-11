-- CDP Assistant — Chat sessions & messages
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- 1. Chat sessions
CREATE TABLE public.chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL DEFAULT 'New conversation',
  skill_ids TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Chat messages
CREATE TABLE public.chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  matched_skills TEXT[] DEFAULT '{}',
  tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Row Level Security ────────────────────────────────────────────

ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Sessions: users manage their own, admins can read all
CREATE POLICY "Users can manage own sessions" ON public.chat_sessions
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can read all sessions" ON public.chat_sessions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );

-- Messages: users manage their own, admins can read all
CREATE POLICY "Users can manage own messages" ON public.chat_messages
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can read all messages" ON public.chat_messages
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );

-- ── Indexes ──────────────────────────────────────────────────────

CREATE INDEX idx_chat_sessions_user ON public.chat_sessions(user_id);
CREATE INDEX idx_chat_messages_session ON public.chat_messages(session_id);
CREATE INDEX idx_chat_messages_user ON public.chat_messages(user_id);
