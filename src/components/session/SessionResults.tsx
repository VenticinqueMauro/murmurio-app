'use client';

import type { Insights } from '@/lib/types';
import { MoodSlider } from './MoodSlider';

interface SessionResultsProps {
  insights: Insights;
  moodAfter: number;
  moodBefore: number;
  onMoodAfterChange: (v: number) => void;
  onSave: () => void;
  isSaving: boolean;
}

export function SessionResults({
  insights,
  moodAfter,
  moodBefore,
  onMoodAfterChange,
  onSave,
  isSaving,
}: SessionResultsProps) {
  const delta = moodAfter - moodBefore;
  const deltaLabel =
    delta > 0 ? `+${delta} puntos` : delta < 0 ? `${delta} puntos` : 'Sin cambio';
  const deltaColor = delta > 0 ? 'var(--amber)' : delta < 0 ? '#c15a28' : 'var(--text-muted)';

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Título */}
      <div className="text-center space-y-1">
        <p className="text-xs font-medium tracking-widest uppercase" style={{ color: 'var(--text-subtle)' }}>
          La Respuesta del Gigante
        </p>
        <h2 className="text-2xl font-light" style={{ color: 'var(--text)' }}>
          Esto dijo Agamenón
        </h2>
      </div>

      {/* Top 5 palabras */}
      <div>
        <p className="text-xs font-medium tracking-widest uppercase mb-3" style={{ color: 'var(--text-muted)' }}>
          Las 5 palabras más cargadas
        </p>
        <div className="flex flex-wrap gap-2">
          {insights.top_words.map((word, i) => (
            <span
              key={i}
              className="px-4 py-2 rounded-full text-sm font-medium"
              style={{
                background: `rgba(193, 125, 40, ${0.15 + i * 0.05})`,
                color: 'var(--amber-light)',
                border: '1px solid var(--amber-dim)',
                fontSize: `${1 + (4 - i) * 0.08}rem`,
              }}
            >
              {word}
            </span>
          ))}
        </div>
      </div>

      {/* Micro-acción */}
      <div
        className="p-5 rounded-lg"
        style={{ background: 'var(--surface-2)', borderLeft: '3px solid var(--amber)' }}
      >
        <p className="text-xs font-medium tracking-widest uppercase mb-2" style={{ color: 'var(--amber)' }}>
          Tu micro-acción de hoy
        </p>
        <p className="text-base leading-relaxed" style={{ color: 'var(--text)' }}>
          {insights.micro_action}
        </p>
      </div>

      {/* Contradicciones */}
      {insights.contradictions && insights.contradictions.length > 0 && (
        <div>
          <p className="text-xs font-medium tracking-widest uppercase mb-3" style={{ color: 'var(--text-muted)' }}>
            Lo que Agamenón notó
          </p>
          <ul className="space-y-2">
            {insights.contradictions.map((c, i) => (
              <li
                key={i}
                className="p-3 rounded-lg text-sm leading-relaxed"
                style={{ background: 'var(--surface)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
              >
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Preguntas espejo */}
      {insights.reflection_questions && insights.reflection_questions.length > 0 && (
        <div>
          <p className="text-xs font-medium tracking-widest uppercase mb-3" style={{ color: 'var(--text-muted)' }}>
            Preguntas espejo
          </p>
          <ul className="space-y-3">
            {insights.reflection_questions.map((q, i) => (
              <li key={i} className="text-base italic" style={{ color: 'var(--text)' }}>
                — {q}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Mood after */}
      <div
        className="p-5 rounded-lg"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <MoodSlider
          value={moodAfter}
          onChange={onMoodAfterChange}
          label="¿Cómo te sientes ahora?"
        />
        <div className="text-center mt-3 text-sm" style={{ color: deltaColor }}>
          Delta de estado de ánimo: {deltaLabel}
        </div>
      </div>

      {/* Guardar */}
      <button
        onClick={onSave}
        disabled={isSaving}
        className="w-full py-3 rounded-lg font-medium transition-all duration-200"
        style={{
          background: isSaving ? 'var(--surface-2)' : 'var(--amber)',
          color: isSaving ? 'var(--text-subtle)' : 'var(--btn-primary-text)',
          cursor: isSaving ? 'not-allowed' : 'pointer',
        }}
      >
        {isSaving ? 'Guardando...' : 'Guardar sesión'}
      </button>
    </div>
  );
}
