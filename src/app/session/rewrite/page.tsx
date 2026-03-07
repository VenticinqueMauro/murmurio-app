'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

type Step = 'intro' | 'act1' | 'act2' | 'act3' | 'analyzing' | 'results';

const ACTS = [
  {
    num: 1,
    label: 'Acto 1',
    instruction: 'Escribí el evento como lo recordás hoy.',
    sublabel: 'No lo planees. Empezá y describí todo lo que viene, sin filtros.',
    button: 'Continuar al acto 2',
  },
  {
    num: 2,
    label: 'Acto 2',
    instruction: 'Ahora escribilo desde la perspectiva de alguien que te quiere profundamente.',
    sublabel: 'Esa persona conoce todo el contexto, pero te mira con compasión total.',
    button: 'Continuar al acto 3',
  },
  {
    num: 3,
    label: 'Acto 3',
    instruction: '¿Cómo querés recordar este evento en 5 años?',
    sublabel: 'Escribilo como si ya pasó ese tiempo y lo estás viendo desde lejos.',
    button: 'Ver la observación de Agamenón',
  },
] as const;

const MIN_WORDS = 30;

function ActEditor({
  act,
  onComplete,
}: {
  act: (typeof ACTS)[number];
  onComplete: (text: string) => void;
}) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Cabecera del acto */}
      <div>
        <p
          className="text-xs font-medium tracking-widest uppercase mb-1"
          style={{ color: 'var(--amber)' }}
        >
          {act.label} de 3
        </p>
        <h2 className="text-xl font-light" style={{ color: 'var(--text)' }}>
          {act.instruction}
        </h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          {act.sublabel}
        </p>
      </div>

      {/* Indicador de progreso */}
      <div className="flex gap-1">
        {ACTS.map((a) => (
          <div
            key={a.num}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 2,
              background: a.num <= act.num ? 'var(--amber)' : 'var(--surface-2)',
            }}
          />
        ))}
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onPaste={(e) => e.preventDefault()}
        placeholder="Escribí aquí — no podrás borrar."
        autoFocus
        className="w-full min-h-[280px] p-5 rounded-lg resize-none outline-none text-base leading-relaxed"
        style={{
          background: 'var(--surface)',
          color: 'var(--text)',
          border: '1px solid var(--border)',
          fontFamily: 'var(--font-geist-mono)',
          caretColor: 'var(--amber)',
        }}
      />

      {/* Footer */}
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: 'var(--text-subtle)' }}>
          {wordCount} / {MIN_WORDS} palabras
        </p>
        <button
          onClick={() => onComplete(text)}
          disabled={!canSubmit}
          className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
          style={{
            background: canSubmit ? 'var(--amber)' : 'var(--surface-2)',
            color: canSubmit ? 'var(--btn-primary-text)' : 'var(--text-subtle)',
            cursor: canSubmit ? 'pointer' : 'not-allowed',
          }}
        >
          {act.button}
        </button>
      </div>
    </div>
  );
}

export default function RewritePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('intro');
  const [act1, setAct1] = useState('');
  const [act2, setAct2] = useState('');
  const [act3, setAct3] = useState('');
  const [insight, setInsight] = useState('');
  const [error, setError] = useState('');

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

  const handleAct1Complete = (text: string) => {
    setAct1(text);
    setStep('act2');
  };

  const handleAct2Complete = (text: string) => {
    setAct2(text);
    setStep('act3');
  };

  const handleAct3Complete = async (text: string) => {
    setAct3(text);
    setStep('analyzing');
    setError('');

    try {
      const res = await fetch('/api/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ act1, act2, act3: text }),
      });

      if (!res.ok) throw new Error('Error al analizar');
      const data = await res.json();
      setInsight(data.insight);
      setStep('results');
    } catch {
      setError('Hubo un error. Intentá de nuevo.');
      setStep('act3');
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
              <h1 className="text-2xl font-light">Reescritura de Recuerdos</h1>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Vas a escribir el mismo evento tres veces, desde tres perspectivas distintas.
                Cada acto es irrevocable — no se puede borrar lo que ya se escribió.
              </p>
            </div>

            <div className="space-y-3">
              {ACTS.map((act) => (
                <div
                  key={act.num}
                  className="flex gap-4 p-4 rounded-lg"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                >
                  <span
                    className="text-xs font-medium shrink-0 mt-0.5"
                    style={{ color: 'var(--amber)' }}
                  >
                    {act.label}
                  </span>
                  <div>
                    <p className="text-sm" style={{ color: 'var(--text)' }}>
                      {act.instruction}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-subtle)' }}>
                      {act.sublabel}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs" style={{ color: 'var(--text-subtle)' }}>
              Mínimo 30 palabras por acto. La sesión completa toma unos 15-20 minutos.
            </p>

            {error && (
              <p className="text-sm" style={{ color: '#c15a28' }}>
                {error}
              </p>
            )}

            <div className="flex gap-3">
              <Link
                href="/dashboard"
                className="flex-1 py-3 rounded-lg text-sm font-medium text-center transition-all"
                style={{
                  background: 'var(--surface)',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border)',
                }}
              >
                Volver
              </Link>
              <button
                onClick={() => setStep('act1')}
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

        {step === 'act1' && <ActEditor act={ACTS[0]} onComplete={handleAct1Complete} />}
        {step === 'act2' && <ActEditor act={ACTS[1]} onComplete={handleAct2Complete} />}
        {step === 'act3' && <ActEditor act={ACTS[2]} onComplete={handleAct3Complete} />}

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
                Comparando los tres actos
              </p>
            </div>
          </div>
        )}

        {/* Resultados */}
        {step === 'results' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <p
                className="text-xs font-medium tracking-widest uppercase mb-2"
                style={{ color: 'var(--amber)' }}
              >
                Lo que vio Agamenón
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

            {/* Los tres actos (colapsados) */}
            <div className="space-y-2">
              <p
                className="text-xs font-medium tracking-widest uppercase"
                style={{ color: 'var(--text-subtle)' }}
              >
                Los tres actos
              </p>
              {[
                { label: 'Acto 1 — Como lo recordás', text: act1 },
                { label: 'Acto 2 — Con los ojos de quien te quiere', text: act2 },
                { label: 'Acto 3 — En 5 años', text: act3 },
              ].map(({ label, text }) => (
                <details
                  key={label}
                  className="rounded-lg overflow-hidden"
                  style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
                >
                  <summary
                    className="p-3 text-xs cursor-pointer select-none"
                    style={{ color: 'var(--text-subtle)' }}
                  >
                    {label}
                  </summary>
                  <p
                    className="px-4 pb-4 text-sm leading-relaxed"
                    style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-geist-mono)' }}
                  >
                    {text}
                  </p>
                </details>
              ))}
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
