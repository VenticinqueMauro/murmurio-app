interface WordEntry {
  word: string;
  count: number;
}

interface Props {
  vocabulary: WordEntry[];
}

export function VocabularioPersonal({ vocabulary }: Props) {
  if (vocabulary.length < 5) return null;

  const maxCount = vocabulary[0]?.count ?? 1;

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
          Vocabulario de Agamenón
        </p>
        <p className="text-xs" style={{ color: 'var(--text-subtle)' }}>
          {vocabulary.length} palabras
        </p>
      </div>

      <div className="flex flex-wrap gap-x-3 gap-y-2">
        {vocabulary.map(({ word, count }) => {
          const intensity = count / maxCount;
          const opacity = 0.25 + intensity * 0.75;
          const fontSize = 11 + Math.round(intensity * 6);
          return (
            <span
              key={word}
              title={`${count} ${count === 1 ? 'vez' : 'veces'}`}
              style={{
                color: 'var(--amber-light)',
                opacity,
                fontSize,
                lineHeight: 1.6,
              }}
            >
              {word}
            </span>
          );
        })}
      </div>

      <p className="text-xs" style={{ color: 'var(--text-subtle)' }}>
        Las palabras que más pesan en tu escritura, a lo largo del tiempo.
      </p>
    </div>
  );
}
