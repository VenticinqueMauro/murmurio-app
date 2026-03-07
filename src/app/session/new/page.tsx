'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { WritingEditor } from '@/components/editor/WritingEditor';
import { MoodSlider } from '@/components/session/MoodSlider';
import { SessionResults } from '@/components/session/SessionResults';
import { createClient } from '@/lib/supabase/client';
import { getRandomPrompt } from '@/lib/prompts';
import type { Prompt } from '@/lib/prompts';
import type { LatencyEntry, Insights } from '@/lib/types';

type Step = 'mood_before' | 'writing' | 'analyzing' | 'results';

const CATEGORIES: { value: Prompt['category']; label: string }[] = [
  { value: 'general', label: 'General' },
  { value: 'ansiedad', label: 'Ansiedad' },
  { value: 'relaciones', label: 'Relaciones' },
  { value: 'trabajo', label: 'Trabajo' },
];

export default function NewSessionPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>('mood_before');
  const [selectedCategory, setSelectedCategory] = useState<Prompt['category']>('general');
  const [prompt, setPrompt] = useState<Prompt>(() => getRandomPrompt('general'));
  const [moodBefore, setMoodBefore] = useState(5);
  const [moodAfter, setMoodAfter] = useState(5);
  const [insights, setInsights] = useState<Insights | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleCategoryChange = (cat: Prompt['category']) => {
    setSelectedCategory(cat);
    setPrompt(getRandomPrompt(cat));
  };

  const handleNewPrompt = () => setPrompt(getRandomPrompt(selectedCategory));

  const handleStartWriting = () => {
    setStartTime(Date.now());
    setStep('writing');
  };

  const handleWritingComplete = useCallback(
    async (text: string, latencyData: LatencyEntry[]) => {
      setStep('analyzing');
      const duration = Math.round((Date.now() - startTime) / 1000);

      try {
        // 1. Crear sesión en Supabase
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { router.push('/login'); return; }

        const { data: session, error: sessionError } = await supabase
          .from('sessions')
          .insert({
            user_id: user.id,
            prompt: prompt.text,
            raw_text: text,
            duration_seconds: duration,
            mood_before: moodBefore,
          })
          .select()
          .single();

        if (sessionError) throw sessionError;
        setSessionId(session.id);

        // 2. Guardar datos de latencia
        if (latencyData.length > 0) {
          await supabase.from('latency_data').insert(
            latencyData.map((d) => ({
              session_id: session.id,
              word: d.word,
              position_in_text: d.position_in_text,
              latency_ms: d.latency_ms,
              is_hesitation: d.is_hesitation,
            }))
          );
        }

        // 3. Llamar a la API de análisis
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, latency_data: latencyData }),
        });

        if (!response.ok) throw new Error('El análisis falló');
        const analysisResult: Insights = await response.json();

        // 4. Guardar insights
        const { error: insightError } = await supabase.from('insights').insert({
          session_id: session.id,
          user_id: user.id,
          top_words: analysisResult.top_words,
          contradictions: analysisResult.contradictions,
          micro_action: analysisResult.micro_action,
          reflection_questions: analysisResult.reflection_questions,
        });

        if (insightError) console.error('Error guardando insights:', insightError);

        setInsights(analysisResult);
        setMoodAfter(moodBefore); // punto de partida del slider post
        setStep('results');
      } catch (err) {
        console.error(err);
        setError('Hubo un error al analizar tu sesión. Intenta de nuevo.');
        setStep('writing');
      }
    },
    [startTime, moodBefore, router]
  );

  const handleSaveSession = async () => {
    if (!sessionId || isSaving) return;
    setIsSaving(true);

    const supabase = createClient();
    await supabase
      .from('sessions')
      .update({ mood_after: moodAfter })
      .eq('id', sessionId);

    router.push('/dashboard');
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: 'var(--bg)', color: 'var(--text)' }}
    >
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Step: Mood Before */}
        {step === 'mood_before' && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-1">
              <p className="text-xs font-medium tracking-widest uppercase" style={{ color: 'var(--text-subtle)' }}>
                Antes de empezar
              </p>
              <h1 className="text-2xl font-light">¿Cómo llegas hoy?</h1>
            </div>

            <div
              className="p-6 rounded-lg"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <MoodSlider
                value={moodBefore}
                onChange={setMoodBefore}
                label="¿Cómo te sientes en este momento?"
              />
            </div>

            {/* Selector de categoría */}
            <div className="space-y-3">
              <p className="text-xs font-medium tracking-widest uppercase" style={{ color: 'var(--text-subtle)' }}>
                ¿Sobre qué quieres escribir?
              </p>
              <div className="flex gap-2 flex-wrap">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => handleCategoryChange(cat.value)}
                    className="px-4 py-1.5 rounded-full text-sm transition-all"
                    style={{
                      background: selectedCategory === cat.value ? 'var(--amber)' : 'var(--surface)',
                      color: selectedCategory === cat.value ? 'var(--btn-primary-text)' : 'var(--text-muted)',
                      border: `1px solid ${selectedCategory === cat.value ? 'var(--amber)' : 'var(--border)'}`,
                      cursor: 'pointer',
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt */}
            <div
              className="p-4 rounded-lg space-y-3"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium tracking-widest uppercase" style={{ color: 'var(--text-subtle)' }}>
                  Tu pregunta de hoy
                </p>
                <button
                  onClick={handleNewPrompt}
                  className="text-xs transition-all"
                  style={{ color: 'var(--text-subtle)', cursor: 'pointer' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--amber)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-subtle)')}
                >
                  otra pregunta
                </button>
              </div>
              <p className="leading-relaxed" style={{ color: 'var(--text)' }}>
                {prompt.text}
              </p>
            </div>

            <button
              onClick={handleStartWriting}
              className="w-full py-3 rounded-lg font-medium transition-all"
              style={{ background: 'var(--amber)', color: 'var(--btn-primary-text)', cursor: 'pointer' }}
            >
              Comenzar a escribir
            </button>
          </div>
        )}

        {/* Step: Writing */}
        {step === 'writing' && (
          <div className="animate-fade-in">
            <WritingEditor prompt={prompt.text} onComplete={handleWritingComplete} />
            {error && (
              <p className="mt-3 text-sm text-center" style={{ color: '#c15a28' }}>
                {error}
              </p>
            )}
          </div>
        )}

        {/* Step: Analyzing */}
        {step === 'analyzing' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-fade-in">
            <div
              className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: 'var(--amber)', borderTopColor: 'transparent' }}
            />
            <div className="text-center space-y-1">
              <p className="text-lg font-light" style={{ color: 'var(--text)' }}>
                Agamenón está hablando...
              </p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Analizando tu escritura y las pausas
              </p>
            </div>
          </div>
        )}

        {/* Step: Results */}
        {step === 'results' && insights && (
          <SessionResults
            insights={insights}
            moodBefore={moodBefore}
            moodAfter={moodAfter}
            onMoodAfterChange={setMoodAfter}
            onSave={handleSaveSession}
            isSaving={isSaving}
          />
        )}
      </div>
    </div>
  );
}
