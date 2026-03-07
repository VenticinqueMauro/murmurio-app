export const dynamic = 'force-dynamic';

import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ArrowLeftIcon } from '@/components/icons/ArrowLeftIcon';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function SessionDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: session } = await supabase
    .from('sessions')
    .select('*, insights(*)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!session) notFound();

  const insights = session.insights?.[0] ?? null;
  const delta =
    session.mood_before !== null && session.mood_after !== null
      ? session.mood_after - session.mood_before
      : null;

  const date = new Date(session.created_at).toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const duration = session.duration_seconds
    ? `${Math.floor(session.duration_seconds / 60)}m ${session.duration_seconds % 60}s`
    : null;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">

        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="back-link inline-flex items-center gap-1.5 text-sm transition-all"
          >
            <ArrowLeftIcon size={16} />
            Dashboard
          </Link>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-medium tracking-widest uppercase" style={{ color: 'var(--text-subtle)' }}>
            {date} {duration && `· ${duration}`}
          </p>
          <p className="text-lg leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {session.prompt}
          </p>
        </div>

        {/* Mood delta */}
        {delta !== null && (
          <div
            className="flex items-center gap-6 p-4 rounded-lg"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <div className="text-center">
              <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-subtle)' }}>
                Antes
              </p>
              <p className="text-2xl font-light" style={{ color: 'var(--text-muted)' }}>
                {session.mood_before}
              </p>
            </div>
            <div className="flex-1 text-center">
              <p
                className="text-2xl font-light"
                style={{ color: delta >= 0 ? 'var(--amber)' : '#c15a28' }}
              >
                {delta >= 0 ? '+' : ''}{delta} pts
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-subtle)' }}>
                Después
              </p>
              <p className="text-2xl font-light" style={{ color: 'var(--text)' }}>
                {session.mood_after}
              </p>
            </div>
          </div>
        )}

        {insights && (
          <>
            {/* Top words */}
            <div>
              <p className="text-xs font-medium tracking-widest uppercase mb-3" style={{ color: 'var(--text-muted)' }}>
                Las 5 palabras más cargadas
              </p>
              <div className="flex flex-wrap gap-2">
                {insights.top_words.map((word: string, i: number) => (
                  <span
                    key={i}
                    className="px-4 py-2 rounded-full text-sm font-medium"
                    style={{
                      background: `rgba(193, 125, 40, ${0.15 + i * 0.05})`,
                      color: 'var(--amber-light)',
                      border: '1px solid var(--amber-dim)',
                      fontSize: `${1 + (4 - i) * 0.07}rem`,
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
                Micro-acción
              </p>
              <p className="leading-relaxed" style={{ color: 'var(--text)' }}>
                {insights.micro_action}
              </p>
            </div>

            {/* Contradicciones */}
            {insights.contradictions?.length > 0 && (
              <div>
                <p className="text-xs font-medium tracking-widest uppercase mb-3" style={{ color: 'var(--text-muted)' }}>
                  Lo que Agamenón notó
                </p>
                <ul className="space-y-2">
                  {insights.contradictions.map((c: string, i: number) => (
                    <li
                      key={i}
                      className="p-3 rounded-lg text-sm leading-relaxed"
                      style={{
                        background: 'var(--surface)',
                        color: 'var(--text-muted)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Preguntas espejo */}
            {insights.reflection_questions?.length > 0 && (
              <div>
                <p className="text-xs font-medium tracking-widest uppercase mb-3" style={{ color: 'var(--text-muted)' }}>
                  Preguntas espejo
                </p>
                <ul className="space-y-3">
                  {insights.reflection_questions.map((q: string, i: number) => (
                    <li key={i} className="text-base italic" style={{ color: 'var(--text)' }}>
                      — {q}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        <div className="pt-4">
          <Link
            href="/session/new"
            className="inline-block px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
            style={{ background: 'var(--amber)', color: 'var(--btn-primary-text)' }}
          >
            Nueva sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
