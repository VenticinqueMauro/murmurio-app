export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { LogoutButton } from '@/components/ui/LogoutButton';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import type { Session, Insights } from '@/lib/types';

interface SessionWithInsight extends Session {
  insights: Insights | null;
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Obtener sesiones con insights
  const { data: sessions } = await supabase
    .from('sessions')
    .select('*, insights(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20);

  const typedSessions = (sessions ?? []) as SessionWithInsight[];

  const avgDelta =
    typedSessions.length > 0
      ? typedSessions
          .filter((s) => s.mood_before !== null && s.mood_after !== null)
          .reduce((acc, s) => acc + ((s.mood_after ?? 0) - (s.mood_before ?? 0)), 0) /
        (typedSessions.filter((s) => s.mood_before !== null && s.mood_after !== null).length || 1)
      : 0;

  return (
    <div
      className="min-h-screen"
      style={{ background: 'var(--bg)', color: 'var(--text)' }}
    >
      <div className="max-w-2xl mx-auto px-4 py-12 space-y-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-light">Murmurio</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              {typedSessions.length} sesiones registradas
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LogoutButton />
            <Link
              href="/session/new"
              className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={{ background: 'var(--amber)', color: 'var(--btn-primary-text)' }}
            >
              Nueva sesión
            </Link>
          </div>
        </div>

        {/* Métricas */}
        {typedSessions.length > 0 && (
          <div
            className="grid grid-cols-2 gap-4 p-5 rounded-lg"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <div>
              <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-subtle)' }}>
                Delta promedio
              </p>
              <p
                className="text-2xl font-light"
                style={{ color: avgDelta >= 0 ? 'var(--amber)' : '#c15a28' }}
              >
                {avgDelta >= 0 ? '+' : ''}{avgDelta.toFixed(1)} pts
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-subtle)' }}>
                Total sesiones
              </p>
              <p className="text-2xl font-light" style={{ color: 'var(--text)' }}>
                {typedSessions.length}
              </p>
            </div>
          </div>
        )}

        {/* Lista de sesiones */}
        {typedSessions.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <p style={{ color: 'var(--text-muted)' }}>Aún no tienes sesiones.</p>
            <Link
              href="/session/new"
              className="inline-block px-6 py-3 rounded-lg text-sm font-medium"
              style={{ background: 'var(--amber)', color: 'var(--btn-primary-text)' }}
            >
              Comenzar primera sesión
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {typedSessions.map((session) => {
              const delta =
                session.mood_before !== null && session.mood_after !== null
                  ? session.mood_after - session.mood_before
                  : null;
              const date = new Date(session.created_at).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              });

              return (
                <Link
                  key={session.id}
                  href={`/session/${session.id}`}
                  className="session-card block p-4 rounded-lg space-y-2 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-sm leading-relaxed line-clamp-2" style={{ color: 'var(--text-muted)' }}>
                      {session.prompt}
                    </p>
                    {delta !== null && (
                      <span
                        className="text-sm font-medium shrink-0"
                        style={{ color: delta >= 0 ? 'var(--amber)' : '#c15a28' }}
                      >
                        {delta >= 0 ? '+' : ''}{delta} pts
                      </span>
                    )}
                  </div>

                  {session.insights?.top_words && session.insights.top_words.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {session.insights.top_words.slice(0, 5).map((w, i) => (
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
                    </div>
                  )}

                  <p className="text-xs" style={{ color: 'var(--text-subtle)' }}>
                    {date}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
