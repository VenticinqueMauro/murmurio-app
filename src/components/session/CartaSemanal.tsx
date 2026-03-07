'use client';

import { useState } from 'react';

interface WeeklyLetter {
  content: string;
  top_words: string[];
  mood_delta: number | null;
  session_count: number;
}

interface Props {
  initialLetter: WeeklyLetter | null;
  sessionCountThisWeek: number;
}

export function CartaSemanal({ initialLetter, sessionCountThisWeek }: Props) {
  const [letter, setLetter] = useState<WeeklyLetter | null>(initialLetter);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!letter && sessionCountThisWeek < 2) return null;

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/weekly-letter');
      if (!res.ok) throw new Error();
      const data: WeeklyLetter = await res.json();
      setLetter(data);
    } catch {
      setError('No se pudo generar la carta. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const weekLabel = new Date().toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
  });

  return (
    <div
      className="p-5 rounded-lg space-y-4"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      <div className="flex items-center justify-between">
        <p
          className="text-xs font-medium tracking-widest uppercase"
          style={{ color: 'var(--text-subtle)' }}
        >
          Carta de Agamenón
        </p>
        <p className="text-xs" style={{ color: 'var(--text-subtle)' }}>
          semana del {weekLabel}
        </p>
      </div>

      {letter ? (
        <div className="space-y-4">
          <p
            className="text-sm leading-relaxed"
            style={{
              color: 'var(--text)',
              whiteSpace: 'pre-wrap',
              fontStyle: 'italic',
            }}
          >
            {letter.content}
          </p>

          <div
            className="flex flex-wrap items-center gap-1 pt-3"
            style={{ borderTop: '1px solid var(--border)' }}
          >
            {letter.top_words.map((w, i) => (
              <span
                key={i}
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  background: 'rgba(193,125,40,0.12)',
                  color: 'var(--amber-light)',
                }}
              >
                {w}
              </span>
            ))}
            {letter.mood_delta !== null && (
              <span
                className="text-xs px-2 py-0.5 rounded-full ml-auto"
                style={{
                  color: letter.mood_delta >= 0 ? 'var(--amber)' : '#c15a28',
                  background: 'var(--surface-2)',
                }}
              >
                {letter.mood_delta >= 0 ? '+' : ''}
                {letter.mood_delta} pts esta semana
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Tuviste {sessionCountThisWeek} sesiones esta semana.
            Agamenón tiene algo que decirte.
          </p>
          {error && (
            <p className="text-xs" style={{ color: '#c15a28' }}>
              {error}
            </p>
          )}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-2.5 rounded-lg text-sm font-medium transition-all"
            style={{
              background: loading ? 'var(--surface-2)' : 'var(--amber)',
              color: loading ? 'var(--text-muted)' : 'var(--btn-primary-text)',
              cursor: loading ? 'default' : 'pointer',
            }}
          >
            {loading ? 'Agamenón está escribiendo...' : 'Leer carta de la semana'}
          </button>
        </div>
      )}
    </div>
  );
}
