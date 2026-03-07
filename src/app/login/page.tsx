'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeftIcon } from '@/components/icons/ArrowLeftIcon';

type Mode = 'magic' | 'password' | 'register';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<Mode>('password');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const searchParams = useSearchParams();

  useEffect(() => {
    const urlError = searchParams.get('error_description');
    if (urlError) setError(decodeURIComponent(urlError.replace(/\+/g, ' ')));
  }, [searchParams]);

  const resetMessages = () => { setError(''); setSuccess(''); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    resetMessages();

    const supabase = createClient();

    if (mode === 'magic') {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) setError(error.message);
      else setSent(true);

    } else if (mode === 'password') {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) setError('Email o contraseña incorrectos.');

    } else if (mode === 'register') {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) setError(error.message);
      else setSuccess('Revisá tu correo para confirmar tu cuenta.');
    }

    setLoading(false);
  };

  const handleGoogle = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  if (sent) {
    return (
      <div
        className="p-5 rounded-lg text-center space-y-2"
        style={{ background: 'var(--surface-2)', border: '1px solid var(--amber-dim)' }}
      >
        <p style={{ color: 'var(--amber)' }}>Revisá tu correo</p>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Te enviamos un enlace de acceso a <strong>{email}</strong>
        </p>
        <button
          onClick={() => { setSent(false); setEmail(''); }}
          className="text-xs mt-2"
          style={{ color: 'var(--text-subtle)', cursor: 'pointer' }}
        >
          Usar otro método
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Google */}
      <button
        onClick={handleGoogle}
        className="w-full py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-3"
        style={{
          background: 'var(--surface)',
          color: 'var(--text)',
          border: '1px solid var(--border)',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border-hover)')}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
      >
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          <path fill="none" d="M0 0h48v48H0z"/>
        </svg>
        Continuar con Google
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
        <span className="text-xs" style={{ color: 'var(--text-subtle)' }}>o</span>
        <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
      </div>

      {/* Tabs de modo */}
      <div
        className="flex rounded-lg p-1 gap-1"
        style={{ background: 'var(--surface)' }}
      >
        {([
          { key: 'password', label: 'Ingresar' },
          { key: 'register', label: 'Crear cuenta' },
          { key: 'magic',    label: 'Sin contraseña' },
        ] as { key: Mode; label: string }[]).map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setMode(tab.key); resetMessages(); }}
            className="flex-1 py-1.5 rounded-md text-xs font-medium transition-all"
            style={{
              background: mode === tab.key ? 'var(--surface-2)' : 'transparent',
              color: mode === tab.key ? 'var(--text)' : 'var(--text-subtle)',
              cursor: 'pointer',
              border: mode === tab.key ? '1px solid var(--border)' : '1px solid transparent',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@correo.com"
          required
          className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all"
          style={{
            background: 'var(--surface)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--amber-dim)')}
          onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
        />

        {(mode === 'password' || mode === 'register') && (
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={mode === 'register' ? 'Elegí una contraseña' : 'Contraseña'}
            required
            minLength={6}
            className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all"
            style={{
              background: 'var(--surface)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--amber-dim)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg text-sm font-medium transition-all"
          style={{
            background: loading ? 'var(--surface-2)' : 'var(--amber)',
            color: loading ? 'var(--text-subtle)' : 'var(--btn-primary-text)',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Un momento...' : mode === 'password' ? 'Ingresar' : mode === 'register' ? 'Crear cuenta' : 'Enviar enlace'}
        </button>
      </form>

      {error && <p className="text-xs text-center" style={{ color: '#c15a28' }}>{error}</p>}
      {success && <p className="text-xs text-center" style={{ color: 'var(--amber)' }}>{success}</p>}
    </div>
  );
}

export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: 'var(--bg)' }}
    >
      <div className="w-full max-w-sm space-y-8">
        <Link href="/" className="back-link inline-flex items-center gap-1.5 text-sm transition-all">
          <ArrowLeftIcon size={16} />
          Volver
        </Link>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-light tracking-wide" style={{ color: 'var(--text)' }}>
            Murmurio
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            El murmullo entre tu consciente y tu subconsciente
          </p>
        </div>

        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
