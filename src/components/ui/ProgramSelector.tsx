'use client';

import { PROGRAM_LIST, type ProgramId } from '@/lib/programs';

interface ProgramSelectorProps {
  currentProgram: ProgramId;
  onSelect: (id: ProgramId) => void;
  saving?: boolean;
}

export default function ProgramSelector({
  currentProgram,
  onSelect,
  saving = false,
}: ProgramSelectorProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '0.75rem',
      }}
    >
      {PROGRAM_LIST.map((program) => {
        const isSelected = program.id === currentProgram;
        return (
          <button
            key={program.id}
            onClick={() => !saving && onSelect(program.id)}
            disabled={saving}
            className={`program-card${isSelected ? ' selected' : ''}`}
            style={{
              padding: '1rem',
              borderRadius: '0.75rem',
              textAlign: 'left',
              width: '100%',
              opacity: saving ? 0.6 : 1,
            }}
          >
            <div
              style={{
                fontSize: '0.875rem',
                fontWeight: 500,
                color: isSelected ? 'var(--amber)' : 'var(--text)',
                marginBottom: '0.25rem',
              }}
            >
              {program.label}
            </div>
            <div
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                lineHeight: 1.4,
              }}
            >
              {program.description}
            </div>
          </button>
        );
      })}
    </div>
  );
}
