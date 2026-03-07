interface Props {
  streakCount: number;
  totalSessions: number;
  hasSessionToday: boolean;
}

export function PuenteDeLosDias({ streakCount, totalSessions, hasSessionToday }: Props) {
  const effective = Math.min(streakCount, 21);
  const completed = streakCount >= 21;
  const hasBreak = totalSessions > streakCount && streakCount > 0;
  const daysLeft = Math.max(0, 21 - effective);

  const caption = completed
    ? 'El hábito ya es tuyo. El puente, también.'
    : hasBreak
    ? 'La grieta recuerda que el camino sigue.'
    : streakCount === 0
    ? 'Cada sesión añade un tablón al puente.'
    : `${daysLeft} día${daysLeft !== 1 ? 's' : ''} para completar el puente.`;

  return (
    <div
      className="p-5 rounded-lg space-y-4"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      <div className="flex items-center justify-between">
        <p
          className="text-xs font-medium tracking-widest uppercase"
          style={{ color: 'var(--text-subtle)' }}
        >
          El Puente de 21 días
        </p>
        <p
          className="text-sm font-light"
          style={{ color: completed ? 'var(--amber)' : 'var(--text-muted)' }}
        >
          {completed ? 'Completo' : `Día ${effective} de 21`}
        </p>
      </div>

      {/* Tablones */}
      <div className="flex gap-1">
        {Array.from({ length: 21 }).map((_, i) => {
          const filled = i < effective;
          const crack = hasBreak && i === effective && !completed;
          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: 14,
                borderRadius: 2,
                background: filled
                  ? 'var(--amber)'
                  : crack
                  ? 'var(--amber-dim)'
                  : 'var(--surface-2)',
                border: filled || crack ? 'none' : '1px solid var(--border)',
                backgroundImage: crack
                  ? 'repeating-linear-gradient(135deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 3px)'
                  : undefined,
              }}
            />
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs" style={{ color: 'var(--text-subtle)' }}>
          {caption}
        </p>
        {!hasSessionToday && streakCount > 0 && !completed && (
          <p className="text-xs" style={{ color: 'var(--amber-dim)' }}>
            Pendiente hoy
          </p>
        )}
      </div>
    </div>
  );
}
