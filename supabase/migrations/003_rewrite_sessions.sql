-- Migración: Reescritura de Recuerdos
-- Ejecutar en el SQL Editor de Supabase

CREATE TABLE public.rewrite_sessions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  act1_text  TEXT NOT NULL,
  act2_text  TEXT NOT NULL,
  act3_text  TEXT NOT NULL,
  insight    TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.rewrite_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can manage own rewrite sessions"
  ON public.rewrite_sessions
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
