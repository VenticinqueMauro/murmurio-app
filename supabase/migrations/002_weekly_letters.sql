-- Migración: Carta Semanal de Agamenón
-- Ejecutar en el SQL Editor de Supabase

CREATE TABLE public.weekly_letters (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  week_start   DATE NOT NULL,
  content      TEXT NOT NULL,
  top_words    TEXT[] NOT NULL DEFAULT '{}',
  mood_delta   NUMERIC(4,2),
  session_count INT NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, week_start)
);

ALTER TABLE public.weekly_letters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can read own weekly letters"
  ON public.weekly_letters FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "users can insert own weekly letters"
  ON public.weekly_letters FOR INSERT
  WITH CHECK (auth.uid() = user_id);
