'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import type { LatencyEntry } from '@/lib/types';

interface WritingEditorProps {
  prompt: string;
  onComplete: (text: string, latencyData: LatencyEntry[]) => void;
}

const INACTIVITY_MS = 3000;
const MAX_BLUR_PX = 10;
const BLUR_STEP = 0.6;
const BLUR_INTERVAL_MS = 250;
const MIN_WORDS = 50;

export function WritingEditor({ prompt, onComplete }: WritingEditorProps) {
  const [text, setText] = useState('');
  const [blurPx, setBlurPx] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const latencyDataRef = useRef<LatencyEntry[]>([]);
  const lastKeystrokeRef = useRef<number>(0);
  const wordBufferRef = useRef<string>('');
  const wordStartTimeRef = useRef<number>(0);
  const wordPositionRef = useRef<number>(0);
  const allLatenciesRef = useRef<number[]>([]);
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const blurIntervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const elapsedIntervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  // Limpia timers al desmontar
  useEffect(() => {
    return () => {
      clearTimeout(inactivityTimerRef.current);
      clearInterval(blurIntervalRef.current);
      clearInterval(elapsedIntervalRef.current);
    };
  }, []);

  const resetInactivity = useCallback(() => {
    clearTimeout(inactivityTimerRef.current);
    clearInterval(blurIntervalRef.current);
    setBlurPx(0);

    inactivityTimerRef.current = setTimeout(() => {
      blurIntervalRef.current = setInterval(() => {
        setBlurPx((prev) => {
          const next = prev + BLUR_STEP;
          return next >= MAX_BLUR_PX ? MAX_BLUR_PX : next;
        });
      }, BLUR_INTERVAL_MS);
    }, INACTIVITY_MS);
  }, []);

  const recordWord = useCallback((word: string, endTime: number) => {
    if (!word.trim()) return;

    const wordLatency = endTime - wordStartTimeRef.current;
    const avgLatency =
      allLatenciesRef.current.length > 0
        ? allLatenciesRef.current.slice(-20).reduce((a, b) => a + b, 0) /
          Math.min(20, allLatenciesRef.current.length)
        : 300;

    const expectedForWord = avgLatency * word.length;
    const isHesitation = wordLatency > expectedForWord * 2.5;

    latencyDataRef.current.push({
      word,
      position_in_text: wordPositionRef.current,
      latency_ms: wordLatency,
      is_hesitation: isHesitation,
    });
    wordPositionRef.current++;
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Bloquear borrado y edición
      if (
        e.key === 'Backspace' ||
        e.key === 'Delete' ||
        ((e.ctrlKey || e.metaKey) &&
          ['z', 'Z', 'a', 'A', 'x', 'X'].includes(e.key))
      ) {
        e.preventDefault();
        return;
      }

      // Solo procesar teclas que generan texto
      const isPrintable = e.key.length === 1;
      const isEnter = e.key === 'Enter';
      if (!isPrintable && !isEnter) return;

      const now = Date.now();

      // Primera tecla — arrancar timer de elapsed
      if (!hasStarted) {
        setHasStarted(true);
        elapsedIntervalRef.current = setInterval(() => {
          setElapsed((s) => s + 1);
        }, 1000);
        lastKeystrokeRef.current = now;
        wordStartTimeRef.current = now;
        if (isPrintable && e.key !== ' ') wordBufferRef.current = e.key;
        resetInactivity();
        return;
      }

      const delta = now - lastKeystrokeRef.current;
      allLatenciesRef.current.push(delta);

      if (e.key === ' ' || isEnter) {
        recordWord(wordBufferRef.current, now);
        wordBufferRef.current = '';
        wordStartTimeRef.current = now;
      } else {
        if (wordBufferRef.current.length === 0) wordStartTimeRef.current = now;
        wordBufferRef.current += e.key;
      }

      lastKeystrokeRef.current = now;
      resetInactivity();
    },
    [hasStarted, resetInactivity, recordWord]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newVal = e.target.value;
      // Defensa extra: si el texto se acortó (paste, etc.) ignorar
      if (newVal.length < text.length) {
        if (textareaRef.current) textareaRef.current.value = text;
        return;
      }
      setText(newVal);
      // Mantener cursor al final
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = newVal.length;
          textareaRef.current.selectionEnd = newVal.length;
        }
      });
    },
    [text]
  );

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
  }, []);

  const handleSubmit = useCallback(() => {
    if (isSubmitting) return;
    // Guardar última palabra si queda en el buffer
    if (wordBufferRef.current.trim()) {
      recordWord(wordBufferRef.current, Date.now());
    }
    clearInterval(elapsedIntervalRef.current);
    clearTimeout(inactivityTimerRef.current);
    clearInterval(blurIntervalRef.current);
    setIsSubmitting(true);
    onComplete(text, latencyDataRef.current);
  }, [isSubmitting, text, onComplete, recordWord]);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const canSubmit = wordCount >= MIN_WORDS && !isSubmitting;

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Prompt */}
      <div
        className="p-4 rounded-lg border animate-fade-in"
        style={{ background: 'var(--surface-2)', borderColor: 'var(--amber-dim)' }}
      >
        <p className="text-xs font-medium tracking-widest uppercase mb-2" style={{ color: 'var(--amber)' }}>
          Tu pregunta
        </p>
        <p className="text-lg leading-relaxed" style={{ color: 'var(--text)' }}>
          {prompt}
        </p>
      </div>

      {/* Instrucción inicial */}
      {!hasStarted && (
        <p className="text-center text-sm animate-pulse-slow" style={{ color: 'var(--text-subtle)' }}>
          Empieza a escribir — no podrás borrar. Deja que fluya.
        </p>
      )}

      {/* Editor */}
      <div className="relative flex-1">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder="Escribe aquí..."
          disabled={isSubmitting}
          autoFocus
          className="w-full h-full min-h-[320px] p-5 rounded-lg resize-none outline-none text-base leading-relaxed transition-all duration-200"
          style={{
            background: 'var(--surface)',
            color: 'var(--text)',
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: hasStarted ? 'var(--border-hover)' : 'var(--border)',
            fontFamily: 'var(--font-geist-mono)',
            filter: blurPx > 0 ? `blur(${blurPx}px)` : 'none',
            caretColor: 'var(--amber)',
          }}
        />

        {/* Overlay de "sigue escribiendo" */}
        {blurPx >= 4 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-sm animate-pulse-slow" style={{ color: 'var(--text-muted)' }}>
              Sigue escribiendo...
            </p>
          </div>
        )}
      </div>

      {/* Footer: timer + palabras + botón */}
      <div className="flex items-center justify-between">
        <div className="flex gap-4 text-sm" style={{ color: 'var(--text-subtle)' }}>
          {hasStarted && <span>{formatTime(elapsed)}</span>}
          <span>
            {wordCount} / {MIN_WORDS} palabras
          </span>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200"
          style={{
            background: canSubmit ? 'var(--amber)' : 'var(--surface-2)',
            color: canSubmit ? 'var(--btn-primary-text)' : 'var(--text-subtle)',
            cursor: canSubmit ? 'pointer' : 'not-allowed',
          }}
        >
          {isSubmitting ? 'Analizando...' : 'Ver la Respuesta del Gigante'}
        </button>
      </div>
    </div>
  );
}
