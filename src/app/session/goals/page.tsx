'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

type Step = 'intro' | 'writing' | 'analyzing' | 'results';

const MIN_WORDS = 20;

export default function GoalsPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('intro');
  const [text, setText] = useState('');
  const [microActions, setMicroActions] = useState<string[]>([]);
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
      const res = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sensory_description: text }),
      });

      if (!res.ok) throw new Error();
      const data = await res.json();
      setMicroActions(data.micro_actions);
      setStep('results');
    } catch {
      setError('No se pudo generar la meta. Intentá de nuevo.');
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
              <h1 className="text-2xl font-light">Visualización de Metas</h1>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                No describas lo que querés hacer. Describí cómo te sentís cuando ya lo lograste.
                Qué ves, qué olés, qué escuchás, qué sentís en el cuerpo.
              </p>
            </div>

            <div
              className="p-4 rounded-lg space-y-2"
              style={{ background: 'var(--surface-2)', borderLeft: '3px solid var(--amber)' }}
            >
              <p className="text-xs font-medium" style={{ color: 'var(--amber)' }}>
                No escribas:
              </p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                &ldquo;Quiero ser exitoso y tener libertad financiera.&rdquo;
              </p>
              <p className="text-xs font-medium mt-3" style={{ color: 'var(--amber)' }}>
                Escribí:
              </p>
              <p className="text-sm" style={{ color: 'var(--text)' }}>
                &ldquo;Me levanto sin alarma. El departamento huele a café. No reviso el teléfono hasta
                que termino de desayunar. Me siento liviano.&rdquo;
              </p>
            </div>

            <p className="text-xs" style={{ color: 'var(--text-subtle)' }}>
              A partir de tu descripción, Agamenón va a construir 5 micro-acciones concretas.
              Estas acciones aparecerán silenciosamente en tus próximas sesiones.
            </p>

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
                onClick={() => setStep('writing')}
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

        {/* Escritura */}
        {step === 'writing' && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <p
                className="text-xs font-medium tracking-widest uppercase mb-1"
                style={{ color: 'var(--amber)' }}
              >
                Tu meta, en primera persona
              </p>
              <h2 className="text-xl font-light" style={{ color: 'var(--text)' }}>
                ¿Cómo te sentís cuando ya lo lograste?
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                Describilo sensorialmente. No hay respuesta correcta.
              </p>
            </div>

            <textarea
              ref={textareaRef}
              value={text}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onPaste={(e) => e.preventDefault()}
              placeholder="Me levanto y siento..."
              autoFocus
              className="w-full min-h-[240px] p-5 rounded-lg resize-none outline-none text-base leading-relaxed"
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
                Construir mi camino
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
                Agamenón está construyendo el camino...
              </p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Fragmentando tu meta en pasos concretos
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
                Tu camino
              </p>
              <h2 className="text-xl font-light" style={{ color: 'var(--text)' }}>
                5 micro-acciones para llegar ahí
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                Agamenón las incorporará silenciosamente a tus próximas sesiones.
              </p>
            </div>

            <div className="space-y-3">
              {microActions.map((action, i) => (
                <div
                  key={i}
                  className="flex gap-4 p-4 rounded-lg"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                >
                  <span
                    className="text-xs font-medium shrink-0 mt-0.5 w-4 text-right"
                    style={{ color: 'var(--amber)' }}
                  >
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
                    {action}
                  </p>
                </div>
              ))}
            </div>

            <div
              className="p-4 rounded-lg"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
            >
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-subtle)' }}>
                Tu descripción original permanece guardada. La próxima vez que crees una meta,
                esta será reemplazada.
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
