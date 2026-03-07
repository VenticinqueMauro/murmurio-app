'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

type Step = 'intro' | 'habit' | 'writing' | 'analyzing' | 'results';

const MIN_WORDS = 40;

export default function AversionPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('intro');
  const [habit, setHabit] = useState('');
  const [text, setText] = useState('');
  const [insight, setInsight] = useState('');
  const [error, setError] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const check = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) router.push('/login');
    };
    check();
  }, [router]);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const canSubmit = wordCount >= MIN_WORDS;

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      e.key === 'Backspace' ||
      e.key === 'Delete' ||
      ((e.ctrlKey || e.metaKey) && ['z', 'Z', 'x', 'X'].includes(e.key))
    ) {
      e.preventDefault();
    }
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const val = e.target.value;
      if (val.length < text.length) {
        if (textareaRef.current) textareaRef.current.value = text;
        return;
      }
      setText(val);
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = val.length;
          textareaRef.current.selectionEnd = val.length;
        }
      });
    },
    [text]
  );

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setStep('analyzing');
    setError('');

    try {
      const res = await fetch('/api/aversion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ habit, text }),
      });

      if (!res.ok) throw new Error();
      const data = await res.json();
      setInsight(data.insight);
      setStep('results');
    } catch {
      setError('Hubo un error. Intentá de nuevo.');
      setStep('writing');
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <div className="max-w-2xl mx-auto px-4 py-12">

        {/* Intro */}
        {step === 'intro' && (
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-2">
              <p
                className="text-xs font-medium tracking-widest uppercase"
                style={{ color: 'var(--amber)' }}
              >
                Módulo de Transformación
              </p>
              <h1 className="text-2xl font-light">Técnica de Aversión Guiada</h1>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                No es sobre odiar el hábito. Es sobre conocerlo tan bien que pierda poder.
              </p>
            </div>

            <div className="space-y-4">
              <div
                className="p-4 rounded-lg"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              >
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
                  Vas a escribir sobre un hábito que querés eliminar — pero en lugar de
                  resistirlo, lo vas a amplificar. Todo lo negativo. Sin suavizarlo ni
                  buscarle excusas. Dejar que aparezca completo.
                </p>
              </div>
              <div
                className="p-4 rounded-lg"
                style={{ background: 'var(--surface-2)', borderLeft: '3px solid var(--amber)' }}
              >
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  La supresión refuerza el hábito. La exploración dirigida lo debilita.
                  Este ejercicio no requiere fuerza de voluntad — requiere honestidad.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Link
                href="/dashboard"
                className="flex-1 py-3 rounded-lg text-sm font-medium text-center"
                style={{
                  background: 'var(--surface)',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border)',
                }}
              >
                Volver
              </Link>
              <button
                onClick={() => setStep('habit')}
                className="flex-1 py-3 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: 'var(--amber)',
                  color: 'var(--btn-primary-text)',
                  cursor: 'pointer',
                }}
              >
                Comenzar
              </button>
            </div>
          </div>
        )}

        {/* Nombrá el hábito */}
        {step === 'habit' && (
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-2">
              <p
                className="text-xs font-medium tracking-widest uppercase"
                style={{ color: 'var(--amber)' }}
              >
                Paso 1
              </p>
              <h2 className="text-xl font-light">¿Qué hábito querés trabajar?</h2>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Nombralo en pocas palabras. No necesitás justificarte.
              </p>
            </div>

            <input
              type="text"
              value={habit}
              onChange={(e) => setHabit(e.target.value)}
              placeholder="Ej: revisar el teléfono de noche, comer azúcar, el alcohol..."
              autoFocus
              className="w-full px-4 py-3 rounded-lg outline-none text-base"
              style={{
                background: 'var(--surface)',
                color: 'var(--text)',
                border: '1px solid var(--border)',
                caretColor: 'var(--amber)',
              }}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = 'var(--amber-dim)')
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = 'var(--border)')
              }
            />

            <button
              onClick={() => habit.trim() && setStep('writing')}
              disabled={!habit.trim()}
              className="w-full py-3 rounded-lg text-sm font-medium transition-all"
              style={{
                background: habit.trim() ? 'var(--amber)' : 'var(--surface-2)',
                color: habit.trim() ? 'var(--btn-primary-text)' : 'var(--text-subtle)',
                cursor: habit.trim() ? 'pointer' : 'not-allowed',
              }}
            >
              Continuar
            </button>
          </div>
        )}

        {/* Escritura */}
        {step === 'writing' && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <p
                className="text-xs font-medium tracking-widest uppercase mb-1"
                style={{ color: 'var(--amber)' }}
              >
                {habit}
              </p>
              <h2 className="text-xl font-light" style={{ color: 'var(--text)' }}>
                Escribí todo lo negativo. Sin suavizarlo.
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                Amplifícalo. Que aparezca completo. No hay respuesta incorrecta.
              </p>
            </div>

            <textarea
              ref={textareaRef}
              value={text}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onPaste={(e) => e.preventDefault()}
              placeholder="Lo peor de este hábito es..."
              autoFocus
              className="w-full min-h-[300px] p-5 rounded-lg resize-none outline-none text-base leading-relaxed"
              style={{
                background: 'var(--surface)',
                color: 'var(--text)',
                border: '1px solid var(--border)',
                fontFamily: 'var(--font-geist-mono)',
                caretColor: 'var(--amber)',
              }}
            />

            {error && (
              <p className="text-sm" style={{ color: '#c15a28' }}>
                {error}
              </p>
            )}

            <div className="flex items-center justify-between">
              <p className="text-sm" style={{ color: 'var(--text-subtle)' }}>
                {wordCount} / {MIN_WORDS} palabras
              </p>
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: canSubmit ? 'var(--amber)' : 'var(--surface-2)',
                  color: canSubmit ? 'var(--btn-primary-text)' : 'var(--text-subtle)',
                  cursor: canSubmit ? 'pointer' : 'not-allowed',
                }}
              >
                Ver lo que observó Agamenón
              </button>
            </div>
          </div>
        )}

        {/* Analizando */}
        {step === 'analyzing' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-fade-in">
            <div
              className="w-12 h-12 rounded-full border-2 animate-spin"
              style={{ borderColor: 'var(--amber)', borderTopColor: 'transparent' }}
            />
            <div className="text-center space-y-1">
              <p className="text-lg font-light" style={{ color: 'var(--text)' }}>
                Agamenón está observando...
              </p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Leyendo lo que el hábito reveló
              </p>
            </div>
          </div>
        )}

        {/* Resultados */}
        {step === 'results' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <p
                className="text-xs font-medium tracking-widest uppercase mb-1"
                style={{ color: 'var(--amber)' }}
              >
                Lo que vio Agamenón — {habit}
              </p>
              <div
                className="p-5 rounded-lg"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              >
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--text)', whiteSpace: 'pre-wrap', fontStyle: 'italic' }}
                >
                  {insight}
                </p>
              </div>
            </div>

            <div
              className="p-4 rounded-lg"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
            >
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-subtle)' }}>
                Esta sesión no queda guardada. Su función fue la exploración, no el registro.
              </p>
            </div>

            <Link
              href="/dashboard"
              className="block w-full py-3 rounded-lg text-sm font-medium text-center transition-all"
              style={{ background: 'var(--amber)', color: 'var(--btn-primary-text)' }}
            >
              Volver al inicio
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
