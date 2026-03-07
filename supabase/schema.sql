-- Bridge — Schema SQL
-- Ejecutar en el SQL Editor de Supabase

-- ============================================================
-- PROFILES (extensión de auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  display_name TEXT,
  timezone TEXT DEFAULT 'UTC',
  streak_count INTEGER DEFAULT 0,
  last_session_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Auto-crear perfil al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- SESSIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  prompt TEXT NOT NULL,
  raw_text TEXT,
  duration_seconds INTEGER,
  mood_before INTEGER CHECK (mood_before BETWEEN 1 AND 10),
  mood_after INTEGER CHECK (mood_after BETWEEN 1 AND 10),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sessions_select_own" ON public.sessions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "sessions_insert_own" ON public.sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "sessions_update_own" ON public.sessions
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "sessions_delete_own" ON public.sessions
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- LATENCY DATA
-- ============================================================
CREATE TABLE IF NOT EXISTS public.latency_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE NOT NULL,
  word TEXT NOT NULL,
  position_in_text INTEGER NOT NULL,
  latency_ms INTEGER NOT NULL,
  is_hesitation BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.latency_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "latency_select_own" ON public.latency_data
  FOR SELECT USING (
    auth.uid() = (SELECT user_id FROM public.sessions WHERE id = session_id)
  );
CREATE POLICY "latency_insert_own" ON public.latency_data
  FOR INSERT WITH CHECK (
    auth.uid() = (SELECT user_id FROM public.sessions WHERE id = session_id)
  );

-- ============================================================
-- INSIGHTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.insights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  top_words TEXT[] NOT NULL DEFAULT '{}',
  contradictions TEXT[] DEFAULT '{}',
  micro_action TEXT,
  reflection_questions TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "insights_select_own" ON public.insights
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "insights_insert_own" ON public.insights
  FOR INSERT WITH CHECK (auth.uid() = user_id);
