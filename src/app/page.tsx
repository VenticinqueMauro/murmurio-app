export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect('/dashboard');

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-4xl mx-auto">
        <span className="text-lg font-light tracking-wide">Murmurio</span>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/login"
            className="text-sm px-4 py-2 rounded-lg transition-all"
            style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}
          >
            Acceder
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-2xl mx-auto px-6 pt-16 pb-20 text-center space-y-6">
        <p className="text-xs font-medium tracking-widest uppercase" style={{ color: 'var(--amber)' }}>
          Escritura terapéutica
        </p>
        <h1 className="text-4xl font-light leading-tight" style={{ color: 'var(--text)' }}>
          Hay una parte de ti que ya sabe la respuesta.<br />
          Solo necesita que la dejes hablar.
        </h1>
        <p className="text-lg leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          Murmurio es una herramienta de escritura que usa presión temporal, análisis de pausas
          e inteligencia artificial para ayudarte a escuchar los murmullos de tu subconsciente.
        </p>
        <Link
          href="/login"
          className="inline-block px-8 py-3.5 rounded-lg font-medium transition-all text-base"
          style={{ background: 'var(--amber)', color: 'var(--btn-primary-text)' }}
        >
          Comenzar gratis
        </Link>
      </section>

      {/* Tito y Agamenón */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-xs font-medium tracking-widest uppercase text-center mb-10" style={{ color: 'var(--text-subtle)' }}>
          El problema
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <div
            className="p-6 rounded-lg space-y-3"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <p className="text-xs font-medium tracking-widest uppercase" style={{ color: 'var(--text-subtle)' }}>
              Tito — tu consciente
            </p>
            <p className="text-xl font-light" style={{ color: 'var(--text)' }}>El que cree que controla</p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Racionaliza, filtra, censura. Cuando intentas resolver algo, Tito interviene
              con lógica, con miedo al juicio, con autocorrección. Bloquea justo lo que
              necesitas escuchar.
            </p>
          </div>
          <div
            className="p-6 rounded-lg space-y-3"
            style={{ background: 'var(--surface)', border: '1px solid var(--amber-dim)' }}
          >
            <p className="text-xs font-medium tracking-widest uppercase" style={{ color: 'var(--amber)' }}>
              Agamenón — tu subconsciente
            </p>
            <p className="text-xl font-light" style={{ color: 'var(--text)' }}>El que ya lo sabe todo</p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Procesa todo lo que vivís, siente lo que tu cuerpo siente, conoce tus patrones
              reales. Pero no habla con palabras — habla con pausas, con bloqueos,
              con lo que evitás escribir.
            </p>
          </div>
        </div>
        <p className="text-center mt-8 text-sm" style={{ color: 'var(--text-subtle)' }}>
          Murmurio actúa como traductor entre los dos.
        </p>
      </section>

      {/* Cómo funciona */}
      <section className="max-w-2xl mx-auto px-6 py-16 space-y-10">
        <p className="text-xs font-medium tracking-widest uppercase text-center" style={{ color: 'var(--text-subtle)' }}>
          Cómo funciona
        </p>

        {[
          {
            n: '01',
            title: 'Escribís y Agamenón registra todo — incluso lo que borrás',
            desc: 'Un editor que difumina el texto si parás más de 3 segundos, para mantener el flujo. Podés borrar, pero Agamenón registra las pausas y las frases eliminadas: lo que censuraste también habla.',
          },
          {
            n: '02',
            title: 'El sistema mide tus pausas',
            desc: 'Mientras escribís, Murmurio analiza en segundo plano la velocidad de cada palabra. Donde tardás el doble del promedio, Agamenón está señalando algo.',
          },
          {
            n: '03',
            title: 'La IA devuelve lo que dijo Agamenón',
            desc: 'No consejos. No diagnósticos. Las 5 palabras más cargadas de tu texto, las contradicciones detectadas, y una micro-acción física para hoy.',
          },
        ].map((step) => (
          <div key={step.n} className="flex gap-6">
            <span
              className="text-3xl font-light shrink-0 leading-none mt-1"
              style={{ color: 'var(--amber-dim)' }}
            >
              {step.n}
            </span>
            <div className="space-y-1">
              <p className="font-medium" style={{ color: 'var(--text)' }}>{step.title}</p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* Quote */}
      <section
        className="mx-6 md:mx-auto max-w-2xl my-8 p-8 rounded-lg"
        style={{ background: 'var(--surface)', borderLeft: '3px solid var(--amber)' }}
      >
        <p className="text-base leading-relaxed italic" style={{ color: 'var(--text-muted)' }}>
          "El gigante es muy poderoso, pero necesita que le enseñes a hablar."
        </p>
        <p className="text-xs mt-3" style={{ color: 'var(--text-subtle)' }}>
          — Javier Botía
        </p>
      </section>

      {/* CTA final */}
      <section className="text-center px-6 py-20 space-y-4">
        <p className="text-2xl font-light" style={{ color: 'var(--text)' }}>
          ¿Qué está intentando decirte Agamenón hoy?
        </p>
        <Link
          href="/login"
          className="inline-block px-8 py-3.5 rounded-lg font-medium transition-all"
          style={{ background: 'var(--amber)', color: 'var(--btn-primary-text)' }}
        >
          Comenzar primera sesión
        </Link>
      </section>

      {/* Footer */}
      <footer className="text-center pb-10">
        <p className="text-xs" style={{ color: 'var(--text-subtle)' }}>
          Murmurio — El murmullo entre tu consciente y tu subconsciente
        </p>
      </footer>

    </div>
  );
}
