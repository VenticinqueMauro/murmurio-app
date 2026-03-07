-- Migración: Fase 1 — El Ritual
-- Ejecutar en el SQL Editor de Supabase

-- 1. Seguimiento de micro-acción en sesiones previas
ALTER TABLE public.sessions
  ADD COLUMN IF NOT EXISTS micro_action_followup TEXT
  CHECK (micro_action_followup IN ('si', 'parcialmente', 'no'));

-- 2. Función para actualizar racha del usuario tras una sesión
CREATE OR REPLACE FUNCTION public.update_streak(p_user_id UUID)
RETURNS void AS $$
DECLARE
  v_last_date DATE;
  v_today DATE := CURRENT_DATE;
BEGIN
  SELECT last_session_date INTO v_last_date
  FROM public.profiles WHERE id = p_user_id;

  IF v_last_date IS NULL THEN
    -- Primera sesión
    UPDATE public.profiles
      SET streak_count = 1, last_session_date = v_today
    WHERE id = p_user_id;

  ELSIF v_last_date = v_today THEN
    -- Ya tiene sesión hoy, no cambiar
    NULL;

  ELSIF v_last_date = v_today - INTERVAL '1 day' THEN
    -- Sesión consecutiva — sumar tablón
    UPDATE public.profiles
      SET streak_count = streak_count + 1, last_session_date = v_today
    WHERE id = p_user_id;

  ELSE
    -- Racha rota — reiniciar (la grieta queda en el bridge visual)
    UPDATE public.profiles
      SET streak_count = 1, last_session_date = v_today
    WHERE id = p_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.update_streak(UUID) TO authenticated;
