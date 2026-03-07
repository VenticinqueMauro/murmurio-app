'use client';

import { useEffect, useState } from 'react';
import { SunIcon } from '@/components/icons/SunIcon';
import { MoonIcon } from '@/components/icons/MoonIcon';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const stored = localStorage.getItem('murmurio-theme');
    if (stored === 'light') setTheme('light');
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('murmurio-theme', next);
    if (next === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label="Cambiar tema"
      className="w-8 h-8 flex items-center justify-center rounded-lg transition-all"
      style={{
        color: 'var(--text-subtle)',
        border: '1px solid var(--border)',
        background: 'transparent',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border-hover)')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
    >
      {theme === 'dark' ? <SunIcon size={16} /> : <MoonIcon size={16} />}
    </button>
  );
}
