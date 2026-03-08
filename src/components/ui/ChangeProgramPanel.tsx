'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import ProgramSelector from './ProgramSelector';
import { PROGRAMS, type ProgramId } from '@/lib/programs';

interface ChangeProgramPanelProps {
  currentProgram: ProgramId;
  isFirstTime?: boolean;
}

export default function ChangeProgramPanel({
  currentProgram,
  isFirstTime = false,
}: ChangeProgramPanelProps) {
  const router = useRouter();
  const [open, setOpen] = useState(isFirstTime);
  const [selected, setSelected] = useState<ProgramId>(currentProgram);
  const [saving, setSaving] = useState(false);

  const handleSave = async (programId: ProgramId) => {
    setSelected(programId);
    setSaving(true);
    const supabase = createClient();
    await supabase.from('profiles').update({ program: programId }).eq('id', (await supabase.auth.getUser()).data.user!.id);
    setSaving(false);
    setOpen(false);
    router.refresh();
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          fontSize: '0.75rem',
          color: 'var(--text-subtle)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
        }}
      >
        Programa: {PROGRAMS[selected].label} · Cambiar
      </button>
    );
  }

  return (
    <div
      className="animate-fade-in"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '0.75rem',
        padding: '1.25rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}
      >
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          {isFirstTime ? 'Elegí tu programa para comenzar.' : 'Elegí un programa.'}
        </p>
        {!isFirstTime && (
          <button
            onClick={() => setOpen(false)}
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-subtle)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Cancelar
          </button>
        )}
      </div>
      <ProgramSelector
        currentProgram={selected}
        onSelect={handleSave}
        saving={saving}
      />
    </div>
  );
}
