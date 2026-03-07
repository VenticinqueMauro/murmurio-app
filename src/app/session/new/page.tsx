'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WritingEditor } from '@/components/editor/WritingEditor';
import { MoodSlider } from '@/components/session/MoodSlider';
import { SessionResults } from '@/components/session/SessionResults';
import { createClient } from '@/lib/supabase/client';
import { getRandomPrompt, getDepthFromSessionCount, DEPTH_LABELS } from '@/lib/prompts';
import type { Prompt, PromptDepth } from '@/lib/prompts';
import type { LatencyEntry, Insights } from '@/lib/types';

type Step = 'loading' | 'pre_session' | 'mood_before' | 'writing' | 'analyzing' | 'results';
type FollowUp = 'si' | 'parcialmente' | 'no';

interface LastSession {
  id: string;
  micro_action_followup: string | null;
  insights: {
    micro_action: string | null;
    top_words: string[];
  } | null;
}

const CATEGORIES: { value: Prompt['category']; label: string }[] = [
  { value: 'general', label: 'General' },
  { value: 'ansiedad', label: 'Ansiedad' },
  { value: 'relaciones', label: 'Relaciones' },
  { value: 'trabajo', label: 'Trabajo' },
];

export default function NewSessionPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>('loading');
  const [lastSession, setLastSession] = useState<LastSession | null>(null);
  const [followUpAnswer, setFollowUpAnswer] = useState<FollowUp | null>(null);

  const [sessionCount, setSessionCount] = useState(0);
  const [vocabulary, setVocabulary] = useState<string[]>([]);
  const [activeGoal, setActiveGoal] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Prompt['category']>('general');
  const [prompt, setPrompt] = useState<Prompt>(() => getRandomPrompt('general', 'superficie'));
  const [moodBefore, setMoodBefore] = useState(5);
  const [moodAfter, setMoodAfter] = useState(5);
  const [insights, setInsights] = useState<Insights | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // Cargar última sesión al montar
  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const [{ data }, { count }, { data: insightsData }, { data: goalData }] = await Promise.all([
        supabase
          .from('sessions')
          .select('id, micro_action_followup, insights(micro_action, top_words)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from('sessions')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id),
        supabase
          .from('insights')
          .select('top_words')
          .eq('user_id', user.id)
          .limit(30),
        supabase
          .from('goals')
          .select('sensory_description')
          .eq('user_id', user.id)
          .eq('active', true)
          .limit(1)
          .maybeSingle(),
      ]);

      const total = count ?? 0;
      setSessionCount(total);
      setPrompt(getRandomPrompt('general', getDepthFromSessionCount(total)));

      // Construir vocabulario histórico (top 10 palabras más frecuentes)
      const wordFreq: Record<string, number> = {};
      for (const row of insightsData ?? []) {
        for (const w of (row.top_words as string[]) ?? []) {
          wordFreq[w] = (wordFreq[w] ?? 0) + 1;
        }
      }
      const vocab = Object.entries(wordFreq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([w]) => w);
      setVocabulary(vocab);

      if (goalData?.sensory_description) {
        setActiveGoal(goalData.sensory_description);
      }

      if (data) {
        // Supabase puede devolver insights como array o como objeto según la relación
        const raw = data.insights;
        const ins = Array.isArray(raw) ? (raw[0] ?? null) : raw;

        const session: LastSession = {
          id: data.id,
          micro_action_followup: data.micro_action_followup,
          insights: ins,
        };
        setLastSession(session);

        const hasMemory = ins?.top_words?.length > 0 || !!ins?.micro_action;
        setStep(hasMemory ? 'pre_session' : 'mood_before');
      } else {
        setStep('mood_before');
      }
    };

    init();
  }, [router]);

  // La micro-acción del paso pre_session requiere respuesta solo si no fue registrada ya
  const showMicroQuestion =
    !!lastSession?.insights?.micro_action && !lastSession?.micro_action_followup;

  const handlePreSessionContinue = async () => {
    if (followUpAnswer && lastSession?.id) {
      const supabase = createClient();
      // Fire and forget — guardamos el seguimiento en la sesión anterior
      supabase
        .from('sessions')
        .update({ micro_action_followup: followUpAnswer })
        .eq('id', lastSession.id);
    }
    setStep('mood_before');
  };

  const depth: PromptDepth = getDepthFromSessionCount(sessionCount);

  const handleCategoryChange = (cat: Prompt['category']) => {
    setSelectedCategory(cat);
    setPrompt(getRandomPrompt(cat, depth));
  };

  const handleNewPrompt = () => setPrompt(getRandomPrompt(selectedCategory, depth));

  const handleStartWriting = () => {
    setStartTime(Date.now());
    setStep('writing');
  };

  const handleWritingComplete = useCallback(
    async (text: string, latencyData: LatencyEntry[]) => {
      setStep('analyzing');
      const duration = Math.round((Date.now() - startTime) / 1000);

      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { router.push('/login'); return; }

        // 1. Crear sesión
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

        // 2. Guardar latencia
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

        // 3. Actualizar racha del usuario
        await supabase.rpc('update_streak', { p_user_id: user.id });

        // 4. Análisis con Claude
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
          text,
          latency_data: latencyData,
          user_vocabulary: vocabulary,
          active_goal: activeGoal,
        }),
        });

        if (!response.ok) throw new Error('El análisis falló');
        const analysisResult: Insights = await response.json();

        // 5. Guardar insights
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
        setMoodAfter(moodBefore);
        setStep('results');
      } catch (err) {
        console.error(err);
        setError('Hubo un error al analizar tu sesión. Intenta de nuevo.');
        setStep('writing');
      }
    },
    [startTime, moodBefore, prompt, router, vocabulary, activeGoal]
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
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <div className="max-w-2xl mx-auto px-4 py-12">

        {/* Loading inicial */}
        {step === 'loading' && (
          <div className="flex justify-center items-center min-h-[60vh]">
            <div
              className="w-8 h-8 rounded-full border-2 animate-spin"
              style={{ borderColor: 'var(--amber)', borderTopColor: 'transparent' }}
            />
          </div>
        )}

        {/* Pre-sesión: memoria + seguimiento */}
        {step === 'pre_session' && lastSession && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-1">
              <p
                className="text-xs font-medium tracking-widest uppercase"
                style={{ color: 'var(--text-subtle)' }}
              >
                Antes de continuar
              </p>
            </div>

            {/* Memoria: palabras de la sesión anterior */}
            {lastSession.insights?.top_words && lastSession.insights.top_words.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  La última vez, Agamenón señaló:
                </p>
                <div className="flex flex-wrap gap-2">
                  {lastSession.insights.top_words.map((word, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full text-sm"
                      style={{
                        background: 'rgba(193,125,40,0.12)',
                        color: 'var(--amber-light)',
                        border: '1px solid var(--amber-dim)',
                      }}
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Seguimiento de micro-acción */}
            {showMicroQuestion && lastSession.insights?.micro_action && (
              <div className="space-y-4">
                <div
                  className="p-4 rounded-lg"
                  style={{ background: 'var(--surface-2)', borderLeft: '3px solid var(--amber)' }}
                >
                  <p
                    className="text-xs font-medium tracking-widest uppercase mb-2"
                    style={{ color: 'var(--amber)' }}
                  >
                    Tu micro-acción era
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
                    {lastSession.insights.micro_action}
                  </p>
                </div>

                <p className="text-sm text-center" style={{ color: 'var(--text-muted)' }}>
                  ¿La hiciste?
                </p>

                <div className="flex gap-3">
                  {(['si', 'parcialmente', 'no'] as FollowUp[]).map((answer) => (
                    <button
                      key={answer}
                      onClick={() => setFollowUpAnswer(answer)}
                      className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all"
                      style={{
                        background:
                          followUpAnswer === answer ? 'var(--amber)' : 'var(--surface)',
                        color:
                          followUpAnswer === answer
                            ? 'var(--btn-primary-text)'
                            : 'var(--text-muted)',
                        border: `1px solid ${
                          followUpAnswer === answer ? 'var(--amber)' : 'var(--border)'
                        }`,
                        cursor: 'pointer',
                      }}
                    >
                      {answer === 'si' ? 'Sí' : answer === 'parcialmente' ? 'Parcialmente' : 'No'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handlePreSessionContinue}
              className="w-full py-3 rounded-lg font-medium transition-all"
              style={{
                background: 'var(--amber)',
                color: 'var(--btn-primary-text)',
                cursor: 'pointer',
              }}
            >
              Continuar
            </button>
          </div>
        )}

        {/* Mood antes */}
        {step === 'mood_before' && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-1">
              <p
                className="text-xs font-medium tracking-widest uppercase"
                style={{ color: 'var(--text-subtle)' }}
              >
                Antes de empezar
              </p>
              <h1 className="text-2xl font-light">¿Cómo llegás hoy?</h1>
            </div>

            <div
              className="p-6 rounded-lg"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <MoodSlider
                value={moodBefore}
                onChange={setMoodBefore}
                label="¿Cómo te sentís en este momento?"
              />
            </div>

            {/* Selector de categoría */}
            <div className="space-y-3">
              <p
                className="text-xs font-medium tracking-widest uppercase"
                style={{ color: 'var(--text-subtle)' }}
              >
                ¿Sobre qué querés escribir?
              </p>
              <div className="flex gap-2 flex-wrap">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => handleCategoryChange(cat.value)}
                    className="px-4 py-1.5 rounded-full text-sm transition-all"
                    style={{
                      background:
                        selectedCategory === cat.value ? 'var(--amber)' : 'var(--surface)',
                      color:
                        selectedCategory === cat.value
                          ? 'var(--btn-primary-text)'
                          : 'var(--text-muted)',
                      border: `1px solid ${
                        selectedCategory === cat.value ? 'var(--amber)' : 'var(--border)'
                      }`,
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
                <div className="flex items-center gap-2">
                  <p
                    className="text-xs font-medium tracking-widest uppercase"
                    style={{ color: 'var(--text-subtle)' }}
                  >
                    Tu pregunta de hoy
                  </p>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: 'rgba(193,125,40,0.10)',
                      color: 'var(--amber-dim)',
                    }}
                  >
                    {DEPTH_LABELS[depth]}
                  </span>
                </div>
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
              style={{
                background: 'var(--amber)',
                color: 'var(--btn-primary-text)',
                cursor: 'pointer',
              }}
            >
              Comenzar a escribir
            </button>
          </div>
        )}

        {/* Editor */}
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

        {/* Analizando */}
        {step === 'analyzing' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-fade-in">
            <div
              className="w-12 h-12 rounded-full border-2 animate-spin"
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

        {/* Resultados */}
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
