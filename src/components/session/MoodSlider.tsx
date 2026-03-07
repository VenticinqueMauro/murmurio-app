'use client';

interface MoodSliderProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
}

const MOOD_LABELS: Record<number, string> = {
  1: 'Muy ansioso',
  2: 'Ansioso',
  3: 'Algo ansioso',
  4: 'Inquieto',
  5: 'Neutral',
  6: 'Relativamente bien',
  7: 'Tranquilo',
  8: 'Bastante tranquilo',
  9: 'Sereno',
  10: 'Muy sereno',
};

export function MoodSlider({ value, onChange, label }: MoodSliderProps) {
  return (
    <div className="space-y-5">
      <p className="text-center text-lg" style={{ color: 'var(--text)' }}>
        {label}
      </p>

      <div className="px-2">
        <div className="flex justify-between text-xs mb-3" style={{ color: 'var(--text-subtle)' }}>
          <span>Ansioso</span>
          <span>Tranquilo</span>
        </div>

        <input
          type="range"
          min={1}
          max={10}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />

        <div className="text-center mt-4">
          <span className="text-2xl font-light" style={{ color: 'var(--amber)' }}>
            {MOOD_LABELS[value]}
          </span>
          <span className="text-sm ml-2" style={{ color: 'var(--text-subtle)' }}>
            {value}/10
          </span>
        </div>
      </div>
    </div>
  );
}
