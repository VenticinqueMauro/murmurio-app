-- Migration 005: Programas especializados
-- Agrega soporte para programas de usuario en profiles y sessions

-- Columna program en profiles (default 'bienestar' para retrocompatibilidad)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS program TEXT DEFAULT 'bienestar';

-- Columna program en sessions para tracking histórico (analytics futuro)
ALTER TABLE public.sessions
  ADD COLUMN IF NOT EXISTS program TEXT;
